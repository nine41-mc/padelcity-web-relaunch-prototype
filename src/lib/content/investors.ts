import type { Locale } from "../i18n/config";
import { site } from "../site";
import { keyFacts } from "./partners";

/**
 * Investor Relations content.
 * Business decision (Oct 2026): NO Series A figures (volume, investors, date) – only the qualitative
 * "Series A closed" story. Public key figures come from `keyFacts` (30+ clubs, 200+ courts, 25+ cities).
 */

export type EquityChapter = {
  id: string;
  kicker: string;
  /** Short label for the sticky chapter index (desktop). */
  label: string;
  title: string;
  text: string;
  bullets: string[];
};

export type Kpi = { label: string; value: number; prefix?: string; suffix?: string; note?: string };

export type PressItem = { title: string; meta: string };

const kpis = (labels: { clubs: string; courts: string; cities: string; founded: string; firstClub: string }): Kpi[] => [
  { label: labels.clubs, value: keyFacts.clubs, suffix: "+" },
  { label: labels.courts, value: keyFacts.courts, suffix: "+" },
  { label: labels.cities, value: keyFacts.cities, suffix: "+" },
  { label: labels.founded, value: keyFacts.foundedYear, note: labels.firstClub },
];

// Contentful: page "investors" (modules listed in src/views/investors/InvestorsView.tsx)
const de = {
  meta: {
    title: "Investor Relations",
    description:
      "PadelCity ist Deutschlands führender Padel-Betreiber. Series A closed: Equity Story, Kennzahlen, Meilensteine, Gründer und Pressematerial.",
  },
  hero: {
    eyebrow: "Series A closed",
    imageAlt: "Business-Runde bei PadelCity",
    title: "Series A. Next",
    accent: "Level",
    titleEnd: "für Padel.",
    lead: "PadelCity ist Deutschlands führender Padel-Betreiber. Mit der Series A bauen wir die Plattform für Padel als Breitensport – in Deutschland und in neuen Ländern.",
    ctaStory: "Equity Story",
    ctaContact: "IR-Kontakt",
  },
  marquee: [
    "Deutschlands führender Padel-Betreiber",
    `${keyFacts.clubs}+ Clubs`,
    `${keyFacts.courts}+ Courts`,
    `${keyFacts.cities}+ Städte`,
    "Eigene App",
    "Academy",
    "Events",
    "Franchise",
    "Neue Länder",
  ],
  equity: {
    eyebrow: "Equity Story",
    title: "Vier Gründe, warum PadelCity gewinnt",
    lead: "Markt, Plattform, Skalierung, Team – die Kurzfassung unserer Investment-These.",
    aria: "Kapitel der Equity Story",
    chapters: [
      {
        id: "markt",
        kicker: "01 · Markt",
        label: "Markt",
        title: "Die am schnellsten wachsende Sportart",
        text: "Padel ist leicht zu lernen, sozial und macht vom ersten Ballwechsel an Spaß. In vielen deutschen Städten ist die Nachfrage nach Courts größer als das Angebot.",
        bullets: [
          "Einstieg ohne lange Lernkurve – für alle Altersgruppen",
          "Doppel-Sport: jede Buchung bringt vier Menschen in den Club",
          "In Spanien, Italien und Schweden längst Breitensport – Deutschland holt auf",
        ],
      },
      {
        id: "plattform",
        kicker: "02 · Plattform",
        label: "Plattform",
        title: "Clubs + App + Community",
        text: "PadelCity verbindet physische Infrastruktur mit einer eigenen digitalen Plattform. Die App ist Buchungssystem, Matchmaker und Community-Hub in einem.",
        bullets: [
          `${keyFacts.clubs}+ Clubs, ${keyFacts.courts}+ Courts in ${keyFacts.cities}+ Städten`,
          "Eigene App für Buchung, Payment & Open Matches",
          "Academy, Events & Partner-Ökosystem als Umsatzhebel",
        ],
      },
      {
        id: "skalierung",
        kicker: "03 · Skalierung",
        label: "Skalierung",
        title: "Länder-Gesellschaften + Franchise",
        text: "Wachstum vor allem über neue Länder – je Land eine eigene Gesellschaft –, ergänzt um Franchise für Städte, in denen lokale Partner schneller sind.",
        bullets: ["Ein Playbook für Bau, Opening & Betrieb", "Je Land eine eigene PadelCity-Gesellschaft", "Franchise als kapitaleffizienter Zusatzhebel"],
      },
      {
        id: "team",
        kicker: "04 · Team",
        label: "Team",
        title: "Unternehmer, Sport & Operations",
        text: "Ein Gründerteam aus Unternehmertum und Spitzensport – verstärkt durch ein Team, das Clubs eröffnet, als wäre es Routine.",
        bullets: ["Gründer: Jonathan Sierck, Dr. Marcus Englert, Dr. Sebastian Weil, Hansi Flick", "Eigenes Team für Bau, Betrieb & Expansion", "Eigene Produkt- und Tech-Organisation"],
      },
    ] satisfies EquityChapter[],
  },
  kpis: {
    eyebrow: "Kennzahlen",
    title: "PadelCity in Zahlen",
    lead: "Stand: Oktober 2026.",
    items: kpis({ clubs: "Clubs", courts: "Courts", cities: "Städte", founded: "Gegründet", firstClub: `Erster Club: ${keyFacts.firstClub}` }),
  },
  milestones: { eyebrow: "Meilensteine", title: "Von Ingolstadt zur Series A" },
  leadership: {
    eyebrow: "Gründer & Leadership",
    title: "Das Team hinter PadelCity",
    lead: "Unternehmertum und Spitzensport – vereint in einer Mission: Padel zum Breitensport machen.",
    management: "Geschäftsführung",
  },
  press: {
    eyebrow: "Presse & Downloads",
    title: "Press Kit",
    note: "Auf Anfrage",
    requestLabel: "anfragen",
    // TODO(content): real files (PDF/ZIP) hosted as Contentful assets – until then everything is on request.
    items: [
      { title: "Factsheet PadelCity", meta: "PDF" },
      { title: "Logo-Paket", meta: "ZIP · SVG / PNG" },
      { title: "Bildmaterial Clubs & Events", meta: "ZIP · JPG" },
      { title: "Gründer-Portraits", meta: "ZIP · JPG" },
    ] satisfies PressItem[],
  },
  contact: {
    eyebrow: "Investor Relations",
    title: "Lass uns sprechen.",
    text: "Fragen zu PadelCity, zur Series A oder zu Co-Investments? Schreib uns – wir melden uns.",
    mailLabel: "E-Mail schreiben",
    subject: "Investor Relations",
  },
};

