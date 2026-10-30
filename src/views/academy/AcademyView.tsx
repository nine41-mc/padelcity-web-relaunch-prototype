import { ArrowUpRight } from "lucide-react";
import { getClubs, getCoaches } from "@/lib/data";
import { deeplinks, site } from "@/lib/site";
import type { Locale } from "@/lib/i18n/config";
import { href } from "@/lib/i18n/routes";
import { academyContent } from "@/lib/content/academy";
import { PageHero } from "@/components/modules/PageHero";
import { AppCta } from "@/components/modules/AppCta";
import { Section } from "@/components/ui/Section";
import { Accent, Eyebrow, Headline } from "@/components/ui/Headline";
import { Button } from "@/components/ui/Button";
import { Chip } from "@/components/ui/Chip";
import { Media } from "@/components/ui/Media";
import { Reveal } from "@/components/ui/Reveal";
import { ClubCard } from "@/components/cards/ClubCard";
import { CollegiateBadge, VarsityText } from "@/components/play/Collegiate";
import { LevelPath } from "@/components/play/LevelPath";
import { PriceList } from "@/components/play/PriceList";
import { CoachExplorer } from "@/components/play/coaches/CoachExplorer";
import { resolveCoachClubsFor } from "@/components/play/coaches/resolve";
import { LiteYouTube } from "@/components/play/LiteYouTube";
import { Faq } from "@/components/play/Faq";
import { cn } from "@/components/ui/cn";

