import { requireRole } from "@/lib/auth/session";
import { AdminSection } from "@/components/dashboard/admin-section";

export default async function Page() {
  await requireRole(["admin", "super-admin"]);
  return <AdminSection slug="activities" />;
}
