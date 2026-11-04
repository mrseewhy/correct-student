"use client";

import { useState, Suspense } from "react";
import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Languages, Users, UsersRound, Newspaper, Bookmark, BookOpen, GraduationCap, ChevronLeft, ChevronRight, LogOut, Home, LayoutDashboard, Menu, Settings, ShoppingBag, Mail, MessageSquare, MessageCircle, CreditCard, Receipt, TicketPercent, Activity, Package, CalendarDays, ClipboardCheck, Library, FileText, Video, Award, Cloud } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetTitle } from "@/components/ui/sheet";
import { signOutAction } from "@/lib/auth/actions";
import { type DashboardNavItem } from "@/lib/dashboard";
import { cn } from "@/lib/utils";
import { ThemeToggle } from "@/components/theme-toggle";

const icons = { overview: LayoutDashboard, classes: BookOpen, saved: Bookmark, orders: Receipt, settings: Settings, learning: GraduationCap, shop: ShoppingBag, languages: Languages, users: Users, blog: Newspaper, newsletter: Mail, contact: MessageSquare, subscriptions: CreditCard, students: UsersRound, tutors: Users, products: Package, coupons: TicketPercent, activities: Activity, schedule: CalendarDays, assignments: ClipboardCheck, messages: MessageCircle, resources: Library, "content-types": FileText, "media-types": Video, levels: Award, media: Cloud };

function currentItem(navigationItems: readonly DashboardNavItem[], basePath: string, homePath: string, pathname: string) {
  return navigationItems.find((item) => item.slug ? (pathname === `${basePath}/${item.slug}` || pathname.startsWith(`${basePath}/${item.slug}/`)) : pathname === homePath);
}

function CurrentTitle({ navigationItems, basePath, homePath }: { navigationItems: readonly DashboardNavItem[]; basePath: string; homePath: string; }) {
  const pathname = usePathname();
  const current = currentItem(navigationItems, basePath, homePath, pathname);
  return <p className="truncate font-heading text-sm font-medium text-foreground sm:text-base">{current?.label ?? "Dashboard"}</p>;
}

function NavMenu({ navigationItems, basePath, homePath, expanded, onNavigate, drawer = false }: { navigationItems: readonly DashboardNavItem[]; basePath: string; homePath: string; expanded: boolean; onNavigate: () => void; drawer?: boolean; }) {
  const pathname = usePathname();
  const current = currentItem(navigationItems, basePath, homePath, pathname);
  return <nav aria-label={drawer ? "Mobile dashboard" : "Dashboard"} className="space-y-1">
    {navigationItems.filter((item) => item.slug !== "settings").map((item) => {
      const Icon = icons[item.icon];
      const href = item.slug ? `${basePath}/${item.slug}` : homePath;
      const active = item === current;
      return <Link key={href} href={href} onClick={onNavigate} aria-current={active ? "page" : undefined} title={item.label} className={cn("flex min-h-9 items-center rounded-xl font-heading text-sm font-medium transition-colors focus-visible:outline-2 focus-visible:outline-ring", active ? "bg-sidebar-accent text-sidebar-primary" : "text-muted-foreground hover:bg-sidebar-accent/60 hover:text-sidebar-foreground", drawer ? "gap-3 px-4" : expanded ? "justify-center px-2 md:justify-start md:gap-3 md:px-4" : "justify-center px-2")}>
        <Icon className="size-5 shrink-0" aria-hidden />
        <span className={drawer ? "" : expanded ? "sr-only md:not-sr-only" : "sr-only"}>{item.label}</span>
      </Link>;
    })}
  </nav>;
}

function SidebarAccountActions({ basePath, expanded, drawer = false }: { basePath: string; expanded: boolean; drawer?: boolean; }) {
  const pathname = usePathname();
  const settingsActive = pathname === `${basePath}/settings` || pathname.startsWith(`${basePath}/settings/`);
  const labelClass = drawer ? "" : expanded ? "sr-only md:not-sr-only" : "sr-only";
  const className = cn("flex min-h-9 items-center rounded-xl text-sm transition-colors focus-visible:outline-2 focus-visible:outline-ring", drawer ? "gap-3 px-4" : expanded ? "justify-center md:justify-start md:gap-3 md:px-4" : "justify-center");
  return <>
    <Link href={`${basePath}/settings`} title="Settings" aria-current={settingsActive ? "page" : undefined} className={cn(className, settingsActive ? "bg-sidebar-accent text-sidebar-primary" : "text-muted-foreground hover:bg-sidebar-accent hover:text-sidebar-foreground")}><Settings className="size-5 shrink-0" aria-hidden /><span className={labelClass}>Settings</span></Link>
    <form action={signOutAction}>
      <button type="submit" title="Logout" className={cn(className, "text-muted-foreground hover:bg-destructive/10 hover:text-destructive")}><LogOut className="size-5 shrink-0" aria-hidden /><span className={labelClass}>Logout</span></button>
    </form>
  </>;
}

