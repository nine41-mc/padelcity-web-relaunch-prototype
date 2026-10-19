import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowUpRight, Mail, MapPin, MessageCircleQuestionMark, Navigation } from "lucide-react";
import { getClub, getClubs, getCoaches, getEvents } from "@/lib/data";
import { getClubReviews, reviewModuleClubs } from "@/lib/data/google-reviews";
import type { Club, ImageAsset } from "@/lib/data/types";
import type { Locale } from "@/lib/i18n/config";
import { localeTags } from "@/lib/i18n/config";
import { alternates, href } from "@/lib/i18n/routes";
import { deeplinks, site } from "@/lib/site";
import { fill, locationsContent } from "@/lib/content/locations";
import { academyContent } from "@/lib/content/academy";
import { coachesForClub, resolveCoachClubsFor } from "@/components/play/coaches/resolve";
import { ClubCoaches } from "@/components/locations/ClubCoaches";
import { ClubCard } from "@/components/cards/ClubCard";
import { EventCard } from "@/components/cards/EventCard";
import { Button } from "@/components/ui/Button";
import { Chip } from "@/components/ui/Chip";
import { Accent, Eyebrow, Headline } from "@/components/ui/Headline";
import { AppIcon } from "@/components/ui/Icon";
import { Media } from "@/components/ui/Media";
import { Reveal } from "@/components/ui/Reveal";
import { Section } from "@/components/ui/Section";
import { AppBookingBlock, courtGroups, formatPrice } from "@/components/locations/AppBooking";
import { AppBookingBar } from "@/components/locations/AppBookingBar";
import { ClubDistance } from "@/components/locations/ClubDistance";
import { ClubGallery } from "@/components/locations/ClubGallery";
import { ClubHighlights } from "@/components/locations/ClubHighlights";
import { ClubMapLazy } from "@/components/locations/ClubMapLazy";
import { ClubReviews } from "@/components/locations/ClubReviews";
import { ClubContactBar } from "@/components/locations/ClubContactBar";
import { SectionTabs } from "@/components/locations/SectionTabs";
import { distanceKm, googleMapsRoute, schemaDays } from "@/components/locations/geo";

export type ClubParams = { slug: string };

/** generateStaticParams for /standorte/[slug] and /en/locations/[slug]. */
export async function clubStaticParams(locale: Locale): Promise<ClubParams[]> {
  return (await getClubs(locale)).map((c) => ({ slug: c.slug }));
}

/** generateMetadata for the club detail page (per locale, with hreflang alternates). */
export async function clubMetadata(slug: string, locale: Locale): Promise<Metadata> {
  const club = await getClub(slug, locale);
  if (!club) return {};
  const t = locationsContent[locale].meta;
  return {
    title: fill(t.clubTitle, { club: club.fullName ?? club.name, city: club.city }),
    description: `${club.teaser} ${fill(t.clubDescription, { n: club.courts.length })}`,
    alternates: alternates("locations", club.slug, locale),
    // openGraph replaces the layout's object → repeat type/locale/siteName
    openGraph: { type: "website", siteName: site.name, locale: localeTags[locale].og, images: club.mainImage ? [{ url: club.mainImage.url, alt: club.mainImage.alt }] : undefined },
  };
}

const sectionCls = "scroll-mt-44 !py-14 md:scroll-mt-48 md:!py-20";

/** Prototype: mock clubs carry one image; extra slots are filled by the assets agent (Media falls back gracefully). */
// Mock clubs with a downloaded gallery (public/images/clubs/<slug>-2..7.jpg). Contentful clubs bring Club.images.
const MOCK_GALLERIES = new Set(["muenchen-tucherpark", "muenchen-frankfurter-ring", "berlin", "dortmund"]);

function galleryImages(club: Club, locale: Locale): ImageAsset[] {
  // TODO(content): real gallery from Contentful (Club.images); 5+ images per club recommended
  if (club.source !== "mock" || !MOCK_GALLERIES.has(club.slug)) return club.images;
  const extra = locationsContent[locale].club.gallery.extra.map((label, i) => ({
    url: `/images/clubs/${club.slug}-${i + 2}.jpg`,
    alt: `${club.name} – ${label}`,
  }));
  return [...club.images, ...extra];
}

