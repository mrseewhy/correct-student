"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";

import { requireRole } from "@/lib/auth/session";
import { levelSchema } from "@/validation/levels";
import { adminRecordId, guardAdminWrite, parseAdminFormInput } from "@/lib/data/actions/admin-input";
import { createLevel, deleteLevel, updateLevel } from "@/lib/data/dal/levels";

const LIST_PATH = "/admin/levels";

export async function createLevelAction(formData: FormData) {
  await requireRole(["admin", "super-admin"]);
  const parsed = parseAdminFormInput(levelSchema, {
    name: formData.get("name"),
    description: formData.get("description"),
  }, LIST_PATH);
  await guardAdminWrite(LIST_PATH, "level", () => createLevel(parsed));
  revalidatePath(LIST_PATH);
}

export async function updateLevelAction(formData: FormData) {
  await requireRole(["admin", "super-admin"]);
  const id = adminRecordId(formData, LIST_PATH);
  const backTo = `${LIST_PATH}/${id}`;
  const parsed = parseAdminFormInput(levelSchema, {
    name: formData.get("name"),
    description: formData.get("description"),
  }, backTo);
  await guardAdminWrite(backTo, "level", () => updateLevel(id, parsed));
  revalidatePath(LIST_PATH);
  revalidatePath(backTo);
  redirect(backTo);
}

export async function deleteLevelAction(formData: FormData) {
  await requireRole(["admin", "super-admin"]);
  const id = adminRecordId(formData, LIST_PATH);
  await guardAdminWrite(LIST_PATH, "level", () => deleteLevel(id));
  revalidatePath(LIST_PATH);
}
