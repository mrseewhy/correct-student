import type { Metadata } from "next";

import Link from "next/link";
import { ArrowRight, ChevronDown, MessageCircle } from "lucide-react";
import { Container } from "@/components/site/container";
import { buttonVariants } from "@/components/ui/button";

export const metadata: Metadata = {
  title: "FAQs",
  description:
    "Answers to common questions about lessons, plans and getting started with Correct Student.",
};

// Draft questions and answers for the UI.
const groups = [
  {
    id: "getting-started", title: "Getting started",
    description: "A few things to know before your first lesson.",
    questions: [
      { q: "What is Correct Student?", a: "Correct Student helps children learn African languages and English side by side, through lessons, stories and songs." },
      { q: "Who is Correct Student for?", a: "Correct Student is designed for children learning a new language or reconnecting with their heritage, with parents and guardians supporting their journey." },
      { q: "Do I need any experience to start?", a: "No. The learning journey starts with the basics, so beginners can build confidence one step at a time." },
      { q: "How do I sign up?", a: "Select Get Started, choose whether you are a student or a teacher, and fill in the registration form." },
    ],
  },
  {
    id: "learning", title: "Languages and learning",
    description: "Find a way to learn that feels right for you.",
    questions: [
      { q: "Which languages can I learn?", a: "Explore Yoruba, Igbo, Hausa and Fulani, with English alongside each language." },
      { q: "How do lessons, stories and songs work together?", a: "Lessons introduce words and phrases, stories put them into context, and songs make practice playful through rhythm and repetition." },
      { q: "Are there one-on-one classes?", a: "One-on-one classes offer time to practise conversations and ask a teacher questions. Explore the Classes page or contact us to discuss your learner’s needs." },
      { q: "Can I teach on Correct Student?", a: "Choose the teacher option on the Get Started page. If you have questions about teaching, contact us to learn more." },
    ],
  },
  {
    id: "plans", title: "Plans and support",
    description: "Help choosing your next step.",
    questions: [
      { q: "Is there a free plan?", a: "Yes. The Free plan is the starting point. Visit Pricing to compare what is included in Free, Starter, Plus and Premium." },
      { q: "Which currencies can I view prices in?", a: "Use the currency dropdown on the Pricing page to switch between Naira, Dollar and Pounds." },
      { q: "How can I contact you?", a: "Visit Contact Us for our contact details and to share your question. We can help you understand the learning approach and choose a plan." },
    ],
  },
];

export default function FaqsPage() {
  return (
    <section className="bg-linear-to-b from-secondary via-background to-background py-16 md:py-24">
      <Container>
        <div className="mx-auto max-w-2xl text-center">
          <h1 className="text-4xl sm:text-5xl">Frequently Asked Questions</h1>
          <p className="mt-4 text-lg leading-relaxed text-foreground/80">From your first hello to choosing a plan. Find answers to common questions about learning with Correct Student.</p>
        </div>
        <div className="mt-12 grid items-start gap-10 lg:grid-cols-[16rem_minmax(0,1fr)] lg:gap-16">
          <nav aria-label="FAQ categories" className="rounded-2xl border border-border bg-card p-6 shadow-sm lg:sticky lg:top-28">
            <h2 className="text-base text-foreground">Browse by topic</h2>
            <ul className="mt-4 space-y-3">
              {groups.map((group) => (
                <li key={group.id}><a href={`#${group.id}`} className="block rounded-sm text-sm leading-6 text-muted-foreground transition-colors hover:text-primary focus-visible:outline-2 focus-visible:outline-ring">{group.title}</a></li>
              ))}
            </ul>
            <div className="mt-6 border-t border-border pt-5">
              <p className="text-sm text-muted-foreground">Need a little more help?</p>
              <Link href="/contact-us" className="mt-2 inline-flex items-center gap-2 text-sm font-medium text-primary hover:underline">Talk to us <ArrowRight className="size-4" aria-hidden /></Link>
            </div>
          </nav>
          <div className="min-w-0 max-w-4xl space-y-12">
            {groups.map((group) => (
              <section key={group.id} id={group.id} aria-labelledby={`${group.id}-heading`} className="scroll-mt-28">
                <h2 id={`${group.id}-heading`} className="text-2xl">{group.title}</h2>
                <p className="mt-2 leading-7 text-muted-foreground">{group.description}</p>
                <div className="mt-5 overflow-hidden rounded-2xl border border-border bg-card shadow-sm">
                  {group.questions.map(({ q, a }) => (
                    <details key={q} className="group border-b border-border last:border-0 open:bg-secondary/30">
                      <summary className="flex cursor-pointer list-none items-center justify-between gap-4 p-5 font-heading text-base font-medium text-foreground transition-colors hover:bg-secondary/30 focus-visible:outline-2 focus-visible:-outline-offset-2 focus-visible:outline-ring sm:p-6 sm:text-lg [&::-webkit-details-marker]:hidden">
                        {q}<ChevronDown className="size-5 shrink-0 text-primary transition-transform group-open:rotate-180 motion-reduce:transition-none" aria-hidden />
                      </summary>
                      <p className="max-w-3xl px-5 pb-5 leading-7 text-muted-foreground sm:px-6 sm:pb-6">{a}</p>
                    </details>
                  ))}
                </div>
              </section>
            ))}
          </div>
        </div>
        <div className="mx-auto mt-16 max-w-3xl rounded-3xl border border-border bg-secondary/50 p-6 text-center sm:p-10">
          <MessageCircle className="mx-auto size-8 text-primary" aria-hidden />
          <h2 className="mt-4 text-2xl sm:text-3xl">Still have a question?</h2>
          <p className="mt-3 leading-7 text-muted-foreground">We’re happy to help you find your way. Let’s talk about what you need.</p>
          <Link href="/contact-us" className={`${buttonVariants({ variant: "cta", size: "xl" })} mt-6`}>Contact Us <ArrowRight className="size-4" aria-hidden /></Link>
        </div>
      </Container>
    </section>
  );
}
