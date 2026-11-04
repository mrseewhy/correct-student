import { Suspense } from "react";
import { TableSkeleton } from "@/components/dashboard/table-skeleton";

export const instant = false;
import { NewsletterCsvButton } from "@/components/dashboard/newsletter-csv";
import { listNewsletterSubscriptions } from "@/lib/data/dal/newsletter";
import { requireRole } from "@/lib/auth/session";
import { parseNewsletterFilters } from "@/validation/newsletter-admin";

export default async function NewsletterAdminPage({ searchParams }: { searchParams: Promise<Record<string, string | string[] | undefined>> }) {
  // Page-level authorization (layouts render in parallel with pages); the
  // gated subscriber list below only renders once the check passes.
  await requireRole(["admin", "super-admin"]);
  return <Suspense fallback={<TableSkeleton />}><NewsletterContent searchParams={searchParams} /></Suspense>;
}

async function NewsletterContent({ searchParams }: { searchParams: Promise<Record<string, string | string[] | undefined>> }) {
  const params = await searchParams;
  const filter = parseNewsletterFilters(params);
  const rows = await listNewsletterSubscriptions(filter);
  return <div className="mx-auto max-w-site"><div className="flex flex-wrap items-end justify-between gap-4"><div><p className="text-xs font-semibold uppercase tracking-widest text-primary">Administration</p><h1 className="mt-2 text-3xl sm:text-4xl">Newsletter</h1><p className="mt-3 text-muted-foreground">Subscriber emails, newest first.</p></div><NewsletterCsvButton rows={rows.map((row) => ({ email: row.email, subscribedAt: row.subscribedAt.toISOString(), status: row.status }))} /></div><form method="get" className="mt-8 flex flex-wrap items-end gap-4 rounded-2xl border border-border bg-card p-5"><label className="grid gap-2 text-sm font-medium">Show<select name="count" defaultValue={filter.count} className="h-10 rounded-md border border-input bg-background px-3">{[10,20,50,100].map((count) => <option key={count} value={count}>{count}</option>)}</select></label><label className="grid gap-2 text-sm font-medium">From<input name="from" type="date" defaultValue={filter.from ?? ""} className="h-10 w-64 rounded-md border border-input bg-background px-3" /></label><label className="grid gap-2 text-sm font-medium">To<input name="to" type="date" defaultValue={filter.to ?? ""} className="h-10 w-64 rounded-md border border-input bg-background px-3" /></label><button type="submit" className="h-10 rounded-md border border-border px-5 text-sm font-medium">Apply filters</button></form><p className="mt-4 text-sm text-muted-foreground">Showing {rows.length} subscriber{rows.length === 1 ? "" : "s"}</p><div className="mt-4 overflow-hidden rounded-2xl border border-border bg-card"><div className="grid grid-cols-[minmax(0,1fr)_auto] gap-4 border-b border-border bg-secondary/40 px-5 py-3 text-xs font-semibold uppercase tracking-wide text-muted-foreground"><span>Email</span><span>Subscribed</span></div>{rows.length ? <ul className="divide-y divide-border">{rows.map((row) => <li key={row.id} className="grid gap-4 px-5 py-4 text-sm md:grid-cols-[minmax(0,1fr)_auto_minmax(0,2fr)] md:items-center"><span className="min-w-0 break-all">{row.email}</span><time dateTime={row.subscribedAt.toISOString()} className="text-muted-foreground">{row.subscribedAt.toLocaleDateString("en-GB", { day: "numeric", month: "short", year: "numeric", timeZone: "UTC" })}</time></li>)}</ul> : <p className="px-5 py-10 text-center text-sm text-muted-foreground">No subscribers match these filters.</p>}</div></div>;
}
