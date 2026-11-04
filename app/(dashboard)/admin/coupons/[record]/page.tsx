import { requireRole } from "@/lib/auth/session";
import { AdminRecord } from "@/components/dashboard/admin-record";
import { findAdminSection } from "@/lib/admin-data";

export function generateStaticParams() {
  return findAdminSection("coupons")!.records.map((record) => ({ record: record.id }));
}

export default async function Page({ params }: { params: Promise<{ record: string }> }) {
  await requireRole(["admin", "super-admin"]);
  const { record } = await params;
  return <AdminRecord slug="coupons" id={record} />;
}
