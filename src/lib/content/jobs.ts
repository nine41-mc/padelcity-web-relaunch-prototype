import type { Locale } from "../i18n/config";
import { keyFacts } from "./partners";

// Jobs page: static content from Contentful (page "jobs"); the open positions come straight from Personio
// (embedded career page, see components/brand/PersonioJobs.tsx). Initiative applications by e-mail to People & Culture.
export const APPLY_EMAIL = "personal@padelcity.de";

/** Contact for applications (as on padelcity.de/jobs). */
export const jobsContact = {
  name: "Astrid Nindl",
  role: "Head of People & Culture",
  email: APPLY_EMAIL,
  phone: "+49 151 65163146",
  image: "/images/team/astrid-nindl.jpg",
};

type BenefitIcon = "padel" | "graduation" | "laptop" | "party" | "rocket" | "gift";

// Contentful: page "jobs" (modules listed in src/views/jobs/JobsView.tsx)
const de = {
  meta: {
    title: "Jobs & Karriere",
    description: "Arbeite bei PadelCity: offene Stellen in unseren Clubs, in der Academy und im Headquarter in München.",
  },
  hero: {
    eyebrow: "Jobs & Karriere",
    imageAlt: "Empfang und Shop in einem PadelCity Club",
    title: "Mach Padel zu deinem",
    accent: "Job",
    lead: `Clubs eröffnen, Community bauen, eine App für tausende Spieler:innen entwickeln: Bei PadelCity machst du Padel zum Breitensport – in ${keyFacts.clubs}+ Clubs und bald in neuen Ländern.`,
    ctaPrimary: "Offene Stellen",
    ctaSecondary: "Initiativ bewerben",
  },
  benefits: {
    eyebrow: "Benefits",
    title: "Mehr als ein Job",
    lead: "Wir arbeiten hart, spielen viel und wachsen zusammen.",
    // TODO(content): confirm actual benefits with HR.
    items: [
      { title: "Freies Padel", text: "Spiel kostenlos in allen PadelCity Clubs.", icon: "padel" },
      { title: "Academy-Training", text: "Trainings mit unseren Coaches – vom ersten Schlag bis zum Turnier.", icon: "graduation" },
      { title: "Flexibel arbeiten", text: "Hybrid & Remote, wo es die Rolle zulässt.", icon: "laptop" },
      { title: "Team-Events", text: "Turniere, Offsites und Partys, die man nicht vergisst.", icon: "party" },
      { title: "Wachstum", text: "Neue Länder, neue Clubs – und Raum, mitzuwachsen.", icon: "rocket" },
      { title: "Partner-Deals", text: "Rabatte bei Partnern aus Sport, Fashion & Lifestyle.", icon: "gift" },
    ] as { title: string; text: string; icon: BenefitIcon }[],
  },
  culture: {
    eyebrow: "Kultur",
    title: "Sieben Werte, die du bei uns jeden Tag spürst",
    imageAlt: "Gruppenfoto der PadelCity Community bei einem Club-Opening",
    text: "Bei uns zählt, was du bewegst – nicht, wie lange du im Büro sitzt. Wir sind ein Team aus Sportverrückten, Builder:innen und Gastgeber:innen, das jeden Club so eröffnet, als wäre es der erste.",
  },
  faces: {
    eyebrow: "Faces of PadelCity",
    title: "Mit diesen Leuten arbeitest du",
    lead: "Club-Teams, Events, Operations, Brand – ein Ausschnitt aus unserem Team.",
    all: "Ganzes Team ansehen",
  },
  openings: {
    eyebrow: "Offene Stellen",
    title: "Finde deine Rolle",
    lead: "Alle offenen Stellen kommen direkt aus unserem Bewerbermanagement. Rolle aussuchen, Lebenslauf hochladen – kein Anschreiben-Template, wir wollen dich kennenlernen.",
  },
  personio: {
    title: "Offene Stellen bei PadelCity (Personio)",
    placeholder: { title: "Hier laufen die Stellen aus Personio ein", text: "Im Live-Betrieb erscheint an dieser Stelle die Personio-Karriereseite von PadelCity mit allen offenen Stellen und dem Bewerbungsformular." },
  },

  contact: { eyebrow: "Deine Ansprechpartnerin", text: "Fragen zu einer Stelle oder zur Bewerbung? Melde dich direkt bei Astrid.", mail: "E-Mail", phone: "Telefon" },
  initiative: {
    title: "Nichts dabei? Bewirb dich",
    accent: "initiativ",
    text: "Wir wachsen in neue Städte und Länder. Wenn du Lust auf Padel hast, finden wir vielleicht genau die richtige Rolle für dich.",
    cta: "Initiativ bewerben",
  },
};

export type JobsContent = typeof de;