export type InvestorsContent = typeof de;

const en: InvestorsContent = {
  meta: {
    title: "Investor Relations",
    description:
      "PadelCity is Germany's leading padel operator. Series A closed: equity story, key figures, milestones, founders and press material.",
  },
  hero: {
    eyebrow: "Series A closed",
    imageAlt: "Business meeting at PadelCity",
    title: "Series A. Next",
    accent: "level",
    titleEnd: "for padel.",
    lead: "PadelCity is Germany's leading padel operator. With our Series A we're building the platform that makes padel a sport for everyone – in Germany and in new countries.",
    ctaStory: "Equity story",
    ctaContact: "IR contact",
  },
  marquee: [
    "Germany's leading padel operator",
    `${keyFacts.clubs}+ clubs`,
    `${keyFacts.courts}+ courts`,
    `${keyFacts.cities}+ cities`,
    "Our own app",
    "Academy",
    "Events",
    "Franchise",
    "New countries",
  ],
  equity: {
    eyebrow: "Equity story",
    title: "Four reasons PadelCity wins",
    lead: "Market, platform, scale, team – our investment case in a nutshell.",
    aria: "Equity story chapters",
    chapters: [
      {
        id: "markt",
        kicker: "01 · Market",
        label: "Market",
        title: "The fastest-growing sport around",
        text: "Padel is easy to learn, social and fun from the very first rally. In many German cities demand for courts outstrips supply.",
        bullets: [
          "No steep learning curve – for every age group",
          "A doubles sport: every booking brings four people into the club",
          "Already a mass sport in Spain, Italy and Sweden – Germany is catching up",
        ],
      },
      {
        id: "plattform",
        kicker: "02 · Platform",
        label: "Platform",
        title: "Clubs + app + community",
        text: "PadelCity combines physical infrastructure with its own digital platform. The app is booking system, matchmaker and community hub in one.",
        bullets: [
          `${keyFacts.clubs}+ clubs, ${keyFacts.courts}+ courts in ${keyFacts.cities}+ cities`,
          "Our own app for booking, payments & open matches",
          "Academy, events & partner ecosystem as revenue drivers",
        ],
      },
      {
        id: "skalierung",
        kicker: "03 · Scale",
        label: "Scale",
        title: "Country companies + franchise",
        text: "Growth comes mainly from new countries – each with its own PadelCity company – complemented by franchising in cities where local partners can move faster.",
        bullets: ["One playbook for build, opening & operations", "A dedicated PadelCity company per country", "Franchising as a capital-efficient extra lever"],
      },
      {
        id: "team",
        kicker: "04 · Team",
        label: "Team",
        title: "Entrepreneurship, sport & operations",
        text: "A founding team from business and elite sport – backed by a team that opens clubs like it's second nature.",
        bullets: ["Founders: Jonathan Sierck, Dr Marcus Englert, Dr Sebastian Weil, Hansi Flick", "In-house team for build, operations & expansion", "Our own product and tech organisation"],
      },
    ],
  },
  kpis: {
    eyebrow: "Key figures",
    title: "PadelCity in numbers",
    lead: "As of October 2026.",
    items: kpis({ clubs: "Clubs", courts: "Courts", cities: "Cities", founded: "Founded", firstClub: `First club: ${keyFacts.firstClub}` }),
  },
  milestones: { eyebrow: "Milestones", title: "From Ingolstadt to Series A" },
  leadership: {
    eyebrow: "Founders & leadership",
    title: "The team behind PadelCity",
    lead: "Entrepreneurship and elite sport – united by one mission: making padel a sport for everyone.",
    management: "Management",
  },
  press: {
    eyebrow: "Press & downloads",
    title: "Press kit",
    note: "On request",
    requestLabel: "request",
    items: [
      { title: "PadelCity factsheet", meta: "PDF" },
      { title: "Logo pack", meta: "ZIP · SVG / PNG" },
      { title: "Club & event imagery", meta: "ZIP · JPG" },
      { title: "Founder portraits", meta: "ZIP · JPG" },
    ],
  },
  contact: {
    eyebrow: "Investor Relations",
    title: "Let's talk.",
    text: "Questions about PadelCity, our Series A or co-investment? Drop us a line – we'll get back to you.",
    mailLabel: "Send an email",
    subject: "Investor Relations",
  },
};

