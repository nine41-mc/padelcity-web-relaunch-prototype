import type { Metadata } from "next";
import { keepTogether } from "@/lib/typography";
import Link from "next/link";
import { notFound } from "next/navigation";
import { CalendarCheck, CalendarDays, Clock, MapPin, Ticket, Users, UsersRound } from "lucide-react";
import { getClubs, getEvent, getEvents } from "@/lib/data";
import type { Club, ClubEvent } from "@/lib/data/types";
import { site, webApp } from "@/lib/site";
import type { Locale } from "@/lib/i18n/config";
import { localeTags } from "@/lib/i18n/config";
import { alternates, href } from "@/lib/i18n/routes";
import { partners } from "@/lib/content/partners";
import { eventContent, eventsContent, localizeEvent } from "@/lib/content/events";
import { AppCta } from "@/components/modules/AppCta";
import { Section } from "@/components/ui/Section";
import { Accent, Eyebrow, Headline, Lead } from "@/components/ui/Headline";
import { EventSignup } from "@/components/events/EventSignup";
import { ShareButton } from "@/components/ui/ShareButton";
import { Chip } from "@/components/ui/Chip";
import { Media } from "@/components/ui/Media";
import { PartnerBand } from "@/components/modules/PartnerBand";
import { EventCard } from "@/components/cards/EventCard";
import { Countdown } from "@/components/play/Countdown";
import { LiteYouTube } from "@/components/play/LiteYouTube";
import { eventWallClock } from "@/components/play/eventFormat";
import { CancellationTable, EventSignupCard, FactRow } from "@/components/events/EventFacts";

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

/**
 * Event detail – one page for every event, shared by /events/[slug] (de) and the EN/PL routes.
 * Base from the APL: head, key facts (date, place, format, sign-up deadline, free cancellation, price) and sign-up.
 * Optional Contentful modules (claim + countdown, intro + extra facts, format/schedule, video, partners) only show when filled.
 */
