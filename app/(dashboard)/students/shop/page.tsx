import { requireRole } from "@/lib/auth/session";
import { CatalogBrowser } from "@/components/site/catalog-browser";

export default async function Page() {
  await requireRole(["student"]);
  return <CatalogBrowser kind="shop" dashboard />;
}
