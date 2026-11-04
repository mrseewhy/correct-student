import { DeleteConfirmationDialog } from "@/components/dashboard/delete-confirmation-dialog";
import { requireRole } from "@/lib/auth/session";
import { listLanguages } from "@/lib/data/dal/languages";
import { createLanguageAction, deleteLanguageAction } from "@/lib/data/actions/languages-admin";

export default async function Page() {
  await requireRole(["admin", "super-admin"]);
    const items = await listLanguages();

  return (
    <div className="mx-auto max-w-site">
      <div className="flex flex-wrap items-end justify-between gap-4">
        <div>
          <p className="text-xs font-semibold uppercase tracking-widest text-primary">Administration</p>
          <h1 className="mt-2 text-3xl sm:text-4xl">Languages</h1>
          <p className="mt-3 text-muted-foreground">Languages available to learners.</p>
        </div>
      </div>



      <form action={createLanguageAction} className="mt-8 flex flex-wrap items-end gap-4 rounded-2xl border border-border bg-card p-5">
        <label className="grid gap-2 text-sm font-medium">
          Name<input name="name" type="text" required className="h-10 w-64 rounded-md border border-input bg-background px-3" placeholder="e.g. Yoruba" />
        </label>
        <label className="grid gap-2 text-sm font-medium">
          Code<input name="code" type="text" required className="h-10 w-64 rounded-md border border-input bg-background px-3" placeholder="e.g. yoruba" />
        </label>
        <label className="grid gap-2 text-sm font-medium items-end">
          <input name="is_active" type="checkbox" className="mt-1" defaultChecked />
          Active
        </label>
        <button type="submit" className="h-10 rounded-md border border-border px-5 text-sm font-medium">Add language</button>
      </form>

      <div className="mt-8 overflow-hidden rounded-2xl border border-border bg-card shadow-sm">
        <div className="flex flex-wrap items-center justify-between gap-3 border-b border-border px-5 py-4 sm:px-6">
          <div>
            <h2 className="text-lg">All languages</h2>
            <p className="mt-1 text-xs text-muted-foreground">{items.length} item{items.length === 1 ? "" : "s"}</p>
          </div>
        </div>
        <ul className="divide-y divide-border">
          {items.length ? items.map((item) => (
            <li key={item.id} className="px-5 py-4">
              <div className="flex flex-wrap items-start justify-between gap-3">
                <div className="min-w-0">
                  <p className="font-medium text-foreground">{item.name}</p>
                  <p className="mt-1 text-sm text-muted-foreground">{item.code} · {item.is_active ? "Active" : "Inactive"}</p>
                </div>
                <div className="flex items-center gap-3">
                  <a href={`/admin/languages/${item.id}`} className="text-xs font-medium text-primary hover:underline">Edit</a>
                  <DeleteConfirmationDialog
                    action={deleteLanguageAction}
                    itemName={item.name}
                    itemType="language"
                    id={item.id}
                  />
                </div>
              </div>
            </li>
          )) : (
            <li className="px-5 py-10 text-center text-sm text-muted-foreground">No languages yet. Add your first one above.</li>
          )}
        </ul>
      </div>
    </div>
  );
}
