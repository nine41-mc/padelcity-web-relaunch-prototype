// Contentful module: cityIndex (auto-generated from club entries, grouped by country → region)

import Link from "next/link";
import type { Club, ClubCountry } from "@/lib/data/types";
import type { Locale } from "@/lib/i18n/config";
import { localeTags } from "@/lib/i18n/config";
import { href } from "@/lib/i18n/routes";
import { COUNTRY_ORDER, locationsContent, regionLabel } from "@/lib/content/locations";
import { CountryFlag } from "./CountryFlag";

type Groups = Map<ClubCountry, Map<string, Map<string, Club[]>>>; // country → region → city → clubs

/**
 * Compact "Alle Städte" directory grouped by country, then region (Bundesland / Land / Woiwodschaft).
 * Open clubs link to their detail page; planned clubs are listed unlinked with a "bald / soon" marker.
 * Good for SEO + quick scanning.
 */
export function CityIndex({ clubs, planned = [], locale = "de" }: { clubs: Club[]; planned?: Club[]; locale?: Locale }) {
  const t = locationsContent[locale].cities;
  const countryNames = locationsContent[locale].finder.countries;
  const intl = localeTags[locale].intl;

  const groups: Groups = new Map();
  for (const c of [...clubs, ...planned]) {
    const regions = groups.get(c.country) ?? new Map<string, Map<string, Club[]>>();
    const region = c.region ? regionLabel(c.region, locale) : t.other;
    const cities = regions.get(region) ?? new Map<string, Club[]>();
    cities.set(c.city, [...(cities.get(c.city) ?? []), c]);
    regions.set(region, cities);
    groups.set(c.country, regions);
  }
  const countries = COUNTRY_ORDER.filter((cc) => groups.has(cc));

  return (
    <div className="space-y-12">
      {countries.map((country) => {
        const regions = [...(groups.get(country) ?? new Map<string, Map<string, Club[]>>()).entries()].sort(
          (a, b) => b[1].size - a[1].size || a[0].localeCompare(b[0], intl),
        );
        return (
          <section key={country} aria-labelledby={`cities-${country}`}>
            <h3 id={`cities-${country}`} className="mb-6 flex items-center gap-3 font-display text-2xl italic uppercase">
              <CountryFlag country={country} className="size-6" />
              {countryNames[country]}
            </h3>
            <div className="columns-1 gap-8 md:columns-2 lg:columns-4">
              {regions.map(([region, cities]) => (
                <section key={region} className="mb-8 break-inside-avoid">
                  <h4 className="mb-3 border-b border-white/10 pb-2 text-[13px] font-semibold uppercase tracking-[0.14em] text-white/70">{region}</h4>
                  <ul className="space-y-1">
                    {[...cities.entries()]
                      .sort((a, b) => a[0].localeCompare(b[0], intl))
                      .flatMap(([city, list]) =>
                        list.map((club) => {
                          const label = (
                            <span>
                              <span className="font-medium">{city}</span>
                              {list.length > 1 && (
                                <span className="text-white/70"> · {club.name.replace(/^PadelCity\s*/, "").replace(city, "").trim() || club.name}</span>
                              )}
                            </span>
                          );
                          return club.status === "planned" ? (
                            <li key={club.id} className="flex min-h-11 items-center justify-between gap-3 py-1.5 text-white/70">
                              {label}
                              <span className="rounded-full border border-white/20 px-2 py-0.5 text-[13px] font-semibold uppercase tracking-wide text-white/70">{t.soon}</span>
                            </li>
                          ) : (
                            <li key={club.id}>
                              <Link href={href(locale, "locations", club.slug)} className="group flex min-h-11 items-center justify-between gap-3 py-1.5 text-white/85 hover:text-white">
                                {label}
                                <span className="text-sm text-white/70 transition-colors group-hover:text-white">
                                  {club.courts.length > 0 ? `${club.courts.length} ${t.courts} →` : "→"}
                                </span>
                              </Link>
                            </li>
                          );
                        }),
                      )}
                  </ul>
                </section>
              ))}
            </div>
          </section>
        );
      })}
    </div>
  );
}
