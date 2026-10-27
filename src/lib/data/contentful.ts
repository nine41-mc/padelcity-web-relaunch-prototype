import "server-only";
import type { Club, ClubPriceList, CourtSummary, Facility, ImageAsset, PriceKind, Sport } from "./types";
import { SPORTS } from "./types";
import {
  DEFAULT_TIMEZONE,
  LIVE_TIMEOUT_MS,
  deriveCountry,
  deriveTags,
  findMockMatch,
  mapOpeningTimes,
  normalizeCourtType,
  normalizeLocationType,
  regionForCity,
  regionFromSubdivision,
  slugify,
  teaserFrom,
  uniq,
} from "./mappers";

/**
 * Contentful Delivery API adapter (master data: clubs, courts, facilities).
 *
 * Field names are taken from api-platform, which syncs the same space into its DB:
 *   - api/src/Service/ContentfulSynchronizationService/Handler/ClubHandler.php
 *       club: name (localized), description (rich text, localized), timezone, subdivisionCode,
 *             location {lat, lon}, streetName, buildingNumber, postalCode, localityName,
 *             contact → contact {name, email, website, phoneNumber, profileImage},
 *             facilities → facility[], openingTimes (JSON), dayOpeningTimes (JSON),
 *             fallbackCourtPricePerHour (number, EUR), mainImage (asset), images (asset[]), operator → operator
 *   - Handler/CourtHandler.php
 *       court: name (localized), locationType (INDOOR|OUTDOOR), courtType (SINGLE|DOUBLE|ARBITRARY),
 *              isPremium, club → club, images (asset[]), sportType, possibleMatchModes
 *   - Handler/FacilityHandler.php
 *       facility: name (localized), type (e.g. SAUNA, PARKING_SPACE, BAR …)
 *   - Handler/ClubPriceListHandler.php
 *       clubPriceList: name, validFrom, assignedClub → club, pricing (JSON) – not used by the website yet.
 * Note: courts link to their club (court.club), not the other way round → two queries.
 * Note: "isShownInApp" / "isActive" live only in the api-platform DB, not in Contentful.
 */

type Sys = { id: string; type: string; linkType?: "Entry" | "Asset"; contentType?: { sys: { id: string } } };
type Link = { sys: Sys };
type CfEntry = { sys: Sys; fields: Record<string, unknown> };
type CfAsset = {
  sys: Sys;
  fields: {
    title?: string;
    description?: string;
    file?: { url?: string; contentType?: string; details?: { image?: { width: number; height: number } } };
  };
};
type CfResponse = {
  items: CfEntry[];
  includes?: { Entry?: CfEntry[]; Asset?: CfAsset[] };
  total: number;
};

export type CfLocale = import("../i18n/config").Locale;
/** Contentful default locale of the PadelCity space. api-platform reads clubs with locale EN
 *  (ClubHandler.php `$entry->setLocale(LocaleService::LOCALE__EN)`), so non-text fields
 *  (mainImage, images, location, openingTimes, prices, court types …) are maintained in "en" only. */
const DEFAULT_CF_LOCALE: CfLocale = "en";
const REVALIDATE_S = 600;

function env() {
  const spaceId = process.env.CONTENTFUL_SPACE_ID;
  const environmentId = process.env.CONTENTFUL_ENVIRONMENT_ID || "master";
  const token = process.env.CONTENTFUL_DELIVERY_TOKEN;
  return spaceId && token ? { spaceId, environmentId, token } : null;
}

export function isContentfulConfigured(): boolean {
  return env() !== null;
}

