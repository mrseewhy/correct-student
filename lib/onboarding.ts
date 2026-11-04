import { selfServiceRoles, type UserRole } from "@/lib/auth/permissions";

export const languageOptions = [
  { id: "yoruba", label: "Yoruba" },
  { id: "igbo", label: "Igbo" },
  { id: "hausa", label: "Hausa" },
  { id: "fulani", label: "Fulani" },
] as const;

export type LanguageId = (typeof languageOptions)[number]["id"];

export function isRole(value: unknown): value is UserRole {
  return typeof value === "string" && (selfServiceRoles as readonly string[]).includes(value);
}

/** Reads ?language=a&language=b from the URL and keeps only valid ids. */
export function parseLanguages(
  value: string | string[] | undefined,
): LanguageId[] {
  const raw = Array.isArray(value) ? value : value ? [value] : [];
  const valid: string[] = languageOptions.map((l) => l.id);
  const cleaned = raw
    .map((item) => item.trim().toLowerCase())
    .filter((item): item is LanguageId => valid.includes(item));
  return Array.from(new Set(cleaned));
}
