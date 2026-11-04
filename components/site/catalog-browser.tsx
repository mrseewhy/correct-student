"use client";

import { useState } from "react";
import { Search, SlidersHorizontal } from "lucide-react";
import { Container } from "@/components/site/container";
import { CatalogCard } from "@/components/site/catalog-card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { type CatalogItem, classes, products, classFilters, shopFilters } from "@/lib/catalog";

export function CatalogBrowser({ kind, dashboard = false }: { kind: "shop" | "classes"; dashboard?: boolean }) {
  const [selected, setSelected] = useState<Record<string, string[]>>({});
  const [search, setSearch] = useState("");
  const [filtersOpen, setFiltersOpen] = useState(false);
  const items = kind === "shop" ? products : classes;
  const groups = kind === "shop" ? shopFilters : classFilters;
  const activeCount = Object.values(selected).flat().length;
  const filtered = items.filter((item) => item.title.toLowerCase().includes(search.toLowerCase().trim()) && groups.every((group) => !selected[group.key]?.length || selected[group.key].includes(String(item[group.key as keyof CatalogItem]))));
  function toggle(key: string, value: string) {
    setSelected((previous) => ({ ...previous, [key]: previous[key]?.includes(value) ? previous[key].filter((item) => item !== value) : [...(previous[key] ?? []), value] }));
  }
  function reset() { setSelected({}); setSearch(""); }

  return (
    <section className={dashboard ? "" : "bg-linear-to-b from-secondary via-background to-background py-16 md:py-24"}>
      <Container>
        <div className="mx-auto max-w-2xl text-center">
          <h1 className="text-4xl sm:text-5xl">{kind === "shop" ? "Shop" : "Classes"}</h1>
          <p className="mt-4 text-lg leading-relaxed text-foreground/80">{kind === "shop" ? "Books, bags and digital discoveries. Find something to bring a little more language into your everyday life." : "Discover lessons, stories and songs in your language. Find a class that meets you where you are."}</p>
        </div>
        <div className="mt-12 grid items-start gap-8 lg:grid-cols-[15rem_minmax(0,1fr)] lg:gap-10">
          <div className="lg:sticky lg:top-28">
            <Button variant="outline" className="w-full justify-between lg:hidden" aria-expanded={filtersOpen} aria-controls="catalog-filters" onClick={() => setFiltersOpen(!filtersOpen)}><span className="flex items-center gap-2"><SlidersHorizontal className="size-4" />Filters{activeCount > 0 && ` (${activeCount})`}</span><span>{filtersOpen ? "Hide" : "Show"}</span></Button>
            <aside id="catalog-filters" aria-label="Filter items" className={`${filtersOpen ? "block" : "hidden"} mt-4 rounded-2xl border border-border bg-card p-6 shadow-sm lg:mt-0 lg:block`}>
              <div className="flex items-center justify-between gap-2"><h2 className="text-base text-foreground">Filters</h2><button type="button" onClick={reset} className="text-xs font-medium text-primary hover:underline">Clear all</button></div>
              {groups.map((group) => <fieldset key={group.key} className="mt-6 border-t border-border pt-5"><legend className="float-left mb-4 w-full font-heading text-sm font-medium text-foreground">{group.label}</legend><div className="clear-both space-y-3">{group.options.map((option) => <label key={option} className="flex cursor-pointer items-center gap-3 text-sm text-muted-foreground"><input type="checkbox" checked={selected[group.key]?.includes(option) ?? false} onChange={() => toggle(group.key, option)} className="size-4 accent-primary" />{option}</label>)}</div></fieldset>)}
            </aside>
          </div>
          <div className="min-w-0">
            <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
              <p className="text-sm text-muted-foreground" role="status">{filtered.length} {kind === "shop" ? "products" : "classes"}{search || activeCount ? " found" : " to explore"}</p>
              <div className="relative w-full sm:max-w-xs"><label htmlFor="catalog-search" className="sr-only">Search {kind === "shop" ? "products" : "classes"}</label><Search className="absolute top-3 left-3 size-4 text-muted-foreground" aria-hidden /><Input id="catalog-search" value={search} onChange={(event) => setSearch(event.target.value)} placeholder={kind === "shop" ? "Search products" : "Search classes"} className="h-10 bg-card pl-9" /></div>
            </div>
            {filtered.length ? <div className="mt-6 grid gap-6 sm:grid-cols-2 xl:grid-cols-3">{filtered.map((item) => <CatalogCard key={item.slug} item={item} kind={kind} basePath={dashboard ? `/students/${kind}` : undefined} />)}</div> : <div className="mt-6 rounded-3xl border border-border bg-card px-6 py-16 text-center"><h2 className="text-2xl">No matches just yet</h2><p className="mt-3 text-muted-foreground">Try another search or clear your filters to explore everything.</p><Button variant="outline" onClick={reset} className="mt-6">Clear search and filters</Button></div>}
          </div>
        </div>
      </Container>
    </section>
  );
}
