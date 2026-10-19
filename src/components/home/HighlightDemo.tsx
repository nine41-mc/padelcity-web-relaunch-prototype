"use client";

import { useCallback, useEffect, useState } from "react";
import type { Locale } from "@/lib/i18n/config";

/*
 * Highlight comparison for the brand discussion (home page only): a click on any highlight element
 * (brush word, ticker, map pin label, footer ball …) cycles the highlight colour – Optic Yellow, Purple,
 * Magenta, Turquoise (app badge colour "color-badge-abo-background" #15C0D3). Works via CSS variables
 * (html[data-highlight], see globals.css), so every highlight element changes at once.
 * The floating button shows the current colour and is the keyboard-accessible way to switch.
 */
const COLORS = [
  { id: "optic", name: "Optic Yellow", hex: "#DFFF4F" },
  { id: "purple", name: "Purple", hex: "#8412B5" },
  { id: "magenta", name: "Magenta", hex: "#E005C3" },
  { id: "turquoise", name: "Türkis", hex: "#15C0D3" },
] as const;

const COPY: Record<Locale, { label: string; hint: string }> = {
  de: { label: "Highlight-Farbe", hint: "Klick auf ein Highlight oder hier zum Wechseln" },
  en: { label: "Highlight colour", hint: "Click a highlight or here to switch" },
  pl: { label: "Kolor akcentu", hint: "Kliknij akcent lub tutaj, aby zmienić" },
};

export function HighlightDemo({ locale }: { locale: Locale }) {
  const [i, setI] = useState(0);
  const next = useCallback(() => setI((n) => (n + 1) % COLORS.length), []);
  const t = COPY[locale];

  useEffect(() => {
    const el = document.documentElement;
    el.setAttribute("data-highlight-demo", "");
    return () => {
      el.removeAttribute("data-highlight-demo");
      el.removeAttribute("data-highlight");
    };
  }, []);

  useEffect(() => {
    const c = COLORS[i];
    if (c.id === "optic") document.documentElement.removeAttribute("data-highlight");
    else document.documentElement.setAttribute("data-highlight", c.id);
  }, [i]);

  useEffect(() => {
    const onClick = (e: MouseEvent) => {
      const target = e.target as Element | null;
      // links, buttons and form fields keep their own action
      if (!target || target.closest("a, button, input, select, textarea, label, [role=button]")) return;
      if (target.closest(".text-optic-500, .bg-optic-500, [data-highlight-target]")) next();
    };
    document.addEventListener("click", onClick);
    return () => document.removeEventListener("click", onClick);
  }, [next]);

  const c = COLORS[i];
  return (
    <button
      type="button"
      onClick={next}
      className="fixed bottom-4 left-4 z-50 flex max-w-[calc(100vw-6rem)] items-center gap-3 rounded-full border border-white/25 bg-ink-700/90 py-2 pl-2 pr-4 text-left text-white shadow-elevated backdrop-blur transition-colors hover:border-white"
    >
      <span className="size-8 shrink-0 rounded-full ring-2 ring-white/30" style={{ background: c.hex }} aria-hidden />
      <span className="min-w-0 leading-tight">
        <span className="block text-[11px] font-semibold uppercase tracking-[0.14em] text-white/60">{t.label}</span>
        <span className="block text-sm font-semibold">
          {c.name} <span className="font-normal text-white/60">· {c.hex}</span>
        </span>
        <span className="hidden text-xs text-white/60 sm:block">{t.hint}</span>
      </span>
    </button>
  );
}
