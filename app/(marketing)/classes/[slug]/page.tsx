import type { Metadata } from "next";
import Link from "next/link";
import { notFound, redirect } from "next/navigation";
import { getSession } from "@/lib/auth/session";
import { getClassBySlug, classPlanKeys } from "@/lib/data/dal/classes";

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params;
  const item = await getClassBySlug(slug);
  return item?.status === "published" ? { title: item.title } : {};
}
export default async function Page({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const item = await getClassBySlug(slug);
  if (!item || item.status !== "published") notFound();
  const session = await getSession();
  if (session?.user.role === "student") redirect(`/students/classes/${slug}`);
  const plans = await classPlanKeys(item.id);
  return <main className="mx-auto max-w-3xl px-4 py-20"><Link href="/classes" className="text-sm text-primary">Back to classes</Link><h1 className="mt-6 text-4xl">{item.title}</h1><p className="mt-4 text-muted-foreground">Available on: {plans.map(p => p.name).join(", ")}</p><p className="mt-6">Sign in as a student to check access to class details and materials.</p><Link href="/sign-in" className="mt-6 inline-block rounded-md bg-primary px-5 py-3 text-primary-foreground">Sign in</Link></main>;
}
