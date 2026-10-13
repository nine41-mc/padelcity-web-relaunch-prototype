import type { Locale } from "../i18n/config";

/**
 * App landing page content (Contentful: page "app" with modules appHero, featureStory,
 * appStoreGallery, socialProof, howItWorks, faq). Prototype copy — TODO(content): review with Product/Marketing.
 * Credo: the WEBSITE shows no live booking data – real-time availability is an APP feature.
 *
 * Feature claims are limited to what exists in mobile-app-flutter (lib/feature/*) or is visible
 * in the official App Store screenshots (v1.43.0). No rankings/badges/waiting list – the app has none.
 * Screenshots: official App Store screenshots of the PadelCity app (see public/images/SOURCES.md).
 */

/** Real app screens cropped out of the official App Store panels. */
export type ScreenKey = "home" | "booking" | "checkout" | "split" | "match" | "events" | "benefits";

export type AppScreenshot = {
  src: string;
  width: number;
  height: number;
  /** Description of the screen (used as accessible label of the phone). */
  alt: string;
  /** true = the crop already contains the iOS status bar; false = the top of the screen is cut off. */
  hasStatusBar: boolean;
};

export type AppFeatureId = "booking" | "split" | "matches" | "events" | "vouchers" | "benefits";

export type AppFeature = {
  id: AppFeatureId;
  eyebrow: string;
  title: string;
  accent: string; // one word rendered as <Accent>
  text: string;
  bullets: string[];
  icon: string; // /public/icons/<icon>.svg
  deeplink: "openMatches" | "events" | "vouchers" | "locations" | "download";
  cta: string;
  track: string;
  /** Real app screen shown in the phone. */
  screen: ScreenKey;
  /** Optional real UI card floating over the phone (coach card from the store panel). */
  overlay?: "coach";
};

export type StorePanel = { src: string; width: number; height: number; alt: string };

/*
 * Store ratings (socialProof.ratings) – real values, fetched 2026-10-13:
 *  - App Store: iTunes lookup API (id 6451471569, country=de) → averageUserRating 4.68205, userRatingCount 4507
 *  - Google Play: store page de.padelcity.app (hl=de), JSON-LD aggregateRating → ratingValue 4.35, ratingCount 755
 * TODO(content): refresh before go-live (or fetch at build time).
 */

const S = "/images/app/screens";

const screensDe: Record<ScreenKey, AppScreenshot> = {
  home: { src: `${S}/home-de.jpg`, width: 552, height: 1200, hasStatusBar: true, alt: "Startseite der App: Court buchen, Spiele finden, Training buchen, Events entdecken und Open Matches in deiner Nähe" },
  booking: { src: `${S}/booking-de.jpg`, width: 598, height: 1200, hasStatusBar: true, alt: "Court buchen: Club, Datum und Uhrzeit wählen, Startzeiten und Preise je Spieldauer" },
  checkout: { src: `${S}/checkout-de.jpg`, width: 592, height: 1200, hasStatusBar: false, alt: "Buchung abschließen: Buchungsübersicht, Stornierungsbedingungen, Gutschein einlösen und Summe" },
  split: { src: `${S}/split-de.jpg`, width: 597, height: 1200, hasStatusBar: true, alt: "Anteilige Zahlung im Checkout: Anzahl der Player Slots wählen, die du bezahlst" },
  match: { src: `${S}/match-de.jpg`, width: 592, height: 1200, hasStatusBar: false, alt: "Match Details: bestätigtes Open Match mit vier Spieler:innen, Level und Chat-Button" },
  events: { src: `${S}/events-de.jpg`, width: 600, height: 1185, hasStatusBar: true, alt: "Aktuelle Events eines Clubs, z. B. CUPRA One Point Challenge Tour Germany, mit Button „Als Team teilnehmen“" },
  benefits: { src: `${S}/benefits-de.jpg`, width: 592, height: 1200, hasStatusBar: false, alt: "Profil: EGYM Wellpass Konto verknüpft – der Discount wird automatisch im Checkout angezeigt" },
};

