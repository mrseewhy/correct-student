import type { Metadata } from "next";
import Link from "next/link";
import { listClasses, classPlanKeys } from "@/lib/data/dal/classes";

export const metadata: Metadata = { title: "Classes", description: "Browse language classes at Correct Student." };
export const instant = false;
export default async function ClassesPage() {
  const rows = (await listClasses()).filter(x => x.status === "published");
  const classes = await Promise.all(rows.map(async item => ({ ...item, plans: await classPlanKeys(item.id) })));
  return <main className="mx-auto max-w-site px-4 py-20"><h1 className="text-4xl">Classes</h1><p className="mt-4 text-muted-foreground">Explore language lessons, stories and songs.</p><div className="mt-10 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">{classes.map(item => <article key={item.id} className="overflow-hidden rounded-2xl border border-border bg-card">{item.coverImage && <div role="img" aria-label={item.title} className="h-44 bg-cover bg-center" style={{ backgroundImage: `url(${item.coverImage})` }} />}<div className="p-5"><p className="text-xs text-primary">{item.language} · {item.level}</p><h2 className="mt-2 text-xl">{item.title}</h2><p className="mt-3 line-clamp-3 text-sm text-muted-foreground">{item.description}</p><p className="mt-3 text-xs text-muted-foreground">Available on: {item.plans.map(p => p.name).join(", ")}</p><Link href={`/classes/${item.slug}`} className="mt-4 inline-block text-sm text-primary">View access options</Link></div></article>)}{!classes.length && <p className="text-sm text-muted-foreground">No classes published yet.</p>}</div></main>;
}
