import type { Locale } from "../i18n/config";

/**
 * FAQ page copy + STATIC fallback questions.
 * Primary source at build time: the app's help centre (api-platform `/faq/sections` → Contentful
 * `frequentlyAskedQuestionSection` / `frequentlyAskedQuestions`), loaded by `getFaq(locale)` in src/lib/data/faq.ts.
 * The static list below is only used when that API is unreachable. It generalises the former per-club FAQ and only
 * states what the website already says elsewhere. Club pages show a „Fragen zum Club“ module again (team feedback
 * ort-5): club answers from Contentful once Ops delivers them (Club.faq), until then three entries of this list.
 */

/** Icon keys: API section icons (Contentful) + our static categories. Mapped to lucide icons in FaqExplorer. */
export type FaqIcon =
  | "infoCircle"
  | "userCircle"
  | "calendar"
  | "markerPin"
  | "muscle"
  | "users"
  | "messageQuestionSquare"
  | "lock"
  | "wellPass"
  | "hansefit"
  | "creditCard2"
  | (string & {});

export type FaqEntry = {
  id: string;
  q: string;
  /** Plain-text answer (search, JSON-LD, static rendering). */
  a: string;
  /** Sanitised HTML answer (API source only). */
  html?: string;
};

export type FaqCategory = { id: string; title: string; icon: FaqIcon; items: FaqEntry[] };

const de = {
  meta: {
    title: "FAQ – Fragen & Antworten rund um PadelCity",
    description: "Buchen & Bezahlen in der App, Stornierung, Leihschläger, Hansefit & EGYM Wellpass, Academy und dein Konto: Antworten auf die häufigsten Fragen.",
  },
  hero: {
    eyebrow: "FAQ",
    title: "Fragen?",
    accent: "Antworten.",
    lead: "Buchen, bezahlen, stornieren, Benefits und Academy – hier findest du schnell, was du wissen musst. Let's play Padel!",
    imageAlt: "Gruppe mit Padel-Schlägern auf einem PadelCity Court vor der „Better Together“-Wand",
  },
  explorer: {
    searchLabel: "FAQ durchsuchen",
    searchPlaceholder: "z. B. Storno, Leihschläger, Hansefit …",
    clear: "Suche löschen",
    categoriesLabel: "Themen",
    all: "Alle Themen",
    countOne: "1 Frage",
    countMany: "{n} Fragen",
    resultsOne: "1 Treffer für „{q}“",
    resultsMany: "{n} Treffer für „{q}“",
    emptyTitle: "Dazu haben wir noch keine Antwort.",
    emptyText: "Probier ein anderes Stichwort – oder schreib uns, wir helfen dir weiter.",
    reset: "Suche zurücksetzen",
    sourceApi: "Die Antworten kommen aus dem Hilfe-Bereich der PadelCity App.",
  },
  contact: {
    eyebrow: "Noch Fragen?",
    title: "Schreib",
    accent: "uns.",
    text: "Dein Thema war nicht dabei? Unser Team antwortet dir per Mail. Fragen zu einem bestimmten Club beantwortet dir das Club-Team – Kontakt findest du auf jeder Clubseite.",
    mail: "E-Mail schreiben",
    mailSubject: "Frage an PadelCity",
    locations: "Zu den Clubs",
  },
  categories: [
    {
      id: "buchen-bezahlen",
      title: "Buchen & Bezahlen",
      icon: "calendar",
      items: [
        {
          id: "court-buchen",
          q: "Wie buche ich einen Court?",
          a: "Ausschließlich in der PadelCity App: Club wählen, Zeit und Court aussuchen, bezahlen – fertig. Die Bestätigung kommt sofort. Auf der Website findest du alle Clubs mit Infos und Preisen; ein Tap bringt dich direkt zum Club in der App.",
        },
        {
          id: "website-buchen",
          q: "Kann ich auch auf der Website buchen?",
          a: "Nein, Buchung und Bezahlung laufen exklusiv über die App. So siehst du immer den aktuellen Stand und hast alle Buchungen an einem Ort.",
        },
        {
          id: "kosten-teilen",
          q: "Kann ich die Kosten mit meinen Mitspieler:innen teilen?",
          a: "Ja. Aktiviere beim Buchen die anteilige Zahlung – dann zahlst du nur deinen Player Slot oder wählst aus, wie viele Slots du übernimmst.",
          // TODO(content): confirm deadlines for split payment (e.g. fully paid X h before start) with Ops
        },
        {
          id: "stornieren",
          q: "Kann ich meine Buchung stornieren?",
          a: "Ja – die Stornobedingungen siehst du vor dem Buchen in der App. Dort verwaltest und stornierst du deine Buchung auch direkt.",
          // TODO(content): exact cancellation window and fees from Ops/AGB
        },
      ],
    },
    {
      id: "vor-ort",
      title: "Vor Ort",
      icon: "markerPin",
      items: [
        {
          id: "leihschlaeger",
          q: "Kann ich mir Schläger und Bälle ausleihen?",
          a: "Klar. In unseren Clubs bekommst du Leihschläger vor Ort, Bälle gibt's am Automaten oder an der Bar. Einfach vorbeikommen und loslegen.",
          // TODO(content): confirm rental rackets/balls are available at every club (and whether rackets are bookable in the app)
        },
        {
          id: "anfahrt",
          q: "Wie komme ich hin – gibt es Parkplätze?",
          a: "Auf jeder Clubseite findest du Adresse, Karte und „Route öffnen“. Ob es Parkplätze direkt am Club gibt, steht dort bei den Facilities. Plane ein paar Minuten zum Aufwärmen ein.",
        },
        {
          id: "oeffnungszeiten",
          q: "Wann haben die Clubs geöffnet?",
          a: "Die Öffnungszeiten stehen auf jeder Clubseite unter „Anfahrt & Öffnungszeiten“ und in der App.",
        },
      ],
    },
    {
      id: "benefits",
      title: "Benefits",
      icon: "wellPass",
      items: [
        {
          id: "firmenfitness",
          q: "Kann ich mit Hansefit oder EGYM Wellpass spielen?",
          a: "Ja, wir sind Partner von Firmenfitness-Anbietern wie Hansefit und EGYM Wellpass. Verknüpfe deine Mitgliedschaft in der App – der Rabatt wird beim Buchen automatisch berücksichtigt.",
          // TODO(content): confirm per-club partner list + conditions (e.g. once per day)
        },
      ],
    },
    {
      id: "academy-events",
      title: "Academy & Events",
      icon: "muscle",
      items: [
        {
          id: "kids",
          q: "Können Kinder auch spielen?",
          a: "Unbedingt! Kids sind auf unseren Courts willkommen – für den Einstieg empfehlen wir die Kids-Kurse der PadelCity Academy.",
        },
        {
          id: "training",
          q: "Wie komme ich an ein Training oder einen Kurs?",
          a: "Auf der Academy-Seite und auf jeder Clubseite findest du die Coaches mit Kontakt. Kurse, Trainings und Events buchst du in der App.",
        },
      ],
    },
    {
      id: "konto-app",
      title: "Konto & App",
      icon: "userCircle",
      items: [
        {
          id: "app-kosten",
          q: "Was kostet die App?",
          a: "Download und Konto sind kostenlos. Du zahlst nur, was du buchst – Courts, Events oder Trainings.",
        },
        {
          id: "app-download",
          q: "Wo bekomme ich die App?",
          a: "Die PadelCity App gibt es kostenlos im App Store (iOS) und bei Google Play (Android).",
        },
      ],
    },
  ] satisfies FaqCategory[] as FaqCategory[],
};