export async function getEntries(contentType: string, include: number, locale: CfLocale | "*" = "de"): Promise<CfResponse> {
  const cfg = env();
  if (!cfg) throw new Error("Contentful env vars missing");
  const url =
    `https://cdn.contentful.com/spaces/${encodeURIComponent(cfg.spaceId)}` +
    `/environments/${encodeURIComponent(cfg.environmentId)}/entries` +
    `?content_type=${contentType}&include=${include}&locale=${locale}&limit=1000`;
  const res = await fetch(url, {
    headers: { Authorization: `Bearer ${cfg.token}` },
    next: { revalidate: REVALIDATE_S, tags: ["contentful"] },
    signal: AbortSignal.timeout(LIVE_TIMEOUT_MS),
  });
  if (!res.ok) throw new Error(`Contentful ${contentType}: HTTP ${res.status}`);
  return (await res.json()) as CfResponse;
}

const isEmpty = (v: unknown) =>
  v === undefined || v === null || (typeof v === "string" && v.trim() === "") || (Array.isArray(v) && v.length === 0);

/**
 * `locale=*` returns every field as a locale map ({ de: …, en: … }) – for entries AND included assets.
 * Flattens one field: requested locale first, then the default locale ("en"), then any filled locale.
 * Unlike Contentful's built-in fallback this also skips empty strings / empty arrays, so a DE entry
 * whose media or JSON fields were only maintained in EN still gets them.
 */
function pickLocale(value: unknown, locale: CfLocale): unknown {
  if (!value || typeof value !== "object" || Array.isArray(value)) return value;
  const map = value as Record<string, unknown>;
  for (const key of [locale, DEFAULT_CF_LOCALE]) if (!isEmpty(map[key])) return map[key];
  return Object.values(map).find((v) => !isEmpty(v));
}

function flattenFields<T extends { fields: object }>(item: T, locale: CfLocale): T {
  const fields = Object.fromEntries(Object.entries(item.fields).map(([k, v]) => [k, pickLocale(v, locale)]));
  return { ...item, fields } as T;
}

/** Same response shape as a single-locale request, with per-field locale fallback (see pickLocale). */
export function flattenLocales(res: CfResponse, locale: CfLocale): CfResponse {
  return {
    ...res,
    items: res.items.map((e) => flattenFields(e, locale)),
    includes: {
      Entry: res.includes?.Entry?.map((e) => flattenFields(e, locale)),
      Asset: res.includes?.Asset?.map((a) => flattenFields(a, locale)),
    },
  };
}

/** Resolves links against items + includes of one or more responses. */
class LinkResolver {
  private entries = new Map<string, CfEntry>();
  private assets = new Map<string, CfAsset>();

  add(res: CfResponse) {
    for (const e of res.items) this.entries.set(e.sys.id, e);
    for (const e of res.includes?.Entry ?? []) this.entries.set(e.sys.id, e);
    for (const a of res.includes?.Asset ?? []) this.assets.set(a.sys.id, a);
  }

  entry(link: unknown): CfEntry | undefined {
    const id = (link as Link | undefined)?.sys?.id;
    return id ? this.entries.get(id) : undefined;
  }

  asset(link: unknown): CfAsset | undefined {
    const id = (link as Link | undefined)?.sys?.id;
    return id ? this.assets.get(id) : undefined;
  }

  image(link: unknown, fallbackAlt: string): ImageAsset | undefined {
    const a = this.asset(link);
    const url = a?.fields.file?.url;
    if (!url) return undefined;
    const abs = url.startsWith("//") ? `https:${url}` : url;
    const dims = a.fields.file?.details?.image;
    return {
      url: `${abs}?w=1600&fm=webp`,
      alt: a.fields.description || a.fields.title || fallbackAlt,
      width: dims?.width,
      height: dims?.height,
    };
  }
}

/** Rich text document → plain paragraphs joined by blank lines. */
function richTextToPlain(node: unknown): string {
  if (node == null) return "";
  if (typeof node === "string") return node;
  const n = node as { nodeType?: string; value?: string; content?: unknown[] };
  if (n.nodeType === "text") return n.value ?? "";
  const children = (n.content ?? []).map(richTextToPlain);
  if (n.nodeType === "document") return children.filter(Boolean).join("\n\n");
  return children.join("");
}

const str = (v: unknown): string | undefined => (typeof v === "string" && v.trim() !== "" ? v : undefined);

