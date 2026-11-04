import { requireRole } from "@/lib/auth/session";
import Link from "next/link";
import { tutorClasses } from "@/lib/data/dal/classes";
import { deleteTutorClassAction } from "@/lib/data/actions/classes-admin";
import { DeleteConfirmationDialog } from "@/components/dashboard/delete-confirmation-dialog";

export const instant = false;

export default async function Page() {
  const { user } = await requireRole(["tutor"]);
  const classes = await tutorClasses(user.id);
  return <div className="mx-auto max-w-site">
    <div className="flex items-center justify-between gap-4"><div><h1 className="text-3xl">My Classes</h1><p className="mt-2 text-sm text-muted-foreground">Classes you teach or collaborate on.</p></div><Link href="/tutors/classes/create" className="rounded-md bg-primary px-4 py-2 text-sm text-primary-foreground">Create class</Link></div>
    <div className="mt-8 overflow-x-auto rounded-xl border border-border bg-card"><table className="w-full min-w-[780px] text-left text-sm"><thead className="bg-secondary/60"><tr><th className="px-5 py-4 font-medium">Class</th><th className="px-5 py-4 font-medium">Language</th><th className="px-5 py-4 font-medium">Class type</th><th className="px-5 py-4 font-medium">Media</th><th className="px-5 py-4 font-medium">Status</th><th className="px-5 py-4 font-medium">Actions</th></tr></thead><tbody className="divide-y divide-border">{classes.map(item => <tr key={item.id}><td className="px-5 py-4 font-medium">{item.title}</td><td className="px-5 py-4">{item.language}</td><td className="px-5 py-4">{item.type}</td><td className="px-5 py-4">{item.mediaType}</td><td className="px-5 py-4 capitalize">{item.status}</td><td className="px-5 py-4"><div className="flex items-center gap-3"><Link href={`/tutors/classes/${item.slug}`} className="font-medium text-primary hover:underline">View</Link>{item.createdById === user.id && <><Link href={`/tutors/classes/${item.slug}/edit`} className="font-medium text-primary hover:underline">Edit</Link><DeleteConfirmationDialog action={deleteTutorClassAction} itemName={item.title} itemType="class" id={item.id} /></>}</div></td></tr>)}{!classes.length && <tr><td colSpan={6} className="px-5 py-8 text-center text-muted-foreground">No classes assigned yet.</td></tr>}</tbody></table></div>
  </div>;
}
