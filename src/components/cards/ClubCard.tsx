import Link from "next/link";
import type { Club } from "@/lib/data/types";
import type { Locale } from "@/lib/i18n/config";
import { localeTags } from "@/lib/i18n/config";
import { href } from "@/lib/i18n/routes";
import { getDictionary } from "@/lib/i18n/dictionaries";
import { formatPrice } from "@/lib/format";
import { plural } from "@/lib/i18n/plural";
import { Media } from "../ui/Media";
import { OpenStatus, SportList } from "./ClubMeta";
import { PosterSky, PosterTitle } from "./Poster";
import { ArrowUpRight } from "lucide-react";
import { cn } from "../ui/cn";

export function courtSummary(club: Club, locale: Locale = "de") {
  // Tiles: total + kind ("13 Courts · Indoor & Outdoor"); the club page keeps the full breakdown
  const t = getDictionary(locale).clubCard;
  const n = club.courts.length;
  const indoor = club.courts.filter((c) => c.locationType === "indoor").length;
  const kind = indoor === 0 ? t.outdoor : indoor === n ? t.indoor : t.indoorOutdoor;
  return `${n} ${plural(locale, n, t.court, t.courts)} · ${kind}`;
}

/**
 * Club card (Elephant "Courtfinder" pattern, without availability). Image in the Instagram-poster look
 * (status, city, torn line, price); below it address, courts, sports and the arrow.
 * PadelCity principle: no booking-system data (free slots/occupancy) on the website.
 */
export function ClubCard({
  club,
  distanceKm,
  locale = "de",
  active = false,
  lift = true,
  className,
}: {
  club: Club;
  distanceKm?: number;
  locale?: Locale;
  /** Highlighted from outside (map view: the club whose pin is selected) – same look as hover. */
  active?: boolean;
  /** Hover lift; off next to the map, where the list should stay put. */
  lift?: boolean;
  className?: string;
}) {
  const t = getDictionary(locale).clubCard;
  const intl = localeTags[locale].intl;
  const url = href(locale, "locations", club.slug);
  const street = [club.address.streetName, club.address.buildingNumber].filter(Boolean).join(" ");
  const address = [street, [club.address.postalCode, club.address.localityName].filter(Boolean).join(" ")].filter(Boolean).join(", ");
  return (
    <article
      className={cn(
        "group relative flex min-w-0 flex-col overflow-hidden rounded-[20px] border bg-ink-700 transition-all duration-300 hover:border-magenta-500/50 hover:shadow-glow",
        active ? "border-magenta-500/50 shadow-glow" : "border-white/10",
        lift && "hover:-translate-y-1",
        className,
      )}
    >
      {/* Image in the poster look of the home showcase: status top-left, city + torn line, price bottom-right.
          Own compositing layer + 1px bleed: during the lift and zoom the image edge rounds to sub-pixels and let a light seam flash. */}
      <div className="relative aspect-[16/10] transform-gpu overflow-hidden [container-type:inline-size]">
        <Media
          src={club.mainImage?.url}
          alt={club.mainImage?.alt ?? club.name}
          className="absolute -inset-px"
          imgClassName="transition-transform duration-700 group-hover:scale-105"
          sizes="(min-width:1200px) 33vw, (min-width:768px) 50vw, 100vw"
        />
        <PosterSky bottom="h-2/5" />
        <span className="absolute left-3 top-3 rounded-full bg-black/55 px-3 py-1.5 backdrop-blur">
          <OpenStatus club={club} locale={locale} />
        </span>
        <PosterTitle club={club} className="top-[22%]" size={{ font: 12, spot: 5.5 }} maxOneLine={11} />
        {club.defaultPricePerHour && (
          <p className="absolute bottom-3 right-4 whitespace-nowrap font-display text-4xl font-extrabold italic uppercase leading-none text-white drop-shadow-[0_2px_8px_rgba(0,0,0,0.6)]">
            {t.from} {formatPrice(club.defaultPricePerHour, locale, club.currency)}/h
          </p>
        )}
      </div>
      <div className="flex flex-1 flex-col gap-3 p-5">
        <h3 className="sr-only">{club.name}</h3>
        <p className="truncate text-sm text-white/70">
          {address}
          {distanceKm !== undefined && ` · ${distanceKm.toLocaleString(intl, { maximumFractionDigits: 1 })} km`}
        </p>
        <div className="mt-auto flex items-end justify-between gap-4 pt-1">
          <div className="min-w-0">
            <p className="text-sm font-medium text-white">{courtSummary(club, locale)}</p>
            <SportList club={club} locale={locale} className="mt-1 text-white/70" />
          </div>
          <span className="grid size-11 shrink-0 place-items-center rounded-full bg-white/10 text-white transition-all group-hover:rotate-45 group-hover:bg-brand-gradient" aria-hidden>
            <ArrowUpRight className="size-5" />
          </span>
        </div>
      </div>
      {/* Whole card is the link */}
      <Link href={url} aria-label={club.fullName ?? club.name} className="absolute inset-0 z-10 rounded-[20px]" />
    </article>
  );
}
