import type { MetadataRoute } from "next";
import { getClubs, getEvents } from "@/lib/data";
import { articleSlugs } from "@/lib/content/magazin";
import { locales } from "@/lib/i18n/config";
import { href, routes, type RouteKey } from "@/lib/i18n/routes";
import { site } from "@/lib/site";

export const dynamic = "force-static";

// Not for search engines: the hidden styleguide (noindex) and the internal content model for the relaunch team
const EXCLUDED: RouteKey[] = ["styleguide", "contentModel"];

/**
 * sitemap.xml for the production domain (site.url) – every page in DE, EN and PL with its hreflang alternates, the
 * same set as the HTML sitemaps. The prototype itself is noindex (robots.txt below disallows everything).
 */
export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const url = (path: string) => `${site.url}${path === "/" ? "" : path}/`;
  const entry = (key: RouteKey, slug?: string): MetadataRoute.Sitemap =>
    locales.map((locale) => ({
      url: url(href(locale, key, slug)),
      alternates: { languages: Object.fromEntries(locales.map((l) => [l, url(href(l, key, slug))])) },
    }));
  const pages = (Object.keys(routes) as RouteKey[]).filter((k) => !EXCLUDED.includes(k)).flatMap((k) => entry(k));
  const clubs = (await getClubs("de")).flatMap((c) => entry("locations", c.slug));
  const events = (await getEvents()).flatMap((e) => entry("events", e.slug));
  const articles = articleSlugs.flatMap((slug) => entry("magazine", slug));
  return [...pages, ...clubs, ...events, ...articles];
}
