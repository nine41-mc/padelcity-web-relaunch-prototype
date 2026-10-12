import { getClubs, getPlannedClubs } from "@/lib/data";
import type { Locale } from "@/lib/i18n/config";
import { fill, locationsContent } from "@/lib/content/locations";
import { PageHero } from "@/components/modules/PageHero";
import { AppCta } from "@/components/modules/AppCta";
import { Section } from "@/components/ui/Section";
import { Accent, Eyebrow, Headline, Lead } from "@/components/ui/Headline";
import { Reveal } from "@/components/ui/Reveal";
import { ClubFinder } from "@/components/locations/ClubFinder";
import { CityIndex } from "@/components/locations/CityIndex";
import { FranchiseTeaser } from "@/components/locations/FranchiseTeaser";
import { PlannedClubs } from "@/components/locations/PlannedClubs";
import { keyFacts } from "@/lib/content/partners";

/** Locations overview – shared by /standorte (de) and /en/locations (en). */
export async function LocationsView({ locale }: { locale: Locale }) {
  const t = locationsContent[locale];
  const [clubs, planned] = await Promise.all([getClubs(locale), getPlannedClubs(locale)]);
  // Clubs/cities = approved public key facts (not computed); countries = derived from open clubs.
  const countryCount = new Set(clubs.map((c) => c.country)).size;

  return (
    <>
      <PageHero
        eyebrow={fill(t.hero.eyebrow, { clubs: keyFacts.clubs, cities: keyFacts.cities, countries: countryCount })}
        image={{ url: "/images/standorte/hero.jpg", alt: t.hero.imageAlt }}
        lead={t.hero.lead}
        className="lg:min-h-0 lg:pb-28"
      >
        {t.hero.title} <Accent>{t.hero.accent}</Accent>
      </PageHero>

      <section className="relative bg-ink-800 pb-20 md:pb-28">
        <div className="container-site">
          <ClubFinder clubs={clubs} planned={planned} locale={locale} />
        </div>
      </section>

      {planned.length > 0 && (
        <Section tone="ink" className="border-t border-white/5" id="coming-soon">
          <Reveal>
            <Eyebrow>{t.planned.eyebrow}</Eyebrow>
            <Headline size="md" className="mt-5">
              {t.planned.title} <Accent>{t.planned.accent}</Accent>
            </Headline>
            <Lead className="mt-4 mb-10 max-w-2xl">{t.planned.lead}</Lead>
          </Reveal>
          <PlannedClubs clubs={planned} locale={locale} />
        </Section>
      )}

      <Section tone="black" className="border-t border-white/5">
        <Reveal>
          <Eyebrow dot={false}>{t.cities.eyebrow}</Eyebrow>
          <Headline size="md" className="mt-5 mb-12">
            {t.cities.title}
          </Headline>
        </Reveal>
        <CityIndex clubs={clubs} planned={planned} locale={locale} />
      </Section>

      <Section className="!pb-10 md:!pb-14">
        <Reveal>
          <FranchiseTeaser locale={locale} />
        </Reveal>
      </Section>

      <Section className="!pt-0">
        <AppCta locale={locale} showStores={false} />
      </Section>
    </>
  );
}
