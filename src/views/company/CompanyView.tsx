import Link from "next/link";
import { Briefcase, Building2, Handshake, LineChart } from "lucide-react";
import type { Locale } from "@/lib/i18n/config";
import { href } from "@/lib/i18n/routes";
import { companyContent } from "@/lib/content/company";
import { aboutContent, milestones } from "@/lib/content/about";
import { investorsContent } from "@/lib/content/investors";
import { localeTags } from "@/lib/i18n/config";
import { KpiTiles } from "@/components/brand/KpiTiles";
import { Media } from "@/components/ui/Media";
import { PageHero } from "@/components/modules/PageHero";
import { SectionIntro } from "@/components/brand/SectionIntro";
import { Timeline } from "@/components/brand/Timeline";
import { Button } from "@/components/ui/Button";
import { InfoTile } from "@/components/ui/InfoTile";
import { CardArrow } from "@/components/ui/CardArrow";
import { Accent, Headline, Lead } from "@/components/ui/Headline";
import { Reveal } from "@/components/ui/Reveal";
import { Section } from "@/components/ui/Section";

// Company hub: who we are, the paths for partners, franchise, investors and jobs, and the Series A block
// (moved here from the home page, which now belongs to the players – team feedback m-1, m-9). Vision, mission and
// milestones are the same entries as on the about page (team feedback m-9-2), not a second copy of the texts.
const PATH_ICONS = { partners: Handshake, franchise: Building2, investors: LineChart, jobs: Briefcase } as const;
// Design feedback 04.11.2026 („zu textlastig“): photos from the existing pool, decorative (alt="") where they only set the mood
const PATH_IMAGES = { partners: "/images/hero/partner.jpg", franchise: "/images/hero/franchise.jpg", investors: "/images/hero/investors.jpg", jobs: "/images/hero/jobs.jpg" } as const;
const MILESTONE_IMAGES: Record<string, string> = {
  "2022": "/images/hero/courts.jpg",
  "2023": "/images/hero/app.jpg",
  "2024": "/images/events/opc.jpg",
  "2025": "/images/events/series.jpg",
  "2026": "/images/hero/investors.jpg",
};

