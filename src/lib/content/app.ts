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

/** Real app screens (clean screenshots without store overlays). */
export type ScreenKey = "home" | "booking" | "checkout" | "split" | "match" | "events" | "benefits";

export type AppScreenshot = {
  src: string;
  width: number;
  height: number;
  /** Description of the screen (used as accessible label of the phone). */
  alt: string;
  /** true = the screenshot already contains the iOS status bar; false = the phone frame draws one. */
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
};

/**
 * Animated UI element of the respective screen, floating fully visible over the phone
 * (rebuilt in HTML from the app UI – values as in the store screenshots).
 */
export type AppCallouts = {
  booking: { times: string[]; durations: { value: string; unit: string; price: string }[] };
  split: { label: string; text: string; slots: string; price: string };
  matches: { title: string; text: string };
  vouchers: { label: string; code: string; applied: string };
  benefits: { title: string; text: string };
};

export type StorePanel = { src: string; width: number; height: number; alt: string };

/*
 * Store ratings (socialProof.ratings) – real values, fetched 2026-10-13:
 *  - App Store: iTunes lookup API (id 6451471569, country=de) → averageUserRating 4.68205, userRatingCount 4507
 *  - Google Play: store page de.padelcity.app (hl=de), JSON-LD aggregateRating → ratingValue 4.35, ratingCount 755
 * TODO(content): refresh before go-live (or fetch at build time).
 */

// Raw app screenshots (1284×2778, with status bar) taken from the phones in Figma "PadelCity – Store Assets"
// (DE 6529:6108, EN 6529:7942) – without the store headlines and overlay cards. Versioned path → no stale caches.
const S = "/images/app/screens/v1-32";
const shot = (key: ScreenKey, locale: "de" | "en", alt: string, file: string = key): AppScreenshot => ({ src: `${S}/${file}-${locale}.jpg`, width: 720, height: 1557, hasStatusBar: true, alt });

const screensDe: Record<ScreenKey, AppScreenshot> = {
  home: shot("home", "de", "Startseite der App: Court buchen, Spiele finden, Training buchen, Events entdecken und Open Matches in deiner Nähe", "home-top"),
  booking: shot("booking", "de", "Court buchen: Club, Datum und Uhrzeit wählen, Startzeiten und Preise je Spieldauer"),
  checkout: shot("checkout", "de", "Buchung abschließen: Buchungsübersicht, anteilige Zahlung, Equipment, Gutschein einlösen und Summe"),
  split: shot("split", "de", "Buchung abschließen mit dem Schalter „Anteilige Zahlung“ für die Player Slots"),
  match: shot("match", "de", "Match Details: bestätigtes Open Match mit Spieler:innen und Chat-Button"),
  events: shot("events", "de", "Aktuelle Events eines Clubs, z. B. CUPRA One Point Challenge Tour Germany, mit Button „Als Team teilnehmen“"),
  benefits: shot("benefits", "de", "Profil: EGYM Wellpass Konto verknüpft – der Discount wird automatisch im Checkout angezeigt"),
};

const screensEn: Record<ScreenKey, AppScreenshot> = {
  home: shot("home", "en", "App home screen: book a match, find matches, book a training, discover events and open matches near you", "home-top"),
  booking: shot("booking", "en", "Book a court: pick club, date and time, start times and prices per duration"),
  checkout: shot("checkout", "en", "Confirm booking: booking summary, split payment, equipment, add voucher and total"),
  split: shot("split", "en", "Confirm booking with the “Split payment” switch for the player slots"),
  match: shot("match", "en", "Match details: confirmed open match with its players and a chat button"),
  events: shot("events", "en", "Current events at a club with a button to participate as a team"),
  benefits: shot("benefits", "en", "Profile: EGYM Wellpass account linked – the discount is shown automatically at checkout"),
};

// PL: no Polish store assets yet → reuse the EN screenshots with Polish descriptions.
const screensPl: Record<ScreenKey, AppScreenshot> = {
  home: shot("home", "en", "Ekran główny aplikacji: rezerwacja kortu, wyszukiwanie meczów, rezerwacja treningu, eventy i otwarte mecze w pobliżu", "home-top"),
  booking: shot("booking", "en", "Rezerwacja kortu: wybór klubu, daty i godziny, godziny rozpoczęcia i ceny w zależności od czasu gry"),
  checkout: shot("checkout", "en", "Potwierdzenie rezerwacji: podsumowanie, dzielenie płatności, sprzęt, realizacja vouchera i suma"),
  split: shot("split", "en", "Potwierdzenie rezerwacji z przełącznikiem „Dzielenie płatności” dla miejsc graczy"),
  match: shot("match", "en", "Szczegóły meczu: potwierdzony otwarty mecz z graczami i przyciskiem czatu"),
  events: shot("events", "en", "Aktualne eventy w klubie z przyciskiem udziału jako zespół"),
  benefits: shot("benefits", "en", "Profil: połączone konto EGYM Wellpass – zniżka wyświetla się automatycznie przy płatności"),
};

