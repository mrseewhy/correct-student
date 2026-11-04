import type { Metadata } from "next";

import Link from "next/link";
import {
  ArrowRight, BookOpen, Check, GraduationCap, Languages,
  MessageCircle, Music, Presentation,
} from "lucide-react";

import { Container } from "@/components/site/container";
import { buttonVariants } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { languageOptions } from "@/lib/onboarding";

export const metadata: Metadata = {
  title: "Features",
  description:
    "Explore how Correct Student teaches African languages and English through lessons, stories, songs and one-on-one classes.",
};

const features = [
  {
    title: "Lessons", icon: GraduationCap,
    introduction: "Build confidence, one lesson at a time.",
    description: "Start with everyday words and work towards real conversations. Simple, focused lessons make room for a little learning every day.",
    benefits: ["Everyday vocabulary and useful phrases", "Reading and speaking practice", "A gentle introduction for beginners"],
    preview: { label: "Everyday conversations", word: "Báwo ni", meaning: "How are you?", language: "Yoruba · English" },
  },
  {
    title: "Stories", icon: BookOpen,
    introduction: "Discover a language through its stories.",
    description: "Meet new characters, explore familiar places and see words come to life. Stories connect language with culture and spark a love of reading.",
    benefits: ["Vocabulary in a meaningful context", "Stories that celebrate African culture", "Reading that invites curiosity"],
    preview: { label: "Words in context", word: "A new adventure", meaning: "Read. Imagine. Discover.", language: "Language · Culture" },
  },
  {
    title: "Songs", icon: Music,
    introduction: "Make new words part of your rhythm.",
    description: "Sing along, repeat familiar sounds and let the melody do its magic. Songs turn practice into a playful moment learners can return to.",
    benefits: ["Memorable words and phrases", "Practice through rhythm and repetition", "A playful way to explore new sounds"],
    preview: { label: "Learning in rhythm", word: "Sing it. Say it.", meaning: "A melody worth remembering.", language: "Listen · Repeat · Sing" },
  },
];

const steps = [
  { title: "Choose your language", description: "Explore Yoruba, Igbo, Hausa or Fulani, alongside English." },
  { title: "Find your way to learn", description: "Try a lesson, settle into a story or sing along to a song." },
  { title: "Put your words to work", description: "Bring what you learn into everyday conversations, at your own pace." },
];

export default function FeaturesPage() {
  return (
    <section className="bg-linear-to-b from-secondary via-background to-background py-16 md:py-24">
      <Container>
        <div className="mx-auto max-w-2xl text-center">
          <h1 className="text-4xl sm:text-5xl">Features</h1>
          <p className="mt-4 text-lg text-foreground/80">
            Learn African languages and English through lessons, stories and songs.
            Three ways to explore, practice and grow in confidence.
          </p>
        </div>

        <div className="mt-12 grid gap-8 lg:grid-cols-3">
          {features.map(({ title, icon: Icon, introduction, description, benefits, preview }) => (
            <article key={title} className="flex flex-col rounded-3xl border border-border bg-card p-6 shadow-xl shadow-primary/5 sm:p-8">
              <span className="flex size-12 items-center justify-center rounded-full bg-secondary text-primary">
                <Icon className="size-6" aria-hidden />
              </span>
              <h2 className="mt-5 text-2xl">{title}</h2>
              <p className="mt-2 font-heading font-medium text-foreground">{introduction}</p>
              <p className="mt-3 leading-relaxed text-muted-foreground">{description}</p>
              <ul className="mt-6 space-y-3">
                {benefits.map((benefit) => (
                  <li key={benefit} className="flex items-start gap-2.5 text-sm leading-6 text-foreground/80">
                    <Check className="mt-1 size-4 shrink-0 text-primary" aria-hidden />
                    {benefit}
                  </li>
                ))}
              </ul>
              <div className="mt-auto pt-8">
                <div className="rounded-2xl border border-border bg-secondary/50 p-5">
                  <p className="text-xs font-medium text-muted-foreground">{preview.label}</p>
                  <p className="mt-3 font-heading text-2xl font-bold text-primary">{preview.word}</p>
                  <p className="mt-1 text-sm text-foreground/80">{preview.meaning}</p>
                  <p className="mt-4 border-t border-border pt-3 text-xs text-muted-foreground">{preview.language}</p>
                </div>
              </div>
            </article>
          ))}
        </div>

        <div className="mt-16 grid gap-8 lg:grid-cols-5 lg:gap-12">
          <div className="rounded-3xl border border-border bg-card p-6 shadow-xl shadow-primary/5 sm:p-10 lg:col-span-3">
            <h2 className="text-2xl sm:text-3xl">A simple way to get started</h2>
            <ol className="mt-8 space-y-7">
              {steps.map((step, index) => (
                <li key={step.title} className="flex items-start gap-4">
                  <span className="flex size-9 shrink-0 items-center justify-center rounded-full bg-secondary font-heading text-sm font-bold text-primary">{index + 1}</span>
                  <div>
                    <h3 className="text-lg text-foreground">{step.title}</h3>
                    <p className="mt-1 leading-relaxed text-muted-foreground">{step.description}</p>
                  </div>
                </li>
              ))}
            </ol>
          </div>

          <div className="space-y-4 lg:col-span-2">
            <div className="rounded-2xl border border-border bg-card p-6 shadow-sm">
              <div className="flex items-center gap-4">
                <span className="flex size-12 shrink-0 items-center justify-center rounded-full bg-secondary text-primary"><Languages className="size-5" aria-hidden /></span>
                <h2 className="text-xl">African languages, with English</h2>
              </div>
              <p className="mt-4 leading-relaxed text-muted-foreground">Connect with your roots or discover a new language. Explore each one alongside English.</p>
              <ul className="mt-5 flex flex-wrap gap-2" aria-label="Available languages">
                {languageOptions.map((language) => (
                  <li key={language.id} className="rounded-full border border-border bg-secondary px-3 py-1.5 text-sm font-medium text-primary">{language.label}</li>
                ))}
              </ul>
            </div>
            <div className="rounded-2xl border border-border bg-card p-6 shadow-sm">
              <div className="flex items-center gap-4">
                <span className="flex size-12 shrink-0 items-center justify-center rounded-full bg-secondary text-primary"><Presentation className="size-5" aria-hidden /></span>
                <h2 className="text-xl">A little extra guidance</h2>
              </div>
              <p className="mt-4 leading-relaxed text-muted-foreground">Practice conversations and ask questions in one-on-one classes with a teacher.</p>
              <Link href="/classes" className={cn(buttonVariants({ variant: "link" }), "mt-3 px-0")}>Explore classes <ArrowRight className="size-4" aria-hidden /></Link>
            </div>
          </div>
        </div>

        <div className="mt-16 rounded-3xl border border-border bg-secondary/50 p-6 text-center sm:p-10">
          <MessageCircle className="mx-auto size-8 text-primary" aria-hidden />
          <h2 className="mt-4 text-2xl sm:text-3xl">Your next conversation starts here</h2>
          <p className="mx-auto mt-3 max-w-lg text-foreground/80">Start with a few words. Discover a story. Find a favourite song. Make room for a new language.</p>
          <div className="mt-6 flex flex-wrap justify-center gap-3">
            <Link href="/get-started" className={buttonVariants({ variant: "cta", size: "xl" })}>Get Started <ArrowRight className="size-4" aria-hidden /></Link>
            <Link href="/pricing" className={buttonVariants({ variant: "outline", size: "xl" })}>View Pricing</Link>
          </div>
        </div>
      </Container>
    </section>
  );
}
