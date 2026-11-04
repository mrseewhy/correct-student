import { DeleteConfirmationDialog } from "@/components/dashboard/delete-confirmation-dialog";
import { requireRole } from "@/lib/auth/session";
import { listPricingPlans } from "@/lib/data/dal/pricing-plans";
import { createPlanAction, deletePlanAction } from "@/lib/data/actions/pricing-plans-admin";

const naira = (value: number) => `₦${value.toLocaleString("en-GB")}`;

const inputClass = "h-10 w-full rounded-md border border-input bg-background px-3";

export default async function Page() {
  await requireRole(["admin", "super-admin"]);
    const plans = await listPricingPlans();

  return (
    <div className="mx-auto max-w-site">
      <div className="flex flex-wrap items-end justify-between gap-4">
        <div>
          <p className="text-xs font-semibold uppercase tracking-widest text-primary">Administration</p>
          <h1 className="mt-2 text-3xl sm:text-4xl">Subscriptions</h1>
          <p className="mt-3 text-muted-foreground">Plan offerings and the benefits shown on the pricing page.</p>
        </div>
      </div>



      <form action={createPlanAction} className="mt-8 grid gap-4 rounded-2xl border border-border bg-card p-5 sm:grid-cols-4">
        <label className="grid gap-2 text-sm font-medium">
          Name<input name="name" type="text" required placeholder="e.g. Starter" className={inputClass} />
        </label>
        <label className="grid gap-2 text-sm font-medium">
          Key<input name="plan_key" type="text" required placeholder="e.g. starter" className={inputClass} />
        </label>
        <label className="grid gap-2 text-sm font-medium">
          ₦ / month<input name="price_ngn" type="number" min="0" required placeholder="e.g. 5000" className={inputClass} />
        </label>
        <label className="grid gap-2 text-sm font-medium">
          Button label<input name="cta" type="text" required placeholder="e.g. Choose Starter" className={inputClass} />
        </label>
        <label className="grid gap-2 text-sm font-medium sm:col-span-2">
          Description<input name="description" type="text" required placeholder="One line shown on the pricing card" className={inputClass} />
        </label>
        <label className="grid gap-2 text-sm font-medium">
          $ / month<input name="price_usd" type="number" min="0" required placeholder="e.g. 5" className={inputClass} />
        </label>
        <label className="grid gap-2 text-sm font-medium">
          £ / month<input name="price_gbp" type="number" min="0" required placeholder="e.g. 4" className={inputClass} />
        </label>
        <label className="grid gap-2 text-sm font-medium sm:col-span-4">
          Benefits (one per line)
          <textarea name="features" required rows={3} className="rounded-md border border-input bg-background px-3 py-2 text-sm" placeholder={"Everything in Free\nFull lessons in one language"} />
        </label>
        <label className="grid gap-2 text-sm font-medium items-end">
          <input name="featured" type="checkbox" className="mt-1" />
          Highlight as most popular
        </label>
        <button type="submit" className="h-10 rounded-md border border-border px-5 text-sm font-medium sm:justify-self-end">Add plan</button>
      </form>

      <div className="mt-8 overflow-hidden rounded-2xl border border-border bg-card shadow-sm">
        <div className="flex flex-wrap items-center justify-between gap-3 border-b border-border px-5 py-4 sm:px-6">
          <div>
            <h2 className="text-lg">All plans</h2>
            <p className="mt-1 text-xs text-muted-foreground">{plans.length} plan{plans.length === 1 ? "" : "s"} · shown on the pricing page</p>
          </div>
        </div>
        <ul className="divide-y divide-border">
          {plans.length ? plans.map((plan) => (
            <li key={plan.id} className="px-5 py-4">
              <div className="flex flex-wrap items-start justify-between gap-3">
                <div className="min-w-0">
                  <p className="font-medium text-foreground">
                    {plan.name}
                    {plan.featured && <span className="ml-2 rounded-full bg-primary px-2 py-0.5 text-xs font-medium text-primary-foreground">Most popular</span>}
                  </p>
                  <p className="mt-1 text-sm text-muted-foreground">
                    {plan.priceNgn === 0 ? "Free forever" : `${naira(plan.priceNgn)} / month`} · {plan.description}
                  </p>
                </div>
                <div className="flex items-center gap-3">
                  <a href={`/admin/subscriptions/${plan.id}`} className="text-xs font-medium text-primary hover:underline">Edit</a>
                  <DeleteConfirmationDialog
                    action={deletePlanAction}
                    itemName={plan.name}
                    itemType="subscription plan"
                    id={plan.id}
                  />
                </div>
              </div>
            </li>
          )) : (
            <li className="px-5 py-10 text-center text-sm text-muted-foreground">No plans yet. Add your first one above.</li>
          )}
        </ul>
      </div>
    </div>
  );
}
