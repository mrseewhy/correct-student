"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState, Suspense } from "react";
import { Menu } from "lucide-react";

import { buttonVariants } from "@/components/ui/button";
import {
  Sheet,
  SheetContent,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { ThemeToggle } from "@/components/theme-toggle";
import { Container } from "@/components/site/container";
import { Logo } from "@/components/site/logo";
import { cn } from "@/lib/utils";

export const navLinks = [
  { label: "Home", href: "/" },
  { label: "About Us", href: "/about-us" },
  { label: "Pricing", href: "/pricing" },
  { label: "Shop", href: "/shop" },
  { label: "Classes", href: "/classes" },
  { label: "Contact Us", href: "/contact-us" },
];

function isActivePath(pathname: string, href: string) {
  return href === "/" ? pathname === "/" : pathname.startsWith(href);
}

function DesktopNavLinks() {
  const pathname = usePathname();
  return (
    <nav aria-label="Main" className="hidden items-center gap-1 lg:flex">
      {navLinks.map((link) => (
        <Link
          key={link.href}
          href={link.href}
          aria-current={isActivePath(pathname, link.href) ? "page" : undefined}
          className={cn(
            "rounded-md px-3 py-2 text-sm font-bold text-muted-foreground transition-colors hover:text-primary",
            isActivePath(pathname, link.href) && "text-primary",
          )}
        >
          {link.label}
        </Link>
      ))}
    </nav>
  );
}

function MobileNavLinks({ setOpen }: { setOpen: (open: boolean) => void }) {
  const pathname = usePathname();
  return (
    <nav aria-label="Mobile" className="mt-10 flex flex-col gap-1 px-4">
      {navLinks.map((link) => (
        <Link
          key={link.href}
          href={link.href}
          onClick={() => setOpen(false)}
          className={cn(
            "rounded-md px-3 py-3 font-heading text-base font-medium text-foreground hover:bg-accent",
            isActivePath(pathname, link.href) && "bg-secondary text-primary",
          )}
        >
          {link.label}
        </Link>
      ))}
    </nav>
  );
}

export function Navbar() {
  const [open, setOpen] = useState(false);

  return (
    <header className="sticky top-0 z-50 w-full border-b border-border/60 bg-background/80 backdrop-blur supports-backdrop-filter:bg-background/70">
      <Container className="flex h-20 items-center justify-between gap-4">
        <Logo />

        <Suspense fallback={<nav aria-label="Main" className="hidden items-center gap-1 lg:flex" />}>
          <DesktopNavLinks />
        </Suspense>

        <div className="flex items-center gap-2">
          <ThemeToggle />

          <Link
            href="/sign-in"
            className={cn(
              buttonVariants({ variant: "ghost" }),
              "hidden text-primary hover:text-primary sm:inline-flex",
            )}
          >
            Sign In
          </Link>

          <Link
            href="/get-started"
            className={cn(
              buttonVariants({ variant: "cta" }),
              "hidden sm:inline-flex",
            )}
          >
            Get Started
          </Link>

          <Sheet open={open} onOpenChange={setOpen}>
            <SheetTrigger
              aria-label="Open menu"
              className={cn(
                buttonVariants({ variant: "ghost", size: "icon" }),
                "lg:hidden",
              )}
            >
              <Menu className="size-5" />
            </SheetTrigger>

            <SheetContent side="right" className="w-72">
              <SheetTitle className="sr-only">Menu</SheetTitle>
              <Suspense fallback={<nav aria-label="Mobile" className="mt-10 flex flex-col gap-1 px-4" />}>
                <MobileNavLinks setOpen={setOpen} />
              </Suspense>

              <div className="mt-4 flex flex-col gap-2">
                <Link
                  href="/sign-in"
                  onClick={() => setOpen(false)}
                  className={cn(
                    buttonVariants({ variant: "outline", size: "lg" }),
                  )}
                >
                  Sign In
                </Link>
                <Link
                  href="/get-started"
                  onClick={() => setOpen(false)}
                  className={cn(
                    buttonVariants({ variant: "cta", size: "lg" }),
                  )}
                >
                  Get Started
                </Link>
              </div>
            </SheetContent>
          </Sheet>
        </div>
      </Container>
    </header>
  );
}