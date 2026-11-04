import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { requireRole } from "@/lib/auth/session";
import { tutor } from "@/lib/workspace-data";

export const instant = false;

const links = [
  { title: "My Classes", href: "/tutors/classes", description: "Create classes and review your teaching catalog." },
  { title: "Students", href: "/tutors/students", description: "See learners and their progress." },
  { title: "Schedule", href: "/tutors/schedule", description: "Keep track of upcoming sessions." },
  { title: "Assignments & Feedback", href: "/tutors/assignments", description: "Review learner work and feedback." },
  { title: "Messages", href: "/tutors/messages", description: "Read conversations with learners." },
  { title: "Resources", href: "/tutors/resources", description: "Find materials for your classes." },
];

export default async function TutorDashboardPage() {
  // The page-level check also hands the page the real session user;
  // the layout's RoleGate re-verifies it independently.
  const { user } = await requireRole(["tutor"]);

  const firstName = user.name.trim().split(/\s+/)[0] ?? user.name;

  return <div className="mx-auto max-w-site"><h1 className="text-3xl sm:text-4xl">Welcome back, {firstName}</h1><p className="mt-3 text-muted-foreground">Here is what is happening in your teaching workspace.</p><div className="mt-8 grid gap-4 sm:grid-cols-3">{[["Students", tutor.students.length], ["Upcoming sessions", tutor.schedule.length], ["Assignments to review", tutor.assignments.filter((item) => item.status === "Awaiting review").length]].map(([label, count]) => <div key={label} className="rounded-2xl border border-border bg-card p-6"><p className="text-sm text-muted-foreground">{label}</p><p className="mt-2 text-3xl font-bold text-primary">{count}</p></div>)}</div><h2 className="mt-10 text-2xl">Next sessions</h2><div className="mt-5 grid gap-4 md:grid-cols-2">{tutor.schedule.slice(0, 2).map((item) => <div key={item.title} className="rounded-2xl border border-border bg-card p-6"><p className="text-xs font-medium text-primary">{item.day} · {item.time}</p><h3 className="mt-2 text-xl">{item.title}</h3><p className="mt-1 text-sm text-muted-foreground">With {item.learner}</p></div>)}</div><h2 className="mt-10 text-2xl">Your workspace</h2><div className="mt-5 grid gap-4 sm:grid-cols-2 xl:grid-cols-3">{links.map((item) => <Link key={item.href} href={item.href} className="rounded-2xl border border-border bg-card p-6 transition-colors hover:border-primary"><h3 className="text-lg">{item.title}</h3><p className="mt-2 text-sm leading-6 text-muted-foreground">{item.description}</p><span className="mt-4 inline-flex items-center gap-2 text-sm font-medium text-primary">Open <ArrowRight className="size-4" /></span></Link>)}</div></div>;
}