const calloutsDe: AppCallouts = {
  booking: { times: ["16:00", "17:30", "21:00"], durations: [{ value: "60", unit: "Minuten", price: "36 €" }, { value: "90", unit: "Minuten", price: "54 €" }] },
  split: { label: "Anteilige Zahlung", text: "Platzmiete auf mehrere Spieler:innen aufteilen", slots: "2 von 4 Player Slots", price: "17 €" },
  matches: { title: "Match bestätigt", text: "Genug Spieler:innen dabei – der Court ist verbindlich reserviert." },
  vouchers: { label: "Gutschein einlösen", code: "PADEL-LOVE", applied: "Gutschein eingelöst" },
  benefits: { title: "Nutze deine exklusiven Discounts!", text: "Die persönlichen Rabatte für deinen Player Slot werden dir automatisch im Checkout angezeigt." },
};
const calloutsEn: AppCallouts = {
  booking: { times: ["16:00", "17:00", "18:00"], durations: [{ value: "60", unit: "Minutes", price: "€36" }, { value: "90", unit: "Minutes", price: "€54" }] },
  split: { label: "Split payment", text: "Split the court price between several players", slots: "2 of 4 player slots", price: "€17" },
  matches: { title: "Match confirmed", text: "Enough players have joined – the court is now booked bindingly." },
  vouchers: { label: "Add voucher", code: "PADEL-LOVE", applied: "Voucher applied" },
  benefits: { title: "Use your exclusive discounts!", text: "Your applicable discounts for your player slot will be applied at checkout." },
};

const calloutsPl: AppCallouts = {
  booking: { times: ["16:00", "17:00", "18:00"], durations: [{ value: "60", unit: "minut", price: "36 €" }, { value: "90", unit: "minut", price: "54 €" }] },
  split: { label: "Dzielenie płatności", text: "Podziel cenę kortu między kilku graczy", slots: "2 z 4 miejsc graczy", price: "17 €" },
  matches: { title: "Mecz potwierdzony", text: "Dołączyło wystarczająco dużo graczy – kort jest teraz wiążąco zarezerwowany." },
  vouchers: { label: "Zrealizuj voucher", code: "PADEL-LOVE", applied: "Voucher zrealizowany" },
  benefits: { title: "Korzystaj ze swoich ekskluzywnych zniżek!", text: "Twoje osobiste zniżki na miejsce gracza wyświetlą się automatycznie przy płatności." },
};

// Store screens v1.32.0 (iPhone 6.9"), exported from Figma "PadelCity – Store Assets" (DE node 6529:6108, EN node 6529:7942) at 2x.
const P = "/images/app/store/v1-32"; // versioned path → new URLs bypass old browser caches
const panelsDe: StorePanel[] = [
  "Willkommen in der Welt von PadelCity – Startseite der App",
  "Entdecke Clubs in deiner Nähe – Court buchen mit Startzeiten und Preisen",
  "Buche bequem deinen Court – Buchung abschließen mit Summe und Gutschein",
  "Zahle deine Platzgebühren anteilig – Player Slots im Checkout aufteilen",
  "Finde Mitspieler:innen für Open Matches – Match Details mit vier Spieler:innen",
  "Trainiere mit unseren Top Coaches – Coach-Karte mit Preis pro Training",
  "Erlebe coole Padel Events in deinem Club – Eventliste mit CUPRA One Point Challenge",
  "Nutze deine Vorteile mit EGYM Wellpass und Hansefit – verknüpftes Benefit-Konto",
].map((alt, i) => ({ src: `${P}/de/${i + 1}.jpg`, width: 860, height: 1864, alt: `App-Store-Screenshot ${i + 1}: ${alt}` }));

const panelsEn: StorePanel[] = [
  "Welcome to the world of PadelCity – app home screen",
  "Explore clubs near you – book a court with start times and prices",
  "Book your court with ease – checkout with total and voucher field",
  "Split court fees among each other – choose your player slots",
  "Find fellow players for open matches – match details with four players",
  "Train with our top coaches – coach card with price per session",
  "Experience cool padel events in your club – club event list",
  "Benefit with EGYM Wellpass and Hansefit membership – linked benefit account",
].map((alt, i) => ({ src: `${P}/en/${i + 1}.jpg`, width: 860, height: 1864, alt: `App Store screenshot ${i + 1}: ${alt}` }));

