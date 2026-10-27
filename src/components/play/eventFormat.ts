import type { Locale } from "@/lib/i18n/config";
import { localeTags } from "@/lib/i18n/config";
import { eventsContent } from "@/lib/content/events";

/**
 * DE: "14.–16. Nov. 2026" / "Fr., 14. Nov. 2026 · 12:00 Uhr"
 * EN: "14–16 Nov 2026" / "Fri 14 Nov 2026 · 12:00"
 * PL: "14–16 lis 2026" / "pt., 14 lis 2026 · 12:00" (pl-PL, no dot after the day)
 * ISO strings are local times (no TZ).
 */
export function formatDateRange(start: string, end: string | undefined, locale: Locale) {
  const intl = localeTags[locale].intl;
  const s = new Date(start);
  if (!end || end.slice(0, 10) === start.slice(0, 10)) {
    const suffix = eventsContent[locale].date.time;
    const day = s.toLocaleDateString(intl, { weekday: "short", day: "numeric", month: "short", year: "numeric" });
    return `${day} · ${start.slice(11, 16)}${suffix ? ` ${suffix}` : ""}`;
  }
  const e = new Date(end);
  const sameMonth = s.getMonth() === e.getMonth() && s.getFullYear() === e.getFullYear();
  const right = e.toLocaleDateString(intl, { day: "numeric", month: "short", year: "numeric" });
  if (sameMonth) return `${s.getDate()}${locale === "de" ? "." : ""}–${right}`;
  return `${s.toLocaleDateString(intl, { day: "numeric", month: "short" })} – ${right}`;
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