function mapCourt(e: CfEntry): CourtSummary {
  return {
    id: e.sys.id,
    name: str(e.fields.name) ?? "Court",
    locationType: normalizeLocationType(e.fields.locationType),
    courtType: normalizeCourtType(e.fields.courtType),
    isPremium: e.fields.isPremium === true,
    sport: normalizeSport(e.fields.sportType),
  };
}

function normalizeSport(v: unknown): Sport {
  const s = String(v ?? "PADEL").toLowerCase().replace(/[^a-z]/g, "");
  return (SPORTS as string[]).includes(s) ? (s as Sport) : s === "football" ? "soccer" : "padel";
}

/** Contentful facility type → icon file in /public/icons (same mapping as mobile-app-flutter core/util/extension/facility.dart). */
const FACILITY_ICONS: Record<string, string> = {
  academy: "muscle",
  ball_machine: "ball_machine",
  bar: "bar",
  changing_room: "locker_room",
  charging: "charging",
  free_parking: "parking_space",
  interactive_play_wall: "interactive_playwall",
  reception: "reception",
  rental_bats: "padel",
  restaurant: "restaurant",
  sauna: "sauna",
  shop: "shopping_bag",
  showers: "shower",
  toilets: "wc",
  vending_machine: "vending_machine",
  wifi: "wifi",
};

function mapFacility(e: CfEntry): Facility {
  const type = String(e.fields.type ?? "").toLowerCase();
  const icon = FACILITY_ICONS[type] ?? type;
  return { type, icon, name: str(e.fields.name) ?? type, iconUrl: `/icons/${icon}.svg` };
}

function mapContact(r: LinkResolver, raw: unknown): Club["contact"] {
  // Normally a link to a "contact" entry; tolerate an inline JSON object as well.
  const fields = (r.entry(raw)?.fields ?? (raw && typeof raw === "object" && !("sys" in raw) ? raw : undefined)) as
    | Record<string, unknown>
    | undefined;
  if (!fields) return undefined;
  return {
    name: str(fields.name),
    phoneNumber: str(fields.phoneNumber),
    emailAddress: str(fields.email) ?? str(fields.emailAddress),
    // Same Contentful field the APL serves as GET /clubs → contact.profileImageUrl
    profileImageUrl: r.image(fields.profileImage, str(fields.name) ?? "")?.url.replace("w=1600", "w=160"),
  };
}

/**
 * Optional second poster line when the club's site is outside the city it is named after (proposed field
 * "district" on the club). Curated by PadelCity – not derivable: Rheinstetten is shown, Obertraubling is not.
 */
const DISTRICTS: Record<string, string> = { jena: "Göschwitz", karlsruhe: "Rheinstetten" };

const PRICE_SPORTS: Record<string, Sport> = { padel: "padel", tennis: "tennis", squash: "squash", badminton: "badminton", pickleball: "pickleball", soccer: "soccer", multi: "multisport" };
const PRICE_DAYS = ["mondays", "tuesdays", "wednesdays", "thursdays", "fridays", "saturdays", "sundays", "holidays"];
const PRICE_FIELDS: Record<string, PriceKind> = {
  applicableIndoorPricePerHour: "indoorDouble",
  applicableIndoorPricePerHourSingle: "indoorSingle",
  applicableIndoorPricePerHourPremium: "indoorPremium",
  applicableOutdoorPricePerHour: "outdoorDouble",
  applicableOutdoorPricePerHourSingle: "outdoorSingle",
  applicableOutdoorPricePerHourPremium: "outdoorPremium",
};

/**
 * clubPriceList entries (the source the APL syncs into ClubPriceList.pricing): per club the list with the latest
 * validFrom that has started. pricing = { <sport>: { mondays … sundays, holidays: [{ startsAt, endsAt, applicable…PerHour (cents) }] } }.
 */
