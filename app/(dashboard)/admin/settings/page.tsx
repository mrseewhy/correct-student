import { requireRole } from "@/lib/auth/session";

export default async function Page() {
  await requireRole(["admin", "super-admin"]);
  return <div className="mx-auto max-w-site"><h1 className="text-3xl sm:text-4xl">Settings</h1><p className="mt-3 text-muted-foreground">Platform preferences and account settings.</p><div className="mt-8 rounded-2xl border border-border bg-card p-8"><h2 className="text-xl">Administrator account</h2><p className="mt-3 text-sm text-muted-foreground">Account and platform controls will be available here when the service is connected.</p></div></div>;
}
