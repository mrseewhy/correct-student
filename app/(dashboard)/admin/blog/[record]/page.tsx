import { Suspense } from "react";
import Link from "next/link";
import { notFound } from "next/navigation";
import { requireRole } from "@/lib/auth/session";
import { BlogForm } from "@/components/dashboard/blog-form";
import { DeleteConfirmationDialog } from "@/components/dashboard/delete-confirmation-dialog";
import { deleteBlogPostAction, updateBlogPostAction } from "@/lib/data/actions/blog-admin";
import { getBlogPostById } from "@/lib/data/dal/blog-posts";
import Loading from "../../loading";

type Props = { params: Promise<{ record: string }> };

export default function Page({ params }: Props) {
  return <Suspense fallback={<Loading />}><EditBlogContent params={params} /></Suspense>;
}

async function EditBlogContent({ params }: Props) {
  await requireRole(["admin", "super-admin"]);
  const { record } = await params;
  const post = await getBlogPostById(record);
  if (!post) notFound();
  return <div className="mx-auto max-w-site"><Link href="/admin/blog" className="text-sm text-primary hover:underline">← All posts</Link><div className="my-6 flex flex-wrap items-center justify-between gap-3"><h1 className="text-3xl">Edit blog post</h1><DeleteConfirmationDialog action={deleteBlogPostAction} id={post.id} itemName={post.title} itemType="post" /></div><BlogForm action={updateBlogPostAction} post={post} /></div>;
}
