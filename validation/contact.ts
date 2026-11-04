import { z } from "zod";

export const contactSchema = z.object({
  name: z.string().trim().min(1).max(120),
  email: z.email().max(254).transform((value) => value.trim().toLowerCase()),
  message: z.string().trim().min(1).max(5000),
  contact_profile_website: z.string().max(200).optional().default(""),
});

export type ContactInput = z.infer<typeof contactSchema>;
