import type { Club, CourtSummary, OpeningHours } from "./types";

/**
 * Shared helpers for the live adapters (Contentful + api-platform).
 * Pure functions only – no I/O, no env access.
 */

export const DEFAULT_TIMEZONE = "Europe/Berlin";
export const LIVE_TIMEOUT_MS = 4000;

/** "PadelCity München Tucherpark" → "muenchen-tucherpark" (brand prefix dropped, umlauts transliterated). */
export function slugify(input: string): string {
  return input
    .trim()
    .replace(/^padel\s*city\s+/i, "")
    .toLowerCase()
    .replace(/ä/g, "ae")
    .replace(/ö/g, "oe")
    .replace(/ü/g, "ue")
    .replace(/ß/g, "ss")
    .normalize("NFD")
    .replace(/[̀-ͯ]/g, "")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
}

/** Comparable key for fuzzy name matching across sources ("PadelCity Fürth" ≈ "Padel City Fuerth"). */
export function nameKey(input: string): string {
  return slugify(input).replace(/-/g, "");
}

/** Money as serialized by api-platform's MoneyNormalizer: { amount: "3400" (minor units), currency, symbol }. */
export function moneyToEuro(money: unknown): number | undefined {
  if (money == null) return undefined;
  if (typeof money === "number") return money / 100;
  if (typeof money === "string") return Number.isFinite(Number(money)) ? Number(money) / 100 : undefined;
  if (typeof money === "object" && "amount" in money) {
    const n = Number((money as { amount: unknown }).amount);
    return Number.isFinite(n) ? n / 100 : undefined;
  }
  return undefined;
}

/** ISO instant → club-local "YYYY-MM-DDTHH:mm" (the format the Slot / ClubEvent view models use). */
export function toLocalIso(iso: string, timeZone = DEFAULT_TIMEZONE): string {
  const d = new Date(iso);
  if (Number.isNaN(d.getTime())) return iso.slice(0, 16);
  const parts = new Intl.DateTimeFormat("en-CA", {
    timeZone,
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
    hour: "2-digit",
    minute: "2-digit",
    hourCycle: "h23",
  }).formatToParts(d);
  const get = (t: string) => parts.find((p) => p.type === t)?.value ?? "00";
  return `${get("year")}-${get("month")}-${get("day")}T${get("hour")}:${get("minute")}`;
}

/** "07:00" | "07:00:00" | ISO datetime → "HH:mm" in the club timezone. */
function toHHmm(value: unknown, timeZone: string): string | undefined {
  if (typeof value !== "string" || value === "") return undefined;
  const m = /^(\d{1,2}):(\d{2})/.exec(value);
  if (m && !value.includes("T")) return `${m[1].padStart(2, "0")}:${m[2]}`;
  const local = toLocalIso(value, timeZone);
  return /T\d{2}:\d{2}$/.test(local) ? local.slice(11) : undefined;
}

/** Label of the public-holiday entry in OpeningHours. */
export const HOLIDAY_LABEL = "Feiertage";

const WEEKDAYS = [
  ["monday", "Mo"],
  ["tuesday", "Di"],
  ["wednesday", "Mi"],
  ["thursday", "Do"],
  ["friday", "Fr"],
  ["saturday", "Sa"],
  ["sunday", "So"],
] as const;

/**
 * Opening times as stored in Contentful (club.openingTimes JSON) and returned by
 * api-platform (club.openingTimes, deprecated but still serialized):
 *   { monday: { opensAt, closesAt } | null, …, sunday, holiday }
 * Consecutive days with identical hours are grouped: [{ label: "Mo – Fr", open, close }], two days as "Sa & So";
 * public holidays follow as { label: "Feiertage", … } when set.
 */
