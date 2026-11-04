"use server";

import { revalidatePath } from "next/cache";

import { setContactMessageRead } from "@/lib/data/dal/contact";
import { requireRole } from "@/lib/auth/session";
import { contactReadSchema } from "@/validation/contact-admin";
import { flashToast } from "@/lib/toast";

export async function markContactMessage(formData: FormData) {
  await requireRole(["admin", "super-admin"]);
  const parsed = contactReadSchema.safeParse({
    id: formData.get("id"),
    read: formData.get("read"),
  });
  if (!parsed.success) {
    await flashToast("error", "Could not update the message. Refresh and try again.");
    return;
  }

  try {
    await setContactMessageRead(parsed.data.id, parsed.data.read);
    await flashToast("success", parsed.data.read ? "Message marked as read." : "Message marked as unread.");
  } catch {
    await flashToast("error", "Could not update the message.");
    return;
  }
  revalidatePath("/admin/contact");
  revalidatePath("/admin/dashboard");
}

