import { DeleteConfirmationDialog } from "@/components/dashboard/delete-confirmation-dialog";
import Link from "next/link";
import { requireRole } from "@/lib/auth/session";
import { listManagedUsers, countManagedUsers } from "@/lib/data/dal/users";
import { banUserAction, unbanUserAction, deleteUserAction } from "@/lib/data/actions/users-admin";
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
  return qs ? `/admin/students?${qs}` : "/admin/students";
}

export default async function Page({ searchParams }: { searchParams: Promise<{ [key: string]: string | string[] | undefined }> }) {
  await requireRole(["admin", "super-admin"]);
  const sp = await searchParams;

  const search = typeof sp.q === "string" ? sp.q.trim() : "";
  const banRaw = typeof sp.ban === "string" ? sp.ban : "all";
  const ban = banRaw === "active" || banRaw === "banned" ? banRaw : "all";
  const planRaw = typeof sp.plan === "string" ? sp.plan : "all";
  const plan = (["free", "starter", "plus", "premium"].includes(planRaw) ? planRaw : "all") as UserFilters["plan"] & string;
  const size = parseSize(sp.size);
  const page = parsePage(sp.page);

  const filters: UserFilters = { search, ban, plan };
  const offset = (page - 1) * size;
  const [users, total] = await Promise.all([
    listManagedUsers("student", filters, size, offset),
    countManagedUsers("student", filters),
  ]);
  const totalPages = Math.max(1, Math.ceil(total / size));
  const currentPage = Math.min(page, totalPages);

  const baseParams = {
    q: search || undefined,
    ban: ban === "all" ? undefined : ban,
    plan: plan === "all" ? undefined : plan,
    size: String(size),
  };

  return (
    <div className="mx-auto max-w-site">
      <div className="flex flex-wrap items-end justify-between gap-4">
        <div>
          <p className="text-xs font-semibold uppercase tracking-widest text-primary">Administration</p>
          <h1 className="mt-2 text-3xl sm:text-4xl">Students</h1>
          <p className="mt-3 text-muted-foreground">Learner accounts, plans and status.</p>
        </div>
        <div className="flex flex-wrap items-center gap-2">
          <Link href="/admin/students/create" className="rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground hover:bg-primary/90">Create student</Link>
          <span className="rounded-full border border-border bg-card px-4 py-2 text-sm text-muted-foreground">{users.length} of {total} records</span>
        </div>
      </div>



      {/* Filters */}
      <form method="get" className="mt-8 grid gap-3 rounded-2xl border border-border bg-card p-5 md:grid-cols-[minmax(0,1fr)_auto_auto_auto_auto] md:items-end">
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
          Plan
          <select name="plan" defaultValue={plan} className="h-10 rounded-md border border-input bg-background px-3">
            <option value="all">All</option>
            <option value="free">Free</option>
            <option value="starter">Starter</option>
            <option value="plus">Plus</option>
            <option value="premium">Premium</option>
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

      <div className="mt-8 overflow-hidden rounded-2xl border border-border bg-card shadow-sm">
        <div className="hidden grid-cols-[minmax(0,1.6fr)_minmax(0,0.9fr)_minmax(0,0.8fr)_auto] gap-4 border-b border-border bg-secondary/40 px-6 py-3 text-xs font-semibold uppercase tracking-wide text-muted-foreground md:grid">
          <span>Student</span><span>Plan</span><span>Status</span><span>Actions</span>
        </div>
        <ul className="divide-y divide-border">
          {users.length === 0 && <li className="px-6 py-8 text-sm text-muted-foreground">No students match these filters.</li>}
          {users.map((u) => (
            <li key={u.id} className="px-5 py-4">
              <div className="grid gap-3 md:grid-cols-[minmax(0,1.6fr)_minmax(0,0.9fr)_minmax(0,0.8fr)_auto] md:items-center md:gap-4">
                <div className="min-w-0">
                  <Link href={`/admin/students/${u.id}`} className="block font-medium text-primary hover:underline">{u.name}</Link>
                  <p className="truncate text-xs text-muted-foreground">{u.email}</p>
                  <p className="truncate text-xs text-muted-foreground">{u.username}</p>
                </div>
                <span className="inline-flex w-fit rounded-full bg-secondary px-3 py-1 text-xs font-medium text-primary capitalize">{u.subscription}</span>
                <div className="min-w-0">
                  <span className={`inline-flex w-fit rounded-full px-3 py-1 text-xs font-medium ${u.banned ? "bg-destructive/10 text-destructive" : "bg-emerald-500/10 text-emerald-600"}`}>{u.banned ? "Banned" : "Active"}</span>
                  {u.banned && u.banReason && <p className="mt-1 truncate text-xs text-destructive">{u.banReason}</p>}
                </div>
                <div className="flex flex-wrap items-center gap-2">
                  <Link
                    href={`/admin/students/${u.id}`}
                    className="inline-flex shrink-0 items-center justify-center gap-2 rounded-md border border-blue-500/50 bg-transparent px-3 py-1 text-xs font-medium text-blue-600 hover:bg-blue-50 hover:border-blue-500 focus-visible:outline-2 focus-visible:outline-blue-500 focus-visible:ring-2 focus-visible:ring-blue-500/20"
                  >
                    Edit
                  </Link>
                  {u.banned ? (
                    <form action={unbanUserAction}>
                      <input type="hidden" name="id" value={u.id} />
                      <input type="hidden" name="targetRole" value="student" />
                      <button
                        type="submit"
                        className="inline-flex shrink-0 items-center justify-center gap-2 rounded-md border border-emerald-500/50 bg-transparent px-3 py-1 text-xs font-medium text-emerald-600 hover:bg-emerald-50 hover:border-emerald-500 focus-visible:outline-2 focus-visible:outline-emerald-500 focus-visible:ring-2 focus-visible:ring-emerald-500/20"
                      >
                        Unban
                      </button>
                    </form>
                  ) : (
                    <form action={banUserAction}>
                      <input type="hidden" name="id" value={u.id} />
                      <input type="hidden" name="targetRole" value="student" />
                      <input type="hidden" name="reason" value="Banned by administrator" />
                      <button
                        type="submit"
                        className="inline-flex shrink-0 items-center justify-center gap-2 rounded-md border border-orange-500/50 bg-transparent px-3 py-1 text-xs font-medium text-orange-600 hover:bg-orange-50 hover:border-orange-500 focus-visible:outline-2 focus-visible:outline-orange-500 focus-visible:ring-2 focus-visible:ring-orange-500/20"
                      >
                        Ban
                      </button>
                    </form>
                  )}
                  <DeleteConfirmationDialog action={deleteUserAction} itemName={u.name} itemType="student" id={u.id} />
                </div>
              </div>
            </li>
          ))}
        </ul>
      </div>

      {/* Pagination */}
      <div className="mt-6 flex flex-wrap items-center justify-between gap-4">
        <p className="text-sm text-muted-foreground">Page {currentPage} of {totalPages}</p>
        <div className="flex items-center gap-2">
          <Link
            href={buildHref(baseParams, { page: String(Math.max(1, currentPage - 1)) })}
            aria-disabled={currentPage <= 1}
            className={`rounded-md border border-border px-3 py-2 text-sm ${currentPage <= 1 ? "pointer-events-none opacity-50" : "hover:bg-secondary/50"}`}
          >
            Previous
          </Link>
          <Link
            href={buildHref(baseParams, { page: String(Math.min(totalPages, currentPage + 1)) })}
            aria-disabled={currentPage >= totalPages}
            className={`rounded-md border border-border px-3 py-2 text-sm ${currentPage >= totalPages ? "pointer-events-none opacity-50" : "hover:bg-secondary/50"}`}
          >
            Next
          </Link>
        </div>
      </div>
    </div>
  );
}
