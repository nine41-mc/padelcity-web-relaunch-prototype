"use client";

// Contentful module: clubShowcase (selected clubs, headline)
import Link from "next/link";
import { useCallback, useEffect, useId, useRef, useState } from "react";

import type { Club } from "@/lib/data/types";
import { Media } from "../ui/Media";
import { PosterSky, PosterTitle } from "../cards/Poster";
import { courtSummary } from "../cards/ClubCard";
import { cn } from "../ui/cn";
import { OpenStatus, SportList } from "../cards/ClubMeta";
import type { Locale } from "@/lib/i18n/config";
import { href } from "@/lib/i18n/routes";
import { CarouselArrow } from "@/components/ui/CarouselArrow";
import { CardArrow } from "@/components/ui/CardArrow";

/**
 * Big, swipeable club posters – "every location as a hero moment".
 * Look taken from PadelCity's Instagram opening posts: purple grainy sky, huge city name (second line outlined).
 * Opening status top-left; courts + sports appear on hover (always visible on touch devices).
 */
export function ClubShowcase({
  clubs,
  locale,
  labels,
  action,
}: {
  clubs: Club[];
  locale: Locale;
  labels: { prev: string; next: string };
  action?: React.ReactNode;
}) {
  const ref = useRef<HTMLDivElement>(null);
  const trackId = useId();
  const [edges, setEdges] = useState({ start: true, end: false });
  const updateEdges = useCallback(() => {
    const el = ref.current;
    if (!el) return;
    setEdges({ start: el.scrollLeft <= 4, end: el.scrollLeft + el.clientWidth >= el.scrollWidth - 4 });
  }, []);
  useEffect(() => {
    updateEdges();
    window.addEventListener("resize", updateEdges);
    return () => window.removeEventListener("resize", updateEdges);
  }, [updateEdges]);
  const scroll = (dir: 1 | -1) => {
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    ref.current?.scrollBy({ left: dir * ref.current.clientWidth * 0.8, behavior: reduce ? "auto" : "smooth" });
  };
  return (
    <div className="relative">
      <div className="container-site mb-6 flex items-center gap-2 md:justify-end">
        {action && <div className="mr-auto md:mr-2">{action}</div>}
        <CarouselArrow direction="prev" label={labels.prev} onClick={() => scroll(-1)} disabled={edges.start} controls={trackId} className="hidden md:grid" />
        <CarouselArrow direction="next" label={labels.next} onClick={() => scroll(1)} disabled={edges.end} controls={trackId} className="hidden md:grid" />
      </div>
      <div
        ref={ref}
        id={trackId}
        onScroll={updateEdges}
        className="scrollbar-none flex snap-x snap-mandatory gap-4 overflow-x-auto scroll-px-4 px-4 pb-4 md:gap-6 md:scroll-px-8 md:px-8 lg:scroll-px-16 lg:px-16"
      >
        {clubs.map((club) => (
          <ClubPoster key={club.id} club={club} locale={locale} />
        ))}
      </div>
    </div>
  );
}

/* ---------- Poster tile ---------- */

/** Poster tile; `fill` = full width of a grid cell (e.g. franchise clubs) instead of the carousel width. */
export function ClubPoster({ club, locale, fill = false }: { club: Club; locale: Locale; fill?: boolean }) {
  return (
    <Link
      href={href(locale, "locations", club.slug)}
      className={cn(
        "theme-dark group relative block overflow-hidden rounded-[28px] bg-ink-700 [container-type:inline-size]",
        fill ? "aspect-[4/5] w-full" : "aspect-[3/4] w-[78vw] shrink-0 snap-start md:w-[42vw] lg:aspect-[4/5] lg:w-[30vw] xl:w-[420px]",
      )}
    >
      <h3 className="sr-only">{club.fullName ?? club.name}</h3>
      <Media
        src={club.mainImage?.url}
        alt=""
        className="absolute inset-0"
        imgClassName="transition-transform duration-[1.2s] ease-out group-hover:scale-110"
        sizes="(min-width:1200px) 420px, (min-width:768px) 42vw, 78vw"
      />
      {/* Purple sky + grain (top), darkening for the stats (bottom) */}
      <PosterSky />

      {/* Opening status (PadelCity pink) where the Instagram posts carry their chip */}
      <span className="absolute left-4 top-4 rounded-full bg-black/55 px-3 py-1.5 backdrop-blur">
        <OpenStatus club={club} locale={locale} />
      </span>

      {/* City name: huge Poppins Bold, last line outlined; location below */}
      <PosterTitle club={club} className="top-[12%]" />

      {/* Courts + sports: revealed on hover/focus; always visible on touch devices (no hover) */}
      <div className="absolute inset-x-5 bottom-5 pr-14 transition-all duration-300 [@media(hover:hover)]:translate-y-3 [@media(hover:hover)]:opacity-0 [@media(hover:hover)]:group-hover:translate-y-0 [@media(hover:hover)]:group-hover:opacity-100 [@media(hover:hover)]:group-focus-visible:translate-y-0 [@media(hover:hover)]:group-focus-visible:opacity-100">
        <p className="text-sm font-medium text-white">{courtSummary(club, locale)}</p>
        <SportList club={club} locale={locale} className="mt-1 text-white/80" />
      </div>
      <CardArrow tone="photo" className="absolute bottom-5 right-5" />
    </Link>
  );
}
