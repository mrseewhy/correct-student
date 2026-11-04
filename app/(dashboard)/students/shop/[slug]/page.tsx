import { notFound } from "next/navigation";
import { requireRole } from "@/lib/auth/session";
import { CatalogDetails } from "@/components/site/catalog-details";
import { products } from "@/lib/catalog";

export function generateStaticParams() {
  return products.map((item) => ({ slug: item.slug }));
}

export default async function Page({ params }: { params: Promise<{ slug: string }> }) {
  await requireRole(["student"]);
  const { slug } = await params;
  const item = products.find((entry) => entry.slug === slug);
  if (!item) notFound();
  return <CatalogDetails item={item} kind="shop" related={products.filter((entry) => entry.slug !== slug).slice(0, 3)} dashboard />;
}
