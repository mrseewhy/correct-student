import { requireRole } from "@/lib/auth/session";
import Link from "next/link";
import { tutorClasses } from "@/lib/data/dal/classes";

export default async function Page() {
  const { user } = await requireRole(["tutor"]);
  const classes = await tutorClasses(user.id);
  return <div className="mx-auto max-w-site"><h1 className="text-3xl">My Classes</h1><p className="mt-3 text-muted-foreground">Classes you teach or collaborate on.</p><div className="mt-8 grid gap-5 md:grid-cols-2 xl:grid-cols-3">{classes.map(item => <article key={item.id} className="rounded-2xl border border-border bg-card p-6"><p className="text-xs text-primary">{item.language} · {item.type} · {item.status}</p><h2 className="mt-3 text-xl">{item.title}</h2><p className="mt-2 line-clamp-3 text-sm text-muted-foreground">{item.description}</p><Link href={`/tutors/classes/${item.slug}`} className="mt-4 inline-block text-sm text-primary">View class</Link></article>)}{!classes.length && <p className="text-sm text-muted-foreground">No classes assigned yet.</p>}</div></div>;
}