const pl: InvestorsContent = {
  meta: {
    title: "Investor Relations",
    description:
      "PadelCity to wiodący operator padla w Niemczech. Series A closed: equity story, kluczowe wskaźniki, kamienie milowe, założyciele i materiały prasowe.",
  },
  hero: {
    eyebrow: "Series A closed",
    imageAlt: "Spotkanie biznesowe w PadelCity",
    title: "Series A. Next",
    accent: "Level",
    titleEnd: "dla padla.",
    lead: "PadelCity to wiodący operator padla w Niemczech. Dzięki Series A budujemy platformę, która zrobi z padla sport masowy – w Niemczech i w nowych krajach.",
    ctaStory: "Equity story",
    ctaContact: "Kontakt IR",
  },
  marquee: [
    "Wiodący operator padla w Niemczech",
    `${keyFacts.clubs}+ klubów`,
    `${keyFacts.courts}+ kortów`,
    `${keyFacts.cities}+ miast`,
    "Własna aplikacja",
    "Academy",
    "Wydarzenia",
    "Franczyza",
    "Nowe kraje",
  ],
  equity: {
    eyebrow: "Equity story",
    title: "Cztery powody, dla których PadelCity wygrywa",
    lead: "Rynek, platforma, skalowanie, zespół – nasza teza inwestycyjna w skrócie.",
    aria: "Rozdziały equity story",
    chapters: [
      {
        id: "markt",
        kicker: "01 · Rynek",
        label: "Rynek",
        title: "Najszybciej rozwijająca się dyscyplina sportu",
        text: "Padla łatwo się nauczyć, jest towarzyski i daje frajdę od pierwszej wymiany. W wielu niemieckich miastach popyt na korty przewyższa podaż.",
        bullets: [
          "Start bez długiej nauki – dla każdej grupy wiekowej",
          "Sport deblowy: każda rezerwacja przyprowadza do klubu cztery osoby",
          "W Hiszpanii, we Włoszech i w Szwecji od dawna sport masowy – Niemcy nadrabiają zaległości",
        ],
      },
      {
        id: "plattform",
        kicker: "02 · Platforma",
        label: "Platforma",
        title: "Kluby + aplikacja + społeczność",
        text: "PadelCity łączy fizyczną infrastrukturę z własną platformą cyfrową. Aplikacja to jednocześnie system rezerwacji, matchmaker i centrum społeczności.",
        bullets: [
          `${keyFacts.clubs}+ klubów, ${keyFacts.courts}+ kortów w ${keyFacts.cities}+ miastach`,
          "Własna aplikacja do rezerwacji, płatności i otwartych meczów",
          "Academy, wydarzenia i ekosystem partnerów jako dźwignie przychodów",
        ],
      },
      {
        id: "skalierung",
        kicker: "03 · Skalowanie",
        label: "Skalowanie",
        title: "Spółki krajowe + franczyza",
        text: "Wzrost przede wszystkim dzięki nowym krajom – w każdym kraju osobna spółka – uzupełniony o franczyzę w miastach, w których lokalni partnerzy działają szybciej.",
        bullets: ["Jeden playbook na budowę, otwarcie i działalność", "Osobna spółka PadelCity w każdym kraju", "Franczyza jako kapitałowo efektywna dodatkowa dźwignia"],
      },
      {
        id: "team",
        kicker: "04 · Zespół",
        label: "Zespół",
        title: "Przedsiębiorczość, sport i operacje",
        text: "Zespół założycieli łączący przedsiębiorczość i sport wyczynowy – wzmocniony przez zespół, dla którego otwieranie klubów to rutyna.",
        bullets: ["Założyciele: Jonathan Sierck, dr Marcus Englert, dr Sebastian Weil, Hansi Flick", "Własny zespół ds. budowy, działalności i ekspansji", "Własna organizacja produktowa i technologiczna"],
      },
    ],
  },
  kpis: {
    eyebrow: "Kluczowe wskaźniki",
    title: "PadelCity w liczbach",
    lead: "Stan: październik 2026.",
    items: kpis({ clubs: "Kluby", courts: "Korty", cities: "Miasta", founded: "Rok założenia", firstClub: `Pierwszy klub: ${keyFacts.firstClub}` }),
  },
  milestones: { eyebrow: "Kamienie milowe", title: "Od Ingolstadt do Series A" },
  leadership: {
    eyebrow: "Założyciele i kierownictwo",
    title: "Zespół stojący za PadelCity",
    lead: "Przedsiębiorczość i sport wyczynowy – połączone jedną misją: zrobić z padla sport masowy.",
    management: "Zarząd",
  },
  press: {
    eyebrow: "Prasa i materiały do pobrania",
    title: "Press kit",
    note: "Na zapytanie",
    requestLabel: "– wyślij zapytanie",
    items: [
      { title: "Factsheet PadelCity", meta: "PDF" },
      { title: "Pakiet logotypów", meta: "ZIP · SVG / PNG" },
      { title: "Zdjęcia klubów i wydarzeń", meta: "ZIP · JPG" },
      { title: "Portrety założycieli", meta: "ZIP · JPG" },
    ],
  },
  contact: {
    eyebrow: "Investor Relations",
    title: "Porozmawiajmy.",
    text: "Masz pytania o PadelCity, Series A albo koinwestycje? Napisz do nas – odezwiemy się.",
    mailLabel: "Napisz e-mail",
    subject: "Investor Relations",
  },
};

export const investorsContent: Record<Locale, InvestorsContent> = { de, en, pl };

// TODO(content): dedicated IR mailbox (e.g. ir@padelcity.de) once set up – until then the general address.
export const irMailto = (subject: string) => `mailto:${site.email}?subject=${encodeURIComponent(subject)}`;
