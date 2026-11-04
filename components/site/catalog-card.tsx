import Image from "next/image";
import Link from "next/link";
import { ArrowRight, BookOpen, Download, ShoppingBag } from "lucide-react";
import { type CatalogItem, productPrice } from "@/lib/catalog";

export function ProductVisual({ item }: { item: CatalogItem }) {
  const Icon = item.type === "Bag" ? ShoppingBag : item.type === "eBook" ? Download : BookOpen;
  return <div className="flex h-full w-full items-center justify-center bg-secondary/60"><Icon className="size-24 text-primary/60" strokeWidth={1} aria-hidden /></div>;
}

export function CatalogCard({ item, kind, basePath = `/${kind}` }: { item: CatalogItem; kind: "shop" | "classes"; basePath?: string }) {
  return (
    <article className="flex h-full flex-col overflow-hidden rounded-3xl border border-border bg-card shadow-sm">
      <Link href={`${basePath}/${item.slug}`} tabIndex={-1} aria-hidden className="relative block aspect-4/3 overflow-hidden">
        {item.image ? <Image src={item.image} alt="" fill sizes="(min-width: 1024px) 33vw, (min-width: 640px) 50vw, 100vw" className="object-cover" /> : <ProductVisual item={item} />}
      </Link>
      <div className="flex flex-1 flex-col p-6">
        <div className="flex flex-wrap gap-2 text-xs font-medium text-primary">
          {(kind === "classes" ? [item.language, item.type, item.level] : [item.type, item.format]).map((label) => <span key={label} className="rounded-full bg-secondary px-2.5 py-1">{label}</span>)}
        </div>
        <h2 className="mt-4 text-xl"><Link href={`${basePath}/${item.slug}`} className="hover:underline">{item.title}</Link></h2>
        <p className="mt-3 text-sm leading-7 text-muted-foreground">{item.description}</p>
        <div className="mt-auto flex items-center justify-between gap-3 pt-6">
          <span className={kind === "shop" ? "font-heading text-lg font-bold text-foreground" : "text-sm text-muted-foreground"}>{kind === "shop" ? productPrice(item.price) : item.duration}</span>
          <Link href={`${basePath}/${item.slug}`} aria-label={`View ${item.title}`} className="inline-flex items-center gap-1.5 text-sm font-medium text-primary hover:underline">View {kind === "shop" ? "item" : "class"}<ArrowRight className="size-4" aria-hidden /></Link>
        </div>
      </div>
    </article>
  );
}
