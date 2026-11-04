import type { Metadata } from "next";

import Link from "next/link";
import Image from "next/image";
import { ArrowRight } from "lucide-react";

import { Container } from "@/components/site/container";
import { buttonVariants } from "@/components/ui/button";

export const metadata: Metadata = {
  title: "About Us",
  description:
    "Learn more about Correct Student, our mission and the community behind the platform.",
};

const values = [
  {
    title: "Pride in our culture",
    description:
      "We celebrate the stories, traditions and communities behind every language. Learning is also a way to remember where we come from.",
  },
  {
    title: "Joy in learning",
    description:
      "We make room for curiosity, creativity and play. A story or a song can turn an unfamiliar word into something a learner wants to return to.",
  },
  {
    title: "Care for every learner",
    description:
      "We value patience and encouragement. Every learner deserves to feel welcome and to grow at a pace that works for them.",
  },
  {
    title: "Honesty and openness",
    description:
      "We aim to communicate clearly, listen to questions and learn from feedback. Trust grows through the everyday care we put into our work.",
  },
];

export default function AboutUsPage() {
  return (
    <>
      <section className="bg-linear-to-b from-secondary via-background to-background pt-16 pb-12 md:pt-24 md:pb-16">
        <Container>
          <div className="mx-auto max-w-2xl text-center">
            <h1 className="text-4xl sm:text-5xl">About Us</h1>
            <p className="mt-4 text-lg leading-relaxed text-foreground/80">
              Language brings us closer to our roots, our stories and each
              other. That connection is at the heart of Correct Student.
            </p>
          </div>
          <div className="mt-12 grid items-center gap-12 md:mt-16 lg:grid-cols-2 lg:gap-20">
            <div className="relative aspect-5/4 w-full overflow-hidden rounded-3xl">
              <Image
                src="/img/about-1.jpg"
                alt="A parent sharing a story with a child"
                fill
                priority
                sizes="(min-width: 1024px) 50vw, 100vw"
                className="object-cover"
              />
            </div>
            <div className="max-w-xl">
              <h2 className="text-2xl sm:text-3xl">
                Every language carries a story
              </h2>
              <p className="mt-6 text-lg leading-8 text-foreground/80">
                It might be a greeting from a grandparent, a song remembered
                from childhood or a story told at home. The words we share
                connect us to people, places and memories that matter.
              </p>
              <p className="mt-5 text-lg leading-8 text-muted-foreground">
                Correct Student is built around a simple idea: learning African
                languages should feel welcoming and meaningful. Through lessons,
                stories and songs, we bring African languages and English
                together to help learners find their voice and explore the
                cultures behind the words.
              </p>
            </div>
          </div>
        </Container>
      </section>

      <section className="py-12 md:py-20" aria-labelledby="purpose-heading">
        <Container>
          <h2 id="purpose-heading" className="text-2xl sm:text-3xl">
            What we are here to do
          </h2>
          <div className="mt-8 grid gap-8 md:grid-cols-2">
            {[
              {
                title: "Our Mission",
                image: "/img/mission.jpg",
                alt: "A child learning with a teacher",
                description:
                  "To make learning African languages and English accessible, engaging and meaningful. We want to help learners build confidence through lessons, stories and songs, while staying connected to the cultures that give language its life.",
              },
              {
                title: "Our Vision",
                image: "/img/vision.jpg",
                alt: "Children sharing a moment of learning together",
                description:
                  "A future where children speak with confidence, take pride in their heritage and connect across cultures. A future where African languages continue to thrive, shared from one generation to the next.",
              },
            ].map((item) => (
              <article
                key={item.title}
                className="overflow-hidden rounded-3xl border border-border bg-card shadow-xl shadow-primary/5"
              >
                <div className="relative aspect-16/9 w-full">
                  <Image
                    src={item.image}
                    alt={item.alt}
                    fill
                    sizes="(min-width: 768px) 50vw, 100vw"
                    className="object-cover"
                  />
                </div>
                <div className="p-6 sm:p-8">
                  <h3 className="text-2xl">{item.title}</h3>
                  <p className="mt-4 text-lg leading-8 text-muted-foreground">
                    {item.description}
                  </p>
                </div>
              </article>
            ))}
          </div>
        </Container>
      </section>

      <section
        className="bg-secondary/40 py-16 md:py-24"
        aria-labelledby="values-heading"
      >
        <Container>
          <div className="grid gap-10 lg:grid-cols-[1fr_2fr] lg:gap-20">
            <div className="max-w-sm">
              <h2 id="values-heading" className="text-2xl sm:text-3xl">
                Our Core Values
              </h2>
              <p className="mt-5 text-lg leading-8 text-muted-foreground">
                What we believe shapes how we create, teach and care for our
                learners.
              </p>
            </div>
            <div className="grid gap-x-12 gap-y-10 sm:grid-cols-2 md:gap-y-12">
              {values.map((value) => (
                <div
                  key={value.title}
                  className="border-t border-primary/20 pt-5"
                >
                  <h3 className="text-xl">{value.title}</h3>
                  <p className="mt-4 leading-7 text-muted-foreground">
                    {value.description}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </Container>
      </section>

      <section className="py-16 md:py-24" aria-labelledby="trust-heading">
        <Container>
          <div className="grid items-center gap-12 lg:grid-cols-2 lg:gap-20">
            <div className="relative aspect-5/4 w-full overflow-hidden rounded-3xl">
              <Image
                src="/img/inter.jpg"
                alt="The Correct Student team preparing a lesson"
                fill
                sizes="(min-width: 1024px) 50vw, 100vw"
                className="object-cover"
              />
            </div>
            <div className="max-w-xl">
              <h2 id="trust-heading" className="text-2xl sm:text-3xl">
                Trust starts with understanding
              </h2>
              <p className="mt-6 text-lg leading-8 text-foreground/80">
                Choosing where to learn is personal. You should be able to
                understand the approach, ask questions and decide what feels
                right for your learner.
              </p>
              <p className="mt-5 leading-7 text-muted-foreground">
                Our approach brings lessons, stories and songs together, with
                respect for the languages and communities they represent. We
                value clear communication and welcome conversations about your
                goals, your questions and the support you need.
              </p>
              <p className="mt-5 leading-7 text-muted-foreground">
                Take a look at our learning features and plans, or speak with us
                before getting started. We want your next step to be an informed
                one.
              </p>
              <Link
                href="/contact-us"
                className={`${buttonVariants({ variant: "link" })} mt-5 px-0`}
              >
                Get to know us <ArrowRight className="size-4" aria-hidden />
              </Link>
            </div>
          </div>
          <div className="mx-auto mt-20 max-w-2xl border-t border-border pt-12 text-center md:mt-24">
            <h2 className="text-2xl sm:text-3xl">
              Let’s keep the conversation going
            </h2>
            <p className="mt-4 text-lg leading-8 text-muted-foreground">
              Discover a new language. Reconnect with a familiar one. Start your
              journey with Correct Student.
            </p>
            <div className="mt-7 flex flex-wrap justify-center gap-3">
              <Link
                href="/get-started"
                className={buttonVariants({ variant: "cta", size: "xl" })}
              >
                Get Started <ArrowRight className="size-4" aria-hidden />
              </Link>
              <Link
                href="/features"
                className={buttonVariants({ variant: "outline", size: "xl" })}
              >
                Explore Features
              </Link>
            </div>
          </div>
        </Container>
      </section>
    </>
  );
}
