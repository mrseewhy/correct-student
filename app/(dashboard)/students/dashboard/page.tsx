import { requireRole } from "@/lib/auth/session";
import Link from "next/link";
import { learner } from "@/lib/workspace-data";
import { getPlanName } from "@/lib/data/dal/pricing-plans";

export const instant = false;

const panel = "rounded-2xl border border-border bg-card p-6 shadow-sm";
const progress = (value: number) => <div className="mt-3 h-2 overflow-hidden rounded-full bg-secondary"><div className="h-full rounded-full bg-primary" style={{ width: `${value}%` }} /></div>;

export default async function Page() {
  // The page-level check also hands the page the real session user;
  // the layout's RoleGate re-verifies it independently.
  const { user } = await requireRole(["student"]);

  const firstName = user.name.trim().split(/\s+/)[0] ?? user.name;
  const currentPlanName = await getPlanName(user.subscription);

  return <div className="mx-auto max-w-site"><h1 className="text-3xl sm:text-4xl">Welcome back, {firstName}</h1><p className="mt-3 text-muted-foreground">Keep your language journey moving, one lesson at a time.</p><div className="mt-8 grid gap-5 sm:grid-cols-3"><div className={panel}><p className="text-sm text-muted-foreground">Classes in progress</p><p className="mt-2 text-3xl font-bold text-primary">{learner.courses.length}</p></div><div className={panel}><p className="text-sm text-muted-foreground">Learning language</p><p className="mt-2 text-2xl font-bold text-primary">{learner.language}</p></div><div className={panel}><p className="text-sm text-muted-foreground">Current plan</p><p className="mt-2 text-2xl font-bold text-primary">{currentPlanName}</p></div></div><h2 className="mt-10 text-2xl">Continue learning</h2><div className="mt-5 grid gap-5 md:grid-cols-2">{learner.courses.map((course) => <Link key={course.slug} href={`/students/classes/${course.slug}`} className={panel}><h3 className="text-xl">{course.title}</h3><p className="mt-2 text-sm text-muted-foreground">Next: {course.next}</p>{progress(course.progress)}<span className="mt-2 block text-xs text-muted-foreground">{course.progress}% complete</span></Link>)}</div><h2 className="mt-10 text-2xl">Recent activity</h2><ul className="mt-5 divide-y divide-border overflow-hidden rounded-2xl border border-border bg-card">{learner.recent.map((entry) => <li key={entry} className="px-6 py-4 text-sm">{entry}</li>)}</ul></div>;
}
