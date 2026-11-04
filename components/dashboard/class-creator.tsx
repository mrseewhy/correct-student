"use client";

import { useEffect, useState } from "react";
import { Plus, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

type ClassDraft = { id: string; title: string; language: string; type: string; level: string; description: string };
const storageKey = "correct-student-tutor-classes";

export function ClassCreator() {
  const [open, setOpen] = useState(false);
  const [drafts, setDrafts] = useState<ClassDraft[]>([]);
  const [loaded, setLoaded] = useState(false);
  useEffect(() => {
    const timer = window.setTimeout(() => {
      try { setDrafts(JSON.parse(localStorage.getItem(storageKey) || "[]") as ClassDraft[]); } catch { setDrafts([]); }
      setLoaded(true);
    }, 0);
    return () => window.clearTimeout(timer);
  }, []);
  function create(formData: FormData) {
    const draft: ClassDraft = {
      id: crypto.randomUUID(), title: String(formData.get("title") || "").trim(),
      language: String(formData.get("language") || ""), type: String(formData.get("type") || ""),
      level: String(formData.get("level") || ""), description: String(formData.get("description") || "").trim(),
    };
    if (!draft.title || !draft.description) return;
    const next = [draft, ...drafts];
    setDrafts(next);
    localStorage.setItem(storageKey, JSON.stringify(next));
    setOpen(false);
  }
  return <section className="mt-8">
    <div className="flex flex-wrap items-center justify-between gap-3"><div><h2 className="text-2xl">Your classes</h2><p className="mt-1 text-sm text-muted-foreground">Create and prepare your own classes.</p></div><Button type="button" onClick={() => setOpen(!open)}><Plus className="size-4" />Create class</Button></div>
    {open && <form action={create} className="mt-5 grid gap-4 rounded-2xl border border-border bg-card p-6 sm:grid-cols-2"><div className="sm:col-span-2"><label htmlFor="class-title" className="mb-2 block text-sm font-medium">Class title</label><Input id="class-title" name="title" required placeholder="e.g. Everyday Yoruba conversations" /></div><div><label htmlFor="class-language" className="mb-2 block text-sm font-medium">Language</label><select id="class-language" name="language" className="h-10 w-full rounded-md border border-input bg-background px-3 text-sm">{["Yoruba", "Igbo", "Hausa", "Fulani"].map((value) => <option key={value}>{value}</option>)}</select></div><div><label htmlFor="class-type" className="mb-2 block text-sm font-medium">Class type</label><select id="class-type" name="type" className="h-10 w-full rounded-md border border-input bg-background px-3 text-sm">{["Lesson", "Story", "Song"].map((value) => <option key={value}>{value}</option>)}</select></div><div><label htmlFor="class-level" className="mb-2 block text-sm font-medium">Level</label><select id="class-level" name="level" className="h-10 w-full rounded-md border border-input bg-background px-3 text-sm">{["Beginner", "Intermediate", "Advanced"].map((value) => <option key={value}>{value}</option>)}</select></div><div className="sm:col-span-2"><label htmlFor="class-description" className="mb-2 block text-sm font-medium">Description</label><textarea id="class-description" name="description" required rows={4} className="w-full rounded-md border border-input bg-background px-3 py-2 text-sm resize-none" placeholder="What will students learn?" /></div><div className="flex gap-2 sm:col-span-2"><Button type="submit">Save class</Button><Button type="button" variant="outline" onClick={() => setOpen(false)}><X className="size-4" />Cancel</Button></div></form>}
    {loaded && <div className="mt-5 grid gap-4 md:grid-cols-2">{drafts.length ? drafts.map((item) => <article key={item.id} className="rounded-2xl border border-border bg-card p-5"><span className="text-xs font-medium text-primary">{item.language} · {item.type} · {item.level}</span><h3 className="mt-3 text-xl">{item.title}</h3><p className="mt-2 text-sm leading-6 text-muted-foreground">{item.description}</p><span className="mt-4 inline-block rounded-full bg-secondary px-3 py-1 text-xs font-medium text-primary">Draft</span></article>) : <p className="rounded-2xl border border-dashed border-border bg-card p-6 text-sm text-muted-foreground md:col-span-2">No classes created yet. Create your first class to begin.</p>}</div>}
  </section>;
}