const panelsPl: StorePanel[] = [
  "Witaj w świecie PadelCity – ekran główny aplikacji",
  "Odkryj kluby w pobliżu – rezerwacja kortu z godzinami rozpoczęcia i cenami",
  "Wygodnie zarezerwuj kort – potwierdzenie rezerwacji z sumą i polem na voucher",
  "Podziel opłatę za kort – wybór miejsc graczy",
  "Znajdź partnerów do otwartych meczów – szczegóły meczu z czterema graczami",
  "Trenuj z naszymi najlepszymi trenerami – karta trenera z ceną za trening",
  "Przeżyj świetne eventy padlowe w swoim klubie – lista eventów klubu",
  "Korzystaj z benefitów EGYM Wellpass i Hansefit – połączone konto benefitowe",
].map((alt, i) => ({ src: `${P}/en/${i + 1}.jpg`, width: 860, height: 1864, alt: `Zrzut ekranu z App Store ${i + 1}: ${alt}` }));

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
  callouts: calloutsDe,
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
    outOf: "von 5 Sternen,",
    asOf: "Stand: Oktober 2026",
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
  callouts: calloutsEn,
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
    outOf: "out of 5 stars,",
    asOf: "As of October 2026",
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

const pl: AppContent = {
  meta: {
    title: "Aplikacja PadelCity",
    description: "Rezerwacja kortów, dzielenie płatności, otwarte mecze, eventy i treningi, vouchery i benefity firmowe – wszystko w aplikacji PadelCity na iOS i Androida.",
  },
  hero: {
    eyebrow: "iOS i Android · za darmo",
    title: "Twój kort. Twój mecz. Twoja",
    accent: "aplikacja.",
    lead: "Rezerwuj korty, znajdź partnerów do gry, zgarnij miejsce na eventach i treningach – aplikacja PadelCity to twój bilet do społeczności.",
    note: "Korty rezerwujesz wyłącznie w aplikacji – na stronie znajdziesz wszystkie kluby, informacje i ceny.",
    phoneBack: "booking",
    phoneFront: "home",
  },
  qr: { title: "Zeskanuj i pobierz", text: "Zeskanuj aparatem w telefonie – iOS i Android.", aria: "Kod QR do pobrania aplikacji (placeholder)" },
  phoneLabel: "Zrzut ekranu aplikacji PadelCity",
  screens: screensPl,
  callouts: calloutsPl,
  features: {
    eyebrow: "Wszystko w jednej aplikacji",
    title: "Mniej organizowania. Więcej grania.",
    items: [
      {
        id: "booking",
        eyebrow: "Rezerwacja kortu",
        title: "Zarezerwuj kort w 3",
        accent: "kliknięciach",
        text: "Wybierz klub, kliknij godzinę, zapłać. Natychmiastowe potwierdzenie i wpis do kalendarza w pakiecie.",
        bullets: ["Wszystkie 30+ klubów w jednej aplikacji", "Wolne korty w czasie rzeczywistym – w aplikacji", "Ulubione kluby zawsze pod ręką"],
        icon: "double_court",
        deeplink: "locations",
        cta: "Zobacz kluby",
        track: "app_feature_booking",
        screen: "booking",
      },
      {
        id: "split",
        eyebrow: "Dzielenie płatności",
        title: "Dziel koszty",
        accent: "uczciwie",
        text: "Włącz dzielenie płatności przy potwierdzaniu rezerwacji: każdy płaci za swoje miejsce gracza – albo ty bierzesz na siebie kilka.",
        bullets: ["Podział ceny kortu na miejsca graczy", "Płatność za kilka miejsc naraz", "Wszystko od razu przy płatności"],
        icon: "single_court",
        deeplink: "download",
        cta: "Pobierz aplikację",
        track: "app_feature_split",
        screen: "split",
      },
      {
        id: "matches",
        eyebrow: "Otwarte mecze",
        title: "Nigdy więcej bez",
        accent: "partnera",
        text: "Brakuje ci czwartej osoby? Utwórz otwarty mecz albo dołącz do istniejącego. Gdy zbierze się wystarczająco dużo graczy, kort jest wiążąco zarezerwowany.",
        bullets: ["Zakres poziomów dla każdego meczu", "Wszyscy gracze na pierwszy rzut oka", "Czat z uczestnikami meczu"],
        icon: "users",
        deeplink: "openMatches",
        cta: "Otwórz otwarte mecze",
        track: "app_feature_matches",
        screen: "match",
      },
      {
        id: "events",
        eyebrow: "Eventy i treningi",
        title: "Eventy i treningi jednym",
        accent: "kliknięciem",
        text: "Turnieje takie jak CUPRA One Point Challenge, eventy w twoim klubie i treningi z naszymi trenerami – zapisz się, zapłać, gotowe. Na eventy zapiszesz się też online.",
        bullets: ["Wszystkie eventy twojego klubu", "Zapisy jako zespół", "Rezerwacja treningów z najlepszymi trenerami"],
        icon: "trophy",
        deeplink: "events",
        cta: "Eventy w aplikacji",
        track: "app_feature_events",
        screen: "events",
      },
      {
        id: "vouchers",
        eyebrow: "Vouchery",
        title: "Podaruj",
        accent: "padla",
        text: "Wybierz wartość vouchera, a kod przyjdzie e-mailem – zrealizujesz go od razu przy płatności za rezerwację kortu lub trenera.",
        bullets: ["Wybór wartości vouchera", "Kod e-mailem", "Do realizacji na korty i treningi z trenerem"],
        icon: "reception",
        deeplink: "vouchers",
        cta: "Kup voucher",
        track: "app_feature_vouchers",
        screen: "checkout",
      },
      {
        id: "benefits",
        eyebrow: "Benefity firmowe",
        title: "Graj z benefitem",
        accent: "firmowym",
        text: "EGYM Wellpass albo Hansefit? Połącz konto w profilu – zniżka wyświetli się automatycznie przy płatności.",
        bullets: ["EGYM Wellpass", "Hansefit", "Zniżka automatycznie przy płatności"],
        icon: "summer",
        deeplink: "download",
        cta: "Pobierz aplikację",
        track: "app_feature_benefits",
        screen: "benefits",
      },
    ],
  },
  gallery: {
    eyebrow: "Z App Store",
    title: "Tak to wygląda w aplikacji",
    text: "Oficjalne zrzuty ekranu z App Store – przesuń, aby zobaczyć więcej.",
    label: "Zrzuty ekranu aplikacji PadelCity z App Store",
    prev: "Poprzedni zrzut ekranu",
    next: "Następny zrzut ekranu",
    cta: "Zobacz w App Store",
    panels: panelsPl,
  },
  socialProof: {
    eyebrow: "Community love",
    title: "Grana. Kochana.",
    ratings: [
      { store: "App Store", value: "4,7", count: "4500+ ocen", track: "app_rating_ios" },
      { store: "Google Play", value: "4,3", count: "750+ ocen", track: "app_rating_android" },
    ],
    ratingsLabel: (value: string, store: string, count: string) => `${value} na 5 gwiazdek w ${store}, ${count}`,
    outOf: "na 5 gwiazdek,",
    asOf: "Stan na październik 2026",
  },
  how: {
    eyebrow: "Jak to działa",
    title: "Na korcie w 3 krokach",
    steps: [
      { step: "01", title: "Pobierz aplikację", text: "Za darmo na iOS i Androida. Konto założysz w minutę." },
      { step: "02", title: "Wybierz klub i godzinę", text: "W aplikacji zobaczysz wolne korty w pobliżu – albo dołączysz do otwartego meczu." },
      { step: "03", title: "Let's play Padel!", text: "Zapłać, zaproś znajomych i wchodź na kort. #bettertogether" },
    ],
  },
  faqSection: { eyebrow: "FAQ", title: "Dobrze wiedzieć", all: "Wszystkie pytania i odpowiedzi" },
  faq: [
    { q: "Ile kosztuje aplikacja?", a: "Pobranie i założenie konta są bezpłatne. Płacisz tylko za to, co rezerwujesz – korty, eventy lub treningi." },
    { q: "Czy mogę rezerwować korty na stronie internetowej?", a: "Nie, rezerwacje odbywają się wyłącznie w aplikacji. Na stronie znajdziesz wszystkie kluby z informacjami i cenami – jedno kliknięcie przeniesie cię prosto do klubu w aplikacji." },
    { q: "Jak podzielić koszty z partnerami do gry?", a: "Włącz dzielenie płatności przy potwierdzaniu rezerwacji. Wtedy płacisz tylko za swoje miejsce gracza – albo wybierasz, za ile miejsc płacisz." },
    { q: "Jak korzystać z EGYM Wellpass lub Hansefit?", a: "Połącz konto w profilu. Przy uprawnionych rezerwacjach kortów zniżka wyświetli się automatycznie przy płatności." },
    { q: "Jakie są metody płatności?", a: "Karta kredytowa, Apple Pay, Google Pay i PayPal – bezpiecznie obsługiwane przez naszego operatora płatności." },
  ],
  final: {
    title: "Let's play",
    accent: "Padel!",
    text: "Pobierz aplikację, zarezerwuj kort, zaproś znajomych. Do zobaczenia na korcie. #bettertogether",
    clubs: "Najpierw zobacz kluby",
    phone: "events",
  },
};

export const appContent: Record<Locale, AppContent> = { de, en, pl };
