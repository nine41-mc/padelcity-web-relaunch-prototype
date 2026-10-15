import { asset } from "../asset";
import type { Locale } from "./config";

/**
 * Localized pathnames. DE lives at the root (/standorte), EN under /en (/en/locations), PL under /pl (/pl/lokalizacje).
 * Detail pages share their slug across locales (/standorte/berlin ↔ /en/locations/berlin).
 * Works with static export: every localized path is a real route folder (no middleware).
 */
export const routes = {
  home: { de: "/", en: "/en", pl: "/pl" },
  locations: { de: "/standorte", en: "/en/locations", pl: "/pl/lokalizacje" },
  app: { de: "/app", en: "/en/app", pl: "/pl/aplikacja" },
  events: { de: "/events", en: "/en/events", pl: "/pl/wydarzenia" },
  academy: { de: "/academy", en: "/en/academy", pl: "/pl/akademia" },
  magazine: { de: "/magazin", en: "/en/magazine", pl: "/pl/magazyn" },
  franchise: { de: "/franchise", en: "/en/franchise", pl: "/pl/franczyza" },
  investors: { de: "/investoren", en: "/en/investors", pl: "/pl/inwestorzy" },
  partners: { de: "/partner", en: "/en/partners", pl: "/pl/partnerzy" },
  about: { de: "/ueber-uns", en: "/en/about", pl: "/pl/o-nas" },
  jobs: { de: "/jobs", en: "/en/jobs", pl: "/pl/kariera" },
  faq: { de: "/faq", en: "/en/faq", pl: "/pl/faq" },
  imprint: { de: "/impressum", en: "/en/imprint", pl: "/pl/nota-prawna" },
  privacy: { de: "/datenschutz", en: "/en/privacy", pl: "/pl/polityka-prywatnosci" },
  terms: { de: "/agb", en: "/en/terms", pl: "/pl/regulamin" },
  sitemap: { de: "/sitemap", en: "/en/sitemap", pl: "/pl/mapa-strony" },
  // Hidden: not in any navigation or the sitemap, reached by clicking the © line in the footer.
  styleguide: { de: "/styleguide", en: "/en/styleguide", pl: "/pl/styleguide" },
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
    languages: { de: href("de", key, slug), en: href("en", key, slug), pl: href("pl", key, slug), "x-default": href("de", key, slug) },
  };
}

/** Maps the current pathname to the same page in the other locale (language switcher). */
export function switchLocalePath(pathname: string, target: Locale): string {
  const clean = pathname.replace(/\/+$/, "") || "/";
  for (const key of Object.keys(routes) as RouteKey[]) {
    for (const from of ["en", "pl", "de"] as Locale[]) {
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
  if (pathname === "/en" || pathname.startsWith("/en/")) return "en";
  if (pathname === "/pl" || pathname.startsWith("/pl/")) return "pl";
  return "de";
}
