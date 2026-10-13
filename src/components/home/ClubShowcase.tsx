"use client";

// Contentful module: clubShowcase (selected clubs, headline)
import Link from "next/link";
import { useRef } from "react";
import { ArrowLeft, ArrowRight } from "lucide-react";
import type { Club } from "@/lib/data/types";
import { Media } from "../ui/Media";
import { courtSummary } from "../cards/ClubCard";
import { OpenStatus, SportChips } from "../cards/ClubMeta";
import type { Locale } from "@/lib/i18n/config";
import { href } from "@/lib/i18n/routes";

/** Big, swipeable club cards – "every location as a hero moment". */
export function ClubShowcase({ clubs, locale, labels }: { clubs: Club[]; locale: Locale; labels: { prev: string; next: string } }) {
  const ref = useRef<HTMLDivElement>(null);
  const scroll = (dir: 1 | -1) => ref.current?.scrollBy({ left: dir * ref.current.clientWidth * 0.8, behavior: "smooth" });
  return (
    <div className="relative">
      <div className="container-site mb-6 hidden justify-end gap-2 md:flex">
        <button onClick={() => scroll(-1)} className="grid size-12 place-items-center rounded-full border border-white/40 transition hover:border-white hover:bg-white/10" aria-label={labels.prev}>
          <ArrowLeft className="size-5" />
        </button>
        <button onClick={() => scroll(1)} className="grid size-12 place-items-center rounded-full border border-white/40 transition hover:border-white hover:bg-white/10" aria-label={labels.next}>
          <ArrowRight className="size-5" />
        </button>
      </div>
      <div
        ref={ref}
        className="scrollbar-none flex snap-x snap-mandatory gap-4 overflow-x-auto scroll-px-4 px-4 pb-4 md:gap-6 md:scroll-px-8 md:px-8 lg:scroll-px-16 lg:px-16"
      >
        {clubs.map((club) => (
          <Link
            key={club.id}
            href={href(locale, "locations", club.slug)}
            className="group relative aspect-[3/4] w-[78vw] shrink-0 snap-start overflow-hidden rounded-[28px] md:w-[42vw] lg:aspect-[4/5] lg:w-[30vw] xl:w-[420px]"
          >
            <Media
              src={club.mainImage?.url}
              alt={club.mainImage?.alt ?? club.name}
              className="absolute inset-0"
              imgClassName="transition-transform duration-[1.2s] ease-out group-hover:scale-110"
              sizes="(min-width:1200px) 420px, (min-width:768px) 42vw, 78vw"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black via-black/45 to-transparent transition-opacity group-hover:from-purple-900" />
            <div className="absolute inset-x-5 bottom-5">
              <p className="truncate text-sm text-white/80">
                {club.address.streetName} {club.address.buildingNumber}, {club.address.postalCode} {club.address.localityName}
              </p>
              {/* Fixed slot (2-line title) so every tile in the strip has the same rhythm */}
              <h3 className="mt-1 line-clamp-2 min-h-[2lh] font-display text-4xl leading-none font-extrabold italic uppercase md:text-5xl">{club.name}</h3>
              <div className="mt-4 space-y-2.5">
                <OpenStatus club={club} locale={locale} />
                <p className="text-sm font-medium text-white">{courtSummary(club, locale)}</p>
                <SportChips club={club} locale={locale} />
              </div>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
}
