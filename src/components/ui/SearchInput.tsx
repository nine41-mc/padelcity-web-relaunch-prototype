"use client";

import { Search, X } from "lucide-react";
import { cn } from "./cn";

/**
 * Search field (Figma: Input / Search) – FAQ, WhatsApp groups. 52 px pill on ink-700, border white/20
 * (hover white/50, focus white + ring). With a value the clear button appears.
 * Label: pass `id` and render a visible <label htmlFor>, or give `ariaLabel` when the context names the field.
 */
export function SearchInput({
  value,
  onChange,
  placeholder,
  clearLabel,
  id,
  ariaLabel,
  className,
}: {
  value: string;
  onChange: (value: string) => void;
  placeholder: string;
  clearLabel: string;
  id?: string;
  ariaLabel?: string;
  className?: string;
}) {
  return (
    <div className={cn("relative", className)}>
      <Search className="pointer-events-none absolute left-4 top-1/2 size-5 -translate-y-1/2 text-fg/60" aria-hidden />
      <input
        id={id}
        type="search"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        aria-label={ariaLabel}
        autoComplete="off"
        className="h-13 w-full rounded-full border border-fg/20 bg-raised pl-12 pr-14 text-base text-fg placeholder:text-fg/60 transition hover:border-fg/50 focus-visible:border-fg focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-fg [&::-webkit-search-cancel-button]:hidden"
      />
      {value && (
        <button
          type="button"
          onClick={() => onChange("")}
          aria-label={clearLabel}
          className="absolute right-1.5 top-1/2 grid size-11 -translate-y-1/2 place-items-center rounded-full text-fg/70 transition hover:bg-fg/10 hover:text-fg"
        >
          <X className="size-5" aria-hidden />
        </button>
      )}
    </div>
  );
}
