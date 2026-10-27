"use client";

// Contentful module: clubPricing ("Preise & Courts": clubPriceList per club + courts per sport, one sport filter)
import { useLayoutEffect, useRef, useState } from "react";
import type { Club, PriceKind, PricePeriod, Sport } from "@/lib/data/types";
import { SPORTS } from "@/lib/data/types";
import type { Locale } from "@/lib/i18n/config";
import { localeTags } from "@/lib/i18n/config";
import { getDictionary } from "@/lib/i18n/dictionaries";
import { fill, locationsContent } from "@/lib/content/locations";
import { formatPrice } from "@/lib/format";
import { AppIcon } from "@/components/ui/Icon";
import { cn } from "@/components/ui/cn";
import { sheetChip } from "./FilterSheet";

const card = "rounded-[20px] border border-white/10 bg-ink-700 pad-card";
const label = "flex items-center gap-2 text-[13px] font-semibold uppercase tracking-[0.14em] text-white/70";
const bySportOrder = (a: Sport, b: Sport) => SPORTS.indexOf(a) - SPORTS.indexOf(b);

/** Sport chips as in the club finder filter (icon + name, one active) – only shown when the club offers more than one. */
function SportFilter({ sports, value, onChange, locale, aria }: { sports: Sport[]; value: Sport; onChange: (s: Sport) => void; locale: Locale; aria: string }) {
  const names = getDictionary(locale).sports;
  if (sports.length < 2) return null;
  return (
    <div role="group" aria-label={aria} className="mb-4 flex flex-wrap gap-2">
      {sports.map((s) => (
        <button key={s} type="button" aria-pressed={s === value} onClick={() => onChange(s)} className={cn(sheetChip(s === value), s !== value && "hover:border-white")}>
          <AppIcon name={s} className="size-4" />
          {names[s]}
        </button>
      ))}
    </div>
  );
}

const KINDS: PriceKind[] = ["indoorDouble", "indoorSingle", "indoorPremium", "outdoorDouble", "outdoorSingle", "outdoorPremium"];

/**
 * "Preise & Courts": one sport filter for both the price list and the courts of that sport, in one card.
 * Sports = those with a price list or courts, in the fixed sport order.
 */
export function ClubPricesCourts({ club, locale }: { club: Club; locale: Locale }) {
  const t = locationsContent[locale].club;
  const courtGroups = courtsBySport(club, locale);
  const sports = [...new Set([...(Object.keys(club.priceList?.sports ?? {}) as Sport[]), ...courtGroups.map((g) => g.sport)])].sort(bySportOrder);
  const [sport, setSport] = useState<Sport>(sports[0] ?? "padel");
  const courts = courtGroups.find((g) => g.sport === sport);
  const courtCount = club.courts.filter((c) => (c.sport ?? "padel") === sport).length;

  return (
    <div>
      <SportFilter sports={sports} value={sport} onChange={setSport} locale={locale} aria={t.priceList.sport} />
      <div className={card}>
        <PriceList club={club} locale={locale} sport={sport} />
        {courts && (
          <div className="mt-6 border-t border-white/10 pt-6">
            <p className={label}>
              {t.courtsLabel} ({courtCount})
            </p>
            {/* Pills hug their label (no stretched grid cells with empty space on the right) */}
            <ul className="mt-4 flex flex-wrap gap-3" aria-label={t.courtsLabel}>
              {courts.lines.map((l) => (
                <li key={l.key} className="flex items-center gap-3 rounded-2xl border border-white/10 bg-ink-800/60 py-4 pl-4 pr-5">
                  <AppIcon name={`${l.courtType}_court`} className="size-6 shrink-0 text-white" />
                  <span className="font-medium leading-tight">{l.label}</span>
                </li>
              ))}
            </ul>
          </div>
        )}
      </div>
    </div>
  );
}

/**
 * Prices of the list in force for one sport: day groups (consecutive days with the same periods; holidays join
 * Sunday when identical), off-peak/peak rows, one column per court type. The "ab" price is the lowest of that sport.
 * Without a price list only the club's default price is known – it is the padel price.
 */
