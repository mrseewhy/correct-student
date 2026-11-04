"use client";

import * as React from "react";
import Image from "next/image";
import Link from "next/link";
import {
  ArrowRight,
  BookOpen,
  Check,
  GraduationCap,
  Music,
} from "lucide-react";

import { buttonVariants } from "@/components/ui/button";
import { Container } from "@/components/site/container";
import { cn } from "@/lib/utils";

const greetings = [
  {
    word: "Báwo ni",
    language: "Yoruba",
    meaning: "How are you?",
    position: "top-10 -left-2 sm:-left-8",
    tail: "left",
    delay: 0,
  },
  {
    word: "Kedu",
    language: "Igbo",
    meaning: "How are you?",
    position: "top-28 -right-2 sm:-right-8",
    tail: "right",
    delay: 1.2,
  },
  {
    word: "Sannu",
    language: "Hausa",
    meaning: "Hello",
    position: "top-[55%] -left-2 sm:-left-12",
    tail: "left",
    delay: 2.4,
  },
  {
    word: "No mbadda",
    language: "Fulani",
    meaning: "How are you?",
    position: "bottom-24 -right-2 sm:-right-10",
    tail: "right",
    delay: 3.6,
  },
] as const;

const methods = [
  { label: "Lessons", icon: GraduationCap },
  { label: "Stories", icon: BookOpen },
  { label: "Songs", icon: Music },
];

function CheckMark({ active }: { active: boolean }) {
  return (
    <svg
      viewBox="0 0 60 50"
      fill="none"
      aria-hidden
      className={cn(
        "absolute top-[-0.3em] right-[-0.6em] h-[0.75em] w-[0.9em] text-cta",
        active ? "opacity-100" : "opacity-0",
      )}
    >
      <path
        d="M4 28 C 12 33, 19 39, 24 46 C 32 28, 45 12, 58 4"
        pathLength={1}
        stroke="currentColor"
        strokeWidth={6}
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeDasharray={1}
        className={cn(
          active && "animate-draw-check motion-reduce:animate-none",
        )}
      />
    </svg>
  );
}

function Bubble({
  item,
  active,
}: {
  item: (typeof greetings)[number];
  active: boolean;
}) {
  return (
    <div
      className={cn(
        "absolute animate-float rounded-2xl border border-border bg-card px-4 py-2.5 shadow-lg transition-all duration-500 motion-reduce:animate-none",
        item.tail === "left" ? "rounded-bl-sm" : "rounded-br-sm",
        active && "scale-110 border-cta ring-4 ring-cta/20",
        item.position,
      )}
      style={{ animationDelay: `${item.delay}s` }}
    >
      <p className="font-heading text-lg leading-none font-bold text-primary">
        {item.word}
      </p>
      <p className="mt-1 text-xs text-muted-foreground">{item.language}</p>
    </div>
  );
}

