import Link from "next/link";
import { ArrowUpRight, Sparkles, Star } from "lucide-react";
import { site, stores } from "@/lib/site";
import type { Locale } from "@/lib/i18n/config";
import { localeTags } from "@/lib/i18n/config";
import { href } from "@/lib/i18n/routes";
import { appContent } from "@/lib/content/app";
import { Section } from "@/components/ui/Section";
import { Accent, Eyebrow, Headline, Lead } from "@/components/ui/Headline";
import { Button } from "@/components/ui/Button";
import { StoreBadges } from "@/components/ui/StoreBadges";
import { Reveal } from "@/components/ui/Reveal";
import { AppPhone } from "@/components/play/app/AppPhone";
import { StoreGallery } from "@/components/play/app/StoreGallery";
import { QrPlaceholder } from "@/components/play/QrPlaceholder";
import { FeatureStory } from "@/components/play/FeatureStory";
import { Faq } from "@/components/play/Faq";

function appJsonLd(locale: Locale) {
  const t = appContent[locale];
  return {
    "@context": "https://schema.org",
    "@type": "MobileApplication",
    name: "PadelCity – Let's play Padel!",
    description: t.meta.description,
    inLanguage: localeTags[locale].lang,
    url: new URL(href(locale, "app"), site.url).toString(),
    operatingSystem: "iOS, Android",
    applicationCategory: "SportsApplication",
    offers: { "@type": "Offer", price: 0, priceCurrency: "EUR" },
    installUrl: [stores.ios, stores.android],
    publisher: { "@type": "Organization", name: site.name, url: site.url },
    // No aggregateRating: ratings live in two stores (App Store / Google Play) and can't be merged honestly.
  };
}