export function DashboardShell({ children, navigationItems, basePath, homePath, account }: {
  children: React.ReactNode;
  navigationItems: readonly DashboardNavItem[];
  basePath: string;
  homePath: string;
  account: React.ReactNode;
}) {
  const [expanded, setExpanded] = useState(true);
  const [drawerOpen, setDrawerOpen] = useState(false);

  return <div className="min-h-dvh bg-background">
    <a href="#dashboard-content" className="sr-only z-50 rounded-lg bg-card px-4 py-3 text-primary focus:not-sr-only focus:fixed focus:top-3 focus:left-20">Skip to content</a>
    <aside id="dashboard-sidebar" aria-label="Sidebar" className={cn("fixed inset-y-0 left-0 z-40 flex w-16 flex-col border-r border-sidebar-border bg-sidebar transition-[width] duration-200 motion-reduce:transition-none", expanded && "md:w-64")}>
      <div className="flex h-20 shrink-0 items-center justify-center border-b border-sidebar-border px-3">
        <Link href={homePath} aria-label="Correct Student dashboard" className="flex items-center justify-center">
          <span className={cn("flex size-9 items-center justify-center rounded-xl bg-primary font-heading text-sm font-bold text-primary-foreground", expanded && "md:hidden")}>CS</span>
          {expanded && <Image src="/logo.png" alt="Correct Student" width={160} height={80} priority className="hidden h-14 w-auto md:block" />}
        </Link>
      </div>
      <div className="flex-1 overflow-y-auto px-2 py-4 md:px-3">
        <p className={cn("mb-3 px-4 text-xs font-medium tracking-widest text-muted-foreground uppercase", expanded ? "hidden md:block" : "hidden")}>Workspace</p>
        <Suspense fallback={<div className="h-40" />}>
          <NavMenu navigationItems={navigationItems} basePath={basePath} homePath={homePath} expanded={expanded} onNavigate={() => setDrawerOpen(false)} />
        </Suspense>
      </div>
      <div className="shrink-0 space-y-0.5 border-t border-sidebar-border px-2 py-3 md:px-3">
        <Suspense fallback={<div className="h-20" />}>
          <SidebarAccountActions basePath={basePath} expanded={expanded} />
        </Suspense>
        <Link href="/" target="_blank" rel="noopener noreferrer" title="Back to website" className={cn("flex min-h-9 items-center rounded-xl text-sm text-muted-foreground hover:bg-sidebar-accent hover:text-sidebar-foreground", expanded ? "justify-center md:justify-start md:gap-3 md:px-4" : "justify-center")}><Home className="size-5 shrink-0" aria-hidden /><span className={expanded ? "sr-only md:not-sr-only" : "sr-only"}>Back to website</span></Link>
        <Button variant="ghost" size="icon" className="w-full md:hidden" aria-label="Expand dashboard menu" aria-haspopup="dialog" onClick={() => setDrawerOpen(true)}><ChevronRight className="size-5" /></Button>
        <Button variant="ghost" className="hidden w-full md:flex" aria-label={expanded ? "Collapse sidebar" : "Expand sidebar"} aria-expanded={expanded} aria-controls="dashboard-sidebar" onClick={() => setExpanded(!expanded)}>{expanded ? <><ChevronLeft className="size-4" />Collapse sidebar</> : <ChevronRight className="size-5" />}</Button>
      </div>
    </aside>

    <div className={cn("pl-16 transition-[padding] duration-200 motion-reduce:transition-none", expanded && "md:pl-64")}>
      <header className={cn("fixed top-0 right-0 left-16 z-30 flex h-20 items-center justify-between gap-3 border-b border-border bg-background/95 px-4 backdrop-blur transition-[left] duration-200 motion-reduce:transition-none md:px-8", expanded && "md:left-64")}>
        <div className="flex min-w-0 items-center gap-3">
          <Button variant="ghost" size="icon" className="shrink-0 md:hidden" aria-label="Open dashboard menu" aria-haspopup="dialog" onClick={() => setDrawerOpen(true)}><Menu className="size-5" /></Button>
          <div className="min-w-0"><p className="hidden text-xs text-muted-foreground sm:block">Your workspace</p>
            <Suspense fallback={<p className="truncate font-heading text-sm font-medium text-foreground sm:text-base">Dashboard</p>}>
              <CurrentTitle navigationItems={navigationItems} basePath={basePath} homePath={homePath} />
            </Suspense>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <ThemeToggle />
          {account}
        </div>
      </header>

      <main id="dashboard-content" className="pt-24 px-4 pb-12 md:px-8">
        {children}
      </main>
    </div>

    <Sheet open={drawerOpen} onOpenChange={setDrawerOpen}>
      <SheetContent side="left" className="w-72 p-0">
        <SheetTitle className="sr-only">Navigation</SheetTitle>
        <div className="flex h-20 items-center justify-center border-b border-sidebar-border px-3">
          <Link href={homePath} aria-label="Correct Student dashboard" className="flex items-center justify-center" onClick={() => setDrawerOpen(false)}>
            <Image src="/logo.png" alt="Correct Student" width={160} height={80} priority className="h-14 w-auto" />
          </Link>
        </div>
        <div className="flex-1 overflow-y-auto px-2 py-4">
          <p className="mb-3 px-4 text-xs font-medium tracking-widest text-muted-foreground uppercase">Workspace</p>
          <Suspense fallback={<div className="h-40" />}>
            <NavMenu navigationItems={navigationItems} basePath={basePath} homePath={homePath} expanded={true} onNavigate={() => setDrawerOpen(false)} drawer={true} />
          </Suspense>
        </div>
        <div className="shrink-0 space-y-0.5 border-t border-sidebar-border px-2 py-3">
          <Suspense fallback={<div className="h-20" />}>
            <SidebarAccountActions basePath={basePath} expanded={true} drawer={true} />
          </Suspense>
          <Link href="/" target="_blank" rel="noopener noreferrer" title="Back to website" className="flex min-h-9 items-center gap-3 rounded-xl px-4 text-sm text-muted-foreground hover:bg-sidebar-accent hover:text-sidebar-foreground" onClick={() => setDrawerOpen(false)}><Home className="size-5 shrink-0" aria-hidden /><span>Back to website</span></Link>
        </div>
      </SheetContent>
    </Sheet>
  </div>;
}
