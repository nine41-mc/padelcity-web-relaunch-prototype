import { keepTogether } from "@/lib/typography";
import { HighlightDemo } from "@/components/home/HighlightDemo";
import { claimLang } from "@/lib/i18n/claims";
import { SocialWall } from "@/components/modules/SocialWall";
import { WhatsAppGroups } from "@/components/community/WhatsAppGroups";
import Link from "next/link";
import { ArrowUpRight, Building2, Handshake, LineChart, ShoppingBag, Trophy } from "lucide-react";
import { getClubs, getEvents, getPlannedClubs } from "@/lib/data";
import { keyFacts, partners } from "@/lib/content/partners";
import type { Locale } from "@/lib/i18n/config";
import { localeTags } from "@/lib/i18n/config";
import { href, type RouteKey } from "@/lib/i18n/routes";
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
import { AppCta } from "@/components/modules/AppCta";
import { Testimonials } from "@/components/modules/Testimonials";
import { Button } from "@/components/ui/Button";
import { Accent, Eyebrow, Headline, Lead } from "@/components/ui/Headline";
import { Marquee } from "@/components/ui/Marquee";
import { Media } from "@/components/ui/Media";
import { PartnerLogo } from "@/components/ui/PartnerLogo";
import { Reveal } from "@/components/ui/Reveal";
import { Section } from "@/components/ui/Section";

