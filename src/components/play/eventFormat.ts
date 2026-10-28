import type { Locale } from "@/lib/i18n/config";
import { localeTags } from "@/lib/i18n/config";

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
