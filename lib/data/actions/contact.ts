"use server";

import { headers } from "next/headers";

import { createContactMessage } from "@/lib/data/dal/contact";
import { rateLimiter } from "@/lib/security/ratelimit";
import { contactSchema } from "@/validation/contact";

export type ContactState = { message: string; error: boolean; ok: boolean };

export async function sendContactMessage(
  _previous: ContactState,
  formData: FormData,
): Promise<ContactState> {
  const name = formData.get("name");
  const email = formData.get("email");
  const message = formData.get("message");
  const trap = formData.get("contact_profile_website");

  const parsed = contactSchema.safeParse({
    name: typeof name === "string" ? name : "",
    email: typeof email === "string" ? email : "",
    message: typeof message === "string" ? message : "",
    contact_profile_website: typeof trap === "string" ? trap : "",
  });
  if (!parsed.success) {
    return {
      message: "Add your name, a valid email address and a message.",
      error: true,
      ok: false,
    };
  }

  // Honeypot: answer like a success so scripted submissions learn nothing.
  if (parsed.data.contact_profile_website) {
    return { message: "Thanks for reaching out. We will reply by email soon.", error: false, ok: true };
  }

  const limit = await rateLimiter("contact", await headers());
  if (!limit.allowed) {
    return {
      message:
        limit.reason === "rate-limited"
          ? "Too many messages. Please try again later."
          : "Messages are unavailable right now. Please try again later.",
      error: true,
      ok: false,
    };
  }

  try {
    const { name: sender, email: address, message: body } = parsed.data;
    await createContactMessage({ name: sender, email: address, message: body });
    return { message: "Thanks for reaching out. We will reply by email soon.", error: false, ok: true };
  } catch (error) {
    console.error("Contact message failed", error);
    return {
      message: "Messages are unavailable right now. Please try again later.",
      error: true,
      ok: false,
    };
  }
}