// Contentful: page "app" (modules: appHero, featureStory, appStoreGallery, socialProof, howItWorks, faq, appFinalCta)
/** App landing page – shared by /app (de) and /en/app (en). */
export function AppView({ locale }: { locale: Locale }) {
  const t = appContent[locale];

  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(appJsonLd(locale)) }} />

      {/* Contentful module: appHero */}
      <section className="relative isolate overflow-hidden pb-20 pt-32 md:pt-40 lg:min-h-[100svh] lg:pb-24 lg:pt-44">
        <div className="absolute inset-0 -z-10 bg-brandbook-gradient" />
        <div className="absolute inset-0 -z-10 bg-gradient-to-b from-ink-800/40 via-purple-900/40 to-ink-800" />
        <div className="absolute inset-0 -z-10 bg-court-lines opacity-50" />
        <div className="absolute inset-0 -z-10 bg-grain" />
        <div className="container-site grid items-center gap-14 lg:grid-cols-[1.2fr_1fr]">
          <div>
            <Eyebrow className="mb-6">{t.hero.eyebrow}</Eyebrow>
            <Headline as="h1" size="lg">
              {t.hero.title} <Accent>{t.hero.accent}</Accent>
            </Headline>
            <Lead className="mt-6">{t.hero.lead}</Lead>
            <div id="download" className="mt-10 flex scroll-mt-28 flex-col gap-6 md:flex-row md:items-center">
              <StoreBadges locale={locale} />
              <QrPlaceholder className="hidden lg:flex" labels={t.qr} />
            </div>
            {/* TODO(content): real QR code (Adjust smart link) */}
            <p className="mt-6 text-sm text-white/70">{t.hero.note}</p>
          </div>
          <div className="relative flex justify-center md:-translate-x-16 lg:-translate-x-10">
            <div className="absolute top-1/2 size-[360px] -translate-y-1/2 rounded-full bg-magenta-500/40 blur-[110px] md:size-[480px]" aria-hidden />
            <div className="relative">
              <AppPhone
                shot={t.screens[t.hero.phoneBack]}
                prefix={t.phoneLabel}
                className="!absolute left-[62%] top-14 hidden !w-[230px] rotate-6 opacity-90 md:block lg:!w-[250px]"
                sizes="250px"
              />
              <AppPhone shot={t.screens[t.hero.phoneFront]} prefix={t.phoneLabel} className="relative -rotate-3 md:w-[300px]" sizes="300px" priority />
            </div>
          </div>
        </div>
      </section>

      {/* Contentful module: featureStory */}
      <Section tone="ink">
        <div className="mb-14 max-w-2xl lg:mb-0">
          <Eyebrow className="mb-4">{t.features.eyebrow}</Eyebrow>
          <Headline size="md">{t.features.title}</Headline>
        </div>
        <FeatureStory features={t.features.items} screens={t.screens} coachCard={t.coachCard} phonePrefix={t.phoneLabel} locale={locale} />
      </Section>

      {/* Contentful module: appStoreGallery (official App Store screenshots) */}
      <Section tone="ink" className="!pt-0">
        <div className="mb-10 flex flex-col gap-6 md:flex-row md:items-end md:justify-between">
          <div className="max-w-2xl">
            <Eyebrow className="mb-4">{t.gallery.eyebrow}</Eyebrow>
            <Headline size="md">{t.gallery.title}</Headline>
            <p className="mt-4 text-white/70">{t.gallery.text}</p>
          </div>
          <Button href={stores.ios} variant="outline" className="w-fit shrink-0" data-track="app_gallery_appstore_click">
            {t.gallery.cta}
          </Button>
        </div>
        <StoreGallery panels={t.gallery.panels} labels={t.gallery} />
      </Section>

      {/* Contentful module: socialProof (real store ratings, dated; no testimonials) */}
      <Section tone="black">
        <div className="grid gap-10 lg:grid-cols-[1fr_2fr] lg:items-start">
          <div>
            <Eyebrow className="mb-4">{t.socialProof.eyebrow}</Eyebrow>
            <Headline size="md">{t.socialProof.title}</Headline>
            <ul className="mt-8 grid grid-cols-2 gap-3">
              {t.socialProof.ratings.map((r) => (
                <li key={r.store}>
                  <a
                    href={r.store === "App Store" ? stores.ios : stores.android}
                    target="_blank"
                    rel="noopener noreferrer"
                    data-track={r.track}
                    aria-label={t.socialProof.ratingsLabel(r.value, r.store, r.count)}
                    className="block h-full rounded-[20px] border border-white/10 bg-ink-700 p-5 transition-transform hover:-translate-y-0.5"
                  >
                    <p className="flex items-center gap-2 font-display text-4xl font-extrabold italic">
                      {r.value} <Star className="size-6 fill-white text-white" aria-hidden />
                    </p>
                    <p className="mt-1 text-sm text-white/70">{r.store}</p>
                    <p className="text-sm text-white/70">{r.count}</p>
                  </a>
                </li>
              ))}
            </ul>
            <p className="mt-3 text-xs text-white/60">{t.socialProof.asOf}</p>
          </div>
          <ul className="grid gap-5 md:grid-cols-3 lg:grid-cols-2 xl:grid-cols-3">
            {t.socialProof.promises.map((p, i) => (
              <Reveal key={p.title} delay={i * 0.06} className="h-full">
                <li className="flex h-full flex-col rounded-[20px] border border-white/10 bg-ink-700 p-6">
                  <span className="grid size-10 place-items-center rounded-full bg-brand-gradient">
                    <Sparkles className="size-5" aria-hidden />
                  </span>
                  <p className="mt-5 font-display text-2xl font-extrabold uppercase italic leading-none">{p.title}</p>
                  <p className="mt-3 text-white/70">{p.text}</p>
                </li>
              </Reveal>
            ))}
          </ul>
        </div>
      </Section>

      {/* Contentful module: howItWorks */}
      <Section tone="ink">
        <Eyebrow className="mb-4">{t.how.eyebrow}</Eyebrow>
        <Headline size="md" className="mb-12">
          {t.how.title}
        </Headline>
        <ol className="grid gap-5 md:grid-cols-3">
          {t.how.steps.map((s, i) => (
            <Reveal key={s.step} delay={i * 0.08} className="h-full">
              <li className="relative h-full overflow-hidden rounded-[20px] border border-white/10 bg-ink-700 p-6 md:p-8">
                <span className="absolute -right-2 -top-6 font-display text-[120px] font-extrabold italic leading-none text-white/[0.04]" aria-hidden>
                  {s.step}
                </span>
                <span className="font-display text-5xl font-extrabold italic text-brand-gradient">{s.step}</span>
                <h3 className="mt-4 text-xl font-semibold md:min-h-[2lh]">{s.title}</h3>
                <p className="mt-2 text-white/70">{s.text}</p>
              </li>
            </Reveal>
          ))}
        </ol>
      </Section>

      {/* Contentful module: faq */}
      <Section tone="black">
        <div className="grid gap-10 lg:grid-cols-[1fr_1.6fr]">
          <div>
            <Eyebrow className="mb-4">{t.faqSection.eyebrow}</Eyebrow>
            <Headline size="md">{t.faqSection.title}</Headline>
            <Link href={href(locale, "faq")} className="group mt-6 inline-flex min-h-11 items-center gap-2 text-sm font-medium text-white/80 hover:text-white">
              {t.faqSection.all}
              <ArrowUpRight className="size-4 transition-transform group-hover:rotate-45" aria-hidden />
            </Link>
          </div>
          <Faq items={t.faq} />
        </div>
      </Section>

      {/* Contentful module: appFinalCta */}
      <Section tone="purple" className="overflow-hidden">
        <div className="absolute inset-0 bg-court-lines opacity-60" aria-hidden />
        <div className="relative grid items-center gap-12 md:grid-cols-[1.3fr_1fr]">
          <div>
            <Headline size="lg">
              {t.final.title} <Accent>{t.final.accent}</Accent>
            </Headline>
            <p className="mt-6 max-w-lg text-lg text-white/80">{t.final.text}</p>
            <div className="mt-8 flex flex-col gap-5">
              <StoreBadges locale={locale} />
              <Button href={href(locale, "locations")} variant="primary" size="md" className="w-fit">
                {t.final.clubs}
              </Button>
            </div>
          </div>
          <div className="hidden justify-center md:flex">
            <AppPhone shot={t.screens[t.final.phone]} prefix={t.phoneLabel} className="rotate-3" sizes="300px" />
          </div>
        </div>
      </Section>
    </>
  );
}
