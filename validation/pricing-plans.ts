import { z } from "zod";

// Prices are whole naira/dollar/pound amounts the pricing cards render as-is.
const priceSchema = z.coerce
  .number({ message: "Every price must be a number." })
  .int("Prices must be whole numbers.")
  .min(0, "Prices cannot be negative.")
  .max(10_000_000, "Prices are too large.");

export const pricingPlanSchema = z.object({
  /** Stable identifier a student references from user.subscription, e.g. "plus". */
  planKey: z
    .string()
    .trim()
    .min(1, "Key is required")
    .max(40)
    .regex(/^[a-z0-9-]+$/, "Use lowercase letters, numbers and dashes only (e.g. starter)."),
  name: z.string().trim().min(1, "Name is required").max(100),
  description: z.string().trim().min(1, "A short description is required").max(300),
  priceNgn: priceSchema,
  priceUsd: priceSchema,
  priceGbp: priceSchema,
  // One benefit per line, exactly as it should appear under "What's included".
  features: z
    .array(z.string().trim().min(1, "Empty benefit line").max(200))
    .min(1, "List at least one benefit")
    .max(15, "Keep benefits to 15 lines or fewer"),
  cta: z.string().trim().min(1, "Button label is required").max(60),
  featured: z.boolean().optional().default(false),
});

export type PricingPlanInput = z.infer<typeof pricingPlanSchema>;
