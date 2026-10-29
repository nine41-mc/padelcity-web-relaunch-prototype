import { getEvents } from "@/lib/data";
import { deeplinks } from "@/lib/site";
import type { Locale } from "@/lib/i18n/config";
import { eventsContent, localizeEvent } from "@/lib/content/events";
import { PageHero } from "@/components/modules/PageHero";
import { AppCta } from "@/components/modules/AppCta";
import { Section } from "@/components/ui/Section";
import { Accent, Eyebrow, Headline } from "@/components/ui/Headline";
import { Button } from "@/components/ui/Button";
import { Reveal } from "@/components/ui/Reveal";
import { HeroEventCard } from "@/components/play/HeroEventCard";
import { EventsExplorer } from "@/components/play/EventsExplorer";
import { EventInquiryTeaser } from "@/components/events/EventInquiryTeaser";

// Contentful: page "events" (modules: pageHero, featuredEvents, eventInquiryTeaser, eventList, appCta)
/** Events overview – shared by /events (de) and /en/events (en). */
export async function EventsView({ locale }: { locale: Locale }) {
  const t = eventsContent[locale];
  const events = (await getEvents({ locale })).map((e) => localizeEvent(e, locale));
  const heroEvents = events.filter((e) => e.type === "hero").sort((a, b) => a.start.localeCompare(b.start));
  const localEvents = events.filter((e) => e.type !== "hero");

  return (
    <>
      <PageHero
        eyebrow={<span lang="en">{t.hero.eyebrow}</span>}
        image={{ url: "/images/events/hero.jpg", alt: t.hero.imageAlt }}
        lead={t.hero.lead}
        actions={
          <>
            <Button href="#events" size="md" variant="primary" arrow>
              {t.hero.ctaFind}
            </Button>
            <Button href={deeplinks.events()} size="md" variant="outline" data-track="app_open_click">
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
          <Eyebrow className="mb-4">{t.highlights.eyebrow}</Eyebrow>
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
        <div className="mb-8">
          <Eyebrow className="mb-4">{t.local.eyebrow}</Eyebrow>
          <Headline size="md">{t.local.title}</Headline>
        </div>
        <EventsExplorer events={localEvents} locale={locale} labels={t.explorer} typeLabels={t.types} />
      </Section>

      <Section tone="black">
        <AppCta locale={locale} />
      </Section>
    </>
  );
}
