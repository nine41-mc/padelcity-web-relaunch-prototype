import type { Locale } from "../i18n/config";
import type { ClubEvent } from "../data/types";

/**
 * Events pages copy (Contentful: page "events" + "eventDetail" labels) and editorial content for
 * hero events. Prototype copy — TODO(content): review with Events team.
 * No booking-system data: no places left, no capacity, no occupancy.
 */

const de = {
  meta: {
    title: "Events & Turniere",
    description: "Social Events, Turniere und Trainings in allen PadelCity Clubs – plus Highlights wie die One Point Challenge und die PadelCity Series Finals.",
  },
  hero: {
    eyebrow: "Game. Set. Match.",
    imageAlt: "Volle Tribüne bei einem PadelCity Turnier",
    lead: "Vom Afterwork-Americano bis zur 100.000-€-Challenge: Hier spielt die Community. Komm vorbei, misch mit, #bettertogether.",
    title: "Social",
    accent: "Events",
    titleEnd: "& Turniere",
    ctaFind: "Events finden",
    ctaApp: "In der App öffnen",
  },
  highlights: {
    eyebrow: "Highlights",
    title: "Die großen Bühnen",
    text: "Unsere Leuchtturm-Events: Profis, Promis und die ganze PadelCity Community an einem Ort.",
  },
  local: {
    eyebrow: "In deinem Club",
    title: "Spielen, lachen, wiederkommen",
    note: "Anmeldung & Bezahlung laufen exklusiv über die PadelCity App – ein Tap auf „In der App anmelden“ bringt dich direkt hin.",
  },
  explorer: {
    filterLabel: "Events filtern",
    typeLabel: "Eventtyp",
    all: "Alle",
    cityLabel: "Stadt",
    allCities: "Alle Städte",
    thisWeek: "Diese Woche",
    one: "Event",
    many: "Events",
    inCity: "in",
    emptyTitle: "Gerade kein Match für deinen Filter",
    emptyText: "Probier eine andere Stadt oder schau in der App – dort findest du zusätzlich Open Matches in deiner Nähe.",
    reset: "Filter zurücksetzen",
  },
  types: { social: "Social", tournament: "Turnier", training: "Training", hero: "Highlight" } satisfies Record<ClubEvent["type"], string>,
  countdown: { days: "Tage", hours: "Std", minutes: "Min", seconds: "Sek", live: "Live!", aria: "Countdown bis Eventstart" },
  card: { more: "Mehr erfahren" },
  detail: {
    back: "Alle Events",
    signup: "In der App anmelden",
    formatCta: "Format & Zeitplan",
    date: "Datum",
    place: "Ort",
    tba: "TBA",
    formatEyebrow: "Format & Ablauf",
    formatTitle: "So läuft's",
    scheduleEyebrow: "Zeitplan",
    scheduleTitle: "Save the date",
    scheduleNote: "Vorläufiger Zeitplan – Änderungen vorbehalten. Updates bekommst du per Push in der App.",
    videoEyebrow: "Watch",
    videoTitle: "Feel the vibe",
    videoNote: "Das Video lädt erst nach deinem Klick – vorher werden keine Daten an YouTube übertragen.",
    partners: "Partner & Sponsoren",
    partnerCta: "Dein Brand auf dem Center Court?",
    partnerLink: "Partner werden",
    bannerTitle: "Sei",
    bannerAccent: "dabei.",
    bannerText: (title: string) => `Anmeldung, Bezahlung und alle Updates zu ${title} laufen über die PadelCity App.`,
    fallbackDescription: (type: string, where: string) =>
      `${type} bei ${where}: Komm allein oder mit Freund:innen – wir mischen die Teams nach Level, damit jedes Match spannend bleibt.`,
    metaDescription: (title: string, type: string, where: string) => `${title} – ${type} bei ${where}. Jetzt in der PadelCity App anmelden.`,
    steps: [
      { title: "Ankommen", text: "15 Min vorher da sein, Schläger gibt's zur Not an der Rezeption." },
      { title: "Spielen", text: "Wechselnde Partner, kurze Matches, viel Spaß." },
      { title: "Hängenbleiben", text: "Drinks & Community im Anschluss. #bettertogether" },
    ],
    perPerson: "pro Person",
    free: "Free",
    appOnly: "Anmeldung & Bezahlung exklusiv in der PadelCity App.",
    moreIn: "Mehr in",
  },
  date: { time: "Uhr" },
};

