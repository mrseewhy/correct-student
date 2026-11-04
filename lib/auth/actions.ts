"use server";

import { headers } from "next/headers";
import { redirect } from "next/navigation";
import { revalidatePath } from "next/cache";

import { auth } from "@/lib/auth";
import { requireRole } from "@/lib/auth/session";
import { getUserById } from "@/lib/data/dal/users";
import { flashToast } from "@/lib/toast";
import { staffSchema, staffRoleSchema } from "@/validation/staff";

export type StaffState = { message: string; error: boolean };

/** Clears the better-auth session cookie, then walks the user to home. */
export async function signOutAction() {
  try { await auth.api.signOut({ headers: await headers() }); }
  catch { await flashToast("error", "Could not sign out. Try again."); return; }
  await flashToast("success", "Signed out.");
  redirect("/");
}

function errorState(error: unknown): StaffState {
  const message =
    error instanceof Error
      ? error.message.replace(/^(?:Failed to|Error:)\s*/i, "")
      : "Something went wrong. Try again.";
  return { message, error: true };
}

/** Super-admin only: create a new administrator account. */
export async function createStaffAdminAction(_previous: StaffState, formData: FormData): Promise<StaffState> {
  const session = await requireRole(["admin", "super-admin"]);
  if (session.user.role !== "super-admin") {
    return { message: "Only super admins can create administrators.", error: true };
  }

  try {
    const role = String(formData.get("role") ?? "admin");
    if (role !== "admin" && role !== "super-admin") {
      return { message: "Choose a valid administrator role.", error: true };
    }

    const parsed = staffSchema.safeParse({
      name: formData.get("name"),
      username: formData.get("username"),
      email: formData.get("email"),
      password: formData.get("password"),
    });
    if (!parsed.success) {
      return { message: parsed.error.issues[0]?.message ?? "Check the staff details.", error: true };
    }

    await auth.api.createUser({
      body: {
        name: parsed.data.name,
        email: parsed.data.email,
        password: parsed.data.password,
        role,
        data: {
          username: parsed.data.username,
        },
      },
      headers: await headers(),
    });

    revalidatePath("/admin/staff");
    return { message: "Administrator added.", error: false };
  } catch (error) {
    return errorState(error);
  }
}

/** Super-admin only: promote / demote an account between admin and student. */
export async function setStaffRoleAction(_previous: StaffState, formData: FormData): Promise<StaffState> {
  const session = await requireRole(["admin", "super-admin"]);
  if (session.user.role !== "super-admin") {
    return { message: "Only super admins can change roles.", error: true };
  }

  try {
    const parsed = staffRoleSchema.safeParse({
      userId: formData.get("userId"),
      role: formData.get("role"),
    });
    if (!parsed.success) {
      return { message: "Unknown role change.", error: true };
    }

    await auth.api.setRole({
      body: { userId: parsed.data.userId, role: parsed.data.role },
      headers: await headers(),
    });

    revalidatePath("/admin/staff");
    return { message: "Role updated.", error: false };
  } catch (error) {
    return errorState(error);
  }
}

/** Admin or super-admin: ban or unban an account. */
export async function banStaffMemberAction(_previous: StaffState, formData: FormData): Promise<StaffState> {
  const { user: actor } = await requireRole(["super-admin"]);

  try {
    const userId = formData.get("userId");
    const ban = formData.get("ban");
    if (typeof userId !== "string" || userId === "" || (ban !== "true" && ban !== "false")) {
      return { message: "Unknown staff action.", error: true };
    }
    const target = await getUserById(userId);
    if (!target || (target.role !== "admin" && target.role !== "super-admin")) {
      return { message: "Administrator not found.", error: true };
    }
    if (actor.id === userId && ban === "true") {
      return { message: "You cannot ban your own account.", error: true };
    }

    if (ban === "true") {
      await auth.api.banUser({ body: { userId }, headers: await headers() });
    } else {
      await auth.api.unbanUser({ body: { userId }, headers: await headers() });
    }

    revalidatePath("/admin/staff");
    return { message: ban === "true" ? "Account banned." : "Account unbanned.", error: false };
  } catch (error) {
    return errorState(error);
  }
}
