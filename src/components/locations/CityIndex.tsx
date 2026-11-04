// Contentful module: cityIndex (auto-generated from club entries, one line per country)

import Link from "next/link";
import type { Club } from "@/lib/data/types";
import type { Locale } from "@/lib/i18n/config";
import { localeTags } from "@/lib/i18n/config";
import { href } from "@/lib/i18n/routes";
import { COUNTRY_ORDER, locationsContent } from "@/lib/content/locations";
import { CountryFlag } from "./CountryFlag";

/**
 * Compact link list of every open club, one line per country (design feedback 04.11.2026: the full directory repeated
 * the club finder above). Keeps a crawlable link to each club page for SEO; planned clubs live in „Bald eröffnet“.
 */
export function CityIndex({ clubs, locale = "de" }: { clubs: Club[]; locale?: Locale }) {
  const countryNames = locationsContent[locale].finder.countries;
  const intl = localeTags[locale].intl;
  const countries = COUNTRY_ORDER.filter((cc) => clubs.some((c) => c.country === cc));
  // "München · Tucherpark" when a city has more than one club, otherwise just the city
  const perCity = new Map<string, number>();
  for (const c of clubs) perCity.set(c.city, (perCity.get(c.city) ?? 0) + 1);
  const label = (c: Club) => (perCity.get(c.city)! > 1 ? `${c.city} · ${c.name.replace(/^PadelCity\s*/, "").replace(c.city, "").trim() || c.name}` : c.city);

  return (
    <div className="space-y-6">
      {countries.map((country) => (
        <section key={country} aria-labelledby={`cities-${country}`} className="grid gap-3 md:grid-cols-[12rem_minmax(0,1fr)] md:gap-6">
          <h3 id={`cities-${country}`} className="flex items-center gap-2 text-sm font-semibold text-fg/70">
            <CountryFlag country={country} className="size-5" />
            {countryNames[country]}
          </h3>
          <ul className="flex flex-wrap gap-x-5 gap-y-1">
            {clubs
              .filter((c) => c.country === country)
              .sort((a, b) => label(a).localeCompare(label(b), intl))
              .map((club) => (
                <li key={club.id}>
                  <Link href={href(locale, "locations", club.slug)} className="inline-flex min-h-11 items-center text-fg/85 underline-offset-4 hover:text-fg hover:underline">
                    {label(club)}
                  </Link>
                </li>
              ))}
          </ul>
        </section>
      ))}
    </div>
  );
}
