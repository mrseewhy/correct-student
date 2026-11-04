import { requireRole } from "@/lib/auth/session";
import { classDescriptionExcerpt } from "@/lib/class-description";
import { listClasses, classPlanKeys } from "@/lib/data/dal/classes";
import { ClassCatalog } from "@/components/site/class-catalog";

export const instant = false;

export default async function Page() {
  const { user } = await requireRole(["student"]);
  const rows = (await listClasses()).filter(item => item.status === "published");
  const items = await Promise.all(rows.map(async item => ({
    ...item,
    description: classDescriptionExcerpt(item.description),
    plans: await classPlanKeys(item.id),
  })));
  return <ClassCatalog items={items} dashboard currentPlan={user.subscription} />;
}
