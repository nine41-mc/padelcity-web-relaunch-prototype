import { Star } from "lucide-react";
import { site, stores } from "@/lib/site";
import type { Locale } from "@/lib/i18n/config";
import { localeTags } from "@/lib/i18n/config";
import { href } from "@/lib/i18n/routes";
import { appContent } from "@/lib/content/app";
import { Section } from "@/components/ui/Section";
import { Accent, Headline, Lead } from "@/components/ui/Headline";
import { Button } from "@/components/ui/Button";
import { StoreBadges } from "@/components/ui/StoreBadges";
import { AppPhone } from "@/components/play/app/AppPhone";
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
    url: `${site.url}${href(locale, "app")}/`,
    operatingSystem: "iOS, Android",
    applicationCategory: "SportsApplication",
    offers: { "@type": "Offer", price: 0, priceCurrency: "EUR" },
    installUrl: [stores.ios, stores.android],
    publisher: { "@type": "Organization", name: site.name, url: site.url },
    // No aggregateRating: ratings live in two stores (App Store / Google Play) and can't be merged honestly.
  };
}

// Contentful: page "app" (modules: appHero, featureStory, socialProof, faq)
/** App landing page – shared by /app (de) and /en/app (en). */
export function AppView({ locale }: { locale: Locale }) {
  const t = appContent[locale];

  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(appJsonLd(locale)) }} />

      {/* Contentful module: appHero */}
      <section data-theme="dark" className="relative isolate overflow-hidden pb-20 pt-32 md:pt-40 lg:min-h-[100svh] lg:pb-24 lg:pt-44">
        <div className="absolute inset-0 -z-10 bg-brandbook-gradient" />
        <div className="absolute inset-0 -z-10 bg-gradient-to-b from-ink-800/40 via-purple-900/40 to-ink-800" />
        <div className="absolute inset-0 -z-10 bg-court-lines opacity-50" />
        <div className="absolute inset-0 -z-10 bg-grain" />
        <div className="container-site grid items-center gap-14 lg:grid-cols-[1.2fr_1fr]">
          <div>
            <Headline as="h1" size="lg">
              {t.hero.title} <Accent>{t.hero.accent}</Accent>
            </Headline>
            <Lead className="mt-6">{t.hero.lead}</Lead>
            {/* Store ratings (real, dated) right in the hero – socialProof module */}
            <ul className="mt-8 flex flex-wrap gap-3">
              {t.socialProof.ratings.map((r) => (
                <li key={r.store}>
                  <a
                    href={r.store === "App Store" ? stores.ios : stores.android}
                    target="_blank"
                    rel="noopener noreferrer"
                    data-track={r.track}
                    className="flex items-center gap-3 rounded-full border border-fg/20 bg-canvas-deep/30 py-2 pl-4 pr-5 backdrop-blur transition-colors hover:border-fg/50"
                  >
                    <span className="flex items-center gap-1.5 font-display text-2xl font-extrabold italic leading-none">
                      {r.value} <Star className="size-4 fill-fg text-fg" aria-hidden />
                      {/* name = visible text + "von 5 Sternen" (WCAG 2.5.3) */}
                      <span className="sr-only"> {t.socialProof.outOf} </span>
                    </span>
                    <span className="text-sm leading-tight text-fg/80">
                      {r.store}
                      <span className="block text-xs text-fg/60">{r.count}</span>
                    </span>
                  </a>
                </li>
              ))}
            </ul>
            <div id="download" className="mt-10 scroll-mt-28">
              <StoreBadges locale={locale} campaign="app-landing-page" />
            </div>
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
        <FeatureStory features={t.features.items} screens={t.screens} callouts={t.callouts} phonePrefix={t.phoneLabel} />
      </Section>

      {/* Contentful module: faq */}
      <Section tone="black">
        <div className="grid gap-10 lg:grid-cols-[1fr_1.6fr]">
          <div>
            <Headline size="md">{t.faqSection.title}</Headline>
            <Button href={href(locale, "faq")} variant="outline" className="mt-6 w-fit">
              {t.faqSection.all}
            </Button>
          </div>
          <Faq items={t.faq} />
        </div>
      </Section>
    </>
  );
}
