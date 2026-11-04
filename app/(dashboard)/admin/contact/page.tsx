import { Suspense } from "react";
import { markContactMessage } from "@/lib/data/actions/contact-admin";

export const instant = false;
import { contactMessageStats, listContactMessages } from "@/lib/data/dal/contact";
import { parseContactFilters } from "@/validation/contact-admin";
import { requireRole } from "@/lib/auth/session";
import { TableSkeleton } from "@/components/dashboard/table-skeleton";

export default async function ContactAdminPage({ searchParams }: { searchParams: Promise<Record<string, string | string[] | undefined>> }) {
  // Page-level authorization (layouts render in parallel with pages); the
  // gated message list below only renders once the check passes.
  await requireRole(["admin", "super-admin"]);
  return <Suspense fallback={<TableSkeleton />}><ContactContent searchParams={searchParams} /></Suspense>;
}

async function ContactContent({ searchParams }: { searchParams: Promise<Record<string, string | string[] | undefined>> }) {
  const params = await searchParams;
  const filter = parseContactFilters(params);
  const [rows, stats] = await Promise.all([listContactMessages(filter), contactMessageStats()]);

  return (
    <div className="mx-auto max-w-site">
      <div className="flex flex-wrap items-end justify-between gap-4">
        <div>
          <p className="text-xs font-semibold uppercase tracking-widest text-primary">Administration</p>
          <h1 className="mt-2 text-3xl sm:text-4xl">Contact</h1>
          <p className="mt-3 text-muted-foreground">Messages sent through the contact form, newest first.</p>
        </div>
        <span className="rounded-full border border-border bg-card px-4 py-2 text-sm text-muted-foreground">{stats.unread} unread of {stats.total}</span>
      </div>

      <form method="get" className="mt-8 flex flex-wrap items-end gap-4 rounded-2xl border border-border bg-card p-5">
        <label className="grid gap-2 text-sm font-medium">
          Show<select name="count" defaultValue={filter.count} className="h-10 rounded-md border border-input bg-background px-3">
            {[10, 20, 50, 100].map((count) => (
              <option key={count} value={count}>{count} messages</option>
            ))}
          </select>
        </label>
        <label className="grid gap-2 text-sm font-medium">
          Read state<select name="status" defaultValue={filter.status} className="h-10 rounded-md border border-input bg-background px-3">
            <option value="all">All messages</option>
            <option value="unread">Unread</option>
            <option value="read">Read</option>
          </select>
        </label>
        <button type="submit" className="h-10 rounded-md border border-border px-5 text-sm font-medium">Apply filters</button>
      </form>

      <div className="mt-4 overflow-hidden rounded-2xl border border-border bg-card">
        <div className="grid grid-cols-[minmax(0,1fr)_auto] gap-4 border-b border-border bg-secondary/40 px-5 py-3 text-xs font-semibold uppercase tracking-wide text-muted-foreground">
          <span>Message</span>
          <span>Received</span>
        </div>
        {rows.length ? (
          <ul className="divide-y divide-border">
            {rows.map((row) => (
              <li key={row.id} className={`px-5 py-5 text-sm transition-colors ${row.isRead ? "" : "bg-amber/50 border-l-4 border-amber-500"}`}>
                <div className="flex flex-wrap items-start justify-between gap-3">
                  <div className="min-w-0">
                    <p className={`font-medium ${row.isRead ? "text-muted-foreground" : "text-foreground"}`}>{row.name}</p>
                    <a href={`mailto:${row.email}`} className="break-all text-muted-foreground hover:text-primary">{row.email}</a>
                  </div>
                  <div className="flex items-center gap-3">
                    <time dateTime={row.submittedAt.toISOString()} className="text-muted-foreground">{row.submittedAt.toLocaleDateString("en-GB", { day: "numeric", month: "short", year: "numeric", timeZone: "UTC" })}</time>
                    <span className={`inline-flex rounded-full px-3 py-1 text-xs font-medium ${row.isRead ? "bg-secondary text-muted-foreground" : "bg-amber-100 text-amber-900"}`}>{row.isRead ? "Read" : "Unread"}</span>
                  </div>
                </div>
                <p className={`mt-3 break-words whitespace-pre-line leading-6 ${row.isRead ? "text-foreground/70" : "text-foreground/90"}`}>{row.message}</p>
                <form action={markContactMessage} className="mt-3">
                  <input type="hidden" name="id" value={row.id} />
                  <input type="hidden" name="read" value={row.isRead ? "false" : "true"} />
                  <button type="submit" className="rounded-md border border-border px-4 py-2 text-xs font-medium transition-colors hover:bg-primary hover:text-primary-foreground">Mark as {row.isRead ? "unread" : "read"}</button>
                </form>
              </li>
            ))}
          </ul>
        ) : (
          <p className="px-5 py-10 text-center text-sm text-muted-foreground">No messages match these filters.</p>
        )}
      </div>
    </div>
  );
}
