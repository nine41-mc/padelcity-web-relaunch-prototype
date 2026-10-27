"use client";

import { useEffect, useState } from "react";
import type { Club } from "@/lib/data/types";
import type { Locale } from "@/lib/i18n/config";
import { localeTags } from "@/lib/i18n/config";
import { locationsContent } from "@/lib/content/locations";
import { cn } from "@/components/ui/cn";
import { HOLIDAY_LABEL } from "@/lib/data/mappers";
import { todayIndex, weekHours } from "./geo";

/**
 * Opening hours as on Google: every weekday on its own line, Monday first, today highlighted.
 * Public holidays: "Sonntag & Feiertage" when they match Sunday, otherwise an extra line.
 * "Today" is set in the browser so it stays right on a static build.
 */
export function ClubHours({ club, locale }: { club: Club; locale: Locale }) {
  const t = locationsContent[locale].club.sections;
  const week = weekHours(club.openingHours);
  const [today, setToday] = useState<number | null>(null);
  useEffect(() => setToday(todayIndex()), []);
  // 1 Jan 2024 was a Monday → weekday names in the page language
  const day = (i: number) => new Date(2024, 0, 1 + i).toLocaleDateString(localeTags[locale].intl, { weekday: "long" });
  const holiday = club.openingHours.find((h) => h.label === HOLIDAY_LABEL);
  const sunday = week[6];
  const holidayLikeSunday = !!holiday && !!sunday && holiday.open === sunday.open && holiday.close === sunday.close;
  const rows = week.map((h, i) => ({ key: String(i), today: today === i, label: i === 6 && holidayLikeSunday ? `${day(6)} & ${t.holidays}` : day(i), hours: h }));
  if (holiday && !holidayLikeSunday) rows.push({ key: "holiday", today: false, label: t.holidays, hours: { open: holiday.open, close: holiday.close } });

  return (
    <dl className="rounded-[20px] border border-white/10 bg-ink-700 p-2">
      {rows.map((r) => (
        <div key={r.key} className={cn("flex justify-between gap-4 rounded-xl px-3 py-2", r.today && "bg-white/[0.07] font-semibold")}>
          <dt className={r.today ? "text-white" : "text-white/70"}>{r.label}</dt>
          <dd className={cn("tabular-nums", r.hours ? "font-medium" : "text-white/60")}>{r.hours ? `${r.hours.open} – ${r.hours.close}` : t.closed}</dd>
        </div>
      ))}
    </dl>
  );
}
