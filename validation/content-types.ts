import { z } from "zod";

export const contentTypeSchema = z.object({
  name: z.string().min(1, "Name is required").max(100),
  description: z.string().max(500).optional().or(z.literal("")),
});

export type ContentTypeInput = z.infer<typeof contentTypeSchema>;

export function parseContentTypeInput(value: Record<string, unknown>) {
  return contentTypeSchema.parse(value);
}
