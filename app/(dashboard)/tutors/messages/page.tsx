import { requireRole } from "@/lib/auth/session";
import { tutor } from "@/lib/workspace-data";

export default async function Page() {
  await requireRole(["tutor"]);
  return <div className="mx-auto max-w-site"><h1 className="text-3xl sm:text-4xl">Messages</h1><p className="mt-3 text-muted-foreground">Conversations with your learners and their families.</p><div className="mt-8 divide-y divide-border overflow-hidden rounded-2xl border border-border bg-card">{tutor.messages.map((item) => <div key={item.subject} className="flex flex-wrap justify-between gap-4 px-6 py-5"><div><h2 className="text-lg">{item.subject}</h2><p className="mt-1 text-sm text-muted-foreground">From {item.from}</p></div><span className="text-xs text-muted-foreground">{item.date}</span></div>)}</div></div>;
}
