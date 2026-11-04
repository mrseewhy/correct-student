import type { Metadata } from "next";

import { AuthCard } from "@/components/auth/auth-card";

import { GetStartedForm } from "@/components/auth/get-started-form";
import { getPricingPlanByKey } from "@/lib/data/dal/pricing-plans";
import { planDetails } from "@/lib/pricing";

export const metadata: Metadata = {
  title: "Get started",
  description: "Tell us how you will use Correct Student and create your account.",
};

export const instant = false;

export default async function GetStartedPage({ searchParams }: { searchParams: Promise<{ role?: string | string[]; plan?: string | string[] }> }) {
  const { role, plan } = await searchParams;
  const initialRole = role === "tutor" ? "tutor" : "student";
  const selectedPlan = initialRole === "student" && typeof plan === "string" ? await getPricingPlanByKey(plan) : null;
  const initialPlan = selectedPlan ? { id: selectedPlan.planKey, name: selectedPlan.name, description: selectedPlan.description, paid: selectedPlan.priceNgn > 0 || selectedPlan.priceUsd > 0 || selectedPlan.priceGbp > 0 } : { ...planDetails("free"), paid: false };
  return (
    <AuthCard
      size="lg"
      title="Join Correct Student"
      description="Tell us how you will use Correct Student."
    >
      <GetStartedForm plan={initialPlan} initialRole={initialRole} />
    </AuthCard>
  );
}
