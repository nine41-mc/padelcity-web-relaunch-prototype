import { getClubs, getPlannedClubs } from "@/lib/data";
import type { Locale } from "@/lib/i18n/config";
import { locationsContent } from "@/lib/content/locations";
import { PageHero } from "@/components/modules/PageHero";
import { Section } from "@/components/ui/Section";
import { Accent, Headline, Lead } from "@/components/ui/Headline";
import { Reveal } from "@/components/ui/Reveal";
import { ClubFinder } from "@/components/locations/ClubFinder";
import { CityIndex } from "@/components/locations/CityIndex";
import { FranchiseTeaser } from "@/components/locations/FranchiseTeaser";
import { PlannedClubs } from "@/components/locations/PlannedClubs";

/** Locations overview – shared by /standorte (de) and /en/locations (en). */
export async function LocationsView({ locale }: { locale: Locale }) {
  const t = locationsContent[locale];
  const [clubs, planned] = await Promise.all([getClubs(locale), getPlannedClubs(locale)]);

  return (
    <>
      <PageHero
        image={{ url: "/images/standorte/hero.jpg", alt: t.hero.imageAlt }}
        lead={t.hero.lead}
        className="lg:min-h-0 lg:pb-28"
      >
        {t.hero.title} <Accent>{t.hero.accent}</Accent>
      </PageHero>

      <section className="relative bg-canvas pb-20 md:pb-28">
        <div className="container-site">
          <ClubFinder clubs={clubs} planned={planned} locale={locale} />
        </div>
      </section>

      {planned.length > 0 && (
        <Section tone="ink" className="border-t border-fg/5" id="coming-soon">
          <Reveal>
            <Headline size="md">
              {t.planned.title} <Accent>{t.planned.accent}</Accent>
            </Headline>
            <Lead className="mt-4 mb-10 max-w-2xl">{t.planned.lead}</Lead>
          </Reveal>
          <PlannedClubs clubs={planned} locale={locale} />
        </Section>
      )}

      <Section>
        <Reveal>
          <FranchiseTeaser locale={locale} />
        </Reveal>
      </Section>

      {/* All clubs as a compact link list – no repeat of the finder, but every club stays one link away (SEO) */}
      <Section tone="black" className="border-t border-fg/5 !py-14 md:!py-20">
        <Headline size="sm" className="mb-8">
          {t.cities.title}
        </Headline>
        <CityIndex clubs={clubs} locale={locale} />
      </Section>
    </>
  );
}
