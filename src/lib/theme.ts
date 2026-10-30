/*
 * Light / dark theme: html[data-theme] drives the semantic colour roles in globals.css. A stored choice wins;
 * without one the page follows the system setting (prefers-color-scheme) and keeps following it.
 * Server-safe (no "use client"): SiteShell inlines the pre-paint script, ThemeToggle uses the helpers.
 */
export type Theme = "light" | "dark";
export const THEME_STORAGE_KEY = "pc-theme";

/** Sets data-theme on <html> before paint, so a light page never flashes dark. */
export const themePrePaintScript = `(function(){try{var s=localStorage.getItem(${JSON.stringify(THEME_STORAGE_KEY)}),t=s==="light"||s==="dark"?s:(matchMedia("(prefers-color-scheme: light)").matches?"light":"dark");document.documentElement.setAttribute("data-theme",t);}catch(_){document.documentElement.setAttribute("data-theme","dark");}})();`;

export function storedTheme(): Theme | null {
  try {
    const s = localStorage.getItem(THEME_STORAGE_KEY);
    return s === "light" || s === "dark" ? s : null;
  } catch {
    return null;
  }
}

export function systemTheme(): Theme {
  return typeof matchMedia === "function" && matchMedia("(prefers-color-scheme: light)").matches ? "light" : "dark";
}

export function applyTheme(theme: Theme, store: boolean) {
  document.documentElement.setAttribute("data-theme", theme);
  if (!store) return;
  try {
    localStorage.setItem(THEME_STORAGE_KEY, theme);
  } catch {
    // private mode: the choice lasts for this page only
  }
}
