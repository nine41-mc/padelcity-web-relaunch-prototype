import { Check } from "lucide-react";
import { getClubs } from "@/lib/data";
import type { Locale } from "@/lib/i18n/config";
import { franchiseContent } from "@/lib/content/franchise";
import { PageHero } from "@/components/modules/PageHero";
import { Section } from "@/components/ui/Section";
import { Media } from "@/components/ui/Media";
import { founders, team } from "@/lib/content/people";
import { Button } from "@/components/ui/Button";
import { Accent, Headline } from "@/components/ui/Headline";
import { Reveal } from "@/components/ui/Reveal";
import { ClubPoster } from "@/components/home/ClubShowcase";
import { SectionIntro } from "@/components/brand/SectionIntro";
import { BrandIcon } from "@/components/brand/BrandIcon";
import { LeadForm } from "@/components/brand/LeadForm";
import { InfoTile } from "@/components/ui/InfoTile";

// Contentful page "franchise": pageHero, benefitsGrid, partnershipSplit, processSteps, requirements, clubList (franchise filter), leadForm

/** Franchise landing page – shared by /franchise (de) and /en/franchise (en). */
export async function FranchiseView({ locale }: { locale: Locale }) {
  const t = franchiseContent[locale];
  const franchiseClubs = (await getClubs(locale)).filter((c) => c.isFranchise);
  const f = t.form.fields;
  const contact = team.concat(founders).find((p) => p.id === t.contact.personId);

  return (
    <>
      <PageHero
        eyebrow={<span lang="en">{t.hero.eyebrow}</span>}
        image={{ url: "/images/franchise/hero.jpg", alt: t.hero.imageAlt }}
        lead={t.hero.lead}
        actions={
          <>
            <Button href="#anfrage" variant="primary" size="md" data-track="franchise_hero_cta">
              {t.hero.ctaPrimary}
            </Button>
            <Button href="#ablauf" variant="outline" size="md">
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
                <div className="group h-full rounded-[20px] border border-fg/10 bg-raised pad-card transition-all duration-300 hover:-translate-y-1 hover:border-magenta-500/50">
                  <BrandIcon name={b.icon} />
                  <h3 className="mt-6 font-display text-2xl font-extrabold italic uppercase md:text-3xl">{b.title}</h3>
                  <p className="mt-3 text-fg/70">{b.text}</p>
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
            <div className="relative h-full overflow-hidden rounded-[28px] bg-brandbook-gradient pad-banner">
              <div className="absolute inset-0 bg-court-lines opacity-60" aria-hidden />
              <div className="relative">
                <p className="text-[13px] font-semibold uppercase tracking-[0.16em] text-fg/85">{t.partnership.weProvideLabel}</p>
                <ul className="mt-6 space-y-4">
                  {t.partnership.weProvide.map((item) => (
                    <li key={item} className="flex gap-3 text-base md:text-lg">
                      <span className="mt-0.5 grid size-6 shrink-0 place-items-center rounded-full bg-fg text-purple-700">
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
            <div className="h-full rounded-[28px] border border-fg/10 bg-raised pad-banner">
              <p className="text-[13px] font-semibold uppercase tracking-[0.16em] text-fg/70">{t.partnership.youBringLabel}</p>
              <ul className="mt-6 space-y-4">
                {t.partnership.youBring.map((item) => (
                  <li key={item} className="flex gap-3 text-base text-fg/85 md:text-lg">
                    <span className="mt-0.5 grid size-6 shrink-0 place-items-center rounded-full border border-fg/25">
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

      {/* Services per phase (padelcity.de/franchise) */}
      <Section>
        <SectionIntro eyebrow={t.phases.eyebrow} title={t.phases.title} />
        <ol className="grid gap-4 md:grid-cols-3 md:gap-5">
          {t.phases.items.map((ph, i) => (
            <li key={ph.title}>
              <Reveal delay={i * 0.07} className="h-full">
                <div className="h-full rounded-[24px] border border-fg/10 bg-raised pad-panel">
                  <span className="text-[13px] font-semibold uppercase tracking-[0.25em] text-fg/60">0{i + 1}</span>
                  <h3 className="mt-2 font-display text-4xl font-extrabold italic uppercase leading-none text-brand-gradient">{ph.title}</h3>
                  <ul className="mt-6 space-y-3 border-t border-fg/10 pt-6">
                    {ph.items.map((item) => {
                      const text = typeof item === "string" ? item : item.text;
                      return (
                        <li key={text} className="flex gap-3 text-fg/85">
                          <Check className="mt-1 size-4 shrink-0 text-accent-fg" aria-hidden />
                          <span>
                            {text}
                            {typeof item !== "string" && <span className="text-fg/55"> ({t.phases.optional})</span>}
                          </span>
                        </li>
                      );
                    })}
                  </ul>
                </div>
              </Reveal>
            </li>
          ))}
        </ol>
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
                  {/* Two reserved title lines only on tablet, where titles wrap; on desktop they fit one line */}
                  <h3 className="font-display text-2xl font-extrabold italic uppercase leading-none md:min-h-[2lh] md:text-xl lg:min-h-0 lg:text-2xl">{s.title}</h3>
                  <p className="mt-3 text-sm leading-relaxed text-fg/70">{s.text}</p>
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
                <InfoTile
                  label={r.title}
                  text={r.text}
                  value={
                    // Söhne Schmal italic has no clean "×" – set it upright in Poppins with some air
                    r.value.split("×").map((part, i) => (
                      <span key={i}>
                        {i > 0 && <span className="mx-[0.12em] inline-block align-[0.08em] font-sans text-[0.6em] font-semibold not-italic">×</span>}
                        {part.trim()}
                      </span>
                    ))
                  }
                />
              </Reveal>
            </li>
          ))}
        </ul>
      </Section>

      {/* Live franchise clubs */}
      {franchiseClubs.length > 0 && (
        <Section>
          <SectionIntro eyebrow={`${franchiseClubs.length} ${t.clubs.eyebrowSuffix}`} title={t.clubs.title} lead={t.clubs.lead} />
          <ul className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {franchiseClubs.map((c, i) => (
              <li key={c.id} className="min-w-0">
                <Reveal delay={i * 0.05} className="h-full">
                  <ClubPoster club={c} locale={locale} fill />
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
            <p className="mt-6 max-w-md text-lg text-fg/70">{t.form.text}</p>
            <ul className="mt-8 space-y-3 text-fg/70">
              {t.form.checks.map((c) => (
                <li key={c} className="flex gap-3">
                  <Check className="mt-1 size-4 shrink-0 text-accent-fg" aria-hidden /> {c}
                </li>
              ))}
            </ul>
            {contact && (
              <figure className="mt-10 flex items-center gap-5 rounded-[24px] border border-fg/10 bg-raised pad-card">
                {contact.image && (
                  <Media src={contact.image} alt={contact.name} className="size-20 shrink-0 rounded-full md:size-24" imgClassName="object-[50%_20%]" sizes="96px" />
                )}
                <figcaption>
                  <span className="block text-[13px] font-semibold uppercase tracking-[0.16em] text-fg/60">{t.contact.label}</span>
                  <span className="mt-1 block font-display text-3xl font-extrabold italic uppercase leading-none">{contact.name}</span>
                  <span className="mt-1 block text-fg/70">{contact.role[locale]}</span>
                </figcaption>
              </figure>
            )}
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
