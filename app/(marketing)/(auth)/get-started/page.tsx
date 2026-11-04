import type { Metadata } from "next";

import { AuthCard } from "@/components/auth/auth-card";

import { GetStartedForm } from "@/components/auth/get-started-form";

export const metadata: Metadata = {
  title: "Get started",
  description: "Tell us how you will use Correct Student and create your account.",
};

// Reads ?plan= at request time; the proxy re-routes signed-in users anyway.
// Only the free plan can be self-assigned; paid plans require payment gateway integration.
export const instant = false;

export default async function GetStartedPage({ searchParams }: { searchParams: Promise<{ plan?: string | string[] }> }) {
  const { plan } = await searchParams;
  // Only free can be selected via self-service signup; paid plans require payment.
  const initialPlan = plan === "free" ? "free" : null;
  return (
    <AuthCard
      size="lg"
      title="Join Correct Student"
      description="Tell us how you will use Correct Student."
    >
      <GetStartedForm plan={initialPlan ?? "free"} />
    </AuthCard>
  );
}
