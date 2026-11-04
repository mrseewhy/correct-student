import { z } from "zod";

export const contactFilterSchema = z.object({
  count: z.coerce.number().int().refine((value) => [10, 20, 50, 100].includes(value)).catch(10),
  status: z.enum(["all", "unread", "read"]).catch("all"),
});
export type ContactFilter = z.infer<typeof contactFilterSchema>;

export function parseContactFilters(value: Record<string, string | string[] | undefined>): ContactFilter {
  return contactFilterSchema.parse({ count: value.count, status: value.status });
}

export const contactReadSchema = z.object({
  id: z.coerce.number().int().positive(),
  read: z.enum(["true", "false"]).transform((value) => value === "true"),
});
