"use client";

import { useEffect, useId, useState } from "react";
import { ChevronDown, Clock } from "lucide-react";
import type { Club } from "@/lib/data/types";
import type { Locale } from "@/lib/i18n/config";
import { localeTags } from "@/lib/i18n/config";
import { getDictionary } from "@/lib/i18n/dictionaries";
import { locationsContent } from "@/lib/content/locations";
import { cn } from "@/components/ui/cn";
import { HOLIDAY_LABEL } from "@/lib/data/mappers";
import { openStatusText, todayIndex, weekHours } from "./geo";

/**
 * Opening hours as on Google, under the club name: one status line ("Geöffnet bis 23:00") that unfolds into
 * every weekday on its own line, Monday first, today highlighted.
 * Public holidays: "Sonntag & Feiertage" when they match Sunday, otherwise an extra line.
 * "Today" and the status are set in the browser so they stay right on a static build.
 */
export function ClubHours({ club, locale, className }: { club: Club; locale: Locale; className?: string }) {
  const t = locationsContent[locale].club.sections;
  const status = getDictionary(locale).clubCard;
  const listId = useId();
  const [open, setOpen] = useState(false);
  const week = weekHours(club.openingHours);
  const [today, setToday] = useState<number | null>(null);
  const [text, setText] = useState<string | null>(null);
  useEffect(() => {
    setToday(todayIndex());
    setText(openStatusText(club.openingHours, status, localeTags[locale].intl));
  }, [club.openingHours, status, locale]);
  // 1 Jan 2024 was a Monday → weekday names in the page language
  const day = (i: number) => new Date(2024, 0, 1 + i).toLocaleDateString(localeTags[locale].intl, { weekday: "long" });
  const holiday = club.openingHours.find((h) => h.label === HOLIDAY_LABEL);
  const sunday = week[6];
  const holidayLikeSunday = !!holiday && !!sunday && holiday.open === sunday.open && holiday.close === sunday.close;
  const rows = week.map((h, i) => ({ key: String(i), today: today === i, label: i === 6 && holidayLikeSunday ? `${day(6)} & ${t.holidays}` : day(i), hours: h }));
  if (holiday && !holidayLikeSunday) rows.push({ key: "holiday", today: false, label: t.holidays, hours: { open: holiday.open, close: holiday.close } });
  if (!club.openingHours.length) return null;

  return (
    <div className={className}>
      <button
        type="button"
        onClick={() => setOpen((o) => !o)}
        aria-expanded={open}
        aria-controls={listId}
        className="inline-flex min-h-11 items-center gap-2 font-semibold text-accent-fg transition-colors hover:text-fg"
      >
        <Clock className="size-5 shrink-0" aria-hidden />
        <span className="sr-only">{t.hours}: </span>
        {/* Reserve the line before hydration so nothing jumps */}
        <span>{text ?? " "}</span>
        <ChevronDown className={cn("size-5 shrink-0 text-fg/70 transition-transform", open && "rotate-180")} aria-hidden />
      </button>
      <dl id={listId} hidden={!open} className="mt-2 max-w-sm pl-7">
        {rows.map((r) => (
          <div key={r.key} className={cn("flex justify-between gap-6 py-1.5", r.today && "font-semibold")}>
            <dt className={r.today ? "text-fg" : "text-fg/70"}>{r.label}</dt>
            <dd className={cn("tabular-nums", r.hours ? "text-fg" : "text-fg/60")}>{r.hours ? `${r.hours.open} – ${r.hours.close}` : t.closed}</dd>
          </div>
        ))}
      </dl>
    </div>
  );
}
