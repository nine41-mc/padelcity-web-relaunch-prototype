import type { Sport } from "@/lib/data/types";

/*
 * Full court price lists per club (one booking slot = 60 minutes): by day group, off-peak/peak and court type.
 * Source of the real data is still open (tariffs in the booking system vs. maintained in Contentful) – see the
 * content model. Prototype: only clubs listed here get the "Alle Preise anzeigen" toggle.
 */

export type CourtKind = "indoor_double" | "indoor_single" | "outdoor_double" | "outdoor_single";
export type DayGroup = "weekdays" | "weekendHolidays";
/** until = off-peak up to that time, from = peak from that time, neither = all day */
export type PriceRow = { until?: string; from?: string; prices: Partial<Record<CourtKind, number>> };
export type SportPrices = { sport: Sport; columns: CourtKind[]; groups: { days: DayGroup; rows: PriceRow[] }[] };
export type PriceList = { durationMin: number; sports: SportPrices[] };

export const clubPrices: Record<string, PriceList> = {
  // PadelCity, 27.10.2026
  andernach: {
    durationMin: 60,
    sports: [
      {
        sport: "padel",
        columns: ["indoor_double", "indoor_single"],
        groups: [
          {
            days: "weekdays",
            rows: [
              { until: "16:00", prices: { indoor_double: 32, indoor_single: 22 } },
              { from: "16:00", prices: { indoor_double: 38, indoor_single: 26 } },
            ],
          },
          { days: "weekendHolidays", rows: [{ prices: { indoor_double: 38, indoor_single: 26 } }] },
        ],
      },
    ],
  },
};

/** Lowest price in a list – the "ab" price on the club page must match it. */
export function lowestPrice(list: PriceList) {
  return Math.min(...list.sports.flatMap((s) => s.groups.flatMap((g) => g.rows.flatMap((r) => Object.values(r.prices)))));
}
