import type { Metadata } from "next";
import { keepTogether } from "@/lib/typography";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowLeft, CalendarDays, Clock, MapPin, Trophy, Users } from "lucide-react";
import { getClubs, getEvent, getEvents } from "@/lib/data";
import type { Club, ClubEvent } from "@/lib/data/types";
import { site, webApp } from "@/lib/site";
import type { Locale } from "@/lib/i18n/config";
import { localeTags } from "@/lib/i18n/config";
import { alternates, href } from "@/lib/i18n/routes";
import { partners } from "@/lib/content/partners";
import { eventsContent, heroEventContent, localizeEvent, type HeroEventContent } from "@/lib/content/events";
import { AppCta } from "@/components/modules/AppCta";
import { Section } from "@/components/ui/Section";
import { Accent, Eyebrow, Headline, Lead } from "@/components/ui/Headline";
import { EventSignup } from "@/components/events/EventSignup";
import { Button } from "@/components/ui/Button";
import { Chip } from "@/components/ui/Chip";
import { Media } from "@/components/ui/Media";
import { PartnerLogo } from "@/components/ui/PartnerLogo";
import { Reveal } from "@/components/ui/Reveal";
import { StoreBadges } from "@/components/ui/StoreBadges";
import { EventCard } from "@/components/cards/EventCard";
import { Countdown } from "@/components/play/Countdown";
import { LiteYouTube } from "@/components/play/LiteYouTube";
import { formatDateRange } from "@/components/play/eventFormat";

type T = (typeof eventsContent)[Locale];

/* ---------- Route helpers (used by the DE/EN wrappers) ---------- */

export async function eventStaticParams(): Promise<{ slug: string }[]> {
  return (await getEvents()).map((e) => ({ slug: e.slug }));
}

async function loadEvent(slug: string, locale: Locale) {
  const raw = await getEvent(slug);
  return raw ? localizeEvent(raw, locale) : undefined;
}

export async function eventMetadata(slug: string, locale: Locale): Promise<Metadata> {
  const event = await loadEvent(slug, locale);
  if (!event) return {};
  const t = eventsContent[locale];
  const where = event.clubName ?? event.city ?? site.name;
  return {
    // Event names are the same in both locales → localized suffix keeps DE/EN titles distinct.
    title: t.detail.metaTitle(event.title, event.city ?? where),
    description: event.subtitle ?? t.detail.metaDescription(event.title, t.types[event.type], where),
    alternates: alternates("events", slug, locale),
    // openGraph replaces the layout's object → repeat type/locale/siteName
    openGraph: { type: "website", siteName: site.name, locale: localeTags[locale].og, images: event.image ? [{ url: event.image.url, alt: event.image.alt }] : undefined },
  };
}

function eventJsonLd(event: ClubEvent, locale: Locale, club?: Club) {
  return {
    "@context": "https://schema.org",
    "@type": "SportsEvent",
    name: event.title,
    description: event.subtitle,
    inLanguage: localeTags[locale].lang,
    url: new URL(href(locale, "events", event.slug), site.url).toString(),
    sport: "Padel",
    startDate: event.start,
    endDate: event.end ?? event.start,
    eventStatus: "https://schema.org/EventScheduled",
    eventAttendanceMode: "https://schema.org/OfflineEventAttendanceMode",
    image: event.image ? [new URL(event.image.url, site.url).toString()] : undefined,
    location: {
      "@type": "Place",
      name: club?.name ?? event.clubName ?? event.city,
      address: club
        ? {
            "@type": "PostalAddress",
            streetAddress: `${club.address.streetName} ${club.address.buildingNumber}`,
            postalCode: club.address.postalCode,
            addressLocality: club.address.localityName,
            addressCountry: club.country,
          }
        : { "@type": "PostalAddress", addressLocality: event.city, addressCountry: "DE" },
    },
    organizer: { "@type": "Organization", name: site.name, url: site.url },
    // Price only – no availability/capacity (no booking-system data on the website).
    offers: {
      "@type": "Offer",
      url: webApp.event(event.id),
      price: event.pricePerPerson ?? 0,
      priceCurrency: "EUR",
    },
  };
}

/* ---------- Page ---------- */

