import { redirect } from "next/navigation";

import type { z } from "zod";

// Helpers for the admin CRUD server actions. They keep malformed form data and
// database failures from surfacing as raw framework errors: the admin is sent
// back to the page they came from with a friendly `?error=` message, which the
// list/detail pages render as an alert banner.

/** Builds a same-module URL carrying the failure message. */
export function adminErrorUrl(path: string, message: string) {
  return `${path}?error=${encodeURIComponent(message)}`;
}

/**
 * Validates admin form input. On failure the admin is redirected back with the
 * first validation message, so the action never throws an uncaught ZodError.
 */
export function parseAdminFormInput<T>(
  schema: z.ZodType<T>,
  value: Record<string, unknown>,
  backTo: string,
): T {
  const parsed = schema.safeParse(value);
  if (!parsed.success) {
    const message = parsed.error.issues[0]?.message ?? "That input could not be saved.";
    redirect(adminErrorUrl(backTo, message));
  }
  return parsed.data;
}

/** Reads a record id from admin form data; missing ids send the admin to `backTo`. */
export function adminRecordId(formData: FormData, backTo: string): string {
  const id = formData.get("id");
  if (typeof id !== "string" || id.trim() === "") {
    redirect(adminErrorUrl(backTo, "Unknown record. Refresh the page and try again."));
  }
  return id;
}

const UNIQUE_VIOLATION = "23505";

/**
 * Runs a database write and turns expected failures (unique violations) into a
 * friendly redirect. Unexpected failures still redirect, with a generic
 * message, so admins never hit a raw Postgres error page.
 */
export async function guardAdminWrite<T>(
  backTo: string,
  unitNoun: string,
  run: () => Promise<T>,
): Promise<T> {
  try {
    return await run();
  } catch (error) {
    const code = typeof error === "object" && error !== null && "code" in error
      ? String((error as { code: unknown }).code)
      : "";
    const message = code === UNIQUE_VIOLATION
      ? `That ${unitNoun} already exists. Choose a different name.`
      : `The ${unitNoun} could not be saved. Please try again in a moment.`;
    console.error("Admin write failed:", error);
    redirect(adminErrorUrl(backTo, message));
  }
}
