import { eq } from "drizzle-orm";
import { db } from "@/lib";
import { classMaterialsTable } from "@/lib/schema";
import { getSession } from "@/lib/auth/session";
import { canAccessClass, studentClassProgress } from "@/lib/data/dal/classes";

export async function GET(_request: Request, { params }: { params: Promise<{ id: string }> }) {
  const session = await getSession();
  if (!session || session.user.role !== "student") return new Response(null, { status: 401 });
  const { id } = await params;
  const [material] = await db.select().from(classMaterialsTable).where(eq(classMaterialsTable.id, id));
  if (!material || !["audio", "pdf"].includes(material.kind) || !material.content) return new Response(null, { status: 404 });
  if (!(await canAccessClass(material.classId, session.user.subscription)) || !(await studentClassProgress(session.user.id, material.classId))) return new Response(null, { status: 403 });
  const bytes = Buffer.from(material.content, "base64");
  return new Response(bytes, { headers: { "Content-Type": material.mimeType ?? "application/octet-stream", "Content-Disposition": `inline; filename="${(material.filename ?? "material").replace(/[^a-zA-Z0-9._-]/g, "_")}"`, "Cache-Control": "private, no-store", "X-Content-Type-Options": "nosniff" } });
}
