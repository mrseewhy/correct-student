import { z } from "zod";

export const mediaTypeSchema = z.object({
  name: z.string().min(1, "Name is required").max(100),
  description: z.string().max(500).optional().or(z.literal("")),
});

export type MediaTypeInput = z.infer<typeof mediaTypeSchema>;
