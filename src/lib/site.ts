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
  // Profiles as linked on padelcity.de (checked 15.10.2026). LinkedIn is not linked there – URL unverified.
  social: {
    linkedin: "https://www.linkedin.com/company/padelcity/",
    facebook: "https://www.facebook.com/p/PadelCity-100084223325300/",
    instagram: "https://www.instagram.com/padelcity.de/",
    youtube: "https://www.youtube.com/@PadelCityTV",
    tiktok: "https://www.tiktok.com/@padelcity.de",
  },
} as const;

export const stores = {
  ios: "https://apps.apple.com/de/app/padelcity-padel-jetzt-buchen/id6451471569",
  android: "https://play.google.com/store/apps/details?id=de.padelcity.app&hl=de",
} as const;

export type NavItem = { key: RouteKey };

/** Main navigation (labels in src/lib/i18n/dictionaries.ts → nav.<key>). */
export const mainNav: RouteKey[] = ["locations", "app", "events", "academy", "magazine", "franchise"];
export const secondaryNav: RouteKey[] = ["about", "jobs", "partners", "investors", "faq"];
export const legalNav: RouteKey[] = ["imprint", "privacy", "terms"];

const ADJUST_BASE = process.env.NEXT_PUBLIC_ADJUST_BASE ?? "https://padelcity.go.link";

/**
 * App deep links and web-app event links don't work in the prototype yet (go.link is being replaced by
 * link.padelcity.de, events are mock data). Until NEXT_PUBLIC_APP_LINKS_LIVE=true every such link leads to the
 * "Coming soon" page (with a little padel pong) instead of a dead end. Internal path – Next/asset() add the basePath.
 */
export const COMING_SOON = "/coming-soon";
const APP_LINKS_LIVE = process.env.NEXT_PUBLIC_APP_LINKS_LIVE === "true";

/** Universal link that opens the app (or falls back to the store) via Adjust. */
function adjustLink(path: string, params: Record<string, string | undefined> = {}) {
  if (!APP_LINKS_LIVE) return COMING_SOON;
  const url = new URL(path, ADJUST_BASE);
  for (const [k, v] of Object.entries(params)) if (v) url.searchParams.set(k, v);
  url.searchParams.set("deeplink_js", "1");
  return url.toString();
}

const WEBAPP_BASE = process.env.NEXT_PUBLIC_WEBAPP_BASE ?? "https://app.padelcity.de";

/**
 * PadelCity web app (web-app-flutter). Event sign-up works in the app OR on the web;
 * court booking stays app-only (deeplinks.club).
 * Route mirrors web-app-flutter `/events/:eventId` (pre-prod: https://app.pre-prod.padelcity.de).
 */
export const webApp = {
  base: WEBAPP_BASE,
  event: (eventId: string) => (APP_LINKS_LIVE ? `${WEBAPP_BASE}/events/${eventId}` : COMING_SOON),
};

export const deeplinks = {
  club: (clubId: string) => adjustLink(`/playtab/play/club/${clubId}`),
  event: (eventId: string) => adjustLink(`/playtab/play/event/${eventId}`),
  openMatches: () => adjustLink("/playtab/play/open-matches"),
  events: () => adjustLink("/playtab/play/events"),
  vouchers: () => adjustLink("/gift-vouchers/purchase"),
};
