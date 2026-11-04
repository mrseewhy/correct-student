import Link from "next/link";
import { requireRole } from "@/lib/auth/session";
import { listClasses } from "@/lib/data/dal/classes";
import { deleteClassAction } from "@/lib/data/actions/classes-admin";
import { DeleteConfirmationDialog } from "@/components/dashboard/delete-confirmation-dialog";

export const instant = false;

export default async function Page() {
  await requireRole(["admin", "super-admin"]);
  const classes = await listClasses();
  return <div className="mx-auto max-w-site">
    <div className="flex items-center justify-between gap-4"><div><h1 className="text-3xl">Classes</h1><p className="mt-2 text-sm text-muted-foreground">Manage class details, tutors, and subscription access.</p></div><Link href="/admin/classes/create" className="rounded-md bg-primary px-4 py-2 text-sm text-primary-foreground">Create class</Link></div>
    <div className="mt-8 overflow-x-auto rounded-xl border border-border bg-card"><table className="w-full min-w-[850px] text-left text-sm"><thead className="bg-secondary/60"><tr><th className="px-5 py-4 font-medium">Class</th><th className="px-5 py-4 font-medium">Language</th><th className="px-5 py-4 font-medium">Class type</th><th className="px-5 py-4 font-medium">Media</th><th className="px-5 py-4 font-medium">Level</th><th className="px-5 py-4 font-medium">Status</th><th className="px-5 py-4 font-medium">Actions</th></tr></thead><tbody className="divide-y divide-border">{classes.map(item => <tr key={item.id}><td className="px-5 py-4 font-medium">{item.title}</td><td className="px-5 py-4">{item.language}</td><td className="px-5 py-4">{item.type}</td><td className="px-5 py-4">{item.mediaType}</td><td className="px-5 py-4">{item.level}</td><td className="px-5 py-4 capitalize">{item.status}</td><td className="px-5 py-4"><div className="flex items-center gap-3"><Link href={`/admin/classes/${item.id}`} className="font-medium text-primary hover:underline">Edit</Link><DeleteConfirmationDialog action={deleteClassAction} itemName={item.title} itemType="class" id={item.id} /></div></td></tr>)}{!classes.length && <tr><td colSpan={7} className="px-5 py-8 text-center text-muted-foreground">No classes yet.</td></tr>}</tbody></table></div>
  </div>;
}
