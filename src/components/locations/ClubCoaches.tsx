"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import type { Person } from "@/lib/content/people";
import type { Locale } from "@/lib/i18n/config";
import { CoachCard } from "@/components/play/coaches/CoachCard";
import { CoachDialog } from "@/components/play/coaches/CoachDialog";
import type { CoachClubRef } from "@/components/play/coaches/clubs";
import type { CoachLabels } from "@/components/play/coaches/labels";

// Contentful module: clubCoaches (coach entries referencing this club; data via getCoaches(locale))
/**
 * Coaches of one club: equal-height cards (grid up to 3, swipe carousel beyond), each opens the
 * contact & offer dialog. "Book in the app" always deep-links to THIS club.
 */
export function ClubCoaches({
  coaches,
  locale,
  labels,
  clubs,
  fallbackEmail,
  appHref,
  listLabel,
  prevLabel,
  nextLabel,
}: {
  coaches: Person[];
  locale: Locale;
  labels: CoachLabels;
  clubs: Record<string, CoachClubRef>;
  fallbackEmail: string;
  /** deeplinks.club(club.id) */
  appHref: string;
  listLabel: string;
  prevLabel: string;
  nextLabel: string;
}) {
  const [active, setActive] = useState<Person | null>(null);
  const trigger = useRef<HTMLElement | null>(null);
  const track = useRef<HTMLUListElement>(null);
  const [edges, setEdges] = useState({ start: true, end: false });
  const carousel = coaches.length > 3;

  const open = useCallback((coach: Person, el: HTMLElement) => {
    trigger.current = el;
    setActive(coach);
  }, []);
  const close = useCallback(() => {
    setActive(null);
    trigger.current?.focus();
  }, []);

  const updateEdges = useCallback(() => {
    const el = track.current;
    if (!el) return;
    setEdges({ start: el.scrollLeft <= 4, end: el.scrollLeft + el.clientWidth >= el.scrollWidth - 4 });
  }, []);

  useEffect(() => {
    if (!carousel) return;
    updateEdges();
    window.addEventListener("resize", updateEdges);
    return () => window.removeEventListener("resize", updateEdges);
  }, [carousel, updateEdges]);

  const scroll = (dir: 1 | -1) => {
    const el = track.current;
    if (!el) return;
    const card = el.querySelector("li");
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    el.scrollBy({ left: dir * ((card?.clientWidth ?? 300) + 20), behavior: reduce ? "auto" : "smooth" });
  };

  const card = (c: Person) => <CoachCard coach={c} locale={locale} labels={labels} clubs={clubs} variant="compact" onOpen={open} />;

  return (
    <div>
      {carousel ? (
        <>
          {!(edges.start && edges.end) && (
            <div className="mb-4 hidden justify-end gap-2 md:flex">
              <button
                type="button"
                onClick={() => scroll(-1)}
                disabled={edges.start}
                aria-label={prevLabel}
                aria-controls="club-coach-track"
                className="grid size-11 place-items-center rounded-full border border-white/40 transition hover:border-white hover:bg-white/5 disabled:opacity-30"
              >
                <ChevronLeft className="size-5" aria-hidden />
              </button>
              <button
                type="button"
                onClick={() => scroll(1)}
                disabled={edges.end}
                aria-label={nextLabel}
                aria-controls="club-coach-track"
                className="grid size-11 place-items-center rounded-full border border-white/40 transition hover:border-white hover:bg-white/5 disabled:opacity-30"
              >
                <ChevronRight className="size-5" aria-hidden />
              </button>
            </div>
          )}
          <ul
            id="club-coach-track"
            ref={track}
            onScroll={updateEdges}
            aria-label={listLabel}
            className="-mx-4 flex snap-x snap-mandatory gap-4 overflow-x-auto scroll-px-4 px-4 pb-4 pt-1 scrollbar-none md:-mx-8 md:gap-5 md:scroll-px-8 md:px-8 lg:mx-0 lg:scroll-px-0 lg:px-0"
          >
            {coaches.map((c) => (
              <li key={c.id} className="w-[78%] shrink-0 snap-start sm:w-[46%] lg:w-[calc((100%_-_40px)/3)]">
                {card(c)}
              </li>
            ))}
          </ul>
        </>
      ) : (
        <ul aria-label={listLabel} className="grid gap-4 sm:grid-cols-2 md:gap-5 lg:grid-cols-3">
          {coaches.map((c) => (
            <li key={c.id}>{card(c)}</li>
          ))}
        </ul>
      )}

      <CoachDialog
        coach={active}
        locale={locale}
        labels={labels}
        clubs={clubs}
        fallbackEmail={fallbackEmail}
        fallbackAppHref={appHref}
        appHref={appHref}
        onClose={close}
      />
    </div>
  );
}
