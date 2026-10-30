import { PartnerLogo } from "@/components/ui/PartnerLogo";
import { Check } from "lucide-react";
import type { Locale } from "@/lib/i18n/config";
import { localeTags } from "@/lib/i18n/config";
import { href } from "@/lib/i18n/routes";
import { keyFacts, partners } from "@/lib/content/partners";
import { sponsoringContent } from "@/lib/content/sponsoring";
import type { Partner } from "@/lib/data/types";
import { PageHero } from "@/components/modules/PageHero";
import { Section } from "@/components/ui/Section";
import { Button } from "@/components/ui/Button";
import { Accent, Headline } from "@/components/ui/Headline";
import { Reveal } from "@/components/ui/Reveal";
import { Media } from "@/components/ui/Media";
import { Chip } from "@/components/ui/Chip";
import { SectionIntro } from "@/components/brand/SectionIntro";
import { BrandIcon } from "@/components/brand/BrandIcon";
import { LeadForm } from "@/components/brand/LeadForm";
import { CountUp } from "@/components/brand/CountUp";

// Contentful page "partners": pageHero, statsStrip, sponsoringFormats, personaGrid, partnerLogoWall, caseStudy, corporateEvents, leadForm

const tiers: Partner["tier"][] = ["premium", "official", "supplier"];

