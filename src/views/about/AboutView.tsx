import Link from "next/link";
import { ArrowUpRight, Quote } from "lucide-react";
import type { Locale } from "@/lib/i18n/config";
import { href } from "@/lib/i18n/routes";
import { aboutContent, milestones, pillars, values } from "@/lib/content/about";
import { founders, team } from "@/lib/content/people";
import { keyFacts } from "@/lib/content/partners";
import { site } from "@/lib/site";
import { PageHero } from "@/components/modules/PageHero";
import { Section } from "@/components/ui/Section";
import { Button } from "@/components/ui/Button";
import { Accent, Headline } from "@/components/ui/Headline";
import { Reveal } from "@/components/ui/Reveal";
import { Media } from "@/components/ui/Media";
import { SectionIntro } from "@/components/brand/SectionIntro";
import { ValuesGrid } from "@/components/brand/ValuesGrid";
import { Timeline } from "@/components/brand/Timeline";
import { PeopleGrid } from "@/components/brand/PeopleGrid";
import { BrandIcon } from "@/components/brand/BrandIcon";
import { Testimonials } from "@/components/modules/Testimonials";
import { InfoTile } from "@/components/ui/InfoTile";

// Contentful page "about": pageHero, storyBlock + founderQuote, visionMission, valuesGrid, pillarsGrid, peopleGrid (founders),
// peopleGrid (team / Faces of PadelCity), testimonials, milestoneTimeline, jobsTeaser

