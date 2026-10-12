import type { Locale } from "../i18n/config";
import type { RouteKey } from "../i18n/routes";
import { keyFacts } from "./partners";

/**
 * Brand & company content (About us, shared milestones/values for Investors + Jobs).
 * Source: PadelCity brand book (2022–2025) + Elephant briefing. People live in ./people.ts – never here.
 * Everything here becomes Contentful content later (see Contentful module comments in the views).
 */

export type Milestone = {
  year: string;
  title: string;
  text: string;
  highlight?: boolean;
};

// TODO(content): verify every year/order against the brand book timeline before go-live.
const milestonesDe: Milestone[] = [
  { year: "2022", title: "Gründung & erster Club", text: `Vier Gründer, eine Idee: Padel für alle. In ${keyFacts.firstClub} eröffnet der erste PadelCity Club.` },
  { year: "2023", title: "App & CUPRA an Bord", text: "Die PadelCity App bringt Buchung, Matches und Community aufs Handy. CUPRA wird Mobility Partner." },
  {
    year: "2024",
    title: "Academy, Events & Franchise",
    text: "PadelCity Academy, die One Point Challenge powered by CUPRA mit bis zu 100.000 € Preisgeld und die ersten Franchise-Clubs.",
  },
  {
    year: "2025",
    title: "Bühne frei für Padel",
    text: "European Padel Championship, PRO7 Promi Padel WM, PadelCity Series powered by Babolat und Deutsche Meistertitel.",
  },
  {
    year: "2026",
    title: "Series A & neue Länder",
    text: `${keyFacts.clubs}+ Clubs, ${keyFacts.courts}+ Courts – und die Series A als Startschuss für PadelCity über Deutschland hinaus.`,
    highlight: true,
  },
];

const milestonesEn: Milestone[] = [
  { year: "2022", title: "Founded & first club", text: `Four founders, one idea: padel for everyone. The first PadelCity club opens in ${keyFacts.firstClub}.` },
  { year: "2023", title: "The app & CUPRA join", text: "The PadelCity app puts booking, matches and community in your pocket. CUPRA comes on board as mobility partner." },
  {
    year: "2024",
    title: "Academy, events & franchise",
    text: "The PadelCity Academy, the One Point Challenge powered by CUPRA with up to €100,000 in prize money, and our first franchise clubs.",
  },
  {
    year: "2025",
    title: "Padel takes centre stage",
    text: "European Padel Championship, the PRO7 Celebrity Padel World Cup, the PadelCity Series powered by Babolat and German championship titles.",
  },
  {
    year: "2026",
    title: "Series A & new countries",
    text: `${keyFacts.clubs}+ clubs, ${keyFacts.courts}+ courts – and the Series A as the starting gun for PadelCity beyond Germany.`,
    highlight: true,
  },
];

export const milestones: Record<Locale, Milestone[]> = { de: milestonesDe, en: milestonesEn };

export type Value = { name: string; claim: string; text: string };

/** Brand book values (names stay English in both languages). TODO(content): align claims/texts with the brand book wording. */
export const values: Record<Locale, Value[]> = {
  de: [
    { name: "Community", claim: "#bettertogether", text: "Padel spielt man zu viert. Bei uns findest du deine Leute – auf und neben dem Court." },
    { name: "Fun", claim: "Lachen ist Pflicht", text: "Wir nehmen den Sport ernst, uns selbst aber nicht. Der beste Punkt ist der, über den alle lachen." },
    { name: "Commitment", claim: "All in", text: "Wir ziehen durch – für unsere Spieler:innen, Clubs und Partner. Jeden Tag." },
    { name: "Trust", claim: "Wort ist Wort", text: "Ehrlich, verlässlich, transparent. Gegenüber Community, Team und Partnern." },
    { name: "Consistency", claim: "Überall PadelCity", text: "Gleiche Qualität, gleiches Gefühl – egal in welchem Club du spielst." },
    { name: "Welcoming", claim: "Komm wie du bist", text: "Ob erster Schlag oder Turnier-Profi: Bei uns ist jede:r willkommen." },
    { name: "Energy", claim: "Make some noise", text: "Musik, Licht, Vibes. Wir bringen Energie auf jeden Court." },
  ],
  en: [
    { name: "Community", claim: "#bettertogether", text: "Padel is played in fours. With us you'll find your people – on and off the court." },
    { name: "Fun", claim: "Laughing is mandatory", text: "We take the sport seriously, just not ourselves. The best point is the one everyone laughs about." },
    { name: "Commitment", claim: "All in", text: "We see things through – for our players, clubs and partners. Every single day." },
    { name: "Trust", claim: "Our word counts", text: "Honest, reliable, transparent. With our community, our team and our partners." },
    { name: "Consistency", claim: "PadelCity everywhere", text: "Same quality, same feeling – whichever club you play at." },
    { name: "Welcoming", claim: "Come as you are", text: "First swing or tournament pro: everyone is welcome here." },
    { name: "Energy", claim: "Make some noise", text: "Music, lights, vibes. We bring the energy to every court." },
  ],
};