/** Partners & sponsoring – shared by /partner (de) and /en/partners (en). */
export function PartnersView({ locale }: { locale: Locale }) {
  const t = sponsoringContent[locale];
  const intl = localeTags[locale].intl;
  const f = t.form.fields;
  const stats = [
    { v: keyFacts.clubs, s: "+", k: t.stats.clubs },
    { v: keyFacts.courts, s: "+", k: t.stats.courts },
    { v: keyFacts.cities, s: "+", k: t.stats.cities },
    { v: keyFacts.foundedYear, s: "", k: t.stats.founded },
  ];

  return (
    <>
      <PageHero
        eyebrow={t.hero.eyebrow}
        image={{ url: "/images/partner/hero.jpg", alt: t.hero.imageAlt }}
        lead={t.hero.lead}
        actions={
          <>
            <Button href="#kontakt" size="md" data-track="partner_hero_cta">
              {t.hero.ctaPrimary}
            </Button>
            <Button href="#firmenevents" variant="outline" size="md">
              {t.hero.ctaSecondary}
            </Button>
          </>
        }
      >
        {t.hero.title} <Accent>{t.hero.accent}</Accent>
      </PageHero>

      {/* Reach stats – approved public key figures only */}
      <div className="border-y border-fg/10 bg-canvas-deep">
        <dl className="container-site grid grid-cols-2 gap-y-6 py-8 md:grid-cols-4 md:py-10">
          {stats.map((s) => (
            <div key={s.k} className="flex flex-col-reverse text-center md:border-l md:border-fg/10 md:first:border-l-0">
              <dt className="mt-1 text-[13px] font-semibold uppercase tracking-[0.14em] text-fg/70">{s.k}</dt>
              <dd className="font-display text-4xl font-extrabold italic md:text-5xl">
                <CountUp value={s.v} suffix={s.s} intl={intl} />
              </dd>
            </div>
          ))}
        </dl>
      </div>

      <Section>
        <SectionIntro eyebrow={t.formats.eyebrow} title={t.formats.title} lead={t.formats.lead} />
        <ul className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {t.formats.items.map((item, i) => (
            <li key={item.title}>
              <Reveal delay={i * 0.05} className="h-full">
                <div className="group h-full rounded-[20px] border border-fg/10 bg-raised pad-card transition-all duration-300 hover:-translate-y-1 hover:border-magenta-500/50">
                  <BrandIcon name={item.icon} tone={i === 1 ? "gradient" : "glass"} />
                  <h3 className="mt-6 font-display text-2xl font-extrabold italic uppercase md:text-3xl">{item.title}</h3>
                  <p className="mt-3 text-fg/70">{item.text}</p>
                </div>
              </Reveal>
            </li>
          ))}
        </ul>
      </Section>

      <Section tone="black">
        <SectionIntro eyebrow={<span lang="en">{t.personas.eyebrow}</span>} title={t.personas.title} lead={t.personas.lead} />
        <ul className="grid grid-cols-1 gap-3 md:grid-cols-2 md:gap-4 lg:grid-cols-3">
          {t.personas.items.map((p, i) => (
            <li key={p.name}>
              <Reveal delay={i * 0.05} className="h-full">
                <div className="flex h-full items-start gap-4 rounded-[20px] border border-fg/10 bg-raised pad-card">
                  <span className="grid size-14 shrink-0 place-items-center rounded-full bg-brand-gradient font-display text-2xl font-extrabold italic" aria-hidden>
                    {p.name[0]}
                  </span>
                  <div>
                    <p className="font-display text-2xl font-extrabold italic uppercase leading-none">
                      {p.name} <span className="text-xl text-fg/70">{p.age}</span>
                    </p>
                    <p className="mt-2 text-sm leading-relaxed text-fg/70">{p.text}</p>
                  </div>
                </div>
              </Reveal>
            </li>
          ))}
        </ul>
      </Section>

      <Section tone="light">
        <Reveal className="mb-10 md:mb-14">
          <Headline size="md" className="text-ink-800">
            {t.logos.title}
          </Headline>
          <p className="mt-4 max-w-2xl text-lg text-ink-500">{t.logos.text}</p>
        </Reveal>
        <div className="space-y-10">
          {tiers.map((tier) => {
            const list = partners.filter((p) => p.tier === tier);
            return (
              <div key={tier} className="grid gap-4 lg:grid-cols-[220px_1fr] lg:gap-10">
                <div>
                  <p className="font-display text-2xl font-extrabold italic uppercase text-ink-800">{t.logos.tiers[tier].title}</p>
                  <p className="text-sm text-ink-400">{t.logos.tiers[tier].text}</p>
                </div>
                <ul className={`grid gap-3 ${tier === "premium" ? "grid-cols-2" : "grid-cols-2 md:grid-cols-3 lg:grid-cols-4"}`}>
                  {list.map((p) => {
                    const description = t.logos.descriptions[p.name];
                    return (
                      <li key={p.name}>
                        <div
                          className={`group flex h-full flex-col items-center justify-center gap-3 rounded-[20px] border border-ink-800/10 bg-white px-4 py-5 transition-all duration-300 hover:-translate-y-1 hover:shadow-elevated ${tier === "premium" ? "min-h-36 md:min-h-44" : "min-h-28"}`}
                          title={description ?? p.name}
                        >
                          <div className="flex w-full flex-1 items-center justify-center">
                            <PartnerLogo
                              partner={p}
                              className={`grayscale transition-all duration-300 group-hover:grayscale-0 ${tier === "premium" ? "h-12 md:h-14" : "h-9"}`}
                            />
                          </div>
                          {/* Description slot is reserved (2 lines) on premium/official tiles so all logos in a row sit at the same height */}
                          {tier !== "supplier" && <p className="min-h-[2lh] text-center text-[13px] leading-snug text-ink-400">{description}</p>}
                        </div>
                      </li>
                    );
                  })}
                </ul>
              </div>
            );
          })}
        </div>
      </Section>

      <Section>
        <SectionIntro eyebrow={t.cases.eyebrow} title={t.cases.title} />
        <div className="grid gap-5 lg:grid-cols-2">
          {t.cases.items.map((c, i) => (
            <Reveal key={c.title} delay={i * 0.08} className="h-full">
              <article className="group flex h-full flex-col overflow-hidden rounded-[28px] border border-fg/10 bg-raised">
                <div className="relative">
                  <Media src={c.image.url} alt={c.image.alt} className="aspect-[16/9]" imgClassName="transition-transform duration-700 group-hover:scale-105" sizes="(min-width:1200px) 50vw, 100vw" overlay />
                  <Chip tone="solid" className="absolute left-4 top-4">
                    {c.partner}
                  </Chip>
                </div>
                <div className="flex flex-1 flex-col p-6 md:p-8">
                  <h3 className="font-display text-3xl font-extrabold italic uppercase leading-none md:text-4xl">{c.title}</h3>
                  <p className="mt-4 text-fg/70">{c.text}</p>
                  <ul className="mt-auto flex flex-wrap gap-2 pt-6">
                    {c.tags.map((tag) => (
                      <li key={tag}>
                        <Chip>{tag}</Chip>
                      </li>
                    ))}
                  </ul>
                </div>
              </article>
            </Reveal>
          ))}
        </div>
      </Section>

      <Section id="firmenevents" tone="purple" className="scroll-mt-16">
        <div className="absolute inset-0 bg-court-lines opacity-50" aria-hidden />
        <div className="relative grid items-center gap-10 lg:grid-cols-2 lg:gap-16">
          <Reveal>
            <p className="text-[13px] font-semibold uppercase tracking-[0.16em] text-fg/85">{t.corporate.eyebrow}</p>
            <Headline size="md" className="mt-5">
              {t.corporate.title}
            </Headline>
            <p className="mt-6 max-w-lg text-lg text-fg/85">{t.corporate.text}</p>
            <div className="mt-8 flex flex-wrap gap-3">
              <Button href={`${href(locale, "eventInquiry")}?anlass=company`} data-track="corporate_event_cta">
                {t.corporate.cta}
              </Button>
            </div>
          </Reveal>
          <Reveal delay={0.1}>
            <ul className="grid gap-3 sm:grid-cols-2">
              {t.corporate.formats.map((item) => (
                <li key={item} className="flex items-start gap-3 rounded-[20px] bg-canvas-deep/25 pad-card backdrop-blur">
                  <span className="mt-0.5 grid size-6 shrink-0 place-items-center rounded-full bg-fg text-purple-700">
                    <Check className="size-3.5" strokeWidth={3} aria-hidden />
                  </span>
                  <span className="font-medium">{item}</span>
                </li>
              ))}
            </ul>
          </Reveal>
        </div>
      </Section>

      <Section id="kontakt" className="scroll-mt-16">
        <div className="grid gap-10 lg:grid-cols-[0.9fr_1.1fr] lg:gap-16">
          <div>
            <Headline size="md">
              {t.form.title} <Accent>{t.form.accent}</Accent>
            </Headline>
            <p className="mt-6 max-w-md text-lg text-fg/70">{t.form.text}</p>
          </div>
          <LeadForm
            locale={locale}
            track="partner_lead_submit"
            submitLabel={t.form.submit}
            successTitle={t.form.successTitle}
            successText={t.form.successText}
            fields={[
              { name: "name", label: f.name, type: "text", required: true, autoComplete: "name", half: true },
              { name: "company", label: f.company, type: "text", required: true, autoComplete: "organization", half: true },
              { name: "email", label: f.email, type: "email", required: true, autoComplete: "email", half: true },
              { name: "phone", label: f.phone, type: "tel", autoComplete: "tel", half: true },
              { name: "interest", label: f.interest, type: "select", required: true, options: [...t.formats.items.map((x) => x.title), t.formats.other] },
              { name: "message", label: f.message, type: "textarea", placeholder: f.messagePlaceholder },
            ]}
          />
        </div>
      </Section>
    </>
  );
}