const absolute = (url: string) => (/^https?:\/\//.test(url) ? url : `${site.url}${url}`);

function jsonLd(club: Club, locale: Locale) {
  const a = club.address;
  const t = locationsContent[locale].club;
  return {
    "@context": "https://schema.org",
    "@type": "SportsActivityLocation",
    name: club.fullName ?? club.name,
    description: club.description,
    url: `${site.url}${href(locale, "locations", club.slug)}/`,
    inLanguage: localeTags[locale].lang,
    image: club.mainImage ? absolute(club.mainImage.url) : undefined,
    telephone: club.contact?.phoneNumber,
    email: club.contact?.emailAddress,
    priceRange: club.defaultPricePerHour ? fill(t.jsonLdPrice, { price: formatPrice(club.defaultPricePerHour, locale, club.currency) }) : undefined,
    currenciesAccepted: club.currency ?? "EUR",
    address: {
      "@type": "PostalAddress",
      streetAddress: `${a.streetName} ${a.buildingNumber}`,
      postalCode: a.postalCode,
      addressLocality: a.localityName,
      addressRegion: club.region,
      addressCountry: club.country,
    },
    geo: { "@type": "GeoCoordinates", latitude: club.position.latitude, longitude: club.position.longitude },
    openingHoursSpecification: club.openingHours.map((h) => ({
      "@type": "OpeningHoursSpecification",
      dayOfWeek: schemaDays(h.label),
      opens: h.open,
      closes: h.close,
    })),
    // No aggregateRating: ratings only from a real source (Google), and Google ignores self-served review markup anyway.
    amenityFeature: club.facilities.map((f) => ({ "@type": "LocationFeatureSpecification", name: f.name, value: true })),
  };
}

/** Club detail – shared by /standorte/[slug] (de), /en/locations/[slug] (en) and /pl/lokalizacje/[slug] (pl). */
export async function ClubView({ slug, locale }: { slug: string; locale: Locale }) {
  const club = await getClub(slug, locale);
  if (!club) notFound();

  const t = locationsContent[locale].club;
  const [events, allClubs, allCoaches] = await Promise.all([getEvents({ clubId: club.id, locale }), getClubs(locale), getCoaches(locale)]);
  // Coaches of this club: match coach club keys against the German club list (coach clubs are written in German).
  const coachRefs = resolveCoachClubsFor(allCoaches, locale === "de" ? allClubs : await getClubs("de"), allClubs, locale);
  const { exact: clubCoaches, nearby: cityCoaches } = coachesForClub(allCoaches, club.id, coachRefs);
  const shownCoaches = clubCoaches.length ? clubCoaches : cityCoaches;
  const coachLabels = academyContent[locale].coachesSection;
  const clubEmail = club.contact?.emailAddress ?? site.email;
  const nearby = allClubs
    .filter((c) => c.id !== club.id)
    .map((c) => ({ club: c, km: distanceKm(club.position, c.position) }))
    .sort((x, y) => x.km - y.km)
    .slice(0, 3);
  const a = club.address;
  const addressLine = `${a.streetName} ${a.buildingNumber}, ${a.postalCode} ${a.localityName}`;
  const hasPremium = club.courts.some((c) => c.isPremium);
  const bookHref = deeplinks.club(club.id);
  const gallery = galleryImages(club, locale);
  const reviews = reviewModuleClubs.has(club.slug) ? await getClubReviews(club, locale) : undefined;

  const tabs = [
    { id: "facilities", label: t.tabs.facilities },
    ...(reviews ? [{ id: "reviews", label: t.tabs.reviews }] : []),
    { id: "coaching", label: t.tabs.coaching },
    { id: "events", label: t.tabs.events },
    { id: "directions", label: t.tabs.directions },
    { id: "book", label: t.tabs.book },
  ];

  return (
    <div>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd(club, locale)).replace(/</g, "\\u003c") }} />

      {/* Gallery + title */}
      <section className="bg-black pt-24 pb-12 md:pt-32 md:pb-16">
        <div className="container-site">
          {gallery.length > 0 ? (
            <ClubGallery images={gallery} name={club.name} locale={locale} />
          ) : (
            // No photos yet (e.g. supplement clubs not in Contentful) → branded placeholder instead of an empty bento
            <Media alt={club.name} className="aspect-[16/9] rounded-[28px] md:aspect-auto md:h-[320px]" />
          )}

          <div className="mt-10 grid gap-8 lg:mt-14 lg:grid-cols-[1.4fr_1fr] lg:items-start">
            <div>
              <Headline as="h1" size="md">
                {club.name}
              </Headline>
              <p className="mt-5 flex flex-wrap items-center gap-x-2 gap-y-2 text-sm text-white/75">
                <span>{addressLine}</span>
                <ClubDistance position={club.position} locale={locale} />
              </p>
              <ul className="mt-5 flex flex-wrap gap-2" aria-label={t.courtsLabel}>
                {hasPremium && (
                  <li>
                    <Chip tone="gradient" className="py-1.5 text-sm">
                      {t.panorama}
                    </Chip>
                  </li>
                )}
                {courtGroups(club, locale).map((g) => (
                  <li key={g.key}>
                    <Chip className="py-1.5 text-sm">
                      {g.label}
                    </Chip>
                  </li>
                ))}
              </ul>
              {gallery.length >= 2 && <ClubHighlights images={gallery} city={club.city} locale={locale} />}
            </div>
            <p className="text-lg leading-relaxed text-white/75 lg:pt-2">{club.description}</p>
          </div>

          {/* Contact at a glance – above the section tabs */}
          <div className="mt-10">
            <ClubContactBar club={club} locale={locale} />
          </div>
        </div>
      </section>

      <div className="relative bg-ink-800">
        <SectionTabs items={tabs} label={t.tabsLabel} className="pt-6" />

        {/* Facilities */}
        <Section id="facilities" tone="black" className={sectionCls}>
          {/* Contentful module: facilityGrid */}
          <Headline size="sm" className="mb-8">
            {t.facilities.title}
          </Headline>
          <ul className="grid grid-cols-2 gap-3 md:grid-cols-4">
            {club.facilities.map((f) => (
              <li key={f.type} className="flex items-center gap-3 rounded-[20px] border border-white/10 bg-ink-700 p-4 md:p-5">
                <span className="grid size-11 shrink-0 place-items-center rounded-full bg-brand-gradient">
                  <AppIcon name={f.icon ?? f.type} className="size-5 text-white" />
                </span>
                {/* TODO(content): facility names come from Contentful in the requested locale */}
                <span className="text-sm font-medium leading-tight">{f.name}</span>
              </li>
            ))}
          </ul>
        </Section>

        {/* Reviews (Google) – only on clubs in reviewModuleClubs */}
        {reviews && (
          <Section id="reviews" className={sectionCls}>
            <ClubReviews data={reviews} locale={locale} />
          </Section>
        )}

        {/* Coaching: real coaches of this club (getCoaches → matched via coach club keys) */}
        <Section id="coaching" className={sectionCls}>
          {shownCoaches.length > 0 ? (
            <>
              <div className="mb-8 md:mb-10">
                {clubCoaches.length > 0 ? (
                  <Headline size="sm">
                    {t.coaching.titleClub} <Accent>{t.coaching.accentClub}</Accent>
                  </Headline>
                ) : (
                  <Headline size="sm">{fill(t.coaching.titleNearby, { city: club.city })}</Headline>
                )}
              </div>
              <ClubCoaches
                coaches={shownCoaches}
                locale={locale}
                labels={coachLabels}
                clubs={coachRefs}
                fallbackEmail={clubEmail}
                appHref={bookHref}
                listLabel={fill(t.coaching.listLabel, { club: club.name })}
                prevLabel={t.coaching.prev}
                nextLabel={t.coaching.next}
              />
              {/* CTA below the coach tiles */}
              <Button href={href(locale, "academy")} variant="outline" className="mt-8 w-fit md:mt-10" data-track="club_coaching_academy_cta">
                {t.coaching.allAcademy}
              </Button>
            </>
          ) : (
            // Contentful module: academyTeaser (empty state – no coach matched to this club)
            <div className="grid overflow-hidden rounded-[28px] border border-white/10 bg-ink-700 md:grid-cols-2">
              <Media src="/images/academy/coaching.jpg" alt={t.coaching.imageAlt} className="aspect-[16/10] md:aspect-auto md:min-h-[320px]" sizes="(min-width:768px) 50vw, 100vw" />
              <div className="flex min-w-0 flex-col justify-center gap-5 p-6 md:p-10">
                <Eyebrow>{t.coaching.emptyEyebrow}</Eyebrow>
                <Headline size="sm">
                  {t.coaching.emptyTitle} <Accent>{t.coaching.emptyAccent}</Accent>
                </Headline>
                <p className="text-white/70">{fill(t.coaching.emptyText, { club: club.name })}</p>
                <a
                  href={`mailto:${clubEmail}?subject=${encodeURIComponent(fill(t.coaching.emptyMailSubject, { club: club.name }))}`}
                  className="inline-flex min-h-11 w-fit max-w-full items-center gap-3 rounded-2xl border border-white/15 px-4 py-2.5 transition hover:border-white/40 hover:bg-white/5"
                  data-track="club_coaching_inquiry_click"
                >
                  <span className="grid size-9 shrink-0 place-items-center rounded-full bg-brand-gradient">
                    <Mail className="size-4" aria-hidden />
                  </span>
                  <span className="min-w-0">
                    <span className="block text-[11px] font-semibold uppercase tracking-[0.14em] text-white/60">{t.coaching.emptyMail}</span>
                    <span className="block break-all text-sm">{clubEmail}</span>
                  </span>
                </a>
                <Button href={href(locale, "academy")} variant="outline" className="w-fit">
                  {t.coaching.cta}
                </Button>
              </div>
            </div>
          )}
        </Section>

        {/* Events */}
        <Section id="events" tone="black" className={sectionCls}>
          <Headline size="sm" className="mb-8 md:mb-10">
            {t.events.title}
          </Headline>
          {events.length ? (
            <>
              <ul className="grid gap-5 md:grid-cols-2 lg:grid-cols-3">
                {events.map((e, i) => (
                  <li key={e.id} className="flex">
                    <Reveal delay={i * 0.06} className="flex w-full">
                      <EventCard event={e} locale={locale} className="w-full" />
                    </Reveal>
                  </li>
                ))}
              </ul>
              {/* CTA below the event tiles (same pattern as the coaches) */}
              <Button href={href(locale, "events")} variant="outline" className="mt-8 w-fit md:mt-10" data-track="club_events_all_cta">
                {t.events.allButton}
              </Button>
            </>
          ) : (
            <div className="rounded-[20px] border border-dashed border-white/15 p-8 text-center md:p-12">
              <p className="text-lg font-semibold">{fill(t.events.emptyTitle, { city: club.city })}</p>
              <p className="mt-2 text-white/70">{t.events.emptyText}</p>
              <Button href={href(locale, "events")} variant="outline" className="mt-6">
                {t.events.allButton}
              </Button>
            </div>
          )}
        </Section>

        {/* Directions: address + map (opening hours are in the booking block) */}
        <Section id="directions" className={sectionCls}>
          <Headline size="sm" className="mb-8">
            {t.directions.title}
          </Headline>
          {/* Opening hours live in the booking block (#book) – no duplicate here */}
          <p className="-mt-4 mb-6 flex items-start gap-2 text-white/80">
            <MapPin className="mt-1 size-4 shrink-0 text-white" aria-hidden /> {addressLine}
          </p>
          <div>
            <div className="relative isolate h-[320px] overflow-hidden rounded-[20px] border border-white/10 md:h-[420px]">
              <ClubMapLazy
                clubs={[{ id: club.id, slug: club.slug, name: club.name, city: club.city, position: club.position }]}
                locale={locale}
                activeId={club.id}
                showPopups={false}
              />
              <a
                href={googleMapsRoute(club.position)}
                target="_blank"
                rel="noopener noreferrer"
                className="absolute bottom-4 left-4 z-[500] inline-flex min-h-11 items-center gap-2 rounded-full bg-white px-5 text-sm font-semibold text-ink-800 shadow-elevated transition hover:shadow-glow"
              >
                <Navigation className="size-4" aria-hidden /> {t.directions.route}
              </a>
            </div>
          </div>
        </Section>

        {/* Booking happens exclusively in the app – last tab after directions (sticky booking bar on phones stays) */}
        <Section id="book" tone="black" className={sectionCls}>
          {/* No Reveal here: the block is taller than a phone viewport and must never stay hidden */}
          <AppBookingBlock club={club} locale={locale} />
          <div className="mt-6 flex items-start gap-2 text-sm text-white/70">
            <MessageCircleQuestionMark className="mt-3 size-4 shrink-0 text-white" aria-hidden />
            <p className="flex flex-wrap items-center gap-x-2">
              <span className="py-2.5">{t.faqLink.text}</span>
              <Link href={href(locale, "faq")} className="inline-flex min-h-11 items-center gap-1 font-semibold text-white underline-offset-4 hover:underline">
                {t.faqLink.cta} <ArrowUpRight className="size-4" aria-hidden />
              </Link>
            </p>
          </div>
        </Section>

        {/* Nearby */}
        <Section tone="ink" className="!py-14 md:!py-20">
          <Headline size="sm" className="mb-8">
            {t.nearby}
          </Headline>
          <ul className="grid gap-5 md:grid-cols-2 lg:grid-cols-3">
            {nearby.map(({ club: c, km }) => (
              <li key={c.id} className="flex min-w-0">
                <ClubCard club={c} distanceKm={km} locale={locale} className="w-full" />
              </li>
            ))}
          </ul>
        </Section>

        <AppBookingBar href={bookHref} price={club.defaultPricePerHour ? formatPrice(club.defaultPricePerHour, locale, club.currency) : undefined} locale={locale} />
      </div>
    </div>
  );
}
