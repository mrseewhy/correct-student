"use client";

import { useActionState } from "react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Field } from "@/components/auth/field";
import type { CreateUserState } from "@/lib/data/actions/users-admin";

const initialState: CreateUserState = { message: "", error: false };

export function ManagedUserCreateForm({
  action,
  submitLabel,
  includePlan = true,
}: {
  action: (previous: CreateUserState, formData: FormData) => Promise<CreateUserState>;
  submitLabel: string;
  includePlan?: boolean;
}) {
  const [state, formAction, pending] = useActionState(action, initialState);

  return (
    <form action={formAction} className="mt-8 grid gap-5 rounded-2xl border border-border bg-card p-5 sm:grid-cols-2 sm:p-6">
      <Field label="Full name" htmlFor="create-name">
        <Input id="create-name" name="name" required maxLength={100} placeholder="Their full name" className="h-11" />
      </Field>
      <Field label="Username" htmlFor="create-username">
        <Input id="create-username" name="username" required maxLength={30} placeholder="their.username" className="h-11" />
      </Field>
      <Field label="Email" htmlFor="create-email">
        <Input id="create-email" name="email" type="email" required maxLength={254} placeholder="user@example.com" className="h-11" />
      </Field>
      <Field label="Password" htmlFor="create-password">
        <Input id="create-password" name="password" type="password" required minLength={8} maxLength={72} placeholder="At least 8 characters" className="h-11" />
      </Field>
      {includePlan && (
        <div className="sm:col-span-2">
          <Field label="Plan" htmlFor="create-plan">
            <select id="create-plan" name="plan" defaultValue="free" className="h-11 w-full rounded-lg border border-input bg-transparent px-2.5 py-1 text-base md:text-sm">
              <option value="free">Free</option>
              <option value="starter">Starter</option>
              <option value="plus">Plus</option>
              <option value="premium">Premium</option>
            </select>
          </Field>
        </div>
      )}
      {state.message && (
        <p role={state.error ? "alert" : "status"} className={`sm:col-span-2 text-sm ${state.error ? "text-destructive" : "text-primary"}`}>
          {state.message}
        </p>
      )}
      <Button type="submit" variant="cta" className="sm:col-span-2" disabled={pending}>
        {pending ? "Creating…" : submitLabel}
      </Button>
    </form>
  );
}
