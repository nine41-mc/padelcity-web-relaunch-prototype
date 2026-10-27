// Contentful module: plannedClubs (club entries with status "planned" – no detail page, no booking, no price)

import { Bell, CalendarClock } from "lucide-react";
import type { Club } from "@/lib/data/types";
import type { Locale } from "@/lib/i18n/config";
import { localeTags } from "@/lib/i18n/config";
import { COUNTRY_ORDER, fill, locationsContent, regionLabel } from "@/lib/content/locations";
import { Chip } from "@/components/ui/Chip";
import { Media } from "@/components/ui/Media";
import { CountryFlag } from "./CountryFlag";

// "Notify me" uses the one newsletter signup in the footer – no separate opening newsletter
const NOTIFY_ID = "newsletter";

/** "2027-03-15" → "15. März 2027", "2027-03" → "März 2027", "2027" → "2027". */
export function formatOpeningDate(value: string, locale: Locale): string {
  const intl = localeTags[locale].intl;
  const [y, m, d] = value.split("-").map(Number);
  if (!y) return value;
  if (!m) return String(y);
  const date = new Date(Date.UTC(y, m - 1, d || 1));
  return date.toLocaleDateString(intl, d ? { day: "numeric", month: "long", year: "numeric", timeZone: "UTC" } : { month: "long", year: "numeric", timeZone: "UTC" });
}

/**
 * "Bald eröffnet / Coming soon": planned clubs in the ClubCard look (image on top, chips, hover lift/glow),
 * with a city landmark illustration instead of a venue photo. Not linked – planned clubs have no detail page.
 * Each card's "Notify me" jumps to the newsletter signup in the footer.
 * Phone: horizontal scroll-snap row; tablet 2 / desktop 3 columns.
 */
export function PlannedClubs({ clubs, locale }: { clubs: Club[]; locale: Locale }) {
  const t = locationsContent[locale].planned;
  const countries = locationsContent[locale].finder.countries;
  const intl = localeTags[locale].intl;
  const sorted = [...clubs].sort(
    (a, b) => COUNTRY_ORDER.indexOf(a.country) - COUNTRY_ORDER.indexOf(b.country) || a.name.localeCompare(b.name, intl),
  );
  return (
    <div>
      <ul
        aria-label={t.listLabel}
        data-testid="planned-clubs"
        className="-mx-4 flex snap-x snap-mandatory scroll-px-4 gap-4 overflow-x-auto px-4 pb-4 [scrollbar-width:none] md:mx-0 md:grid md:grid-cols-2 md:gap-6 md:overflow-visible md:px-0 md:pb-0 lg:grid-cols-3"
      >
        {sorted.map((club) => (
          <li key={club.id} className="w-[84%] max-w-sm shrink-0 snap-start md:w-auto md:max-w-none">
            <PlannedClubCard club={club} locale={locale} country={countries[club.country]} />
          </li>
        ))}
      </ul>
    </div>
  );
}

function PlannedClubCard({ club, locale, country }: { club: Club; locale: Locale; country: string }) {
  const t = locationsContent[locale].planned;
  return (
    <article className="group relative flex h-full flex-col overflow-hidden rounded-[20px] border border-white/10 bg-ink-700 transition-all duration-300 hover:-translate-y-1 hover:border-magenta-500/50 hover:shadow-glow">
      <div className="relative">
        <Media
          src={club.mainImage?.url}
          alt={club.mainImage?.alt ?? club.city}
          className="aspect-[16/10]"
          imgClassName="transition-transform duration-700 group-hover:scale-105"
          sizes="(min-width:1200px) 33vw, (min-width:768px) 50vw, 85vw"
        />
        {/* Chips stay top-left so the Optic Yellow ball (top-right in every illustration) remains visible. */}
        <div className="absolute inset-x-3 top-3 flex flex-wrap items-start gap-2">
          <Chip tone="gradient">{t.chip}</Chip>
          <Chip tone="dark">
            <CountryFlag country={club.country} className="size-4" />
            {country}
          </Chip>
        </div>
      </div>
      <div className="flex flex-1 flex-col gap-4 p-5">
        <div>
          <h3 className="text-lg font-semibold leading-tight">{club.name}</h3>
          {club.region && <p className="mt-1 text-sm text-white/70">{regionLabel(club.region, locale)}</p>}
        </div>
        <div className="mt-auto flex items-center justify-between gap-3 border-t border-white/10 pt-4">
          <p className="flex items-center gap-1.5 text-sm text-white/75">
            <CalendarClock className="size-4 shrink-0 text-magenta-500" aria-hidden />
            {club.openingDate ? fill(t.opening, { date: formatOpeningDate(club.openingDate, locale) }) : t.openingTbd}
          </p>
          <a
            href={`#${NOTIFY_ID}`}
            aria-label={fill(t.notifyAria, { name: club.name })}
            className="inline-flex shrink-0 items-center gap-1.5 rounded-full border border-white/45 px-3 py-1.5 text-[13px] font-semibold text-white min-h-9 transition-colors hover:border-magenta-500 hover:bg-magenta-500/15 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-magenta-500"
          >
            <Bell className="size-3.5" aria-hidden />
            {t.notifyCta}
          </a>
        </div>
      </div>
    </article>
  );
}
