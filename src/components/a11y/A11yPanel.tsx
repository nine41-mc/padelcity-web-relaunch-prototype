"use client";

import { useState } from "react";
import { usePathname } from "next/navigation";
import { Accessibility } from "lucide-react";
import { localeFromPath } from "@/lib/i18n/routes";
import { A11Y_DEFAULTS, setA11yPrefs, useA11yPrefs, type A11yPrefs } from "@/lib/a11y";
import { FilterSheet, SheetGroup, sheetChip } from "@/components/locations/FilterSheet";
import { cn } from "@/components/ui/cn";

/*
 * Accessibility panel ("Darstellung") – a display-preferences panel of our own, no third-party overlay:
 * it only changes CSS (data-a11y-* on <html>, see globals.css) and stores the choice in this browser.
 * It complements an accessible page, it does not replace one (WCAG conformance lives in the code).
 */

const COPY = {
  de: {
    open: "Barrierefreiheit: Darstellung anpassen",
    title: "Darstellung",
    intro: "Passe Schrift, Abstände, Bewegung und Kontrast an. Die Einstellung gilt für diesen Browser.",
    close: "Schließen",
    reset: "Zurücksetzen",
    done: "Fertig",
    size: "Schriftgröße",
    spacing: "Abstände",
    spacingOptions: ["Normal", "Erhöht", "Weit"],
    font: "Schrift",
    fontOptions: ["Standard", "Gut lesbar"],
    motion: "Bewegung",
    motionOptions: ["An", "Aus"],
    contrast: "Kontrast",
    contrastOptions: ["Standard", "Hoch"],
  },
  en: {
    open: "Accessibility: adjust display",
    title: "Display",
    intro: "Adjust text, spacing, motion and contrast. Your choice applies to this browser.",
    close: "Close",
    reset: "Reset",
    done: "Done",
    size: "Text size",
    spacing: "Spacing",
    spacingOptions: ["Normal", "Increased", "Wide"],
    font: "Font",
    fontOptions: ["Default", "Easy to read"],
    motion: "Motion",
    motionOptions: ["On", "Off"],
    contrast: "Contrast",
    contrastOptions: ["Default", "High"],
  },
  pl: {
    open: "Dostępność: dostosuj wygląd",
    title: "Wygląd",
    intro: "Dostosuj tekst, odstępy, animacje i kontrast. Ustawienia obowiązują w tej przeglądarce.",
    close: "Zamknij",
    reset: "Resetuj",
    done: "Gotowe",
    size: "Rozmiar tekstu",
    spacing: "Odstępy",
    spacingOptions: ["Normalne", "Większe", "Szerokie"],
    font: "Czcionka",
    fontOptions: ["Standardowa", "Łatwa do czytania"],
    motion: "Animacje",
    motionOptions: ["Włączone", "Wyłączone"],
    contrast: "Kontrast",
    contrastOptions: ["Standardowy", "Wysoki"],
  },
};

const SIZES = ["100 %", "112 %", "125 %", "150 %"];

export function A11yPanel() {
  const [open, setOpen] = useState(false);
  const prefs = useA11yPrefs();
  const t = COPY[localeFromPath(usePathname() ?? "/")];
  const set = (patch: Partial<A11yPrefs>) => setA11yPrefs({ ...prefs, ...patch });

  const group = <K extends keyof A11yPrefs>(label: string, key: K, values: A11yPrefs[K][], names: string[]) => (
    <SheetGroup label={label}>
      {values.map((v, i) => (
        <button key={String(v)} type="button" aria-pressed={prefs[key] === v} onClick={() => set({ [key]: v } as Partial<A11yPrefs>)} className={sheetChip(prefs[key] === v)}>
          {names[i]}
        </button>
      ))}
    </SheetGroup>
  );

  return (
    <>
      {/* Floating trigger, bottom left; lifts above the club booking bar on phones */}
      <button
        type="button"
        onClick={() => setOpen(true)}
        aria-label={t.open}
        aria-haspopup="dialog"
        data-a11y-fab
        className={cn(
          "fixed bottom-4 left-4 z-50 grid size-12 place-items-center rounded-full border border-white/25 bg-ink-700/90 text-white shadow-elevated backdrop-blur transition-colors hover:border-white hover:bg-ink-600",
          "[body:has([data-booking-bar=visible])_&]:max-lg:bottom-24",
        )}
      >
        <Accessibility className="size-6" aria-hidden />
      </button>
      <FilterSheet open={open} onClose={() => setOpen(false)} title={t.title} closeLabel={t.close} resetLabel={t.reset} showLabel={t.done} onReset={() => setA11yPrefs(A11Y_DEFAULTS)}>
        <p className="text-white/75">{t.intro}</p>
        {group(t.size, "size", [0, 1, 2, 3], SIZES)}
        {group(t.spacing, "spacing", [0, 1, 2], t.spacingOptions)}
        {group(t.font, "font", ["default", "readable"], t.fontOptions)}
        {group(t.motion, "motion", ["on", "off"], t.motionOptions)}
        {group(t.contrast, "contrast", ["default", "high"], t.contrastOptions)}
      </FilterSheet>
    </>
  );
}
