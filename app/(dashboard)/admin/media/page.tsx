import { DeleteConfirmationDialog } from "@/components/dashboard/delete-confirmation-dialog";
import { requireRole } from "@/lib/auth/session";
import { listMedia } from "@/lib/data/dal/media";
import { createMediaAction, deleteMediaAction } from "@/lib/data/actions/media-actions";

export default async function Page() {
  await requireRole(["admin", "super-admin"]);
    const items = await listMedia();

  return (
    <div className="mx-auto max-w-site">
      <div className="flex flex-wrap items-end justify-between gap-4">
        <div>
          <p className="text-xs font-semibold uppercase tracking-widest text-primary">Administration</p>
          <h1 className="mt-2 text-3xl sm:text-4xl">Media Library</h1>
          <p className="mt-3 text-muted-foreground">Uploaded media files. Cloudinary integration coming soon.</p>
        </div>
      </div>



      <form action={createMediaAction} className="mt-8 flex flex-wrap items-end gap-4 rounded-2xl border border-border bg-card p-5">
        <label className="grid gap-2 text-sm font-medium">
          Filename<input name="filename" type="text" required className="h-10 w-64 rounded-md border border-input bg-background px-3" placeholder="e.g. lesson-01.mp4" />
        </label>
        <label className="grid gap-2 text-sm font-medium">
          URL (Cloudinary)<input name="url" type="url" required className="h-10 w-64 rounded-md border border-input bg-background px-3" placeholder="https://res.cloudinary.com/..." />
        </label>
        <label className="grid gap-2 text-sm font-medium">
          Type<select name="mediaType" className="h-10 w-64 rounded-md border border-input bg-background px-3">
            <option value="video">Video</option>
            <option value="text">Text</option>
            <option value="audio">Audio</option>
          </select>
        </label>
        <button type="submit" className="h-10 rounded-md border border-border px-5 text-sm font-medium">Add media</button>
      </form>

      <div className="mt-8 overflow-hidden rounded-2xl border border-border bg-card shadow-sm">
        <div className="flex flex-wrap items-center justify-between gap-3 border-b border-border px-5 py-4 sm:px-6">
          <div>
            <h2 className="text-lg">All media</h2>
            <p className="mt-1 text-xs text-muted-foreground">{items.length} item{items.length === 1 ? "" : "s"}</p>
          </div>
        </div>
        <ul className="divide-y divide-border">
          {items.length ? items.map((item) => (
            <li key={item.id} className="px-5 py-4">
              <div className="flex flex-wrap items-start justify-between gap-3">
                <div className="min-w-0">
                  <p className="font-medium text-foreground">{item.filename}</p>
                  <p className="mt-1 text-xs text-muted-foreground">{item.mediaType} · <a href={item.url} target="_blank" rel="noopener noreferrer" className="text-primary hover:underline">Open URL</a></p>
                </div>
                <div className="flex items-center gap-3">
                  <span className={`inline-flex rounded-full bg-secondary px-3 py-1 text-xs font-medium text-primary`}>{item.mediaType}</span>
                  <DeleteConfirmationDialog
                    action={deleteMediaAction}
                    itemName={item.filename}
                    itemType="media item"
                    id={item.id}
                  />
                </div>
              </div>
            </li>
          )) : (
            <li className="px-5 py-10 text-center text-sm text-muted-foreground">No media uploaded yet. Add your first item above.</li>
          )}
        </ul>
      </div>
    </div>
  );
}
