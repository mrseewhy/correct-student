import type { Metadata } from "next";
import { notFound } from "next/navigation";

import { CatalogDetails } from "@/components/site/catalog-details";
import { products } from "@/lib/catalog";

export function generateStaticParams() {
  return products.map(({ slug }) => ({ slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const item = products.find((product) => product.slug === slug);
  if (!item) return {};
  return {
    title: item.title,
    description: item.description,
  };
}

export default async function ShopItemPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const item = products.find((product) => product.slug === slug);
  if (!item) notFound();

  const related = products.filter((product) => product.slug !== slug).slice(0, 3);

  return <CatalogDetails item={item} kind="shop" related={related} />;
}
