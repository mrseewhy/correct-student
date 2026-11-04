export default function Loading() {
  return (
    <div className="mx-auto max-w-site motion-safe:animate-pulse" role="status" aria-label="Loading student workspace">
      <div className="h-10 w-64 max-w-full rounded-lg bg-muted" />
      <div className="mt-3 h-4 w-80 max-w-full rounded-md bg-muted" />
      <div className="mt-8 grid gap-5 sm:grid-cols-3">
        {Array.from({ length: 3 }, (_, index) => <div key={index} className="h-32 rounded-2xl border border-border bg-card" />)}
      </div>
      <div className="mt-10 h-7 w-44 rounded-md bg-muted" />
      <div className="mt-5 grid gap-5 md:grid-cols-2">
        {Array.from({ length: 2 }, (_, index) => <div key={index} className="h-40 rounded-2xl border border-border bg-card" />)}
      </div>
    </div>
  );
}