export type FaqContent = typeof de;

const en: FaqContent = {
  meta: {
    title: "FAQ – questions & answers about PadelCity",
    description: "Booking & paying in the app, cancellations, hire rackets, Hansefit & EGYM Wellpass, the Academy and your account: answers to the most common questions.",
  },
  hero: {
    eyebrow: "FAQ",
    title: "Questions?",
    accent: "Answers.",
    lead: "Booking, paying, cancelling, benefits and the Academy – everything you need to know, fast. Let's play Padel!",
    imageAlt: "Group holding padel rackets on a PadelCity court in front of the “Better Together” wall",
  },
  explorer: {
    searchLabel: "Search the FAQ",
    searchPlaceholder: "e.g. cancel, hire rackets, Hansefit …",
    clear: "Clear search",
    categoriesLabel: "Topics",
    all: "All topics",
    countOne: "1 question",
    countMany: "{n} questions",
    resultsOne: "1 result for “{q}”",
    resultsMany: "{n} results for “{q}”",
    emptyTitle: "We don't have an answer for that yet.",
    emptyText: "Try another keyword – or drop us a line and we'll help you out.",
    reset: "Reset search",
    sourceApi: "These answers come from the help section of the PadelCity app.",
  },
  contact: {
    eyebrow: "Still curious?",
    title: "Drop us",
    accent: "a line.",
    text: "Didn't find your topic? Our team will get back to you by email. For anything about a specific club, the club team is your best bet – you'll find their contact on every club page.",
    mail: "Send an email",
    mailSubject: "Question for PadelCity",
    locations: "Find a club",
  },
  categories: [
    {
      id: "buchen-bezahlen",
      title: "Booking & paying",
      icon: "calendar",
      items: [
        {
          id: "court-buchen",
          q: "How do I book a court?",
          a: "Only in the PadelCity app: pick the club, choose a time and court, pay – done. Confirmation is instant. The website shows every club with info and prices; one tap takes you straight to the club in the app.",
        },
        {
          id: "website-buchen",
          q: "Can I book on the website?",
          a: "No, booking and payment happen exclusively in the app – so you always see the latest status and have all your bookings in one place.",
        },
        {
          id: "kosten-teilen",
          q: "Can I split the cost with my playing partners?",
          a: "Yes. Switch on split payment when you book – you then pay only for your own player slot, or choose how many slots you cover.",
        },
        {
          id: "stornieren",
          q: "Can I cancel my booking?",
          a: "Yes – you'll see the cancellation terms in the app before you book, and you can manage or cancel your booking there too.",
        },
      ],
    },
    {
      id: "vor-ort",
      title: "At the club",
      icon: "markerPin",
      items: [
        {
          id: "leihschlaeger",
          q: "Can I hire rackets and balls?",
          a: "Of course. Our clubs have hire rackets on site, and balls are available from the vending machine or at the bar. Just turn up and play.",
        },
        {
          id: "anfahrt",
          q: "How do I get there – is there parking?",
          a: "Every club page has the address, a map and “Get directions”. Whether there's parking right by the club is listed under facilities. Allow a few minutes to warm up.",
        },
        {
          id: "oeffnungszeiten",
          q: "When are the clubs open?",
          a: "You'll find the opening hours on every club page under “Getting here & opening hours” and in the app.",
        },
      ],
    },
    {
      id: "benefits",
      title: "Benefits",
      icon: "wellPass",
      items: [
        {
          id: "firmenfitness",
          q: "Can I play with Hansefit or EGYM Wellpass?",
          a: "Yes, we partner with corporate fitness providers such as Hansefit and EGYM Wellpass. Link your membership in the app and the discount is applied automatically when you book.",
        },
      ],
    },
    {
      id: "academy-events",
      title: "Academy & events",
      icon: "muscle",
      items: [
        {
          id: "kids",
          q: "Can kids play too?",
          a: "Absolutely! Kids are welcome on our courts – to get started we recommend the PadelCity Academy kids' courses.",
        },
        {
          id: "training",
          q: "How do I sign up for coaching or a course?",
          a: "The Academy page and every club page list the coaches with contact details. You book courses, coaching and events in the app.",
        },
      ],
    },
    {
      id: "konto-app",
      title: "Account & app",
      icon: "userCircle",
      items: [
        {
          id: "app-kosten",
          q: "How much does the app cost?",
          a: "Downloading it and creating an account are free. You only pay for what you book – courts, events or coaching.",
        },
        {
          id: "app-download",
          q: "Where can I get the app?",
          a: "The PadelCity app is free on the App Store (iOS) and Google Play (Android).",
        },
      ],
    },
  ],
};

