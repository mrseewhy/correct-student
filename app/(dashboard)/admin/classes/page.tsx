import Link from "next/link";
import { requireRole } from "@/lib/auth/session";
import { listClasses } from "@/lib/data/dal/classes";

export default async function Page() {
  await requireRole(["admin", "super-admin"]);
  const classes = await listClasses();
  return <div className="mx-auto max-w-site"><div className="flex items-center justify-between gap-4"><div><h1 className="text-3xl">Classes</h1><p className="mt-2 text-sm text-muted-foreground">Manage class details, tutors and subscription access.</p></div><Link href="/admin/classes/create" className="rounded-md bg-primary px-4 py-2 text-sm text-primary-foreground">Create class</Link></div><div className="mt-8 divide-y rounded-xl border border-border bg-card">{classes.map(item => <Link key={item.id} href={`/admin/classes/${item.id}`} className="flex justify-between gap-4 p-5 hover:bg-secondary/40"><span><strong>{item.title}</strong><span className="mt-1 block text-sm text-muted-foreground">{item.language} · {item.level} · {item.type}</span></span><span className="text-sm capitalize">{item.status}</span></Link>)}{!classes.length && <p className="p-5 text-sm text-muted-foreground">No classes yet.</p>}</div></div>;
}
