// Loading skeleton shared by the admin data pages (newsletter, contact).
// Mirrors the loaded layout — header, filters card and table — so nothing
// jumps when content arrives.

const rowWidths = ["w-32", "w-36", "w-28", "w-40", "w-32", "w-36", "w-28", "w-36"];
const emailWidths = ["w-56", "w-48", "w-60", "w-52", "w-56", "w-44", "w-56", "w-52"];

export function TableSkeleton({ rows = 6 }: { rows?: number }) {
  const indices = Array.from({ length: rows }, (_, index) => index);

  return (
    <div className="mx-auto max-w-site" role="status" aria-label="Loading content">
      <span className="sr-only">Loading content…</span>
      <div aria-hidden="true" className="motion-safe:animate-pulse">
        {/* Page header + action */}
        <div className="flex flex-wrap items-end justify-between gap-4">
          <div className="min-w-0">
            <div className="h-3 w-28 rounded-full bg-muted" />
            <div className="mt-2 h-10 w-52 rounded-lg bg-muted" />
            <div className="mt-3 h-4 w-72 max-w-full rounded-lg bg-muted" />
          </div>
          <div className="h-11 w-44 rounded-full border border-border bg-card shadow-sm" />
        </div>

        {/* Filters card */}
        <div className="mt-8 flex flex-wrap items-end gap-4 rounded-2xl border border-border bg-card p-5">
          <div className="grid w-40 gap-2">
            <div className="h-4 w-14 rounded-md bg-muted" />
            <div className="h-10 rounded-md border border-input bg-background" />
          </div>
          <div className="grid w-40 gap-2">
            <div className="h-4 w-20 rounded-md bg-muted" />
            <div className="h-10 rounded-md border border-input bg-background" />
          </div>
          <div className="h-10 w-32 rounded-md border border-border bg-background" />
        </div>

        {/* Summary line */}
        <div className="mt-4 h-4 w-40 rounded-lg bg-muted" />

        {/* Table */}
        <div className="mt-4 overflow-hidden rounded-2xl border border-border bg-card">
          <div className="grid grid-cols-[minmax(0,1fr)_auto] gap-4 border-b border-border bg-secondary/40 px-5 py-3">
            <div className="h-3 w-24 rounded-full bg-muted" />
            <div className="h-3 w-20 justify-self-end rounded-full bg-muted" />
          </div>
          <ul className="divide-y divide-border">
            {indices.map((index) => (
              <li
                key={index}
                className="flex items-center justify-between gap-4 px-5 py-5"
              >
                <div className="min-w-0 space-y-2">
                  <div className={`h-4 ${rowWidths[index % rowWidths.length]} rounded-md bg-muted`} />
                  <div className={`h-3 ${emailWidths[index % emailWidths.length]} max-w-full rounded-md bg-muted`} />
                </div>
                <div className="h-6 w-16 rounded-full bg-muted" />
              </li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  );
}