/** Event detail – shared by /events/[slug] (de) and /en/events/[slug] (en). */
export async function EventDetailView({ slug, locale }: { slug: string; locale: Locale }) {
  const event = await loadEvent(slug, locale);
  if (!event) notFound();

  const t = eventsContent[locale];
  const clubs = await getClubs(locale);
  const club = event.clubId ? clubs.find((c) => c.id === event.clubId || c.slug === event.clubId) : undefined;
  const content = heroEventContent[event.id]?.[locale];

  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(eventJsonLd(event, locale, club)) }} />
      {event.type === "hero" && content ? (
        <HeroEventLayout event={event} club={club} content={content} locale={locale} t={t} />
      ) : (
        <LocalEventLayout event={event} club={club} locale={locale} t={t} />
      )}
    </>
  );
}

/* ---------- Hero events ---------- */

function HeroEventLayout({ event, club, content, locale, t }: { event: ClubEvent; club?: Club; content: HeroEventContent; locale: Locale; t: T }) {
  const eventPartners = content.partnerNames
    .map((n) => partners.find((p) => p.name === n))
    .filter((p): p is (typeof partners)[number] => Boolean(p));
  const dateRange = formatDateRange(event.start, event.end, locale);

  return (
    <>
      {/* Contentful module: eventHero */}
      <section className="relative isolate flex min-h-[100svh] flex-col justify-end overflow-hidden pb-10 pt-36 md:pb-16 lg:pb-20">
        <div className="absolute inset-0 -z-10">
          <Media src={event.image?.url} alt={event.image?.alt ?? event.title} className="h-full w-full" priority />
          <div className="absolute inset-0 bg-gradient-to-t from-ink-800 via-ink-800/70 to-purple-900/50" />
          <div className="absolute inset-0 bg-grain" />
        </div>
        <div className="container-site">
          <Link href={href(locale, "events")} className="mb-8 inline-flex min-h-11 items-center gap-2 text-sm text-white/75 hover:text-white">
            <ArrowLeft className="size-4" aria-hidden /> {t.detail.back}
          </Link>
          <div className="mb-6 flex flex-wrap items-center gap-3">
            <Eyebrow>{dateRange}</Eyebrow>
            {content.presenter && <Chip tone="dark">{content.presenter}</Chip>}
          </div>
          <Headline as="h1" size="xl" className="max-w-6xl">
            {keepTogether(event.title)}
          </Headline>
          <p className="mt-6 font-display text-2xl font-extrabold italic uppercase md:text-4xl">
            {content.claim} <Accent>{content.claimAccent}</Accent>
          </p>
          <div className="mt-10 flex flex-col gap-8 lg:flex-row lg:items-end lg:justify-between">
            <Countdown start={event.start} labels={t.countdown} />
            <div className="flex flex-wrap gap-3">
              <EventSignup eventId={event.id} locale={locale} size="lg" className="w-full sm:w-auto" />
              <Button href="#format" variant="outline" size="lg" arrow={false}>
                {t.detail.formatCta}
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* Contentful module: factGrid */}
      <Section tone="ink" className="!py-12 md:!py-16">
        <dl className="grid grid-cols-2 gap-px overflow-hidden rounded-[20px] border border-white/10 bg-white/10 lg:grid-cols-3">
          <Fact icon={<CalendarDays className="size-5" />} label={t.detail.date} value={dateRange} className="col-span-2 lg:col-span-1" />
          <Fact
            icon={<MapPin className="size-5" />}
            label={t.detail.place}
            value={club ? club.name : event.city ?? t.detail.tba}
            href={club ? href(locale, "locations", club.slug) : undefined}
            className="col-span-2 lg:col-span-1"
          />
          {content.facts.map((f, i) => (
            <Fact key={f.label} icon={i === 0 ? <Trophy className="size-5" /> : i === 1 ? <Clock className="size-5" /> : <Users className="size-5" />} label={f.label} value={f.value} />
          ))}
        </dl>
        <Lead className="mt-12 max-w-3xl">{content.intro}</Lead>
      </Section>

      {/* Contentful module: formatSteps */}
      <Section tone="black" id="format" className="scroll-mt-20">
        <Eyebrow className="mb-4">{t.detail.formatEyebrow}</Eyebrow>
        <Headline size="md" className="mb-12">
          {t.detail.formatTitle}
        </Headline>
        <ol className="grid gap-5 md:grid-cols-3">
          {content.format.map((f, i) => (
            <Reveal key={f.title} delay={i * 0.08}>
              <li className="h-full rounded-[20px] border border-white/10 bg-ink-700 p-6 md:p-8">
                <span className="font-display text-6xl font-extrabold italic text-brand-gradient">0{i + 1}</span>
                <h3 className="mt-4 text-xl font-semibold">{f.title}</h3>
                <p className="mt-2 text-white/70">{f.text}</p>
              </li>
            </Reveal>
          ))}
        </ol>

        <div className="mt-20 grid gap-10 lg:grid-cols-[1fr_2fr]">
          <div>
            <Eyebrow className="mb-4">{t.detail.scheduleEyebrow}</Eyebrow>
            <Headline size="sm">{t.detail.scheduleTitle}</Headline>
            <p className="mt-4 text-white/70">{t.detail.scheduleNote}</p>
          </div>
          <div className="grid gap-5 md:grid-cols-2 xl:grid-cols-3">
            {content.schedule.map((d) => (
              <div key={d.day} className="rounded-[20px] border border-white/10 p-6">
                <p className="font-display text-2xl font-extrabold italic uppercase text-white">{d.day}</p>
                <ul className="mt-4 space-y-3">
                  {d.items.map((it) => (
                    <li key={it.time + it.title} className="flex gap-4 border-t border-white/10 pt-3">
                      <span className="w-14 shrink-0 tabular-nums text-white/70">{it.time}</span>
                      <span>{it.title}</span>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </div>
      </Section>

      {/* Contentful module: videoEmbed */}
      <Section tone="ink">
        <div className="grid items-center gap-10 lg:grid-cols-[1fr_1.6fr]">
          <div>
            <Eyebrow className="mb-4">{t.detail.videoEyebrow}</Eyebrow>
            <Headline size="md">{t.detail.videoTitle}</Headline>
            <p className="mt-4 max-w-md text-white/70">{t.detail.videoNote}</p>
          </div>
          <LiteYouTube title={content.video.title} youtubeId={content.video.youtubeId} thumbnail={content.video.thumbnail} locale={locale} />
        </div>
      </Section>

      {/* Contentful module: partnerLogos */}
      {eventPartners.length > 0 && (
        <Section tone="black" className="!py-16 md:!py-20">
          <p className="mb-8 text-center text-[13px] font-semibold uppercase tracking-[0.14em] text-white/70">{t.detail.partners}</p>
          <ul className="grid grid-cols-2 items-center gap-6 md:grid-cols-5">
            {eventPartners.map((p) => (
              <li key={p.name} className="flex h-20 items-center justify-center rounded-[16px] border border-white/10 px-5 opacity-80 transition-opacity hover:opacity-100">
                <PartnerLogo partner={p} className="h-8 brightness-0 invert" />
              </li>
            ))}
          </ul>
          <p className="mt-8 text-center text-sm text-white/70">
            {t.detail.partnerCta}{" "}
            <Link href={href(locale, "partners")} className="text-white underline-offset-4 hover:underline">
              {t.detail.partnerLink}
            </Link>
          </p>
        </Section>
      )}

      <Section tone="ink">
        <SignupBanner event={event} locale={locale} t={t} />
      </Section>
    </>
  );
}

function Fact({ icon, label, value, href: link, className }: { icon: React.ReactNode; label: string; value: string; href?: string; className?: string }) {
  return (
    <div className={`bg-ink-700 p-5 md:p-6 ${className ?? ""}`}>
      <dt className="flex items-center gap-2 text-[13px] font-semibold uppercase tracking-[0.14em] text-white/70">
        <span className="text-white/70" aria-hidden>
          {icon}
        </span>
        {label}
      </dt>
      <dd className="mt-2 text-lg font-semibold leading-tight">
        {link ? (
          <Link href={link} className="underline-offset-4 hover:underline">
            {value}
          </Link>
        ) : (
          value
        )}
      </dd>
    </div>
  );
}

function SignupBanner({ event, locale, t }: { event: ClubEvent; locale: Locale; t: T }) {
  return (
    <div className="relative overflow-hidden rounded-[28px] bg-brandbook-gradient p-8 md:p-14">
      <div className="absolute inset-0 bg-court-lines opacity-60" aria-hidden />
      <div className="relative grid items-end gap-8 md:grid-cols-[1.4fr_1fr]">
        <div>
          <Headline size="md">
            {t.detail.bannerTitle} <Accent>{t.detail.bannerAccent}</Accent>
          </Headline>
          <p className="mt-4 max-w-lg text-white/80">{t.detail.bannerText(event.title)}</p>
        </div>
        <div className="flex flex-col gap-4 md:items-end">
          <EventSignup eventId={event.id} locale={locale} size="lg" className="w-full md:w-auto" />
          <StoreBadges locale={locale} />
        </div>
      </div>
    </div>
  );
}

/* ---------- Local events ---------- */

async function LocalEventLayout({ event, club, locale, t }: { event: ClubEvent; club?: Club; locale: Locale; t: T }) {
  const more = (await getEvents({ clubId: event.clubId, locale }))
    .filter((e) => e.id !== event.id && e.type !== "hero" && (event.clubId || e.city === event.city))
    .slice(0, 3)
    .map((e) => localizeEvent(e, locale));
  const where = event.clubName ?? event.city ?? site.name;
  const price = event.pricePerPerson
    ? new Intl.NumberFormat(localeTags[locale].intl, { style: "currency", currency: "EUR", maximumFractionDigits: 0 }).format(event.pricePerPerson)
    : t.detail.free;

  return (
    <>
      <section className="relative pt-32 md:pt-40">
        <div className="container-site">
          <Link href={href(locale, "events")} className="mb-6 inline-flex min-h-11 items-center gap-2 text-sm text-white/75 hover:text-white">
            <ArrowLeft className="size-4" aria-hidden /> {t.detail.back}
          </Link>
          <div className="grid gap-8 lg:grid-cols-[1.5fr_1fr] lg:gap-12">
            <div>
              <Media
                src={event.image?.url}
                alt={event.image?.alt ?? event.title}
                className="aspect-[16/10] rounded-[28px] md:aspect-[16/9]"
                priority
                sizes="(min-width:1200px) 60vw, 100vw"
              />
              <div className="mt-8 flex flex-wrap gap-2">
                <Chip tone="gradient">{t.types[event.type]}</Chip>
                {event.level && <Chip tone="level">{event.level}</Chip>}
                {event.recurrence && <Chip>{event.recurrence}</Chip>}
              </div>
              <Headline as="h1" size="lg" className="mt-5">
                {keepTogether(event.title)}
              </Headline>
              <Lead className="mt-5">{event.subtitle ?? t.detail.fallbackDescription(t.types[event.type], where)}</Lead>
              <div className="mt-10 grid gap-4 md:grid-cols-3">
                {t.detail.steps.map((s) => (
                  <div key={s.title} className="rounded-[20px] border border-white/10 p-5">
                    <p className="font-display text-xl font-extrabold italic uppercase">{s.title}</p>
                    <p className="mt-2 text-sm text-white/70">{s.text}</p>
                  </div>
                ))}
              </div>
            </div>

            {/* Contentful module: eventSignupCard (info + deep link; no capacity/places left) */}
            <aside className="lg:sticky lg:top-28 lg:self-start">
              <div className="rounded-[28px] border border-white/10 bg-ink-700 p-6 md:p-8">
                <ul className="space-y-4">
                  <li className="flex items-start gap-3">
                    <CalendarDays className="mt-0.5 size-5 text-white/70" aria-hidden />
                    <span>{formatDateRange(event.start, event.end, locale)}</span>
                  </li>
                  <li className="flex items-start gap-3">
                    <MapPin className="mt-0.5 size-5 text-white/70" aria-hidden />
                    <span>
                      {club ? (
                        <Link href={href(locale, "locations", club.slug)} className="font-semibold underline-offset-4 hover:underline" data-track="club_link_click">
                          {club.name}
                        </Link>
                      ) : (
                        where
                      )}
                      {club && (
                        <span className="block text-sm text-white/70">
                          {club.address.streetName} {club.address.buildingNumber}, {club.address.postalCode} {club.address.localityName}
                        </span>
                      )}
                    </span>
                  </li>
                </ul>
                <div className="mt-6 flex items-end justify-between border-t border-white/10 pt-6">
                  <p className="text-sm text-white/70">{t.detail.perPerson}</p>
                  <p className="font-display text-4xl font-extrabold italic">{price}</p>
                </div>
                <EventSignup eventId={event.id} locale={locale} size="md" showLabel className="mt-6" />
                <p className="mt-4 text-center text-sm text-white/70">{t.detail.appOnly}</p>
              </div>
            </aside>
          </div>
        </div>
      </section>

      {more.length > 0 && (
        <Section tone="ink">
          <Headline size="sm" className="mb-8">
            {t.detail.moreIn} {club?.name ?? event.city}
          </Headline>
          <div className="grid gap-5 md:grid-cols-2 lg:grid-cols-3">
            {more.map((e) => (
              <EventCard key={e.id} event={e} locale={locale} />
            ))}
          </div>
        </Section>
      )}

      <Section tone="ink" className={more.length ? "!pt-0" : undefined}>
        <AppCta clubId={club?.id} locale={locale} />
      </Section>
    </>
  );
}