// Contentful: page "academy" (modules: pageHero, levelPath, programmeGrid, coachCarousel, academyLocations, videoTeaserGrid, faq, appCta)
/** Academy page – shared by /academy (de), /en/academy (en) and /pl/akademia (pl). */
export async function AcademyView({ locale }: { locale: Locale }) {
  const t = academyContent[locale];
  const allClubs = await getClubs(locale);
  const clubs = allClubs.slice(0, 6);
  // Contentful → people.ts fallback; Head Coaches first.
  const academyCoaches = await getCoaches(locale);
  const coachClubs = resolveCoachClubsFor(
    academyCoaches,
    locale === "de" ? allClubs : await getClubs("de"),
    allClubs,
    locale,
  );

  return (
    <>
      <div className="relative">
        <PageHero
          eyebrow={t.hero.eyebrow}
          image={{ url: "/images/academy/hero.jpg", alt: t.hero.imageAlt }}
          lead={t.hero.lead}
          actions={
            <>
              <Button href={deeplinks.events("academy-page")} size="md" variant="gradient" data-track="academy_signup_click">
                {t.hero.ctaApp}
              </Button>
              <Button href="#programme" size="md" variant="outline" arrow={false}>
                {t.hero.ctaProgrammes}
              </Button>
            </>
          }
        >
          {t.hero.title} <Accent>{t.hero.accent}</Accent>
        </PageHero>
        <CollegiateBadge {...t.hero.badge} className="absolute right-6 top-32 max-md:hidden lg:right-16 lg:top-44 lg:scale-125" />
      </div>

      {/* Contentful module: levelPath */}
      <Section tone="ink" className="!pt-8 md:!pt-12">
        <div className="mb-12">
          <Eyebrow className="mb-4">{t.path.eyebrow}</Eyebrow>
          <h2 className="text-[2.6rem] leading-[0.95] md:text-7xl">
            <VarsityText>{t.path.line1}</VarsityText>
            <br />
            <VarsityText className="text-fg/90">{t.path.line2}</VarsityText>
          </h2>
        </div>
        <LevelPath stages={t.levelStages} scale={t.levelScale} scaleLabel={t.path.scaleLabel} levelLabel={t.path.level} />
      </Section>

      {/* Contentful module: programmeGrid */}
      <Section tone="black" id="programme" className="scroll-mt-20">
        <div className="mb-12">
          <Eyebrow className="mb-4">{t.programmesSection.eyebrow}</Eyebrow>
          <Headline size="md">{t.programmesSection.title}</Headline>
        </div>
        <ul className="grid gap-5 md:grid-cols-2 lg:grid-cols-3">
          {t.programmes.map((p, i) => {
            const corporate = p.id === "corporate";
            return (
              <li key={p.id} className="h-full">
                <Reveal delay={(i % 3) * 0.06} className="h-full">
                <div
                  className={cn(
                    "group relative flex h-full flex-col overflow-hidden rounded-[20px] border bg-raised transition-all duration-300 hover:-translate-y-1",
                    p.highlight ? "border-magenta-500/60 hover:shadow-glow" : "border-fg/10 hover:border-magenta-500/50",
                  )}
                >
                  <Media src={p.image.url} alt={p.image.alt} className="aspect-[16/10]" overlay imgClassName="transition-transform duration-700 group-hover:scale-105" sizes="(min-width:1200px) 33vw, (min-width:768px) 50vw, 100vw" />
                  <div className="absolute inset-x-4 top-4 flex justify-between">
                    <Chip tone={p.highlight ? "gradient" : "dark"}>{p.highlight ? t.programmesSection.startHere : p.level}</Chip>
                  </div>
                  <div className="flex flex-1 flex-col p-6">
                    <h3 className="font-display text-3xl font-extrabold uppercase leading-none tracking-wide md:min-h-[2lh]">{p.title}</h3>
                    <p className="mt-3 flex-1 text-fg/70">{p.text}</p>
                    <div className="mt-6 flex items-center justify-between gap-3 border-t border-fg/10 pt-4">
                      <span className="text-sm text-fg/70">{p.meta}</span>
                      <a
                        href={corporate ? `mailto:${site.email}?subject=${encodeURIComponent(t.programmesSection.mailSubject)}` : deeplinks.events("academy-page")}
                        data-track={corporate ? "corporate_inquiry_click" : "academy_signup_click"}
                        aria-label={`${p.title}: ${corporate ? t.programmesSection.inquiry : t.programmesSection.book}`}
                        className="grid size-10 shrink-0 place-items-center rounded-full bg-brand-gradient transition-transform duration-300 hover:rotate-45 after:absolute after:inset-0 after:content-['']"
                      >
                        <ArrowUpRight className="size-5" aria-hidden />
                      </a>
                    </div>
                  </div>
                </div>
                </Reveal>
              </li>
            );
          })}
        </ul>
      </Section>

      {/* Contentful module: priceTable */}
      <Section tone="black" id="preise" className="scroll-mt-20 !pt-4 md:!pt-8">
        <div className="grid gap-10 lg:grid-cols-[1fr_1.15fr] lg:items-center lg:gap-16">
          <div>
            <Eyebrow className="mb-4">{t.pricesSection.eyebrow}</Eyebrow>
            <Headline size="md">
              {t.pricesSection.title} <Accent>{t.pricesSection.accent}</Accent>
            </Headline>
            <p className="mt-5 max-w-lg text-lg text-fg/70">{t.pricesSection.text}</p>
            <Button href={href(locale, "app")} variant="primary" size="md" className="mt-8 w-fit" data-track="academy_prices_book">
              {t.pricesSection.cta}
            </Button>
          </div>
          <div>
            <PriceList
              rows={t.pricesSection.rows}
              locale={locale}
              labels={{ unit: t.pricesSection.unit, coach: t.pricesSection.coach, headCoach: t.pricesSection.headCoach, caption: `${t.pricesSection.title} ${t.pricesSection.accent}` }}
            />
            <p className="mt-4 text-sm text-fg/60">{t.pricesSection.note}</p>
          </div>
        </div>
      </Section>

      {/* Contentful module: coachCarousel – real coaches only (getCoaches: Contentful → people.ts) */}
      {academyCoaches.length > 0 && (
        <Section tone="ink" id="coaches" className="scroll-mt-20 overflow-hidden">
          <CoachExplorer
            coaches={academyCoaches}
            locale={locale}
            labels={t.coachesSection}
            clubs={coachClubs}
            fallbackEmail={site.email}
            fallbackAppHref={deeplinks.events("academy-page")}
            heading={
              <Headline size="md">
                {t.coachesSection.title} <Accent>{t.coachesSection.accent}</Accent>
              </Headline>
            }
          />
        </Section>
      )}

      {/* Contentful module: academyLocations */}
      <Section tone="black">
        <div className="mb-10 flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
          <div>
            <Eyebrow className="mb-4">{t.locationsSection.eyebrow}</Eyebrow>
            <Headline size="md">{t.locationsSection.title}</Headline>
          </div>
          <Button href={href(locale, "locations")} variant="outline" className="w-fit">
            {t.locationsSection.all}
          </Button>
        </div>
        <div className="grid gap-5 md:grid-cols-2 lg:grid-cols-3">
          {clubs.map((c, i) => (
            <Reveal key={c.id} delay={(i % 3) * 0.06} className="flex min-w-0">
              <ClubCard club={c} locale={locale} className="w-full" />
            </Reveal>
          ))}
        </div>
        {/* TODO(content): which clubs actually offer Academy programmes? Currently first 6 clubs. */}
      </Section>

      {/* Contentful module: videoTeaserGrid */}
      <Section tone="ink">
        <div className="mb-10 flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
          <div>
            <Eyebrow className="mb-4">{t.videosSection.eyebrow}</Eyebrow>
            <Headline size="md">{t.videosSection.title}</Headline>
          </div>
          <Button href={site.social.youtube} variant="outline" size="sm" data-track="youtube_channel_click">
            {t.videosSection.channel}
          </Button>
        </div>
        <div className="grid gap-5 md:grid-cols-2 lg:grid-cols-3">
          {t.videoTeasers.map((v, i) => (
            <LiteYouTube
              key={v.id}
              title={v.title}
              duration={v.duration}
              youtubeId={v.youtubeId}
              thumbnail={v.thumbnail}
              locale={locale}
              className={i === 0 ? "md:col-span-2 lg:col-span-1" : undefined}
            />
          ))}
        </div>
      </Section>

      {/* Contentful module: faq */}
      <Section tone="black">
        <div className="grid gap-10 lg:grid-cols-[1fr_1.6fr]">
          <div>
            <Eyebrow className="mb-4">{t.faqSection.eyebrow}</Eyebrow>
            <Headline size="md">{t.faqSection.title}</Headline>
          </div>
          <Faq items={t.faq} />
        </div>
      </Section>

      <Section tone="ink">
        <AppCta locale={locale} campaign="academy-page" />
      </Section>
    </>
  );
}
