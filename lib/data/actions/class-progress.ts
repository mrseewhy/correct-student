"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { requireRole } from "@/lib/auth/session";
import { canAccessClass, getClass, markClassStarted, markClassCompleted } from "@/lib/data/dal/classes";
import { hasCompletableContent } from "@/lib/class-completion";
import { flashToast } from "@/lib/toast";

async function eligible(form: FormData) {
  const { user } = await requireRole(["student"]);
  const id = String(form.get("classId") ?? "");
  const item = await getClass(id);
  if (!item || !(await canAccessClass(id, user.subscription))) {
    await flashToast("error", "This class is unavailable on your current plan.");
    redirect("/students/classes");
  }
  return { user, item };
}
export async function startClassAction(form: FormData) {
  const { user, item } = await eligible(form);
  await markClassStarted(user.id, item.id);
  await flashToast("success", "Class started.");
  revalidatePath(`/students/classes/${item.slug}`);
  redirect(`/students/classes/${item.slug}`);
}
export async function completeClassAction(form: FormData) {
  const { user, item } = await eligible(form);
  if (!hasCompletableContent(item)) {
    await flashToast("error", "This class does not have its lesson material yet.");
    redirect(`/students/classes/${item.slug}`);
  }
  if (!(await markClassCompleted(user.id, item.id))) {
    await flashToast("error", "Start this class before marking it complete.");
    redirect(`/students/classes/${item.slug}`);
  }
  await flashToast("success", "Class completed.");
  revalidatePath(`/students/classes/${item.slug}`);
  redirect(`/students/classes/${item.slug}`);
}
