"use client";

import { useEffect, useState, useSyncExternalStore } from "react";
import { useReducedMotion } from "motion/react";

/**
 * Display preferences of the accessibility panel ("Darstellung").
 * Stored per browser (localStorage) and applied as data attributes on <html>, so CSS does the work:
 *   data-a11y-size="1|2|3"     text size 112.5 / 125 / 150 %
 *   data-a11y-spacing="1|2"    line + letter/word spacing (WCAG 1.4.12 values at level 2)
 *   data-a11y-font="readable"  upright Poppins instead of the italic display + brush fonts
 *   data-a11y-motion="off"     stops video, tickers and animations
 *   data-a11y-contrast="high"  full-white text, stronger borders, underlined links
 * The same keys are applied before paint by the inline script in SiteShell (no flash).
 * No third-party script, no tracking.
 */
export type A11yPrefs = {
  size: 0 | 1 | 2 | 3;
  spacing: 0 | 1 | 2;
  font: "default" | "readable";
  motion: "on" | "off";
  contrast: "default" | "high";
};

export const A11Y_DEFAULTS: A11yPrefs = { size: 0, spacing: 0, font: "default", motion: "on", contrast: "default" };
export { A11Y_STORAGE_KEY } from "./a11y-prepaint";
import { A11Y_STORAGE_KEY } from "./a11y-prepaint";
const EVENT = "pc-a11y-change";

function read(): A11yPrefs {
  try {
    const raw = localStorage.getItem(A11Y_STORAGE_KEY);
    return raw ? { ...A11Y_DEFAULTS, ...JSON.parse(raw) } : A11Y_DEFAULTS;
  } catch {
    return A11Y_DEFAULTS;
  }
}

/** Writes the data attributes on <html> (also used by the pre-paint script, keep in sync). */
export function applyA11yPrefs(p: A11yPrefs) {
  const el = document.documentElement;
  const set = (k: string, v: string | null) => (v ? el.setAttribute(`data-a11y-${k}`, v) : el.removeAttribute(`data-a11y-${k}`));
  set("size", p.size ? String(p.size) : null);
  set("spacing", p.spacing ? String(p.spacing) : null);
  set("font", p.font === "readable" ? "readable" : null);
  set("motion", p.motion === "off" ? "off" : null);
  set("contrast", p.contrast === "high" ? "high" : null);
}

let cache: A11yPrefs | null = null;

export function setA11yPrefs(next: A11yPrefs) {
  cache = next;
  try {
    localStorage.setItem(A11Y_STORAGE_KEY, JSON.stringify(next));
  } catch {
    /* private mode – applies for this page view only */
  }
  applyA11yPrefs(next);
  window.dispatchEvent(new Event(EVENT));
}

function subscribe(cb: () => void) {
  const onStorage = (e: StorageEvent) => {
    if (e.key === A11Y_STORAGE_KEY) {
      cache = read();
      applyA11yPrefs(cache);
      cb();
    }
  };
  window.addEventListener(EVENT, cb);
  window.addEventListener("storage", onStorage);
  return () => {
    window.removeEventListener(EVENT, cb);
    window.removeEventListener("storage", onStorage);
  };
}

export function useA11yPrefs(): A11yPrefs {
  return useSyncExternalStore(
    subscribe,
    () => (cache ??= read()),
    () => A11Y_DEFAULTS,
  );
}

/** true when the visitor switched motion off in the panel (system "reduce motion" is handled separately). */
export function useMotionOff(): boolean {
  return useA11yPrefs().motion === "off";
}

/**
 * System setting "reduce motion" – false until hydrated. motion's useReducedMotion() is null on the server but already
 * true in the first client render, so components that branch on it render different HTML and hydration fails.
 */
export function useSystemReducedMotion(): boolean {
  const reduce = useReducedMotion();
  const [mounted, setMounted] = useState(false);
  useEffect(() => setMounted(true), []);
  return mounted && !!reduce;
}
