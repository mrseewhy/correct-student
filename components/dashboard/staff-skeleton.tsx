export function StaffSkeleton() {
  return (
    <div className="mx-auto max-w-site" role="status" aria-label="Loading staff">
      <span className="sr-only">Loading staff…</span>
      <div aria-hidden="true" className="motion-safe:animate-pulse">
        <div className="flex flex-wrap items-end justify-between gap-4">
          <div>
            <div className="h-3 w-28 rounded-full bg-muted" />
            <div className="mt-2 h-10 w-32 rounded-lg bg-muted" />
            <div className="mt-3 h-4 w-72 max-w-full rounded-lg bg-muted" />
          </div>
          <div className="h-9 w-36 rounded-full bg-muted" />
        </div>
        <div className="mt-8 overflow-hidden rounded-2xl border border-border bg-card">
          <div className="flex justify-between gap-4 border-b border-border bg-secondary/40 px-5 py-3">
            <div className="h-3 w-28 rounded-full bg-muted" />
            <div className="h-3 w-32 rounded-full bg-muted" />
          </div>
          <div className="divide-y divide-border">
            {Array.from({ length: 5 }, (_, index) => (
              <div key={index} className="flex flex-wrap items-center justify-between gap-4 px-5 py-5">
                <div className="space-y-2">
                  <div className="h-4 w-36 rounded-md bg-muted" />
                  <div className="h-3 w-52 max-w-full rounded-md bg-muted" />
                  <div className="h-3 w-24 rounded-md bg-muted" />
                </div>
                <div className="flex gap-3">
                  <div className="h-6 w-24 rounded-full bg-muted" />
                  <div className="h-6 w-16 rounded-full bg-muted" />
                  <div className="h-8 w-8 rounded-md bg-muted" />
                </div>
              </div>
            ))}
          </div>
        </div>
        <div className="mt-8 h-56 rounded-2xl border border-border bg-card" />
      </div>
    </div>
  );
}
