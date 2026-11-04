import { requireRole } from "@/lib/auth/session";
import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { learner } from "@/lib/workspace-data";

const panel = "rounded-2xl border border-border bg-card p-6 shadow-sm";
const progress = (value: number) => <div className="mt-3 h-2 overflow-hidden rounded-full bg-secondary"><div className="h-full rounded-full bg-primary" style={{ width: `${value}%` }} /></div>;

export default async function Page() {
  await requireRole(["student"]);
  return <div className="mx-auto max-w-site"><h1 className="text-3xl sm:text-4xl">My Learning</h1><p className="mt-3 text-muted-foreground">Pick up where you left off and track each class.</p><div className="mt-8 grid gap-5 md:grid-cols-2">{learner.courses.map((course) => <article key={course.slug} className={panel}><h2 className="text-xl">{course.title}</h2><p className="mt-2 text-sm text-muted-foreground">Next: {course.next}</p>{progress(course.progress)}<p className="mt-2 text-xs text-muted-foreground">{course.progress}% complete</p><Link href={`/students/classes/${course.slug}`} className="mt-5 inline-flex items-center gap-2 text-sm font-medium text-primary hover:underline">Continue class <ArrowRight className="size-4" /></Link></article>)}</div><h2 className="mt-10 text-2xl">Completed lessons</h2><div className={`${panel} mt-5 text-sm text-muted-foreground`}>Completed lessons will appear here as you finish your classes.</div></div>;
}
