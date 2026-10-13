import type { Locale } from "../i18n/config";

// Contentful: page "home" (modules listed in src/views/home/HomeView.tsx)

/** Club showcase: curated club selection (Contentful → reference list). Missing slugs are skipped. */
const showcaseSlugs = ["muenchen-tucherpark", "muenchen-frankfurter-ring", "berlin", "frankfurt", "dortmund", "ingolstadt", "leipzig", "fuerth"];

const de = {
  meta: { title: "PadelCity – Let's play Padel!", description: "Deutschlands führender Padel-Betreiber: 30+ Clubs, 200+ Courts, eine Community." },
  hero: {
    badge: "30+ Clubs · 200+ Courts · 25+ Städte",
    line1: "Deine City",
    line2: "spielt",
    accent: "Padel.",
    line3: "Du auch?",
    text: "Schläger, Crew, Glaswände. Über 30 Clubs in ganz Deutschland – dein neuer Lieblingsort ist nur einen Klick entfernt.",
    searchLabel: "Stadt oder Club",
    searchPlaceholder: "Wo spielst du? Stadt oder Club",
    searchSubmit: "Clubs suchen",
    videoPause: "Hintergrundvideo pausieren",
    videoPlay: "Hintergrundvideo abspielen",
    ctaApp: "Court buchen in der App",
    ctaLocations: "Alle Standorte",
  },
  ticker: ["Let's play Padel", "30+ Clubs", "200+ Courts", "25+ Cities", "Game. Set. Match.", "#bettertogether", "Drive the Padel Boom!", "Make some noise for Padel", "Deutschlands Nr. 1 im Padel"],
  leader: {
    eyebrow: "Seit 2022 on court",
    title: "Deutschlands",
    accent: "Nr. 1",
    titleEnd: "für Padel.",
    text: "Was 2022 mit dem ersten Club in Ingolstadt begann, ist heute die größte Padel-Community des Landes. Wir bauen Courts, bringen Menschen zusammen und machen Padel zum Breitensport.",
    facts: { clubs: "Clubs", courts: "Courts", cities: "Städte", countries: "Länder" },
    mapHint: "Tipp auf einen Pin",
    legend: { live: "Live", soon: "Bald" },
    mapLabel: "Karte: PadelCity Clubs in Deutschland, Österreich und Polen",
    // {cities} = open clubs outside Germany, derived from data (e.g. "Innsbruck & Warschau")
  },
  showcase: { eyebrow: "Unsere Clubs", title: "Clubs mit", accent: "Vibe.", all: "Alle Standorte", prev: "Zurück", next: "Weiter", slugs: showcaseSlugs },
  paths: {
    title: "Wie willst du",
    accent: "mitspielen?",
    items: [
      { key: "locations", title: "Spielen", text: "Club finden, Freunde einladen, losspielen. Für jedes Level." },
      { key: "partners", title: "Partner werden", text: "Sponsoring, Events & Corporate Padel mit der größten Community." },
      { key: "investors", title: "Investieren", text: "Series A closed. Wir skalieren Padel über Deutschland hinaus." },
      { key: "franchise", title: "Franchise", text: "Deine Stadt soll eine PadelCity werden? Lass uns reden." },
    ],
  },
  momentum: {
    eyebrow: "Momentum 2026",
    title: "Series A.",
    title2: "Next",
    accent: "level.",
    text: "Mit frischem Kapital und starken Partnern an unserer Seite bringen wir Padel in neue Städte und neue Länder. Mehr Clubs, mehr Events, mehr Community.",
    ir: "Investor Relations",
    jobs: "Werde Teil des Teams",
  },
  events: { eyebrow: "Social Events & Turniere", title: "Mehr als ein", accent: "Match.", all: "Alle Events", hero: "Hero Event", more: "Mehr erfahren" },
  split: [
    { key: "academy", eyebrow: "PadelCity Academy", title: "Vom ersten Ball zum ersten Turnier.", cta: "Training finden", img: "/images/hero/academy.jpg" },
    { key: "magazine", eyebrow: "Magazin", title: "Technik, Stories & Culture.", cta: "Jetzt lesen", img: "/images/hero/magazin.jpg" },
  ],
  community: {
    eyebrow: "#bettertogether",
    title: "Everybody's",
    accent: "welcome.",
    text: "Student:in, Profi oder irgendwas dazwischen – bei uns bist du VIP. Finde Mitspieler:innen in der App, komm zu unseren Social Events oder join die WhatsApp-Community deiner Stadt.",
    whatsapp: "WhatsApp Community",
    matches: "Open Matches in der App",
    imgAlt: "PadelCity Community",
  },
  shop: { title: "Merch & Gutscheine", text: "Wear the movement. Der PadelCity Shop kommt – Gutscheine gibt's schon jetzt in der App.", cta: "Gutschein verschenken" },
  partners: { eyebrow: "Unsere Partner", title: "Better", accent: "together.", cta: "Partner werden" },
};

