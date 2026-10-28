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

export function schemaDays(label: string) {
  return parseDayLabel(label).map((i) => SCHEMA_DAYS[i]);
}

export function googleMapsRoute(p: LatLng) {
  return `https://www.google.com/maps/dir/?api=1&destination=${p.latitude},${p.longitude}`;
}

/** One entry per weekday (0 = Monday … 6 = Sunday) from grouped labels; undefined = closed that day. */
export function weekHours(hours: { label: string; open: string; close: string }[]) {
  const week: ({ open: string; close: string } | undefined)[] = Array(7).fill(undefined);
  for (const h of hours) {
    const days = /täglich|daily/i.test(h.label) ? [0, 1, 2, 3, 4, 5, 6] : parseDayLabel(h.label);
    for (const d of days) week[d] = { open: h.open, close: h.close };
  }
  return week;
}

/** Today's weekday (0 = Monday) in the club's time zone. */
export function todayIndex(now: Date = new Date(), timeZone = "Europe/Berlin") {
  const wd = new Intl.DateTimeFormat("en-GB", { timeZone, weekday: "short" }).format(now);
  return ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"].indexOf(wd);
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

/**
 * Opening status line as on Google: "Geöffnet bis 23:00" while open; when closed, the next opening –
 * "Geschlossen · Öffnet um 07:30" (later today) or "Geschlossen · Öffnet Mi um 07:30" (next day with hours).
 */
export function openStatusText(
  hours: { label: string; open: string; close: string }[],
  t: { openUntil: string; closedOpensToday: string; closedOpensOn: string; closed: string },
  intl: string,
  now: Date = new Date(),
): string {
  const h = todaysHours(hours, now);
  if (h?.state === "open") return t.openUntil.replace("{t}", h.close);
  if (h?.state === "before") return t.closedOpensToday.replace("{t}", h.open);
  const week = weekHours(hours);
  const today = todayIndex(now);
  for (let k = 1; k <= 7; k++) {
    const i = (today + k) % 7;
    const next = week[i];
    if (!next) continue;
    // 1 Jan 2024 was a Monday → short weekday name in the page language, without the trailing dot ("Mi")
    const day = new Date(2024, 0, 1 + i).toLocaleDateString(intl, { weekday: "short" }).replace(/\.$/, "");
    return t.closedOpensOn.replace("{d}", day).replace("{t}", next.open);
  }
  return t.closed;
}
