"use client";

import { useEffect, useRef } from "react";
import { createPortal } from "react-dom";
import { X } from "lucide-react";
import { cn } from "@/components/ui/cn";

/**
 * Club finder filters: bottom sheet on phones, side drawer from the right on tablet/desktop.
 * Filters apply live; the primary button only closes the sheet and shows the result count.
 * Rendered into <body> so no transformed/isolated ancestor can trap the fixed overlay.
 */
export function FilterSheet({
  open,
  onClose,
  title,
  closeLabel,
  resetLabel,
  showLabel,
  onReset,
  children,
}: {
  open: boolean;
  onClose: () => void;
  title: string;
  closeLabel: string;
  resetLabel: string;
  showLabel: string;
  onReset: () => void;
  children: React.ReactNode;
}) {
  const closeRef = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    if (!open) return;
    const trigger = document.activeElement as HTMLElement | null;
    const overflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    closeRef.current?.focus();
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    document.addEventListener("keydown", onKey);
    return () => {
      document.body.style.overflow = overflow;
      document.removeEventListener("keydown", onKey);
      trigger?.focus();
    };
  }, [open, onClose]);

  if (!open || typeof document === "undefined") return null;

  return createPortal(
    <div className="fixed inset-0 z-[70] flex items-end md:items-stretch md:justify-end">
      <button type="button" aria-label={closeLabel} tabIndex={-1} onClick={onClose} className="absolute inset-0 bg-black/60 backdrop-blur-sm animate-[fade-in_180ms_ease-out]" />
      <div
        role="dialog"
        aria-modal="true"
        aria-labelledby="filter-sheet-title"
        className="relative flex max-h-[85vh] w-full flex-col rounded-t-[28px] border-t border-white/15 bg-ink-700 pb-[env(safe-area-inset-bottom)] shadow-elevated animate-[sheet-up_240ms_cubic-bezier(0.2,0.8,0.2,1)] md:max-h-none md:w-[440px] md:rounded-none md:rounded-l-[28px] md:border-l md:border-t-0 md:animate-[drawer-in_240ms_cubic-bezier(0.2,0.8,0.2,1)]"
      >
        <div className="mx-auto mt-3 h-1.5 w-10 rounded-full bg-white/25 md:hidden" aria-hidden />
        <div className="flex items-center justify-between px-5 pt-3 md:px-7 md:pt-7">
          <h2 id="filter-sheet-title" className="font-display text-3xl font-extrabold italic uppercase leading-none">
            {title}
          </h2>
          <button ref={closeRef} type="button" onClick={onClose} aria-label={closeLabel} className="grid size-11 place-items-center rounded-full bg-white/10 text-white hover:bg-white/15">
            <X className="size-5" aria-hidden />
          </button>
        </div>
        <div className="flex-1 space-y-7 overflow-y-auto overscroll-contain px-5 pb-6 pt-5 md:px-7">{children}</div>
        <div className="flex gap-3 border-t border-white/10 px-5 py-4 md:px-7 md:py-5">
          <button type="button" onClick={onReset} className="min-h-12 flex-1 rounded-full border border-white/40 px-4 text-sm font-medium text-white hover:border-white">
            {resetLabel}
          </button>
          <button type="button" onClick={onClose} className="min-h-12 flex-[1.4] rounded-full bg-brand-gradient px-4 font-display text-lg italic uppercase tracking-wide text-white">
            {showLabel}
          </button>
        </div>
      </div>
    </div>,
    document.body,
  );
}

export function SheetGroup({ label, children, className }: { label: string; children: React.ReactNode; className?: string }) {
  return (
    <fieldset className={className}>
      <legend className="mb-3 text-[13px] font-semibold uppercase tracking-[0.14em] text-white/70">{label}</legend>
      <div className="flex flex-wrap gap-2">{children}</div>
    </fieldset>
  );
}

export const sheetChip = (active: boolean) =>
  cn(
    "inline-flex min-h-11 items-center gap-2 rounded-full border px-4 text-sm font-medium transition-colors",
    active ? "border-transparent bg-brand-gradient text-white" : "border-white/40 bg-white/5 text-white/85",
  );
