import Link from "next/link";
import { requireRole } from "@/lib/auth/session";
import { StaffCreateForm } from "@/components/dashboard/staff-management";

export const instant = false;

export default async function Page() {
  await requireRole(["super-admin"]);
  return (
    <div className="mx-auto max-w-site">
      <Link href="/admin/staff" className="inline-flex items-center gap-2 text-sm font-medium text-primary hover:underline">← Back to Staff</Link>
      <h1 className="mt-8 text-3xl sm:text-4xl">Create admin</h1>
      <StaffCreateForm />
    </div>
  );
}
