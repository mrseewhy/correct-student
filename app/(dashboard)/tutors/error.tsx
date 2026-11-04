"use client";

const panel = "rounded-2xl border border-border bg-card p-6 shadow-sm";

/** Error boundary for the tutor content area only; the shell above stays up. */
export default function TutorsError({ error, reset }: { error: Error & { digest?: string }; reset: () => void }) {
  return (
    <div className="mx-auto max-w-site">
      <div className={panel}>
        <p className="text-xs font-semibold uppercase tracking-widest text-destructive">Error</p>
        <h2 className="mt-2 text-2xl">This section could not load</h2>
        <p className="mt-3 text-sm text-muted-foreground">Something went wrong while loading your teaching section. Try again — if it keeps happening, contact support.</p>
        <button type="button" onClick={reset} className="mt-5 rounded-md bg-primary px-5 py-2.5 text-sm font-medium text-primary-foreground hover:bg-primary/90">Try again</button>
        {error.digest && <p className="mt-2 text-xs text-muted-foreground">Reference: {error.digest}</p>}
      </div>
    </div>
  );
}
