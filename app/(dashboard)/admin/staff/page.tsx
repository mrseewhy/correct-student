import { Suspense } from "react";

import { requireRole } from "@/lib/auth/session";
import Link from "next/link";
import { StaffCreateForm, StaffRowActions } from "@/components/dashboard/staff-management";
import { StaffSkeleton } from "@/components/dashboard/staff-skeleton";
import { listManagedUsers, countManagedUsers } from "@/lib/data/dal/users";
import { deleteUserAction } from "@/lib/data/actions/users-admin";
import type { UserFilters } from "@/lib/data/dal/users";

export const instant = false;

const PAGE_SIZES = [10, 20, 50, 100] as const;
type PageSize = (typeof PAGE_SIZES)[number];

function parseSize(value: string | string[] | undefined): PageSize {
  const raw = Array.isArray(value) ? value[0] : value;
  const n = Number(raw);
  return (PAGE_SIZES as readonly number[]).includes(n) ? (n as PageSize) : 10;
}

function parsePage(value: string | string[] | undefined): number {
  const raw = Array.isArray(value) ? value[0] : value;
  const n = Number(raw);
  return Number.isFinite(n) && n > 0 ? Math.floor(n) : 1;
}

function buildHref(base: Record<string, string | undefined>, overrides: Record<string, string | undefined>) {
  const params = new URLSearchParams();
  const merged = { ...base, ...overrides };
  for (const [key, value] of Object.entries(merged)) {
    if (value) params.set(key, value);
  }
  const qs = params.toString();
  return qs ? `/admin/staff?${qs}` : "/admin/staff";
}

