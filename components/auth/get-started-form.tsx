"use client";

import * as React from "react";
import { ArrowRight, Check, GraduationCap, Presentation } from "lucide-react";

import { Button } from "@/components/ui/button";
import Link from "next/link";
import { pricingPlans, type PlanId } from "@/lib/pricing";

const roles = [
  {
    id: "student",
    title: "Student",
    blurb: "I want to learn",
    icon: GraduationCap,
  },
  {
    id: "tutor",
    title: "Tutor",
    blurb: "I want to teach",
    icon: Presentation,
  },
];

export function GetStartedForm({ plan }: { plan: PlanId }) {
  const [role, setRole] = React.useState("student");
  const selectedPlan = pricingPlans.find((item) => item.id === plan)!;

  return (
    <form action="/sign-up">
      {role === "student" && <input type="hidden" name="plan" value={plan} />}
      {role === "student" && <div className="mb-7 flex flex-wrap items-center justify-between gap-3 rounded-2xl border border-border bg-secondary/50 px-5 py-4"><div><p className="text-xs font-medium uppercase tracking-wide text-muted-foreground">Your plan</p><p className="mt-1 font-heading text-lg font-bold text-primary">{selectedPlan.name}</p><p className="mt-1 text-sm text-muted-foreground">{selectedPlan.description}</p></div><Link href="/pricing" className="text-sm font-medium text-primary hover:underline">Compare plans</Link></div>}
      <fieldset>
        <legend className="sr-only">I am signing up as</legend>
        <div className="grid grid-cols-2 gap-3 sm:gap-4">
          {roles.map(({ id, title, blurb, icon: Icon }) => (
            <label
              key={id}
              className="group relative flex cursor-pointer flex-col items-center gap-2 rounded-2xl border-2 border-border bg-background p-4 text-center transition-all hover:border-primary/50 has-[:checked]:border-primary has-[:checked]:bg-secondary has-[:checked]:shadow-md has-[:focus-visible]:ring-4 has-[:focus-visible]:ring-ring/30 sm:p-6"
            >
              <input
                type="radio"
                name="role"
                value={id}
                checked={role === id}
                onChange={() => setRole(id)}
                className="sr-only"
              />

              <span className="absolute top-3 right-3 hidden size-5 items-center justify-center rounded-full bg-cta text-cta-foreground group-has-[:checked]:flex">
                <Check className="size-3" strokeWidth={3} />
              </span>

              <span className="flex size-12 items-center justify-center rounded-full bg-card text-primary ring-1 ring-border transition-colors group-has-[:checked]:bg-primary group-has-[:checked]:text-primary-foreground sm:size-14">
                <Icon className="size-6 sm:size-7" />
              </span>
              <span className="font-heading text-lg font-bold text-foreground sm:text-xl">
                {title}
              </span>
              <span className="text-sm text-muted-foreground">{blurb}</span>
            </label>
          ))}
        </div>
      </fieldset>

      <Button
        type="submit"
        variant="cta"
        size="xl"
        className="group mt-8 w-full"
      >
        Continue
        <ArrowRight className="transition-transform group-hover:translate-x-1" />
      </Button>
    </form>
  );
}
