"use client";

import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { ArrowRight, ChevronLeft, ChevronRight, GalleryHorizontal, LayoutGrid, MapPin, RotateCcw } from "lucide-react";
import type { Person } from "@/lib/content/people";
import type { Locale } from "@/lib/i18n/config";
import { Select } from "@/components/ui/Select";
import { cn } from "@/components/ui/cn";
import { CoachCard } from "./CoachCard";
import { CoachDialog } from "./CoachDialog";
import { coachClubKeys, fill, isHeadCoach, type CoachClubRef } from "./clubs";
import type { CoachLabels } from "./labels";

type Role = "all" | "head" | "coach";

// Contentful module: coachCarousel (references → coach entries; data via getCoaches(locale))
/**
 * Coach section body: header rule, filters (club, role), swipe carousel ⇄ full grid, contact/offer dialog.
 * Translates Elephant's "Coaches / Train like a pro" inspo into PadelCity's dark brand language.
 */
export function CoachExplorer({
  coaches,
  locale,
  labels,
  clubs,
  fallbackEmail,
  fallbackAppHref,
  heading,
}: {
  coaches: Person[];
  locale: Locale;
  labels: CoachLabels;
  clubs: Record<string, CoachClubRef>;
  fallbackEmail: string;
  fallbackAppHref: string;
  /** Section headline + intro (rendered by the view). */
  heading: React.ReactNode;
}) {
  const [club, setClub] = useState("");
  const [role, setRole] = useState<Role>("all");
  const [grid, setGrid] = useState(false);
  const [active, setActive] = useState<Person | null>(null);
  const trigger = useRef<HTMLElement | null>(null);
  const track = useRef<HTMLUListElement>(null);
  const [edges, setEdges] = useState({ start: true, end: false });

  const clubOptions = useMemo(() => {
    const keys = new Set(coaches.flatMap((c) => coachClubKeys(c.club)));
    return [...keys]
      .map((k) => clubs[k] ?? { key: k, label: k, href: "" })
      .sort((a, b) => a.label.localeCompare(b.label, locale));
  }, [coaches, clubs, locale]);

  const filtered = useMemo(
    () =>
      coaches.filter((c) => {
        if (club && !coachClubKeys(c.club).includes(club)) return false;
        if (role === "head" && !isHeadCoach(c.role)) return false;
        if (role === "coach" && isHeadCoach(c.role)) return false;
        return true;
      }),
    [coaches, club, role],
  );

  const updateEdges = useCallback(() => {
    const el = track.current;
    if (!el) return;
    setEdges({ start: el.scrollLeft <= 4, end: el.scrollLeft + el.clientWidth >= el.scrollWidth - 4 });
  }, []);

  // New result set → back to the first card.
  useEffect(() => {
    const el = track.current;
    if (!el) return;
    el.scrollTo({ left: 0 });
    updateEdges();
  }, [filtered, grid, updateEdges]);

  useEffect(() => {
    window.addEventListener("resize", updateEdges);
    return () => window.removeEventListener("resize", updateEdges);
  }, [updateEdges]);

  const scroll = (dir: 1 | -1) => {
    const el = track.current;
    if (!el) return;
    const card = el.querySelector("li");
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    el.scrollBy({ left: dir * ((card?.clientWidth ?? 300) + 20), behavior: reduce ? "auto" : "smooth" });
  };

  const open = useCallback((coach: Person, el: HTMLElement) => {
    trigger.current = el;
    setActive(coach);
  }, []);
  const close = useCallback(() => {
    setActive(null);
    trigger.current?.focus();
  }, []);

  const reset = () => {
    setClub("");
    setRole("all");
  };

  const count = filtered.length === 1 ? labels.countOne : fill(labels.countMany, { n: filtered.length });
  const carousel = !grid && filtered.length > 0;
  const overflow = carousel && !(edges.start && edges.end);

  const roles: [Role, string][] = [
    ["all", labels.roleAll],
    ["head", labels.roleHead],
    ["coach", labels.roleCoach],
  ];

  return (
    <div>
      {/* Header rule: "Coaches / Train like a Pro ——— Swipe to see all →" */}
      <div className="flex items-center gap-3 text-[13px] font-semibold uppercase tracking-[0.14em] text-white/70 md:gap-4">
        <span className="inline-flex items-center gap-2 whitespace-nowrap">
          <span className="size-1.5 rounded-full bg-neon-500 animate-pulse-dot" aria-hidden />
          Coaches
          <span className="hidden sm:inline">
            <span className="text-white/35">/</span> {labels.kicker}
          </span>
        </span>
        <span className="h-px flex-1 bg-gradient-to-r from-white/30 via-white/15 to-transparent" aria-hidden />
        {carousel && (
          <span className="hidden items-center gap-1.5 whitespace-nowrap max-lg:inline-flex" aria-hidden>
            {labels.swipeHint} <ArrowRight className="size-3.5" />
          </span>
        )}
      </div>

      <div className="mt-8 md:mt-10">{heading}</div>

      {/* Toolbar: filters · count · view toggle · arrows */}
      <div className="mt-8 flex flex-col gap-3 md:mt-10 lg:flex-row lg:items-center lg:justify-between">
        <div role="group" aria-label={labels.filterLabel} className="flex flex-col gap-3 sm:flex-row sm:items-center">
          <Select
            value={club}
            onChange={setClub}
            label={labels.clubLabel}
            icon={<MapPin />}
            className="w-full sm:w-64"
            options={[{ value: "", label: labels.allClubs }, ...clubOptions.map((o) => ({ value: o.key, label: o.label }))]}
          />

          <div role="group" aria-label={labels.roleLabel} className="flex rounded-full border border-white/15 bg-white/5 p-0.5">
            {roles.map(([key, label]) => (
              <button
                key={key}
                type="button"
                aria-pressed={role === key}
                onClick={() => setRole(key)}
                className={cn(
                  "h-11 flex-1 whitespace-nowrap rounded-full px-4 text-sm font-semibold transition sm:flex-none",
                  role === key ? "bg-white text-ink-800" : "text-white/75 hover:text-white",
                )}
              >
                {label}
              </button>
            ))}
          </div>
        </div>

        <div className="flex items-center justify-between gap-3">
          <p className="text-sm text-white/70" aria-live="polite" aria-atomic="true">
            {count}
          </p>
          <div className="flex items-center gap-2">
            <button
              type="button"
              aria-pressed={grid}
              onClick={() => setGrid((g) => !g)}
              className="inline-flex h-11 items-center gap-2 rounded-full border border-white/25 px-4 text-sm font-semibold transition hover:border-white hover:bg-white/5"
            >
              {grid ? <GalleryHorizontal className="size-4" aria-hidden /> : <LayoutGrid className="size-4" aria-hidden />}
              {grid ? labels.showCarousel : labels.showAll}
            </button>
            {overflow && (
              <div className="hidden gap-2 md:flex">
                <button
                  type="button"
                  onClick={() => scroll(-1)}
                  disabled={edges.start}
                  aria-label={labels.prev}
                  aria-controls="coach-track"
                  className="grid size-11 place-items-center rounded-full border border-white/40 transition hover:border-white hover:bg-white/5 disabled:opacity-30"
                >
                  <ChevronLeft className="size-5" aria-hidden />
                </button>
                <button
                  type="button"
                  onClick={() => scroll(1)}
                  disabled={edges.end}
                  aria-label={labels.next}
                  aria-controls="coach-track"
                  className="grid size-11 place-items-center rounded-full border border-white/40 transition hover:border-white hover:bg-white/5 disabled:opacity-30"
                >
                  <ChevronRight className="size-5" aria-hidden />
                </button>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Results */}
      <div className="mt-6 md:mt-8">
        {filtered.length === 0 ? (
          <div className="grid place-items-center gap-4 rounded-[28px] border border-dashed border-white/20 px-6 py-16 text-center">
            <p className="font-display text-3xl font-extrabold uppercase italic leading-none md:text-4xl">{labels.empty}</p>
            <button
              type="button"
              onClick={reset}
              className="inline-flex h-11 items-center gap-2 rounded-full bg-white px-5 text-sm font-semibold text-ink-800 transition hover:shadow-glow"
            >
              <RotateCcw className="size-4" aria-hidden /> {labels.reset}
            </button>
          </div>
        ) : grid ? (
          <ul aria-label={labels.listLabel} className="grid grid-cols-2 gap-3 md:grid-cols-3 md:gap-5 lg:grid-cols-4">
            {filtered.map((c) => (
              <li key={c.id}>
                <CoachCard coach={c} locale={locale} labels={labels} clubs={clubs} variant="compact" onOpen={open} />
              </li>
            ))}
          </ul>
        ) : (
          <ul
            id="coach-track"
            ref={track}
            onScroll={updateEdges}
            aria-label={labels.listLabel}
            className="-mx-4 flex snap-x snap-mandatory gap-4 overflow-x-auto scroll-px-4 px-4 pb-4 pt-1 scrollbar-none md:-mx-8 md:gap-5 md:scroll-px-8 md:px-8 lg:mx-0 lg:scroll-px-0 lg:px-0"
          >
            {filtered.map((c) => (
              <li key={c.id} className="w-[86%] shrink-0 snap-start md:w-[72%] lg:w-[calc((100%_-_20px)/2)]">
                <CoachCard coach={c} locale={locale} labels={labels} clubs={clubs} variant="feature" onOpen={open} />
              </li>
            ))}
          </ul>
        )}
      </div>

      {/* Footer rule: "Let's play Padel! ——— 19 Coaches · 16 Clubs" */}
      <div className="mt-10 flex items-center gap-4 md:mt-14">
        <p className="whitespace-nowrap font-display text-xl font-extrabold uppercase italic leading-none md:text-2xl">{labels.footer}</p>
        <span className="h-px flex-1 bg-gradient-to-r from-white/30 via-white/15 to-white/5" aria-hidden />
        <p className="hidden whitespace-nowrap text-[13px] font-semibold uppercase tracking-[0.14em] text-white/60 sm:block">
          {coaches.length === 1 ? labels.countOne : fill(labels.countMany, { n: coaches.length })} · {fill(labels.clubsCount, { n: clubOptions.length })}
        </p>
      </div>

      <CoachDialog
        coach={active}
        locale={locale}
        labels={labels}
        clubs={clubs}
        fallbackEmail={fallbackEmail}
        fallbackAppHref={fallbackAppHref}
        onClose={close}
      />
    </div>
  );
}
