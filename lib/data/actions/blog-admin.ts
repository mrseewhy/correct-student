"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { requireRole } from "@/lib/auth/session";
import { blogPostSchema } from "@/validation/blog-posts";
import { blogSlugExists, createBlogPost, deleteBlogPost, getBlogPostById, updateBlogPost } from "@/lib/data/dal/blog-posts";

const listPath = "/admin/blog";

async function readFeaturedImage(form: FormData, existing?: string | null) {
  if (form.get("removeImage") === "on") return null;
  const file = form.get("featuredImage");
  if (!(file instanceof File) || file.size === 0) return existing ?? null;
  if (file.size > 2_000_000) throw new Error("Featured image must be under 2 MB.");
  const bytes = Buffer.from(await file.arrayBuffer());
  const mime = bytes.subarray(0, 8).equals(Buffer.from([137, 80, 78, 71, 13, 10, 26, 10])) ? "image/png"
    : bytes.subarray(0, 3).equals(Buffer.from([255, 216, 255])) ? "image/jpeg"
    : bytes.toString("ascii", 0, 4) === "RIFF" && bytes.toString("ascii", 8, 12) === "WEBP" ? "image/webp"
    : null;
  if (!mime) throw new Error("Use a PNG, JPEG, or WebP image.");
  return `data:${mime};base64,${bytes.toString("base64")}`;
}

function excerptFromBody(body: string, title: string) {
  const blocks: unknown[] = JSON.parse(body);
  const parts = blocks.flatMap((block) => {
    if (!block || typeof block !== "object" || !("content" in block) || !Array.isArray(block.content)) return [];
    return block.content.flatMap((item: unknown) => item && typeof item === "object" && "text" in item && typeof item.text === "string" ? [item.text] : []);
  });
  const text = parts.join(" ").replace(/\s+/g, " ").trim();
  return (text.length >= 10 ? text : `${title}. ${text}`).slice(0, 400);
}

async function inputFrom(form: FormData, existing?: { featuredImage: string | null; category: string }) {
  const parsed = blogPostSchema.parse({
    slug: form.get("slug"), title: form.get("title"), body: form.get("body"),
    published: form.get("published") === "on",
  });
  return {
    ...parsed,
    excerpt: excerptFromBody(parsed.body, parsed.title),
    category: existing?.category ?? "Article",
    imageAlt: parsed.title,
    featuredImage: await readFeaturedImage(form, existing?.featuredImage),
  };
}

export async function createBlogPostAction(form: FormData) {
  await requireRole(["admin", "super-admin"]);
  let id: string;
  try {
    const input = await inputFrom(form);
    if (await blogSlugExists(input.slug)) throw new Error("This slug is already in use.");
    id = await createBlogPost(input);
  } catch (error) {
    const message = error instanceof Error && /^(Featured image|Use a PNG|This slug)/.test(error.message)
      ? error.message : "Check the required fields and article text, then try again.";
    redirect(`${listPath}/create?error=${encodeURIComponent(message)}`);
  }
  revalidatePath(listPath);
  revalidatePath("/blog");
  redirect(`${listPath}/${id}`);
}

export async function updateBlogPostAction(form: FormData) {
  await requireRole(["admin", "super-admin"]);
  const id = String(form.get("id") ?? "");
  const current = await getBlogPostById(id);
  if (!current) throw new Error("Blog post not found.");
  let slug: string;
  try {
    const input = await inputFrom(form, current);
    if (await blogSlugExists(input.slug, id)) throw new Error("This slug is already in use.");
    await updateBlogPost(id, input);
    slug = input.slug;
  } catch (error) {
    const message = error instanceof Error && /^(Featured image|Use a PNG|This slug)/.test(error.message)
      ? error.message : "Check the required fields and article text, then try again.";
    redirect(`${listPath}/${id}?error=${encodeURIComponent(message)}`);
  }
  revalidatePath(listPath);
  revalidatePath(`${listPath}/${id}`);
  revalidatePath("/blog");
  revalidatePath(`/blog/${current.slug}`);
  revalidatePath(`/blog/${slug}`);
  redirect(`${listPath}/${id}?saved=1`);
}

export async function deleteBlogPostAction(form: FormData) {
  await requireRole(["admin", "super-admin"]);
  const id = String(form.get("id") ?? "");
  const current = await getBlogPostById(id);
  if (!current) throw new Error("Blog post not found.");
  await deleteBlogPost(id);
  revalidatePath(listPath);
  revalidatePath("/blog");
  revalidatePath(`/blog/${current.slug}`);
  redirect(listPath);
}
