import { asset } from "../asset";
import type { Locale } from "./config";

/**
 * Localized pathnames. DE lives at the root (/standorte), EN under /en (/en/locations).
 * Detail pages share their slug across locales (/standorte/berlin ↔ /en/locations/berlin).
 * Works with static export: every localized path is a real route folder (no middleware).
 */
export const routes = {
  home: { de: "/", en: "/en" },
  locations: { de: "/standorte", en: "/en/locations" },
  app: { de: "/app", en: "/en/app" },
  events: { de: "/events", en: "/en/events" },
  academy: { de: "/academy", en: "/en/academy" },
  magazine: { de: "/magazin", en: "/en/magazine" },
  franchise: { de: "/franchise", en: "/en/franchise" },
  investors: { de: "/investoren", en: "/en/investors" },
  partners: { de: "/partner", en: "/en/partners" },
  about: { de: "/ueber-uns", en: "/en/about" },
  jobs: { de: "/jobs", en: "/en/jobs" },
  imprint: { de: "/impressum", en: "/en/imprint" },
  privacy: { de: "/datenschutz", en: "/en/privacy" },
  terms: { de: "/agb", en: "/en/terms" },
} as const satisfies Record<string, Record<Locale, string>>;

export type RouteKey = keyof typeof routes;

/** Internal href for <Link> (Next adds basePath itself). */
export function href(locale: Locale, key: RouteKey, slug?: string): string {
  const base = routes[key][locale];
  return slug ? `${base}/${slug}` : base;
}

/** Absolute-path URL incl. basePath, for <a>, metadata and hreflang. */
export function absoluteHref(locale: Locale, key: RouteKey, slug?: string): string {
  return asset(href(locale, key, slug));
}

/** hreflang alternates for generateMetadata. */
export function alternates(key: RouteKey, slug?: string, current: Locale = "de") {
  return {
    canonical: href(current, key, slug),
    languages: { de: href("de", key, slug), en: href("en", key, slug), "x-default": href("de", key, slug) },
  };
}

/** Maps the current pathname to the same page in the other locale (language switcher). */
export function switchLocalePath(pathname: string, target: Locale): string {
  const clean = pathname.replace(/\/+$/, "") || "/";
  for (const key of Object.keys(routes) as RouteKey[]) {
    for (const from of ["de", "en"] as Locale[]) {
      const base = routes[key][from];
      if (key === "home") {
        if (clean === base) return routes.home[target];
        continue;
      }
      if (clean === base || clean.startsWith(base + "/")) {
        return routes[key][target] + clean.slice(base.length);
      }
    }
  }
  return routes.home[target];
}

export function localeFromPath(pathname: string): Locale {
  return pathname === "/en" || pathname.startsWith("/en/") ? "en" : "de";
}