export function mapOpeningTimes(raw: unknown, timeZone = DEFAULT_TIMEZONE): OpeningHours {
  if (!raw || typeof raw !== "object") return [];
  const obj = raw as Record<string, unknown>;
  const days = WEEKDAYS.map(([key, label]) => {
    const day = obj[key] as { opensAt?: unknown; closesAt?: unknown } | null | undefined;
    const open = day ? toHHmm(day.opensAt, timeZone) : undefined;
    const close = day ? toHHmm(day.closesAt, timeZone) : undefined;
    return { label, open, close };
  });

  const result: OpeningHours = [];
  let i = 0;
  while (i < days.length) {
    let j = i;
    while (j + 1 < days.length && days[j + 1].open === days[i].open && days[j + 1].close === days[i].close) j++;
    const { open, close } = days[i];
    if (open && close) {
      // Two days read better as a pair ("Mo & Di"); the dash is for spans of three or more ("Mo – Fr")
      const label = i === j ? days[i].label : `${days[i].label} ${j === i + 1 ? "&" : "–"} ${days[j].label}`;
      result.push({ label, open, close });
    }
    i = j + 1;
  }
  // Public holidays as their own entry (label "Feiertage"); weekday logic ignores it, the club page shows it
  const holiday = obj.holiday as { opensAt?: unknown; closesAt?: unknown } | null | undefined;
  const hOpen = holiday ? toHHmm(holiday.opensAt, timeZone) : undefined;
  const hClose = holiday ? toHHmm(holiday.closesAt, timeZone) : undefined;
  if (hOpen && hClose) result.push({ label: HOLIDAY_LABEL, open: hOpen, close: hClose });
  return result;
}

const SUBDIVISIONS: Record<string, string> = {
  "DE-BW": "Baden-Württemberg",
  "DE-BY": "Bayern",
  "DE-BE": "Berlin",
  "DE-BB": "Brandenburg",
  "DE-HB": "Bremen",
  "DE-HH": "Hamburg",
  "DE-HE": "Hessen",
  "DE-MV": "Mecklenburg-Vorpommern",
  "DE-NI": "Niedersachsen",
  "DE-NW": "Nordrhein-Westfalen",
  "DE-RP": "Rheinland-Pfalz",
  "DE-SL": "Saarland",
  "DE-SN": "Sachsen",
  "DE-ST": "Sachsen-Anhalt",
  "DE-SH": "Schleswig-Holstein",
  "DE-TH": "Thüringen",
};

// Austria (ISO 3166-2:AT, numeric) and Poland (ISO 3166-2:PL, numeric since 2018 + legacy letter codes).
const SUBDIVISIONS_ABROAD: Record<string, string> = {
  "AT-1": "Burgenland",
  "AT-2": "Kärnten",
  "AT-3": "Niederösterreich",
  "AT-4": "Oberösterreich",
  "AT-5": "Salzburg",
  "AT-6": "Steiermark",
  "AT-7": "Tirol",
  "AT-8": "Vorarlberg",
  "AT-9": "Wien",
  "PL-12": "Kleinpolen",
  "PL-MA": "Kleinpolen",
  "PL-14": "Masowien",
  "PL-MZ": "Masowien",
  "PL-26": "Heiligkreuz",
  "PL-SK": "Heiligkreuz",
};

export function regionFromSubdivision(code: string | undefined): string | undefined {
  if (!code) return undefined;
  const c = code.toUpperCase();
  return SUBDIVISIONS[c] ?? SUBDIVISIONS_ABROAD[c];
}

/** Regions for clubs abroad when Contentful has no (or a wrong) subdivisionCode – keyed by nameKey(city). */
const CITY_REGIONS: Record<string, string> = {
  innsbruck: "Tirol",
  warschau: "Masowien",
  warszawa: "Masowien",
  warsaw: "Masowien",
  krakow: "Kleinpolen",
  krakau: "Kleinpolen",
  kielce: "Heiligkreuz",
};

export function regionForCity(city: string): string | undefined {
  return CITY_REGIONS[nameKey(city)];
}

const COUNTRIES: Club["country"][] = ["DE", "AT", "ES", "PL", "PH"];
export function countryFromSubdivision(code: string | undefined): Club["country"] {
  const cc = (code ?? "").slice(0, 2).toUpperCase() as Club["country"];
  return COUNTRIES.includes(cc) ? cc : "DE";
}

