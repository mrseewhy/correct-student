import Image from "next/image";
import Link from "next/link";
import { ArrowLeft, ArrowRight, Check, Clock, Download, Package, BookOpen } from "lucide-react";
import { Container } from "@/components/site/container";
import { CatalogCard, ProductVisual } from "@/components/site/catalog-card";
import { ProductActions } from "@/components/site/product-actions";
import { buttonVariants } from "@/components/ui/button";
import { type CatalogItem, productPrice } from "@/lib/catalog";

export function CatalogDetails({ item, kind, related, dashboard = false }: { item: CatalogItem; kind: "shop" | "classes"; related: CatalogItem[]; dashboard?: boolean }) {
  const basePath = dashboard ? `/students/${kind}` : `/${kind}`;
  const shop = kind === "shop";
  return <section className={dashboard ? "" : "bg-linear-to-b from-secondary via-background to-background py-12 md:py-20"}>
    <Container>
      <Link href={basePath} className="inline-flex items-center gap-2 text-sm font-medium text-primary hover:underline"><ArrowLeft className="size-4" aria-hidden />Back to {shop ? "shop" : "classes"}</Link>
      <div className="mt-8 grid items-start gap-10 lg:grid-cols-2 lg:gap-16">
        <div className="relative aspect-4/3 overflow-hidden rounded-3xl border border-border bg-card">
          {item.image ? <Image src={item.image} alt={item.title} fill priority sizes="(min-width: 1024px) 50vw, 100vw" className="object-cover" /> : <ProductVisual item={item} />}
        </div>
        <div>
          <div className="flex flex-wrap gap-2 text-xs font-medium text-primary">{(shop ? [item.type, item.format] : [item.language, item.type, item.level]).map((label) => <span key={label} className="rounded-full bg-secondary px-3 py-1.5">{label}</span>)}</div>
          <h1 className="mt-5 text-3xl leading-tight sm:text-4xl">{item.title}</h1>
          <p className="mt-5 text-lg leading-8 text-muted-foreground">{item.description}</p>
          {shop ? <>
            <p className="mt-6 font-heading text-3xl font-bold text-foreground">{productPrice(item.price)}</p>
            <ProductActions title={item.title} digital={item.format === "Digital"} />
            <div className="mt-6 flex items-start gap-3 border-t border-border pt-5"><span className="text-primary">{item.format === "Digital" ? <Download className="size-5" /> : <Package className="size-5" />}</span><div><p className="text-sm font-medium text-foreground">{item.format === "Digital" ? "Digital download" : "Physical product"}</p><p className="mt-1 text-sm leading-6 text-muted-foreground">{item.format === "Digital" ? "A downloadable resource. No physical item is shipped." : "A physical item for delivery. Delivery options will be shown at checkout."}</p></div></div>
          </> : <>
            <p className="mt-6 flex items-center gap-2 text-sm text-muted-foreground"><Clock className="size-4" aria-hidden />{item.duration}<span className="mx-2">·</span>Individual lecture</p>
            <ul className="mt-6 space-y-3">{item.highlights.map((point) => <li key={point} className="flex items-start gap-3 text-sm leading-6 text-foreground/80"><Check className="mt-1 size-4 shrink-0 text-primary" aria-hidden />{point}</li>)}</ul>
            <Link href="/get-started" className={`${buttonVariants({ variant: "cta", size: "xl" })} mt-7 w-full`}>Get Started <ArrowRight className="size-4" aria-hidden /></Link>
            <p className="mt-3 text-xs leading-6 text-muted-foreground">Demo class preview. Lecture content will be added here.</p>
          </>}
        </div>
      </div>
      <div className="mt-16 grid items-start gap-10 lg:grid-cols-[1.5fr_1fr] lg:gap-16">
        <div>
          <h2 className="text-2xl sm:text-3xl">{shop ? "About this item" : "About this class"}</h2>
          <p className="mt-5 text-lg leading-8 text-muted-foreground">{item.details}</p>
          {shop && <><h3 className="mt-8 text-xl">What makes it special</h3><ul className="mt-4 space-y-3">{item.highlights.map((point) => <li key={point} className="flex items-start gap-3 leading-7 text-foreground/80"><Check className="mt-1.5 size-4 shrink-0 text-primary" aria-hidden />{point}</li>)}</ul></>}
          {!shop && <div className="mt-8 border-t border-border pt-7"><h3 className="text-xl">Before you begin</h3><p className="mt-3 leading-7 text-muted-foreground">{item.level === "Beginner" ? "No previous experience needed. Find a comfortable place to listen and keep a notebook nearby if you like to write or draw." : item.level === "Intermediate" ? "This class builds on introductory vocabulary and simple phrases. Explore beginner classes first if these still feel unfamiliar." : "This class is for learners comfortable following longer phrases and sharing their own ideas. Revisit intermediate classes whenever you need a refresher."}</p></div>}
        </div>
        <aside className="rounded-2xl border border-border bg-card p-6 shadow-sm sm:p-8">
          <h2 className="text-xl">{shop ? "Product details" : "Class outline"}</h2>
          {shop ? <dl className="mt-5 divide-y divide-border">{item.specifications?.map((specification) => <div key={specification.label} className="flex flex-wrap justify-between gap-3 py-4 first:pt-0 last:pb-0"><dt className="text-sm text-muted-foreground">{specification.label}</dt><dd className="text-sm font-medium text-foreground">{specification.value}</dd></div>)}</dl> : <ol className="mt-5 space-y-5">{item.outline?.map((part, index) => <li key={part.title} className="flex items-start gap-3"><span className="flex size-8 shrink-0 items-center justify-center rounded-full bg-secondary text-sm font-medium text-primary">{index + 1}</span><div><p className="text-sm font-medium leading-6 text-foreground">{part.title}</p><p className="mt-1 text-xs text-muted-foreground">{part.duration}</p></div></li>)}</ol>}
          <Link href={shop ? "/contact-us" : "/features"} className="mt-7 inline-flex items-center gap-2 text-sm font-medium text-primary hover:underline">{shop ? "Questions about this item?" : "How we learn"}{shop ? <ArrowRight className="size-4" aria-hidden /> : <BookOpen className="size-4" aria-hidden />}</Link>
        </aside>
      </div>
      <section aria-labelledby="related-title" className="mt-16 border-t border-border pt-12 md:mt-20">
        <h2 id="related-title" className="text-2xl sm:text-3xl">{shop ? "More to discover" : "Keep learning"}</h2>
        <div className="mt-8 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">{related.map((entry) => <CatalogCard key={entry.slug} item={entry} kind={kind} basePath={basePath} />)}</div>
      </section>
    </Container>
  </section>;
}
