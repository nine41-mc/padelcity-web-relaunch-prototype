import type { Locale } from "@/lib/i18n/config";
import { localeTags } from "@/lib/i18n/config";

/**
 * Event times are the club's wall-clock time (ISO without offset – the mock data's format). As a Date in UTC they
 * format the same on every machine – the build (CI runs in UTC) and any visitor's browser. Format with timeZone "UTC".
 * An offset or "Z" is ignored here: if the APL delivers times with one, convert them to club time in the data layer.
 */
export function eventWallClock(iso: string) {
  return new Date(`${iso.slice(0, 16)}:00Z`);
}

/**
 * ISO 8601 with the club's UTC offset (structured data wants one) – "2026-10-30T19:30" → "2026-10-30T19:30:00+01:00".
 * Our clubs are all in the Europe/Berlin zone (Warsaw shares it); times that already carry an offset stay as they are.
 */
export function eventIsoWithOffset(iso: string, timeZone = "Europe/Berlin") {
  if (/(Z|[+-]\d\d:\d\d)$/.test(iso)) return iso;
  const wall = eventWallClock(iso).getTime();
  const fmt = new Intl.DateTimeFormat("en-GB", { timeZone, year: "numeric", month: "2-digit", day: "2-digit", hour: "2-digit", minute: "2-digit", hourCycle: "h23" });
  const offsetAt = (t: number) => {
    const p = Object.fromEntries(fmt.formatToParts(t).map((x) => [x.type, Number(x.value)]));
    return Date.UTC(p.year, p.month - 1, p.day, p.hour, p.minute) - t;
  };
  const offset = offsetAt(wall - offsetAt(wall)) / 60000; // second pass gets the right side of a DST switch
  const sign = offset < 0 ? "-" : "+";
  const abs = Math.abs(offset);
  return `${iso.slice(0, 16)}:00${sign}${String(Math.floor(abs / 60)).padStart(2, "0")}:${String(abs % 60).padStart(2, "0")}`;
}

/**
 * Date badge: "03" / "DEZ", multi-day "03–05" / "DEZ", across months "30–02" / "NOV–DEZ".
 * The year only when it is not the current one.
 */
export function dateBadge(start: string, end: string | undefined, locale: Locale, now = new Date()) {
  const intl = localeTags[locale].intl;
  const month = (d: Date) => d.toLocaleDateString(intl, { month: "short" }).replace(".", "");
  const day = (d: Date) => String(d.getDate()).padStart(2, "0");
  const s = new Date(start);
  const e = end && end.slice(0, 10) !== start.slice(0, 10) ? new Date(end) : undefined;
  const sameMonth = !e || (s.getMonth() === e.getMonth() && s.getFullYear() === e.getFullYear());
  return {
    day: e ? `${day(s)}–${day(e)}` : day(s),
    month: sameMonth ? month(s) : `${month(s)}–${month(e!)}`,
    year: s.getFullYear() !== now.getFullYear() ? String(s.getFullYear()) : undefined,
  };
}
