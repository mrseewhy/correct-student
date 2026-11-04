import Link from "next/link";
import { notFound } from "next/navigation";
import { requireRole } from "@/lib/auth/session";
import { getClassBySlug } from "@/lib/data/dal/classes";

export default async function Page({ params }: { params: Promise<{ slug: string }> }) {
  const { user } = await requireRole(["tutor"]);
  const { slug } = await params;
  const item = await getClassBySlug(slug);
  if (!item || (item.primaryTutorId !== user.id && !item.tutors.some(x => x.tutorId === user.id))) notFound();
  return <div className="mx-auto max-w-3xl"><Link href="/tutors/classes" className="text-sm text-primary">Back to my classes</Link><h1 className="mt-6 text-3xl">{item.title}</h1><p className="mt-3 text-sm capitalize text-muted-foreground">{item.status} · {item.durationMinutes} minutes</p><p className="mt-6 leading-7">{item.description}</p><h2 className="mt-8 text-xl">Learning outcomes</h2><ul className="mt-3 list-inside list-disc">{item.outcomes.map(x => <li key={x.id}>{x.text}</li>)}</ul><h2 className="mt-8 text-xl">Outline</h2><ol className="mt-3 list-inside list-decimal">{item.outline.map(x => <li key={x.id}>{x.title}</li>)}</ol></div>;
}
