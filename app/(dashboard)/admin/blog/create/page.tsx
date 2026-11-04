import { Suspense } from "react";
import Link from "next/link";
import { requireRole } from "@/lib/auth/session";
import { BlogForm } from "@/components/dashboard/blog-form";
import { createBlogPostAction } from "@/lib/data/actions/blog-admin";
import Loading from "../../loading";

export default function Page() {
  return <Suspense fallback={<Loading />}><CreateBlogContent /></Suspense>;
}

async function CreateBlogContent() {
  await requireRole(["admin", "super-admin"]);
  return <div className="mx-auto max-w-site"><Link href="/admin/blog" className="text-sm text-primary hover:underline">← All posts</Link><h1 className="my-6 text-3xl">Create blog post</h1><BlogForm action={createBlogPostAction} /></div>;
}
