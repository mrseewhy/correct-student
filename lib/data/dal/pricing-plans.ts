import "server-only";

import { asc, eq } from "drizzle-orm";
import { cacheLife, cacheTag } from "next/cache";

import { db } from "@/lib";
import { pricingPlansTable } from "@/lib/schema";
import { planDetails as staticPlanDetails, planName as staticPlanName, type PricingPlan } from "@/lib/pricing";

export type PricingPlanRow = typeof pricingPlansTable.$inferSelect;

/** Maps a catalog row into the shared plan-card shape used across the app. */
function toPlanCard(row: PricingPlanRow): PricingPlan {
  return {
    id: row.planKey,
    name: row.name,
    description: row.description,
    prices: { NGN: row.priceNgn, USD: row.priceUsd, GBP: row.priceGbp },
    features: row.features,
    cta: row.cta,
    featured: row.featured,
  };
}

/** Admin/dynamic read: every catalog plan, cheapest first (Free stays on top). */
export async function listPricingPlans() {
  return db.select()
    .from(pricingPlansTable)
    .orderBy(asc(pricingPlansTable.priceNgn), asc(pricingPlansTable.createdAt));
}

export async function getPricingPlan(id: string) {
  const [row] = await db.select()
    .from(pricingPlansTable)
    .where(eq(pricingPlansTable.id, id));
  return row ?? null;
}

/** Looks a plan up by the stable key students reference (e.g. "plus"). */
export async function getPricingPlanByKey(planKey: string) {
  const [row] = await db.select()
    .from(pricingPlansTable)
    .where(eq(pricingPlansTable.planKey, planKey));
  return row ?? null;
}

/** Cached read for prerendered pages such as /pricing; admin writes call revalidateTag("pricing-plans"). */
export async function listPricingPlansCached() {
  "use cache";
  cacheLife("hours");
  cacheTag("pricing-plans");
  return listPricingPlans();
}

/**
 * Card data for a student's stored plan key: the live catalog first, falling
 * back to the static list when the key is unknown (e.g. its plan was deleted).
 */
export async function getPlanDetails(planKey: string): Promise<PricingPlan> {
  const row = await getPricingPlanByKey(planKey);
  return row ? toPlanCard(row) : staticPlanDetails(planKey);
}

/** Display name for a student's stored plan key, DB catalog first. */
export async function getPlanName(planKey: string): Promise<string> {
  const row = await getPricingPlanByKey(planKey);
  return row?.name ?? staticPlanName(planKey);
}

export async function createPricingPlan(input: {
  planKey: string;
  name: string;
  description: string;
  priceNgn: number;
  priceUsd: number;
  priceGbp: number;
  features: string[];
  cta: string;
  featured?: boolean;
}) {
  const [row] = await db.insert(pricingPlansTable)
    .values(input)
    .returning();
  return row;
}

export async function updatePricingPlan(id: string, input: {
  planKey?: string;
  name?: string;
  description?: string;
  priceNgn?: number;
  priceUsd?: number;
  priceGbp?: number;
  features?: string[];
  cta?: string;
  featured?: boolean;
}) {
  const [row] = await db.update(pricingPlansTable)
    .set({ ...input, updatedAt: new Date() })
    .where(eq(pricingPlansTable.id, id))
    .returning();
  return row;
}

export async function deletePricingPlan(id: string) {
  await db.delete(pricingPlansTable)
    .where(eq(pricingPlansTable.id, id));
}
