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
  },
  local: {
    eyebrow: "In deinem Club",
    title: "Spielen, lachen, wiederkommen",
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
  countdown: { days: "Tage", hours: "Stunden", minutes: "Minuten", seconds: "Sekunden", live: "Live!", aria: "Countdown bis Eventstart" },
  card: { more: "Mehr erfahren" },
  detail: {
    date: "Datum",
    place: "Ort",
    scheduleEyebrow: "Zeitplan",
    scheduleTitle: "Save the date",
    scheduleNote: "Vorläufiger Zeitplan – Änderungen vorbehalten. Updates bekommst du per Push in der App.",
    videoEyebrow: "Watch",
    videoTitle: "Feel the vibe",
    videoNote: "Das Video lädt erst nach deinem Klick – vorher werden keine Daten an YouTube übertragen.",
    fallbackDescription: (type: string, where: string) =>
      `${type} im Club ${where}: Komm allein oder mit Freund:innen – wir mischen die Teams nach Level, damit jedes Match spannend bleibt.`,
    metaTitle: (title: string, city: string) => `${title} – Padel-Event in ${city}`,
    metaDescription: (title: string, type: string, where: string) => `${title} – ${type} im Club ${where}. Jetzt im Web oder in der PadelCity App anmelden.`,
    steps: [
      { title: "Ankommen", text: "15 Min vorher da sein, Schläger gibt's zur Not an der Rezeption." },
      { title: "Spielen", text: "Wechselnde Partner, kurze Matches, viel Spaß." },
      { title: "Hängenbleiben", text: "Drinks & Community im Anschluss. #bettertogether" },
    ],
    perPerson: "pro Person",
    free: "Free",
    appOnly: "Anmeldung & Bezahlung im Web oder in der PadelCity App.",
    moreIn: "Mehr in",
    format: "Format",
    single: "Einzelanmeldung",
    team: (n: number) => `${n}er-Team`,
    deadline: "Anmeldung bis",
    untilStart: "Event-Start",
    cancellation: "Stornierung",
    freeCancellation: {
      UNTIL_24H_BEFORE_EVENT: "Kostenlos bis 24 Std. vor Beginn",
      WITHIN_60MIN_FROM_BOOKING: "Kostenlos bis 60 Min. nach der Anmeldung",
      WITHIN_14DAYS_FROM_BOOKING: "Kostenlos bis 14 Tage nach der Anmeldung",
    },
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
  },
  local: {
    eyebrow: "At your club",
    title: "Play, laugh, come back",
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
  countdown: { days: "Days", hours: "Hours", minutes: "Minutes", seconds: "Seconds", live: "Live!", aria: "Countdown to the start of the event" },
  card: { more: "Find out more" },
  detail: {
    date: "Date",
    place: "Venue",
    scheduleEyebrow: "Schedule",
    scheduleTitle: "Save the date",
    scheduleNote: "Provisional schedule – subject to change. You'll get updates via push notification in the app.",
    videoEyebrow: "Watch",
    videoTitle: "Feel the vibe",
    videoNote: "The video only loads once you click – no data is sent to YouTube before that.",
    fallbackDescription: (type: string, where: string) =>
      `${type} at our ${where} club: come on your own or bring friends – we mix the teams by level so every match stays exciting.`,
    metaTitle: (title: string, city: string) => `${title} – padel event in ${city}`,
    metaDescription: (title: string, type: string, where: string) => `${title} – ${type} at our ${where} club. Sign up now on the web or in the PadelCity app.`,
    steps: [
      { title: "Arrive", text: "Be there 15 minutes early – if you need a racket, reception has you covered." },
      { title: "Play", text: "Rotating partners, short matches, loads of fun." },
      { title: "Hang out", text: "Drinks and community afterwards. #bettertogether" },
    ],
    perPerson: "per person",
    free: "Free",
    appOnly: "Sign-up and payment on the web or in the PadelCity app.",
    moreIn: "More at",
    format: "Format",
    single: "Individual sign-up",
    team: (n: number) => `Team of ${n}`,
    deadline: "Sign up by",
    untilStart: "event start",
    cancellation: "Cancellation",
    freeCancellation: {
      UNTIL_24H_BEFORE_EVENT: "Free until 24 h before the start",
      WITHIN_60MIN_FROM_BOOKING: "Free within 60 min of signing up",
      WITHIN_14DAYS_FROM_BOOKING: "Free within 14 days of signing up",
    },
  },
  date: { time: "" },
};

const pl: EventsContent = {
  meta: {
    title: "Wydarzenia i turnieje",
    description: "Social eventy, turnieje i treningi we wszystkich klubach PadelCity – plus highlighty takie jak One Point Challenge i PadelCity Series Finals.",
  },
  hero: {
    eyebrow: "Game. Set. Match.",
    imageAlt: "Pełne trybuny podczas turnieju PadelCity",
    lead: "Od Americano po pracy po challenge za 100 000 €: tu gra społeczność. Wpadnij, dołącz do gry, #bettertogether.",
    title: "Social",
    accent: "eventy",
    titleEnd: "i turnieje",
    ctaFind: "Znajdź wydarzenia",
    ctaApp: "Otwórz w aplikacji",
  },
  highlights: {
    eyebrow: "Highlights",
    title: "Wielkie sceny",
  },
  local: {
    eyebrow: "W twoim klubie",
    title: "Graj, śmiej się, wracaj",
  },
  explorer: {
    filterLabel: "Filtruj wydarzenia",
    typeLabel: "Typ wydarzenia",
    all: "Wszystkie",
    cityLabel: "Miasto",
    allCities: "Wszystkie miasta",
    thisWeek: "W tym tygodniu",
    one: "wydarzenie",
    many: "wydarzeń", // 2–4 → "wydarzenia" via lib/i18n/plural
    inCity: "–",
    emptyTitle: "Obecnie nic nie pasuje do twojego filtra",
    emptyText: "Spróbuj innego miasta albo zajrzyj do aplikacji – znajdziesz tam też otwarte mecze w pobliżu.",
    reset: "Resetuj filtry",
  },
  types: { social: "Social", tournament: "Turniej", training: "Trening", hero: "Highlight" },
  countdown: { days: "Dni", hours: "Godziny", minutes: "Minuty", seconds: "Sekundy", live: "Live!", aria: "Odliczanie do startu wydarzenia" },
  card: { more: "Dowiedz się więcej" },
  detail: {
    date: "Data",
    place: "Miejsce",
    scheduleEyebrow: "Harmonogram",
    scheduleTitle: "Save the date",
    scheduleNote: "Wstępny harmonogram – zmiany zastrzeżone. Aktualizacje dostaniesz jako powiadomienia push w aplikacji.",
    videoEyebrow: "Watch",
    videoTitle: "Feel the vibe",
    videoNote: "Film załaduje się dopiero po twoim kliknięciu – wcześniej żadne dane nie są przesyłane do YouTube.",
    fallbackDescription: (type: string, where: string) =>
      `${type} w klubie ${where}: przyjdź solo albo ze znajomymi – dobieramy drużyny według poziomu, żeby każdy mecz był emocjonujący.`,
    metaTitle: (title: string, city: string) => `${title} – wydarzenie padlowe (${city})`,
    metaDescription: (title: string, type: string, where: string) => `${title} – ${type} w klubie ${where}. Zapisz się teraz online albo w aplikacji PadelCity.`,
    steps: [
      { title: "Przyjdź", text: "Bądź 15 minut wcześniej – w razie potrzeby rakietę dostaniesz w recepcji." },
      { title: "Graj", text: "Zmieniający się partnerzy, krótkie mecze, mnóstwo zabawy." },
      { title: "Zostań dłużej", text: "Potem drinki i społeczność. #bettertogether" },
    ],
    perPerson: "za osobę",
    free: "Free",
    appOnly: "Zapisy i płatność online albo w aplikacji PadelCity.",
    moreIn: "Więcej:",
    format: "Format",
    single: "Zapis indywidualny",
    team: (n: number) => `Drużyna ${n}-osobowa`,
    deadline: "Zapisy do",
    untilStart: "startu wydarzenia",
    cancellation: "Rezygnacja",
    freeCancellation: {
      UNTIL_24H_BEFORE_EVENT: "Bezpłatnie do 24 godz. przed startem",
      WITHIN_60MIN_FROM_BOOKING: "Bezpłatnie do 60 min po zapisie",
      WITHIN_14DAYS_FROM_BOOKING: "Bezpłatnie do 14 dni po zapisie",
    },
  },
  date: { time: "" },
};

export const eventsContent: Record<Locale, EventsContent> = { de, en, pl };

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

const eventOverridesPl: Record<string, EventOverride> = {
  "opc-vol3": { subtitle: "Jeden punkt. Wszystko albo nic. 100 000 € puli nagród.", city: "Monachium", imageAlt: "Mecz na korcie centralnym One Point Challenge w otoczeniu widzów" },
  "series-finals": { subtitle: "Najlepsze drużyny ze wszystkich klubów. Jeden weekend.", imageAlt: "Pełna hala podczas turnieju PadelCity z meczami na kilku kortach" },
  "beginner-girls-tucherpark": { level: "Poziom 1–3", recurrence: "W każdy piątek", city: "Monachium", imageAlt: "Zawodniczka uderza piłkę na korcie" },
  "intermediate-mix-tucherpark": { level: "Poziom 3–5", recurrence: "Co drugą sobotę", city: "Monachium", imageAlt: "Zawodniczka odbiera piłkę w meczu mikstowym, widzowie przy korcie" },
  "advanced-mix-frankfurter-ring": { level: "Poziom 5–7", recurrence: "W każdą niedzielę", city: "Monachium", imageAlt: "Zawodnik wykonuje uderzenie nad głową, partner przy siatce" },
  "afterwork-berlin": { level: "Wszystkie poziomy", recurrence: "W każdą środę", imageAlt: "Grupa zawodniczek i zawodników z napojami przy siatce" },
  "king-of-the-court-frankfurt": { level: "Poziom 4+", city: "Frankfurt nad Menem", imageAlt: "Mecz turniejowy z widzami przy korcie" },
  "kids-camp-dortmund": { subtitle: "Dla dzieci w wieku 6–14 lat", level: "Początkujący", imageAlt: "Chłopiec i dziewczynka uderzają piłkę w padlu" },
};

const eventOverrides: Partial<Record<Locale, Record<string, EventOverride>>> = { en: eventOverridesEn, pl: eventOverridesPl };

/** Applies per-locale overrides to mock events (DE is the source language). */
export function localizeEvent(event: ClubEvent, locale: Locale): ClubEvent {
  if (locale === "de") return event;
  const o = eventOverrides[locale]?.[event.id];
  if (!o) return event;
  const { imageAlt, ...fields } = o;
  return { ...event, ...fields, image: event.image ? { ...event.image, alt: imageAlt ?? event.image.alt } : undefined };
}

/* ---------- Optional event modules (Contentful) ----------
 * Every event detail page has the same base from the APL (head, key facts incl. sign-up deadline, free cancellation
 * and format, sign-up). These modules come on top and only show when filled. Contentful: the event template carries
 * the default, an entry referencing the event by id overrides it (e.g. One Point Challenge). The prototype keys by id. */

export type EventContent = {
  claim?: { text: string; accent: string }; // claim with one accent word; shows the countdown next to it
  presenter?: string; // "powered by CUPRA"
  intro?: string;
  facts?: { label: string; value: string }[]; // extra key facts (prize money, participants …)
  format?: { title: string; text: string }[]; // replaces the default "So läuft's" steps
  schedule?: { day: string; items: { time: string; title: string }[] }[];
  video?: { title: string; youtubeId?: string; thumbnail: string };
  partnerNames?: string[]; // names from src/lib/content/partners.ts
};

// TODO(content): final copy, schedule & partners from Events team.
export const eventContent: Record<string, Record<Locale, EventContent>> = {
  "opc-vol3": {
    de: {
      claim: { text: "Ein Punkt. Alles oder", accent: "nichts." },
      intro:
        "Die verrückteste Turnierform im Padel kommt zurück: Jeder Ballwechsel ist ein K.‑o.-Spiel. Profis, Promis und Qualifikanten aus allen PadelCity Clubs kämpfen um bis zu 100.000 € Preisgeld.",
      presenter: "powered by CUPRA",
      facts: [
        { label: "Preisgeld", value: "bis zu 100.000 €" },
        { label: "Format", value: "One Point · K.‑o." },
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
      claim: { text: "One point. All or", accent: "nothing." },
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
    pl: {
      claim: { text: "Jeden punkt. Wszystko albo", accent: "nic." },
      intro:
        "Najbardziej szalony format turniejowy w padlu wraca: każda wymiana to mecz o wszystko. Zawodowcy, znane twarze i kwalifikanci ze wszystkich klubów PadelCity walczą o pulę nagród do 100 000 €.",
      presenter: "powered by CUPRA",
      facts: [
        { label: "Pula nagród", value: "do 100 000 €" },
        { label: "Format", value: "One Point · system pucharowy" },
        { label: "Kwalifikacje", value: "W klubach PadelCity" },
        { label: "Bilety", value: "Wstęp dla widzów wolny" }, // TODO(content): confirm ticketing
      ],
      format: [
        { title: "Kwalifikacje", text: "Zakwalifikuj się w jednym z klubowych turniejów kwalifikacyjnych – zapisy w aplikacji." },
        { title: "One Point Rounds", text: "Każdy pojedynek rozstrzyga dokładnie jeden punkt. Kto przegra, odpada." },
        { title: "Finał", text: "Dwie ostatnie drużyny grają o jackpot na korcie centralnym – z transmisją na żywo." },
      ],
      schedule: [
        { day: "Dzień 1", items: [{ time: "12:00", title: "Check-in i rozgrzewka" }, { time: "14:00", title: "Rundy kwalifikacyjne" }, { time: "20:00", title: "Players Night" }] },
        { day: "Dzień 2", items: [{ time: "11:00", title: "Turniej główny" }, { time: "17:00", title: "Pokazowy mecz gwiazd" }] },
        { day: "Dzień 3", items: [{ time: "14:00", title: "Półfinały" }, { time: "18:00", title: "Finał i dekoracja zwycięzców" }] },
      ],
      partnerNames: ["CUPRA", "Babolat", "Haier", "Veltins", "Coca-Cola"],
      video: { title: "Aftermovie One Point Challenge Vol. 2", thumbnail: "/images/events/opc-video.jpg" },
    },
  },
  "series-finals": {
    de: {
      claim: { text: "Die besten Teams. Ein", accent: "Finale." },
      intro:
        "Eine Saison, alle Clubs, ein Finale: Die PadelCity Series powered by Babolat krönt ihre Champions. Zwei Tage Top-Padel, Musik und Community.",
      presenter: "powered by Babolat",
      facts: [
        { label: "Preisgeld", value: "[XX.XXX] €" }, // TODO(content): prize money from Events team
        { label: "Format", value: "Gruppen + K.‑o." },
        { label: "Kategorien", value: "Herren · Damen · Mixed" },
        { label: "Qualifiziert", value: "Top-Teams der Saison" },
      ],
      format: [
        { title: "Gruppenphase", text: "Die Top-Teams aus allen Regionen spielen in Vierergruppen – best of 3 Sets." },
        { title: "K.‑o.-Runde", text: "Ab dem Viertelfinale zählt jeder Punkt. Center Court mit Tribüne." },
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
      claim: { text: "The best teams. One", accent: "final." },
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
    pl: {
      claim: { text: "Najlepsze drużyny. Jeden", accent: "finał." },
      intro:
        "Jeden sezon, wszystkie kluby, jeden finał: PadelCity Series powered by Babolat koronuje swoich mistrzów. Dwa dni padla na najwyższym poziomie, muzyka i społeczność.",
      presenter: "powered by Babolat",
      facts: [
        { label: "Pula nagród", value: "[XX XXX] €" }, // TODO(content): prize money from Events team
        { label: "Format", value: "Grupy + system pucharowy" },
        { label: "Kategorie", value: "Mężczyźni · Kobiety · Mikst" },
        { label: "Kwalifikacja", value: "Najlepsze drużyny sezonu" },
      ],
      format: [
        { title: "Faza grupowa", text: "Najlepsze drużyny ze wszystkich regionów grają w grupach po cztery zespoły – do dwóch wygranych setów." },
        { title: "Faza pucharowa", text: "Od ćwierćfinałów liczy się każdy punkt. Kort centralny z trybuną." },
        { title: "Champions Night", text: "Dekoracja zwycięzców, nagrody i impreza z całą społecznością PadelCity." },
      ],
      schedule: [
        { day: "Sobota", items: [{ time: "10:00", title: "Faza grupowa" }, { time: "16:00", title: "Pokazowy kort dla dzieci" }, { time: "19:00", title: "Players Dinner" }] },
        { day: "Niedziela", items: [{ time: "10:00", title: "Ćwierćfinały i półfinały" }, { time: "16:00", title: "Finały" }, { time: "18:30", title: "Champions Night" }] },
      ],
      partnerNames: ["Babolat", "CUPRA", "FALKE", "HanseMerkur", "Natural Elements"],
      video: { title: "Highlights PadelCity Series 2025", thumbnail: "/images/events/series-video.jpg" },
    },
  },
};
