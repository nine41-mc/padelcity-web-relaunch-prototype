"use client";

import { plural } from "@/lib/i18n/plural";
import { useMemo, useState } from "react";
import { CalendarSearch, MapPin, RotateCcw } from "lucide-react";
import type { ClubEvent } from "@/lib/data/types";
import type { Locale } from "@/lib/i18n/config";
import { localeTags } from "@/lib/i18n/config";
import { EventCard } from "@/components/cards/EventCard";
import { Reveal } from "@/components/ui/Reveal";
import { Select } from "@/components/ui/Select";
import { cn } from "@/components/ui/cn";

type TypeFilter = "all" | "social" | "tournament" | "training";
const typeValues: TypeFilter[] = ["all", "social", "tournament", "training"];

export type EventsExplorerLabels = {
  filterLabel: string;
  typeLabel: string;
  all: string;
  cityLabel: string;
  allCities: string;
  thisWeek: string;
  one: string;
  many: string;
  inCity: string;
  emptyTitle: string;
  emptyText: string;
  reset: string;
};

// Contentful module: eventList (filters configurable; events from Contentful/mocks – no booking data)
/** Filter bar (type, city, date window "this week" on the event dates) + grid of local events. */
export function EventsExplorer({
  events,
  locale,
  labels: t,
  typeLabels,
}: {
  events: ClubEvent[];
  locale: Locale;
  labels: EventsExplorerLabels;
  typeLabels: Record<ClubEvent["type"], string>;
}) {
  const typeOptions = typeValues.map((value) => ({ value, label: value === "all" ? t.all : typeLabels[value] }));
  const [type, setType] = useState<TypeFilter>("all");
  const [city, setCity] = useState("all");
  const [thisWeek, setThisWeek] = useState(false);

  const cities = useMemo(() => Array.from(new Set(events.map((e) => e.city).filter(Boolean) as string[])).sort((a, b) => a.localeCompare(b, localeTags[locale].intl)), [events, locale]);

  const filtered = useMemo(() => {
    const now = Date.now();
    const weekEnd = now + 7 * 86_400_000;
    return events
      .filter((e) => type === "all" || e.type === type)
      .filter((e) => city === "all" || e.city === city)
      .filter((e) => {
        if (!thisWeek) return true;
        const t = new Date(e.start).getTime();
        return t >= now - 86_400_000 && t <= weekEnd;
      })
      .sort((a, b) => a.start.localeCompare(b.start));
  }, [events, type, city, thisWeek]);

  const reset = () => {
    setType("all");
    setCity("all");
    setThisWeek(false);
  };
  const dirty = type !== "all" || city !== "all" || thisWeek;

  return (
    <div>
      <div
        role="search"
        aria-label={t.filterLabel}
        className="sticky top-[76px] z-20 -mx-4 mb-8 flex flex-col gap-3 border-y border-fg/10 bg-canvas/85 px-4 py-3 backdrop-blur-md md:top-[84px] md:mx-0 md:flex-row md:items-center md:justify-between md:rounded-full md:border md:px-3 md:py-2"
      >
        <div className="-mx-4 flex gap-2 overflow-x-auto px-4 scrollbar-none md:mx-0 md:px-0" role="radiogroup" aria-label={t.typeLabel}>
          {typeOptions.map((o) => (
            <button
              key={o.value}
              type="button"
              role="radio"
              aria-checked={type === o.value}
              onClick={() => setType(o.value)}
              className={cn(
                "h-11 shrink-0 rounded-full px-5 text-sm font-medium transition-colors",
                type === o.value ? "bg-brand-gradient text-white" : "border border-fg/40 text-fg/85 hover:border-fg/70",
              )}
            >
              {o.label}
            </button>
          ))}
        </div>
        <div className="flex gap-2">
          <Select
            id="event-city"
            value={city}
            onChange={setCity}
            label={t.cityLabel}
            icon={<MapPin />}
            className="min-w-0 flex-1 md:w-56 md:flex-none"
            options={[{ value: "all", label: t.allCities }, ...cities.map((c) => ({ value: c, label: c }))]}
          />
          <button
            type="button"
            aria-pressed={thisWeek}
            onClick={() => setThisWeek((v) => !v)}
            className={cn(
              "inline-flex h-11 shrink-0 items-center gap-2 rounded-full px-4 text-sm font-medium transition-colors",
              thisWeek ? "bg-brand-gradient text-white" : "border border-fg/40 text-fg/85 hover:border-fg/70",
            )}
          >
            <CalendarSearch className="size-4" aria-hidden /> {t.thisWeek}
          </button>
        </div>
      </div>

      <p className="mb-6 text-sm text-fg/70" aria-live="polite">
        {filtered.length} {plural(locale, filtered.length, t.one, t.many)}
        {city !== "all" && ` ${t.inCity} ${city}`}
      </p>

      {filtered.length ? (
        <div className="grid gap-5 md:grid-cols-2 lg:grid-cols-3 lg:gap-6">
          {filtered.map((e, i) => (
            <Reveal key={e.id} delay={Math.min(i, 5) * 0.06} className="flex">
              <EventCard event={e} locale={locale} className="w-full" />
            </Reveal>
          ))}
        </div>
      ) : (
        <div className="flex flex-col items-center gap-4 rounded-[28px] border border-dashed border-fg/15 pad-banner text-center">
          <span className="grid size-14 place-items-center rounded-full bg-fg/5">
            <CalendarSearch className="size-6 text-fg/70" aria-hidden />
          </span>
          <p className="font-display text-3xl font-extrabold italic uppercase">{t.emptyTitle}</p>
          <p className="max-w-md text-fg/70">{t.emptyText}</p>
          {dirty && (
            <button type="button" onClick={reset} className="inline-flex min-h-11 items-center gap-2 rounded-full border border-fg/40 px-5 py-2 text-sm hover:border-fg">
              <RotateCcw className="size-4" aria-hidden /> {t.reset}
            </button>
          )}
        </div>
      )}
    </div>
  );
}