/** Home page – shared by / (de) and /en (en). */
export async function HomeView({ locale }: { locale: Locale }) {
  const t = homeContent[locale];
  const intl = localeTags[locale].intl;
  const clubs = await getClubs(locale);
  const events = (await getEvents({ locale })).filter((e) => e.type !== "hero").slice(0, 3);
  const heroEvent = (await getEvents({ locale })).find((e) => e.isHighlighted);
  const planned = await getPlannedClubs(locale);
  // Countries with live clubs (DE · AT · PL), derived from data.
  const countries = [...new Set(clubs.map((c) => c.country))].sort((a, b) => (a === "DE" ? -1 : b === "DE" ? 1 : a.localeCompare(b)));
  // Curated selection (Contentful module clubShowcase → referenced clubs); fill up with clubs that have a photo.
  const curated = t.showcase.slugs.map((slug) => clubs.find((c) => c.slug === slug)).filter((c) => c !== undefined);
  const showcase = [...curated, ...clubs.filter((c) => c.mainImage && !curated.includes(c))].slice(0, 8);

  return (
    <>
      {/* Brand discussion: click a highlight element to compare highlight colours (Optic Yellow, Purple, Magenta, Türkis) */}
      <HighlightDemo locale={locale} />
      <HomeHero locale={locale} t={t.hero} />

      {/* Momentum ticker */}
      <div className="relative z-10 -rotate-1 bg-optic-500 py-3 text-on-optic shadow-optic md:py-4">
        <Marquee>
          {t.ticker.map((item) => (
            <span key={item} lang={claimLang(item)} className="flex items-center gap-8 px-4 font-display text-2xl font-extrabold italic uppercase md:text-3xl">
              {item} <span className="text-purple-500">●</span>
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
                  <dt className="text-sm font-medium uppercase tracking-[0.14em] text-white/80">{f.l}</dt>
                  <dd className="mt-1 font-display text-6xl font-extrabold italic text-white md:text-7xl">
                    <CountUp to={f.v} suffix={f.s} intl={intl} />
                  </dd>
                </Reveal>
              ))}
            </dl>
            {/* Public key figures approved by Marketing: 30+ clubs, 200+ courts, 25+ cities */}
          </div>
          <Reveal delay={0.1} className="mx-auto w-full max-w-xl lg:max-w-none">
            <GermanyMap clubs={clubs} planned={planned} locale={locale} label={t.leader.mapLabel} hint={t.leader.mapHint} legend={t.leader.legend} />
          </Reveal>
        </div>
      </Section>

      {/* Club showcase */}
      <section className="relative bg-black py-20 md:py-28">
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

      {/* Audience paths: players, partners, investors, franchise */}
      <Section>
        <Reveal>
          <Headline size="md" className="max-w-3xl">
            {t.paths.title} <Accent>{t.paths.accent}</Accent>
          </Headline>
        </Reveal>
        <div className="mt-12 grid gap-4 md:grid-cols-2 lg:grid-cols-4">
          {t.paths.items.map((item, i) => ({
            ...item,
            icon: [Trophy, Handshake, LineChart, Building2][i],
            href: href(locale, item.key as RouteKey),
            tone: i === 0 ? "from-purple-600 to-magenta-700" : "from-ink-500 to-ink-600",
          })).map((c, i) => (
            <Reveal key={c.title} delay={i * 0.06}>
              <Link
                href={c.href}
                className={`group relative flex h-full min-h-64 flex-col justify-between overflow-hidden rounded-[24px] border border-white/10 bg-gradient-to-br ${c.tone} p-6 transition-all duration-300 hover:-translate-y-1 hover:border-white/40`}
              >
                <c.icon className="size-8 text-white" aria-hidden />
                <div>
                  <h3 className="font-display text-3xl font-extrabold italic uppercase">{c.title}</h3>
                  <p className="mt-2 text-white/85 md:min-h-[3lh]">{c.text}</p>
                </div>
                <span className="absolute right-5 top-5 grid size-10 place-items-center rounded-full bg-white/10 transition-all group-hover:rotate-45 group-hover:bg-brand-gradient group-hover:text-white">
                  <ArrowUpRight className="size-5" />
                </span>
              </Link>
            </Reveal>
          ))}
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
            <p className="text-xl leading-relaxed text-white/85 md:text-2xl">
              {t.momentum.text}
            </p>
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
            <div className="group relative overflow-hidden rounded-[28px]">
              <Media
                src={heroEvent.image?.url}
                alt={heroEvent.image?.alt ?? heroEvent.title}
                className="aspect-[4/5] md:aspect-[21/9]"
                imgClassName="transition-transform duration-[1.2s] group-hover:scale-105"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/95 via-black/55 to-black/10 md:bg-gradient-to-r md:from-black/90 md:via-black/50 md:to-transparent" />
              <div className="absolute inset-0 flex flex-col justify-end p-6 md:max-w-2xl md:p-12">
                <p className="text-sm font-semibold uppercase tracking-[0.14em] text-magenta-300">{t.events.hero} · {heroEvent.city}</p>
                <h3 className="mt-3 font-display text-5xl leading-[0.9] font-extrabold italic uppercase md:text-7xl">
                  <Link href={href(locale, "events", heroEvent.slug)} className="after:absolute after:inset-0 after:content-['']">
                    {keepTogether(heroEvent.title)}
                  </Link>
                </h3>
                {/* The text ends with the lead-in to the buttons ("Anmelden und buchen:") instead of a separate label */}
                <p className="mt-4 text-lg text-white/80">
                  {heroEvent.subtitle && <>{heroEvent.subtitle} </>}
                  <span className="whitespace-nowrap font-semibold text-white">{getDictionary(locale).eventCard.signupLead}</span>
                </p>
                {/* Equal sign-up options; the whole teaser links to the detail page */}
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

      {/* Academy + Magazin split */}
      <Section tone="black">
        <div className="grid gap-4 lg:grid-cols-2 lg:gap-6">
          {t.split.map((s, i) => (
            <Reveal key={s.key} delay={i * 0.08}>
              <Link href={href(locale, s.key as RouteKey)} className="group relative block overflow-hidden rounded-[28px]">
                <Media src={s.img} alt={s.eyebrow} className="aspect-[4/5] md:aspect-[16/11]" imgClassName="transition-transform duration-[1.2s] group-hover:scale-105" />
                <div className="absolute inset-0 bg-gradient-to-t from-black via-black/45 to-transparent" />
                <div className="absolute inset-x-6 bottom-6 md:inset-x-10 md:bottom-10">
                  <p className="text-sm font-semibold uppercase tracking-[0.14em] text-magenta-300">{s.eyebrow}</p>
                  <h3 className="mt-2 max-w-md font-display text-4xl leading-[0.95] font-extrabold italic uppercase text-balance md:text-5xl lg:min-h-[1.9em]">{s.title}</h3>
                  <span className="mt-5 inline-flex items-center gap-2 text-white/85 group-hover:text-white">
                    {s.cta} <ArrowUpRight className="size-4 transition-transform group-hover:rotate-45" />
                  </span>
                </div>
              </Link>
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

      {/* Contentful module: voucherTeaser (copy from padelcity.de) – merch shop is phase 2 */}
      <Section tone="black">
        <div className="relative grid items-center gap-12 overflow-hidden rounded-[32px] border border-white/10 bg-ink-800 p-6 md:p-12 lg:grid-cols-[1.1fr_1fr] lg:gap-16 lg:p-16">
          <div className="absolute -left-24 -top-24 size-80 rounded-full bg-purple-600/30 blur-[110px]" aria-hidden />
          <div className="relative">
            <Eyebrow className="mb-4">{t.shop.eyebrow}</Eyebrow>
            <Headline size="lg">
              {t.shop.title} <Accent>{t.shop.accent}</Accent>
            </Headline>
            <p className="mt-4 text-xl font-semibold">{t.shop.subline}</p>
            <p className="mt-3 max-w-lg text-lg text-white/70">{t.shop.text}</p>
            <ol className="mt-6 space-y-3">
              {t.shop.steps.map((step, i) => (
                <li key={step} className="flex items-center gap-3">
                  <span className="grid size-8 shrink-0 place-items-center rounded-full border border-white/30 font-display text-lg font-extrabold italic">{i + 1}</span>
                  {step}
                </li>
              ))}
            </ol>
            <p className="mt-6 text-white/70">{t.shop.closing}</p>
            <Button href={deeplinks.vouchers()} variant="primary" className="mt-8" data-track="home_voucher_cta">
              {t.shop.cta}
            </Button>
            <p className="mt-6 flex items-center gap-2 text-sm text-white/60">
              <ShoppingBag className="size-4" aria-hidden /> {t.shop.merch}
            </p>
          </div>
          <div className="relative mx-auto w-full max-w-[460px] py-6 [perspective:1200px]">
            {/* second card peeking out behind */}
            <div className="absolute inset-x-6 top-0 aspect-[1.586] rotate-[8deg] rounded-[22px] border border-white/15 bg-ink-600" aria-hidden />
            <VoucherCard {...t.shop.card} className="relative -rotate-[5deg] transition-transform duration-500 hover:rotate-0 hover:scale-[1.02]" />
          </div>
        </div>
      </Section>

      {/* App CTA */}
      <Section>
        <AppCta locale={locale} />
      </Section>

      {/* Partners */}
      <Section tone="black" bleed className="border-t border-white/10">
        <div className="container-site mb-10 flex flex-col gap-6 md:flex-row md:items-end md:justify-between">
          <Reveal>
            <Eyebrow>{t.partners.eyebrow}</Eyebrow>
            <Headline className="mt-6">
              {t.partners.title} <Accent>{t.partners.accent}</Accent>
            </Headline>
          </Reveal>
          <Button href={href(locale, "partners")} variant="outline">
            {t.partners.cta}
          </Button>
        </div>
        <Marquee>
          {partners.map((p) => (
            <div key={p.name} className="flex h-16 items-center px-7 opacity-60 grayscale transition hover:opacity-100 hover:grayscale-0 md:px-10">
              <PartnerLogo partner={p} className="h-9 max-w-none md:h-10" />
            </div>
          ))}
        </Marquee>
      </Section>
    </>
  );
}
