import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowRight, Search } from "lucide-react";

import { findAdminSection } from "@/lib/admin-data";

export function AdminSection({ slug }: { slug: string }) {
  const section = findAdminSection(slug);
  if (slug === "settings") return <div className="mx-auto max-w-site"><h1 className="text-3xl sm:text-4xl">Settings</h1><p className="mt-3 text-muted-foreground">Platform preferences and account settings.</p><div className="mt-8 rounded-2xl border border-border bg-card p-8"><h2 className="text-xl">Administrator account</h2><p className="mt-3 text-sm text-muted-foreground">Account and platform controls will be available here when the service is connected.</p></div></div>;
  if (!section) notFound();
  return <div className="mx-auto max-w-site">
    <div className="flex flex-wrap items-end justify-between gap-4"><div><p className="text-xs font-semibold uppercase tracking-widest text-primary">Administration</p><h1 className="mt-2 text-3xl sm:text-4xl">{section.label}</h1><p className="mt-3 text-muted-foreground">{section.description}</p></div><span className="rounded-full border border-border bg-card px-4 py-2 text-sm text-muted-foreground">{section.records.length} records</span></div>
    <div className="mt-8 overflow-hidden rounded-2xl border border-border bg-card shadow-sm">
      <div className="flex flex-wrap items-center justify-between gap-3 border-b border-border px-5 py-4 sm:px-6"><div><h2 className="text-lg">All {section.label.toLowerCase()}</h2><p className="mt-1 text-xs text-muted-foreground">Select a row to view its details</p></div><Search className="size-4 text-muted-foreground" aria-hidden /></div>
      <div className="hidden grid-cols-[minmax(0,2fr)_minmax(0,1.4fr)_minmax(0,1fr)_1.5rem] gap-4 border-b border-border bg-secondary/40 px-6 py-3 text-xs font-semibold uppercase tracking-wide text-muted-foreground md:grid"><span>{section.columns[0]}</span><span>{section.columns[1]}</span><span>{section.columns[2]}</span><span /></div>
      <ul className="divide-y divide-border">{section.records.map((item) => <li key={item.id}><Link href={`/admin/${slug}/${item.id}`} className="grid gap-2 px-5 py-4 transition-colors hover:bg-secondary/30 focus-visible:bg-secondary/30 sm:px-6 md:grid-cols-[minmax(0,2fr)_minmax(0,1.4fr)_minmax(0,1fr)_1.5rem] md:items-center md:gap-4"><span className="min-w-0 truncate font-medium text-foreground">{item.title}</span><span className="min-w-0 truncate text-sm text-muted-foreground">{item.subtitle}</span><span><span className="inline-flex rounded-full bg-secondary px-3 py-1 text-xs font-medium text-primary">{item.status}</span></span><ArrowRight className="hidden size-4 text-muted-foreground md:block" aria-hidden /></Link></li>)}</ul>
    </div>
  </div>;
}
