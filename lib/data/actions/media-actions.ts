"use server";

import { revalidatePath } from "next/cache";

import { requireRole } from "@/lib/auth/session";
import { mediaSchema } from "@/validation/media";
import { adminRecordId, guardAdminWrite, parseAdminFormInput } from "@/lib/data/actions/admin-input";
import { createMediaItem, deleteMediaItem } from "@/lib/data/dal/media";

export async function createMediaAction(formData: FormData) {
  await requireRole(["admin", "super-admin"]);
  const parsed = parseAdminFormInput(mediaSchema, {
    filename: formData.get("filename"),
    url: formData.get("url"),
    mediaType: formData.get("mediaType"),
  }, "/admin/media");
  await guardAdminWrite("/admin/media", "media item", () => createMediaItem(parsed));
  revalidatePath("/admin/media");
}

export async function deleteMediaAction(formData: FormData) {
  await requireRole(["admin", "super-admin"]);
  const id = adminRecordId(formData, "/admin/media");
  await guardAdminWrite("/admin/media", "media item", () => deleteMediaItem(id));
  revalidatePath("/admin/media");
}