export function CompanyView({ locale }: { locale: Locale }) {
  const t = companyContent[locale];
  const about = aboutContent[locale];
  return (
    <>
      <PageHero
        image={{ url: "/images/hero/community.jpg", alt: t.hero.imageAlt }}
        lead={t.hero.lead}
        actions={
          <Button href="#paths" size="md">
            {t.hero.cta}
          </Button>
        }
      >
        {t.hero.title} <Accent>{t.hero.accent}</Accent>
      </PageHero>

      {/* Who we are – the long version (story, values, team) lives on the about page */}
      <Section>
        <div className="grid items-center gap-10 lg:grid-cols-2 lg:gap-16">
          <Reveal>
            <Headline>
              {t.who.title} <Accent>{t.who.accent}</Accent>
            </Headline>
            <Lead className="mt-6">{t.who.text}</Lead>
            <Button href={href(locale, "about")} variant="outline" className="mt-8 w-fit">
              {t.who.cta}
            </Button>
          </Reveal>
          <Reveal delay={0.1}>
            <Media src="/images/about/team.jpg" alt={about.jobs.imageAlt} className="aspect-[4/3] overflow-hidden rounded-[28px]" sizes="(min-width:1024px) 50vw, 100vw" />
          </Reveal>
        </div>
        {/* Approved key figures, the same as on the investors page */}
        <KpiTiles items={investorsContent[locale].kpis.items.slice(0, 4)} intl={localeTags[locale].intl} className="mt-12 md:mt-16" />
      </Section>

      {/* Our story so far – the milestones of the about page */}
      <Section tone="black">
        <SectionIntro title={about.milestones.title} />
        <Timeline items={milestones[locale]} locale={locale} images={MILESTONE_IMAGES} />
      </Section>

      {/* Vision & mission – shared with the about page */}
      <Section>
        <div className="grid gap-4 md:gap-5 lg:grid-cols-[1.1fr_1fr]">
          <Reveal className="h-full">
            <Media src="/images/events/social-2.jpg" alt="" className="aspect-[4/3] h-full overflow-hidden rounded-[24px] lg:aspect-auto lg:min-h-96" sizes="(min-width:1024px) 50vw, 100vw" />
          </Reveal>
          <div className="grid gap-4 md:gap-5">
            {about.vision.map((b, i) => (
              <Reveal key={b.k} delay={i * 0.08} className="h-full">
                <InfoTile size="lg" label={b.k} value={b.t} text={b.d} />
              </Reveal>
            ))}
          </div>
        </div>
      </Section>

      {/* Paths: partners, franchise, investors, jobs */}
      <Section id="paths" tone="black" className="scroll-mt-16">
        <Reveal>
          <Headline size="md" className="max-w-3xl">
            {t.paths.title} <Accent>{t.paths.accent}</Accent>
          </Headline>
        </Reveal>
        <div className="mt-12 grid gap-4 md:grid-cols-2 lg:grid-cols-4">
          {t.paths.items.map((item, i) => {
            const Icon = PATH_ICONS[item.key as keyof typeof PATH_ICONS];
            return (
              <Reveal key={item.key} delay={i * 0.06}>
                <Link
                  href={href(locale, item.key)}
                  data-theme="dark"
                  className="group relative isolate flex h-full min-h-80 flex-col justify-between overflow-hidden rounded-[24px] border border-fg/10 pad-card text-fg transition-all duration-300 hover:-translate-y-1 hover:border-fg/40"
                >
                  {/* photo card: image with a dark gradient so the white text stays readable */}
                  <Media src={PATH_IMAGES[item.key as keyof typeof PATH_IMAGES]} alt="" className="absolute inset-0 -z-10" imgClassName="transition-transform duration-700 group-hover:scale-105" overlay sizes="(min-width:1024px) 25vw, (min-width:768px) 50vw, 100vw" />
                  <div className={`absolute inset-0 -z-10 ${i === 0 ? "bg-gradient-to-br from-purple-600/70 to-magenta-700/40" : "bg-black/35"}`} aria-hidden />
                  <Icon className="size-8 text-fg" aria-hidden />
                  <div>
                    <h3 className="font-display text-3xl font-extrabold italic uppercase">{item.title}</h3>
                    <p className="mt-2 text-fg/85 md:min-h-[3lh]">{item.text}</p>
                  </div>
                  <CardArrow className="absolute right-5 top-5" />
                </Link>
              </Reveal>
            );
          })}
        </div>
      </Section>

      {/* Series A momentum */}
      <section className="relative isolate overflow-hidden bg-brandbook-gradient py-24 md:py-32">
        <div className="absolute inset-0 -z-10 bg-court-lines opacity-60" />
        <div className="absolute -right-32 -top-32 -z-10 size-[520px] rounded-full bg-magenta-500/40 blur-[120px]" />
        <div className="container-site grid items-center gap-12 lg:grid-cols-2">
          <Reveal>
            <Headline size="lg">
              {t.momentum.title} <br />
              {t.momentum.title2} <Accent>{t.momentum.accent}</Accent>
            </Headline>
          </Reveal>
          <Reveal delay={0.1}>
            <p className="text-xl leading-relaxed text-fg/85 md:text-2xl">{t.momentum.text}</p>
            {/* TODO(content): Series A details (Volumen, Lead-Investor, Datum) nur nach Freigabe */}
            <div className="mt-8 flex flex-wrap gap-3">
              <Button href={href(locale, "investors")}>{t.momentum.ir}</Button>
              <Button href={href(locale, "jobs")} variant="outline">
                {t.momentum.jobs}
              </Button>
            </div>
          </Reveal>
        </div>
      </section>
    </>
  );
}