export function Hero() {
  const [index, setIndex] = React.useState(0);

  React.useEffect(() => {
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)");
    if (reduce.matches) return;

    const id = setInterval(() => {
      setIndex((i) => (i + 1) % greetings.length);
    }, 3000);

    return () => clearInterval(id);
  }, []);

  const current = greetings[index];

  return (
    <section className="relative overflow-hidden bg-linear-to-b from-secondary via-background to-background">
      {/* Soft background glows */}
      <div
        aria-hidden
        className="pointer-events-none absolute -top-24 -left-24 size-96 rounded-full bg-highlight/60 blur-3xl"
      />
      <div
        aria-hidden
        className="pointer-events-none absolute top-1/3 -right-24 size-80 rounded-full bg-cta/10 blur-3xl"
      />
      {/* NEW: dot grid, strongest around the photo and faded behind the text */}
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 opacity-[0.14] dark:opacity-[0.2] [background-image:radial-gradient(var(--primary)_1.5px,transparent_1.5px)] [background-size:24px_24px] [mask-image:linear-gradient(to_bottom,transparent_25%,black)] lg:[mask-image:radial-gradient(ellipse_at_72%_45%,black,transparent_65%)]"
      />

      <Container className="relative  grid items-center gap-16 py-16 md:py-24 lg:grid-cols-2 lg:gap-10">
        {/* Text column */}
        <div>
          <p className="inline-flex items-center rounded-full bg-secondary px-3.5 py-1.5 text-sm font-medium text-primary ring-1 ring-border">
            Yoruba · Igbo · Hausa · Fulani
          </p>

          <h1 className="mt-6 text-5xl leading-[1.05] sm:text-6xl xl:text-7xl">
            <span className="sr-only">Say hello in a new language</span>

            <span aria-hidden className="block">
              <span className="flex flex-wrap items-baseline gap-x-[0.3em]">
                <span className="block text-foreground">Say</span>

                <span className="block">
                  <span className="relative mt-1 inline-grid">
                    {greetings.map((g, i) => {
                      const active = i === index;
                      return (
                        <span
                          key={g.word}
                          className={cn(
                            "col-start-1 row-start-1 transition-all duration-500 motion-reduce:transition-none",
                            active
                              ? "translate-y-0 opacity-100"
                              : "translate-y-4 opacity-0",
                          )}
                        >
                          <span className="relative inline-block bg-[linear-gradient(to_top,var(--highlight)_35%,transparent_35%)] px-1 text-primary">
                            {g.word}
                            <CheckMark active={active} />
                          </span>
                        </span>
                      );
                    })}
                  </span>
                </span>
              </span>
              <span className="block text-foreground">in a new language.</span>
            </span>
          </h1>

          {/* Live translation line */}
          <p
            aria-hidden
            className="mt-5 flex min-h-7 flex-wrap items-center gap-2 text-sm font-medium text-muted-foreground"
          >
            <span className="rounded-full bg-secondary px-2.5 py-0.5 text-primary ring-1 ring-border">
              {current.language}
            </span>
            <span
              key={index}
              className="animate-in fade-in duration-500 motion-reduce:animate-none"
            >
              &ldquo;{current.word}&rdquo; means &ldquo;{current.meaning}&rdquo;
            </span>
          </p>

          <p className="mt-6 max-w-lg text-lg text-foreground/80">
            Learn African languages and English side by side, through lessons,
            stories and songs that stick. Start your bilingual journey today.
          </p>

          <div className="mt-8 flex flex-wrap items-center gap-4">
            <Link
              href="/get-started"
              className={cn(
                buttonVariants({ variant: "cta", size: "xl" }),
                "group",
              )}
            >
              Get Started
              <ArrowRight className="transition-transform group-hover:translate-x-1" />
            </Link>

            <Link
              href="/features"
              className={buttonVariants({ variant: "outline", size: "xl" })}
            >
              How it works
            </Link>
          </div>

          <p className="mt-6 flex items-center gap-2 text-sm text-muted-foreground">
            <span className="flex size-5 items-center justify-center rounded-full bg-primary text-primary-foreground">
              <Check className="size-3" strokeWidth={3} />
            </span>
            Personalized one-on-one classes with expert teachers
          </p>
        </div>

        {/* Visual column */}
        <div className="relative mx-auto w-full max-w-md pb-8 2xl:max-w-lg">
          {/* Offset shape behind the photo */}
          <div
            aria-hidden
            className="absolute top-6 left-6 h-[calc(100%-2rem)] w-full rounded-t-[999px] rounded-b-[2.5rem] bg-primary/15"
          />

          {/* Arch photo */}
          <div className="relative aspect-4/5 overflow-hidden rounded-t-[999px] rounded-b-[2.5rem] bg-secondary shadow-xl ring-1 ring-border">
            <Image
              src="/img/hero3.jpg"
              alt="A child wearing orange headphones, learning on a laptop"
              fill
              priority
              sizes="(min-width: 1536px) 512px, (min-width: 1024px) 448px, 90vw"
              className="object-cover object-[50%_25%]"
            />
          </div>

          {/* Floating speech bubbles */}
          {greetings.map((g, i) => (
            <Bubble key={g.word} item={g} active={i === index} />
          ))}

          {/* Methods pill */}
          <div className="absolute bottom-0 left-1/2 flex -translate-x-1/2 items-center gap-5 rounded-full border border-border bg-card px-5 py-3 whitespace-nowrap shadow-lg">
            {methods.map(({ label, icon: Icon }) => (
              <span
                key={label}
                className="flex items-center gap-1.5 font-heading text-sm font-medium text-foreground"
              >
                <Icon className="size-4 text-cta" />
                {label}
              </span>
            ))}
          </div>
        </div>
      </Container>
    </section>
  );
}
