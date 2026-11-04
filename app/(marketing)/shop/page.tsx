import type { Metadata } from "next";

import { CatalogBrowser } from "@/components/site/catalog-browser";

export const metadata: Metadata = {
  title: "Shop",
  description:
    "Books, bags and downloadable resources that support everyday language learning.",
};

export default function ShopPage() {
  return <CatalogBrowser kind="shop" />;
}
