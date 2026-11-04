import { Suspense } from "react";
import Link from "next/link";
import { requireRole } from "@/lib/auth/session";
import { countAdminBlogPosts, listAdminBlogPosts } from "@/lib/data/dal/blog-posts";
import { DeleteConfirmationDialog } from "@/components/dashboard/delete-confirmation-dialog";
import { deleteBlogPostAction } from "@/lib/data/actions/blog-admin";
import { TableSkeleton } from "@/components/dashboard/table-skeleton";

type SearchParams = Promise<Record<string, string | string[] | undefined>>;
const pageSizes = [10, 20, 50, 100] as const;

function pageHref(title: string, size: number, page: number) {
  const params = new URLSearchParams({ size: String(size), page: String(page) });
  if (title) params.set("title", title);
  return `/admin/blog?${params}`;
}

export default function Page({ searchParams }: { searchParams: SearchParams }) {
  return <Suspense fallback={<TableSkeleton />}><BlogList searchParams={searchParams} /></Suspense>;
}

async function BlogList({ searchParams }: { searchParams: SearchParams }) {
  await requireRole(["admin", "super-admin"]);
  const params = await searchParams;
  const title = typeof params.title === "string" ? params.title.trim().slice(0, 180) : "";
  const requestedSize = Number(params.size);
  const size = pageSizes.find((value) => value === requestedSize) ?? 10;
  const requestedPage = Number(params.page);
  const page = Number.isSafeInteger(requestedPage) && requestedPage > 0 ? requestedPage : 1;
  const total = await countAdminBlogPosts(title);
  const totalPages = Math.max(1, Math.ceil(total / size));
  const currentPage = Math.min(page, totalPages);
  const posts = await listAdminBlogPosts(title, size, (currentPage - 1) * size);
  return <div className="mx-auto max-w-site">
    <div className="flex flex-wrap items-end justify-between gap-4"><div><h1 className="text-3xl">Blog posts</h1><p className="mt-2 text-muted-foreground">Create, edit, publish, and remove articles.</p></div><Link href="/admin/blog/create" className="rounded-md bg-primary px-4 py-2 text-sm text-primary-foreground">Create post</Link></div>
    <form method="get" className="mt-8 grid gap-3 rounded-2xl border border-border bg-card p-5 sm:grid-cols-[minmax(0,1fr)_auto_auto] sm:items-end">
      <label className="grid gap-2 text-sm font-medium">Filter by title<input name="title" type="search" maxLength={180} defaultValue={title} placeholder="Search blog post titles" className="h-10 w-full rounded-md border border-input bg-background px-3" /></label>
      <label className="grid gap-2 text-sm font-medium">Show<select name="size" defaultValue={String(size)} className="h-10 rounded-md border border-input bg-background px-3">{pageSizes.map((value) => <option key={value} value={value}>{value}</option>)}</select></label>
      <button type="submit" className="h-10 rounded-md bg-primary px-5 text-sm font-medium text-primary-foreground">Apply filters</button>
    </form>
    <p className="mt-4 text-sm text-muted-foreground">Showing {posts.length} of {total} matching posts</p>
    <div className="mt-8 divide-y divide-border rounded-2xl border border-border bg-card">
      {posts.length ? posts.map((post) => (
        <div key={post.id} className="flex flex-wrap items-center justify-between gap-4 p-5">
          <div className="min-w-0">
            <strong className="block truncate">{post.title}</strong>
            <span className="block truncate text-xs text-muted-foreground">/{post.slug} · {post.published ? "Published" : "Draft"}</span>
          </div>
          <div className="flex items-center gap-2">
            <Link href={`/admin/blog/${post.id}`} aria-label={`Edit ${post.title}`} className="rounded-md border border-border px-3 py-1.5 text-xs font-medium hover:bg-secondary">Edit</Link>
            <DeleteConfirmationDialog action={deleteBlogPostAction} id={post.id} itemName={post.title} itemType="post" />
          </div>
        </div>
      )) : <p className="p-8 text-sm text-muted-foreground">No blog posts match these filters.</p>}
    </div>
    <nav aria-label="Blog posts pagination" className="mt-6 flex flex-wrap items-center justify-between gap-4">
      <p className="text-sm text-muted-foreground">Page {currentPage} of {totalPages}</p>
      <div className="flex items-center gap-2">
        {currentPage > 1 ? <Link href={pageHref(title, size, currentPage - 1)} className="rounded-md border border-border px-4 py-2 text-sm hover:bg-secondary">Previous</Link> : <span aria-disabled="true" className="rounded-md border border-border px-4 py-2 text-sm opacity-50">Previous</span>}
        {currentPage < totalPages ? <Link href={pageHref(title, size, currentPage + 1)} className="rounded-md border border-border px-4 py-2 text-sm hover:bg-secondary">Next</Link> : <span aria-disabled="true" className="rounded-md border border-border px-4 py-2 text-sm opacity-50">Next</span>}
      </div>
    </nav>
  </div>;
}