export type PillarIcon = "users" | "graduation" | "store" | "smartphone" | "instagram" | "court" | "trophy";
export type Pillar = { name: string; text: string; route?: RouteKey; icon: PillarIcon };

export const pillars: Record<Locale, Pillar[]> = {
  de: [
    { name: "Community", text: "WhatsApp-Gruppen, Open Matches, Socials – die größte Padel-Community Deutschlands.", icon: "users" },
    { name: "Academy", text: "Trainings & Kurse für jedes Level, von der ersten Stunde bis zum Turnier.", route: "academy", icon: "graduation" },
    { name: "Franchise", text: "Mit Partnern bringen wir PadelCity in neue Städte.", route: "franchise", icon: "store" },
    { name: "App", text: "Courts buchen, Matches finden, Ranking checken – alles in einer App.", route: "app", icon: "smartphone" },
    { name: "Social Media", text: "PadelCity TV, Magazin und Social: Padel-Culture, die man sieht.", route: "magazine", icon: "instagram" },
    { name: "Courts", text: `${keyFacts.courts}+ Courts in ${keyFacts.clubs}+ Clubs – indoor, outdoor, Panorama.`, route: "locations", icon: "court" },
    { name: "Events", text: "Von Social Mixed bis One Point Challenge und Premier Padel.", route: "events", icon: "trophy" },
  ],
  en: [
    { name: "Community", text: "WhatsApp groups, open matches, socials – Germany's biggest padel community.", icon: "users" },
    { name: "Academy", text: "Coaching and courses for every level, from your first lesson to your first tournament.", route: "academy", icon: "graduation" },
    { name: "Franchise", text: "Together with partners we're taking PadelCity to new cities.", route: "franchise", icon: "store" },
    { name: "App", text: "Book courts, find matches, check your ranking – all in one app.", route: "app", icon: "smartphone" },
    { name: "Social media", text: "PadelCity TV, the magazine and socials: padel culture you can see.", route: "magazine", icon: "instagram" },
    { name: "Courts", text: `${keyFacts.courts}+ courts at ${keyFacts.clubs}+ clubs – indoor, outdoor, panorama.`, route: "locations", icon: "court" },
    { name: "Events", text: "From social mixers to the One Point Challenge and Premier Padel.", route: "events", icon: "trophy" },
  ],
};

