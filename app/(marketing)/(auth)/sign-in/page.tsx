import type { Metadata } from "next";

import Link from "next/link";
import { AuthCard } from "@/components/auth/auth-card";
import { SignInForm } from "@/components/auth/sign-in-form";

export const metadata: Metadata = {
  title: "Sign in",
  description: "Sign in to continue your bilingual journey with Correct Student.",
};

export default function SignInPage() {
  return (
    <AuthCard
      title="Welcome back"
      description="Sign in to continue your bilingual journey."
      footer={
        <>
          New to Correct Student?{" "}
          <Link href="/get-started" className="font-medium text-primary hover:underline">
            Create an account
          </Link>
        </>
      }
    >
      <SignInForm />
    </AuthCard>
  );
}
