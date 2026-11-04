"use client";

import { useState } from "react";

import { cn } from "cn";

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";

export function DeleteConfirmationDialog({
  action,
  itemName,
  itemType,
  id,
}: {
  action: (formData: FormData) => Promise<void>;
  itemName: string;
  itemType: string;
  id: string;
}) {
  const [open, setOpen] = useState(false);

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger>
        <span
          className={cn(
            "inline-flex shrink-0 items-center justify-center gap-2 rounded-md border border-destructive bg-background px-3 py-1.5 text-xs font-medium text-destructive shadow-xs hover:bg-destructive/10 transition-colors focus-visible:outline-2 focus-visible:outline-destructive focus-visible:ring-2 focus-visible:ring-destructive/50 disabled:pointer-events-none disabled:opacity-50 [&_svg]:pointer-events-none [&_svg]:shrink-0",
          )}
        >
          Delete {itemType}
        </span>
      </DialogTrigger>
      <DialogContent>
        <DialogTitle>Delete {itemType}?</DialogTitle>
        <DialogDescription>
          Are you sure you want to delete &quot;{itemName}&quot;? This cannot be undone.
        </DialogDescription>
        <DialogFooter>
          <form action={action} className="flex gap-2">
            <input type="hidden" name="id" value={id} />
            <Button type="submit" variant="destructive">
              Delete {itemType}
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