// EN: English UI from the (older, low-res 392×696) English App Store screenshots.
// No English benefits panel exists → the German screen is reused (TODO(content): current English screenshots in high-res).
const screensEn: Record<ScreenKey, AppScreenshot> = {
  // The English home panel (old app version) shows German UI anyway and is only 261 px wide → reuse the current DE crop.
  home: { ...screensDe.home, alt: "App home screen (German UI): book a court, find matches, book training, discover events and open matches near you" },
  booking: { src: `${S}/booking-en.jpg`, width: 289, height: 490, hasStatusBar: true, alt: "Book a court: pick club, date and time, start times and prices per duration" },
  checkout: { src: `${S}/checkout-en.jpg`, width: 289, height: 435, hasStatusBar: false, alt: "Checkout: cancellation policies, add voucher and total" },
  split: { src: `${S}/split-en.jpg`, width: 289, height: 490, hasStatusBar: true, alt: "Split payment at checkout: choose how many player slots you pay for" },
  match: { src: `${S}/match-en.jpg`, width: 289, height: 435, hasStatusBar: false, alt: "Match details: confirmed open match with four players, their levels and a chat button" },
  events: { src: `${S}/events-en.jpg`, width: 289, height: 490, hasStatusBar: true, alt: "Current events at a club, e.g. an Americano, with a “Participate in event” button" },
  benefits: { ...screensDe.benefits, alt: "Profile (German UI): EGYM Wellpass account linked – the discount is shown automatically at checkout" },
};

const coachCard = {
  de: { src: `${S}/coach-card-de.jpg`, width: 720, height: 232, alt: "Coach-Karte in der App: Alvaro Bastarreche, 50 €/h für 1er Training" },
  en: { src: `${S}/coach-card-en.jpg`, width: 347, height: 112, alt: "Coach card in the app: Alvaro Bastarreche, €35/h for personal training" },
};

const P = "/images/app/store";
const panelsDe: StorePanel[] = [
  "Willkommen in der Welt von PadelCity – Startseite der App",
  "Entdecke Clubs in deiner Nähe – Court buchen mit Startzeiten und Preisen",
  "Buche bequem deinen Court – Buchung abschließen mit Summe und Gutschein",
  "Zahle deine Platzgebühren anteilig – Player Slots im Checkout aufteilen",
  "Finde Mitspieler:innen für Open Matches – Match Details mit vier Spieler:innen",
  "Trainiere mit unseren Top Coaches – Coach-Karte mit Preis pro Training",
  "Erlebe coole Padel Events in deinem Club – Eventliste mit CUPRA One Point Challenge",
  "Nutze deine Vorteile mit EGYM Wellpass und Hansefit – verknüpftes Benefit-Konto",
].map((alt, i) => ({ src: `${P}/de/${i + 1}.jpg`, width: 560, height: 1214, alt: `App-Store-Screenshot ${i + 1}: ${alt}` }));

const panelsEn: StorePanel[] = [
  "Welcome to the world of PadelCity – app home screen",
  "Explore clubs near you – book a court with start times and prices",
  "Book your court with ease – checkout with total and voucher field",
  "Split court fees among each other – choose your player slots",
  "Find fellow players for open matches – match details with four players",
  "Train with our top coaches – coach card with price per session",
  "Experience cool padel events in your club – club event list",
].map((alt, i) => ({ src: `${P}/en/${i + 1}.jpg`, width: 392, height: 696, alt: `App Store screenshot ${i + 1}: ${alt}` }));

