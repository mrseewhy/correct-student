import { requireRole } from "@/lib/auth/session";

const panel = "rounded-2xl border border-border bg-card p-6 shadow-sm";

export default async function Page() {
  await requireRole(["student"]);
  return <div className="mx-auto max-w-site"><h1 className="text-3xl sm:text-4xl">My Orders</h1><p className="mt-3 text-muted-foreground">Your purchases and delivery updates.</p><div className={`${panel} mt-8 flex flex-wrap items-center justify-between gap-4`}><div><p className="text-xs text-muted-foreground">Order CS-1042 · 25 October 2026</p><h2 className="mt-2 text-xl">Yoruba learning resources</h2><p className="mt-2 text-sm text-muted-foreground">₦5,000 · Physical delivery</p></div><span className="rounded-full bg-secondary px-3 py-1 text-xs font-medium text-primary">Processing</span></div></div>;
}
