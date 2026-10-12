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
const SCHEMA_DAYS = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"];

/** Parses labels like "Mo – Fr", "Sa – So", "Mo" into weekday indices (0 = Mo). */
export function parseDayLabel(label: string): number[] {
  const parts = label.split(/[–-]/).map((p) => p.trim().slice(0, 2));
  const from = DAY_KEYS.indexOf(parts[0] as (typeof DAY_KEYS)[number]);
  const to = parts[1] ? DAY_KEYS.indexOf(parts[1] as (typeof DAY_KEYS)[number]) : from;
  if (from < 0 || to < 0) return [];
  const out: number[] = [];
  for (let i = from; i <= to; i++) out.push(i);
  return out;
}

const EN_DAYS: Record<string, string> = { Mo: "Mon", Di: "Tue", Mi: "Wed", Do: "Thu", Fr: "Fri", Sa: "Sat", So: "Sun" };

/** Opening-hours labels come in German ("Mo – Fr"); translates the day abbreviations for EN. */
export function dayLabel(label: string, locale: "de" | "en") {
  if (locale === "de") return label;
  return label.replace(/\b(Mo|Di|Mi|Do|Fr|Sa|So)\b/g, (d) => EN_DAYS[d] ?? d);
}

export function schemaDays(label: string) {
  return parseDayLabel(label).map((i) => SCHEMA_DAYS[i]);
}

export function googleMapsRoute(p: LatLng) {
  return `https://www.google.com/maps/dir/?api=1&destination=${p.latitude},${p.longitude}`;
}
