import { requireRole } from "@/lib/auth/session";
import { tutor } from "@/lib/workspace-data";

const panel = "rounded-2xl border border-border bg-card p-6 shadow-sm";

export default async function Page() {
  await requireRole(["tutor"]);
  return <div className="mx-auto max-w-site"><h1 className="text-3xl sm:text-4xl">Students</h1><p className="mt-3 text-muted-foreground">Learners in your classes and their progress.</p><div className="mt-8 grid gap-5 md:grid-cols-2">{tutor.students.map((student) => <article key={student.name} className={panel}><h2 className="text-xl">{student.name}</h2><p className="mt-2 text-sm text-muted-foreground">{student.language} · {student.course}</p><div className="mt-5 h-2 overflow-hidden rounded-full bg-secondary"><div className="h-full rounded-full bg-primary" style={{ width: `${student.progress}%` }} /></div><p className="mt-2 text-xs text-muted-foreground">{student.progress}% complete</p></article>)}</div></div>;
}
