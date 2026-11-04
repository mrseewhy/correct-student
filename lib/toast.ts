import "server-only";

import { randomUUID } from "node:crypto";
import { cookies } from "next/headers";

export const TOAST_COOKIE = "cs-action-toast";

export type ToastPayload = {
  id: string;
  kind: "success" | "error";
  message: string;
};

export async function flashToast(kind: ToastPayload["kind"], message: string) {
  (await cookies()).set(TOAST_COOKIE, JSON.stringify({ id: randomUUID(), kind, message }), {
    path: "/",
    maxAge: 30,
    sameSite: "lax",
    secure: process.env.NODE_ENV === "production",
  });
}

export async function readToast(): Promise<ToastPayload | null> {
  const raw = (await cookies()).get(TOAST_COOKIE)?.value;
  if (!raw) return null;
  try {
    const value: unknown = JSON.parse(raw);
    if (value && typeof value === "object" && "id" in value && "kind" in value && "message" in value &&
      typeof value.id === "string" && (value.kind === "success" || value.kind === "error") && typeof value.message === "string") {
      return value as ToastPayload;
    }
  } catch { /* Ignore malformed cookies. */ }
  return null;
}
