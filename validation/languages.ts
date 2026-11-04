import { z } from "zod";

export const languageSchema = z.object({
  name: z.string().trim().min(1, "Name is required").max(100),
  code: z
    .string()
    .trim()
    .min(1, "Code is required")
    .max(20)
    .regex(/^[a-z]+$/, "Use lowercase letters only (e.g. yoruba)."),
  is_active: z.boolean().optional().default(true),
});

export type LanguageInput = z.infer<typeof languageSchema>;
