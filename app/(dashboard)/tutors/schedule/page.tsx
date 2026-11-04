import { requireRole } from "@/lib/auth/session";
import { tutor } from "@/lib/workspace-data";

const panel = "rounded-2xl border border-border bg-card p-6 shadow-sm";

export default async function Page() {
  await requireRole(["tutor"]);
  return <div className="mx-auto max-w-site"><h1 className="text-3xl sm:text-4xl">Schedule</h1><p className="mt-3 text-muted-foreground">Your upcoming sessions and teaching times.</p><div className="mt-8 grid gap-4">{tutor.schedule.map((item) => <div key={`${item.day}-${item.time}`} className={`${panel} flex flex-wrap items-center justify-between gap-4`}><div><p className="text-xs font-medium text-primary">{item.day} · {item.time}</p><h2 className="mt-2 text-xl">{item.title}</h2><p className="mt-1 text-sm text-muted-foreground">With {item.learner}</p></div><span className="rounded-full bg-secondary px-3 py-1 text-xs font-medium text-primary">Scheduled</span></div>)}</div><div className={`${panel} mt-8`}><h2 className="text-xl">Availability</h2><p className="mt-2 text-sm text-muted-foreground">Monday, Wednesday and Friday · 9:00 AM–4:00 PM</p></div></div>;
}
