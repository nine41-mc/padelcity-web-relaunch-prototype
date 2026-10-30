"use client";

import { useEffect, useState } from "react";
import type { Locale } from "@/lib/i18n/config";

/*
 * Claim comparison for the brand discussion (home page only, next to the highlight switch): the team proposed
 * "We serve. You play." instead of "Make some noise for Padel" (team feedback m-6-2, to be agreed with Valle).
 * Both claims are rendered where the claim appears (footer, home ticker) as [data-claim-variant] elements;
 * html[data-claim] decides which one shows (globals.css).
 */
const CLAIMS = [
  { id: "noise", name: "Make some noise" },
  { id: "serve", name: "We serve. You play." },
] as const;

const COPY: Record<Locale, { label: string; hint: string }> = {
  de: { label: "Claim", hint: "Claim zum Vergleich wechseln" },
  en: { label: "Claim", hint: "Switch the claim to compare" },
  pl: { label: "Claim", hint: "Zmień claim, aby porównać" },
};

export function ClaimDemo({ locale }: { locale: Locale }) {
  const [i, setI] = useState(0);
  const t = COPY[locale];

  useEffect(() => {
    const el = document.documentElement;
    if (CLAIMS[i].id === "noise") el.removeAttribute("data-claim");
    else el.setAttribute("data-claim", CLAIMS[i].id);
  }, [i]);
  useEffect(() => () => document.documentElement.removeAttribute("data-claim"), []);

  return (
    <button
      type="button"
      onClick={() => setI((n) => (n + 1) % CLAIMS.length)}
      title={t.hint}
      className="flex min-w-0 items-center gap-2 rounded-full border border-fg/20 bg-raised/85 px-3 py-1.5 text-left text-fg shadow-elevated backdrop-blur transition-colors hover:border-fg"
    >
      <span className="min-w-0 leading-tight">
        <span className="block text-[10px] font-semibold uppercase tracking-[0.14em] text-fg/60">{t.label}</span>
        <span lang="en" className="block truncate text-xs font-semibold">{CLAIMS[i].name}</span>
      </span>
    </button>
  );
}
