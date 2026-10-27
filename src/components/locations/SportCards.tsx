"use client";

// Contentful modules: clubPricing (clubPriceList per club) and courtOverview (courts per sport)
import { useState } from "react";
import { Euro, LayoutGrid } from "lucide-react";
import type { Club, PriceKind, PricePeriod, Sport } from "@/lib/data/types";
import { SPORTS } from "@/lib/data/types";
import type { Locale } from "@/lib/i18n/config";
import { localeTags } from "@/lib/i18n/config";
import { getDictionary } from "@/lib/i18n/dictionaries";
import { fill, locationsContent } from "@/lib/content/locations";
import { formatPrice } from "@/lib/format";
import { AppIcon } from "@/components/ui/Icon";
import { cn } from "@/components/ui/cn";

const card = "rounded-[20px] border border-white/10 bg-ink-700 p-5 md:p-6";
const label = "flex items-center gap-2 text-[13px] font-semibold uppercase tracking-[0.14em] text-white/70";
const bySportOrder = (a: Sport, b: Sport) => SPORTS.indexOf(a) - SPORTS.indexOf(b);

/** Pill group to switch the sport – only shown when the club offers more than one. */
function SportFilter({ sports, value, onChange, locale, aria }: { sports: Sport[]; value: Sport; onChange: (s: Sport) => void; locale: Locale; aria: string }) {
  const names = getDictionary(locale).sports;
  if (sports.length < 2) return null;
  return (
    <div role="group" aria-label={aria} className="flex flex-wrap gap-1 rounded-[22px] border border-white/15 bg-white/[0.03] p-1 sm:w-fit sm:rounded-full">
      {sports.map((s) => (
        <button
          key={s}
          type="button"
          aria-pressed={s === value}
          onClick={() => onChange(s)}
          className={cn("flex min-h-10 items-center rounded-full px-4 text-sm font-medium transition-colors", s === value ? "bg-brand-gradient text-white" : "text-white/75 hover:text-white")}
        >
          {names[s]}
        </button>
      ))}
    </div>
  );
}

const KINDS: PriceKind[] = ["indoorDouble", "indoorSingle", "indoorPremium", "outdoorDouble", "outdoorSingle", "outdoorPremium"];

/**
 * Prices of the list in force for one sport: day groups (consecutive days with the same periods; holidays join
 * Sunday when identical), off-peak/peak rows, one column per court type. The "ab" price is the lowest of that sport.
 */
