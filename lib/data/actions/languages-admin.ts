"use server";

import { revalidatePath } from "next/cache";

import { requireRole } from "@/lib/auth/session";
import { languageSchema } from "@/validation/languages";
import { adminRecordId, guardAdminWrite, parseAdminFormInput } from "@/lib/data/actions/admin-input";
import {
  createLanguage,
  deleteLanguage,
  updateLanguage,
} from "@/lib/data/dal/languages";

const LIST_PATH = "/admin/languages";

export async function createLanguageAction(formData: FormData) {
  await requireRole(["admin", "super-admin"]);
  const parsed = parseAdminFormInput(languageSchema, {
    name: formData.get("name"),
    code: formData.get("code"),
    is_active: formData.get("is_active") === "on",
  }, LIST_PATH);
  await guardAdminWrite(LIST_PATH, "language", () => createLanguage(parsed), "Language created.");
  revalidatePath(LIST_PATH);
}

export async function updateLanguageAction(formData: FormData) {
  await requireRole(["admin", "super-admin"]);
  const id = adminRecordId(formData, LIST_PATH);
  // Missing/id-mismatched ids fall back to the list page; parse failures return here.
  const parsed = parseAdminFormInput(languageSchema, {
    name: formData.get("name"),
    code: formData.get("code"),
    is_active: formData.get("is_active") === "on",
  }, `${LIST_PATH}/${id}`);
  await guardAdminWrite(`${LIST_PATH}/${id}`, "language", () => updateLanguage(id, parsed), "Language updated.");
  revalidatePath(LIST_PATH);
  revalidatePath(`${LIST_PATH}/${id}`);
}

export async function deleteLanguageAction(formData: FormData) {
  await requireRole(["admin", "super-admin"]);
  const id = adminRecordId(formData, LIST_PATH);
  await guardAdminWrite(LIST_PATH, "language", () => deleteLanguage(id), "Language deleted.");
  revalidatePath(LIST_PATH);
}
