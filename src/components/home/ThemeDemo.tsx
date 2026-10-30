"use client";

import { useEffect, useState } from "react";
import { Moon, Sun } from "lucide-react";
import type { Locale } from "@/lib/i18n/config";

/*
 * Dark/light comparison for the brand discussion (home page only), next to the HighlightDemo switch.
 * Sets html[data-theme="light"]; globals.css swaps the surface tokens and keeps photos, gradients, header and
 * footer dark. Dark stays the default and nothing is stored – a reload shows the brand look again.
 */
const COPY: Record<Locale, { label: string; dark: string; light: string }> = {
  de: { label: "Modus", dark: "Dunkel", light: "Hell" },
  en: { label: "Mode", dark: "Dark", light: "Light" },
  pl: { label: "Tryb", dark: "Ciemny", light: "Jasny" },
};

export function ThemeDemo({ locale }: { locale: Locale }) {
  const [light, setLight] = useState(false);
  const t = COPY[locale];

  useEffect(() => {
    const el = document.documentElement;
    if (light) el.setAttribute("data-theme", "light");
    else el.removeAttribute("data-theme");
  }, [light]);
  useEffect(() => () => document.documentElement.removeAttribute("data-theme"), []);

  const Icon = light ? Sun : Moon;
  return (
    <button
      type="button"
      onClick={() => setLight((v) => !v)}
      aria-pressed={light}
      className="flex shrink-0 items-center gap-2 rounded-full border border-white/20 bg-ink-700/85 py-1.5 pl-1.5 pr-3 text-left text-white shadow-elevated backdrop-blur transition-colors hover:border-white"
    >
      <span className="grid size-6 shrink-0 place-items-center rounded-full bg-white/10 ring-2 ring-white/30" aria-hidden>
        <Icon className="size-3.5" />
      </span>
      <span className="leading-tight">
        <span className="block text-[10px] font-semibold uppercase tracking-[0.14em] text-white/60">{t.label}</span>
        <span className="block text-xs font-semibold">{light ? t.light : t.dark}</span>
      </span>
    </button>
  );
}
