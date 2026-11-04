"use client";

import { useState } from "react";
import Link from "next/link";
import { Search, SlidersHorizontal } from "lucide-react";
import { DEFAULT_CLASS_COVER } from "@/lib/class-cover";

export type ClassCatalogItem = {
  id: string;
  slug: string;
  title: string;
  description: string;
  coverImage: string | null;
  durationMinutes: number;
  language: string;
  type: string;
  mediaType: string;
  level: string;
  plans: { planKey: string; name: string }[];
};

type FilterKey = "mediaType" | "type" | "level" | "plans" | "language";
const filterLabels: { key: FilterKey; label: string }[] = [
  { key: "mediaType", label: "Media type" },
  { key: "type", label: "Class type" },
  { key: "level", label: "Level" },
  { key: "plans", label: "Subscription" },
  { key: "language", label: "Language" },
];

export function ClassCatalog({ items, dashboard = false, currentPlan }: { items: ClassCatalogItem[]; dashboard?: boolean; currentPlan?: string }) {
  const [selected, setSelected] = useState<Partial<Record<FilterKey, string[]>>>({});
  const [search, setSearch] = useState("");
  const [filtersOpen, setFiltersOpen] = useState(false);
  const activeCount = Object.values(selected).reduce((count, values) => count + (values?.length ?? 0), 0);
  const groups = filterLabels.map(group => ({
    ...group,
    options: group.key === "plans"
      ? [...new Map(items.flatMap(item => item.plans.map(plan => [plan.planKey, plan.name] as const))).entries()].map(([value, label]) => ({ value, label }))
      : [...new Set(items.map(item => String(item[group.key])))].sort().map(value => ({ value, label: value })),
  }));
  const query = search.trim().toLowerCase();
  const filtered = items.filter(item =>
    (!query || `${item.title} ${item.description}`.toLowerCase().includes(query)) &&
    filterLabels.every(({ key }) => {
      const values = selected[key];
      return !values?.length || (key === "plans"
        ? item.plans.some(plan => values.includes(plan.planKey))
        : values.includes(String(item[key])));
    }),
  );
  function toggle(key: FilterKey, value: string) {
    setSelected(previous => {
      const values = previous[key] ?? [];
      return { ...previous, [key]: values.includes(value) ? values.filter(item => item !== value) : [...values, value] };
    });
  }
  function clear() { setSelected({}); setSearch(""); }

  return <section className={dashboard ? "" : "bg-linear-to-b from-secondary via-background to-background py-16 md:py-24"}>
    <div className="mx-auto max-w-site px-4">
      <div className={dashboard ? "" : "mx-auto max-w-2xl text-center"}>
        <h1 className={dashboard ? "text-3xl" : "text-4xl sm:text-5xl"}>Classes</h1>
        <p className="mt-4 text-muted-foreground">Explore lessons, stories, and songs across our languages.</p>
      </div>
      <div className="mt-10 grid items-start gap-8 lg:grid-cols-[15rem_minmax(0,1fr)] lg:gap-10">
        <div className="lg:sticky lg:top-28">
          <button type="button" aria-expanded={filtersOpen} aria-controls="class-filters" onClick={() => setFiltersOpen(!filtersOpen)} className="flex w-full items-center justify-between rounded-md border border-input bg-card px-4 py-2 text-sm lg:hidden">
            <span className="flex items-center gap-2"><SlidersHorizontal className="size-4" />Filters{activeCount > 0 && ` (${activeCount})`}</span><span>{filtersOpen ? "Hide" : "Show"}</span>
          </button>
          <aside id="class-filters" aria-label="Filter classes" className={`${filtersOpen ? "block" : "hidden"} mt-4 rounded-2xl border border-border bg-card p-6 shadow-sm lg:mt-0 lg:block`}>
            <div className="flex items-center justify-between gap-2"><h2 className="text-base font-medium">Filters</h2><button type="button" onClick={clear} className="text-xs font-medium text-primary hover:underline">Clear all</button></div>
            {groups.map(group => <fieldset key={group.key} className="mt-6 border-t border-border pt-5"><legend className="float-left mb-4 w-full text-sm font-medium">{group.label}</legend><div className="clear-both space-y-3">{group.options.map(option => <label key={option.value} className="flex cursor-pointer items-center gap-3 text-sm text-muted-foreground"><input type="checkbox" checked={selected[group.key]?.includes(option.value) ?? false} onChange={() => toggle(group.key, option.value)} className="size-4 accent-primary" />{option.label}</label>)}</div></fieldset>)}
          </aside>
        </div>
        <div className="min-w-0">
          <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
            <p role="status" className="text-sm text-muted-foreground">{filtered.length} {filtered.length === 1 ? "class" : "classes"}{query || activeCount ? " found" : " to explore"}</p>
            <label className="relative block w-full sm:max-w-xs"><span className="sr-only">Search classes</span><Search className="absolute top-3 left-3 size-4 text-muted-foreground" aria-hidden /><input value={search} onChange={event => setSearch(event.target.value)} placeholder="Search classes" className="h-10 w-full rounded-md border border-input bg-card pr-3 pl-9 text-sm" /></label>
          </div>
          {filtered.length ? <div className="mt-6 grid gap-6 sm:grid-cols-2 xl:grid-cols-3">{filtered.map(item => {
            const href = `${dashboard ? "/students" : ""}/classes/${item.slug}`;
            const allowed = currentPlan && item.plans.some(plan => plan.planKey === currentPlan);
            return <article key={item.id} className="flex h-full flex-col overflow-hidden rounded-3xl border border-border bg-card shadow-sm">
              <Link href={href} tabIndex={-1} aria-hidden className="block aspect-4/3 bg-secondary bg-cover bg-center" style={{ backgroundImage: `url("${item.coverImage || DEFAULT_CLASS_COVER}")` }} />
              <div className="flex flex-1 flex-col p-5"><p className="text-xs font-medium text-primary">{item.language} · {item.type} · {item.level}</p><h2 className="mt-3 text-xl"><Link href={href} className="hover:underline">{item.title}</Link></h2><p className="mt-3 line-clamp-3 text-sm leading-6 text-muted-foreground">{item.description}</p><p className="mt-3 text-xs text-muted-foreground">{item.mediaType} · {item.durationMinutes} min</p><p className="mt-2 text-xs text-muted-foreground">Available on: {item.plans.map(plan => plan.name).join(", ")}</p><Link href={href} className="mt-auto pt-5 text-sm font-medium text-primary hover:underline">{dashboard ? (allowed ? "View class" : "Locked · View plans") : "View access options"}</Link></div>
            </article>;
          })}</div> : <div className="mt-6 rounded-3xl border border-border bg-card px-6 py-16 text-center"><h2 className="text-2xl">No matching classes</h2><p className="mt-3 text-muted-foreground">Try another search or clear your filters.</p><button type="button" onClick={clear} className="mt-5 text-sm font-medium text-primary underline">Clear search and filters</button></div>}
        </div>
      </div>
    </div>
  </section>;
}
