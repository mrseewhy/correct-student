import { Suspense } from "react";
import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { requireRole } from "@/lib/auth/session";

export const instant = false;
import { adminPages } from "@/lib/dashboard";
import { findAdminSection } from "@/lib/admin-data";
import { contactMessageStats } from "@/lib/data/dal/contact";

const highlights = ["students", "tutors", "classes", "products", "orders"];

export default function AdminDashboardPage() {
  return (
    <Suspense fallback={
      <div className="mx-auto max-w-site motion-safe:animate-pulse" role="status" aria-label="Loading overview">
        <span className="sr-only">Loading overview…</span>
        <div aria-hidden="true" className="space-y-6">
          <div className="h-4 w-28 rounded-full bg-muted" />
          <div className="h-10 w-52 rounded-lg bg-muted" />
          <div className="mt-3 h-4 w-80 max-w-full rounded-lg bg-muted" />
          <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
            {Array.from({ length: 6 }, (_, index) => (
              <div key={index} className="h-28 rounded-2xl border border-border bg-card" />
            ))}
          </div>
        </div>
      </div>
    }><AdminDashboardContent /></Suspense>
  );
}

async function AdminDashboardContent() {
  // Page-level authorization (layouts render in parallel with pages).
  const { user } = await requireRole(["admin", "super-admin"]);
  return <div className="mx-auto max-w-site"><p className="text-xs font-semibold uppercase tracking-widest text-primary">Administration</p><h1 className="mt-2 text-3xl sm:text-4xl">Overview</h1><p className="mt-3 text-muted-foreground">Your content, community and commerce in one place.</p><div className="mt-8 grid gap-4 sm:grid-cols-2 xl:grid-cols-3">{highlights.map((slug) => { const section = findAdminSection(slug)!; return <Link key={slug} href={`/admin/${slug}`} className="rounded-2xl border border-border bg-card p-6 shadow-sm transition-colors hover:border-primary"><p className="text-sm text-muted-foreground">{section.label}</p><p className="mt-3 font-heading text-3xl font-bold text-primary">{section.records.length}</p><span className="mt-4 inline-flex items-center gap-2 text-xs font-medium text-primary">View {section.label.toLowerCase()} <ArrowRight className="size-3" aria-hidden /></span></Link>; })}<Suspense fallback={<ContactCard unread={null} total={null} />}><ContactMessagesCard /></Suspense></div>{user.role === "super-admin" && <Link href="/admin/staff" className="mt-8 flex items-center justify-between rounded-2xl border border-primary/30 bg-card p-6 transition-colors hover:border-primary"><div><h2 className="text-xl">Manage administrators</h2><p className="mt-2 text-sm text-muted-foreground">Create, review and manage admin accounts.</p></div><ArrowRight className="size-5 text-primary" aria-hidden /></Link>}<h2 className="mt-12 text-2xl">Manage the platform</h2><div className="mt-6 grid gap-4 sm:grid-cols-2 xl:grid-cols-3">{adminPages.filter((item) => item.slug !== "dashboard" && item.slug !== "settings").map((item) => <Link key={item.slug} href={`/admin/${item.slug}`} className="rounded-2xl border border-border bg-card p-5 transition-colors hover:border-primary"><h3 className="text-lg">{item.label}</h3><p className="mt-2 text-sm leading-6 text-muted-foreground">{item.description}</p><span className="mt-4 inline-flex items-center gap-2 text-sm font-medium text-primary">Open section <ArrowRight className="size-4" aria-hidden /></span></Link>)}</div></div>;
}

async function ContactMessagesCard() {
  const { unread, total } = await contactMessageStats();
  return <ContactCard unread={unread} total={total} />;
}

function ContactCard({ unread, total }: { unread: number | null; total: number | null }) {
  return <Link href="/admin/contact" className="rounded-2xl border border-border bg-card p-6 shadow-sm transition-colors hover:border-primary"><p className="text-sm text-muted-foreground">Contact</p><p className="mt-3 font-heading text-3xl font-bold text-primary">{unread ?? "—"}</p><p className="mt-1 text-xs text-muted-foreground">{total === null ? "unread messages" : `unread of ${total} message${total === 1 ? "" : "s"}`}</p><span className="mt-4 inline-flex items-center gap-2 text-xs font-medium text-primary">View messages <ArrowRight className="size-3" aria-hidden /></span></Link>;
}
