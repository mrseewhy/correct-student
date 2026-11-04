import Link from "next/link";
import { notFound } from "next/navigation";
import { requireRole } from "@/lib/auth/session";
import { classOptions, getClassBySlug } from "@/lib/data/dal/classes";
import { updateTutorClassAction, deleteTutorClassAction } from "@/lib/data/actions/classes-admin";
import { ClassForm } from "@/components/dashboard/class-form";

export default async function Page({ params, searchParams }: { params: Promise<{ slug: string }>; searchParams: Promise<{ error?: string; saved?: string }> }) {
  const { user } = await requireRole(["tutor"]);
  const [{ slug }, sp, options] = await Promise.all([params, searchParams, classOptions()]);
  const item = await getClassBySlug(slug);
  if (!item || item.primaryTutorId !== user.id) notFound();
  return <div className="mx-auto max-w-4xl"><Link href="/tutors/classes" className="text-sm text-primary">Back to classes</Link><h1 className="mt-5 text-3xl">Edit {item.title}</h1>{sp.error && <p role="alert" className="mt-4 text-sm text-destructive">{sp.error}</p>}{sp.saved && <p role="status" className="mt-4 text-sm text-emerald-600">Class saved.</p>}<ClassForm options={options} record={item} action={updateTutorClassAction} actorRole="tutor" actorId={user.id} defaultPrimaryTutorId={user.id} /><form action={deleteTutorClassAction} className="mt-6"><input type="hidden" name="id" value={item.id} /><button type="submit" className="rounded-md border border-destructive px-4 py-2 text-sm text-destructive">Delete class</button></form></div>;
}