export function ClubPriceCard({ club, locale }: { club: Club; locale: Locale }) {
  const t = locationsContent[locale].club;
  const list = club.priceList;
  const sports = (Object.keys(list?.sports ?? {}) as Sport[]).sort(bySportOrder);
  const [sport, setSport] = useState<Sport | undefined>(sports[0]);
  const days = sport ? list?.sports[sport] : undefined;
  const all = days?.flat().flatMap((p) => Object.values(p.prices)) ?? [];
  const from = all.length ? Math.min(...all) : club.defaultPricePerHour;
  const columns = KINDS.filter((k) => days?.some((d) => d.some((p) => p.prices[k] !== undefined)));
  const intl = localeTags[locale].intl;
  const weekday = (i: number) => new Date(2024, 0, 1 + i).toLocaleDateString(intl, { weekday: "short" }).replace(".", "");

  return (
    <div className={card}>
      <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
        <div>
          <p className={label}>
            <Euro className="size-4" aria-hidden /> {t.book.perCourt}
          </p>
          {from ? (
            <p className="mt-2 font-display text-5xl font-extrabold italic uppercase">
              <span className="text-2xl text-white/70">{t.book.priceFrom} </span>
              {formatPrice(from, locale, club.currency)}
              <span className="text-2xl text-white/70"> {t.book.perHour}</span>
            </p>
          ) : (
            <p className="mt-2 text-lg font-semibold">{t.book.priceOnRequest}</p>
          )}
        </div>
        {sport && <SportFilter sports={sports} value={sport} onChange={setSport} locale={locale} aria={t.priceList.sport} />}
      </div>

      {days && (
        <div className="mt-6 overflow-x-auto">
          <table className="w-full min-w-[440px] text-left">
            <caption className="sr-only">{getDictionary(locale).sports[sport!]}</caption>
            <thead>
              <tr className="text-[13px] uppercase tracking-[0.14em] text-white/60">
                <th scope="col" className="py-2 pr-4 font-semibold">{t.priceList.time}</th>
                {columns.map((k) => (
                  <th key={k} scope="col" className="py-2 pl-4 text-right font-semibold">{columnLabel(k, sport!, columns, locale)}</th>
                ))}
              </tr>
            </thead>
            {dayGroups(days).map((g) => (
              <tbody key={g.days.join()} className="border-t border-white/10">
                <tr>
                  <th scope="rowgroup" colSpan={columns.length + 1} className="pb-1 pt-3 font-semibold">
                    {groupLabel(g.days, g.holiday, weekday, t.sections.holidays)}
                  </th>
                </tr>
                {g.periods.map((p, i) => (
                  <tr key={`${p.from}-${p.until}`}>
                    <th scope="row" className="py-1.5 pr-4 font-normal text-white/70">
                      {periodLabel(g.periods, i, t.priceList)}
                      <span className="block whitespace-nowrap text-sm text-white/50">{p.from} – {p.until}</span>
                    </th>
                    {columns.map((k) => (
                      <td key={k} className="py-1.5 pl-4 text-right font-display text-2xl font-extrabold italic tabular-nums">
                        {p.prices[k] !== undefined ? formatPrice(p.prices[k]!, locale, club.currency) : "–"}
                      </td>
                    ))}
                  </tr>
                ))}
              </tbody>
            ))}
          </table>
          <p className="mt-4 text-sm text-white/60">{fill(t.priceList.note, { date: new Date(list!.validFrom).toLocaleDateString(intl, { day: "numeric", month: "long", year: "numeric" }) })}</p>
        </div>
      )}
    </div>
  );
}

/** Consecutive weekdays with identical periods form a group; holidays join the group that contains Sunday if identical. */
function dayGroups(days: PricePeriod[][]) {
  const key = (p: PricePeriod[]) => JSON.stringify(p);
  const groups: { days: number[]; periods: PricePeriod[]; holiday: boolean }[] = [];
  for (let i = 0; i < 7; i++) {
    if (!days[i]?.length) continue;
    const last = groups[groups.length - 1];
    if (last && last.days[last.days.length - 1] === i - 1 && key(last.periods) === key(days[i])) last.days.push(i);
    else groups.push({ days: [i], periods: days[i], holiday: false });
  }
  const holiday = days[7];
  if (holiday?.length) {
    const sunday = groups.find((g) => g.days.includes(6) && key(g.periods) === key(holiday));
    if (sunday) sunday.holiday = true;
    else groups.push({ days: [], periods: holiday, holiday: true });
  }
  return groups;
}

/** "Mo – Fr", "Sa & So", "Sa, So & Feiertage", "Feiertage". */
function groupLabel(days: number[], holiday: boolean, weekday: (i: number) => string, holidays: string) {
  const names = days.length >= 3 ? [`${weekday(days[0])} – ${weekday(days[days.length - 1])}`] : days.map(weekday);
  if (holiday) names.push(holidays);
  return names.length > 1 ? `${names.slice(0, -1).join(", ")} & ${names[names.length - 1]}` : names[0];
}

/** Several periods: the most expensive is peak, the others off-peak; a single period runs all day. */
function periodLabel(periods: PricePeriod[], i: number, t: { offPeak: string; peak: string; allDay: string }) {
  if (periods.length < 2) return t.allDay;
  const top = (p: PricePeriod) => Math.max(...Object.values(p.prices));
  const max = Math.max(...periods.map(top));
  return top(periods[i]) === max ? t.peak : t.offPeak;
}