/** About us – shared by /ueber-uns (de) and /en/about (en). */
export function AboutView({ locale }: { locale: Locale }) {
  const t = aboutContent[locale];
  const quoteAuthor = founders.find((f) => f.quote);
  const [open, close] = locale === "de" ? ["„", "“"] : locale === "pl" ? ["„", "”"] : ["“", "”"];

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "Organization",
    name: "PadelCity",
    url: `${site.url}${href(locale, "home").replace(/\/?$/, "/")}`,
    logo: `${site.url}/brand/logo.svg`,
    foundingDate: String(keyFacts.foundedYear),
    founder: founders.map((f) => ({ "@type": "Person", name: f.name, jobTitle: f.role[locale] })),
    description: t.meta.description,
    inLanguage: locale,
    sameAs: Object.values(site.social),
  };

  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd).replace(/</g, "\\u003c") }} />

      <PageHero
        eyebrow={t.hero.eyebrow}
        image={{ url: "/images/about/hero.jpg", alt: t.hero.imageAlt }}
        lead={t.hero.lead}
        actions={
          <Button href="#story" size="md">
            {t.hero.cta}
          </Button>
        }
      >
        {t.hero.title} <Accent>{t.hero.accent}</Accent>
      </PageHero>

      {/* Story + founder quote (quote: brand book, via people.ts) */}
      <Section id="story" className="scroll-mt-16">
        <div className="grid gap-10 lg:grid-cols-2 lg:gap-16">
          <Reveal>
            <p className="text-[13px] font-semibold uppercase tracking-[0.16em] text-magenta-300">{t.story.eyebrow}</p>
            <div className="mt-6 space-y-5 text-lg leading-relaxed text-white/80">
              {t.story.paragraphs.map((p) => (
                <p key={p}>{p}</p>
              ))}
            </div>
          </Reveal>
          {quoteAuthor?.quote && (
            <Reveal delay={0.1}>
              <figure className="relative h-full overflow-hidden rounded-[28px] bg-brandbook-gradient pad-banner">
                <div className="absolute inset-0 bg-court-lines opacity-60" aria-hidden />
                <div className="relative flex h-full flex-col">
                  <Quote className="size-10 text-white/70" aria-hidden />
                  <blockquote className="mt-6 font-display text-3xl font-extrabold italic uppercase leading-[1.02] md:text-4xl">
                    {open}
                    {quoteAuthor.quote[locale]}
                    {close}
                  </blockquote>
                  <figcaption className="mt-auto flex items-center gap-4 pt-8">
                    {quoteAuthor.image && (
                      <Media src={quoteAuthor.image} alt={quoteAuthor.name} className="size-14 shrink-0 rounded-full" imgClassName="object-[50%_20%]" sizes="56px" />
                    )}
                    <span>
                      <span className="block font-semibold">{quoteAuthor.name}</span>
                      <span className="text-white/85">{quoteAuthor.role[locale]}</span>
                    </span>
                  </figcaption>
                </div>
              </figure>
            </Reveal>
          )}
        </div>
      </Section>

      {/* Vision & mission */}
      <Section tone="black">
        <div className="grid gap-4 md:grid-cols-2 md:gap-5">
          {t.vision.map((b, i) => (
            <Reveal key={b.k} delay={i * 0.08} className="h-full">
              <InfoTile size="lg" label={b.k} value={b.t} text={b.d} />
            </Reveal>
          ))}
        </div>
      </Section>

      {/* Values */}
      <Section>
        <SectionIntro eyebrow={t.values.eyebrow} title={t.values.title} lead={t.values.lead} />
        <ValuesGrid items={values[locale]} ariaLabel={t.values.aria} />
      </Section>

      {/* Pillars */}
      <Section tone="black">
        <SectionIntro eyebrow={t.pillars.eyebrow} title={t.pillars.title} />
        <ul className="grid gap-3 md:grid-cols-2 lg:grid-cols-4 lg:gap-4">
          {pillars[locale].map((p, i) => {
            const inner = (
              <>
                <div className="flex items-center justify-between">
                  <BrandIcon name={p.icon} tone="glass" />
                  {p.route && <ArrowUpRight className="size-5 text-white/70 transition-all duration-300 group-hover:rotate-45 group-hover:text-white" aria-hidden />}
                </div>
                <h3 className="mt-6 font-display text-3xl font-extrabold italic uppercase leading-none text-brand-gradient">{p.name}</h3>
                <p className={`mt-3 text-sm leading-relaxed ${p.route ? "text-white/75" : "text-white"}`}>{p.text}</p>
              </>
            );
            const cls = "group block h-full rounded-[20px] border border-white/10 bg-ink-700 pad-card transition-all duration-300 hover:-translate-y-1 hover:border-magenta-500/50";
            return (
              <li key={p.name} className={i === 0 ? "md:col-span-2" : undefined}>
                <Reveal delay={i * 0.04} className="h-full">
                  {p.route ? (
                    <Link href={href(locale, p.route)} className={cls}>
                      {inner}
                    </Link>
                  ) : (
                    <div className={`${cls} border-transparent bg-brand-gradient`}>{inner}</div>
                  )}
                </Reveal>
              </li>
            );
          })}
        </ul>
      </Section>

      {/* Founders */}
      <Section>
        <SectionIntro eyebrow={t.founders.eyebrow} title={t.founders.title} />
        <PeopleGrid people={founders} locale={locale} showBio />
      </Section>

      {/* Faces of PadelCity – real team from padelcity.de */}
      <Section tone="black">
        <SectionIntro eyebrow={t.faces.eyebrow} title={t.faces.title} lead={t.faces.lead} />
        <PeopleGrid people={team} locale={locale} compact />
      </Section>

      {/* Let the players talk – real testimonials from padelcity.de */}
      <Section className="overflow-hidden">
        <Testimonials locale={locale} />
      </Section>

      {/* Milestones */}
      <Section tone="black">
        <SectionIntro eyebrow={t.milestones.eyebrow} title={t.milestones.title} />
        <Timeline items={milestones[locale]} locale={locale} />
      </Section>

      {/* Jobs CTA */}
      <Section tone="black" className="pt-0 md:pt-0 lg:pt-0">
        <Reveal>
          <div className="relative grid items-center gap-8 overflow-hidden rounded-[28px] border border-white/10 bg-ink-700 md:grid-cols-[1fr_0.8fr]">
            <div className="p-8 md:p-12">
              <Headline size="md">
                {t.jobs.title} <Accent>{t.jobs.accent}</Accent>
              </Headline>
              <p className="mt-5 max-w-md text-lg text-white/70">{t.jobs.text}</p>
              <Button href={href(locale, "jobs")} variant="gradient" size="md" className="mt-8" data-track="about_jobs_cta">
                {t.jobs.cta}
              </Button>
            </div>
            <Media src="/images/about/team.jpg" alt={t.jobs.imageAlt} className="aspect-[16/10] md:aspect-auto md:h-full md:min-h-80" sizes="(min-width:768px) 40vw, 100vw" />
          </div>
        </Reveal>
      </Section>
    </>
  );
}

