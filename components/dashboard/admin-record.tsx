import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowLeft } from "lucide-react";

import { findAdminSection } from "@/lib/admin-data";

export function AdminRecord({ slug, id }: { slug: string; id: string }) {
  const section = findAdminSection(slug);
  const record = section?.records.find((item) => item.id === id);
  if (!section || !record) notFound();
  return <div className="mx-auto max-w-4xl"><Link href={`/admin/${slug}`} className="inline-flex items-center gap-2 text-sm font-medium text-primary hover:underline"><ArrowLeft className="size-4" aria-hidden />Back to {section.label}</Link><div className="mt-8 flex flex-wrap items-start justify-between gap-4"><div><p className="text-xs font-semibold uppercase tracking-widest text-primary">{section.label}</p><h1 className="mt-2 text-3xl sm:text-4xl">{record.title}</h1><p className="mt-3 text-muted-foreground">{record.subtitle}</p></div><span className="rounded-full bg-secondary px-4 py-2 text-sm font-medium text-primary">{record.status}</span></div><section className="mt-8 overflow-hidden rounded-2xl border border-border bg-card shadow-sm"><h2 className="border-b border-border px-6 py-5 text-xl">Details</h2><dl className="divide-y divide-border">{record.details.map(({ label, value }) => <div key={label} className="grid gap-2 px-6 py-4 sm:grid-cols-[11rem_1fr]"><dt className="text-sm text-muted-foreground">{label}</dt><dd className="break-words text-sm font-medium leading-6 text-foreground">{value}</dd></div>)}</dl></section></div>;
}
