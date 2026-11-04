import { classDescriptionText } from "@/lib/class-description";
import Link from "next/link";
import { notFound } from "next/navigation";
import { requireRole } from "@/lib/auth/session";
import { canAccessClass, classPlanKeys, getClassBySlug, studentClassProgress } from "@/lib/data/dal/classes";
import { startClassAction, completeClassAction } from "@/lib/data/actions/class-progress";

export const instant = false;

export default async function Page({ params }: { params: Promise<{ slug: string }> }) {
  const { user } = await requireRole(["student"]);
  const { slug } = await params;
  const item = await getClassBySlug(slug);
  if (!item || item.status !== "published") notFound();
  const plans = await classPlanKeys(item.id);
  const allowed = await canAccessClass(item.id, user.subscription);
  if (!allowed) return <div className="mx-auto max-w-3xl"><Link href="/students/classes" className="text-sm text-primary">Back to classes</Link><h1 className="mt-6 text-3xl">{item.title}</h1><div className="mt-8 rounded-2xl border border-border bg-card p-8"><h2 className="text-xl">This class is locked</h2><p className="mt-3 text-muted-foreground">Available with {plans.map(p => p.name).join(", ")}. Your current plan does not include this class.</p><Link href="/students/subscriptions" className="mt-5 inline-block text-primary underline">View subscriptions</Link></div></div>;
  const progress = await studentClassProgress(user.id, item.id);
  return <div className="mx-auto max-w-3xl"><Link href="/students/classes" className="text-sm text-primary">Back to classes</Link><h1 className="mt-6 text-3xl">{item.title}</h1><p className="mt-3 text-sm text-muted-foreground">{item.durationMinutes} minutes</p><p className="mt-6 leading-7">{classDescriptionText(item.description)}</p>{progress ? <><section className="mt-8"><h2 className="text-xl">Class materials</h2><div className="mt-4 space-y-5">{item.materials.map(material => <div key={material.id} className="rounded-xl border border-border bg-card p-5">{material.kind === "youtube" && material.url && <a href={material.url} target="_blank" rel="noopener noreferrer" className="text-primary underline">Watch the YouTube video</a>}{material.kind === "text" && <p className="whitespace-pre-wrap">{material.content}</p>}{material.kind === "audio" && <audio controls src={`/api/classes/materials/${material.id}`} className="w-full" />}{material.kind === "pdf" && <a href={`/api/classes/materials/${material.id}`} className="text-primary underline">Open PDF material</a>}</div>)}</div></section>{progress.completedAt ? <p className="mt-8 text-sm text-emerald-600">Completed</p> : <form action={completeClassAction} className="mt-8"><input type="hidden" name="classId" value={item.id} /><button type="submit" className="rounded-md bg-primary px-5 py-3 text-sm text-primary-foreground">Mark as completed</button></form>}</> : <form action={startClassAction} className="mt-8"><input type="hidden" name="classId" value={item.id} /><button type="submit" className="rounded-md bg-primary px-5 py-3 text-sm text-primary-foreground">Start class</button></form>}</div>;
}
