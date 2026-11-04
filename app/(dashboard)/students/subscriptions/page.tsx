import { requireRole } from "@/lib/auth/session";
import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { getPlanDetails } from "@/lib/data/dal/pricing-plans";

const panel = "rounded-2xl border border-border bg-card p-6 shadow-sm";

export default async function Page() {
  const { user } = await requireRole(["student"]);
  const plan = await getPlanDetails(user.subscription);
  return <div className="mx-auto max-w-site"><h1 className="text-3xl sm:text-4xl">Subscriptions</h1><p className="mt-3 text-muted-foreground">Your plan and available learning benefits.</p><div className={`${panel} mt-8`}><span className="rounded-full bg-secondary px-3 py-1 text-xs font-medium text-primary">Current plan</span><h2 className="mt-4 text-2xl">{plan.name}</h2><p className="mt-2 text-sm text-muted-foreground">{plan.description}</p><ul className="mt-5 list-inside list-disc space-y-2 text-sm">{plan.features.map((feature) => <li key={feature}>{feature}</li>)}</ul></div><Link href="/pricing" className="mt-6 inline-flex items-center gap-2 text-sm font-medium text-primary hover:underline">Compare all plans <ArrowRight className="size-4" /></Link></div>;
}
