import { DeleteConfirmationDialog } from "@/components/dashboard/delete-confirmation-dialog";
import { requireRole } from "@/lib/auth/session";
import { listContentTypes } from "@/lib/data/dal/content-types";
import { createContentTypeAction, deleteContentTypeAction } from "@/lib/data/actions/content-admin";

export default async function Page() {
  await requireRole(["admin", "super-admin"]);
    const items = await listContentTypes();

  return (
    <div className="mx-auto max-w-site">
      <div className="flex flex-wrap items-end justify-between gap-4">
        <div>
          <p className="text-xs font-semibold uppercase tracking-widest text-primary">Administration</p>
          <h1 className="mt-2 text-3xl sm:text-4xl">Content Types</h1>
          <p className="mt-3 text-muted-foreground">Delivery methods for classes: songs, stories, lessons.</p>
        </div>
      </div>



      <form action={createContentTypeAction} className="mt-8 flex flex-wrap items-end gap-4 rounded-2xl border border-border bg-card p-5">
        <label className="grid gap-2 text-sm font-medium">
          Name<input name="name" type="text" required className="h-10 w-64 rounded-md border border-input bg-background px-3" placeholder="e.g. Lesson" />
        </label>
        <label className="grid gap-2 text-sm font-medium">
          Description<textarea name="description" rows={2} className="h-10 w-64 rounded-md border border-input bg-background px-3 py-2 resize-none" placeholder="Optional description" />
        </label>
        <button type="submit" className="h-10 rounded-md border border-border px-5 text-sm font-medium">Add content type</button>
      </form>

      <div className="mt-8 overflow-hidden rounded-2xl border border-border bg-card shadow-sm">
        <div className="flex flex-wrap items-center justify-between gap-3 border-b border-border px-5 py-4 sm:px-6">
          <div>
            <h2 className="text-lg">All content types</h2>
            <p className="mt-1 text-xs text-muted-foreground">{items.length} item{items.length === 1 ? "" : "s"}</p>
          </div>
        </div>
        <ul className="divide-y divide-border">
          {items.length ? items.map((item) => (
            <li key={item.id} className="px-5 py-4">
              <div className="flex flex-wrap items-start justify-between gap-3">
                <div className="min-w-0">
                  <p className="font-medium text-foreground">{item.name}</p>
                  {item.description && <p className="mt-1 text-sm text-muted-foreground">{item.description}</p>}
                </div>
                <div className="flex items-center gap-3">
                  <a href={`/admin/content-types/${item.id}`} className="text-xs font-medium text-primary hover:underline">Edit</a>
                  <DeleteConfirmationDialog
                    action={deleteContentTypeAction}
                    itemName={item.name}
                    itemType="content type"
                    id={item.id}
                  />
                </div>
              </div>
            </li>
          )) : (
            <li className="px-5 py-10 text-center text-sm text-muted-foreground">No content types yet. Add your first one above.</li>
          )}
        </ul>
      </div>
    </div>
  );
}
