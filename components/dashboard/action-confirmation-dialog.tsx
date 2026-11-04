"use client";

import { useState } from "react";

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";

export function ActionConfirmationDialog({
  action,
  children,
  title,
  description,
  confirmLabel,
  confirmVariant = "destructive",
  hiddenFields,
}: {
  action: (formData: FormData) => void | Promise<void>;
  children: React.ReactNode;
  title: string;
  description: string;
  confirmLabel: string;
  confirmVariant?: "destructive" | "default" | "outline" | "secondary" | "ghost" | "link";
  hiddenFields?: Record<string, string>;
}) {
  const [open, setOpen] = useState(false);

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger>
        {children}
      </DialogTrigger>
      <DialogContent>
        <DialogTitle>{title}</DialogTitle>
        <DialogDescription>{description}</DialogDescription>
        <DialogFooter>
          <form action={action} className="flex gap-2">
            {Object.entries(hiddenFields ?? {}).map(([name, value]) => (
              <input type="hidden" key={name} name={name} value={value} />
            ))}
            <Button type="submit" variant={confirmVariant}>
              {confirmLabel}
            </Button>
            <Button type="button" variant="outline" onClick={() => setOpen(false)}>
              Cancel
            </Button>
          </form>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
