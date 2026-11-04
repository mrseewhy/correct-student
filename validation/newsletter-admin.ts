import { z } from "zod";

export const newsletterFilterSchema = z.object({
  count: z.coerce.number().int().refine((value) => [10, 20, 50, 100].includes(value)).catch(10),
  from: z.string().max(10).optional(),
  to: z.string().max(10).optional(),
});
export type NewsletterFilter = z.infer<typeof newsletterFilterSchema>;

export function parseNewsletterFilters(value: Record<string, string | string[] | undefined>): NewsletterFilter {
  const input = newsletterFilterSchema.parse({ count: value.count, from: value.from, to: value.to });
  return input;
}

export function newsletterDateRange(filter: NewsletterFilter) {
  if (!filter.from && !filter.to) return null;
  const start = filter.from ? new Date(filter.from + "T00:00:00Z") : null;
  const end = filter.to ? new Date(filter.to + "T00:00:00Z") : null;
  if (end) end.setUTCDate(end.getUTCDate() + 1); // make end exclusive (include the full "to" day)
  return { start, end };
}
