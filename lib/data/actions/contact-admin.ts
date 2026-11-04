"use server";

import { revalidatePath } from "next/cache";

import { setContactMessageRead } from "@/lib/data/dal/contact";
import { requireRole } from "@/lib/auth/session";
import { contactReadSchema } from "@/validation/contact-admin";

export async function markContactMessage(formData: FormData) {
  await requireRole(["admin", "super-admin"]);
  const parsed = contactReadSchema.safeParse({
    id: formData.get("id"),
    read: formData.get("read"),
  });
  if (!parsed.success) return;

  await setContactMessageRead(parsed.data.id, parsed.data.read);
  revalidatePath("/admin/contact");
  revalidatePath("/admin/dashboard");
}

