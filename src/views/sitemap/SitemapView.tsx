import Link from "next/link";
import type { Club, ClubCountry } from "@/lib/data/types";
import type { Locale } from "@/lib/i18n/config";
import { href, type RouteKey } from "@/lib/i18n/routes";
import { getDictionary } from "@/lib/i18n/dictionaries";
import { legalNav, mainNav, secondaryNav } from "@/lib/site";
import { getClubs, getEvents, getPlannedClubs } from "@/lib/data";
import { getArticles } from "@/lib/content/magazin";
import { COUNTRY_ORDER, locationsContent } from "@/lib/content/locations";
import { Section } from "@/components/ui/Section";
import { Eyebrow, Headline, Lead } from "@/components/ui/Headline";
import { CountryFlag } from "@/components/locations/CountryFlag";

const copy = {
  de: {
    eyebrow: "Alle Seiten",
    title: "Sitemap",
    lead: "Alles auf einen Blick: Seiten, Clubs, Events und Magazin-Artikel.",
    pages: "Seiten",
    clubs: "Clubs",
    soon: "bald",
    events: "Events",
    magazine: "Magazin",
    legal: "Rechtliches",
    count: (n: number) => `${n} Clubs`,
  },
  en: {
    eyebrow: "All pages",
    title: "Sitemap",
    lead: "Everything at a glance: pages, clubs, events and magazine articles.",
    pages: "Pages",
    clubs: "Clubs",
    soon: "soon",
    events: "Events",
    magazine: "Magazine",
    legal: "Legal",
    count: (n: number) => `${n} clubs`,
  },
  pl: {
    eyebrow: "Wszystkie strony",
    title: "Mapa strony",
    lead: "Wszystko w jednym miejscu: strony, kluby, eventy i artykuły z magazynu.",
    pages: "Strony",
    clubs: "Kluby",
    soon: "wkrótce",
    events: "Eventy",
    magazine: "Magazyn",
    legal: "Informacje prawne",
    count: (n: number) => `${n} ${n === 1 ? "klub" : n % 10 >= 2 && n % 10 <= 4 && (n % 100 < 12 || n % 100 > 14) ? "kluby" : "klubów"}`,
  },
};

// Contentful: none – generated from routes + club/event/article data at build time.
// The hidden styleguide is deliberately not listed.
export async function SitemapView({ locale }: { locale: Locale }) {
  const t = copy[locale];
  const d = getDictionary(locale);
  const [clubs, planned, events] = await Promise.all([getClubs(locale), getPlannedClubs(locale), getEvents({ locale })]);
  const articles = getArticles(locale);
  const countryNames = locationsContent[locale].finder.countries;

  const byCountry = COUNTRY_ORDER.map((country) => ({
    country,
    open: clubs.filter((c) => c.country === country).sort(byName(locale)),
    planned: planned.filter((c) => c.country === country).sort(byName(locale)),
  })).filter((g) => g.open.length + g.planned.length > 0);

  const pageGroups: { title: string; keys: RouteKey[] }[] = [
    { title: d.footer.play, keys: ["home", ...mainNav] },
    { title: d.footer.company, keys: secondaryNav },
    { title: t.legal, keys: legalNav },
  ];

  return (
    <>
      <Section tone="ink" className="!pb-10 pt-36 md:!pb-14 md:pt-44">
        <Eyebrow className="mb-6">{t.eyebrow}</Eyebrow>
        <Headline as="h1" size="lg">
          {t.title}
        </Headline>
        <Lead className="mt-6">{t.lead}</Lead>
      </Section>

      <Section tone="ink" className="!pt-0">
        <div className="grid gap-x-10 gap-y-14 md:grid-cols-2 lg:grid-cols-4">
          {/* Pages */}
          <div className="space-y-10">
            {pageGroups.map((g) => (
              <Group key={g.title} title={g.title}>
                {g.keys.map((key) => (
                  <Item key={key} href={href(locale, key)}>
                    {d.nav[key]}
                  </Item>
                ))}
              </Group>
            ))}
          </div>

          {/* Clubs by country */}
          <div className="space-y-10 lg:col-span-2">
            <Group title={`${t.clubs} · ${t.count(clubs.length)}`}>
              <div className="grid gap-x-10 gap-y-8 sm:grid-cols-2">
                {byCountry.map(({ country, open, planned: soon }) => (
                  <div key={country}>
                    <h3 className="mb-2 flex items-center gap-2 text-sm font-semibold text-white">
                      <CountryFlag country={country as ClubCountry} /> {countryNames[country]}
                    </h3>
                    <ul className="space-y-0.5">
                      {open.map((c) => (
                        <Item key={c.id} href={href(locale, "locations", c.slug)}>
                          {c.name}
                        </Item>
                      ))}
                      {soon.map((c) => (
                        <li key={c.id} className="flex min-h-9 items-center gap-2 text-base text-white/60">
                          {c.name}
                          <span className="text-[12px] font-semibold uppercase tracking-[0.1em] text-magenta-300">{t.soon}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                ))}
              </div>
            </Group>
          </div>

          {/* Events + magazine */}
          <div className="space-y-10">
            <Group title={t.events}>
              <Item href={href(locale, "eventInquiry")}>{d.nav.eventInquiry}</Item>
              {events.map((e) => (
                <Item key={e.id} href={href(locale, "events", e.slug)}>
                  {e.title}
                </Item>
              ))}
            </Group>
            <Group title={t.magazine}>
              {articles.map((a) => (
                <Item key={a.slug} href={href(locale, "magazine", a.slug)}>
                  {a.title}
                </Item>
              ))}
            </Group>
          </div>
        </div>
      </Section>
    </>
  );
}

const byName = (locale: Locale) => (a: Club, b: Club) => a.name.localeCompare(b.name, locale);

function Group({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <section>
      <h2 className="mb-4 border-b border-white/12 pb-3 text-[13px] font-semibold uppercase tracking-[0.14em] text-white/75">{title}</h2>
      {Array.isArray(children) ? <ul className="space-y-0.5">{children}</ul> : children}
    </section>
  );
}

function Item({ href: link, children }: { href: string; children: React.ReactNode }) {
  return (
    <li>
      <Link href={link} className="group inline-flex min-h-9 items-center gap-2 text-base text-white/85 transition-colors hover:text-white">
        <span className="h-px w-0 bg-brand-gradient transition-all duration-300 group-hover:w-4" aria-hidden />
        {children}
      </Link>
    </li>
  );
}
