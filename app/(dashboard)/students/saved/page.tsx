import { requireRole } from "@/lib/auth/session";
import Link from "next/link";
import { classes } from "@/lib/catalog";
import { products } from "@/lib/catalog";

const panel = "rounded-2xl border border-border bg-card p-6 shadow-sm";

export default async function Page() {
  await requireRole(["student"]);
  return <div className="mx-auto max-w-site"><h1 className="text-3xl sm:text-4xl">Saved Items</h1><p className="mt-3 text-muted-foreground">Classes and resources you want to revisit.</p><div className="mt-8 grid gap-5 md:grid-cols-2">{[classes[1], products[0]].map((item) => <Link key={item.slug} href={item.price === undefined ? `/students/classes/${item.slug}` : `/students/shop/${item.slug}`} className={panel}><span className="text-xs font-medium text-primary">{item.price === undefined ? "Class" : "Product"}</span><h2 className="mt-3 text-xl">{item.title}</h2><p className="mt-2 text-sm text-muted-foreground">{item.description}</p></Link>)}</div></div>;
}
