import { z } from "zod";

export const newsletterSchema = z.object({
  email: z.email().max(254).transform((value) => value.trim().toLowerCase()),
  newsletter_profile_website: z.string().max(200).optional().default(""),
});

export type NewsletterInput = z.infer<typeof newsletterSchema>;
