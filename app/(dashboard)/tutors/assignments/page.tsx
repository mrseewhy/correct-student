import { requireRole } from "@/lib/auth/session";
import { tutor } from "@/lib/workspace-data";

const panel = "rounded-2xl border border-border bg-card p-6 shadow-sm";

export default async function Page() {
  await requireRole(["tutor"]);
  return <div className="mx-auto max-w-site"><h1 className="text-3xl sm:text-4xl">Assignments & Feedback</h1><p className="mt-3 text-muted-foreground">Review practice work and track feedback.</p><div className="mt-8 grid gap-4">{tutor.assignments.map((item) => <div key={item.title} className={`${panel} flex flex-wrap justify-between gap-4`}><div><h2 className="text-xl">{item.title}</h2><p className="mt-2 text-sm text-muted-foreground">{item.student}</p></div><span className="self-start rounded-full bg-secondary px-3 py-1 text-xs font-medium text-primary">{item.status}</span></div>)}</div></div>;
}
