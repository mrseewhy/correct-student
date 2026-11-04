import Link from "next/link";
import { notFound } from "next/navigation";
import { requireRole } from "@/lib/auth/session";
import { classOptions, getClass } from "@/lib/data/dal/classes";
import { updateClassAction, deleteClassAction } from "@/lib/data/actions/classes-admin";
import { ClassForm } from "@/components/dashboard/class-form";

export const instant = false;

export default async function Page({ params }: { params: Promise<{ record: string }> }) {
  const { user } = await requireRole(["admin", "super-admin"]);
  const [{ record }, options] = await Promise.all([params, classOptions()]);
  const item = await getClass(record);
  if (!item) notFound();
  const canManagePlatformTutor = user.role === "admin" || user.role === "super-admin";
  return (
    <div className="mx-auto max-w-4xl">
      <Link href="/admin/classes" className="text-sm text-primary">Back to classes</Link>
      <h1 className="mt-5 text-3xl">Edit {item.title}</h1>


      <ClassForm
        options={options}
        record={item}
        action={updateClassAction}
        defaultPrimaryTutorId={item.primaryTutorId}
        canManagePlatformTutor={canManagePlatformTutor}
      />
      <form action={deleteClassAction} className="mt-6"><input type="hidden" name="id" value={item.id} /><button type="submit" className="rounded-md border border-destructive px-4 py-2 text-sm text-destructive">Delete class</button></form>
    </div>
  );
}
