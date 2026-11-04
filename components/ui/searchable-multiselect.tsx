"use client";

import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { X } from "lucide-react";
import { Input } from "@/components/ui/input";

export type MultiSelectOption = { id: string; label: string };

interface SearchableMultiSelectProps {
  name: string;
  options: MultiSelectOption[];
  value: string[];
  onChange: (ids: string[]) => void;
  placeholder?: string;
}

/**
 * Searchable multi-select that renders hidden inputs so the selected values
 * are submitted with the parent form's FormData (server actions).
 */
export function SearchableMultiSelect({
  name,
  options,
  value,
  onChange,
  placeholder = "Search...",
}: SearchableMultiSelectProps) {
  const [open, setOpen] = useState(false);
  const [search, setSearch] = useState("");
  const containerRef = useRef<HTMLDivElement>(null);
  const selectedSet = useMemo(() => new Set(value), [value]);

  const filtered = useMemo(
    () =>
      options.filter((o) => o.label.toLowerCase().includes(search.toLowerCase())),
    [options, search],
  );

  const toggle = (id: string) => {
    const next = new Set(value);
    if (next.has(id)) next.delete(id);
    else next.add(id);
    onChange(Array.from(next));
  };

  const handleOutsideClick = useCallback(
    (e: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(e.target as Node)) {
        setOpen(false);
      }
    },
    [],
  );

  useEffect(() => {
    document.addEventListener("mousedown", handleOutsideClick);
    return () => document.removeEventListener("mousedown", handleOutsideClick);
  }, [handleOutsideClick]);

  return (
    <div ref={containerRef} className="mt-1 w-full" style={{ position: "relative" }}>
      {/* Hidden inputs so selected values submit with the parent form. */}
      {value.map((id) => (
        <input key={id} type="hidden" name={name} value={id} />
      ))}

      <div
        onClick={() => setOpen((prev) => !prev)}
        className="w-full rounded-md border border-input bg-background px-3 py-2 text-sm flex items-center justify-between cursor-pointer hover:border-primary focus-within:border-primary outline-none"
        role="button"
        aria-expanded={open}
        aria-label={placeholder}
      >
        <div className="flex w-full flex-wrap gap-1.5 max-h-[120px] overflow-y-auto pr-8">
          {value.length > 0 ? (
            value.map((id) => {
              const opt = options.find((o) => o.id === id);
              if (!opt) return null;
              return (
                <span key={id} className="flex items-center gap-1.5 rounded-md bg-primary px-2 py-0.5 text-xs text-primary-foreground">
                  {opt.label}
                  <button
                    type="button"
                    onClick={(e) => {
                      e.stopPropagation();
                      toggle(id);
                    }}
                    className="ml-1 inline-flex items-center hover:opacity-70"
                    aria-label={`Remove ${opt.label}`}
                  >
                    <X className="size-3.5" />
                  </button>
                </span>
              );
            })
          ) : (
            <span className="text-xs text-muted-foreground italic">{placeholder}</span>
          )}
        </div>
        <span className="pointer-events-none select-none shrink-0" aria-hidden="true">
          {open ? "▲" : "▼"}
        </span>
      </div>

      {open && (
        <div className="absolute z-50 mt-1 w-full rounded-md border border-input bg-background shadow-lg flex flex-col">
          <div className="px-2 py-2 border-b border-border">
            <Input
              autoFocus
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder={placeholder}
              className="w-full text-sm"
            />
          </div>
          <div className="max-h-[340px] overflow-y-auto">
            {filtered.length === 0 ? (
              <div className="px-2 py-3 text-sm text-muted-foreground text-center">
                No matching options.
              </div>
            ) : (
              filtered.map((opt) => (
                <div
                  key={opt.id}
                  onClick={(e) => {
                    e.stopPropagation();
                    toggle(opt.id);
                  }}
                  className={`px-2 py-2.5 text-sm cursor-pointer rounded-md select-none ${
                    selectedSet.has(opt.id)
                      ? "bg-primary text-primary-foreground"
                      : "hover:bg-accent hover:text-accent-foreground"
                  }`}
                >
                  {opt.label}
                  {selectedSet.has(opt.id) && (
                    <span className="ml-auto text-xs font-medium">✓</span>
                  )}
                </div>
              ))
            )}
          </div>
        </div>
      )}
    </div>
  );
}
