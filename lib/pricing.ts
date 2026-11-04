export const currencies = [
  { code: "NGN", label: "Naira", symbol: "₦" },
  { code: "USD", label: "Dollar", symbol: "$" },
  { code: "GBP", label: "Pounds", symbol: "£" },
] as const;

export type CurrencyCode = (typeof currencies)[number]["code"];

export type PricingPlan = {
  id: string;
  name: string;
  description: string;
  prices: Record<CurrencyCode, number>;
  features: string[];
  cta: string;
  featured?: boolean;
};

// Sample monthly prices for the UI, editable independently for each currency.
export const pricingPlans: PricingPlan[] = [
  {
    id: "free", name: "Free",
    description: "A little curiosity. A whole new language.",
    prices: { NGN: 0, USD: 0, GBP: 0 },
    features: ["Introductory language lessons", "A taste of our stories and songs", "Learn at your own pace", "Access on any device"],
    cta: "Start for free",
  },
  {
    id: "starter", name: "Starter",
    description: "Build a happy, everyday learning habit.",
    prices: { NGN: 5000, USD: 5, GBP: 4 },
    features: ["Everything in Free", "Full lessons in one language", "More stories and sing-along songs", "Practice activities and quizzes", "Track your learning progress"],
    cta: "Choose Starter",
  },
  {
    id: "plus", name: "Plus",
    description: "More ways to learn. More reasons to smile.",
    prices: { NGN: 10000, USD: 10, GBP: 8 },
    features: ["Everything in Starter", "Explore all four African languages", "The complete story and song library", "Personalized practice activities", "Downloadable learning worksheets", "Priority support"],
    cta: "Choose Plus", featured: true,
  },
  {
    id: "premium", name: "Premium",
    description: "A helping hand for every big breakthrough.",
    prices: { NGN: 25000, USD: 25, GBP: 20 },
    features: ["Everything in Plus", "Two one-on-one classes each month", "Guidance from an expert teacher", "A personal learning plan", "Class feedback and progress updates", "Flexible class scheduling"],
    cta: "Choose Premium",
  },
];

export type PlanId = "free" | "starter" | "plus" | "premium";

/** Plans that can be assigned without a payment. */
export const freePlanIds: readonly PlanId[] = ["free"];

/** Plans that require a completed payment before they should be active. */
export const paidPlanIds: readonly PlanId[] = ["starter", "plus", "premium"];

export function isFreePlan(plan: string): plan is PlanId {
  return plan === "free";
}

export function isPaidPlan(plan: string): plan is PlanId {
  return paidPlanIds.includes(plan as PlanId);
}

export function requiresPayment(plan: string): boolean {
  return isPaidPlan(plan);
}

export function parsePlan(value: unknown): PlanId {
  return typeof value === "string" && pricingPlans.some((plan) => plan.id === value)
    ? value as PlanId
    : "free";
}

/** Display name for a stored plan id; unknown or missing ids fall back to Free. */
export function planName(plan: string): string {
  return pricingPlans.find((item) => item.id === plan)?.name ?? "Free";
}

/** Full plan details for a stored plan id, with Free as the fallback. */
export function planDetails(plan: string): PricingPlan {
  return pricingPlans.find((item) => item.id === plan) ?? pricingPlans[0];
}
