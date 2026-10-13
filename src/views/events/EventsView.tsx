import { Smartphone } from "lucide-react";
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

// Contentful: page "events" (modules: pageHero, featuredEvents, eventList, appCta)
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
            <Button href="#events" size="lg" variant="primary" arrow>
              {t.hero.ctaFind}
            </Button>
            <Button href={deeplinks.events()} size="lg" variant="outline" data-track="app_open_click">
              {t.hero.ctaApp}
            </Button>
          </>
        }
      >
        {t.hero.title} <Accent>{t.hero.accent}</Accent> {t.hero.titleEnd}
      </PageHero>

      {/* Contentful module: featuredEvents */}
      <Section tone="ink" className="!pt-8 md:!pt-12">
        <div className="mb-10 flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
          <div>
            <Eyebrow className="mb-4">{t.highlights.eyebrow}</Eyebrow>
            <Headline size="md">{t.highlights.title}</Headline>
          </div>
          <p className="max-w-sm text-white/70">{t.highlights.text}</p>
        </div>
        <div className="grid gap-5 lg:grid-cols-2 lg:gap-6">
          {heroEvents.map((e, i) => (
            <Reveal key={e.id} delay={i * 0.08}>
              <HeroEventCard event={e} locale={locale} priority={i === 0} />
            </Reveal>
          ))}
        </div>
      </Section>

      <Section tone="black" id="events" className="scroll-mt-20">
        <div className="mb-8 flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
          <div>
            <Eyebrow className="mb-4">{t.local.eyebrow}</Eyebrow>
            <Headline size="md">{t.local.title}</Headline>
          </div>
          <p className="flex max-w-sm items-start gap-3 text-sm text-white/70">
            <Smartphone className="mt-0.5 size-5 shrink-0 text-white" aria-hidden />
            {t.local.note}
          </p>
        </div>
        <EventsExplorer events={localEvents} locale={locale} labels={t.explorer} typeLabels={t.types} />
      </Section>

      <Section tone="ink">
        <AppCta locale={locale} />
      </Section>
    </>
  );
}
