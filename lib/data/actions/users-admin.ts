"use server";

import { redirect } from "next/navigation";
import { revalidatePath } from "next/cache";

import { auth } from "@/lib/auth";
import { headers } from "next/headers";
import { getSession, requireRole } from "@/lib/auth/session";
import { db } from "@/lib";
import { staffSchema } from "@/validation/staff";
import { userTable } from "@/lib/schema";
import { eq } from "drizzle-orm";
import { getUserById } from "@/lib/data/dal/users";
import { PLATFORM_TUTOR_ID, reassignTutorClasses } from "@/lib/data/dal/classes";
import { flashToast } from "@/lib/toast";

const LIST_STUDENTS = "/admin/students";
const LIST_TUTORS = "/admin/tutors";
const LIST_STAFF = "/admin/staff";

function backForRole(role: string) {
  if (role === "tutor") return LIST_TUTORS;
  if (role === "admin" || role === "super-admin") return LIST_STAFF;
  return LIST_STUDENTS;
}

async function getActor() {
  await requireRole(["admin", "super-admin"]);
  const session = await getSession();
  if (!session) redirect("/redirect");
  return session.user;
}

async function getAuthorizedTarget(actor: Awaited<ReturnType<typeof getActor>>, formData: FormData) {
  const id = String(formData.get("id") ?? "");
  const claimedRole = String(formData.get("targetRole") ?? "");
  const target = id ? await getUserById(id) : null;
  if (!target || (claimedRole && target.role !== claimedRole)) {
    await flashToast("error", "User not found or role changed.");
    redirect(backForRole(claimedRole));
  }
  if (target.id === PLATFORM_TUTOR_ID) {
    await flashToast("error", "The platform tutor cannot be managed.");
    redirect(backForRole(target.role));
  }
  if ((target.role === "admin" || target.role === "super-admin") && actor.role !== "super-admin") {
    await flashToast("error", "Only super-admins can manage administrators.");
    redirect(backForRole(target.role));
  }
  return target;
}

export async function updateUserAction(formData: FormData) {
  const actor = await getActor();
  const target = await getAuthorizedTarget(actor, formData);
  const id = target.id;
  const targetRole = target.role;
  const name = String(formData.get("name") ?? "").trim();
  const email = String(formData.get("email") ?? "").trim().toLowerCase();
  const username = String(formData.get("username") ?? "").trim().toLowerCase();
  const role = String(formData.get("role") ?? targetRole);
  const subscription = String(formData.get("subscription") ?? target.subscription);
  const backTo = `${backForRole(targetRole)}/${id}`;

  if (!id || !name || !email || !username) redirect(`${backTo}?error=${encodeURIComponent("Name, email and username are required.")}`);
  if (!["student", "tutor", "admin", "super-admin"].includes(role) ||
      !["free", "starter", "plus", "premium"].includes(subscription)) {
    redirect(`${backTo}?error=${encodeURIComponent("Invalid role or subscription.")}`);
  }
  if (actor.role !== "super-admin" && role !== targetRole) {
    redirect(`${backTo}?error=${encodeURIComponent("Only super-admins can change roles.")}`);
  }

  // Only learners carry a plan; for admin roles the subscription column is
  // left untouched instead of overwritten with a value the form never collects.
  const subscriptionField =
    targetRole === "student" || targetRole === "tutor" ? { subscription: subscription as "free" | "starter" | "plus" | "premium" } : {};

  try {
    await db.update(userTable).set({
      name,
      email,
      username,
      displayUsername: name.split(" ")[0],
      ...subscriptionField,
      updatedAt: new Date(),
    }).where(eq(userTable.id, id));

    // Role changes are a super-admin capability only.
    if (actor.role === "super-admin" && role !== targetRole) {
      const h = await headers();
      await auth.api.setRole({ headers: h, body: { userId: id, role: role as "student" | "tutor" | "admin" | "super-admin" } });
    }
  } catch (err) {
    console.error("updateUserAction failed", err);
    redirect(`${backTo}?error=${encodeURIComponent("Could not save the user. Check for duplicate email/username.")}`);
  }

  // Keep the success redirect outside the try block: next/navigation
  // signals redirects by throwing, so a redirect inside the try would be
  // caught by the catch-all and reported as a save failure.
  revalidatePath(backForRole(targetRole));
  revalidatePath(backTo);
  await flashToast("success", "User updated.");
  redirect(backTo);
}

export async function banUserAction(formData: FormData) {
  const actor = await getActor();
  const target = await getAuthorizedTarget(actor, formData);
  const id = target.id;
  const targetRole = target.role;

  // Prevent an administrator from banning their own account.
  if (actor.id === id) {
    const backTo = `${backForRole(targetRole)}/${id}`;
    redirect(`${backTo}?error=${encodeURIComponent("You cannot ban your own account.")}`);
  }

  const reason = String(formData.get("reason") ?? "").trim() || "Banned by administrator";
  const backTo = `${backForRole(targetRole)}/${id}`;
  const h = await headers();
  try {
    await auth.api.banUser({ headers: h, body: { userId: id, banReason: reason } });
    await flashToast("success", "User banned.");
  } catch (err) {
    console.error("banUserAction failed", err);
    await flashToast("error", "Could not ban the user.");
  }
  revalidatePath(backForRole(targetRole));
  revalidatePath(backTo);
}

