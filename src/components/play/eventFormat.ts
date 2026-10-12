import type { Locale } from "@/lib/i18n/config";
import { localeTags } from "@/lib/i18n/config";
import { eventsContent } from "@/lib/content/events";

/**
 * DE: "14.–16. Nov. 2026" / "Fr., 14. Nov. 2026 · 12:00 Uhr"
 * EN: "14–16 Nov 2026" / "Fri 14 Nov 2026 · 12:00"
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

export function dayParts(iso: string, locale: Locale) {
  const d = new Date(iso);
  return {
    day: String(d.getDate()).padStart(2, "0"),
    month: d.toLocaleDateString(localeTags[locale].intl, { month: "short" }).replace(".", ""),
  };
}
