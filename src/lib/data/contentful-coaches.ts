import "server-only";
import type { CoachOffer, CoachTrainingPrice, CoachTrainingSlot, Person, Weekday } from "../content/people";
import { flattenLocales, getEntries, type CfLocale } from "./contentful";

/**
 * Coaches from Contentful – used by `getCoaches(locale)` in ./index.ts (fallback: people.ts).
 *
 * Content type `coach`, field names as synced by api-platform
 * (api/src/Service/ContentfulSynchronizationService/Handler/CoachHandler.php):
 *   title        Symbol           professional title, e.g. "Head Coach"   → Person.role (de + en + pl)
 *   firstName    Symbol                                                   → Person.name
 *   lastName     Symbol                                                   → Person.name
 *   ProfileImage Link → Asset     portrait                                → Person.image
 *   clubs        Link[] → club    multi-reference (club.name localized)   → Person.club (joined)
 *   UserId       Symbol           api-platform user UUID; a coach is only active in the app if set → filter only
 *   EmailAddress Symbol           contact e-mail                          → Person.email  (mailto:)
 *   phoneNumber  Symbol           E.164-ish, e.g. "+49 170 1234567"       → Person.phone  (tel:)
 *     Contact data is personal data: shown on the website ONLY with the coach's consent (see README).
 *
 * Content type `coachTrainingTime` (one entry per coach × club; CoachHandler::synchronizeTrainingSchedules):
 *   coach          Link → coach
 *   club           Link → club                                           → CoachOffer.club
 *   trainingTimes  Object  { monday: { startsAt: "08:00", endsAt: "20:00" } | null, … sunday }
 *                  "H:i", Europe/Berlin (api-platform DayOfWeek denormalization)   → CoachOffer.times
 *   trainingPrices Object  [{ durationInSeconds, pricePerOnePlayer, pricePerTwoPlayer,
 *                  pricePerThreePlayer, pricePerFourPlayer }] – per player, minor units (cents)
 *                  (migration 20260416-120000-add-training-prices-to-coach-training-time.ts) → CoachOffer.prices
 *   These are static offer data (weekly training windows + price list), NOT booking availability.
 *
 * Not in Contentful: languages, bio, quote, hoursOnCourt, students → stay undefined.
 */

type Link = { sys: { id: string } };
type Entry = { sys: { id: string }; fields: Record<string, unknown> };
type Asset = { sys: { id: string }; fields: { file?: { url?: string } } };

const str = (v: unknown): string | undefined => (typeof v === "string" && v.trim() !== "" ? v.trim() : undefined);
const linkId = (v: unknown): string | undefined => (v as Link | undefined)?.sys?.id;
const int = (v: unknown): number | undefined => {
  const n = typeof v === "string" ? Number(v) : v;
  return typeof n === "number" && Number.isFinite(n) && n >= 0 ? Math.round(n) : undefined;
};

const WEEKDAYS: [string, Weekday][] = [
  ["monday", 1],
  ["tuesday", 2],
  ["wednesday", 3],
  ["thursday", 4],
  ["friday", 5],
  ["saturday", 6],
  ["sunday", 7],
];
const HHMM = /^([01]?\d|2[0-3]):[0-5]\d$/;

function mapTimes(raw: unknown): CoachTrainingSlot[] {
  if (!raw || typeof raw !== "object") return [];
  const days = raw as Record<string, unknown>;
  return WEEKDAYS.flatMap(([key, weekday]): CoachTrainingSlot[] => {
    const d = days[key] as { startsAt?: unknown; endsAt?: unknown } | null | undefined;
    const startsAt = str(d?.startsAt);
    const endsAt = str(d?.endsAt);
    return startsAt && endsAt && HHMM.test(startsAt) && HHMM.test(endsAt) ? [{ weekday, startsAt, endsAt }] : [];
  });
}

