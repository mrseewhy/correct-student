"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { requireRole } from "@/lib/auth/session";
import { canAccessClass, getClass, markClassStarted, markClassCompleted } from "@/lib/data/dal/classes";

async function eligible(form: FormData) {
  const { user } = await requireRole(["student"]);
  const id = String(form.get("classId") ?? "");
  const item = await getClass(id);
  if (!item || !(await canAccessClass(id, user.subscription))) redirect("/students/classes");
  return { user, item };
}
export async function startClassAction(form: FormData) {
  const { user, item } = await eligible(form);
  await markClassStarted(user.id, item.id);
  revalidatePath(`/students/classes/${item.slug}`);
  redirect(`/students/classes/${item.slug}`);
}
export async function completeClassAction(form: FormData) {
  const { user, item } = await eligible(form);
  if (!item.materials.length) redirect(`/students/classes/${item.slug}`);
  if (!(await markClassCompleted(user.id, item.id))) redirect(`/students/classes/${item.slug}`);
  revalidatePath(`/students/classes/${item.slug}`);
  redirect(`/students/classes/${item.slug}`);
}
