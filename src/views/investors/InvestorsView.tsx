import { Mail } from "lucide-react";
import type { Locale } from "@/lib/i18n/config";
import { localeTags } from "@/lib/i18n/config";
import { milestones } from "@/lib/content/about";
import { investorsContent, irMailto } from "@/lib/content/investors";
import { founders, team } from "@/lib/content/people";
import { Section } from "@/components/ui/Section";
import { Button } from "@/components/ui/Button";
import { Accent, Eyebrow, Headline, Lead } from "@/components/ui/Headline";
import { Media } from "@/components/ui/Media";
import { Reveal } from "@/components/ui/Reveal";
import { Marquee } from "@/components/ui/Marquee";
import { SectionIntro } from "@/components/brand/SectionIntro";
import { EquityStory } from "@/components/brand/EquityStory";
import { KpiTiles } from "@/components/brand/KpiTiles";
import { Timeline } from "@/components/brand/Timeline";
import { PeopleGrid } from "@/components/brand/PeopleGrid";

// Contentful page "investors": irHero, marquee, equityStory, kpiTiles, milestoneTimeline, peopleGrid (founders + management),
// downloadList (press kit), contactCard
// Business decision: no Series A figures (volume, investors, date) – qualitative "Series A closed" only.

/** Investor Relations – shared by /investoren (de) and /en/investors (en). */
export function InvestorsView({ locale }: { locale: Locale }) {
  const t = investorsContent[locale];
  const intl = localeTags[locale].intl;
  const management = team.filter((p) => /Geschäftsführer/.test(p.role.de));
  const mailto = irMailto(t.contact.subject);

  return (
    <>
      <section data-theme="dark" className="relative isolate overflow-hidden pt-36 pb-16 md:pt-44 md:pb-24 lg:min-h-[80vh] lg:pt-52">
        <div className="absolute inset-0 -z-10">
          <Media src="/images/investoren/hero.jpg" alt={t.hero.imageAlt} className="h-full w-full" priority imgClassName="grayscale-[35%]" />
          <div className="absolute inset-0 bg-gradient-to-b from-ink-800/80 via-purple-900/70 to-ink-800" />
          <div className="absolute inset-0 bg-grain" />
        </div>
        <div className="container-site">
          <Eyebrow className="mb-6">{t.hero.eyebrow}</Eyebrow>
          <Headline as="h1" size="xl" className="max-w-6xl">
            {t.hero.title} <Accent>{t.hero.accent}</Accent> {t.hero.titleEnd}
          </Headline>
          <Lead className="mt-8">{t.hero.lead}</Lead>
          <div className="mt-10 flex flex-wrap gap-3">
            <Button href="#equity-story" size="md">
              {t.hero.ctaStory}
            </Button>
            <Button href="#kontakt" variant="outline" size="md" data-track="ir_contact_cta">
              {t.hero.ctaContact}
            </Button>
          </div>
        </div>
      </section>

      <div className="border-y border-fg/10 bg-canvas-deep py-5">
        <Marquee>
          {t.marquee.map((item) => (
            <span key={item} className="mx-6 flex items-center gap-6 font-display text-2xl font-extrabold italic uppercase text-fg/80 md:text-3xl">
              {item} <span className="size-2 rounded-full bg-magenta-500" aria-hidden />
            </span>
          ))}
        </Marquee>
      </div>

      <Section id="equity-story" className="scroll-mt-16">
        <SectionIntro eyebrow={t.equity.eyebrow} title={t.equity.title} lead={t.equity.lead} />
        <EquityStory chapters={t.equity.chapters} ariaLabel={t.equity.aria} />
      </Section>

      <Section tone="black">
        <SectionIntro eyebrow={t.kpis.eyebrow} title={t.kpis.title} lead={t.kpis.lead} />
        <KpiTiles items={t.kpis.items} intl={intl} />
      </Section>

      <Section>
        <SectionIntro eyebrow={t.milestones.eyebrow} title={t.milestones.title} />
        <Timeline items={milestones[locale]} locale={locale} />
      </Section>

      <Section tone="black">
        <SectionIntro eyebrow={t.leadership.eyebrow} title={t.leadership.title} lead={t.leadership.lead} />
        <PeopleGrid people={founders} locale={locale} showBio />
        {management.length > 0 && (
          <>
            <h3 className="mt-14 mb-6 text-[13px] font-semibold uppercase tracking-[0.16em] text-fg/70">{t.leadership.management}</h3>
            <PeopleGrid people={management} locale={locale} className="lg:grid-cols-4" />
          </>
        )}
      </Section>

      <Section id="kontakt" className="scroll-mt-16">
        <div className="grid gap-10 lg:grid-cols-[1.2fr_0.8fr] lg:gap-12">
          <div>
            <SectionIntro eyebrow={t.press.eyebrow} title={t.press.title} className="mb-8 md:mb-10" />
            {/* Contentful module: investorsContent – Downloads. TODO(content): real files; until then every item is requested by email */}
            <ul className="divide-y divide-fg/10 border-y border-fg/10">
              {t.press.items.map((d) => (
                <li key={d.title}>
                  <a href={irMailto(`${t.press.title}: ${d.title}`)} className="group flex items-center justify-between gap-4 py-5" data-track="ir_press_request">
                    <div>
                      <p className="text-lg font-semibold transition-colors group-hover:text-accent-fg">{d.title}</p>
                      <p className="mt-1 text-sm text-fg/70">
                        {d.meta} · {t.press.note}
                      </p>
                    </div>
                    <span className="grid size-11 shrink-0 place-items-center rounded-full border border-white/20 transition-colors group-hover:border-magenta-500 group-hover:bg-magenta-500">
                      <Mail className="size-4" aria-hidden />
                      <span className="sr-only">
                        {d.title} {t.press.requestLabel}
                      </span>
                    </span>
                  </a>
                </li>
              ))}
            </ul>
          </div>
          <Reveal className="lg:pt-24">
            {/* Contentful module: contactCard */}
            <div className="relative overflow-hidden rounded-[28px] bg-brandbook-gradient pad-banner">
              <div className="absolute inset-0 bg-court-lines opacity-60" aria-hidden />
              <div className="relative">
                <p className="text-[13px] font-semibold uppercase tracking-[0.16em] text-fg/85">{t.contact.eyebrow}</p>
                <p className="mt-6 font-display text-4xl font-extrabold italic uppercase leading-none">{t.contact.title}</p>
                <p className="mt-4 text-fg/80">{t.contact.text}</p>
                <Button href={mailto} variant="gradient" className="mt-8" data-track="ir_contact_mail">
                  {t.contact.mailLabel}
                </Button>
              </div>
            </div>
          </Reveal>
        </div>
      </Section>
    </>
  );
}
