import { Button } from "@/components/ui/Button";
import { Mail } from "lucide-react";
import type { Locale } from "@/lib/i18n/config";
import { localeTags } from "@/lib/i18n/config";
import { href } from "@/lib/i18n/routes";
import { site } from "@/lib/site";
import { faqContent } from "@/lib/content/faq";
import { getFaq } from "@/lib/data/faq";
import { PageHero } from "@/components/modules/PageHero";
import { AppCta } from "@/components/modules/AppCta";
import { Section } from "@/components/ui/Section";
import { Accent, Eyebrow, Headline } from "@/components/ui/Headline";
import { FaqExplorer } from "@/components/faq/FaqExplorer";

// Contentful: page "faq" (modules: pageHero, faqExplorer, contactTeaser, appCta)
/** General FAQ – shared by /faq (de) and /en/faq (en). Club pages link here instead of carrying their own FAQ. */
export async function FaqView({ locale }: { locale: Locale }) {
  const t = faqContent[locale];
  const faq = await getFaq(locale);

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    inLanguage: localeTags[locale].lang,
    url: `${site.url}${href(locale, "faq")}/`,
    mainEntity: faq.categories.flatMap((c) =>
      c.items.map((i) => ({ "@type": "Question", name: i.q, acceptedAnswer: { "@type": "Answer", text: i.a } })),
    ),
  };

  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd).replace(/</g, "\\u003c") }} />
      <PageHero eyebrow={t.hero.eyebrow} lead={t.hero.lead} image={{ url: "/images/hero/community.jpg", alt: t.hero.imageAlt }} className="lg:min-h-[56vh]">
        {t.hero.title} <Accent>{t.hero.accent}</Accent>
      </PageHero>

      <Section tone="ink" className="!pt-6 md:!pt-10">
        <FaqExplorer categories={faq.categories} labels={t.explorer} />
        {faq.source === "api" && <p className="mt-10 text-xs text-white/50">{t.explorer.sourceApi}</p>}
      </Section>

      {/* Contentful module: contactTeaser */}
      <Section tone="black">
        <div className="grid gap-8 md:grid-cols-[1.2fr_1fr] md:items-end md:gap-12">
          <div>
            <Eyebrow className="mb-4">{t.contact.eyebrow}</Eyebrow>
            <Headline size="md">
              {t.contact.title} <Accent>{t.contact.accent}</Accent>
            </Headline>
            <p className="mt-5 max-w-lg text-white/70">{t.contact.text}</p>
          </div>
          <div className="flex flex-col gap-3 md:items-end">
            <a
              href={`mailto:${site.email}?subject=${encodeURIComponent(t.contact.mailSubject)}`}
              data-track="faq_contact_click"
              className="flex min-h-11 w-full items-center gap-3 rounded-2xl border border-white/15 px-4 py-3 transition hover:border-white/40 hover:bg-white/5 md:w-auto"
            >
              <span className="grid size-10 shrink-0 place-items-center rounded-full bg-brand-gradient">
                <Mail className="size-4" aria-hidden />
              </span>
              <span className="min-w-0">
                <span className="block text-[11px] font-semibold uppercase tracking-[0.14em] text-white/60">{t.contact.mail}</span>
                <span className="block break-all">{site.email}</span>
              </span>
            </a>
            <Button href={href(locale, "locations")} variant="outline" className="w-fit">
              {t.contact.locations}
            </Button>
          </div>
        </div>
      </Section>

      <Section tone="ink">
        <AppCta locale={locale} campaign="faq-page" />
      </Section>
    </>
  );
}