function currentPriceLists(res: CfResponse | undefined, today = new Date().toISOString().slice(0, 10)): Map<string, ClubPriceList> {
  const out = new Map<string, ClubPriceList>();
  for (const e of res?.items ?? []) {
    const clubId = (pickLocale(e.fields.assignedClub, "de") as Link | undefined)?.sys?.id;
    const validFrom = str(pickLocale(e.fields.validFrom, "de"))?.slice(0, 10);
    const pricing = pickLocale(e.fields.pricing, "de") as Record<string, Record<string, Record<string, unknown>[]>> | undefined;
    if (!clubId || !validFrom || validFrom > today || !pricing) continue;
    const prev = out.get(clubId);
    if (prev && prev.validFrom >= validFrom) continue;
    const sports: ClubPriceList["sports"] = {};
    for (const [key, days] of Object.entries(pricing)) {
      const sport = PRICE_SPORTS[key];
      if (!sport || !days || typeof days !== "object") continue;
      sports[sport] = PRICE_DAYS.map((d) =>
        (days[d] ?? []).map((p) => ({
          from: String(p.startsAt ?? ""),
          until: String(p.endsAt ?? ""),
          prices: Object.fromEntries(
            Object.entries(PRICE_FIELDS)
              .filter(([field]) => typeof p[field] === "number")
              .map(([field, kind]) => [kind, (p[field] as number) / 100]),
          ),
        })),
      );
    }
    out.set(clubId, { title: str(pickLocale(e.fields.name, "de")), validFrom, sports });
  }
  return out;
}

