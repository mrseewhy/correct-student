import { BlogEditor } from "@/components/dashboard/blog-editor";
import type { BlogRow } from "@/lib/data/dal/blog-posts";

const input = "h-10 w-full rounded-md border border-input bg-background px-3 text-sm";

export function BlogForm({ action, post }: { action: (form: FormData) => Promise<void>; post?: BlogRow }) {
  return <form action={action} className="grid gap-5 rounded-2xl border border-border bg-card p-5 sm:p-8">
    {post && <input type="hidden" name="id" value={post.id} />}
    <label className="grid gap-2 text-sm font-medium">Title<input name="title" required minLength={3} maxLength={180} defaultValue={post?.title} className={input} /></label>
    <label className="grid gap-2 text-sm font-medium">Slug<input name="slug" required pattern="[a-z0-9]+(-[a-z0-9]+)*" maxLength={160} defaultValue={post?.slug} className={input} /><span className="text-xs text-muted-foreground">Lowercase words separated by hyphens; used in the public URL.</span></label>
    <div className="grid gap-2"><span className="text-sm font-medium">Article</span><BlogEditor initialBody={post?.body} /></div>
    <label className="grid gap-2 text-sm font-medium">Featured image (optional)<input name="featuredImage" type="file" accept="image/png,image/jpeg,image/webp" className="block w-full text-sm file:mr-3 file:rounded-md file:border-0 file:bg-secondary file:px-4 file:py-2" /><span className="text-xs text-muted-foreground">PNG, JPEG, or WebP, up to 2 MB. If empty, the default blog image is shown.</span></label>
    {post?.featuredImage && <label className="flex items-center gap-2 text-sm"><input type="checkbox" name="removeImage" /> Remove current featured image</label>}
    <label className="flex items-center gap-2 text-sm font-medium"><input name="published" type="checkbox" defaultChecked={post?.published ?? false} /> Published</label>
    <button type="submit" className="rounded-md bg-primary px-6 py-3 text-sm font-medium text-primary-foreground sm:justify-self-start">{post ? "Save post" : "Create post"}</button>
  </form>;
}
