import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { Container } from "@/components/site/container";
import { buttonVariants } from "@/components/ui/button";

type PolicySection = { title: string; body: string };

export function PolicyLayout({ title, description, updated, sections, related }: {
  title: string;
  description: string;
  updated: string;
  sections: PolicySection[];
  related: { title: string; href: string };
}) {
  return (
    <section className="bg-linear-to-b from-secondary via-background to-background py-16 md:py-24">
      <Container>
        <div className="mx-auto max-w-2xl text-center">
          <h1 className="text-4xl sm:text-5xl">{title}</h1>
          <p className="mt-4 text-lg leading-relaxed text-foreground/80">{description}</p>
          <p className="mt-5 text-sm text-muted-foreground">Last updated: {updated}</p>
        </div>
        <div className="mt-12 grid items-start gap-10 lg:grid-cols-[16rem_minmax(0,1fr)] lg:gap-16">
          <aside className="lg:sticky lg:top-28">
            <nav aria-label={`${title} contents`} className="rounded-2xl border border-border bg-card p-6 shadow-sm">
              <h2 className="text-base text-foreground">On this page</h2>
              <ol className="mt-4 space-y-3">
                {sections.map((section, index) => (
                  <li key={section.title}>
                    <a href={`#section-${index + 1}`} className="block rounded-sm text-sm leading-6 text-muted-foreground transition-colors hover:text-primary focus-visible:outline-2 focus-visible:outline-ring">
                      {section.title}
                    </a>
                  </li>
                ))}
              </ol>
            </nav>
            <Link href={related.href} className="mt-5 inline-flex items-center gap-2 text-sm font-medium text-primary hover:underline">
              {related.title} <ArrowRight className="size-4" aria-hidden />
            </Link>
          </aside>
          <div className="min-w-0">
            <div className="max-w-3xl space-y-10 md:space-y-12">
              {sections.map((section, index) => (
                <section key={section.title} id={`section-${index + 1}`} aria-labelledby={`heading-${index + 1}`} className="scroll-mt-28 border-b border-border pb-10 last:border-0 last:pb-0 md:pb-12">
                  <h2 id={`heading-${index + 1}`} className="text-xl sm:text-2xl">{section.title}</h2>
                  <p className="mt-4 text-base leading-8 text-foreground/80 sm:text-lg">{section.body}</p>
                </section>
              ))}
            </div>
            <div className="mt-12 flex max-w-3xl flex-col items-start gap-5 rounded-2xl border border-border bg-card p-6 shadow-sm sm:flex-row sm:items-center sm:justify-between sm:p-8">
              <div>
                <h2 className="text-xl">Have a question?</h2>
                <p className="mt-2 text-sm leading-6 text-muted-foreground">Get in touch if you need help understanding this page.</p>
              </div>
              <Link href="/contact-us" className={buttonVariants({ variant: "outline", size: "lg" })}>Contact Us <ArrowRight className="size-4" aria-hidden /></Link>
            </div>
          </div>
        </div>
      </Container>
    </section>
  );
}
