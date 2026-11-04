import type { Metadata } from "next";

import { PricingPlans } from "@/components/site/pricing-plans";
import type { PricingPlan } from "@/lib/pricing";
import { listPricingPlansCached } from "@/lib/data/dal/pricing-plans";

export const metadata: Metadata = {
  title: "Pricing",
  description:
    "Find the right plan for lessons, stories, songs and one-on-one classes. Start for free and grow at your own pace.",
};

// Plans are managed in the admin Subscriptions section; the cached read keeps
// this page static and revalidates via the "pricing-plans" tag on writes.
export default async function PricingPage() {
  const rows = await listPricingPlansCached();
  // Map the catalog into the card shape: `id` carries the plan key
  // (free/starter/…) that the sign-up flow links to.
  const plans: PricingPlan[] = rows.map((row) => ({
    id: row.planKey,
    name: row.name,
    description: row.description,
    prices: { NGN: row.priceNgn, USD: row.priceUsd, GBP: row.priceGbp },
    features: row.features,
    cta: row.cta,
    featured: row.featured,
  }));
  return <PricingPlans plans={plans} />;
}