type EventsContent = typeof de;

const en: EventsContent = {
  meta: {
    title: "Events & tournaments",
    description: "Social events, tournaments and training sessions at every PadelCity club – plus headline moments like the One Point Challenge and the PadelCity Series Finals.",
  },
  hero: {
    eyebrow: "Game. Set. Match.",
    imageAlt: "Packed stands at a PadelCity tournament",
    lead: "From after-work Americanos to a €100,000 challenge: this is where the community plays. Drop in, join the mix, #bettertogether.",
    title: "Social",
    accent: "events",
    titleEnd: "& tournaments",
    ctaFind: "Find events",
    ctaApp: "Open in the app",
  },
  highlights: {
    eyebrow: "Highlights",
    title: "The big stages",
    text: "Our flagship events: pros, famous faces and the whole PadelCity community in one place.",
  },
  local: {
    eyebrow: "At your club",
    title: "Play, laugh, come back",
    note: "Sign-up and payment happen exclusively in the PadelCity app – one tap on “Sign up in the app” takes you straight there.",
  },
  explorer: {
    filterLabel: "Filter events",
    typeLabel: "Event type",
    all: "All",
    cityLabel: "City",
    allCities: "All cities",
    thisWeek: "This week",
    one: "event",
    many: "events",
    inCity: "in",
    emptyTitle: "Nothing matches your filter right now",
    emptyText: "Try another city or have a look in the app – you'll also find open matches near you there.",
    reset: "Reset filters",
  },
  types: { social: "Social", tournament: "Tournament", training: "Training", hero: "Highlight" },
  countdown: { days: "Days", hours: "Hrs", minutes: "Min", seconds: "Sec", live: "Live!", aria: "Countdown to the start of the event" },
  card: { more: "Find out more" },
  detail: {
    back: "All events",
    signup: "Sign up in the app",
    formatCta: "Format & schedule",
    date: "Date",
    place: "Venue",
    tba: "TBA",
    formatEyebrow: "Format & flow",
    formatTitle: "How it works",
    scheduleEyebrow: "Schedule",
    scheduleTitle: "Save the date",
    scheduleNote: "Provisional schedule – subject to change. You'll get updates via push notification in the app.",
    videoEyebrow: "Watch",
    videoTitle: "Feel the vibe",
    videoNote: "The video only loads once you click – no data is sent to YouTube before that.",
    partners: "Partners & sponsors",
    partnerCta: "Your brand on centre court?",
    partnerLink: "Become a partner",
    bannerTitle: "Be",
    bannerAccent: "there.",
    bannerText: (title: string) => `Sign-up, payment and every update for ${title} run through the PadelCity app.`,
    fallbackDescription: (type: string, where: string) =>
      `${type} at ${where}: come on your own or bring friends – we mix the teams by level so every match stays exciting.`,
    metaDescription: (title: string, type: string, where: string) => `${title} – ${type} at ${where}. Sign up now in the PadelCity app.`,
    steps: [
      { title: "Arrive", text: "Be there 15 minutes early – if you need a racket, reception has you covered." },
      { title: "Play", text: "Rotating partners, short matches, loads of fun." },
      { title: "Hang out", text: "Drinks and community afterwards. #bettertogether" },
    ],
    perPerson: "per person",
    free: "Free",
    appOnly: "Sign-up and payment exclusively in the PadelCity app.",
    moreIn: "More at",
  },
  date: { time: "" },
};

export const eventsContent: Record<Locale, EventsContent> = { de, en };

/* ---------- Localized event fields (mock data is German; Contentful would deliver per locale) ---------- */

type EventOverride = Partial<Pick<ClubEvent, "subtitle" | "level" | "recurrence" | "city">> & { imageAlt?: string };

