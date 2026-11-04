import { requireRole } from "@/lib/auth/session";

const panel = "rounded-2xl border border-border bg-card p-6 shadow-sm";

export default async function Page() {
  await requireRole(["tutor"]);
  return <div className="mx-auto max-w-site"><h1 className="text-3xl sm:text-4xl">Resources</h1><p className="mt-3 text-muted-foreground">Materials to support your lessons.</p><div className="mt-8 grid gap-5 md:grid-cols-2">{["Greeting practice prompts", "Story discussion guide", "Song and rhythm activities", "Learner progress checklist"].map((title) => <article key={title} className={panel}><span className="text-xs font-medium text-primary">Teaching material</span><h2 className="mt-3 text-xl">{title}</h2><p className="mt-2 text-sm text-muted-foreground">Use this resource to plan activities and support learners.</p></article>)}</div></div>;
}
