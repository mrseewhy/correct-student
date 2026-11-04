import Link from "next/link";

import { Container } from "@/components/site/container";
import { Logo } from "@/components/site/logo";
import { NewsletterForm } from "@/components/site/newsletter-form";
import { cacheLife } from "next/cache";

const company = [
  { label: "About Us", href: "/about-us" },
  { label: "Features", href: "/features" },
  { label: "FAQs", href: "/faqs" },
  { label: "Our Blog", href: "/blog" },
];

const help = [
  { label: "Contact Us", href: "/contact-us" },
  { label: "Pricing", href: "/pricing" },
  { label: "Terms & Conditions", href: "/terms" },
  { label: "Privacy Policy", href: "/privacy" },
];

function FooterColumn({
  title,
  links,
}: {
  title: string;
  links: { label: string; href: string }[];
}) {
  return (
    <div>
      <h3 className="font-heading text-xs font-bold uppercase tracking-widest text-foreground">
        {title}
      </h3>
      <ul className="mt-4 space-y-3">
        {links.map((link) => (
          <li key={link.href}>
            <Link
              href={link.href}
              className="text-sm text-muted-foreground transition-colors hover:text-primary"
            >
              {link.label}
            </Link>
          </li>
        ))}
      </ul>
    </div>
  );
}

// The year is cached under cacheComponents so the copyright stays stable
// across prerendering. 'hours' revalidates every hour and expires after
// a day, so the copyright rolls over shortly after New Year.
async function getCurrentYear() {
  "use cache";
  cacheLife("hours");
  return new Date().getFullYear();
}

export async function Footer() {
  const year = await getCurrentYear();
  return (
    <footer className="border-t border-border bg-secondary/50">
      <Container className="pt-12 pb-8  md:pt-16 md:pb-8">
        <div className="grid gap-10 md:grid-cols-2 lg:grid-cols-[1fr_1fr_1.4fr]">
          <div className="space-y-5">
            <Logo />
            <p className="max-w-xs text-sm text-muted-foreground">
              Learn African languages and English through lessons, stories and
              songs.
            </p>
          </div>

          <FooterColumn title="Company" links={company} />
          <FooterColumn title="Help" links={help} />

          <div>
            <h3 className="font-heading text-xs font-bold uppercase tracking-widest text-foreground">
              Subscribe to newsletter
            </h3>
            <div className="mt-4 max-w-sm">
              <NewsletterForm />
            </div>
          </div>
        </div>

        <div className="mt-12 border-t border-border pt-6 text-center text-sm text-muted-foreground">
          &copy; {year}, All Rights Reserved by Correct Student.
        </div>
      </Container>
    </footer>
  );
}