// Contentful: page "about" (modules listed in src/views/about/AboutView.tsx)
const de = {
  meta: {
    title: "Über uns",
    description:
      "Wir wollten mehr Padel spielen – also haben wir PadelCity gegründet. Story, Mission, Werte und die Menschen hinter Deutschlands führendem Padel-Betreiber.",
  },
  hero: {
    eyebrow: `Seit ${keyFacts.foundedYear}`,
    imageAlt: "Die PadelCity Community feiert nach einem Turnier",
    title: "Wir wollten mehr Padel",
    accent: "spielen",
    lead: "Wir sind PadelCity: Deutschlands führender Padel-Betreiber, eine Community und eine Bewegung. Unser Ziel? Padel zum Breitensport machen.",
    cta: "Unsere Story",
  },
  story: {
    eyebrow: "Die Story",
    paragraphs: [
      "Alles begann mit einem simplen Problem: Wir wollten mehr Padel spielen – und fanden keine Courts. Die wenigen, die es gab, waren Wochen im Voraus ausgebucht.",
      `Also haben wir ${keyFacts.foundedYear} selbst angefangen zu bauen. Der erste Club entstand in ${keyFacts.firstClub}. Heute spielt unsere Community in über ${keyFacts.clubs} PadelCity Clubs auf mehr als ${keyFacts.courts} Courts in über ${keyFacts.cities} Städten.`,
      "Und wir sind noch lange nicht fertig.",
    ],
  },
  vision: [
    { k: "Vision", t: "Padel für alle.", d: "Jede:r in Deutschland – und darüber hinaus – soll einen PadelCity Court in der Nähe haben." },
    { k: "Mission", t: "Infrastruktur + Community.", d: "Wir bauen Clubs, eine App und eine Community, die Padel zum Breitensport machen. #bettertogether" },
  ],
  values: { eyebrow: "Unsere Werte", title: "Sieben Werte. Ein Team.", lead: "Was uns antreibt – auf dem Court, im Club und im Office.", aria: "Unsere Werte" },
  pillars: { eyebrow: "Was PadelCity ausmacht", title: "Die 7 Säulen von PadelCity" },
  founders: { eyebrow: "Gründer", title: "Die Köpfe hinter PadelCity" },
  faces: {
    eyebrow: "Faces of PadelCity",
    title: "Das Team hinter den Clubs",
    lead: "Club-Teams, Events, Operations, Brand: Sie machen PadelCity jeden Tag zu dem, was es ist.",
  },
  milestones: { eyebrow: "Meilensteine", title: "Unsere Reise bis heute" },
  jobs: {
    title: "Werde Teil vom",
    accent: "Team",
    text: "Clubs, Academy, Tech oder Marketing – wir suchen Menschen, die Padel genauso lieben wie wir.",
    cta: "Zu den Jobs",
    imageAlt: "Das PadelCity Team bei einem Club-Opening",
  },
};

export type AboutContent = typeof de;

const en: AboutContent = {
  meta: {
    title: "About us",
    description:
      "We wanted to play more padel – so we founded PadelCity. The story, mission, values and people behind Germany's leading padel operator.",
  },
  hero: {
    eyebrow: `Since ${keyFacts.foundedYear}`,
    imageAlt: "The PadelCity community celebrating after a tournament",
    title: "We just wanted to play more",
    accent: "padel",
    lead: "We are PadelCity: Germany's leading padel operator, a community and a movement. Our goal? Making padel a sport for everyone.",
    cta: "Our story",
  },
  story: {
    eyebrow: "The story",
    paragraphs: [
      "It all started with a simple problem: we wanted to play more padel – and couldn't find a court. The few that existed were booked up weeks in advance.",
      `So in ${keyFacts.foundedYear} we started building our own. The first club opened in ${keyFacts.firstClub}. Today our community plays at more than ${keyFacts.clubs} PadelCity clubs on over ${keyFacts.courts} courts in more than ${keyFacts.cities} cities.`,
      "And we're only just getting started.",
    ],
  },
  vision: [
    { k: "Vision", t: "Padel for everyone.", d: "Everyone in Germany – and beyond – should have a PadelCity court nearby." },
    { k: "Mission", t: "Infrastructure + community.", d: "We build clubs, an app and a community that make padel a sport for everyone. #bettertogether" },
  ],
  values: { eyebrow: "Our values", title: "Seven values. One team.", lead: "What drives us – on court, in the club and in the office.", aria: "Our values" },
  pillars: { eyebrow: "What makes PadelCity", title: "The 7 pillars of PadelCity" },
  founders: { eyebrow: "Founders", title: "The minds behind PadelCity" },
  faces: {
    eyebrow: "Faces of PadelCity",
    title: "The team behind the clubs",
    lead: "Club teams, events, operations, brand: they make PadelCity what it is, every single day.",
  },
  milestones: { eyebrow: "Milestones", title: "Our journey so far" },
  jobs: {
    title: "Join the",
    accent: "team",
    text: "Clubs, academy, tech or marketing – we're looking for people who love padel as much as we do.",
    cta: "See all jobs",
    imageAlt: "The PadelCity team at a club opening",
  },
};

export const aboutContent: Record<Locale, AboutContent> = { de, en };
