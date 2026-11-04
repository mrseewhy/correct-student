"use client";

import { useState } from "react";
import Link from "next/link";
import { ArrowRight, Check, ChevronDown, Heart, Sparkles } from "lucide-react";
import { Container } from "@/components/site/container";
import { buttonVariants } from "@/components/ui/button";
import {
  DropdownMenu, DropdownMenuContent, DropdownMenuRadioGroup,
  DropdownMenuRadioItem, DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { currencies, type CurrencyCode, type PricingPlan } from "@/lib/pricing";
import { cn } from "@/lib/utils";

export function PricingPlans({ plans }: { plans: PricingPlan[] }) {
  const [currency, setCurrency] = useState<CurrencyCode>("NGN");
  const [menuOpen, setMenuOpen] = useState(false);
  const selectedCurrency = currencies.find((item) => item.code === currency)!;

  return (
    <section className="bg-linear-to-b from-secondary via-background to-background py-16 md:py-24">
      <Container className="relative">
        <div className="mb-6 flex justify-end sm:absolute sm:top-0 sm:right-6 sm:mb-0">
          <DropdownMenu open={menuOpen} onOpenChange={setMenuOpen}>
            <DropdownMenuTrigger
              aria-label={`Change currency, currently ${selectedCurrency.label}`}
              className={cn(buttonVariants({ variant: "outline", size: "sm" }), "gap-2 bg-card px-4")}
            >
              <span className="text-primary">{selectedCurrency.symbol}</span>
              {selectedCurrency.code}
              <ChevronDown className="size-3.5 text-muted-foreground" />
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="min-w-44">
              <DropdownMenuRadioGroup value={currency} onValueChange={(value) => {
                const next = currencies.find((item) => item.code === value);
                if (next) setCurrency(next.code);
                setMenuOpen(false);
              }}>
                {currencies.map((item) => (
                  <DropdownMenuRadioItem key={item.code} value={item.code} className="py-2.5">
                    <span className="w-4 text-primary">{item.symbol}</span>
                    {item.label}
                    <span className="text-xs text-muted-foreground">{item.code}</span>
                  </DropdownMenuRadioItem>
                ))}
              </DropdownMenuRadioGroup>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>

        <div className="mx-auto max-w-2xl text-center">
          <h1 className="text-4xl sm:text-5xl">Pricing</h1>
          <p className="mt-4 text-lg text-foreground/80">
            Find the right plan for lessons, stories, songs and one-on-one
            classes. Start for free and grow at your own pace.
          </p>
        </div>

        <div className="mt-12 grid gap-x-6 gap-y-10 sm:grid-cols-2 xl:grid-cols-4" aria-label={`Monthly plans priced in ${selectedCurrency.label}`}>
          {plans.map((plan) => (
            <article key={plan.id} className={cn(
              "relative flex flex-col rounded-3xl border bg-card p-6 shadow-xl shadow-primary/5 sm:p-8",
              plan.featured ? "border-primary ring-1 ring-primary" : "border-border",
            )}>
              {plan.featured && (
                <span className="absolute -top-3.5 left-1/2 inline-flex -translate-x-1/2 items-center gap-1.5 rounded-full bg-primary px-4 py-1.5 font-heading text-xs font-bold whitespace-nowrap text-primary-foreground">
                  <Sparkles className="size-3.5" aria-hidden /> Most popular
                </span>
              )}
              <h2 className="text-2xl">{plan.name}</h2>
              <p className="mt-2 min-h-12 text-sm leading-6 text-muted-foreground">{plan.description}</p>
              <div className="mt-7 flex flex-wrap items-baseline gap-1.5">
                <span className="font-heading text-4xl font-bold tracking-tight text-foreground">
                  {selectedCurrency.symbol}{plan.prices[currency].toLocaleString("en-GB")}
                </span>
                <span className="text-sm text-muted-foreground">{plan.prices.NGN === 0 ? "/ forever" : "/ month"}</span>
              </div>
              {plan.prices.NGN === 0 ? (
                <Link href={`/get-started?plan=${plan.id}`} className={cn(buttonVariants({ variant: plan.featured ? "cta" : "outline", size: "lg" }), "mt-7 w-full")}>
                  {plan.cta} <ArrowRight className="size-4" aria-hidden />
                </Link>
              ) : (
                // Paid signup needs a payment gateway; route interest to the contact page meanwhile.
                <Link href="/contact-us" className={cn(buttonVariants({ variant: plan.featured ? "cta" : "outline", size: "lg" }), "mt-7 w-full")}>
                  {plan.cta} <ArrowRight className="size-4" aria-hidden />
                </Link>
              )}
              <div className="my-7 border-t border-border" />
              <p className="font-heading text-xs font-bold tracking-wider text-foreground uppercase">What&apos;s included</p>
              <ul className="mt-4 space-y-3.5">
                {plan.features.map((feature) => (
                  <li key={feature} className="flex items-start gap-2.5 text-sm leading-6 text-foreground/80">
                    <Check className="mt-1 size-4 shrink-0 text-primary" strokeWidth={2.5} aria-hidden />
                    {feature}
                  </li>
                ))}
              </ul>
            </article>
          ))}
        </div>

        <div className="mx-auto mt-12 flex max-w-2xl flex-col items-center gap-4 rounded-2xl border border-border bg-card p-5 text-center shadow-sm sm:flex-row sm:text-left">
          <span className="flex size-12 shrink-0 items-center justify-center rounded-full bg-secondary text-primary">
            <Heart className="size-5" aria-hidden />
          </span>
          <div className="flex-1">
            <h2 className="text-lg">Not sure where to start?</h2>
            <p className="mt-1 text-sm text-muted-foreground">We&apos;ll help you find the right fit for your learner.</p>
          </div>
          <Link href="/contact-us" className={cn(buttonVariants({ variant: "link" }), "shrink-0 px-0")}>
            Let&apos;s talk <ArrowRight className="size-4" aria-hidden />
          </Link>
        </div>
      </Container>
    </section>
  );
}
