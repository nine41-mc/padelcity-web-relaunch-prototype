/** Small, dependency-free helpers shared by the locations pages (server + client safe). */

export type LatLng = { latitude: number; longitude: number };

/** Great-circle distance in km (haversine). */
export function distanceKm(a: LatLng, b: LatLng): number {
  const R = 6371;
  const toRad = (d: number) => (d * Math.PI) / 180;
  const dLat = toRad(b.latitude - a.latitude);
  const dLng = toRad(b.longitude - a.longitude);
  const h = Math.sin(dLat / 2) ** 2 + Math.cos(toRad(a.latitude)) * Math.cos(toRad(b.latitude)) * Math.sin(dLng / 2) ** 2;
  return 2 * R * Math.asin(Math.sqrt(h));
}

export function formatKm(km: number, intl = "de-DE") {
  return `${km.toLocaleString(intl, { maximumFractionDigits: km < 10 ? 1 : 0 })} km`;
}

const DAY_KEYS = ["Mo", "Di", "Mi", "Do", "Fr", "Sa", "So"] as const;
// English labels ("Mon – Fri", "Sat – Sun", "Daily") → German keys
const EN_ALIAS: Record<string, string> = { Tu: "Di", We: "Mi", Th: "Do", Su: "So" };
const SCHEMA_DAYS = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"];

/** Parses labels like "Mo – Fr", "Sa & So", "Mo" into weekday indices (0 = Mo). */
export function parseDayLabel(label: string): number[] {
  const parts = label.split(/[–&-]/).map((p) => EN_ALIAS[p.trim().slice(0, 2)] ?? p.trim().slice(0, 2));
  const from = DAY_KEYS.indexOf(parts[0] as (typeof DAY_KEYS)[number]);
  const to = parts[1] ? DAY_KEYS.indexOf(parts[1] as (typeof DAY_KEYS)[number]) : from;
  if (from < 0 || to < 0) return [];
  const out: number[] = [];
  for (let i = from; i <= to; i++) out.push(i);
  return out;
}

const EN_DAYS: Record<string, string> = { Mo: "Mon", Di: "Tue", Mi: "Wed", Do: "Thu", Fr: "Fri", Sa: "Sat", So: "Sun" };
// Polish short forms (pn, wt, śr, cz, pt, sb, nd) – capitalised like the DE/EN labels
const PL_DAYS: Record<string, string> = { Mo: "Pn", Di: "Wt", Mi: "Śr", Do: "Cz", Fr: "Pt", Sa: "Sb", So: "Nd" };

/** Opening-hours labels come in German ("Mo – Fr"); translates the day abbreviations for EN and PL. */
export function dayLabel(label: string, locale: "de" | "en" | "pl") {
  if (locale === "de") return label;
  const days = locale === "pl" ? PL_DAYS : EN_DAYS;
  const out = label.replace(/\b(Mo|Di|Mi|Do|Fr|Sa|So)\b/g, (d) => days[d] ?? d);
  return locale === "pl" ? out.replace(/täglich/i, "Codziennie") : out;
}

export function schemaDays(label: string) {
  return parseDayLabel(label).map((i) => SCHEMA_DAYS[i]);
}

export function googleMapsRoute(p: LatLng) {
  return `https://www.google.com/maps/dir/?api=1&destination=${p.latitude},${p.longitude}`;
}

/** Today's opening hours in the club's time zone, from labels like "Mo – Fr" / "Mon – Fri". */
export function todaysHours(
  hours: { label: string; open: string; close: string }[],
  now: Date = new Date(),
  timeZone = "Europe/Berlin",
): { open: string; close: string; state: "before" | "open" | "after" } | undefined {
  const parts = new Intl.DateTimeFormat("en-GB", { timeZone, weekday: "short", hour: "2-digit", minute: "2-digit", hourCycle: "h23" }).formatToParts(now);
  const wd = parts.find((p) => p.type === "weekday")?.value ?? "Mon";
  const idx = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"].indexOf(wd);
  const hm = `${parts.find((p) => p.type === "hour")?.value}:${parts.find((p) => p.type === "minute")?.value}`;
  const entry = hours.find((h) => /täglich|daily/i.test(h.label) || parseDayLabel(h.label).includes(idx));
  if (!entry) return undefined;
  const state = hm < entry.open ? "before" : hm < entry.close || entry.close === "00:00" ? "open" : "after";
  return { open: entry.open, close: entry.close, state };
}
