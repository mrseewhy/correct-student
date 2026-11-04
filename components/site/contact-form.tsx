"use client";

import { useActionState } from "react";
import { useActionToast } from "@/components/toast/use-action-toast";
import { CircleCheck } from "lucide-react";

import { Field } from "@/components/auth/field";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { sendContactMessage, type ContactState } from "@/lib/data/actions/contact";

const initialState: ContactState = { message: "", error: false, ok: false };

export function ContactForm() {
  const [state, formAction, pending] = useActionState(sendContactMessage, initialState);
  useActionToast(state);

  if (state.ok) {
    return <ContactThankYou note={state.message} />;
  }

  return (
    <form action={formAction} className="space-y-5 rounded-3xl border border-border bg-card p-6 shadow-xl shadow-primary/5 sm:p-10 lg:col-span-3">
      <Field label="Name" htmlFor="contact-name">
        <Input id="contact-name" name="name" placeholder="Your name" maxLength={120} required autoComplete="name" className="h-11" />
      </Field>

      <Field label="Email" htmlFor="contact-email">
        <Input id="contact-email" name="email" type="email" placeholder="you@example.com" maxLength={254} required autoComplete="email" className="h-11" />
      </Field>

      <Field label="Message" htmlFor="contact-message">
        <textarea
          id="contact-message"
          name="message"
          rows={5}
          maxLength={5000}
          required
          placeholder="How can we help?"
          className="w-full rounded-md border border-input bg-transparent px-3 py-2 text-base shadow-xs outline-none placeholder:text-muted-foreground focus-visible:border-ring focus-visible:ring-[3px] focus-visible:ring-ring/50 md:text-sm resize-none"
        />
      </Field>

      <div aria-hidden="true" className="absolute -left-[9999px] h-px w-px overflow-hidden">
        <label htmlFor="contact-profile-website">Leave this field empty</label>
        <input id="contact-profile-website" name="contact_profile_website" type="text" tabIndex={-1} autoComplete="off" />
      </div>

      <Button type="submit" variant="cta" size="xl" className="w-full" disabled={pending}>
        {pending ? "Sending…" : "Send Message"}
      </Button>
    </form>
  );
}

// Rendered in place of the form after the message is delivered.
export function ContactThankYou({ note }: { note: string }) {
  return (
    <div
      role="status"
      className="flex flex-col items-center justify-center rounded-3xl border border-border bg-card p-6 text-center shadow-xl shadow-primary/5 sm:p-10 lg:col-span-3"
    >
      <span className="flex size-16 items-center justify-center rounded-full bg-secondary text-primary">
        <CircleCheck className="size-8" aria-hidden="true" />
      </span>
      <h2 className="mt-5 font-heading text-2xl font-bold text-foreground sm:text-3xl">Thank you!</h2>
      <p className="mt-3 max-w-sm text-muted-foreground">{note}</p>
    </div>
  );
}