const de = {
  meta: {
    title: "Die PadelCity App",
    description: "Courts buchen, Kosten anteilig zahlen, Open Matches, Events & Training, Gutscheine und Corporate Benefits – alles in der PadelCity App für iOS und Android.",
  },
  hero: {
    eyebrow: "iOS & Android · kostenlos",
    title: "Dein Court. Dein Match. Deine",
    accent: "App.",
    lead: "Courts buchen, Mitspieler:innen finden, Events & Trainings sichern – die PadelCity App ist dein Ticket in die Community.",
    note: "Court-Buchung ist exklusiv in der App – auf der Website findest du alle Clubs, Infos und Preise.",
    phoneBack: "booking" as ScreenKey,
    phoneFront: "home" as ScreenKey,
  },
  qr: { title: "QR zum App-Download", text: "Mit der Handy-Kamera scannen – iOS & Android.", aria: "QR zum App-Download (Platzhalter)" },
  phoneLabel: "Screenshot der PadelCity App",
  screens: screensDe,
  coachCard: coachCard.de,
  features: {
    eyebrow: "Alles in einer App",
    title: "Weniger organisieren. Mehr spielen.",
    items: [
      {
        id: "booking",
        eyebrow: "Court buchen",
        title: "Court buchen in 3",
        accent: "Klicks",
        text: "Club wählen, Zeit tippen, bezahlen. Sofortbestätigung und Kalender-Eintrag inklusive.",
        bullets: ["Alle 30+ Clubs in einer App", "Freie Courts in Echtzeit – in der App", "Lieblingsclubs immer griffbereit"],
        icon: "double_court",
        deeplink: "locations",
        cta: "Clubs ansehen",
        track: "app_feature_booking",
        screen: "booking",
      },
      {
        id: "split",
        eyebrow: "Anteilige Zahlung",
        title: "Kosten fair",
        accent: "teilen",
        text: "Aktiviere im Checkout die anteilige Zahlung: Jede:r zahlt den eigenen Player Slot – oder du übernimmst gleich mehrere.",
        bullets: ["Platzmiete auf Player Slots aufteilen", "Mehrere Slots auf einmal zahlen", "Alles direkt im Checkout"],
        icon: "single_court",
        deeplink: "download",
        cta: "App laden",
        track: "app_feature_split",
        screen: "split",
      },
      {
        id: "matches",
        eyebrow: "Open Matches",
        title: "Nie wieder ohne",
        accent: "Partner",
        text: "Dir fehlt die Vierte? Erstell ein Open Match oder spring in eins rein. Sobald genug Spieler:innen dabei sind, ist der Court verbindlich gebucht.",
        bullets: ["Level-Range für jedes Match", "Alle Mitspieler:innen auf einen Blick", "Chat mit deinem Match"],
        icon: "users",
        deeplink: "openMatches",
        cta: "Open Matches öffnen",
        track: "app_feature_matches",
        screen: "match",
      },
      {
        id: "events",
        eyebrow: "Events & Training",
        title: "Events & Training mit einem",
        accent: "Tap",
        text: "Turniere wie die CUPRA One Point Challenge, Events in deinem Club und Trainings mit unseren Coaches – anmelden, bezahlen, fertig. Für Events geht das auch im Web.",
        bullets: ["Alle Events deines Clubs", "Als Team anmelden", "Training mit Top Coaches buchen"],
        icon: "trophy",
        deeplink: "events",
        cta: "Events in der App",
        track: "app_feature_events",
        screen: "events",
        overlay: "coach",
      },
      {
        id: "vouchers",
        eyebrow: "Gutscheine",
        title: "Padel",
        accent: "verschenken",
        text: "Gutscheinwert wählen, der Code kommt per E-Mail – eingelöst wird er direkt im Checkout, für Court- und Coach-Buchungen.",
        bullets: ["Gutscheinwert auswählen", "Code per E-Mail", "Einlösen für Courts & Coaches"],
        icon: "reception",
        deeplink: "vouchers",
        cta: "Gutschein kaufen",
        track: "app_feature_vouchers",
        screen: "checkout",
      },
      {
        id: "benefits",
        eyebrow: "Corporate Benefits",
        title: "Mit deinem Firmen-",
        accent: "Benefit",
        text: "EGYM Wellpass oder Hansefit? Verknüpfe dein Konto im Profil – dein Discount wird automatisch im Checkout angezeigt.",
        bullets: ["EGYM Wellpass", "Hansefit", "Discount automatisch im Checkout"],
        icon: "summer",
        deeplink: "download",
        cta: "App laden",
        track: "app_feature_benefits",
        screen: "benefits",
      },
    ] as AppFeature[],
  },
  gallery: {
    eyebrow: "Aus dem App Store",
    title: "So sieht's in der App aus",
    text: "Die offiziellen Screenshots aus dem App Store – zum Durchwischen.",
    label: "App-Store-Screenshots der PadelCity App",
    prev: "Vorheriger Screenshot",
    next: "Nächster Screenshot",
    cta: "Im App Store ansehen",
    panels: panelsDe,
  },
  socialProof: {
    eyebrow: "Community-Liebe",
    title: "Gespielt. Geliebt.",
    ratings: [
      { store: "App Store", value: "4,7", count: "4.500+ Bewertungen", track: "app_rating_ios" },
      { store: "Google Play", value: "4,3", count: "750+ Bewertungen", track: "app_rating_android" },
    ],
    ratingsLabel: (value: string, store: string, count: string) => `${value} von 5 Sternen im ${store}, ${count}`,
    asOf: "Stand: Oktober 2026",
    // No testimonials: brand promises instead of attributed quotes.
    promises: [
      { title: "#bettertogether", text: "Open Match erstellt, Mitspieler:innen gefunden, auf den Court. So einfach soll Padel sein." },
      { title: "Make some noise", text: "Turniere, Club-Events und Trainings – die App bringt dich mittenrein." },
      { title: "Welcoming", text: "Vom ersten Training bis zum Turnier: Die App führt dich Schritt für Schritt in die Community." },
    ],
  },
  how: {
    eyebrow: "So funktioniert's",
    title: "In 3 Schritten auf den Court",
    steps: [
      { step: "01", title: "App laden", text: "Kostenlos für iOS und Android. Konto in einer Minute angelegt." },
      { step: "02", title: "Club & Zeit wählen", text: "In der App siehst du freie Courts in deiner Nähe – oder springst in ein Open Match." },
      { step: "03", title: "Let's play Padel!", text: "Bezahlen, Freunde einladen, auf den Court. #bettertogether" },
    ],
  },
  faqSection: { eyebrow: "FAQ", title: "Gut zu wissen", all: "Alle Fragen & Antworten" },
  faq: [
    { q: "Was kostet die App?", a: "Download und Konto sind kostenlos. Du zahlst nur, was du buchst – Courts, Events oder Trainings." },
    { q: "Kann ich Courts auch auf der Website buchen?", a: "Nein, die Buchung läuft exklusiv über die App. Auf der Website findest du alle Clubs mit Infos und Preisen – ein Tap bringt dich direkt zum Club in der App." },
    { q: "Wie teile ich die Kosten mit meinen Mitspieler:innen?", a: "Aktiviere im Checkout die anteilige Zahlung. Dann zahlst du nur deinen Player Slot – oder wählst aus, wie viele Slots du übernimmst." },
    { q: "Wie nutze ich EGYM Wellpass oder Hansefit?", a: "Verknüpfe dein Konto im Profil. Bei berechtigten Court-Buchungen wird dein Discount automatisch im Checkout angezeigt." },
    // TODO(content): confirm payment methods
    { q: "Welche Zahlungsarten gibt es?", a: "Kreditkarte, Apple Pay, Google Pay und PayPal – sicher abgewickelt über unseren Zahlungsdienstleister." },
  ],
  final: {
    title: "Let's play",
    accent: "Padel!",
    text: "App laden, Court buchen, Freunde einladen. Wir sehen uns auf dem Court. #bettertogether",
    clubs: "Erst mal Clubs ansehen",
    phone: "events" as ScreenKey,
  },
};