export async function fetchContentfulClubs(mocks: Club[], locale: CfLocale = "de"): Promise<Club[]> {
  // locale=* + flattenLocales: text in the page locale, media/JSON/number fields fall back to EN (see DEFAULT_CF_LOCALE).
  const [rawClubs, rawCourts, rawPrices] = await Promise.all([
    getEntries("club", 2, "*"),
    getEntries("court", 1, "*"),
    // price lists are optional – a missing content type must not break the clubs
    getEntries("clubPriceList", 0, "*").catch(() => undefined),
  ]);
  const priceLists = currentPriceLists(rawPrices);
  const [clubsRes, courtsRes] = [rawClubs, rawCourts].map((res) => flattenLocales(res, locale));
  // URL slugs are shared across locales (/standorte/x ↔ /en/locations/x) → always derived from the German name,
  // otherwise "München Tucherpark" / "Munich Tucherpark" would get different slugs and break hreflang + language switch.
  const slugNames = new Map(rawClubs.items.map((e) => [e.sys.id, str(pickLocale(e.fields.name, "de"))]));
  const r = new LinkResolver();
  r.add(clubsRes);
  r.add(courtsRes);

  const courtsByClub = new Map<string, CourtSummary[]>();
  for (const c of courtsRes.items) {
    const clubId = (c.fields.club as Link | undefined)?.sys?.id;
    if (!clubId) continue;
    // All sports (padel, pickleball, tennis, squash, …) – the website shows them as labels.
    const list = courtsByClub.get(clubId) ?? [];
    list.push(mapCourt(c));
    courtsByClub.set(clubId, list);
  }

  const clubs: Club[] = [];
  for (const e of clubsRes.items) {
    const f = e.fields;
    const name = str(f.name);
    if (!name) continue;

    // The city PadelCity names the club after ("PadelCity Regensburg" → Regensburg). localityName is the address
    // (Obertraubling, Rheinstetten, Warszawa …) and stays in the address only.
    const locality = str(f.localityName) ?? "";
    const city = name.replace(/^padel\s*city\s+/i, "").split(/\s+/)[0] || locality;
    const slug = slugify(slugNames.get(e.sys.id) ?? name);
    const timezone = str(f.timezone) ?? DEFAULT_TIMEZONE;
    const subdivision = str(f.subdivisionCode);
    const description = richTextToPlain(f.description).trim();
    const courts = (courtsByClub.get(e.sys.id) ?? []).sort((a, b) =>
      a.name.localeCompare(b.name, "de", { numeric: true }),
    );
    const mainImage = r.image(f.mainImage, `${name} – Courts`);
    const gallery = (Array.isArray(f.images) ? f.images : [])
      .map((l, i) => r.image(l, `${name} – Bild ${i + 1}`))
      .filter((x): x is ImageAsset => Boolean(x));
    const facilities = (Array.isArray(f.facilities) ? f.facilities : [])
      .map((l) => r.entry(l))
      .filter((x): x is CfEntry => Boolean(x))
      .map(mapFacility);
    const loc = f.location as { lat?: number; lon?: number } | undefined;
    // fallbackCourtPricePerHour is stored in MINOR units (api-platform: MoneyFactory::forClub → moneyphp, cents).
    // A few entries hold whole euros (e.g. 24) – values < 100 are treated as major units.
    const rawPrice = Number(f.fallbackCourtPricePerHour);
    const price = Number.isFinite(rawPrice) && rawPrice >= 100 ? rawPrice / 100 : rawPrice;

    const mock = findMockMatch(mocks, { slug, name, city });
    const country = deriveCountry({ subdivision, timezone: str(f.timezone), city, name, postalCode: str(f.postalCode) });
    // A German subdivision on a club abroad would put it under "Bayern" → only trust DE codes for DE clubs.
    const subRegion = country === "DE" || !subdivision?.toUpperCase().startsWith("DE-") ? regionFromSubdivision(subdivision) : undefined;

    clubs.push({
      id: e.sys.id,
      slug: mock?.slug ?? slug, // keep curated URLs stable when a mock counterpart exists
      contentfulId: e.sys.id,
      name,
      city,
      region: subRegion ?? (country === "DE" ? mock?.region : regionForCity(city) ?? regionForCity(name.replace(/^padel\s*city\s+/i, ""))),
      country,
      description: description || mock?.description || "",
      // Real Contentful description first – mock teasers are illustrative and must never override facts.
      teaser: teaserFrom(description) ?? `${courts.length} Courts in ${city}`,
      address: {
        streetName: str(f.streetName) ?? "",
        buildingNumber: str(f.buildingNumber) ?? "",
        postalCode: str(f.postalCode) ?? "",
        localityName: locality,
      },
      district: str(f.district) ?? DISTRICTS[mock?.slug ?? slug],
      position: { latitude: Number(loc?.lat ?? mock?.position.latitude ?? 0), longitude: Number(loc?.lon ?? mock?.position.longitude ?? 0) },
      courts,
      facilities,
      openingHours: mapOpeningTimes(f.openingTimes, timezone),
      defaultPricePerHour: Number.isFinite(price) && price > 0 ? price : undefined,
      priceList: priceLists.get(e.sys.id),
      currency: country === "PL" ? "PLN" : "EUR",
      mainImage: mainImage ?? gallery[0] ?? mock?.mainImage,
      // Gallery = main image + all `images` (deduplicated by URL).
      images: mainImage || gallery.length ? uniqByUrl([mainImage, ...gallery]) : (mock?.images ?? []),
      contact: { ...mapContact(r, f.contact), whatsappGroupUrl: str(f.whatsappGroupUrl) ?? str(f.whatsappGroup) },
      tags: uniq([...deriveTags(courts), ...(mock?.tags ?? [])]),
      isFranchise: mock?.isFranchise,
      source: "contentful",
    });
  }

  return ensureUniqueSlugs(clubs.sort((a, b) => a.name.localeCompare(b.name, "de")));
}

function uniqByUrl(images: (ImageAsset | undefined)[]): ImageAsset[] {
  const seen = new Set<string>();
  return images.filter((i): i is ImageAsset => {
    if (!i || seen.has(i.url)) return false;
    seen.add(i.url);
    return true;
  });
}

export function ensureUniqueSlugs(clubs: Club[]): Club[] {
  const seen = new Map<string, number>();
  return clubs.map((c) => {
    const n = (seen.get(c.slug) ?? 0) + 1;
    seen.set(c.slug, n);
    return n === 1 ? c : { ...c, slug: `${c.slug}-${n}` };
  });
}
