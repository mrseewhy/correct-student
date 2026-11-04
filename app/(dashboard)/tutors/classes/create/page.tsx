import Link from "next/link";
import { requireRole } from "@/lib/auth/session";
import { classOptions } from "@/lib/data/dal/classes";
import { createTutorClassAction } from "@/lib/data/actions/classes-admin";
import { ClassForm } from "@/components/dashboard/class-form";

export default async function Page({ searchParams }: { searchParams: Promise<{ error?: string }> }) {
  const { user } = await requireRole(["tutor"]);
  const [options, sp] = await Promise.all([classOptions(), searchParams]);
  return <div className="mx-auto max-w-site"><Link href="/tutors/classes" className="text-sm text-primary">Back to classes</Link><h1 className="mt-5 text-3xl">Create class</h1>{sp.error && <p role="alert" className="mt-4 text-sm text-destructive">{sp.error}</p>}<ClassForm options={options} action={createTutorClassAction} actorRole="tutor" actorId={user.id} defaultPrimaryTutorId={user.id} /></div>;
}
