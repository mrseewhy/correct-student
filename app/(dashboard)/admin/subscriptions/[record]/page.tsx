import Link from "next/link";
import { DeleteConfirmationDialog } from "@/components/dashboard/delete-confirmation-dialog";
import { notFound } from "next/navigation";
import { requireRole } from "@/lib/auth/session";

export const instant = false;
import { getPricingPlan } from "@/lib/data/dal/pricing-plans";
import { updatePlanAction, deletePlanAction } from "@/lib/data/actions/pricing-plans-admin";

const inputClass = "h-10 w-full rounded-md border border-input bg-background px-3";

export default async function Page({ params, searchParams }: { params: Promise<{ record: string }>; searchParams: Promise<{ [key: string]: string | string[] | undefined }> }) {
  await requireRole(["admin", "super-admin"]);
  const { record } = await params;
  const { error } = await searchParams;
  const plan = await getPricingPlan(record);
  if (!plan) notFound();

  return (
    <div className="mx-auto max-w-4xl">
      <Link href="/admin/subscriptions" className="inline-flex items-center gap-2 text-sm font-medium text-primary hover:underline">
        ← Back to Subscriptions
      </Link>

      <div className="mt-8 flex flex-wrap items-start justify-between gap-4">
        <div>
          <p className="text-xs font-semibold uppercase tracking-widest text-primary">Subscription plan</p>
          <h1 className="mt-2 text-3xl sm:text-4xl">{plan.name}</h1>
          <p className="mt-3 text-muted-foreground">
            Key: {plan.planKey} · {plan.priceNgn === 0 ? "Free forever" : `₦${plan.priceNgn.toLocaleString("en-GB")} / month`}
          </p>
        </div>
        {plan.featured && (
          <span className="rounded-full border border-secondary bg-secondary/20 px-4 py-2 text-xs font-medium text-primary">Most popular</span>
        )}
      </div>

      {typeof error === "string" && error && (
        <p role="alert" className="mt-8 rounded-xl border border-destructive/30 bg-destructive/10 px-5 py-3 text-sm text-destructive">{error}</p>
      )}

      <section className="mt-8 overflow-hidden rounded-2xl border border-border bg-card shadow-sm p-6">
        <h2 className="border-b border-border pb-4 text-xl mb-6">Edit</h2>
        <form action={updatePlanAction} className="grid gap-4 sm:grid-cols-2">
          <input type="hidden" name="id" value={plan.id} />
          <div>
            <label htmlFor="name" className="mb-2 block text-sm font-medium">Name</label>
            <input id="name" name="name" type="text" required defaultValue={plan.name} className={inputClass} />
          </div>
          <div>
            <label htmlFor="plan_key" className="mb-2 block text-sm font-medium">Key</label>
            <input id="plan_key" name="plan_key" type="text" required defaultValue={plan.planKey} className={inputClass} />
            <p className="mt-1 text-xs text-muted-foreground">Students reference this key from their chosen plan.</p>
          </div>
          <div className="sm:col-span-2">
            <label htmlFor="description" className="mb-2 block text-sm font-medium">Description</label>
            <input id="description" name="description" type="text" required defaultValue={plan.description} className={inputClass} />
          </div>
          <div>
            <label htmlFor="price_ngn" className="mb-2 block text-sm font-medium">₦ / month</label>
            <input id="price_ngn" name="price_ngn" type="number" min="0" required defaultValue={plan.priceNgn} className={inputClass} />
          </div>
          <div>
            <label htmlFor="price_usd" className="mb-2 block text-sm font-medium">$ / month</label>
            <input id="price_usd" name="price_usd" type="number" min="0" required defaultValue={plan.priceUsd} className={inputClass} />
          </div>
          <div>
            <label htmlFor="price_gbp" className="mb-2 block text-sm font-medium">£ / month</label>
            <input id="price_gbp" name="price_gbp" type="number" min="0" required defaultValue={plan.priceGbp} className={inputClass} />
          </div>
          <div>
            <label htmlFor="cta" className="mb-2 block text-sm font-medium">Button label</label>
            <input id="cta" name="cta" type="text" required defaultValue={plan.cta} className={inputClass} />
          </div>
          <div className="sm:col-span-2">
            <label htmlFor="features" className="mb-2 block text-sm font-medium">Benefits (one per line)</label>
            <textarea id="features" name="features" required rows={plan.features.length + 1} className="w-full rounded-md border border-input bg-background px-3 py-2 text-sm">{plan.features.join("\n")}</textarea>
          </div>
          <label className="flex items-center gap-2 text-sm font-medium sm:col-span-2">
            <input name="featured" type="checkbox" className="mt-0.5" defaultChecked={plan.featured} />
            Highlight as most popular
          </label>
          <div className="sm:col-span-2 flex gap-2">
            <button type="submit" className="rounded-md bg-primary px-5 py-2.5 text-sm font-medium text-primary-foreground hover:bg-primary/90">Save changes</button>
            <Link href="/admin/subscriptions" className="rounded-md border border-border px-5 py-2.5 text-sm font-medium text-muted-foreground hover:bg-secondary/50">Cancel</Link>
          </div>
        </form>
      </section>

      <section className="mt-8 overflow-hidden rounded-2xl border border-border bg-card shadow-sm p-6">
        <DeleteConfirmationDialog
          action={deletePlanAction}
          itemName={plan.name}
          itemType="subscription plan"
          id={plan.id}
        />
      </section>
    </div>
  );
}
