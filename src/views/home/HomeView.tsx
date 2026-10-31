import { keepTogether } from "@/lib/typography";
import { HighlightDemo } from "@/components/home/HighlightDemo";
import { ClaimDemo } from "@/components/home/ClaimDemo";
import { claimLang } from "@/lib/i18n/claims";
import { SocialWall } from "@/components/modules/SocialWall";
import { WhatsAppGroups } from "@/components/community/WhatsAppGroups";
import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { formatPrice } from "@/lib/format";
import { getClubs, getEvents, getPlannedClubs } from "@/lib/data";
import { keyFacts } from "@/lib/content/partners";
import type { Locale } from "@/lib/i18n/config";
import { localeTags } from "@/lib/i18n/config";
import { href } from "@/lib/i18n/routes";
import { homeContent } from "@/lib/content/home";
import { HomeHero } from "@/components/home/HomeHero";
import { CountUp } from "@/components/home/CountUp";
import { GermanyMap } from "@/components/home/GermanyMap";
import { ClubShowcase } from "@/components/home/ClubShowcase";
import { EventSignup } from "@/components/events/EventSignup";
import { VoucherCard } from "@/components/brand/VoucherCard";
import { deeplinks } from "@/lib/site";
import { getDictionary } from "@/lib/i18n/dictionaries";
import { EventCard } from "@/components/cards/EventCard";
import { ArticleCard } from "@/components/brand/ArticleCard";
import { getArticles } from "@/lib/content/magazin";
import { AppCta } from "@/components/modules/AppCta";
import { PartnerBand } from "@/components/modules/PartnerBand";
import { Testimonials } from "@/components/modules/Testimonials";
import { Button } from "@/components/ui/Button";
import { Accent, Eyebrow, Headline, Lead } from "@/components/ui/Headline";
import { Marquee } from "@/components/ui/Marquee";
import { Media } from "@/components/ui/Media";
import { Reveal } from "@/components/ui/Reveal";
import { Section } from "@/components/ui/Section";

