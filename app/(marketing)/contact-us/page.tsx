import type { Metadata } from "next";

import Link from "next/link";
import { Clock, Mail } from "lucide-react";

import { Container } from "@/components/site/container";
import { ContactForm } from "@/components/site/contact-form";

export const metadata: Metadata = {
  title: "Contact Us",
  description:
    "Questions about lessons, stories, songs or one-on-one classes? Reach out and we will get back to you.",
};

// Placeholder details: replace with your real ones
const contactDetails = [
  {
    label: "Email us",
    value: "hello@correctstudent.com",
    href: "mailto:hello@correctstudent.com",
    icon: Mail,
  },
  {
    label: "Support hours",
    value: "Monday to Friday, 9am to 5pm",
    icon: Clock,
  },
];

export default function ContactPage() {
  return (
    <section className="bg-linear-to-b from-secondary via-background to-background py-16 md:py-24">
      <Container>
        <div className="mx-auto max-w-2xl text-center">
          <h1 className="text-4xl sm:text-5xl">Contact Us</h1>
          <p className="mt-4 text-lg text-foreground/80">
            Have a question about lessons, stories, songs or one-on-one classes?
            Reach out and we will get back to you.
          </p>
        </div>

        <div className="mt-12 grid gap-8 lg:grid-cols-5 lg:gap-12">
          {/* Contact details */}
          <div className="space-y-4 lg:col-span-2">
            {contactDetails.map(({ label, value, href, icon: Icon }) => (
              <div
                key={label}
                className="flex items-center gap-4 rounded-2xl border border-border bg-card p-5 shadow-sm"
              >
                <span className="flex size-12 shrink-0 items-center justify-center rounded-full bg-secondary text-primary">
                  <Icon className="size-5" />
                </span>
                <div>
                  <p className="text-sm text-muted-foreground">{label}</p>
                  {href ? (
                    <a
                      href={href}
                      className="font-heading font-medium text-foreground hover:text-primary"
                    >
                      {value}
                    </a>
                  ) : (
                    <p className="font-heading font-medium text-foreground">
                      {value}
                    </p>
                  )}
                </div>
              </div>
            ))}

            <p className="px-1 pt-2 text-sm text-muted-foreground">
              Looking for a quick answer? Check our{" "}
              <Link
                href="/faqs"
                className="font-medium text-primary hover:underline"
              >
                FAQs
              </Link>
              .
            </p>
          </div>

          {/* Form */}
          <ContactForm />
        </div>
      </Container>
    </section>
  );
}
