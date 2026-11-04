"use client";

import * as React from "react";
import Link from "next/link";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Field } from "@/components/auth/field";
import { PasswordInput } from "@/components/auth/password-input";
import { authClient } from "@/lib/auth-client";
import { signInSchema } from "@/validation/auth";
import { queueToast, showToast } from "@/components/toast/toast-region";

export function SignInForm() {
  const [pending, setPending] = React.useState(false);

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const formData = new FormData(event.currentTarget);
    const parsed = signInSchema.safeParse({
      identifier: formData.get("identifier"),
      password: formData.get("password"),
    });
    if (!parsed.success) {
      showToast("error", parsed.error.issues[0]?.message ?? "Enter your details to sign in.");
      return;
    }

    setPending(true);
    const { identifier, password } = parsed.data;
    try {
      const result = identifier.includes("@")
        ? await authClient.signIn.email({ email: identifier, password })
        : await authClient.signIn.username({ username: identifier, password });
      if (result.error) {
        showToast("error", result.error.message ?? "Sign-in failed. Check your details and try again.");
        return;
      }
      queueToast("success", "Signed in successfully.");
      window.location.replace("/redirect");
    } catch {
      showToast("error", "Sign-in failed. Try again in a moment.");
    } finally {
      setPending(false);
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-5" noValidate>
      <Field label="Email or username" htmlFor="identifier">
        <Input
          id="identifier"
          name="identifier"
          autoComplete="username"
          placeholder="you@example.com"
          className="h-11"
        />
      </Field>

      <Field label="Password" htmlFor="password">
        <PasswordInput id="password" name="password" autoComplete="current-password" placeholder="Enter your password" />
      </Field>


      <Button type="submit" variant="cta" size="xl" className="w-full" disabled={pending}>
        {pending ? "Signing in…" : "Sign In"}
      </Button>

      <p className="text-sm text-muted-foreground">
        Forgot your password? It can be reset for you —{" "}
        <Link href="/contact-us" className="font-medium text-primary hover:underline">contact support</Link>.
      </p>
    </form>
  );
}
