import type { Metadata } from "next";

import Link from "next/link";
import { redirect } from "next/navigation";
import { AuthCard } from "@/components/auth/auth-card";

import { SignUpForm } from "@/components/auth/sign-up-form";
import { isRole } from "@/lib/onboarding";
import type { UserRole } from "@/lib/auth/permissions";
import { getPricingPlanByKey } from "@/lib/data/dal/pricing-plans";

export const metadata: Metadata = {
  title: "Create your account",
  description: "Start your bilingual journey with Correct Student.",
};

// Reads ?role/?plan at request time; the proxy re-routes signed-in users anyway.
// Only the free plan can be self-assigned; paid plans require payment gateway integration.
export const instant = false;

export default async function SignUpPage({ searchParams }: { searchParams: Promise<{ role?: string | string[]; plan?: string | string[] }> }) {
  const { role, plan } = await searchParams;
  if (!isRole(role)) redirect("/get-started");

  const initialPlan = role === "student" && typeof plan === "string" ? await getPricingPlanByKey(plan) : null;

  const initialRole = role;

  return (
    <AuthCard
      size="signup"
      title="Create your account"
      description="Start your bilingual journey."
      footer={
        <>
          Already have an account?{" "}
          <Link href="/sign-in" className="font-medium text-primary hover:underline">
            Sign in
          </Link>
        </>
      }
    >
      <SignUpForm
        initialRole={initialRole as Extract<UserRole, "student" | "tutor">}
        initialPlan={initialPlan ? { id: initialPlan.planKey, name: initialPlan.name, paid: initialPlan.priceNgn > 0 || initialPlan.priceUsd > 0 || initialPlan.priceGbp > 0 } : null}
      />
    </AuthCard>
  );
}