const eventOverridesEn: Record<string, EventOverride> = {
  "opc-vol3": { subtitle: "One point. All or nothing. €100,000 in prize money.", city: "Munich", imageAlt: "Match on the One Point Challenge centre court, surrounded by spectators" },
  "series-finals": { subtitle: "The best teams from every club. One weekend.", imageAlt: "Packed hall at a PadelCity tournament with matches on several courts" },
  "beginner-girls-tucherpark": { recurrence: "Every Friday", city: "Munich", imageAlt: "Player hitting a shot on court" },
  "intermediate-mix-tucherpark": { recurrence: "Every other Saturday", city: "Munich", imageAlt: "Player returning the ball in a mixed match, spectators courtside" },
  "advanced-mix-frankfurter-ring": { recurrence: "Every Sunday", city: "Munich", imageAlt: "Player hitting an overhead, partner at the net" },
  "afterwork-berlin": { level: "All levels", recurrence: "Every Wednesday", imageAlt: "Group of players with drinks at the net" },
  "king-of-the-court-frankfurt": { city: "Frankfurt", imageAlt: "Tournament match with spectators courtside" },
  "kids-camp-dortmund": { subtitle: "For kids aged 6–14", level: "Beginners", imageAlt: "Boy and girl hitting padel shots" },
};

/** Applies per-locale overrides to mock events (DE is the source language). */
export function localizeEvent(event: ClubEvent, locale: Locale): ClubEvent {
  if (locale === "de") return event;
  const o = eventOverridesEn[event.id];
  if (!o) return event;
  const { imageAlt, ...fields } = o;
  return { ...event, ...fields, image: event.image ? { ...event.image, alt: imageAlt ?? event.image.alt } : undefined };
}

/* ---------- Hero events (Contentful: "heroEvent" entries referencing the event by id) ---------- */

export type HeroEventContent = {
  claim: string; // text before the accent word
  claimAccent: string; // one word of the claim, rendered as <Accent>
  intro: string;
  facts: { label: string; value: string }[];
  format: { title: string; text: string }[];
  schedule: { day: string; items: { time: string; title: string }[] }[];
  partnerNames: string[]; // names from src/lib/content/partners.ts
  presenter?: string;
  video: { title: string; youtubeId?: string; thumbnail: string };
};

