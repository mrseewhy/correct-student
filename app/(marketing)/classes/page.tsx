import type { Metadata } from "next";
import { classDescriptionExcerpt } from "@/lib/class-description";
import { listClasses, classPlanKeys } from "@/lib/data/dal/classes";
import { ClassCatalog } from "@/components/site/class-catalog";

export const metadata: Metadata = { title: "Classes", description: "Browse language classes at Correct Student." };
export const instant = false;

export default async function ClassesPage() {
  const rows = (await listClasses()).filter(item => item.status === "published");
  const items = await Promise.all(rows.map(async item => ({
    ...item,
    description: classDescriptionExcerpt(item.description),
    plans: await classPlanKeys(item.id),
  })));
  return <ClassCatalog items={items} />;
}
