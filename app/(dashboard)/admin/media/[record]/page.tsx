import Link from "next/link";
import { DeleteConfirmationDialog } from "@/components/dashboard/delete-confirmation-dialog";
import { notFound } from "next/navigation";
import { requireRole } from "@/lib/auth/session";

export const instant = false;
import { getMediaItem } from "@/lib/data/dal/media";
import { deleteMediaAction } from "@/lib/data/actions/media-actions";

export default async function Page({ params }: { params: Promise<{ record: string }> }) {
  await requireRole(["admin", "super-admin"]);
  const { record } = await params;
  const item = await getMediaItem(record);
  if (!item) notFound();

  return (
    <div className="mx-auto max-w-4xl">
      <Link href="/admin/media" className="inline-flex items-center gap-2 text-sm font-medium text-primary hover:underline">
        ← Back to Media Library
      </Link>

      <div className="mt-8 flex flex-wrap items-start justify-between gap-4">
        <div>
          <p className="text-xs font-semibold uppercase tracking-widest text-primary">Media Item</p>
          <h1 className="mt-2 text-3xl sm:text-4xl">{item.filename}</h1>
          <p className="mt-3 text-muted-foreground">{item.mediaType} · {item.url}</p>
        </div>
        <span className="rounded-full border border-border bg-card px-4 py-2 text-sm text-muted-foreground">
          Uploaded {new Date(item.uploadedAt).toLocaleDateString("en-GB", { day: "numeric", month: "short", year: "numeric" })}
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
            <dt className="text-sm text-muted-foreground">Filename</dt>
            <dd className="break-words text-sm font-medium leading-6 text-foreground">{item.filename}</dd>
          </div>
          <div className="grid gap-2 px-6 py-4 sm:grid-cols-[11rem_1fr]">
            <dt className="text-sm text-muted-foreground">Media type</dt>
            <dd className="break-words text-sm font-medium leading-6 text-foreground">{item.mediaType}</dd>
          </div>
          <div className="grid gap-2 px-6 py-4 sm:grid-cols-[11rem_1fr]">
            <dt className="text-sm text-muted-foreground">URL</dt>
            <dd className="break-words text-sm font-medium leading-6 text-foreground">
              <a href={item.url} target="_blank" rel="noopener noreferrer" className="text-primary hover:underline break-all">{item.url}</a>
            </dd>
          </div>
          <div className="grid gap-2 px-6 py-4 sm:grid-cols-[11rem_1fr]">
            <dt className="text-sm text-muted-foreground">Uploaded</dt>
            <dd className="break-words text-sm font-medium leading-6 text-foreground">{new Date(item.uploadedAt).toLocaleString("en-GB")}</dd>
          </div>
        </dl>
      </section>

      <section className="mt-8 overflow-hidden rounded-2xl border border-border bg-card shadow-sm p-6">
        <DeleteConfirmationDialog
          action={deleteMediaAction}
          itemName={item.filename}
          itemType="media item"
          id={item.id}
        />
      </section>
    </div>
  );
}