const TIMEZONE_COUNTRIES: Record<string, Club["country"]> = {
  "Europe/Vienna": "AT",
  "Europe/Warsaw": "PL",
  "Europe/Madrid": "ES",
  "Asia/Manila": "PH",
};
const CITY_COUNTRIES: Record<string, Club["country"]> = {
  innsbruck: "AT",
  wien: "AT",
  vienna: "AT",
  salzburg: "AT",
  graz: "AT",
  linz: "AT",
  warschau: "PL",
  warszawa: "PL",
  warsaw: "PL",
  krakow: "PL",
  krakau: "PL",
  kielce: "PL",
};

/**
 * Country of a Contentful club. subdivisionCode is not reliable for clubs abroad (e.g. "PadelCity Warschau"
 * may carry a German code or none), so signals are checked from most to least specific:
 * subdivision (non-DE) → timezone → known city/name → postal-code format → subdivision → "DE".
 */
export function deriveCountry(input: {
  subdivision?: string;
  timezone?: string;
  city?: string;
  name?: string;
  postalCode?: string;
}): Club["country"] {
  const sub = input.subdivision ? countryFromSubdivision(input.subdivision) : undefined;
  if (sub && sub !== "DE") return sub;
  const tz = input.timezone ? TIMEZONE_COUNTRIES[input.timezone] : undefined;
  if (tz) return tz;
  for (const word of [input.city ?? "", ...(input.name ?? "").split(/\s+/)]) {
    const hit = CITY_COUNTRIES[nameKey(word)];
    if (hit) return hit;
  }
  const pc = (input.postalCode ?? "").trim();
  if (/^\d{2}-\d{3}$/.test(pc)) return "PL";
  if (/^\d{4}$/.test(pc)) return "AT";
  return sub ?? "DE";
}

export function normalizeLocationType(v: unknown): CourtSummary["locationType"] {
  return String(v ?? "").toUpperCase() === "OUTDOOR" ? "outdoor" : "indoor";
}

/** SINGLE / SINGLES → single; DOUBLE / DOUBLES / ARBITRARY / unknown → double. */
export function normalizeCourtType(v: unknown): CourtSummary["courtType"] {
  return String(v ?? "").toUpperCase().startsWith("SINGLE") ? "single" : "double";
}

/** Tags derivable from court data; merged with curated mock tags by the adapters. */
export function deriveTags(courts: CourtSummary[]): string[] {
  const tags: string[] = [];
  if (courts.some((c) => c.locationType === "indoor")) tags.push("Indoor");
  if (courts.some((c) => c.locationType === "outdoor")) tags.push("Outdoor");
  if (courts.some((c) => c.isPremium)) tags.push("Center Court");
  return tags;
}

export function uniq<T>(items: T[]): T[] {
  return Array.from(new Set(items));
}

/** Finds the curated mock club that corresponds to a live club (same slug, same name, or the only one in that city). */
export function findMockMatch(mocks: Club[], live: { slug: string; name: string; city: string }): Club | undefined {
  const bySlug = mocks.find((m) => m.slug === live.slug);
  if (bySlug) return bySlug;
  const key = nameKey(live.name);
  const byName = mocks.find((m) => nameKey(m.name) === key);
  if (byName) return byName;
  // City fallback only when the live club is named after the city alone ("PadelCity Berlin"),
  // otherwise two clubs in one city ("Leipzig Leutzsch" / "Leipzig Plagwitz") would share one mock.
  if (live.slug !== slugify(live.city)) return undefined;
  const sameCity = mocks.filter((m) => nameKey(m.city) === nameKey(live.city));
  return sameCity.length === 1 ? sameCity[0] : undefined;
}

/** First sentence (≤ 120 chars) of a description, used as teaser when no curated one exists. */
export function teaserFrom(description: string | undefined): string | undefined {
  if (!description) return undefined;
  const first = (/^[\s\S]*?[.!?](?=\s|$)/.exec(description)?.[0] ?? description).trim();
  if (!first) return undefined;
  return first.length > 120 ? `${first.slice(0, 117)}…` : first;
}

export function errorMessage(err: unknown): string {
  if (err instanceof Error) return err.name === "TimeoutError" ? "timeout" : err.message;
  return String(err);
}
