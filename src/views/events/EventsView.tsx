import { getEvents } from "@/lib/data";
import { deeplinks } from "@/lib/site";
import type { Locale } from "@/lib/i18n/config";
import { eventFormats, eventsContent, localizeEvent } from "@/lib/content/events";
import { PageHero } from "@/components/modules/PageHero";
import { AppCta } from "@/components/modules/AppCta";
import { Section } from "@/components/ui/Section";
import { Accent, Headline } from "@/components/ui/Headline";
import { Button } from "@/components/ui/Button";
import { Reveal } from "@/components/ui/Reveal";
import { HeroEventCard } from "@/components/play/HeroEventCard";
import { EventsExplorer } from "@/components/play/EventsExplorer";
import { EventInquiryTeaser } from "@/components/events/EventInquiryTeaser";

// Contentful: page "events" (modules: pageHero, featuredEvents, eventInquiryTeaser, eventList incl. formats, appCta)
/** Events overview – shared by /events (de) and /en/events (en). */
export async function EventsView({ locale }: { locale: Locale }) {
  const t = eventsContent[locale];
  const events = (await getEvents({ locale })).map((e) => localizeEvent(e, locale));
  const heroEvents = events.filter((e) => e.type === "hero").sort((a, b) => a.start.localeCompare(b.start));

  return (
    <>
      <PageHero
        image={{ url: "/images/events/hero.jpg", alt: t.hero.imageAlt }}
        lead={t.hero.lead}
        actions={
          <>
            <Button href="#events" size="md" variant="primary" arrow>
              {t.hero.ctaFind}
            </Button>
            <Button href={deeplinks.events("events-page")} size="md" variant="outline" data-track="app_open_click">
              {t.hero.ctaApp}
            </Button>
          </>
        }
      >
        {t.hero.title} <Accent>{t.hero.accent}</Accent> {t.hero.titleEnd}
      </PageHero>

      {/* Contentful module: featuredEvents */}
      <Section tone="ink" className="!pt-8 md:!pt-12">
        <div className="mb-10">
          <Headline size="md">{t.highlights.title}</Headline>
        </div>
        <div className="grid gap-5 lg:grid-cols-2 lg:gap-6">
          {heroEvents.map((e, i) => (
            <Reveal key={e.id} delay={i * 0.08}>
              <HeroEventCard event={e} locale={locale} priority={i === 0} />
            </Reveal>
          ))}
        </div>
      </Section>

      <EventInquiryTeaser locale={locale} />

      <Section tone="ink" id="events" className="scroll-mt-20">
        <div className="mb-8 max-w-3xl">
          <Headline size="md">{t.local.title}</Headline>
          <p className="mt-4 text-lg text-fg/75">{t.formats.lead}</p>
        </div>
        {/* One section for dates and formats (design feedback 04.11.): the formats filter the list */}
        <EventsExplorer events={events} locale={locale} labels={t.explorer} typeLabels={t.types} formats={eventFormats[locale]} formatLabels={t.formats} />
      </Section>

      <Section tone="black" className="!pt-0">
        <AppCta locale={locale} campaign="events-page" />
      </Section>
    </>
  );
}
