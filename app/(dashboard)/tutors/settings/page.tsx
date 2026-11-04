import { requireRole } from "@/lib/auth/session";
import { tutor } from "@/lib/workspace-data";

const panel = "rounded-2xl border border-border bg-card p-6 shadow-sm";

export default async function Page() {
  // Real identity comes from the session; the teaching-profile fields below
  // are demo placeholders from lib/workspace-data until profile editing exists.
  const { user } = await requireRole(["tutor"]);
  return <div className="mx-auto max-w-site"><h1 className="text-3xl sm:text-4xl">Profile & Settings</h1><p className="mt-3 text-muted-foreground">Your teaching profile and availability.</p><dl className={`${panel} mt-8 divide-y divide-border`}>{([["Name", user.name], ["Username", user.username ?? "—"], ["Email", user.email]] as const).map(([label, value]) => <div key={label} className="grid gap-1 py-4 first:pt-0 last:pb-0 sm:grid-cols-48"><dt className="text-sm text-muted-foreground">{label}</dt><dd className="text-sm font-medium">{value}</dd></div>)}{([["Teaching languages", tutor.languages.join(", ")], ["Availability", "Monday, Wednesday and Friday"], ["Bio", "Language tutor focused on practical conversations and cultural storytelling."]] as const).map(([label, value]) => <div key={label} className="grid gap-1 py-4 first:pt-0 last:pb-0 sm:grid-cols-48"><dt className="text-sm text-muted-foreground">{label} <span className="ml-1 rounded-full bg-secondary px-2 py-0.5 text-xs text-muted-foreground">demo</span></dt><dd className="text-sm font-medium">{value}</dd></div>)}</dl></div>;
}
