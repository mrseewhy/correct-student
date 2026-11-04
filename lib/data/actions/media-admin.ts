"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";

import { requireRole } from "@/lib/auth/session";
import { mediaTypeSchema } from "@/validation/media-types";
import { adminRecordId, guardAdminWrite, parseAdminFormInput } from "@/lib/data/actions/admin-input";
import {
  createMediaType,
  deleteMediaType,
  updateMediaType,
} from "@/lib/data/dal/media-types";

const LIST_PATH = "/admin/media-types";

export async function createMediaTypeAction(formData: FormData) {
  await requireRole(["admin", "super-admin"]);
  const parsed = parseAdminFormInput(mediaTypeSchema, {
    name: formData.get("name"),
    description: formData.get("description"),
  }, LIST_PATH);
  await guardAdminWrite(LIST_PATH, "media type", () => createMediaType(parsed));
  revalidatePath(LIST_PATH);
}

export async function updateMediaTypeAction(formData: FormData) {
  await requireRole(["admin", "super-admin"]);
  const id = adminRecordId(formData, LIST_PATH);
  const backTo = `${LIST_PATH}/${id}`;
  const parsed = parseAdminFormInput(mediaTypeSchema, {
    name: formData.get("name"),
    description: formData.get("description"),
  }, backTo);
  await guardAdminWrite(backTo, "media type", () => updateMediaType(id, parsed));
  revalidatePath(LIST_PATH);
  revalidatePath(backTo);
  redirect(backTo);
}

export async function deleteMediaTypeAction(formData: FormData) {
  await requireRole(["admin", "super-admin"]);
  const id = adminRecordId(formData, LIST_PATH);
  await guardAdminWrite(LIST_PATH, "media type", () => deleteMediaType(id));
  revalidatePath(LIST_PATH);
}
