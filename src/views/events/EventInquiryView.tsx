import { getClubs } from "@/lib/data";
import type { Locale } from "@/lib/i18n/config";
import { eventInquiryContent } from "@/lib/content/eventInquiry";
import { PageHero } from "@/components/modules/PageHero";
import { Section } from "@/components/ui/Section";
import { Accent, Eyebrow, Headline } from "@/components/ui/Headline";
import { EventInquiryFacts } from "@/components/events/EventInquiryTeaser";
import { EventInquiryForm } from "@/components/events/EventInquiryForm";

// Contentful: page "eventInquiry" (modules: pageHero, eventInquiryForm, eventInquiryFacts)
/** Event request form – shared by /events/anfrage (de), /en/events/inquiry (en) and /pl/wydarzenia/zapytanie (pl). */
export async function EventInquiryView({ locale }: { locale: Locale }) {
  const t = eventInquiryContent[locale];
  const clubs = await getClubs(locale);
  // "München Tucherpark", but "Andernach" when the club is named after its city
  const locations = clubs.map((c) => (c.name === c.city ? c.name : `${c.city} ${c.name}`)).sort((a, b) => a.localeCompare(b, locale));

  return (
    <>
      <PageHero eyebrow={t.hero.eyebrow} image={{ url: "/images/events/hero.jpg", alt: t.hero.imageAlt }} lead={t.hero.lead}>
        {t.hero.title} <Accent>{t.hero.accent}</Accent>
      </PageHero>

      <Section tone="black" id="anfrage" className="scroll-mt-20">
        <div className="grid gap-10 lg:grid-cols-12 lg:gap-12">
          <div className="lg:col-span-4">
            <Eyebrow className="mb-4">{t.hero.eyebrow}</Eyebrow>
            <Headline size="md">{t.intro.title}</Headline>
            <p className="mt-6 text-lg text-white/75">{t.intro.text}</p>
          </div>
          <EventInquiryForm locale={locale} t={t} locations={locations} className="lg:col-span-8" />
        </div>
      </Section>

      <Section tone="ink">
        <Headline size="sm" className="mb-8">
          {t.facts.title}
        </Headline>
        <EventInquiryFacts locale={locale} />
      </Section>
    </>
  );
}
