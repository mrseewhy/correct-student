"use client";
import { useState } from "react";
import { Check, Minus, Plus, ShoppingBag } from "lucide-react";
import { Button } from "@/components/ui/button";

export function ProductActions({ title, digital }: { title: string; digital: boolean }) {
  const [quantity, setQuantity] = useState(1);
  const [added, setAdded] = useState(false);
  return <div className="mt-7">
    {!digital && <div className="mb-4 flex items-center gap-4"><span className="text-sm text-muted-foreground">Quantity</span><div className="flex items-center rounded-lg border border-border bg-card"><Button variant="ghost" size="icon" aria-label="Decrease quantity" disabled={quantity === 1} onClick={() => { setQuantity(Math.max(1, quantity - 1)); setAdded(false); }}><Minus className="size-4" /></Button><span className="w-8 text-center text-sm" aria-live="polite">{quantity}</span><Button variant="ghost" size="icon" aria-label="Increase quantity" disabled={quantity === 10} onClick={() => { setQuantity(Math.min(10, quantity + 1)); setAdded(false); }}><Plus className="size-4" /></Button></div></div>}
    <Button variant="cta" size="xl" className="w-full" onClick={() => setAdded(true)}>{added ? <Check className="size-4" /> : <ShoppingBag className="size-4" />}{added ? "Added to demo cart" : "Add to cart"}</Button>
    <p className="mt-3 text-xs leading-6 text-muted-foreground" role="status">{added ? `${digital ? 1 : quantity} × ${title} selected. This is a demo; checkout is not connected yet.` : "Demo shop — no payment or order will be placed."}</p>
  </div>;
}