type AppContent = typeof de;

const en: AppContent = {
  meta: {
    title: "The PadelCity app",
    description: "Book courts, split the cost, open matches, events & training, gift vouchers and corporate benefits – all in the PadelCity app for iOS and Android.",
  },
  hero: {
    eyebrow: "iOS & Android · free",
    title: "Your court. Your match. Your",
    accent: "app.",
    lead: "Book courts, find players, grab your spot at events and training sessions – the PadelCity app is your ticket into the community.",
    note: "Courts are booked exclusively in the app – on the website you'll find every club, all the info and prices.",
    phoneBack: "booking",
    phoneFront: "home",
  },
  qr: { title: "Scan to download", text: "Point your phone camera here – iOS & Android.", aria: "QR code to download the app (placeholder)" },
  phoneLabel: "PadelCity app screenshot",
  screens: screensEn,
  coachCard: coachCard.en,
  features: {
    eyebrow: "All in one app",
    title: "Less organising. More playing.",
    items: [
      {
        id: "booking",
        eyebrow: "Book a court",
        title: "Book a court in 3",
        accent: "taps",
        text: "Pick a club, tap a time, pay. Instant confirmation and a calendar entry included.",
        bullets: ["All 30+ clubs in one app", "Real-time court availability – in the app", "Your favourite clubs always at hand"],
        icon: "double_court",
        deeplink: "locations",
        cta: "Explore clubs",
        track: "app_feature_booking",
        screen: "booking",
      },
      {
        id: "split",
        eyebrow: "Split payment",
        title: "Split the cost",
        accent: "fairly",
        text: "Switch on split payment at checkout: everyone pays for their own player slot – or you cover a few.",
        bullets: ["Split the court fee into player slots", "Pay for several slots at once", "All done at checkout"],
        icon: "single_court",
        deeplink: "download",
        cta: "Get the app",
        track: "app_feature_split",
        screen: "split",
      },
      {
        id: "matches",
        eyebrow: "Open matches",
        title: "Never short of a",
        accent: "partner",
        text: "Missing a fourth? Create an open match or jump into one. As soon as enough players have joined, the court is booked for good.",
        bullets: ["A level range for every match", "See all your playing partners at a glance", "Chat with your match"],
        icon: "users",
        deeplink: "openMatches",
        cta: "Open matches",
        track: "app_feature_matches",
        screen: "match",
      },
      {
        id: "events",
        eyebrow: "Events & training",
        title: "Events & training in one",
        accent: "tap",
        text: "Tournaments like the CUPRA One Point Challenge, events at your club and sessions with our coaches – sign up, pay, done. Events work on the web too.",
        bullets: ["Every event at your club", "Sign up as a team", "Book training with top coaches"],
        icon: "trophy",
        deeplink: "events",
        cta: "Events in the app",
        track: "app_feature_events",
        screen: "events",
        overlay: "coach",
      },
      {
        id: "vouchers",
        eyebrow: "Gift vouchers",
        title: "Give the gift of",
        accent: "padel",
        text: "Pick a voucher value and the code arrives by email – it's redeemed right at checkout for court and coach bookings.",
        bullets: ["Choose the voucher value", "Code sent by email", "Redeem for courts & coaches"],
        icon: "reception",
        deeplink: "vouchers",
        cta: "Buy a voucher",
        track: "app_feature_vouchers",
        screen: "checkout",
      },
      {
        id: "benefits",
        eyebrow: "Corporate benefits",
        title: "Play with your company",
        accent: "benefit",
        text: "EGYM Wellpass or Hansefit? Link your account in your profile – your discount shows up automatically at checkout.",
        bullets: ["EGYM Wellpass", "Hansefit", "Discount applied automatically at checkout"],
        icon: "summer",
        deeplink: "download",
        cta: "Get the app",
        track: "app_feature_benefits",
        screen: "benefits",
      },
    ],
  },
  gallery: {
    eyebrow: "From the App Store",
    title: "See it in the app",
    text: "The official App Store screenshots – swipe through.",
    label: "App Store screenshots of the PadelCity app",
    prev: "Previous screenshot",
    next: "Next screenshot",
    cta: "View on the App Store",
    panels: panelsEn,
  },
  socialProof: {
    eyebrow: "Community love",
    title: "Played. Loved.",
    ratings: [
      { store: "App Store", value: "4.7", count: "4,500+ ratings", track: "app_rating_ios" },
      { store: "Google Play", value: "4.3", count: "750+ ratings", track: "app_rating_android" },
    ],
    ratingsLabel: (value: string, store: string, count: string) => `${value} out of 5 stars on ${store}, ${count}`,
    asOf: "As of October 2026",
    promises: [
      { title: "#bettertogether", text: "Create an open match, find your players, get on court. That's how easy padel should be." },
      { title: "Make some noise", text: "Tournaments, club events and training – the app puts you right in the middle of it." },
      { title: "Welcoming", text: "From your first training session to your first tournament: the app guides you into the community step by step." },
    ],
  },
  how: {
    eyebrow: "How it works",
    title: "On court in 3 steps",
    steps: [
      { step: "01", title: "Get the app", text: "Free for iOS and Android. Your account is set up in a minute." },
      { step: "02", title: "Pick a club & time", text: "The app shows you free courts near you – or jump into an open match." },
      { step: "03", title: "Let's play Padel!", text: "Pay, invite your friends, hit the court. #bettertogether" },
    ],
  },
  faqSection: { eyebrow: "FAQ", title: "Good to know", all: "All questions & answers" },
  faq: [
    { q: "How much does the app cost?", a: "Downloading it and creating an account are free. You only pay for what you book – courts, events or training." },
    { q: "Can I book courts on the website?", a: "No, booking happens exclusively in the app. On the website you'll find every club with info and prices – one tap takes you straight to the club in the app." },
    { q: "How do I split the cost with my playing partners?", a: "Switch on split payment at checkout. You then pay only for your own player slot – or choose how many slots you cover." },
    { q: "How do I use EGYM Wellpass or Hansefit?", a: "Link your account in your profile. Your discount is shown automatically at checkout for eligible court bookings." },
    { q: "Which payment methods can I use?", a: "Credit card, Apple Pay, Google Pay and PayPal – processed securely by our payment provider." },
  ],
  final: {
    title: "Let's play",
    accent: "Padel!",
    text: "Get the app, book a court, invite your friends. See you on court. #bettertogether",
    clubs: "Browse the clubs first",
    phone: "events",
  },
};

export const appContent: Record<Locale, AppContent> = { de, en };
