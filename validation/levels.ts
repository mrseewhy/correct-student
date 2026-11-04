import { z } from "zod";

export const levelSchema = z.object({
  name: z.string().min(1, "Name is required").max(100),
  description: z.string().max(500).optional().or(z.literal("")),
});

export type LevelInput = z.infer<typeof levelSchema>;

export function parseLevelInput(value: Record<string, unknown>) {
  return levelSchema.parse(value);
}
