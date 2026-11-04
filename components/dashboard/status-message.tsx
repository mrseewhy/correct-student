"use client";

import { useEffect, useState } from "react";
import { X } from "lucide-react";

export function StatusMessage({
  message,
  error = false,
  duration = 6000,
}: {
  message: string | null;
  error?: boolean;
  duration?: number;
}) {
  // Visibility is derived: the banner shows the current message unless it has
  // been dismissed — by the close button, or automatically after `duration`.
  // State only changes in callbacks (timer, click), never in the effect body.
  const [dismissed, setDismissed] = useState<string | null>(null);

  useEffect(() => {
    if (!message) return;
    const timer = window.setTimeout(() => setDismissed(message), duration);
    return () => window.clearTimeout(timer);
  }, [message, duration]);

  if (!message || dismissed === message) return null;

  return (
    <div
      role={error ? "alert" : "status"}
      className={`flex items-start justify-between gap-3 rounded-xl border px-4 py-3 text-sm ${
        error
          ? "border-destructive/30 bg-destructive/10 text-destructive"
          : "border-border bg-card text-foreground"
      }`}
    >
      <span>{message}</span>
      <button
        type="button"
        aria-label="Close message"
        onClick={() => setDismissed(message)}
        className="rounded-md p-1 text-muted-foreground hover:bg-secondary hover:text-foreground"
      >
        <X className="size-4" aria-hidden />
      </button>
    </div>
  );
}
