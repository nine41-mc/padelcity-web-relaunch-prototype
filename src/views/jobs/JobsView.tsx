import type { Locale } from "@/lib/i18n/config";
import { href } from "@/lib/i18n/routes";
import { APPLY_EMAIL, jobsContact, jobsContent } from "@/lib/content/jobs";
import { values } from "@/lib/content/about";
import { team } from "@/lib/content/people";
import { PageHero } from "@/components/modules/PageHero";
import { Section } from "@/components/ui/Section";
import { Button } from "@/components/ui/Button";
import { Accent, Headline } from "@/components/ui/Headline";
import { Reveal } from "@/components/ui/Reveal";
import { Marquee } from "@/components/ui/Marquee";
import { Media } from "@/components/ui/Media";
import { SectionIntro } from "@/components/brand/SectionIntro";
import { BrandIcon } from "@/components/brand/BrandIcon";
import { PersonioJobs } from "@/components/brand/PersonioJobs";
import { JobsContact } from "@/components/brand/JobsContact";
import { PeopleGrid } from "@/components/brand/PeopleGrid";

// Contentful page "jobs" (static): pageHero, openings intro + contact, benefitsGrid, cultureMarquee, peopleGrid, initiativeCta.
// Only the open positions are dynamic: Personio career page embedded (PersonioJobs).

/** Jobs & careers – shared by /jobs (de) and /en/jobs (en). */
export function JobsView({ locale }: { locale: Locale }) {
  const t = jobsContent[locale];
  const faces = team.slice(0, 12);

  return (
    <>
      <PageHero
        eyebrow={t.hero.eyebrow}
        image={{ url: "/images/jobs/hero.jpg", alt: t.hero.imageAlt }}
        lead={t.hero.lead}
        actions={
          <>
            <Button href="#stellen" size="md" data-track="jobs_hero_cta">
              {t.hero.ctaPrimary}
            </Button>
            <Button href="#initiativ" variant="outline" size="md">
              {t.hero.ctaSecondary}
            </Button>
          </>
        }
      >
        {t.hero.title} <Accent>{t.hero.accent}</Accent>
      </PageHero>

      {/* Open positions directly below the hero */}
      <Section id="stellen" className="scroll-mt-16">
        <SectionIntro eyebrow={t.openings.eyebrow} title={t.openings.title} lead={t.openings.lead} />
        <div className="grid gap-10 lg:grid-cols-[minmax(0,1fr)_320px] lg:gap-12">
          {/* Personio embed (like apploft.de/karriere/#jobs) – list, job ads and application form come from Personio */}
          <PersonioJobs locale={locale} title={t.personio.title} placeholder={t.personio.placeholder} />
          <JobsContact contact={{ ...t.contact, ...jobsContact }} />
        </div>
      </Section>

      <Section>
        <SectionIntro eyebrow={t.benefits.eyebrow} title={t.benefits.title} lead={t.benefits.lead} />
        <ul className="grid grid-cols-1 gap-3 md:grid-cols-2 md:gap-4 lg:grid-cols-3">
          {t.benefits.items.map((b, i) => (
            <li key={b.title}>
              <Reveal delay={i * 0.05} className="h-full">
                <div className="flex h-full gap-5 rounded-[20px] border border-fg/10 bg-raised pad-card transition-all duration-300 hover:-translate-y-1 hover:border-magenta-500/50 md:flex-col">
                  <BrandIcon name={b.icon} tone={i === 0 ? "gradient" : "glass"} />
                  <div>
                    <h3 className="font-display text-2xl font-extrabold italic uppercase leading-none md:text-3xl">{b.title}</h3>
                    <p className="mt-2 text-fg/70">{b.text}</p>
                  </div>
                </div>
              </Reveal>
            </li>
          ))}
        </ul>
      </Section>

      <section className="overflow-hidden bg-brandbook-gradient py-16 md:py-24" aria-labelledby="kultur">
        <div className="container-site">
          <p className="text-[13px] font-semibold uppercase tracking-[0.16em] text-fg/85">{t.culture.eyebrow}</p>
          <h2 id="kultur" className="mt-4 max-w-3xl font-display text-4xl font-extrabold italic uppercase leading-[0.95] text-balance md:text-5xl lg:text-6xl">
            {t.culture.title}
          </h2>
        </div>
        <Marquee className="mt-10 md:mt-14">
          {values[locale].map((v) => (
            <span key={v.name} className="mx-5 flex items-center gap-10 font-display text-6xl font-extrabold italic uppercase md:text-8xl">
              {v.name}
              <span className="font-brush text-3xl font-normal normal-case not-italic text-fg/70 md:text-5xl">{v.claim}</span>
            </span>
          ))}
        </Marquee>
        <div className="container-site mt-12 grid gap-6 md:grid-cols-[1fr_1fr] md:items-center">
          <Media src="/images/jobs/culture.jpg" alt={t.culture.imageAlt} className="aspect-[16/10] rounded-[28px]" sizes="(min-width:768px) 50vw, 100vw" />
          <p className="max-w-lg text-lg text-fg/85">{t.culture.text}</p>
        </div>
      </section>

      {/* Team snapshot – real people from people.ts */}
      <Section tone="black">
        <SectionIntro
          eyebrow={t.faces.eyebrow}
          title={t.faces.title}
          lead={t.faces.lead}
          actions={
            <Button href={href(locale, "about")} variant="outline">
              {t.faces.all}
            </Button>
          }
        />
        <PeopleGrid people={faces} locale={locale} compact />
      </Section>


      <Section id="initiativ" tone="black" className="scroll-mt-16">
        <Reveal>
          <div className="relative overflow-hidden rounded-[28px] border border-fg/10 bg-raised pad-banner">
            <div className="absolute inset-0 bg-court-lines opacity-40" aria-hidden />
            <div className="relative grid items-end gap-8 md:grid-cols-[1.4fr_1fr]">
              <div>
                <Headline size="md">
                  {t.initiative.title} <Accent>{t.initiative.accent}</Accent>
                </Headline>
                <p className="mt-5 max-w-lg text-lg text-fg/70">{t.initiative.text}</p>
              </div>
              <div className="md:justify-self-end">
                <Button href={`mailto:${APPLY_EMAIL}?subject=${encodeURIComponent(t.initiative.cta)}`} external variant="gradient" size="md" data-track="jobs_initiative_cta">
                  {t.initiative.cta}
                </Button>
              </div>
            </div>
          </div>
        </Reveal>
      </Section>
    </>
  );
}
