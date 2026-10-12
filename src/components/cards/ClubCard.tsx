import Link from "next/link";
import type { Club } from "@/lib/data/types";
import type { Locale } from "@/lib/i18n/config";
import { localeTags } from "@/lib/i18n/config";
import { href } from "@/lib/i18n/routes";
import { getDictionary } from "@/lib/i18n/dictionaries";
import { Media } from "../ui/Media";
import { OpenStatus, SportChips } from "./ClubMeta";
import { cn } from "../ui/cn";

export function courtSummary(club: Club, locale: Locale = "de") {
  // "9 Outdoor Courts · 2 Indoor Courts" – all sports, larger group first
  const indoor = club.courts.filter((c) => c.locationType === "indoor").length;
  const outdoor = club.courts.length - indoor;
  const courts = getDictionary(locale).clubCard.courts;
  const parts = [
    { n: indoor, label: `${indoor} Indoor ${courts}` },
    { n: outdoor, label: `${outdoor} Outdoor ${courts}` },
  ].filter((p) => p.n > 0);
  return parts.sort((a, b) => b.n - a.n).map((p) => p.label).join(" · ");
}

/**
 * Club card (Elephant "Courtfinder" pattern, without availability).
 * PadelCity principle: no booking-system data (free slots/occupancy) on the website.
 */
export function ClubCard({
  club,
  distanceKm,
  locale = "de",
  className,
}: {
  club: Club;
  distanceKm?: number;
  locale?: Locale;
  className?: string;
}) {
  const t = getDictionary(locale).clubCard;
  const intl = localeTags[locale].intl;
  const url = href(locale, "locations", club.slug);
  return (
    <article
      className={cn(
        "group relative flex flex-col overflow-hidden rounded-[20px] border border-white/10 bg-ink-700 transition-all duration-300 hover:-translate-y-1 hover:border-magenta-500/50 hover:shadow-glow",
        className,
      )}
    >
      <div className="relative">
        <Media
          src={club.mainImage?.url}
          alt={club.mainImage?.alt ?? club.name}
          className="aspect-[16/10]"
          imgClassName="transition-transform duration-700 group-hover:scale-105"
          sizes="(min-width:1200px) 33vw, (min-width:768px) 50vw, 100vw"
          overlay
        />
      </div>
      <div className="flex flex-1 flex-col gap-4 p-5">
        <div className="flex items-start justify-between gap-3">
          <div>
            <h3 className="text-lg font-semibold leading-tight">
              <Link href={url} className="after:absolute after:inset-0 after:content-['']">
                {club.name}
              </Link>
            </h3>
            <p className="mt-1 text-sm text-white/70">
              {club.city}
              {distanceKm !== undefined && ` · ${distanceKm.toLocaleString(intl, { maximumFractionDigits: 1 })} km`}
            </p>
          </div>
          {club.defaultPricePerHour && (
            <p className="shrink-0 text-right text-sm text-white/70">
              {t.from} <span className="text-lg font-semibold text-white">{club.defaultPricePerHour} €</span>
            </p>
          )}
        </div>
        <div className="mt-auto space-y-3">
          <OpenStatus club={club} locale={locale} />
          <p className="text-sm font-medium text-white">{courtSummary(club, locale)}</p>
          <SportChips club={club} locale={locale} />
        </div>
      </div>
    </article>
  );
}
