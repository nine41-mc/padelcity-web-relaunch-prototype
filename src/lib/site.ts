import type { RouteKey } from "./i18n/routes";
/**
 * Site-wide configuration: navigation, store links, app deep links.
 * Deep-link formats mirror mobile-app-flutter:
 *  - lib/feature/phone_services/share/data/share_service.dart (Adjust share URLs)
 *  - lib/core/navigation/app_router.dart (in-app routes)
 */

export const site = {
  name: "PadelCity",
  claim: "Let's play Padel!",
  url: "https://www.padelcity.de",
  email: "info@padelcity.de",
  whatsappCommunity: "https://chat.whatsapp.com/", // TODO: real invite link from Marketing
  social: {
    instagram: "https://www.instagram.com/padelcity.de/",
    tiktok: "https://www.tiktok.com/@padelcity",
    youtube: "https://www.youtube.com/@padelcity",
    linkedin: "https://www.linkedin.com/company/padelcity/",
  },
} as const;

export const stores = {
  ios: "https://apps.apple.com/de/app/padelcity-lets-play-padel/id6451471569",
  android: "https://play.google.com/store/apps/details?id=de.padelcity.app",
} as const;

export type NavItem = { key: RouteKey };

/** Main navigation (labels in src/lib/i18n/dictionaries.ts → nav.<key>). */
export const mainNav: RouteKey[] = ["locations", "app", "events", "academy", "magazine", "franchise"];
export const secondaryNav: RouteKey[] = ["about", "jobs", "partners", "investors"];
export const legalNav: RouteKey[] = ["imprint", "privacy", "terms"];

const ADJUST_BASE = process.env.NEXT_PUBLIC_ADJUST_BASE ?? "https://padelcity.go.link";

/** Universal link that opens the app (or falls back to the store) via Adjust. */
function adjustLink(path: string, params: Record<string, string | undefined> = {}) {
  const url = new URL(path, ADJUST_BASE);
  for (const [k, v] of Object.entries(params)) if (v) url.searchParams.set(k, v);
  url.searchParams.set("deeplink_js", "1");
  return url.toString();
}

export const deeplinks = {
  club: (clubId: string) => adjustLink(`/playtab/play/club/${clubId}`),
  event: (eventId: string) => adjustLink(`/playtab/play/event/${eventId}`),
  openMatches: () => adjustLink("/playtab/play/open-matches"),
  events: () => adjustLink("/playtab/play/events"),
  vouchers: () => adjustLink("/gift-vouchers/purchase"),
};
