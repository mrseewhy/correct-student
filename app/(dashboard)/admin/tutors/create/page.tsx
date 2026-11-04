import Link from "next/link";
import { requireRole } from "@/lib/auth/session";
import { ManagedUserCreateForm } from "@/components/dashboard/managed-user-create-form";
import { createTutorAction } from "@/lib/data/actions/users-admin";

export const instant = false;

export default async function Page() {
  await requireRole(["admin", "super-admin"]);
  return (
    <div className="mx-auto max-w-site">
      <Link href="/admin/tutors" className="inline-flex items-center gap-2 text-sm font-medium text-primary hover:underline">← Back to Tutors</Link>
      <h1 className="mt-8 text-3xl sm:text-4xl">Create tutor</h1>
      <ManagedUserCreateForm action={createTutorAction} submitLabel="Create tutor" includePlan={false} />
    </div>
  );
}