const en: JobsContent = {
  meta: {
    title: "Jobs & careers",
    description: "Work at PadelCity: jobs in clubs, academy, tech, marketing and expansion. Free padel included.",
  },
  hero: {
    eyebrow: "Jobs & careers",
    imageAlt: "Reception and shop at a PadelCity club",
    title: "Make padel your",
    accent: "job",
    lead: `Opening clubs, building community, developing an app for thousands of players: at PadelCity you'll help make padel a sport for everyone – at ${keyFacts.clubs}+ clubs and soon in new countries.`,
    ctaPrimary: "Open positions",
    ctaSecondary: "Apply speculatively",
  },
  benefits: {
    eyebrow: "Benefits",
    title: "More than a job",
    lead: "We work hard, play a lot and grow together.",
    items: [
      { title: "Free padel", text: "Play for free at every PadelCity club.", icon: "padel" },
      { title: "Academy coaching", text: "Sessions with our coaches – from your first swing to your first tournament.", icon: "graduation" },
      { title: "Flexible working", text: "Hybrid and remote, wherever the role allows.", icon: "laptop" },
      { title: "Team events", text: "Tournaments, offsites and parties you won't forget.", icon: "party" },
      { title: "Growth", text: "New countries, new clubs – and room to grow with them.", icon: "rocket" },
      { title: "Partner deals", text: "Discounts with partners from sport, fashion & lifestyle.", icon: "gift" },
    ],
  },
  culture: {
    eyebrow: "Culture",
    title: "Seven values you'll feel here every day",
    imageAlt: "Group photo of the PadelCity community at a club opening",
    text: "What counts is what you get moving – not how long you sit at your desk. We're a team of sports fanatics, builders and hosts who open every club as if it were our first.",
  },
  faces: {
    eyebrow: "Faces of PadelCity",
    title: "The people you'll work with",
    lead: "Club teams, events, operations, brand – a snapshot of our team.",
    all: "Meet the whole team",
  },
  openings: {
    eyebrow: "Open positions",
    title: "Find your role",
    lead: "All open positions come straight from our applicant management. Pick a role, upload your CV – no cover-letter template, we want to get to know you.",
  },
  personio: {
    title: "Open positions at PadelCity (Personio)",
    placeholder: { title: "Personio jobs appear here", text: "On the live site this is where PadelCity's Personio career page appears, with all open positions and the application form." },
  },

  contact: { eyebrow: "Your contact", text: "Questions about a role or your application? Get in touch with Astrid directly.", mail: "E-mail", phone: "Phone" },
  initiative: {
    title: "Nothing that fits? Apply",
    accent: "anyway",
    text: "We're growing into new cities and countries. If you love padel, we may well find exactly the right role for you.",
    cta: "Apply speculatively",
  },
};

const pl: JobsContent = {
  meta: {
    title: "Praca i kariera",
    description: "Pracuj w PadelCity: oferty pracy w naszych klubach, w Akademii i w centrali w Monachium.",
  },
  hero: {
    eyebrow: "Praca i kariera",
    imageAlt: "Recepcja i sklep w klubie PadelCity",
    title: "Zrób z padla swoją",
    accent: "pracę",
    lead: `Otwieranie klubów, budowanie społeczności, rozwijanie aplikacji dla tysięcy graczy: w PadelCity sprawiasz, że padel staje się sportem dla każdego – w ${keyFacts.clubs}+ klubach, a wkrótce w nowych krajach.`,
    ctaPrimary: "Oferty pracy",
    ctaSecondary: "Aplikuj spontanicznie",
  },
  benefits: {
    eyebrow: "Benefity",
    title: "Więcej niż praca",
    lead: "Ciężko pracujemy, dużo gramy i rośniemy razem.",
    items: [
      { title: "Darmowy padel", text: "Graj bezpłatnie we wszystkich klubach PadelCity.", icon: "padel" },
      { title: "Treningi w Akademii", text: "Treningi z naszymi trenerami – od pierwszego uderzenia po turniej.", icon: "graduation" },
      { title: "Elastyczna praca", text: "Hybrydowo i zdalnie, tam gdzie pozwala na to stanowisko.", icon: "laptop" },
      { title: "Eventy zespołowe", text: "Turnieje, wyjazdy integracyjne i imprezy, których się nie zapomina.", icon: "party" },
      { title: "Rozwój", text: "Nowe kraje, nowe kluby – i przestrzeń, by rosnąć razem z nami.", icon: "rocket" },
      { title: "Zniżki partnerskie", text: "Rabaty u partnerów ze świata sportu, mody i lifestyle'u.", icon: "gift" },
    ],
  },
  culture: {
    eyebrow: "Kultura",
    title: "Siedem wartości, które czujesz u nas każdego dnia",
    imageAlt: "Zdjęcie grupowe społeczności PadelCity na otwarciu klubu",
    text: "Liczy się to, co ruszasz z miejsca – a nie to, jak długo siedzisz w biurze. Jesteśmy zespołem zapaleńców sportu, budowniczych i gospodarzy, który otwiera każdy klub tak, jakby był pierwszy.",
  },
  faces: {
    eyebrow: "Faces of PadelCity",
    title: "Z tymi ludźmi będziesz pracować",
    lead: "Zespoły klubowe, eventy, operacje, marka – wycinek naszego zespołu.",
    all: "Poznaj cały zespół",
  },
  openings: {
    eyebrow: "Oferty pracy",
    title: "Znajdź swoją rolę",
    lead: "Wszystkie oferty pochodzą bezpośrednio z naszego systemu rekrutacyjnego. Wybierz rolę, wgraj CV – bez szablonowego listu motywacyjnego, chcemy poznać ciebie.",
  },
  personio: {
    title: "Oferty pracy w PadelCity (Personio)",
    placeholder: { title: "Tu pojawią się oferty z Personio", text: "Na stronie produkcyjnej w tym miejscu pojawi się strona kariery PadelCity z Personio – ze wszystkimi ofertami i formularzem aplikacyjnym." },
  },

  contact: { eyebrow: "Twoja osoba kontaktowa", text: "Masz pytania o ofertę lub rekrutację? Napisz albo zadzwoń bezpośrednio do Astrid.", mail: "E-mail", phone: "Telefon" },
  initiative: {
    title: "Nic dla ciebie? Aplikuj",
    accent: "spontanicznie",
    text: "Wchodzimy do nowych miast i krajów. Jeśli masz zajawkę na padla, może znajdziemy dla ciebie dokładnie właściwą rolę.",
    cta: "Aplikuj spontanicznie",
  },
};

export const jobsContent: Record<Locale, JobsContent> = { de, en, pl };
