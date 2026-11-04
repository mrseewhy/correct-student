import { classDescriptionExcerpt } from "@/lib/class-description";
import Link from "next/link";
import { requireRole } from "@/lib/auth/session";
import { listClasses, classPlanKeys } from "@/lib/data/dal/classes";

export default async function Page() {
  const { user } = await requireRole(["student"]);
  const rows = (await listClasses()).filter(x => x.status === "published");
  const classes = await Promise.all(rows.map(async item => ({ ...item, plans: await classPlanKeys(item.id) })));
  return <div className="mx-auto max-w-site"><h1 className="text-3xl">Classes</h1><p className="mt-3 text-muted-foreground">Explore every class. Your subscription unlocks its details and materials.</p><div className="mt-8 grid gap-5 sm:grid-cols-2 xl:grid-cols-3">{classes.map(item => { const allowed = item.plans.some(p => p.planKey === user.subscription); return <article key={item.id} className="overflow-hidden rounded-2xl border border-border bg-card">{item.coverImage && <div className="h-44 bg-cover bg-center" style={{ backgroundImage: `url(${item.coverImage})` }} role="img" aria-label={item.title} />}<div className="p-5"><p className="text-xs text-primary">{item.language} · {item.level} · {item.type}</p><h2 className="mt-2 text-xl">{item.title}</h2><p className="mt-2 line-clamp-3 text-sm text-muted-foreground">{classDescriptionExcerpt(item.description)}</p><p className="mt-3 text-xs text-muted-foreground">Available on: {item.plans.map(p => p.name).join(", ")}</p><Link href={`/students/classes/${item.slug}`} className="mt-4 inline-block text-sm font-medium text-primary">{allowed ? "View class" : "Locked · View plans"}</Link></div></article>; })}{!classes.length && <p className="text-sm text-muted-foreground">No published classes yet.</p>}</div></div>;
}