export async function unbanUserAction(formData: FormData) {
  const target = await getAuthorizedTarget(await getActor(), formData);
  const id = target.id;
  const targetRole = target.role;
  const backTo = `${backForRole(targetRole)}/${id}`;
  const h = await headers();
  try {
    await auth.api.unbanUser({ headers: h, body: { userId: id } });
    await flashToast("success", "User unbanned.");
  } catch (err) {
    console.error("unbanUserAction failed", err);
    await flashToast("error", "Could not unban the user.");
  }
  revalidatePath(backForRole(targetRole));
  revalidatePath(backTo);
}

export async function setUserPasswordAction(formData: FormData) {
  const target = await getAuthorizedTarget(await getActor(), formData);
  const id = target.id;
  const targetRole = target.role;
  const newPassword = String(formData.get("newPassword") ?? "");
  const backTo = `${backForRole(targetRole)}/${id}`;
  if (newPassword.length < 8) redirect(`${backTo}?error=${encodeURIComponent("Password must be at least 8 characters.")}`);
  const h = await headers();
  try {
    await auth.api.setUserPassword({ headers: h, body: { userId: id, newPassword } });
  } catch (err) {
    console.error("setUserPasswordAction failed", err);
    redirect(`${backTo}?error=${encodeURIComponent("Could not update the password.")}`);
  }
  revalidatePath(backTo);
  await flashToast("success", "Password updated.");
  redirect(backTo);
}



export type CreateUserState = { message: string; error: boolean };

async function createManagedUser(targetRole: "student" | "tutor", previous: CreateUserState, formData: FormData): Promise<CreateUserState> {
  await getActor();

  const planRaw = String(formData.get("plan") ?? "free");
  const plan = ["free", "starter", "plus", "premium"].includes(planRaw) ? planRaw : "free";

  const parsed = staffSchema.safeParse({
    name: formData.get("name"),
    username: formData.get("username"),
    email: formData.get("email"),
    password: formData.get("password"),
  });
  if (!parsed.success) {
    return { message: parsed.error.issues[0]?.message ?? "Check the user details.", error: true };
  }

  try {
    const h = await headers();
    const created = await auth.api.createUser({
      body: {
        name: parsed.data.name,
        email: parsed.data.email,
        password: parsed.data.password,
        data: { username: parsed.data.username },
      },
      headers: h,
    });
    if (created?.user?.id) {
      await db.update(userTable).set({
        role: targetRole,
        subscription: plan as "free" | "starter" | "plus" | "premium",
        updatedAt: new Date(),
      }).where(eq(userTable.id, created.user.id));
    }
  } catch (error) {
    console.error("createManagedUser failed", error);
    return { message: "Could not create the user. Check for duplicate email/username.", error: true };
  }

  revalidatePath(`/admin/${targetRole === "student" ? "students" : "tutors"}`);
  await flashToast("success", `${targetRole === "student" ? "Student" : "Tutor"} created.`);
  redirect(`/admin/${targetRole === "student" ? "students" : "tutors"}`);
}

export async function createStudentAction(previous: CreateUserState, formData: FormData): Promise<CreateUserState> {
  return createManagedUser("student", previous, formData);
}

export async function createTutorAction(previous: CreateUserState, formData: FormData): Promise<CreateUserState> {
  return createManagedUser("tutor", previous, formData);
}

export async function deleteUserAction(formData: FormData) {
  const actor = await getActor();
  // Only super-admins can delete.
  if (actor.role !== "super-admin") redirect(`${backForRole(String(formData.get("targetRole") ?? "student"))}/${formData.get("id")}?error=${encodeURIComponent("Only super-admins can delete users.")}`);
  const target = await getAuthorizedTarget(actor, formData);
  const id = target.id;
  const targetRole = target.role;
  const backTo = `${backForRole(targetRole)}/${id}`;
  if (actor.id === id) redirect(`${backTo}?error=${encodeURIComponent("You cannot delete your own account.")}`);
  const h = await headers();
  try {
    if (targetRole === "tutor") await reassignTutorClasses(id);
    else await auth.api.removeUser({ headers: h, body: { userId: id } });
  } catch (err) {
    console.error("deleteUserAction failed", err);
    redirect(`${backTo}?error=${encodeURIComponent("Could not delete the user.")}`);
  }
  revalidatePath(backForRole(targetRole));
  await flashToast("success", "User deleted.");
  redirect(backForRole(targetRole));
}
