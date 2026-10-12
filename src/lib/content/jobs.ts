import type { Locale } from "../i18n/config";
import type { Job } from "../data/types";
import { keyFacts } from "./partners";

// TODO(content): replace with the real Personio job feed (XML/API) – the roles below are illustrative only.
export const PERSONIO_URL = "https://padelcity.jobs.personio.de/";

type L = Record<Locale, string>;
type JobSeed = { id: string; title: L; department: L; location: L; employmentType: L };

const dep = {
  clubs: { de: "Clubs & Operations", en: "Clubs & Operations" },
  academy: { de: "Academy", en: "Academy" },
  tech: { de: "Tech & Product", en: "Tech & Product" },
  expansion: { de: "Expansion & Franchise", en: "Expansion & Franchise" },
  marketing: { de: "Marketing & Brand", en: "Marketing & Brand" },
} satisfies Record<string, L>;

const fullTime: L = { de: "Vollzeit", en: "Full-time" };
const remoteMunich: L = { de: "Remote / München", en: "Remote / Munich" };
const munich: L = { de: "München", en: "Munich" };

const seeds: JobSeed[] = [
  { id: "club-manager-berlin", title: { de: "Club Manager:in", en: "Club Manager" }, department: dep.clubs, location: { de: "Berlin", en: "Berlin" }, employmentType: fullTime },
  { id: "padel-coach-muenchen", title: { de: "Padel Coach (m/w/d)", en: "Padel Coach" }, department: dep.academy, location: munich, employmentType: { de: "Vollzeit / Teilzeit", en: "Full-time / part-time" } },
  { id: "rezeption-hannover", title: { de: "Mitarbeiter:in Empfang & Service", en: "Front Desk & Service Assistant" }, department: dep.clubs, location: { de: "Hannover", en: "Hanover" }, employmentType: { de: "Minijob / Teilzeit", en: "Mini-job / part-time" } },
  { id: "flutter-developer", title: { de: "Senior Flutter Developer", en: "Senior Flutter Developer" }, department: dep.tech, location: remoteMunich, employmentType: fullTime },
  { id: "product-designer", title: { de: "Product Designer:in (App)", en: "Product Designer (App)" }, department: dep.tech, location: remoteMunich, employmentType: fullTime },
  { id: "expansion-manager", title: { de: "Expansion Manager:in International", en: "International Expansion Manager" }, department: dep.expansion, location: munich, employmentType: fullTime },
  { id: "content-creator", title: { de: "Content Creator:in PadelCity TV", en: "Content Creator, PadelCity TV" }, department: dep.marketing, location: munich, employmentType: fullTime },
  { id: "event-manager", title: { de: "Event Manager:in", en: "Event Manager" }, department: dep.marketing, location: { de: "Dortmund", en: "Dortmund" }, employmentType: fullTime },
];

export function getJobs(locale: Locale): Job[] {
  return seeds.map((s) => ({
    id: s.id,
    title: s.title[locale],
    department: s.department[locale],
    location: s.location[locale],
    employmentType: s.employmentType[locale],
    url: PERSONIO_URL,
  }));
}

type BenefitIcon = "padel" | "graduation" | "laptop" | "party" | "rocket" | "gift";

// Contentful: page "jobs" (modules listed in src/views/jobs/JobsView.tsx)
const de = {
  meta: {
    title: "Jobs & Karriere",
    description: "Arbeite bei PadelCity: Jobs in Clubs, Academy, Tech, Marketing und Expansion. Freies Padel inklusive.",
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
    lead: "Alle Stellen werden über Personio verwaltet – ein Klick, und du bist im Bewerbungsprozess.",
  },
  board: {
    all: "Alle",
    department: "Bereich",
    location: "Standort",
    one: "offene Stelle",
    many: "offene Stellen",
    open: "Stelle bei Personio öffnen",
    empty: "Gerade nichts dabei – bewirb dich initiativ!",
  },
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
    lead: "All positions are managed via Personio – one click and you're in the application process.",
  },
  board: {
    all: "All",
    department: "Team",
    location: "Location",
    one: "open position",
    many: "open positions",
    open: "Open position on Personio",
    empty: "Nothing for you right now? Send us a speculative application!",
  },
  initiative: {
    title: "Nothing that fits? Apply",
    accent: "anyway",
    text: "We're growing into new cities and countries. If you love padel, we may well find exactly the right role for you.",
    cta: "Apply speculatively",
  },
};

export const jobsContent: Record<Locale, JobsContent> = { de, en };