const pl: FaqContent = {
  meta: {
    title: "FAQ – pytania i odpowiedzi o PadelCity",
    description: "Rezerwacja i płatność w aplikacji, anulowanie, rakiety do wypożyczenia, Hansefit i EGYM Wellpass, Akademia i twoje konto: odpowiedzi na najczęstsze pytania.",
  },
  hero: {
    eyebrow: "FAQ",
    title: "Pytania?",
    accent: "Odpowiedzi.",
    lead: "Rezerwacja, płatność, anulowanie, benefity i Akademia – tu szybko znajdziesz to, co musisz wiedzieć. Let's play Padel!",
    imageAlt: "Grupa z rakietami do padla na korcie PadelCity przed ścianą „Better Together”",
  },
  explorer: {
    searchLabel: "Przeszukaj FAQ",
    searchPlaceholder: "np. anulowanie, rakiety, Hansefit …",
    clear: "Wyczyść wyszukiwanie",
    categoriesLabel: "Tematy",
    all: "Wszystkie tematy",
    countOne: "1 pytanie",
    countMany: "Pytania: {n}",
    resultsOne: "1 wynik dla „{q}”",
    resultsMany: "Wyniki dla „{q}”: {n}",
    emptyTitle: "Na to nie mamy jeszcze odpowiedzi.",
    emptyText: "Spróbuj innego słowa – albo napisz do nas, chętnie pomożemy.",
    reset: "Resetuj wyszukiwanie",
    sourceApi: "Odpowiedzi pochodzą z sekcji pomocy w aplikacji PadelCity.",
  },
  contact: {
    eyebrow: "Masz jeszcze pytania?",
    title: "Napisz",
    accent: "do nas.",
    text: "Nie ma tu twojego tematu? Nasz zespół odpowie ci mailowo. Na pytania o konkretny klub odpowie zespół klubu – kontakt znajdziesz na stronie każdego klubu.",
    mail: "Napisz e-mail",
    mailSubject: "Pytanie do PadelCity",
    locations: "Do klubów",
  },
  categories: [
    {
      id: "buchen-bezahlen",
      title: "Rezerwacja i płatność",
      icon: "calendar",
      items: [
        {
          id: "court-buchen",
          q: "Jak zarezerwować kort?",
          a: "Wyłącznie w aplikacji PadelCity: wybierz klub, termin i kort, zapłać – gotowe. Potwierdzenie przychodzi od razu. Na stronie znajdziesz wszystkie kluby z informacjami i cenami; jedno stuknięcie przeniesie cię prosto do klubu w aplikacji.",
        },
        {
          id: "website-buchen",
          q: "Czy mogę zarezerwować kort na stronie?",
          a: "Nie, rezerwacja i płatność odbywają się wyłącznie w aplikacji. Dzięki temu zawsze widzisz aktualny stan i masz wszystkie rezerwacje w jednym miejscu.",
        },
        {
          id: "kosten-teilen",
          q: "Czy mogę podzielić koszty ze współgraczami?",
          a: "Tak. Przy rezerwacji włącz płatność dzieloną – wtedy płacisz tylko za swoje miejsce gracza albo wybierasz, ile miejsc pokrywasz.",
        },
        {
          id: "stornieren",
          q: "Czy mogę anulować rezerwację?",
          a: "Tak – zasady anulowania zobaczysz w aplikacji przed rezerwacją. Tam też zarządzasz rezerwacją i bezpośrednio ją anulujesz.",
        },
      ],
    },
    {
      id: "vor-ort",
      title: "Na miejscu",
      icon: "markerPin",
      items: [
        {
          id: "leihschlaeger",
          q: "Czy mogę wypożyczyć rakiety i piłki?",
          a: "Jasne. W naszych klubach wypożyczysz rakiety na miejscu, a piłki kupisz w automacie lub przy barze. Po prostu przyjdź i graj.",
        },
        {
          id: "anfahrt",
          q: "Jak dojechać – czy jest parking?",
          a: "Na stronie każdego klubu znajdziesz adres, mapę i przycisk „Wyznacz trasę”. Czy przy klubie jest parking, sprawdzisz tam w sekcji udogodnień. Zaplanuj kilka minut na rozgrzewkę.",
        },
        {
          id: "oeffnungszeiten",
          q: "Kiedy kluby są otwarte?",
          a: "Godziny otwarcia znajdziesz na stronie każdego klubu w sekcji „Dojazd i godziny otwarcia” oraz w aplikacji.",
        },
      ],
    },
    {
      id: "benefits",
      title: "Benefity",
      icon: "wellPass",
      items: [
        {
          id: "firmenfitness",
          q: "Czy mogę grać z Hansefit lub EGYM Wellpass?",
          a: "Tak, współpracujemy z dostawcami benefitów sportowych, takimi jak Hansefit i EGYM Wellpass. Połącz swoje członkostwo w aplikacji – zniżka zostanie automatycznie uwzględniona przy rezerwacji.",
        },
      ],
    },
    {
      id: "academy-events",
      title: "Akademia i wydarzenia",
      icon: "muscle",
      items: [
        {
          id: "kids",
          q: "Czy dzieci też mogą grać?",
          a: "Oczywiście! Dzieci są mile widziane na naszych kortach – na początek polecamy kursy dla dzieci w PadelCity Academy.",
        },
        {
          id: "training",
          q: "Jak zapisać się na trening lub kurs?",
          a: "Na stronie Akademii i na stronie każdego klubu znajdziesz trenerów z danymi kontaktowymi. Kursy, treningi i wydarzenia rezerwujesz w aplikacji.",
        },
      ],
    },
    {
      id: "konto-app",
      title: "Konto i aplikacja",
      icon: "userCircle",
      items: [
        {
          id: "app-kosten",
          q: "Ile kosztuje aplikacja?",
          a: "Pobranie i konto są bezpłatne. Płacisz tylko za to, co rezerwujesz – korty, wydarzenia lub treningi.",
        },
        {
          id: "app-download",
          q: "Gdzie mogę pobrać aplikację?",
          a: "Aplikacja PadelCity jest dostępna bezpłatnie w App Store (iOS) i w Google Play (Android).",
        },
      ],
    },
  ],
};

export const faqContent: Record<Locale, FaqContent> = { de, en, pl };