// TODO(content): final copy, schedule & partners from Events team.
export const heroEventContent: Record<string, Record<Locale, HeroEventContent>> = {
  "opc-vol3": {
    de: {
      claim: "Ein Punkt. Alles oder",
      claimAccent: "nichts.",
      intro:
        "Die verrückteste Turnierform im Padel kommt zurück: Jeder Ballwechsel ist ein K.-o.-Spiel. Profis, Promis und Qualifikanten aus allen PadelCity Clubs kämpfen um bis zu 100.000 € Preisgeld.",
      presenter: "powered by CUPRA",
      facts: [
        { label: "Preisgeld", value: "bis zu 100.000 €" },
        { label: "Format", value: "One Point · K.-o." },
        { label: "Qualifier", value: "In den PadelCity Clubs" },
        { label: "Tickets", value: "Zuschauer frei" }, // TODO(content): confirm ticketing
      ],
      format: [
        { title: "Qualifikation", text: "Qualifiziere dich bei einem der Club-Qualifier – Anmeldung in der App." },
        { title: "One Point Rounds", text: "Jedes Duell wird über genau einen Punkt entschieden. Wer verliert, ist raus." },
        { title: "Finale", text: "Die letzten zwei Teams spielen am Center Court um den Jackpot – live gestreamt." },
      ],
      schedule: [
        { day: "Tag 1", items: [{ time: "12:00", title: "Check-in & Warm-up" }, { time: "14:00", title: "Qualifier Rounds" }, { time: "20:00", title: "Players Night" }] },
        { day: "Tag 2", items: [{ time: "11:00", title: "Main Draw" }, { time: "17:00", title: "Promi-Showmatch" }] },
        { day: "Tag 3", items: [{ time: "14:00", title: "Halbfinals" }, { time: "18:00", title: "Finale & Siegerehrung" }] },
      ],
      partnerNames: ["CUPRA", "Babolat", "Haier", "Veltins", "Coca-Cola"],
      video: { title: "Aftermovie One Point Challenge Vol. 2", thumbnail: "/images/events/opc-video.jpg" },
    },
    en: {
      claim: "One point. All or",
      claimAccent: "nothing.",
      intro:
        "Padel's wildest tournament format is back: every rally is a knockout. Pros, famous faces and qualifiers from every PadelCity club battle it out for up to €100,000 in prize money.",
      presenter: "powered by CUPRA",
      facts: [
        { label: "Prize money", value: "up to €100,000" },
        { label: "Format", value: "One point · knockout" },
        { label: "Qualifiers", value: "At PadelCity clubs" },
        { label: "Tickets", value: "Free for spectators" }, // TODO(content): confirm ticketing
      ],
      format: [
        { title: "Qualifying", text: "Qualify at one of the club qualifiers – sign up in the app." },
        { title: "One point rounds", text: "Every duel is decided by a single point. Lose it and you're out." },
        { title: "Final", text: "The last two teams play for the jackpot on centre court – streamed live." },
      ],
      schedule: [
        { day: "Day 1", items: [{ time: "12:00", title: "Check-in & warm-up" }, { time: "14:00", title: "Qualifier rounds" }, { time: "20:00", title: "Players' night" }] },
        { day: "Day 2", items: [{ time: "11:00", title: "Main draw" }, { time: "17:00", title: "Celebrity show match" }] },
        { day: "Day 3", items: [{ time: "14:00", title: "Semi-finals" }, { time: "18:00", title: "Final & award ceremony" }] },
      ],
      partnerNames: ["CUPRA", "Babolat", "Haier", "Veltins", "Coca-Cola"],
      video: { title: "One Point Challenge Vol. 2 aftermovie", thumbnail: "/images/events/opc-video.jpg" },
    },
  },
  "series-finals": {
    de: {
      claim: "Die besten Teams. Ein",
      claimAccent: "Finale.",
      intro:
        "Eine Saison, alle Clubs, ein Finale: Die PadelCity Series powered by Babolat krönt ihre Champions. Zwei Tage Top-Padel, Musik und Community.",
      presenter: "powered by Babolat",
      facts: [
        { label: "Preisgeld", value: "[XX.XXX] €" }, // TODO(content): prize money from Events team
        { label: "Format", value: "Gruppen + K.-o." },
        { label: "Kategorien", value: "Herren · Damen · Mixed" },
        { label: "Qualifiziert", value: "Top-Teams der Saison" },
      ],
      format: [
        { title: "Gruppenphase", text: "Die Top-Teams aus allen Regionen spielen in Vierergruppen – best of 3 Sets." },
        { title: "K.-o.-Runde", text: "Ab dem Viertelfinale zählt jeder Punkt. Center Court mit Tribüne." },
        { title: "Champions Night", text: "Siegerehrung, Awards und Party mit der ganzen PadelCity Community." },
      ],
      schedule: [
        { day: "Samstag", items: [{ time: "10:00", title: "Gruppenphase" }, { time: "16:00", title: "Kids-Showcourt" }, { time: "19:00", title: "Players Dinner" }] },
        { day: "Sonntag", items: [{ time: "10:00", title: "Viertel- & Halbfinals" }, { time: "16:00", title: "Finals" }, { time: "18:30", title: "Champions Night" }] },
      ],
      partnerNames: ["Babolat", "CUPRA", "FALKE", "HanseMerkur", "Natural Elements"],
      video: { title: "Highlights PadelCity Series 2025", thumbnail: "/images/events/series-video.jpg" },
    },
    en: {
      claim: "The best teams. One",
      claimAccent: "final.",
      intro:
        "One season, every club, one final: the PadelCity Series powered by Babolat crowns its champions. Two days of top-level padel, music and community.",
      presenter: "powered by Babolat",
      facts: [
        { label: "Prize money", value: "€[XX,XXX]" }, // TODO(content): prize money from Events team
        { label: "Format", value: "Groups + knockout" },
        { label: "Categories", value: "Men · Women · Mixed" },
        { label: "Qualified", value: "The season's top teams" },
      ],
      format: [
        { title: "Group stage", text: "The top teams from every region play in groups of four – best of three sets." },
        { title: "Knockout round", text: "From the quarter-finals, every point counts. Centre court with grandstand." },
        { title: "Champions Night", text: "Trophies, awards and a party with the whole PadelCity community." },
      ],
      schedule: [
        { day: "Saturday", items: [{ time: "10:00", title: "Group stage" }, { time: "16:00", title: "Kids' show court" }, { time: "19:00", title: "Players' dinner" }] },
        { day: "Sunday", items: [{ time: "10:00", title: "Quarter- & semi-finals" }, { time: "16:00", title: "Finals" }, { time: "18:30", title: "Champions Night" }] },
      ],
      partnerNames: ["Babolat", "CUPRA", "FALKE", "HanseMerkur", "Natural Elements"],
      video: { title: "PadelCity Series 2025 highlights", thumbnail: "/images/events/series-video.jpg" },
    },
  },
};