function PriceList({ club, locale, sport }: { club: Club; locale: Locale; sport: Sport }) {
  const t = locationsContent[locale].club;
  const list = club.priceList;
  const priceSports = (Object.keys(list?.sports ?? {}) as Sport[]).sort(bySportOrder);
  const days = list?.sports[sport];
  const hasTable = !!days;
  const all = days?.flat().flatMap((p) => Object.values(p.prices)) ?? [];
  const from = all.length ? Math.min(...all) : !list && sport === "padel" ? club.defaultPricePerHour : undefined;
  const columnsOf = (s: Sport) => KINDS.filter((k) => list?.sports[s]?.some((d) => d.some((p) => p.prices[k] !== undefined)));
  const columns = columnsOf(sport);
  // a single price column sits next to the times instead of at the far right
  const alignOf = (cols: PriceKind[]) => (cols.length === 1 ? "text-left" : "text-right");
  const align = alignOf(columns);
  // the header row takes the height of the tallest sport header (e.g. "Indoor Center Court" on three lines),
  // so the rows below do not jump when switching sports – measured from hidden copies, refreshed on resize
  const measureRef = useRef<HTMLDivElement>(null);
  const [headHeight, setHeadHeight] = useState<number>();
  useLayoutEffect(() => {
    const box = measureRef.current;
    if (!box) return;
    const measure = () => setHeadHeight(Math.max(...[...box.querySelectorAll("thead")].map((h) => h.getBoundingClientRect().height)));
    measure();
    const ro = new ResizeObserver(measure);
    ro.observe(box);
    return () => ro.disconnect();
  }, [list, hasTable]);
  const headRow = (s: Sport, cols: PriceKind[]) => (
    <tr className="text-[13px] uppercase tracking-[0.14em] text-white/60">
      <th scope="col" className="py-2 pr-4 font-semibold">{t.priceList.time}</th>
      {cols.map((k) => (
        <th key={k} scope="col" className={cn("py-2 pl-4 font-semibold", alignOf(cols))}>{columnLabel(k, s, cols, locale)}</th>
      ))}
    </tr>
  );
  const tableCls = "w-full min-w-[440px] table-fixed text-left";
  // fixed time column – the table must not jump when switching sports with fewer price columns
  const colgroup = (
    <colgroup>
      <col className="w-36 sm:w-44" />
    </colgroup>
  );
  const intl = localeTags[locale].intl;
  const weekday = (i: number) => new Date(2024, 0, 1 + i).toLocaleDateString(intl, { weekday: "short" }).replace(".", "");

  return (
    <>
      {from ? (
        <p className="font-display text-5xl font-extrabold italic uppercase">
          <span className="text-2xl text-white/70">{t.book.priceFrom} </span>
          {formatPrice(from, locale, club.currency)}
          <span className="text-2xl text-white/70"> {t.book.perHour}</span>
        </p>
      ) : (
        <p className="text-lg font-semibold">{t.book.priceOnRequest}</p>
      )}

      {days && (
        <div className="relative mt-6 overflow-x-auto">
          {priceSports.length > 1 && (
            <div ref={measureRef} aria-hidden className="pointer-events-none invisible absolute inset-x-0 top-0">
              {priceSports.map((s) => (
                <table key={s} className={cn(tableCls, "absolute inset-x-0 top-0")}>
                  {colgroup}
                  <thead>{headRow(s, columnsOf(s))}</thead>
                </table>
              ))}
            </div>
          )}
          <table className={tableCls}>
            <caption className="sr-only">{getDictionary(locale).sports[sport]}</caption>
            {colgroup}
            <thead style={{ height: headHeight }}>{headRow(sport, columns)}</thead>
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
                      <td key={k} className={cn("py-1.5 pl-4 font-display text-2xl font-extrabold italic tabular-nums", align)}>
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
    </>
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

/** Padel: "Indoor Double", "Indoor Single", "Indoor Center Court"; other sports: "Indoor"/"Outdoor" (type only if both exist). */
function columnLabel(k: PriceKind, sport: Sport, columns: PriceKind[], locale: Locale) {
  const t = locationsContent[locale].club;
  const loc = k.startsWith("indoor") ? "indoor" : "outdoor";
  const kind = k.endsWith("Premium") ? "premium" : k.endsWith("Single") ? "single" : "double";
  if (kind === "premium") return `${t[loc]} ${t.priceList.centerCourt}`;
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
        return { key, courtType: kind ?? "double", label: locale === "pl" ? `${n} × ${label}` : `${n} ${label}` }; // "7 Indoor Double" – the heading already says Courts
      }),
    }));
}