export default async function StaffAdminPage({ searchParams }: { searchParams: Promise<Record<string, string | string[] | undefined>> }) {
  const { user } = await requireRole(["super-admin"]);
  const sp = await searchParams;

  const search = typeof sp.q === "string" ? sp.q.trim() : "";
  const banRaw = typeof sp.ban === "string" ? sp.ban : "all";
  const ban = banRaw === "active" || banRaw === "banned" ? banRaw : "all";
  const size = parseSize(sp.size);
  const page = parsePage(sp.page);

  const filters: UserFilters = { search, ban };
  const offset = (page - 1) * size;
  const [users, total] = await Promise.all([
    listManagedUsers(["admin", "super-admin"], filters, size, offset),
    countManagedUsers(["admin", "super-admin"], filters),
  ]);
  const totalPages = Math.max(1, Math.ceil(total / size));
  const currentPage = Math.min(page, totalPages);

  const baseParams = {
    q: search || undefined,
    ban: ban === "all" ? undefined : ban,
    size: String(size),
  };

  return (
    <Suspense fallback={<StaffSkeleton />}>
      <div className="mx-auto max-w-site">
        <div className="flex flex-wrap items-end justify-between gap-4">
          <div>
            <p className="text-xs font-semibold uppercase tracking-widest text-primary">Administration</p>
            <h1 className="mt-2 text-3xl sm:text-4xl">Staff</h1>
            <p className="mt-3 text-muted-foreground">Administrator accounts with access to this workspace.</p>
          </div>
          <div className="flex flex-wrap items-center gap-2">
            <Link href="/admin/staff/create" className="rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground hover:bg-primary/90">Create admin</Link>
            <span className="rounded-full border border-border bg-card px-4 py-2 text-sm text-muted-foreground">{users.length} of {total} records</span>
          </div>
        </div>

        {/* Filters */}
        <form method="get" className="mt-8 grid gap-3 rounded-2xl border border-border bg-card p-5 md:grid-cols-[minmax(0,1fr)_auto_auto_auto] md:items-end">
          <label className="grid gap-1 text-sm font-medium">
            Search
            <input name="q" type="text" defaultValue={search} placeholder="Name, email or username" className="h-10 rounded-md border border-input bg-background px-3" />
          </label>
          <label className="grid gap-1 text-sm font-medium">
            Ban status
            <select name="ban" defaultValue={ban} className="h-10 rounded-md border border-input bg-background px-3">
              <option value="all">All</option>
              <option value="active">Active</option>
              <option value="banned">Banned</option>
            </select>
          </label>
          <label className="grid gap-1 text-sm font-medium">
            Page size
            <select name="size" defaultValue={String(size)} className="h-10 rounded-md border border-input bg-background px-3">
              {PAGE_SIZES.map((n) => <option key={n} value={n}>{n}</option>)}
            </select>
          </label>
          <button type="submit" className="h-10 rounded-md bg-primary px-5 text-sm font-medium text-primary-foreground hover:bg-primary/90">Filter</button>
          <input type="hidden" name="page" value="1" />
        </form>

        <div className="mt-8 overflow-hidden rounded-2xl border border-border bg-card">
          <div className="hidden grid-cols-[minmax(0,1.6fr)_minmax(0,0.9fr)_minmax(0,0.8fr)_auto] gap-4 border-b border-border bg-secondary/40 px-6 py-3 text-xs font-semibold uppercase tracking-wide text-muted-foreground md:grid">
            <span>Administrator</span><span>Role</span><span>Status</span><span>Actions</span>
          </div>
          {users.length ? (
            <ul className="divide-y divide-border">
              {users.map((member) => (
                <li key={member.id} className="px-5 py-5 text-sm">
                  <div className="grid gap-3 md:grid-cols-[minmax(0,1.6fr)_minmax(0,0.9fr)_minmax(0,0.8fr)_auto] md:items-center md:gap-4">
                    <div className="min-w-0">
                      <p className="font-medium text-foreground">{member.name}</p>
                      <a href={`mailto:${member.email}`} className="break-all text-muted-foreground hover:text-primary">{member.email}</a>
                      <p className="mt-1 text-xs text-muted-foreground">@{member.username ?? member.email.split("@")[0]}</p>
                      {member.banned && member.banReason && <p className="mt-1 truncate text-xs text-destructive">{member.banReason}</p>}
                    </div>
                    <span className={`inline-flex rounded-full px-3 py-1 text-xs font-medium ${member.role === "super-admin" ? "bg-secondary text-primary" : "bg-secondary text-muted-foreground"}`}>{member.role === "super-admin" ? "Super admin" : "Admin"}</span>
                    <span className={`inline-flex rounded-full px-3 py-1 text-xs font-medium ${member.banned ? "bg-destructive/10 text-destructive" : "bg-emerald-500/10 text-emerald-600"}`}>{member.banned ? "Banned" : "Active"}</span>
                    <StaffRowActions
                      userId={member.id}
                      role={member.role === "super-admin" ? "super-admin" : "admin"}
                      banned={Boolean(member.banned)}
                      isSelf={member.id === user.id}
                      deleteAction={deleteUserAction}
                    />
                  </div>
                </li>
              ))}
            </ul>
          ) : (
            <p className="px-5 py-10 text-center text-sm text-muted-foreground">No administrators match these filters.</p>
          )}
        </div>

        {/* Pagination */}
        <div className="mt-6 flex flex-wrap items-center justify-between gap-4">
          <p className="text-sm text-muted-foreground">Page {currentPage} of {totalPages}</p>
          <div className="flex items-center gap-2">
            <a
              href={buildHref(baseParams, { page: String(Math.max(1, currentPage - 1)) })}
              aria-disabled={currentPage <= 1}
              className={`rounded-md border border-border px-3 py-2 text-sm ${currentPage <= 1 ? "pointer-events-none opacity-50" : "hover:bg-secondary/50"}`}
            >
              Previous
            </a>
            <a
              href={buildHref(baseParams, { page: String(Math.min(totalPages, currentPage + 1)) })}
              aria-disabled={currentPage >= totalPages}
              className={`rounded-md border border-border px-3 py-2 text-sm ${currentPage >= totalPages ? "pointer-events-none opacity-50" : "hover:bg-secondary/50"}`}
            >
              Next
            </a>
          </div>
        </div>

        <StaffCreateForm />
      </div>
    </Suspense>
  );
}
