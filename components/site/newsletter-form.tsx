"use client";

import { useActionState } from "react";
import { CircleCheck } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { subscribeToNewsletter, type NewsletterState } from "@/lib/data/actions/newsletter";

const initialState: NewsletterState = { message: "", error: false, ok: false };

export function NewsletterForm() {
  const [state, formAction, pending] = useActionState(subscribeToNewsletter, initialState);

  if (state.ok) {
    return <ThankYou note={state.message} />;
  }

  return (
    <form action={formAction} className="space-y-3">
      <label htmlFor="newsletter-email" className="sr-only">Email address</label>
      <Input id="newsletter-email" name="email" type="email" required autoComplete="email" placeholder="Enter your email" className="h-11 bg-card" />
      <div aria-hidden="true" className="absolute -left-[9999px] h-px w-px overflow-hidden"><label htmlFor="newsletter-profile-website">Leave this field empty</label><input id="newsletter-profile-website" name="newsletter_profile_website" type="text" tabIndex={-1} autoComplete="off" /></div>
      <Button type="submit" variant="cta" disabled={pending}>{pending ? "Subscribing…" : "Subscribe"}</Button>
      {state.message && <p role="alert" className="text-destructive text-sm">{state.message}</p>}
    </form>
  );
}

// Rendered in place of the form after a successful subscription.
export function ThankYou({ note }: { note: string }) {
  return (
    <div role="status" className="flex items-center gap-3">
      <span className="flex size-10 shrink-0 items-center justify-center rounded-full bg-secondary text-primary">
        <CircleCheck className="size-5" aria-hidden="true" />
      </span>
      <p className="text-sm text-primary">{note}</p>
    </div>
  );
}