export async function EventDetailView({ slug, locale }: { slug: string; locale: Locale }) {
  const event = await loadEvent(slug, locale);
  if (!event) notFound();

  const t = eventsContent[locale];
  const clubs = await getClubs(locale);
  const club = event.clubId ? clubs.find((c) => c.id === event.clubId || c.slug === event.clubId) : undefined;
  const content = eventContent[event.id]?.[locale] ?? {};
  const more = (await getEvents({ clubId: event.clubId, locale }))
    .filter((e) => e.id !== event.id && e.type !== "hero" && (event.clubId || e.city === event.city))
    .slice(0, 3)
    .map((e) => localizeEvent(e, locale));
  const where = event.clubName ?? event.city ?? site.name;
  const intl = localeTags[locale].intl;
  const price = event.pricePerPerson
    ? new Intl.NumberFormat(intl, { style: "currency", currency: "EUR", maximumFractionDigits: 0 }).format(event.pricePerPerson)
    : t.detail.free;
  const dateTime = (iso: string) =>
    `${new Date(iso).toLocaleDateString(intl, { weekday: "short", day: "numeric", month: "short", year: "numeric" })} · ${iso.slice(11, 16)}${t.date.time ? ` ${t.date.time}` : ""}`;
  // APL: registrationClosesAt empty = sign-up open until the event starts
  const deadline = dateTime(event.registrationClosesAt ?? event.start);
  // Live in production (public APL endpoint, fetched on page view); mock values in the prototype
  const freePlaces = event.maxParticipants !== undefined && event.confirmedParticipants !== undefined ? Math.max(0, event.maxParticipants - event.confirmedParticipants) : undefined;
  const eventPartners = (content.partnerNames ?? [])
    .map((n) => partners.find((p) => p.name === n))
    .filter((p): p is (typeof partners)[number] => Boolean(p));
  const steps = content.format ?? t.detail.steps;

  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(eventJsonLd(event, locale, club)) }} />

      {/* Contentful module: eventHero (+ optional claim & countdown) and eventSignupCard (no capacity/places left) */}
      <section className="relative pt-32 md:pt-40">
        <div className="container-site">
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
                {event.recurrence && <Chip>{event.recurrence}</Chip>}
                {content.presenter && <Chip tone="dark">{content.presenter}</Chip>}
                <ShareButton title={event.title} locale={locale} track="share_event" className="ml-auto" />
              </div>
              <Headline as="h1" size="lg" className="mt-5">
                {keepTogether(event.title)}
              </Headline>
              {content.claim && (
                <p className="mt-4 font-display text-2xl font-extrabold italic uppercase md:text-3xl">
                  {content.claim.text} <Accent>{content.claim.accent}</Accent>
                </p>
              )}
              {/* The claim replaces the subtitle (both say the same on hero events) and brings the countdown */}
              {content.claim ? (
                <Countdown start={event.start} labels={t.countdown} className="mt-8" />
              ) : (
                <Lead className="mt-5">{event.subtitle ?? t.detail.fallbackDescription(t.types[event.type], where)}</Lead>
              )}
              {/* When & where */}
              <dl className="mt-8 grid gap-5 border-t border-white/10 pt-6 sm:grid-cols-3">
                <FactRow icon={<CalendarDays className="size-5" />} label={t.detail.start}>
                  {dateTime(event.start)}
                </FactRow>
                <FactRow icon={<CalendarCheck className="size-5" />} label={t.detail.end}>
                  {dateTime(event.end ?? event.start)}
                </FactRow>
                <FactRow icon={<MapPin className="size-5" />} label={t.detail.place}>
                  {club ? (
                    <>
                      <Link href={href(locale, "locations", club.slug)} className="font-semibold underline-offset-4 hover:underline" data-track="club_link_click">
                        {club.name}
                      </Link>
                      <span className="block text-sm text-white/70">
                        {club.address.streetName} {club.address.buildingNumber}, {club.address.postalCode} {club.address.localityName}
                      </span>
                    </>
                  ) : (
                    where
                  )}
                </FactRow>
              </dl>
            </div>

            {/* Contentful module: eventSignupCard – sign-up facts and sign-up. Phone: below the intro; desktop: sticky right column */}
            <aside className="lg:sticky lg:top-28 lg:col-start-2 lg:row-span-2 lg:row-start-1 lg:self-start">
              <EventSignupCard
                price={price}
                priceNote={event.pricePerPerson ? t.detail.perPerson : undefined}
                signup={<EventSignup eventId={event.id} locale={locale} size="md" showLabel />}
                note={t.detail.appOnly}
              >
                  <FactRow icon={<Users className="size-5" />} label={t.detail.format}>
                    {event.personsPerTeam ? t.detail.team(event.personsPerTeam) : t.detail.single}
                  </FactRow>
                  <FactRow icon={<Clock className="size-5" />} label={t.detail.deadline}>
                    {deadline}
                  </FactRow>
                  {event.maxParticipants !== undefined && (
                    <FactRow icon={<UsersRound className="size-5" />} label={t.detail.maxParticipants}>
                      {event.maxParticipants}
                    </FactRow>
                  )}
                  {freePlaces !== undefined && (
                    <FactRow icon={<Ticket className="size-5" />} label={t.detail.freePlaces}>
                      {freePlaces > 0 ? freePlaces : <span className="font-semibold text-magenta-300">{t.detail.fullyBooked}</span>}
                    </FactRow>
                  )}
              </EventSignupCard>
            </aside>

            {/* Contentful module: formatSteps (default steps unless the event brings its own) */}
            <div className="lg:col-start-1">
              {content.intro && <Lead className="mb-8">{content.intro}</Lead>}
              {content.facts && content.facts.length > 0 && (
                <dl className="mb-8 grid grid-cols-2 gap-px overflow-hidden rounded-[20px] border border-white/10 bg-white/10 md:grid-cols-3">
                  {content.facts.map((f) => (
                    <div key={f.label} className="bg-ink-700 p-5">
                      <dt className="text-[13px] font-semibold uppercase tracking-[0.14em] text-white/70">{f.label}</dt>
                      <dd className="mt-2 text-lg font-semibold leading-tight">{f.value}</dd>
                    </div>
                  ))}
                </dl>
              )}
              {/* Cancellation policy as in the app – only for the fixed-time rule; rules counted from the sign-up stay hidden for now */}
              {(event.freeCancellation ?? "UNTIL_24H_BEFORE_EVENT") === "UNTIL_24H_BEFORE_EVENT" && (
                <CancellationTable cutoff={new Date(eventWallClock(event.start).getTime() - 24 * 3600 * 1000)} locale={locale} />
              )}
              <ol className="grid gap-4 md:grid-cols-3">
                {steps.map((s, i) => (
                  <li key={s.title} className="rounded-[20px] border border-white/10 pad-card">
                    <span className="font-display text-3xl font-extrabold italic text-brand-gradient">0{i + 1}</span>
                    <p className="mt-2 font-display text-xl font-extrabold italic uppercase">{s.title}</p>
                    <p className="mt-2 text-sm text-white/70">{s.text}</p>
                  </li>
                ))}
              </ol>
            </div>
          </div>
        </div>
      </section>

      {/* Contentful module: formatSteps (schedule) */}
      {content.schedule && content.schedule.length > 0 && (
        <Section tone="black">
          <div className="grid gap-10 lg:grid-cols-[1fr_2fr]">
            <div>
              <Eyebrow className="mb-4">{t.detail.scheduleEyebrow}</Eyebrow>
              <Headline size="sm">{t.detail.scheduleTitle}</Headline>
              <p className="mt-4 text-white/70">{t.detail.scheduleNote}</p>
            </div>
            <div className="grid gap-5 md:grid-cols-2 xl:grid-cols-3">
              {content.schedule.map((d) => (
                <div key={d.day} className="rounded-[20px] border border-white/10 pad-card">
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
      )}

      {/* Contentful module: videoEmbed */}
      {content.video && (
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
      )}

      {/* Contentful module: eventPartners (references to partner entries) – shown in the site-wide partner band */}
      {eventPartners.length > 0 && <PartnerBand locale={locale} partners={eventPartners} />}

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
