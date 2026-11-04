"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";

import { requireRole } from "@/lib/auth/session";
import { contentTypeSchema } from "@/validation/content-types";
import { adminRecordId, guardAdminWrite, parseAdminFormInput } from "@/lib/data/actions/admin-input";
import {
  createContentType,
  deleteContentType,
  updateContentType,
} from "@/lib/data/dal/content-types";

const LIST_PATH = "/admin/content-types";

export async function createContentTypeAction(formData: FormData) {
  await requireRole(["admin", "super-admin"]);
  const parsed = parseAdminFormInput(contentTypeSchema, {
    name: formData.get("name"),
    description: formData.get("description"),
  }, LIST_PATH);
  await guardAdminWrite(LIST_PATH, "content type",
    () => createContentType(parsed));
  revalidatePath(LIST_PATH);
}

export async function updateContentTypeAction(formData: FormData) {
  await requireRole(["admin", "super-admin"]);
  const id = adminRecordId(formData, LIST_PATH);
  const backTo = `${LIST_PATH}/${id}`;
  const parsed = parseAdminFormInput(contentTypeSchema, {
    name: formData.get("name"),
    description: formData.get("description"),
  }, backTo);
  await guardAdminWrite(backTo, "content type",
    () => updateContentType(id, parsed));
  revalidatePath(LIST_PATH);
  revalidatePath(backTo);
  redirect(backTo);
}

export async function deleteContentTypeAction(formData: FormData) {
  await requireRole(["admin", "super-admin"]);
  const id = adminRecordId(formData, LIST_PATH);
  await guardAdminWrite(LIST_PATH, "content type",
    () => deleteContentType(id));
  revalidatePath(LIST_PATH);
}
