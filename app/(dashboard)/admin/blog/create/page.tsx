import { Suspense } from "react";
import Link from "next/link";
import { requireRole } from "@/lib/auth/session";
import { BlogForm } from "@/components/dashboard/blog-form";
import { createBlogPostAction } from "@/lib/data/actions/blog-admin";
import Loading from "../../loading";

export default function Page({ searchParams }: { searchParams: Promise<{ error?: string }> }) {
  return <Suspense fallback={<Loading />}><CreateBlogContent searchParams={searchParams} /></Suspense>;
}

async function CreateBlogContent({ searchParams }: { searchParams: Promise<{ error?: string }> }) {
  await requireRole(["admin", "super-admin"]);
  const { error } = await searchParams;
  return <div className="mx-auto max-w-site"><Link href="/admin/blog" className="text-sm text-primary hover:underline">← All posts</Link><h1 className="my-6 text-3xl">Create blog post</h1>{error && <p role="alert" className="mb-4 rounded-md bg-destructive/10 p-3 text-sm text-destructive">{error}</p>}<BlogForm action={createBlogPostAction} /></div>;
}