export type HomeContent = typeof de;

const en: HomeContent = {
  meta: { title: "PadelCity – Let's play Padel!", description: "Germany's leading padel operator: 30+ clubs, 200+ courts, one community." },
  hero: {
    badge: "30+ clubs · 200+ courts · 25+ cities",
    line1: "Your city",
    line2: "plays",
    accent: "Padel.",
    line3: "Do you?",
    text: "Rackets, crew, glass walls. More than 30 clubs across Germany – your new favourite place is just one tap away.",
    searchLabel: "City or club",
    searchPlaceholder: "Where do you play? City or club",
    searchSubmit: "Search clubs",
    videoPause: "Pause background video",
    videoPlay: "Play background video",
    ctaApp: "Book a court in the app",
    ctaLocations: "All locations",
  },
  ticker: ["Let's play Padel", "30+ clubs", "200+ courts", "25+ cities", "Game. Set. Match.", "#bettertogether", "Drive the Padel Boom!", "Make some noise for Padel", "Germany's No. 1 in padel"],
  leader: {
    eyebrow: "On court since 2022",
    title: "Germany's",
    accent: "No. 1",
    titleEnd: "for padel.",
    text: "What started in 2022 with our first club in Ingolstadt is now the country's biggest padel community. We build courts, bring people together and make padel a sport for everyone.",
    facts: { clubs: "Clubs", courts: "Courts", cities: "Cities", countries: "Countries" },
    mapHint: "Tap a pin",
    legend: { live: "Live", soon: "Soon" },
    mapLabel: "Map: PadelCity clubs in Germany, Austria and Poland",
  },
  showcase: { eyebrow: "Our clubs", title: "Clubs with", accent: "vibes.", all: "All locations", prev: "Previous", next: "Next", slugs: showcaseSlugs },
  paths: {
    title: "How do you want to",
    accent: "play?",
    items: [
      { key: "locations", title: "Play", text: "Find a club, invite friends, get on court. For every level." },
      { key: "partners", title: "Partner up", text: "Sponsoring, events & corporate padel with the biggest community." },
      { key: "investors", title: "Invest", text: "Series A closed. We're scaling padel beyond Germany." },
      { key: "franchise", title: "Franchise", text: "Want PadelCity in your city? Let's talk." },
    ],
  },
  momentum: {
    eyebrow: "Momentum 2026",
    title: "Series A.",
    title2: "Next",
    accent: "level.",
    text: "With fresh capital and strong partners on our side, we're bringing padel to new cities and new countries. More clubs, more events, more community.",
    ir: "Investor Relations",
    jobs: "Join the team",
  },
  events: { eyebrow: "Social events & tournaments", title: "More than a", accent: "match.", all: "All events", hero: "Hero event", more: "Learn more" },
  split: [
    { key: "academy", eyebrow: "PadelCity Academy", title: "From your first ball to your first tournament.", cta: "Find coaching", img: "/images/hero/academy.jpg" },
    { key: "magazine", eyebrow: "Magazine", title: "Technique, stories & culture.", cta: "Read now", img: "/images/hero/magazin.jpg" },
  ],
  community: {
    eyebrow: "#bettertogether",
    title: "Everybody's",
    accent: "welcome.",
    text: "Student, pro or anything in between – with us you're a VIP. Find players in the app, join our social events or the WhatsApp community in your city.",
    whatsapp: "WhatsApp community",
    matches: "Open matches in the app",
    imgAlt: "PadelCity community",
  },
  shop: { title: "Merch & vouchers", text: "Wear the movement. The PadelCity shop is coming – vouchers are already available in the app.", cta: "Give a voucher" },
  partners: { eyebrow: "Our partners", title: "Better", accent: "together.", cta: "Become a partner" },
};

export const homeContent: Record<Locale, HomeContent> = { de, en };
