export default function Loading() {
  return (
    <div
      className="mx-auto max-w-site motion-safe:animate-pulse px-4 py-6 md:px-6"
      role="status"
      aria-label="Loading dashboard"
    >
      <span className="sr-only">Loading dashboard…</span>
      <div aria-hidden="true" className="space-y-6">
        <div className="h-10 w-64 max-w-full rounded-lg bg-muted" />
        <div className="h-4 w-80 max-w-full rounded-md bg-muted" />
        <div className="mt-8 grid gap-5 sm:grid-cols-3">
          {Array.from({ length: 3 }, (_, index) => (
            <div key={index} className="h-32 rounded-2xl border border-border bg-card" />
          ))}
        </div>
        <div className="mt-8 rounded-2xl border border-border bg-card p-6">
          <div className="h-5 w-40 rounded-md bg-muted" />
          <div className="mt-5 space-y-3">
            {Array.from({ length: 4 }, (_, index) => (
              <div key={index} className="h-4 w-full rounded-md bg-muted" />
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
