"use client";

import * as React from "react";
import Link from "next/link";
import { GraduationCap, Presentation, Check, ArrowRight } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Field } from "@/components/auth/field";
import { PasswordInput } from "@/components/auth/password-input";
import { type UserRole } from "@/lib/auth/permissions";
import { authClient } from "@/lib/auth-client";
import { isFreePlan, pricingPlans, type PlanId } from "@/lib/pricing";
import { signUpSchema } from "@/validation/auth";

function usernameFromName(name: string) {
  return name
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLowerCase()
    .trim()
    .split(/\s+/)
    .filter(Boolean)
    .join(".")
    .replace(/[^a-z0-9._-]/g, "");
}

export function SignUpForm({ initialRole, initialPlan }: { initialRole: Extract<UserRole, "student" | "tutor">; initialPlan: PlanId | null }) {
  const [name, setName] = React.useState("");
  const [pending, setPending] = React.useState(false);
  const [errorMsg, setErrorMsg] = React.useState("");
  const [customUsername, setCustomUsername] = React.useState<string | null>(null);

  const username = customUsername ?? usernameFromName(name);
  const plan = initialRole === "student" ? (isFreePlan(initialPlan ?? "free") ? "free" : null) : null;

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setErrorMsg("");
    const formData = new FormData(event.currentTarget);
    const parsed = signUpSchema.safeParse({
      name: formData.get("name"),
      username: formData.get("username"),
      email: formData.get("email"),
      password: formData.get("password"),
      confirmPassword: formData.get("confirmPassword"),
      role: initialRole,
      plan: plan ?? "free",
    });
    if (!parsed.success) {
      setErrorMsg(parsed.error.issues[0]?.message ?? "Check your details and try again.");
      return;
    }

    setPending(true);
    const payload = {
      name: parsed.data.name,
      username: parsed.data.username,
      email: parsed.data.email,
      password: parsed.data.password,
      // `role` is rejected by the API (admin plugin marks it input:false);
      // the create hook maps `signupRole` onto the real column.
      signupRole: parsed.data.role,
    } as unknown as Parameters<typeof authClient.signUp.email>[0];
    const result = await authClient.signUp.email(payload);
    setPending(false);

    if (result.error) {
      setErrorMsg(result.error.message ?? "Sign-up failed. Try again in a moment.");
      return;
    }

    window.location.replace("/redirect");
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-5" noValidate>
      <div className="rounded-2xl border border-border bg-secondary/40 p-5 sm:p-6">
        <div className="flex items-center justify-between gap-3">
          <h2 className="font-heading text-base font-bold text-foreground">Your choices</h2>
          <Link href={plan ? `/get-started?plan=${plan}` : "/get-started"} className="text-sm font-medium text-primary hover:underline">Change role</Link>
        </div>
        <div className="mt-4 grid gap-3 sm:grid-cols-2">
          <div className="flex items-center gap-3 rounded-xl border border-primary/30 bg-card p-3.5">
            <span className="flex size-10 shrink-0 items-center justify-center rounded-full bg-secondary text-primary">{initialRole === "student" ? <GraduationCap className="size-5" aria-hidden /> : <Presentation className="size-5" aria-hidden />}</span>
            <div className="min-w-0"><p className="text-xs text-muted-foreground">Joining as</p><p className="font-heading font-bold text-foreground">{initialRole === "student" ? "Student" : "Tutor"}</p></div>
            <Check className="ml-auto size-4 shrink-0 text-primary" aria-hidden />
          </div>
          {initialRole === "student" && plan && <div className="flex items-center justify-between gap-3 rounded-xl border border-primary/30 bg-card p-3.5">
            <div><p className="text-xs text-muted-foreground">Subscription</p><p className="font-heading font-bold text-foreground">{pricingPlans.find((item) => item.id === plan)?.name}</p></div>
            <Check className="size-4 shrink-0 text-primary" aria-hidden />
          </div>}
        </div>
        {initialRole === "student" && <Link href="/pricing" className="mt-4 inline-flex items-center gap-1.5 text-sm font-medium text-primary hover:underline">Compare plans <ArrowRight className="size-3.5" aria-hidden /></Link>}
      </div>

      <Field label="Full name" htmlFor="name">
        <Input
          id="name"
          name="name"
          required
          placeholder="Your full name"
          value={name}
          onChange={(e) => setName(e.target.value)}
          className="h-11"
        />
      </Field>

      <Field label="Username" htmlFor="username">
        <Input
          id="username"
          name="username"
          required
          placeholder="your.username"
          value={username}
          onChange={(e) =>
            setCustomUsername(e.target.value === "" ? null : e.target.value)
          }
          className="h-11"
        />
      </Field>

      <Field label="Email" htmlFor="email">
        <Input
          id="email"
          name="email"
          required
          type="email"
          autoComplete="email"
          placeholder="you@example.com"
          className="h-11"
        />
      </Field>

      <div className="grid gap-5 sm:grid-cols-2">
        <Field label="Password" htmlFor="password">
          <PasswordInput id="password" name="password" required minLength={8} autoComplete="new-password" placeholder="At least 8 characters" />
        </Field>

        <Field label="Confirm password" htmlFor="confirm">
          <PasswordInput id="confirm" name="confirmPassword" required minLength={8} autoComplete="new-password" placeholder="Repeat your password" />
        </Field>
      </div>

      {errorMsg && <p role="alert" className="text-destructive text-sm">{errorMsg}</p>}

      <Button type="submit" variant="cta" size="xl" className="w-full" disabled={pending}>
        {pending ? "Creating account…" : "Create account"}
      </Button>
    </form>
  );
}
