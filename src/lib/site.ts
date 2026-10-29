import type { RouteKey } from "./i18n/routes";
/**
 * Site-wide configuration: navigation, store links, app deep links.
 * Deep-link formats mirror mobile-app-flutter:
 *  - lib/feature/phone_services/share/data/share_service.dart (share URLs on link.padelcity.de)
 *  - lib/core/navigation/app_router.dart (in-app routes)
 */
import { appClubs } from "./appClubs";

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
  android: "https://play.google.com/store/apps/details?id=de.padelcity.app",
} as const;

/** Campaign parameters shared by all app and store links from the website. */
const UTM = { utm_source: "padelcity-website", utm_medium: "website" } as const;

/**
 * Store links with the page's campaign: App Store analytics read `pt` (provider token) + `ct`, Google Play passes
 * `referrer` (UTM) to the install. Without a campaign the plain store URLs.
 */
export function storeLinks(campaign?: string) {
  if (!campaign) return stores;
  const referrer = new URLSearchParams({ ...UTM, utm_campaign: campaign, utm_content: "badge" }).toString();
  return {
    ios: `${stores.ios}?${new URLSearchParams({ pt: "126504256", ct: campaign })}`,
    android: `${stores.android}&${new URLSearchParams({ referrer })}`,
  };
}

/** Main navigation (labels in src/lib/i18n/dictionaries.ts → nav.<key>). */
export const mainNav: RouteKey[] = ["locations", "app", "events", "academy", "magazine", "franchise"];
export const secondaryNav: RouteKey[] = ["about", "jobs", "partners", "investors", "faq"];
export const legalNav: RouteKey[] = ["imprint", "privacy", "terms"];

const LINK_BASE = process.env.NEXT_PUBLIC_APP_LINK_BASE ?? "https://link.padelcity.de";

/**
 * Event links don't work in the prototype yet: the events are mock data, so their ids exist neither in the app nor
 * in the web app. Until NEXT_PUBLIC_EVENT_LINKS_LIVE=true they lead to the "Coming soon" page (with a little padel
 * pong) instead of a dead end. Internal path – Next/asset() add the basePath.
 */
export const COMING_SOON = "/coming-soon/";
const EVENT_LINKS_LIVE = process.env.NEXT_PUBLIC_EVENT_LINKS_LIVE === "true";

/**
 * Universal link on link.padelcity.de: opens the app on that screen; without the app the link service redirects to
 * padelcity.de/app/. `campaign` names the page the link sits on (`<page>-page`), `content` the CTA.
 */
function appLink(path: string, campaign: string, content: string) {
  const url = new URL(path, LINK_BASE);
  for (const [k, v] of Object.entries({ ...UTM, utm_campaign: campaign, utm_content: content })) url.searchParams.set(k, v);
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
  event: (eventId: string) => (EVENT_LINKS_LIVE ? `${WEBAPP_BASE}/events/${eventId}` : COMING_SOON),
};

export const deeplinks = {
  /** Club page in the app, always with the club page's campaign. A club the app doesn't know yet → court search. */
  club: (slug: string, content = "book-court") => {
    const club = appClubs[slug];
    return club ? appLink(`/playtab/play/club/${club[0]}`, club[1], content) : appLink("/playtab/play/timeslotdiscover", `${slug}-page`, content);
  },
  event: (eventId: string) => (EVENT_LINKS_LIVE ? appLink(`/playtab/play/event/${eventId}`, "event-page", "event-signup") : COMING_SOON),
  openMatches: (campaign: string) => appLink("/playtab/play/open-matches", campaign, "open-matches"),
  events: (campaign: string) => appLink("/playtab/play/events", campaign, "events"),
  vouchers: (campaign: string) => appLink("/gift-vouchers/purchase", campaign, "vouchers"),
};
