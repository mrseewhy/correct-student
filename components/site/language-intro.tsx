import Link from "next/link";
import { BookOpen, MessageCircle, Mic } from "lucide-react";

import { buttonVariants } from "@/components/ui/button";
import { Container } from "@/components/site/container";
import { cn } from "@/lib/utils";

const bubbles = [
  {
    word: "Báwo ni",
    language: "Yoruba",
    tone: "border-primary text-primary",
    position: "top-[4%] left-[4%] -rotate-6",
    tail: "left-6",
    delay: 0,
  },
  {
    word: "Kedu",
    language: "Igbo",
    tone: "border-chart-3 text-chart-3",
    position: "top-[2%] right-[12%] rotate-6",
    tail: "right-6",
    delay: 0.8,
  },
  {
    word: "Ndewo",
    language: "Igbo",
    tone: "border-cta text-cta",
    position: "top-[36%] right-[0%] rotate-3",
    tail: "right-6",
    delay: 1.6,
  },
  {
    word: "Sannu",
    language: "Hausa",
    tone: "border-chart-4 text-chart-4",
    position: "top-[58%] left-[0%] rotate-3",
    tail: "left-6",
    delay: 2.4,
  },
  {
    word: "No mbadda",
    language: "Fulani",
    tone: "border-chart-5 text-chart-5",
    position: "bottom-[2%] right-[18%] -rotate-3",
    tail: "right-6",
    delay: 3.2,
  },
] as const;

const skills = [
  { label: "Speak", icon: Mic },
  { label: "Read", icon: BookOpen },
  { label: "Converse", icon: MessageCircle },
];

function Bubble({
  word,
  language,
  tone,
  position,
  tail,
  delay,
}: (typeof bubbles)[number]) {
  return (
    <div className={cn("absolute", position)}>
      <div
        className={cn(
          "relative animate-float rounded-2xl border-2 bg-card px-4 py-2.5 shadow-lg motion-reduce:animate-none",
          tone,
        )}
        style={{ animationDelay: `${delay}s` }}
      >
        <p className="font-heading text-xl leading-none font-bold sm:text-2xl">
          {word}
        </p>
        <p className="mt-1 text-xs text-muted-foreground">{language}</p>
        <span
          aria-hidden
          className={cn(
            "absolute -bottom-[9px] size-4 rotate-45 border-r-2 border-b-2 border-inherit bg-card",
            tail,
          )}
        />
      </div>
    </div>
  );
}

export function LanguageIntro() {
  return (
    <section className="relative overflow-hidden border-b border-border/50 bg-card pt-32 pb-24 md:pt-42 md:pb-32">
      {/* Curved edge: the hero's background flows into this section */}
      <svg
        aria-hidden
        viewBox="0 0 1440 64"
        preserveAspectRatio="none"
        className="absolute -top-px left-0 block h-10 w-full fill-background md:h-16"
      >
        <path d="M0 0H1440V30C1320 54 1200 62 1080 54C900 42 780 12 600 14C420 16 240 52 0 46Z" />
      </svg>

      <Container className="relative grid items-center gap-14 lg:grid-cols-2 lg:gap-8">
        {/* Bubble cluster */}
        <div
          aria-hidden
          className="relative order-2 mx-auto h-[22rem] w-full max-w-xl sm:h-[26rem] lg:order-1"
        >
          {/* Soft fill plus dashed orbit rings */}
          <div className="absolute inset-[8%] rounded-full bg-secondary/70" />
          <div className="absolute inset-[3%] rounded-full border border-dashed border-primary/25" />
          <div className="absolute inset-[17%] rounded-full border border-dashed border-primary/20" />

          {bubbles.map((b) => (
            <Bubble key={b.word} {...b} />
          ))}

          {/* Featured center bubble */}
          <div className="absolute top-1/2 left-1/2 z-10 -translate-x-1/2 -translate-y-1/2 -rotate-3">
            <div className="relative animate-float rounded-3xl border-2 border-primary bg-highlight px-8 py-5 shadow-xl motion-reduce:animate-none">
              <p className="font-heading text-5xl leading-none font-bold text-foreground sm:text-6xl">
                Hello
              </p>
              <p className="mt-2 text-center text-xs font-medium text-foreground/70">
                English
              </p>
              <span
                aria-hidden
                className="absolute -bottom-[11px] left-10 size-5 rotate-45 border-r-2 border-b-2 border-primary bg-highlight"
              />
            </div>
          </div>
        </div>

        {/* Text column */}
        <div className="order-1 lg:order-2 lg:pl-8">
          <h2 className="max-w-xl text-3xl sm:text-4xl lg:text-5xl">
            Learn{" "}
            <span className="underline decoration-cta decoration-wavy decoration-2 underline-offset-[10px]">
              African languages
            </span>{" "}
            and English
          </h2>

          <p className="mt-6 max-w-lg text-lg text-foreground/80">
            Dive into our immersive platform and learn to speak and read African
            languages of your choice. Our unique approach to mastering language
            will empower you to read and speak with confidence.
          </p>

          <ul className="mt-8 flex flex-wrap gap-3">
            {skills.map(({ label, icon: Icon }) => (
              <li
                key={label}
                className="flex items-center gap-2 rounded-full bg-background px-4 py-2 font-heading text-sm font-medium text-foreground shadow-sm ring-1 ring-border"
              >
                <Icon className="size-4 text-cta" />
                {label}
              </li>
            ))}
          </ul>

          <div className="mt-8">
            <Link
              href="/about-us"
              className={buttonVariants({ variant: "default", size: "lg" })}
            >
              About Us
            </Link>
          </div>
        </div>
      </Container>
    </section>
  );
}
