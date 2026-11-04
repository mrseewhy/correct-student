import Link from "next/link";
import { DeleteConfirmationDialog } from "@/components/dashboard/delete-confirmation-dialog";
import { notFound } from "next/navigation";
import { requireRole } from "@/lib/auth/session";
import { getContentType } from "@/lib/data/dal/content-types";
import { updateContentTypeAction, deleteContentTypeAction } from "@/lib/data/actions/content-admin";

export default async function Page({ params }: { params: Promise<{ record: string }> }) {
  await requireRole(["admin", "super-admin"]);
  const { record } = await params;
    const item = await getContentType(record);
  if (!item) notFound();

  return (
    <div className="mx-auto max-w-4xl">
      <Link href="/admin/content-types" className="inline-flex items-center gap-2 text-sm font-medium text-primary hover:underline">
        ← Back to Content Types
      </Link>

      <div className="mt-8 flex flex-wrap items-start justify-between gap-4">
        <div>
          <p className="text-xs font-semibold uppercase tracking-widest text-primary">Content Type</p>
          <h1 className="mt-2 text-3xl sm:text-4xl">{item.name}</h1>
          <p className="mt-3 text-muted-foreground">{item.description ?? "No description"}</p>
        </div>
        <span className="rounded-full border border-border bg-card px-4 py-2 text-sm text-muted-foreground">
          Created {new Date(item.createdAt).toLocaleDateString("en-GB", { day: "numeric", month: "short", year: "numeric" })}
        </span>
      </div>

      <section className="mt-8 overflow-hidden rounded-2xl border border-border bg-card shadow-sm">
        <h2 className="border-b border-border px-6 py-5 text-xl">Details</h2>
        <dl className="divide-y divide-border">
          <div className="grid gap-2 px-6 py-4 sm:grid-cols-[11rem_1fr]">
            <dt className="text-sm text-muted-foreground">ID</dt>
            <dd className="break-words text-sm font-medium leading-6 text-foreground">{item.id}</dd>
          </div>
          <div className="grid gap-2 px-6 py-4 sm:grid-cols-[11rem_1fr]">
            <dt className="text-sm text-muted-foreground">Name</dt>
            <dd className="break-words text-sm font-medium leading-6 text-foreground">{item.name}</dd>
          </div>
          <div className="grid gap-2 px-6 py-4 sm:grid-cols-[11rem_1fr]">
            <dt className="text-sm text-muted-foreground">Description</dt>
            <dd className="break-words text-sm font-medium leading-6 text-foreground">{item.description ?? "—"}</dd>
          </div>
        </dl>
      </section>



      <section className="mt-8 overflow-hidden rounded-2xl border border-border bg-card shadow-sm p-6">
        <h2 className="border-b border-border pb-4 text-xl mb-6">Edit</h2>
        <form action={updateContentTypeAction} className="grid gap-4 sm:grid-cols-2">
          <input type="hidden" name="id" value={item.id} />
          <div>
            <label htmlFor="name" className="mb-2 block text-sm font-medium">Name</label>
            <input id="name" name="name" type="text" required defaultValue={item.name} className="h-10 w-full rounded-md border border-input bg-background px-3" />
          </div>
          <div>
            <label htmlFor="description" className="mb-2 block text-sm font-medium">Description</label>
            <textarea id="description" name="description" rows={3} defaultValue={item.description ?? ""} className="w-full rounded-md border border-input bg-background px-3 py-2 text-sm resize-none" />
          </div>
          <div className="sm:col-span-2 flex gap-2">
            <button type="submit" className="rounded-md bg-primary px-5 py-2.5 text-sm font-medium text-primary-foreground hover:bg-primary/90">Save changes</button>
            <Link href="/admin/content-types" className="rounded-md border border-border px-5 py-2.5 text-sm font-medium text-muted-foreground hover:bg-secondary/50">Cancel</Link>
          </div>
        </form>
      </section>

      <section className="mt-8 overflow-hidden rounded-2xl border border-border bg-card shadow-sm p-6">
        <DeleteConfirmationDialog
          action={deleteContentTypeAction}
          itemName={item.name}
          itemType="content type"
          id={item.id}
        />
      </section>
    </div>
  );
}
