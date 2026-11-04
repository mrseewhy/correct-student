import Link from "next/link";
import { requireRole } from "@/lib/auth/session";
import { classOptions, PLATFORM_TUTOR_ID } from "@/lib/data/dal/classes";
import { createClassAction } from "@/lib/data/actions/classes-admin";
import { ClassForm } from "@/components/dashboard/class-form";

export default async function Page({ searchParams }: { searchParams: Promise<{ error?: string }> }) {
  const { user } = await requireRole(["admin", "super-admin"]);
  const [options, sp] = await Promise.all([classOptions(), searchParams]);
  const canManagePlatformTutor = user.role === "admin" || user.role === "super-admin";
  const tutorIdSet = new Set(options.tutors.map((t) => t.id));
  // Default to the logged-in user when they are a tutor; otherwise to the
  // platform tutor ("Correct Student tutor", the platform's default tutor)
  // when the actor can manage it.
  const defaultPrimaryTutorId = tutorIdSet.has(user.id)
    ? user.id
    : canManagePlatformTutor
      ? PLATFORM_TUTOR_ID
      : "";
  return (
    <div className="mx-auto max-w-site">
      <Link href="/admin/classes" className="text-sm text-primary">Back to classes</Link>
      <h1 className="mt-5 text-3xl">Create class</h1>
      {sp.error && <p role="alert" className="mt-4 text-sm text-destructive">{sp.error}</p>}
      <ClassForm
        options={options}
        action={createClassAction}
        defaultPrimaryTutorId={defaultPrimaryTutorId}
        canManagePlatformTutor={canManagePlatformTutor}
        actorRole={user.role}
        actorId={user.id}
      />
    </div>
  );
}
