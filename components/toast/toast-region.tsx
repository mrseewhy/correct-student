"use client";

import { useEffect, useRef, useState } from "react";
import { usePathname, useSearchParams } from "next/navigation";
import { X } from "lucide-react";
import type { ToastPayload } from "@/lib/toast";

const COOKIE = "cs-action-toast";
const EVENT = "cs:toast";
const DURATION = 6000;

type ToastInput = Pick<ToastPayload, "kind" | "message">;

export function showToast(kind: ToastInput["kind"], message: string) {
  window.sessionStorage.setItem(COOKIE, JSON.stringify({ kind, message }));
  window.dispatchEvent(new CustomEvent<ToastInput>(EVENT, { detail: { kind, message } }));
}

export function queueToast(kind: ToastInput["kind"], message: string) {
  window.sessionStorage.setItem(COOKIE, JSON.stringify({ kind, message }));
}

export function ToastRegion({ flash }: { flash: ToastPayload | null }) {
  const searchParams = useSearchParams();
  const pathname = usePathname();
  const [active, setActive] = useState<ToastPayload | null>(null);
  const lastFlashId = useRef<string | null>(null);

  useEffect(() => {
    if (pathname === "/redirect") return;
    const queued = window.sessionStorage.getItem(COOKIE);
    if (queued) {
      window.sessionStorage.removeItem(COOKIE);
      try {
        const value = JSON.parse(queued) as ToastInput;
        if ((value.kind === "success" || value.kind === "error") && typeof value.message === "string") {
          window.setTimeout(() => setActive({ ...value, id: crypto.randomUUID() }), 0);
        }
      } catch { /* Ignore malformed session data. */ }
    }
  }, [pathname]);

  useEffect(() => {
    if (!flash || lastFlashId.current === flash.id) return;
    lastFlashId.current = flash.id;
    const timer = window.setTimeout(() => setActive(flash), 0);
    document.cookie = `${COOKIE}=; Max-Age=0; Path=/; SameSite=Lax`;
    return () => window.clearTimeout(timer);
  }, [flash]);

  useEffect(() => {
    const error = searchParams.get("error");
    const saved = searchParams.get("saved");
    const passwordSet = searchParams.get("passwordSet");
    if (!error && !saved && !passwordSet) return;
    window.setTimeout(() => setActive({
      id: crypto.randomUUID(),
      kind: error ? "error" : "success",
      message: error ?? (passwordSet ? "Password updated." : "Changes saved."),
    }), 0);
    const url = new URL(window.location.href);
    url.searchParams.delete("error");
    url.searchParams.delete("saved");
    url.searchParams.delete("passwordSet");
    window.history.replaceState(window.history.state, "", url.pathname + url.search + url.hash);
  }, [searchParams]);

  useEffect(() => {
    const listener = (event: Event) => {
      const { kind, message } = (event as CustomEvent<ToastInput>).detail;
      window.sessionStorage.removeItem(COOKIE);
      setActive({ id: crypto.randomUUID(), kind, message });
    };
    window.addEventListener(EVENT, listener);
    return () => window.removeEventListener(EVENT, listener);
  }, []);

  useEffect(() => {
    if (!active) return;
    const id = active.id;
    const timer = window.setTimeout(() => setActive(current => current?.id === id ? null : current), DURATION);
    return () => window.clearTimeout(timer);
  }, [active]);

  if (!active) return null;
  return <div role={active.kind === "error" ? "alert" : "status"} className={`mb-6 flex items-start justify-between gap-4 rounded-xl border px-4 py-3 text-sm shadow-sm ${active.kind === "error" ? "border-destructive/40 bg-destructive/10 text-destructive" : "border-success/40 bg-success/10 text-success"}`}>
    <span>{active.message}</span>
    <button type="button" aria-label="Close notification" onClick={() => setActive(null)} className="shrink-0 rounded-md p-1 hover:bg-black/5 focus-visible:outline-2 focus-visible:outline-ring dark:hover:bg-white/10"><X className="size-4" aria-hidden /></button>
  </div>;
}
