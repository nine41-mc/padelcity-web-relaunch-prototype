import "server-only";
import { whatsappForClub } from "../content/whatsapp";
import { cache } from "react";
import type { Club, ClubEvent, DataSource } from "./types";
import type { Locale } from "../i18n/config";
import { mockClubs } from "./mock/clubs";
import { toEnglishMock } from "./mock/clubs-en";
import { mockEvents } from "./mock/events";
import { supplementClubs } from "./mock/supplement";
import { toEnglishSupplement } from "./mock/supplement-en";
import { fetchContentfulClubs, isContentfulConfigured } from "./contentful";
import { fetchContentfulCoaches } from "./contentful-coaches";
import { coaches as peopleCoaches, type Person } from "../content/people";
import { errorMessage, nameKey } from "./mappers";

/**
 * Data facade used by all pages. Pages never talk to Contentful directly.
 *
 *   clubs:  Contentful (Delivery API, build time) → mock, plus mock/supplement.ts
 *           (live clubs missing in Contentful, e.g. Innsbruck, and planned "coming soon" clubs)
 *   events: mock (source for marketing events tbd – see README)
 *   coaches: Contentful `coach` + `coachTrainingTime` → src/lib/content/people.ts (real coaches, no contact/prices)
 *
 * PRINCIPLE (PadelCity): the website never reads from the booking system.
 * No free slots, no availability, no occupancy/"spots left" – booking data stays in the app.
 * Contentful master data (clubs, courts, facilities, coaches) is public marketing content.
 */

const warned = new Set<string>();
function warnOnce(source: string, err: unknown) {
  if (warned.has(source)) return;
  warned.add(source);
  console.warn(`[data] ${source} unavailable (${errorMessage(err)}) – falling back to mock data.`);
}

/** "PadelCity Andernach" → "Andernach" */
export function stripBrand(name: string) {
  return name.replace(/^PadelCity\s+/i, "").trim() || name;
}

/** Internal test clubs in Contentful must never appear on the website. */
function isTestClub(c: Pick<Club, "name" | "slug">) {
  return /\btest\b/i.test(c.name) || /(^|-)test(-|$)/.test(c.slug);
}

const resolveBaseClubs = cache(async (locale: Locale): Promise<Club[]> => {
  if (isContentfulConfigured()) {
    try {
      // Contentful also holds internal test entries ("Test Club | POLAND", "Test Club | alle Sportarten") –
      // there is no website-visibility flag yet (see README), so they are filtered by name.
      const clubs = (await fetchContentfulClubs(mockClubs, locale)).filter((c) => !isTestClub(c));
      if (clubs.length === 0) throw new Error("no club entries");
      return clubs;
    } catch (err) {
      warnOnce("contentful", err);
    }
  }
  return locale === "en" ? mockClubs.map(toEnglishMock) : mockClubs;
});

/**
 * Base clubs (Contentful or mock) + supplement, de-duplicated: a supplement club is dropped as soon as
 * the base has a club with the same slug or the same name (base/Contentful wins). Keys are taken from
 * the German supplement entry so that translated EN names still match.
 */
const resolveAllClubs = cache(async (locale: Locale): Promise<Club[]> => {
  const base = (await resolveBaseClubs(locale)).map((c) => ({ ...c, status: c.status ?? "open" }) satisfies Club);
  const taken = new Set(base.flatMap((c) => [c.slug, nameKey(c.name)]));
  const extra = supplementClubs
    .filter((s) => !taken.has(s.slug) && !taken.has(nameKey(s.name)))
    .map((s) => (locale === "en" ? toEnglishSupplement(s) : s));
  // WhatsApp community links (padelcity.de) – only for open clubs, Contentful value wins.
  return [...base, ...extra]
    .map((c) =>
      c.status === "planned" || c.contact?.whatsappGroupUrl
        ? c
        : { ...c, contact: { ...c.contact, whatsappGroupUrl: whatsappForClub(c) } },
    )
    // UI shows names without the brand prefix ("Andernach", "München Tucherpark"); fullName keeps the official name.
    .map((c) => ({ ...c, fullName: c.fullName ?? c.name, name: stripBrand(c.name) }));
});

/** Open clubs only (default for all pages: cards, maps, detail pages, static params). */
export async function getClubs(locale: Locale = "de"): Promise<Club[]> {
  return (await resolveAllClubs(locale)).filter((c) => c.status !== "planned");
}

/** Planned clubs ("Bald eröffnet / Coming soon") – no detail pages, no booking, no prices. */
export async function getPlannedClubs(locale: Locale = "de"): Promise<Club[]> {
  return (await resolveAllClubs(locale)).filter((c) => c.status === "planned");
}

export async function getClub(slug: string, locale: Locale = "de"): Promise<Club | undefined> {
  return (await getClubs(locale)).find((c) => c.slug === slug);
}

export async function getEvents(opts: { clubId?: string; locale?: Locale } = {}): Promise<ClubEvent[]> {
  const events = mockEvents.map((e) => (e.clubName ? { ...e, clubName: stripBrand(e.clubName) } : e));
  if (!opts.clubId) return events;
  const club = (await getClubs(opts.locale)).find((c) => c.id === opts.clubId);
  return events.filter((e) => e.clubId === opts.clubId || (club && e.clubId === club.slug));
}

export async function getEvent(slug: string): Promise<ClubEvent | undefined> {
  const e = mockEvents.find((x) => x.slug === slug);
  return e?.clubName ? { ...e, clubName: stripBrand(e.clubName) } : e;
}

/**
 * Academy coaches: Contentful (incl. contact + training offer, see contentful-coaches.ts) → fallback people.ts.
 * Head Coaches first, otherwise source order.
 */
const EXAMPLE_COACH_STATS = { hoursOnCourt: 7000, students: 350 };

export const getCoaches = cache(async (locale: Locale = "de"): Promise<Person[]> => {
  let list: Person[] = peopleCoaches;
  if (isContentfulConfigured()) {
    try {
      const cf = await fetchContentfulCoaches(locale);
      if (cf.length === 0) throw new Error("no coach entries");
      // Coach photos in Contentful are weak (PadelCity, 13.10.2026) → keep the padelcity.de portraits
      // from people.ts when the same coach exists there; Contentful contributes contact, prices & times.
      const key = (n: string) => n.toLocaleLowerCase("de").normalize("NFD").replace(/[^a-z]/g, "");
      const portraits = new Map(peopleCoaches.map((p) => [key(p.name), p]));
      list = cf.map((c) => {
        const local = portraits.get(key(c.name));
        return local ? { ...c, image: local.image ?? c.image, club: c.club ?? local.club, bio: c.bio ?? local.bio } : c;
      });
    } catch (err) {
      warnOnce("contentful coaches", err);
    }
  }
  const isHead = (p: Person) => /head/i.test(p.role.en);
  // Prototype: example stats given by PadelCity (13.10.2026) until Contentful has coach fields
  // (hoursOnCourt, students). Real values on a coach always win.
  const withStats = list.map((p) => ({ ...p, hoursOnCourt: p.hoursOnCourt ?? EXAMPLE_COACH_STATS.hoursOnCourt, students: p.students ?? EXAMPLE_COACH_STATS.students }));
  return withStats.sort((a, b) => Number(isHead(b)) - Number(isHead(a)));
});

export async function getDataStatus(): Promise<{ contentfulConfigured: boolean; clubs: DataSource }> {
  const clubs = await getClubs();
  return { contentfulConfigured: isContentfulConfigured(), clubs: clubs[0]?.source ?? "mock" };
}

export type { Club, ClubEvent, DataSource } from "./types";
