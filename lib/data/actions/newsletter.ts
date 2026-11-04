"use server";

import { headers } from "next/headers";

import { subscribeNewsletter } from "@/lib/data/dal/newsletter";
import { rateLimiter } from "@/lib/security/ratelimit";
import { newsletterSchema } from "@/validation/newsletter";

export type NewsletterState = { message: string; error: boolean; ok: boolean };

export async function subscribeToNewsletter(
  _previous: NewsletterState,
  formData: FormData,
): Promise<NewsletterState> {
  const email = formData.get("email");
  const trap = formData.get("newsletter_profile_website");

  const parsed = newsletterSchema.safeParse({
    email: typeof email === "string" ? email : "",
    newsletter_profile_website: typeof trap === "string" ? trap : "",
  });
  if (!parsed.success) {
    return { message: "Enter a valid email address.", error: true, ok: false };
  }

  // Honeypot: answer like a success so scripted submissions learn nothing.
  if (parsed.data.newsletter_profile_website) {
    return { message: "Thanks for subscribing.", error: false, ok: true };
  }

  const limit = await rateLimiter("newsletter", await headers());
  if (!limit.allowed) {
    return {
      message:
        limit.reason === "rate-limited"
          ? "Too many attempts. Please try again later."
          : "Subscription is unavailable right now. Please try again later.",
      error: true,
      ok: false,
    };
  }

  try {
    await subscribeNewsletter(parsed.data.email);
    return { message: "Thanks for subscribing.", error: false, ok: true };
  } catch (error) {
    console.error("Newsletter subscription failed", error);
    return {
      message: "Subscription is unavailable right now. Please try again later.",
      error: true,
      ok: false,
    };
  }
}
