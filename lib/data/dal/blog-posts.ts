import "server-only";

import { and, count, desc, eq, ilike, ne } from "drizzle-orm";
import { db } from "@/lib";
import { blogPostsTable } from "@/lib/schema";

export const DEFAULT_BLOG_IMAGE = "/img/hero3.jpg";
export type BlogRow = typeof blogPostsTable.$inferSelect;
export type BlogInput = Pick<typeof blogPostsTable.$inferInsert, "slug" | "title" | "excerpt" | "category" | "body" | "featuredImage" | "imageAlt" | "published">;

export async function listBlogPosts(publishedOnly = false) {
  return db.select().from(blogPostsTable)
    .where(publishedOnly ? eq(blogPostsTable.published, true) : undefined)
    .orderBy(desc(blogPostsTable.createdAt));
}

function titleWhere(title: string) {
  const escaped = title.replace(/[\\%_]/g, "\\$&");
  return title ? ilike(blogPostsTable.title, `%${escaped}%`) : undefined;
}

export async function countAdminBlogPosts(title: string) {
  const [row] = await db.select({ total: count() }).from(blogPostsTable).where(titleWhere(title));
  return row?.total ?? 0;
}

export async function listAdminBlogPosts(title: string, limit: number, offset: number) {
  return db.select({
    id: blogPostsTable.id,
    title: blogPostsTable.title,
    slug: blogPostsTable.slug,
    published: blogPostsTable.published,
    createdAt: blogPostsTable.createdAt,
  }).from(blogPostsTable).where(titleWhere(title))
    .orderBy(desc(blogPostsTable.createdAt), desc(blogPostsTable.id))
    .limit(limit).offset(offset);
}

export async function getBlogPostById(id: string) {
  const [post] = await db.select().from(blogPostsTable).where(eq(blogPostsTable.id, id)).limit(1);
  return post ?? null;
}

export async function getPublishedBlogPostBySlug(slug: string) {
  const [post] = await db.select().from(blogPostsTable)
    .where(and(eq(blogPostsTable.slug, slug), eq(blogPostsTable.published, true))).limit(1);
  return post ?? null;
}

export async function blogSlugExists(slug: string, exceptId?: string) {
  const [post] = await db.select({ id: blogPostsTable.id }).from(blogPostsTable)
    .where(exceptId ? and(eq(blogPostsTable.slug, slug), ne(blogPostsTable.id, exceptId)) : eq(blogPostsTable.slug, slug)).limit(1);
  return Boolean(post);
}

export async function createBlogPost(input: BlogInput) {
  const [post] = await db.insert(blogPostsTable).values(input).returning({ id: blogPostsTable.id });
  return post.id;
}

export async function updateBlogPost(id: string, input: BlogInput) {
  await db.update(blogPostsTable).set({ ...input, updatedAt: new Date() }).where(eq(blogPostsTable.id, id));
}

export async function deleteBlogPost(id: string) {
  await db.delete(blogPostsTable).where(eq(blogPostsTable.id, id));
}