/** Padel: "Indoor Double", "Indoor Single", "Indoor Panorama"; other sports: "Indoor"/"Outdoor" (type only if both exist). */
function columnLabel(k: PriceKind, sport: Sport, columns: PriceKind[], locale: Locale) {
  const t = locationsContent[locale].club;
  const loc = k.startsWith("indoor") ? "indoor" : "outdoor";
  const kind = k.endsWith("Premium") ? "premium" : k.endsWith("Single") ? "single" : "double";
  if (kind === "premium") return `${t[loc]} ${t.priceList.panorama}`;
  const sameLoc = columns.filter((c) => c.startsWith(loc) && !c.endsWith("Premium"));
  return sport === "padel" || sameLoc.length > 1 ? `${t[loc]} ${t[kind]}` : t[loc];
}

/** Courts per sport ("Padel: 6 Indoor Double Courts …") in the same sport order as the price card. */
export function courtsBySport(club: Pick<Club, "courts">, locale: Locale) {
  const t = locationsContent[locale].club;
  const bySport = new Map<Sport, Map<string, number>>();
  for (const c of club.courts) {
    const sport = c.sport ?? "padel";
    const key = sport === "padel" ? `${c.locationType}|${c.courtType}` : c.locationType;
    const groups = bySport.get(sport) ?? new Map<string, number>();
    groups.set(key, (groups.get(key) ?? 0) + 1);
    bySport.set(sport, groups);
  }
  return [...bySport.entries()]
    .sort(([a], [b]) => bySportOrder(a, b))
    .map(([sport, groups]) => ({
      sport,
      lines: [...groups.entries()].map(([key, n]) => {
        const [loc, kind] = key.split("|") as ["indoor" | "outdoor", "double" | "single" | undefined];
        const label = kind ? `${t[loc]} ${t[kind]}` : t[loc];
        return { key, courtType: kind ?? "double", label: locale === "pl" ? `${n} × ${t.court} ${label}` : `${n} ${label} ${n > 1 ? t.courtsPlural : t.court}` };
      }),
    }));
}

/** "Sportarten & Courts": one card, the court types of the selected sport. */
export function ClubCourtsCard({ club, locale }: { club: Club; locale: Locale }) {
  const t = locationsContent[locale].club;
  const groups = courtsBySport(club, locale);
  const [sport, setSport] = useState<Sport | undefined>(groups[0]?.sport);
  const current = groups.find((g) => g.sport === sport);
  const premium = club.courts.filter((c) => (c.sport ?? "padel") === sport && c.isPremium).length;
  if (!current) return null;
  return (
    <div className={card}>
      <SportFilter sports={groups.map((g) => g.sport)} value={current.sport} onChange={setSport} locale={locale} aria={t.priceList.sport} />
      <p className={cn(label, "mt-6")}>
        <LayoutGrid className="size-4" aria-hidden /> {getDictionary(locale).sports[current.sport]}
      </p>
      <ul className="mt-4 grid gap-3 sm:grid-cols-2 lg:grid-cols-4" aria-label={t.courtsLabel}>
        {current.lines.map((l) => (
          <li key={l.key} className="flex items-center gap-3 rounded-2xl border border-white/10 bg-ink-800/60 p-4">
            <AppIcon name={`${l.courtType}_court`} className="size-6 shrink-0 text-white" />
            <span className="font-medium leading-tight">{l.label}</span>
          </li>
        ))}
        {premium > 0 && (
          <li className="flex items-center gap-3 rounded-2xl border border-white/10 bg-ink-800/60 p-4">
            <span className="grid size-6 shrink-0 place-items-center rounded-full bg-brand-gradient text-[11px] font-bold" aria-hidden>
              ★
            </span>
            <span className="font-medium">
              {premium}× {t.panorama}
            </span>
          </li>
        )}
      </ul>
    </div>
  );
}
