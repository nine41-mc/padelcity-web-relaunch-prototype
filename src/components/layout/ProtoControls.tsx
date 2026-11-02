"use client";

import { useEffect, useState } from "react";
import { createPortal } from "react-dom";
import { Moon, Sun } from "lucide-react";
import type { Locale } from "@/lib/i18n/config";
import { THEME_EVENT, applyTheme, storedTheme, systemTheme, type Theme } from "@/lib/theme";

/*
 * Prototype controls, bottom left on every page (not part of the design: hidden in Figma captures via
 * data-capture-hide). Always: the light/dark switch. Pages add their own comparison switches with <ProtoControl>
 * (home: highlight colour). On club pages the bar moves above the sticky booking bar (globals.css).
 */
const ID = "proto-controls";

const COPY: Record<Locale, { label: string; light: string; dark: string; hint: string }> = {
  de: { label: "Modus", light: "Hell", dark: "Dunkel", hint: "Zwischen hellem und dunklem Modus wechseln" },
  en: { label: "Mode", light: "Light", dark: "Dark", hint: "Switch between light and dark mode" },
  pl: { label: "Tryb", light: "Jasny", dark: "Ciemny", hint: "Przełącz tryb jasny i ciemny" },
};

export function ProtoControls({ locale }: { locale: Locale }) {
  return (
    <div id={ID} data-capture-hide className="fixed bottom-4 left-4 z-50 flex max-w-[calc(100vw-6rem)] items-center gap-2">
      <ThemePill locale={locale} />
    </div>
  );
}

/** Puts a page's comparison switch into the bar, before the light/dark switch. */
export function ProtoControl({ children }: { children: React.ReactNode }) {
  const [host, setHost] = useState<HTMLElement | null>(null);
  useEffect(() => setHost(document.getElementById(ID)), []);
  return host ? createPortal(<div className="order-first min-w-0">{children}</div>, host) : null;
}

function ThemePill({ locale }: { locale: Locale }) {
  const t = COPY[locale];
  const [theme, setTheme] = useState<Theme | null>(null);
  useEffect(() => {
    setTheme(storedTheme() ?? systemTheme());
    const onChange = (e: Event) => setTheme((e as CustomEvent<Theme>).detail);
    window.addEventListener(THEME_EVENT, onChange);
    return () => window.removeEventListener(THEME_EVENT, onChange);
  }, []);
  const current = theme ?? "dark";
  const Icon = current === "light" ? Sun : Moon;
  return (
    <button
      type="button"
      onClick={() => applyTheme(current === "light" ? "dark" : "light", true)}
      title={t.hint}
      className="flex min-w-0 items-center gap-2 rounded-full border border-fg/20 bg-raised/85 py-1.5 pl-1.5 pr-3 text-left text-fg shadow-elevated backdrop-blur transition-colors hover:border-fg"
      data-track="theme_toggle"
    >
      <span className="grid size-6 shrink-0 place-items-center rounded-full bg-fg text-fg-inverse" aria-hidden>
        <Icon className="size-3.5" />
      </span>
      {/* the visible text is the button's name ("Modus Hell"), the hint is the tooltip (WCAG 2.5.3) */}
      <span className="min-w-0 leading-tight">
        <span className="block text-[10px] font-semibold uppercase tracking-[0.14em] text-fg/60">{t.label}</span>
        <span className="block truncate text-xs font-semibold">{current === "light" ? t.light : t.dark}</span>
      </span>
    </button>
  );
}