function mapPrices(raw: unknown): CoachTrainingPrice[] {
  if (!Array.isArray(raw)) return [];
  return raw
    .flatMap((p): CoachTrainingPrice[] => {
      const r = (p ?? {}) as Record<string, unknown>;
      const seconds = int(r.durationInSeconds);
      if (!seconds) return [];
      const perPlayerCents: CoachTrainingPrice["perPlayerCents"] = {};
      const one = int(r.pricePerOnePlayer);
      const two = int(r.pricePerTwoPlayer);
      const three = int(r.pricePerThreePlayer);
      const four = int(r.pricePerFourPlayer);
      if (one !== undefined) perPlayerCents[1] = one;
      if (two !== undefined) perPlayerCents[2] = two;
      if (three !== undefined) perPlayerCents[3] = three;
      if (four !== undefined) perPlayerCents[4] = four;
      return Object.keys(perPlayerCents).length ? [{ durationMinutes: Math.round(seconds / 60), perPlayerCents }] : [];
    })
    .sort((a, b) => a.durationMinutes - b.durationMinutes);
}

/** coachTrainingTime entries grouped by coach entry id. Tolerates a missing content type (→ empty map). */
async function fetchOffers(locale: CfLocale): Promise<Map<string, CoachOffer[]>> {
  const byCoach = new Map<string, CoachOffer[]>();
  let res;
  try {
    // include=1 resolves the linked club (name) – the coach link only needs its id.
    res = flattenLocales(await getEntries("coachTrainingTime", 1, "*"), locale);
  } catch (err) {
    console.warn(`[data] contentful coachTrainingTime unavailable (${err instanceof Error ? err.message : String(err)}) – coach offers omitted.`);
    return byCoach;
  }
  const entries = new Map<string, Entry>((res.includes?.Entry ?? []).map((e) => [e.sys.id, e as Entry]));
  for (const e of res.items) {
    const coachId = linkId(e.fields.coach);
    if (!coachId) continue;
    const clubId = linkId(e.fields.club);
    const offer: CoachOffer = {
      club: clubId ? str(entries.get(clubId)?.fields.name) : undefined,
      times: mapTimes(e.fields.trainingTimes),
      prices: mapPrices(e.fields.trainingPrices),
    };
    if (offer.times.length === 0 && offer.prices.length === 0) continue;
    byCoach.set(coachId, [...(byCoach.get(coachId) ?? []), offer]);
  }
  return byCoach;
}

export async function fetchContentfulCoaches(locale: CfLocale = "de"): Promise<Person[]> {
  // include=1 resolves the ProfileImage asset and the linked club entries in one request.
  // locale=* + flattenLocales: ProfileImage etc. are maintained in the default locale (en) only.
  const [coachRes, offers] = await Promise.all([getEntries("coach", 1, "*"), fetchOffers(locale)]);
  const res = flattenLocales(coachRes, locale);
  const assets = new Map<string, Asset>((res.includes?.Asset ?? []).map((a) => [a.sys.id, a as Asset]));
  const entries = new Map<string, Entry>((res.includes?.Entry ?? []).map((e) => [e.sys.id, e as Entry]));

  return res.items.flatMap((e): Person[] => {
    const name = [str(e.fields.firstName), str(e.fields.lastName)].filter(Boolean).join(" ");
    // Mirror api-platform: a coach without a linked user is inactive in the app.
    if (!name || !str(e.fields.UserId)) return [];

    const imageId = linkId(e.fields.ProfileImage);
    const url = imageId ? assets.get(imageId)?.fields.file?.url : undefined;
    const image = url ? `${url.startsWith("//") ? `https:${url}` : url}?w=1200&fm=webp` : undefined;

    const clubIds = Array.isArray(e.fields.clubs) ? e.fields.clubs.map(linkId) : [];
    const clubNames = clubIds.map((id) => (id ? str(entries.get(id)?.fields.name) : undefined)).filter(Boolean);

    const title = str(e.fields.title) ?? "Coach";
    const coachOffers = offers.get(e.sys.id);
    return [
      {
        id: `cf-${e.sys.id}`,
        name,
        role: { de: title, en: title, pl: title },
        image,
        club: clubNames.length ? clubNames.join(" & ") : undefined,
        // Personal contact data – only rendered because the coach entry is published for the website (consent, see README).
        email: str(e.fields.EmailAddress),
        phone: str(e.fields.phoneNumber),
        offers: coachOffers?.length ? coachOffers : undefined,
        source: "contentful",
      },
    ];
  });
}
