export default function RedirectLoading() {
  return (
    <div
      className="flex min-h-[calc(100dvh-5rem)] items-center justify-center bg-linear-to-b from-secondary via-background to-background"
      role="status"
      aria-label="Redirecting…"
    >
      <span className="sr-only">Redirecting…</span>
      <div className="rounded-full w-8 h-8 border-4 border-primary border-t-transparent animate-spin" />
    </div>
  );
}
