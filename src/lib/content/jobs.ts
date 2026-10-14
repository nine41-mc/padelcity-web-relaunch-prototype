import type { Locale } from "../i18n/config";
import type { Job } from "../data/types";
import { keyFacts } from "./partners";

// Open positions as published on padelcity.de/jobs (taken over 15.10.2026). Applications go by e-mail to
// People & Culture (Astrid Nindl) – no Personio. Contentful: jobPosting entries (or a feed once an ATS is used).
export const JOBS_SOURCE = "https://padelcity.de/jobs/";
export const APPLY_EMAIL = "personal@padelcity.de";
/** @deprecated PadelCity doesn't use Personio – kept only so old imports don't break. */
export const PERSONIO_URL = JOBS_SOURCE;

/** Contact for applications (as on padelcity.de/jobs). */
export const jobsContact = {
  name: "Astrid Nindl",
  role: "Head of People & Culture",
  email: APPLY_EMAIL,
  phone: "+49 151 65163146",
  image: "/images/team/astrid-nindl.jpg",
};

type L = Record<Locale, string>;
type JobSeed = { id: string; title: L; department: L; location: L; employmentType: L };

const dep = {
  finance: { de: "Finance", en: "Finance" },
  academy: { de: "Academy", en: "Academy" },
  people: { de: "People & Culture", en: "People & Culture" },
  clubs: { de: "Clubs & Operations", en: "Clubs & Operations" },
} satisfies Record<string, L>;

const fullTime: L = { de: "Vollzeit", en: "Full-time" };
const munich: L = { de: "München", en: "Munich" };
const same = (v: string): L => ({ de: v, en: v });

const seeds: JobSeed[] = [
  { id: "fpa-manager-muenchen", title: { de: "FP&A Manager:in (m/w/d) – Financial Planning, Analytics & Automation", en: "FP&A Manager (m/f/d) – Financial Planning, Analytics & Automation" }, department: dep.finance, location: munich, employmentType: fullTime },
  { id: "padel-coach-ulm", title: { de: "Padel Coach (m/w/d)", en: "Padel Coach (m/f/d)" }, department: dep.academy, location: same("Ulm"), employmentType: fullTime },
  { id: "padel-coach-karlsruhe", title: { de: "Padel Coach (m/w/d)", en: "Padel Coach (m/f/d)" }, department: dep.academy, location: same("Karlsruhe"), employmentType: fullTime },
  { id: "coach-head-coach-berlin", title: { de: "Coach / Head Coach", en: "Coach / Head Coach" }, department: dep.academy, location: same("Berlin"), employmentType: { de: "Teilzeit, Minijob oder Werkstudent:in (20 h)", en: "Part-time, mini-job or working student (20 h)" } },
  { id: "werkstudent-hr-muenchen", title: { de: "Werkstudent:in HR", en: "Working Student HR" }, department: dep.people, location: munich, employmentType: { de: "Werkstudent:in (20 h)", en: "Working student (20 h)" } },
  { id: "club-manager-chemnitz", title: { de: "Club Manager:in (m/w/d)", en: "Club Manager (m/f/d)" }, department: dep.clubs, location: same("Chemnitz"), employmentType: fullTime },
  { id: "club-manager-radolfzell", title: { de: "Club Manager:in (m/w/d)", en: "Club Manager (m/f/d)" }, department: dep.clubs, location: same("Radolfzell"), employmentType: fullTime },
  { id: "minijob-werkstudent", title: { de: "Minijobber:in und Werkstudent:in (m/w/d)", en: "Mini-jobber and Working Student (m/f/d)" }, department: dep.clubs, location: { de: "Verschiedene Standorte", en: "Various locations" }, employmentType: { de: "Minijob", en: "Mini-job" } },
];

/** Each role opens an e-mail to People & Culture with the role in the subject. */
export function getJobs(locale: Locale): Job[] {
  const prefix = locale === "de" ? "Bewerbung" : "Application";
  return seeds.map((s) => ({
    id: s.id,
    title: s.title[locale],
    department: s.department[locale],
    location: s.location[locale],
    employmentType: s.employmentType[locale],
    url: `mailto:${APPLY_EMAIL}?subject=${encodeURIComponent(`${prefix}: ${s.title[locale]} – ${s.location[locale]}`)}`,
  }));
}

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
    lead: "Schick uns deinen Lebenslauf und ein paar Sätze, warum dich die Rolle reizt – kein Anschreiben-Template, wir wollen dich kennenlernen.",
  },
  board: {
    all: "Alle",
    department: "Bereich",
    location: "Standort",
    one: "offene Stelle",
    many: "offene Stellen",
    open: "Jetzt per E-Mail bewerben",
    empty: "Gerade nichts dabei – bewirb dich initiativ!",
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
    lead: "Send us your CV and a few lines on why the role excites you – no cover-letter template, we want to get to know you.",
  },
  board: {
    all: "All",
    department: "Team",
    location: "Location",
    one: "open position",
    many: "open positions",
    open: "Apply by e-mail",
    empty: "Nothing for you right now? Send us a speculative application!",
  },
  contact: { eyebrow: "Your contact", text: "Questions about a role or your application? Get in touch with Astrid directly.", mail: "E-mail", phone: "Phone" },
  initiative: {
    title: "Nothing that fits? Apply",
    accent: "anyway",
    text: "We're growing into new cities and countries. If you love padel, we may well find exactly the right role for you.",
    cta: "Apply speculatively",
  },
};

export const jobsContent: Record<Locale, JobsContent> = { de, en };
