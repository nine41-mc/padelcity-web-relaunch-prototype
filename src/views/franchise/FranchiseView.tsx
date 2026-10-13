import { Check } from "lucide-react";
import { getClubs } from "@/lib/data";
import type { Locale } from "@/lib/i18n/config";
import { franchiseContent } from "@/lib/content/franchise";
import { PageHero } from "@/components/modules/PageHero";
import { Section } from "@/components/ui/Section";
import { Button } from "@/components/ui/Button";
import { Accent, Headline } from "@/components/ui/Headline";
import { Reveal } from "@/components/ui/Reveal";
import { ClubCard } from "@/components/cards/ClubCard";
import { SectionIntro } from "@/components/brand/SectionIntro";
import { BrandIcon } from "@/components/brand/BrandIcon";
import { LeadForm } from "@/components/brand/LeadForm";

// Contentful page "franchise": pageHero, benefitsGrid, partnershipSplit, processSteps, requirements, clubList (franchise filter), leadForm

/** Franchise landing page – shared by /franchise (de) and /en/franchise (en). */
export async function FranchiseView({ locale }: { locale: Locale }) {
  const t = franchiseContent[locale];
  const franchiseClubs = (await getClubs(locale)).filter((c) => c.isFranchise);
  const f = t.form.fields;

  return (
    <>
      <PageHero
        eyebrow={<span lang="en">{t.hero.eyebrow}</span>}
        image={{ url: "/images/franchise/hero.jpg", alt: t.hero.imageAlt }}
        lead={t.hero.lead}
        actions={
          <>
            <Button href="#anfrage" variant="primary" size="lg" data-track="franchise_hero_cta">
              {t.hero.ctaPrimary}
            </Button>
            <Button href="#ablauf" variant="outline" size="lg">
              {t.hero.ctaSecondary}
            </Button>
          </>
        }
      >
        {t.hero.title} <Accent>{t.hero.accent}</Accent>
      </PageHero>

      {/* Why PadelCity */}
      <Section>
        <SectionIntro eyebrow={t.benefits.eyebrow} title={t.benefits.title} lead={t.benefits.lead} />
        <ul className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {t.benefits.items.map((b, i) => (
            <li key={b.title}>
              <Reveal delay={i * 0.05} className="h-full">
                <div className="group h-full rounded-[20px] border border-white/10 bg-ink-700 p-6 transition-all duration-300 hover:-translate-y-1 hover:border-magenta-500/50 md:p-8">
                  <BrandIcon name={b.icon} />
                  <h3 className="mt-6 font-display text-2xl font-extrabold italic uppercase md:text-3xl">{b.title}</h3>
                  <p className="mt-3 text-white/70">{b.text}</p>
                </div>
              </Reveal>
            </li>
          ))}
        </ul>
      </Section>

      {/* We provide vs. partner brings */}
      <Section tone="black">
        <SectionIntro eyebrow={t.partnership.eyebrow} title={t.partnership.title} />
        <div className="grid gap-4 md:grid-cols-2 md:gap-5">
          <Reveal className="h-full">
            <div className="relative h-full overflow-hidden rounded-[28px] bg-brandbook-gradient p-6 md:p-10">
              <div className="absolute inset-0 bg-court-lines opacity-60" aria-hidden />
              <div className="relative">
                <p className="text-[13px] font-semibold uppercase tracking-[0.16em] text-white/85">{t.partnership.weProvideLabel}</p>
                <ul className="mt-6 space-y-4">
                  {t.partnership.weProvide.map((item) => (
                    <li key={item} className="flex gap-3 text-base md:text-lg">
                      <span className="mt-0.5 grid size-6 shrink-0 place-items-center rounded-full bg-white text-purple-700">
                        <Check className="size-3.5" strokeWidth={3} aria-hidden />
                      </span>
                      {item}
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </Reveal>
          <Reveal delay={0.08} className="h-full">
            <div className="h-full rounded-[28px] border border-white/10 bg-ink-700 p-6 md:p-10">
              <p className="text-[13px] font-semibold uppercase tracking-[0.16em] text-white/70">{t.partnership.youBringLabel}</p>
              <ul className="mt-6 space-y-4">
                {t.partnership.youBring.map((item) => (
                  <li key={item} className="flex gap-3 text-base text-white/85 md:text-lg">
                    <span className="mt-0.5 grid size-6 shrink-0 place-items-center rounded-full border border-white/25">
                      <Check className="size-3.5" strokeWidth={3} aria-hidden />
                    </span>
                    {item}
                  </li>
                ))}
              </ul>
            </div>
          </Reveal>
        </div>
      </Section>

      {/* Process */}
      <Section id="ablauf" className="scroll-mt-16">
        <SectionIntro eyebrow={t.steps.eyebrow} title={t.steps.title} lead={t.steps.lead} />
        <ol className="relative grid gap-4 md:grid-cols-5 md:gap-3 lg:gap-5">
          <span
            className="absolute left-[23px] top-6 bottom-6 w-px bg-gradient-to-b from-magenta-500 to-purple-500/20 md:left-6 md:right-6 md:top-[23px] md:bottom-auto md:h-px md:w-auto md:bg-gradient-to-r"
            aria-hidden
          />
          {t.steps.items.map((s, i) => (
            <li key={s.title} className="relative">
              <Reveal delay={i * 0.07} className="flex gap-5 md:flex-col md:gap-6">
                <span className="relative z-10 grid size-12 shrink-0 place-items-center rounded-full bg-brand-gradient font-display text-xl font-extrabold italic ring-8 ring-ink-800">
                  {i + 1}
                </span>
                <div className="pb-2">
                  <h3 className="font-display text-2xl font-extrabold italic uppercase leading-none md:min-h-[2lh] md:text-xl lg:text-2xl">{s.title}</h3>
                  <p className="mt-2 text-sm leading-relaxed text-white/70">{s.text}</p>
                </div>
              </Reveal>
            </li>
          ))}
        </ol>
      </Section>

      {/* Requirements – qualitative only until the franchise team confirms figures */}
      <Section tone="black">
        <SectionIntro eyebrow={t.requirements.eyebrow} title={t.requirements.title} />
        <ul className="grid gap-4 md:grid-cols-3">
          {t.requirements.items.map((r, i) => (
            <li key={r.title}>
              <Reveal delay={i * 0.06} className="h-full">
                <div className="flex h-full flex-col rounded-[20px] border border-white/10 bg-ink-700 p-6 md:p-8">
                  <p className="text-[13px] font-semibold uppercase tracking-[0.16em] text-white/70">{r.title}</p>
                  <p className="mt-4 font-display text-4xl font-extrabold italic uppercase text-white md:text-3xl lg:text-5xl">{r.value}</p>
                  <p className="mt-4 text-white/70">{r.text}</p>
                </div>
              </Reveal>
            </li>
          ))}
        </ul>
      </Section>

      {/* Live franchise clubs */}
      {franchiseClubs.length > 0 && (
        <Section>
          <SectionIntro eyebrow={`${franchiseClubs.length} ${t.clubs.eyebrowSuffix}`} title={t.clubs.title} lead={t.clubs.lead} />
          <ul className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
            {franchiseClubs.map((c, i) => (
              <li key={c.id}>
                <Reveal delay={i * 0.05} className="h-full">
                  <ClubCard club={c} locale={locale} className="h-full" />
                </Reveal>
              </li>
            ))}
          </ul>
        </Section>
      )}

      {/* Lead form */}
      <Section id="anfrage" className="scroll-mt-20">
        <div className="grid gap-10 lg:grid-cols-[0.9fr_1.1fr] lg:gap-16">
          <div>
            <Headline size="md">
              {t.form.title} <Accent>{t.form.accent}</Accent> {t.form.titleEnd}
            </Headline>
            <p className="mt-6 max-w-md text-lg text-white/70">{t.form.text}</p>
            <ul className="mt-8 space-y-3 text-white/70">
              {t.form.checks.map((c) => (
                <li key={c} className="flex gap-3">
                  <Check className="mt-1 size-4 shrink-0 text-magenta-300" aria-hidden /> {c}
                </li>
              ))}
            </ul>
          </div>
          <LeadForm
            locale={locale}
            track="franchise_lead_submit"
            submitLabel={t.form.submit}
            successTitle={t.form.successTitle}
            successText={t.form.successText}
            fields={[
              { name: "name", label: f.name, type: "text", required: true, autoComplete: "name", half: true },
              { name: "email", label: f.email, type: "email", required: true, autoComplete: "email", half: true },
              { name: "phone", label: f.phone, type: "tel", autoComplete: "tel", half: true },
              { name: "city", label: f.city, type: "text", required: true, autoComplete: "address-level2", half: true },
              { name: "space", label: f.space, type: "select", required: true, options: f.spaceOptions },
              { name: "message", label: f.message, type: "textarea", placeholder: f.messagePlaceholder },
            ]}
          />
        </div>
      </Section>
    </>
  );
}
