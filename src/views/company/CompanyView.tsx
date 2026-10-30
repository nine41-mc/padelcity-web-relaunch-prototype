import Link from "next/link";
import { Briefcase, Building2, Handshake, LineChart } from "lucide-react";
import type { Locale } from "@/lib/i18n/config";
import { href } from "@/lib/i18n/routes";
import { companyContent } from "@/lib/content/company";
import { PageHero } from "@/components/modules/PageHero";
import { Button } from "@/components/ui/Button";
import { CardArrow } from "@/components/ui/CardArrow";
import { Accent, Eyebrow, Headline, Lead } from "@/components/ui/Headline";
import { Reveal } from "@/components/ui/Reveal";
import { Section } from "@/components/ui/Section";

// Company hub: who we are, the paths for partners, franchise, investors and jobs, and the Series A block
// (moved here from the home page, which now belongs to the players – team feedback m-1, m-9).
const PATH_ICONS = { partners: Handshake, franchise: Building2, investors: LineChart, jobs: Briefcase } as const;

export function CompanyView({ locale }: { locale: Locale }) {
  const t = companyContent[locale];
  return (
    <>
      <PageHero
        eyebrow={t.hero.eyebrow}
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
        <Reveal className="max-w-3xl">
          <Eyebrow>{t.who.eyebrow}</Eyebrow>
          <Headline className="mt-6">
            {t.who.title} <Accent>{t.who.accent}</Accent>
          </Headline>
          <Lead className="mt-6">{t.who.text}</Lead>
          <Button href={href(locale, "about")} variant="outline" className="mt-8 w-fit">
            {t.who.cta}
          </Button>
        </Reveal>
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
                  data-theme={i === 0 ? "dark" : undefined}
                  className={`group relative flex h-full min-h-64 flex-col justify-between overflow-hidden rounded-[24px] border border-fg/10 bg-gradient-to-br ${i === 0 ? "from-purple-600 to-magenta-700" : "from-surface-variant to-surface"} pad-card transition-all duration-300 hover:-translate-y-1 hover:border-fg/40`}
                >
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
            <Eyebrow>{t.momentum.eyebrow}</Eyebrow>
            <Headline size="lg" className="mt-6">
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