/** Home page – shared by / (de) and /en (en). */
export async function HomeView({ locale }: { locale: Locale }) {
  const t = homeContent[locale];
  const intl = localeTags[locale].intl;
  const clubs = await getClubs(locale);
  const events = (await getEvents({ locale })).filter((e) => e.type !== "hero").slice(0, 3);
  const heroEvent = (await getEvents({ locale })).find((e) => e.isHighlighted);
  // TODO(data): move behind @/lib/data (getArticles) once the Contentful adapter exists.
  const articles = getArticles(locale).slice(0, 3);
  const planned = await getPlannedClubs(locale);
  // Countries with live clubs (DE · AT · PL), derived from data.
  const countries = [...new Set(clubs.map((c) => c.country))].sort((a, b) => (a === "DE" ? -1 : b === "DE" ? 1 : a.localeCompare(b)));
  // Curated selection (Contentful module clubShowcase → referenced clubs); fill up with clubs that have a photo.
  const curated = t.showcase.slugs.map((slug) => clubs.find((c) => c.slug === slug)).filter((c) => c !== undefined);
  const showcase = [...curated, ...clubs.filter((c) => c.mainImage && !curated.includes(c))].slice(0, 8);
  // Newcomer block: lowest court price of the euro clubs (the Polish clubs price in złoty)
  const euroPrices = clubs.filter((c) => (c.currency ?? "EUR") === "EUR" && c.defaultPricePerHour).map((c) => c.defaultPricePerHour as number);
  const lowestPrice = euroPrices.length ? formatPrice(Math.min(...euroPrices), locale) : "";
  const newbieLinks: Record<string, string> = {
    rules: href(locale, "magazine", "padel-regeln-in-5-minuten"),
    gear: href(locale, "faq"),
    cost: href(locale, "locations"),
    book: `${href(locale, "academy")}#programme`,
  };

  return (
    <>
      {/* Brand discussion: click a highlight element to compare highlight colours (Optic Yellow, Purple, Magenta, Türkis) */}
      {/* Comparison switches for the brand discussion (home only): highlight colour and claim */}
      <div data-capture-hide className="fixed bottom-4 left-4 z-50 flex max-w-[calc(100vw-6rem)] items-center gap-2">
        <HighlightDemo locale={locale} />
        <ClaimDemo locale={locale} />
      </div>
      <HomeHero locale={locale} t={t.hero} />

      {/* Momentum ticker */}
      <div className="relative z-10 -rotate-1 bg-brand-gradient py-3 text-white shadow-glow md:py-4">
        <Marquee>
          {t.ticker.map((item) => (
            <span key={item} lang={claimLang(item)} className="flex items-center gap-8 px-4 font-display text-2xl font-extrabold italic uppercase md:text-3xl">
              {/* The claim follows the claim comparison (ClaimDemo) */}
              {item === "Make some noise for Padel" ? (
                <>
                  <span data-claim-variant="noise">{item}</span>
                  <span data-claim-variant="serve">We serve. You play.</span>
                </>
              ) : (
                item
              )}{" "}<span className="inline-block size-[0.26em] translate-y-[0.03em] rounded-full bg-white/70" aria-hidden />
            </span>
          ))}
        </Marquee>
      </div>

      {/* Leader / numbers + map */}
      <Section className="overflow-hidden">
        <div className="grid items-center gap-14 lg:grid-cols-[0.95fr_1.05fr]">
          <div>
            <Reveal>
              <Eyebrow>{t.leader.eyebrow}</Eyebrow>
              <Headline className="mt-6">
                {t.leader.title} <Accent>{t.leader.accent}</Accent> {t.leader.titleEnd}
              </Headline>
              <Lead className="mt-6">
                {t.leader.text}
              </Lead>
            </Reveal>
            <dl className="mt-12 grid grid-cols-2 gap-x-6 gap-y-10 md:grid-cols-4 lg:grid-cols-2 xl:grid-cols-4">
              {[
                { v: keyFacts.clubs, s: "+", l: t.leader.facts.clubs },
                { v: keyFacts.courts, s: "+", l: t.leader.facts.courts },
                { v: keyFacts.cities, s: "+", l: t.leader.facts.cities },
                { v: countries.length, s: "", l: t.leader.facts.countries },
              ].map((f, i) => (
                <Reveal key={f.l} delay={i * 0.08}>
                  <dt className="text-sm font-medium uppercase tracking-[0.14em] text-fg/80">{f.l}</dt>
                  <dd className="mt-1 font-display text-6xl font-extrabold italic text-fg md:text-7xl">
                    <CountUp to={f.v} suffix={f.s} intl={intl} />
                  </dd>
                </Reveal>
              ))}
            </dl>
            {/* Public key figures approved by Marketing: 30+ clubs, 200+ courts, 25+ cities */}
            {/* The only company link on the home page – partners, franchise, investors and jobs live on the hub */}
            <Button href={href(locale, "company")} variant="outline" className="mt-10 w-fit">
              {t.leader.company}
            </Button>
          </div>
          <Reveal delay={0.1} className="mx-auto w-full max-w-xl lg:max-w-none">
            <GermanyMap clubs={clubs} planned={planned} locale={locale} label={t.leader.mapLabel} hint={t.leader.mapHint} legend={t.leader.legend} />
          </Reveal>
        </div>
      </Section>

      {/* Club showcase */}
      <section className="relative bg-canvas-deep py-20 md:py-28">
        <div className="container-site mb-10 flex flex-col gap-6 md:flex-row md:items-end md:justify-between">
          <Reveal>
            <Eyebrow>{t.showcase.eyebrow}</Eyebrow>
            <Headline className="mt-6">
              {t.showcase.title} <Accent>{t.showcase.accent}</Accent>
            </Headline>
          </Reveal>
        </div>
        {/* "Alle Standorte" sits in one line with the carousel arrows */}
        <ClubShowcase
          clubs={showcase}
          locale={locale}
          labels={t.showcase}
          action={
            <Button href={href(locale, "locations")} variant="outline">
              {t.showcase.all}
            </Button>
          }
        />
      </section>

      {/* First time padel? Four steps for newcomers (team feedback m-5) */}
      <Section>
        <Reveal className="max-w-3xl">
          <Eyebrow>{t.newbies.eyebrow}</Eyebrow>
          <Headline className="mt-6">
            {t.newbies.title} <Accent>{t.newbies.accent}</Accent>
          </Headline>
          <Lead className="mt-6">{t.newbies.lead}</Lead>
        </Reveal>
        <ol className="mt-12 grid gap-4 md:grid-cols-2 lg:grid-cols-4">
          {t.newbies.steps.map((step, i) => (
            <li key={step.key} className="h-full">
              <Reveal delay={i * 0.06} className="flex h-full flex-col rounded-[24px] border border-fg/10 bg-raised pad-card">
                <span className="font-display text-5xl font-extrabold italic leading-none text-fg/25" aria-hidden>
                  {i + 1}
                </span>
                <h3 className="mt-5 font-display text-2xl font-extrabold italic uppercase">{step.title}</h3>
                <p className="mt-2 flex-1 text-fg/85">{step.key === "cost" ? step.text.replace("{price}", lowestPrice) : step.text}</p>
                <Link href={newbieLinks[step.key]} className="mt-5 inline-flex items-center gap-1.5 text-sm font-semibold underline-offset-4 hover:underline">
                  {step.link} <ArrowRight className="size-4" aria-hidden />
                </Link>
              </Reveal>
            </li>
          ))}
        </ol>
      </Section>

      {/* Events */}
      <Section>
        <div className="mb-10 flex flex-col gap-6 md:flex-row md:items-end md:justify-between">
          <Reveal>
            <Eyebrow>{t.events.eyebrow}</Eyebrow>
            <Headline className="mt-6">
              {t.events.title} <Accent>{t.events.accent}</Accent>
            </Headline>
          </Reveal>
          <Button href={href(locale, "events")} variant="outline">
            {t.events.all}
          </Button>
        </div>
        {heroEvent && (
          <Reveal className="mb-6">
            <div data-theme="dark" className="group relative overflow-hidden rounded-[28px]">
              <Media
                src={heroEvent.image?.url}
                alt={heroEvent.image?.alt ?? heroEvent.title}
                className="aspect-[4/5] md:aspect-[21/9]"
                imgClassName="transition-transform duration-[1.2s] group-hover:scale-105"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/95 via-black/55 to-black/10 md:bg-gradient-to-r md:from-black/90 md:via-black/50 md:to-transparent" />
              <div className="absolute inset-0 flex flex-col justify-end p-6 md:max-w-2xl md:p-12">
                <p className="text-sm font-semibold uppercase tracking-[0.14em] text-accent-fg">{t.events.hero} · {heroEvent.city}</p>
                <h3 className="mt-3 font-display text-5xl leading-[0.9] font-extrabold italic uppercase md:text-7xl">
                  <Link href={href(locale, "events", heroEvent.slug)} className="after:absolute after:inset-0 after:content-['']">
                    {keepTogether(heroEvent.title)}
                  </Link>
                </h3>
                {/* The text ends with the lead-in to the buttons ("Jetzt anmelden und buchen:") instead of a separate label */}
                <p className="mt-4 text-lg text-fg/80">
                  {heroEvent.subtitle && <>{heroEvent.subtitle} </>}
                  <span className="whitespace-nowrap">{getDictionary(locale).eventCard.signupLead}</span>
                </p>
                {/* Sign-up (app primary, web outline); the whole teaser links to the detail page */}
                <EventSignup eventId={heroEvent.id} locale={locale} size="md" className="mt-5 max-w-md" />
              </div>
            </div>
          </Reveal>
        )}
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3 lg:gap-6">
          {events.map((e, i) => (
            <Reveal key={e.id} delay={i * 0.06} className={i === 2 ? "md:hidden lg:block" : undefined}>
              <EventCard event={e} locale={locale} className="h-full" />
            </Reveal>
          ))}
        </div>
      </Section>

      {/* News & Magazin – newest articles */}
      <Section tone="black">
        <div className="mb-10 flex flex-col gap-6 md:flex-row md:items-end md:justify-between">
          <Reveal>
            <Eyebrow>{t.news.eyebrow}</Eyebrow>
            <Headline className="mt-6">
              {t.news.title} <Accent>{t.news.accent}</Accent>
            </Headline>
          </Reveal>
          <Button href={href(locale, "magazine")} variant="outline">
            {t.news.all}
          </Button>
        </div>
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3 lg:gap-6">
          {articles.map((a, i) => (
            <Reveal key={a.slug} delay={i * 0.06} className={i === 2 ? "md:hidden lg:block" : undefined}>
              <ArticleCard article={a} locale={locale} />
            </Reveal>
          ))}
        </div>
      </Section>

      {/* Community */}
      <Section className="overflow-hidden">
        <div className="grid items-center gap-12 lg:grid-cols-2">
          <Reveal>
            <Eyebrow>{t.community.eyebrow}</Eyebrow>
            <Headline className="mt-6">
              {t.community.title} <Accent>{t.community.accent}</Accent>
            </Headline>
            <Lead className="mt-6">
              {t.community.text}
            </Lead>
            <div className="mt-8 flex flex-wrap gap-3">
              {/* Opens the overlay with every location's WhatsApp group (no central community link) */}
              <WhatsAppGroups locale={locale} label={t.community.whatsapp} track="whatsapp_join" />
              <Button href={href(locale, "app")} variant="outline">
                {t.community.matches}
              </Button>
            </div>
          </Reveal>
          <div className="grid grid-cols-3 gap-3 md:gap-4">
            {["social-1", "social-2", "social-3", "social-4", "tournament-1", "kids"].map((img, i) => (
              <Reveal key={img} delay={i * 0.05} className={i % 3 === 1 ? "translate-y-8" : undefined}>
                <Media src={`/images/events/${img}.jpg`} alt={t.community.imgAlt} className="aspect-[3/4] rounded-[18px]" sizes="(min-width:1200px) 15vw, 33vw" />
              </Reveal>
            ))}
          </div>
        </div>
      </Section>

      {/* Let the players talk – real testimonials from padelcity.de */}
      <Section tone="black" className="overflow-hidden">
        <Testimonials locale={locale} />
      </Section>

      {/* Instagram image wall */}
      <SocialWall locale={locale} />

      {/* Contentful module: voucherTeaser (copy from padelcity.de) */}
      <Section tone="black">
        <div className="relative grid items-center gap-12 overflow-hidden rounded-[32px] border border-fg/10 bg-canvas pad-banner lg:grid-cols-[1.1fr_1fr] lg:gap-16">
          <div className="absolute -left-24 -top-24 size-80 rounded-full bg-purple-600/30 blur-[110px]" aria-hidden />
          <div className="relative">
            <Eyebrow className="mb-4">{t.shop.eyebrow}</Eyebrow>
            <Headline size="md">
              {t.shop.title}
              <br />
              <Accent>{t.shop.accent}</Accent>
            </Headline>
            <p className="mt-4 text-xl font-semibold">{t.shop.subline}</p>
            <p className="mt-3 max-w-lg text-lg text-fg/70">
              {t.shop.text} {t.shop.closing}
            </p>
            <ol className="mt-6 space-y-3">
              {t.shop.steps.map((step, i) => (
                <li key={step} className="flex items-center gap-3">
                  <span className="grid size-8 shrink-0 place-items-center rounded-full border border-fg/30 font-display text-lg font-extrabold italic">{i + 1}</span>
                  {step}
                </li>
              ))}
            </ol>
            <Button href={deeplinks.vouchers("home-page")} variant="primary" className="mt-8" data-track="home_voucher_cta">
              {t.shop.cta}
            </Button>
          </div>
          <div className="relative mx-auto w-full max-w-[460px] py-6 [perspective:1200px]">
            {/* second card peeking out behind */}
            <div className="absolute inset-x-6 top-0 aspect-[1.586] rotate-[8deg] rounded-[22px] border border-fg/15 bg-surface" aria-hidden />
            <VoucherCard {...t.shop.card} className="relative -rotate-[5deg] transition-transform duration-500 hover:rotate-0 hover:scale-[1.02]" />
          </div>
        </div>
      </Section>

      {/* App CTA */}
      <Section>
        <AppCta locale={locale} campaign="home-page" />
      </Section>

      <PartnerBand locale={locale} />
    </>
  );
}
