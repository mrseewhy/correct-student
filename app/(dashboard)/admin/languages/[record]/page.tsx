import Link from "next/link";
import { DeleteConfirmationDialog } from "@/components/dashboard/delete-confirmation-dialog";
import { notFound } from "next/navigation";
import { requireRole } from "@/lib/auth/session";

export const instant = false;
import { getLanguage } from "@/lib/data/dal/languages";
import { updateLanguageAction, deleteLanguageAction } from "@/lib/data/actions/languages-admin";

export default async function Page({ params }: { params: Promise<{ record: string }> }) {
  await requireRole(["admin", "super-admin"]);
  const { record } = await params;
    const item = await getLanguage(record);
  if (!item) notFound();

  return (
    <div className="mx-auto max-w-4xl">
      <Link href="/admin/languages" className="inline-flex items-center gap-2 text-sm font-medium text-primary hover:underline">
        ← Back to Languages
      </Link>

      <div className="mt-8 flex flex-wrap items-start justify-between gap-4">
        <div>
          <p className="text-xs font-semibold uppercase tracking-widest text-primary">Language</p>
          <h1 className="mt-2 text-3xl sm:text-4xl">{item.name}</h1>
          <p className="mt-3 text-muted-foreground">Code: {item.code}</p>
        </div>
        <span className={`rounded-full border border-border px-4 py-2 text-xs font-medium ${item.is_active ? "bg-secondary/20 text-primary border-secondary" : "bg-destructive/10 text-destructive border-destructive"}`}>
          {item.is_active ? "Active" : "Inactive"}
        </span>
      </div>



      <section className="mt-8 overflow-hidden rounded-2xl border border-border bg-card shadow-sm p-6">
        <h2 className="border-b border-border pb-4 text-xl mb-6">Edit</h2>
        <form action={updateLanguageAction} className="grid gap-4 sm:grid-cols-2">
          <input type="hidden" name="id" value={item.id} />
          <div>
            <label htmlFor="name" className="mb-2 block text-sm font-medium">Name</label>
            <input id="name" name="name" type="text" required defaultValue={item.name} className="h-10 w-full rounded-md border border-input bg-background px-3" />
          </div>
          <div>
            <label htmlFor="code" className="mb-2 block text-sm font-medium">Code</label>
            <input id="code" name="code" type="text" required defaultValue={item.code} className="h-10 w-full rounded-md border border-input bg-background px-3" />
          </div>
          <div className="sm:col-span-2 grid gap-2 items-start">
            <label className="flex items-center gap-2 text-sm font-medium">
              <input name="is_active" type="checkbox" className="mt-0.5" defaultChecked={item.is_active} />
              Active
            </label>
          </div>
          <div className="sm:col-span-2 flex gap-2">
            <button type="submit" className="rounded-md bg-primary px-5 py-2.5 text-sm font-medium text-primary-foreground hover:bg-primary/90">Save changes</button>
            <Link href="/admin/languages" className="rounded-md border border-border px-5 py-2.5 text-sm font-medium text-muted-foreground hover:bg-secondary/50">Cancel</Link>
          </div>
        </form>
      </section>

      <section className="mt-8 overflow-hidden rounded-2xl border border-border bg-card shadow-sm p-6">
        <DeleteConfirmationDialog
          action={deleteLanguageAction}
          itemName={item.name}
          itemType="language"
          id={item.id}
        />
      </section>
    </div>
  );
}
