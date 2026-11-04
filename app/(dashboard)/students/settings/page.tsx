import { requireRole } from "@/lib/auth/session";
import { getPlanName } from "@/lib/data/dal/pricing-plans";

const panel = "rounded-2xl border border-border bg-card p-6 shadow-sm";

export default async function Page() {
  const { user } = await requireRole(["student"]);
  const currentPlanName = await getPlanName(user.subscription);
  return <div className="mx-auto max-w-site"><h1 className="text-3xl sm:text-4xl">Profile & Settings</h1><p className="mt-3 text-muted-foreground">Your account details.</p><dl className={`${panel} mt-8 divide-y divide-border`}>{([["Name", user.name], ["Username", user.username ?? "—"], ["Email", user.email], ["Plan", currentPlanName]] as const).map(([label, value]) => <div key={label} className="grid gap-1 py-4 first:pt-0 last:pb-0 sm:grid-cols-48"><dt className="text-sm text-muted-foreground">{label}</dt><dd className="text-sm font-medium">{value}</dd></div>)}</dl></div>;
}
