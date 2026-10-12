import type { Locale } from "../i18n/config";
import { keyFacts } from "./partners";

/**
 * Franchise landing page content. Contentful content type proposal: `franchisePage`.
 * No invented numbers: investment ranges / minimum sizes are only published once the franchise team confirms them.
 */

type BenefitIcon = "sparkles" | "smartphone" | "graduation" | "trophy" | "handshake" | "megaphone";

const de = {
  meta: {
    title: "Franchise – Bring PadelCity in deine Stadt",
    description:
      "Werde PadelCity Franchise-Partner: starke Marke, eigene App & Buchungsplattform, Academy, Events und Partnernetzwerk. Jetzt Standort anfragen.",
  },
  hero: {
    eyebrow: "Franchise · Drive the Padel Boom!",
    imageAlt: "Luftaufnahme eines PadelCity Clubs mit Outdoor-Courts",
    title: "Bring PadelCity in deine",
    accent: "Stadt",
    lead: `Du hast die Halle, wir haben das Playbook. Mit Deutschlands führender Padel-Marke, der Erfahrung aus ${keyFacts.clubs}+ Clubs und einer eigenen App eröffnest du deinen Club – schneller und sicherer.`,
    ctaPrimary: "Standort anfragen",
    ctaSecondary: "So läuft's",
  },
  benefits: {
    eyebrow: "Warum PadelCity",
    title: "Alles, was ein Club braucht. Aus einer Hand.",
    lead: `Du konzentrierst dich auf deinen Standort und deine Community – wir liefern Marke, Technologie und Know-how aus über ${keyFacts.clubs} Club-Eröffnungen.`,
    items: [
      { title: "Starke Marke", text: "Deutschlands führende Padel-Marke mit Wiedererkennung vom ersten Tag an.", icon: "sparkles" },
      { title: "App & Buchungsplattform", text: "Buchung, Payment, Matches und CRM über die PadelCity App – ohne eigene IT.", icon: "smartphone" },
      { title: "Academy", text: "Trainingskonzept, Coach-Ausbildung und Kursformate für jedes Level.", icon: "graduation" },
      { title: "Events", text: "Turnierserien, Social Events und Eventformate, die deinen Club füllen.", icon: "trophy" },
      { title: "Einkauf & Partnernetzwerk", text: "Konditionen bei Court-Herstellern, Equipment und Partnern wie Babolat.", icon: "handshake" },
      { title: "Marketing", text: "Launch-Kampagne, Social Media, Content und Community-Aufbau aus einer Hand.", icon: "megaphone" },
    ] as { title: string; text: string; icon: BenefitIcon }[],
  },
  partnership: {
    eyebrow: "Partnerschaft",
    title: "Was wir liefern. Was du mitbringst.",
    weProvideLabel: "PadelCity liefert",
    youBringLabel: "Du bringst mit",
    weProvide: [
      "Markenrechte & Corporate Design für deinen Club",
      "PadelCity App inkl. Buchungs- und Payment-System",
      "Standort- und Business-Case-Analyse",
      "Bau-Know-how, Court-Planung & Lieferantennetzwerk",
      "Academy-Konzept & Coach-Onboarding",
      "Launch-Marketing & laufende Kampagnen",
      "Zugang zu Events, Ligen und Partner-Deals",
    ],
    youBring: [
      "Halle oder Fläche (Eigentum oder Pacht)",
      "Investitionsbereitschaft & Finanzierung",
      "Unternehmergeist und Lust auf Community",
      "Lokales Netzwerk in deiner Stadt",
      "Team vor Ort für Betrieb & Service",
    ],
  },
  steps: {
    eyebrow: "Ablauf",
    title: "In 5 Schritten zum eigenen Club",
    lead: "Vom ersten Call bis zum Opening-Abend begleitet dich ein festes Expansion-Team.",
    items: [
      { title: "Kennenlernen", text: "Erstgespräch: Wer bist du, wo willst du hin, passt PadelCity zu dir?" },
      { title: "Standort-Check", text: "Wir analysieren Fläche, Einzugsgebiet und Wettbewerb gemeinsam mit dir." },
      { title: "Business Case & Vertrag", text: "Investitionsplan, Rentabilität und Franchisevertrag – transparent und klar." },
      { title: "Bau & Setup", text: "Courts, Ausstattung, App-Setup und Team-Onboarding mit unserem Playbook." },
      { title: "Opening & Betrieb", text: "Große Eröffnung – danach begleiten wir dich mit Marketing, Events und Benchmarks." },
    ],
  },
  requirements: {
    eyebrow: "Voraussetzungen",
    title: "Das solltest du mitbringen",
    // TODO(content): minimum court count, ceiling height and investment range – only once confirmed by the franchise team.
    items: [
      { title: "Halle / Fläche", value: "20 x 10 m", text: "So groß ist ein Padel-Court. Ideal: eine Indoor-Halle mit ausreichend Deckenhöhe oder eine gut erreichbare Outdoor-Fläche." },
      { title: "Investment", value: "Individuell", text: "Das Gesamtinvestment hängt von Größe, Ausbau und Bestand ab. Die Zahlen rechnen wir gemeinsam im Business Case durch." },
      { title: "Standort", value: "Top-Lage", text: "Gute Erreichbarkeit, Parkplätze und ein Einzugsgebiet mit sportbegeisterter Zielgruppe." },
    ],
  },
  clubs: {
    eyebrowSuffix: "Franchise-Clubs live",
    title: "Sie haben es schon gemacht",
    lead: "Unsere Franchise-Partner spielen in der gleichen Liga wie unsere eigenen Clubs – gleiche App, gleiche Events, gleiche Community.",
  },
  form: {
    title: "Lass uns über deinen",
    accent: "Standort",
    titleEnd: "reden",
    text: "Erzähl uns kurz von dir und deiner Fläche. Unser Expansion-Team meldet sich innerhalb von zwei Werktagen.",
    checks: ["Unverbindliches Erstgespräch", "Kostenloser Standort-Check", "Vertrauliche Behandlung deiner Daten"],
    submit: "Anfrage senden",
    successTitle: "Danke – wir melden uns!",
    successText: "Unser Expansion-Team prüft deine Angaben und meldet sich innerhalb von zwei Werktagen für ein Erstgespräch.",
    fields: {
      name: "Name",
      email: "E-Mail",
      phone: "Telefon",
      city: "Stadt / Region",
      space: "Fläche vorhanden?",
      spaceOptions: ["Ja, Halle vorhanden", "Ja, Freifläche vorhanden", "In Planung / Verhandlung", "Nein, ich suche noch"],
      message: "Nachricht",
      messagePlaceholder: "Erzähl uns von dir, deinem Standort und deinem Zeitplan.",
    },
  },
};

export type FranchiseContent = typeof de;

const en: FranchiseContent = {
  meta: {
    title: "Franchise – Bring PadelCity to your city",
    description:
      "Become a PadelCity franchise partner: a strong brand, our own app and booking platform, academy, events and partner network. Enquire about your site now.",
  },
  hero: {
    eyebrow: "Franchise · Drive the Padel Boom!",
    imageAlt: "Aerial view of a PadelCity club with outdoor courts",
    title: "Bring PadelCity to your",
    accent: "city",
    lead: `You've got the space, we've got the playbook. With Germany's leading padel brand, the experience of ${keyFacts.clubs}+ clubs and our own app, you'll open your club faster and with less risk.`,
    ctaPrimary: "Enquire about your site",
    ctaSecondary: "How it works",
  },
  benefits: {
    eyebrow: "Why PadelCity",
    title: "Everything a club needs. From a single source.",
    lead: `You focus on your site and your community – we bring the brand, the technology and the know-how from more than ${keyFacts.clubs} club openings.`,
    items: [
      { title: "Strong brand", text: "Germany's leading padel brand, recognised from day one.", icon: "sparkles" },
      { title: "App & booking platform", text: "Booking, payments, matches and CRM through the PadelCity app – no IT of your own needed.", icon: "smartphone" },
      { title: "Academy", text: "Coaching concept, coach training and course formats for every level.", icon: "graduation" },
      { title: "Events", text: "Tournament series, social events and formats that keep your club busy.", icon: "trophy" },
      { title: "Purchasing & partner network", text: "Preferential terms with court manufacturers, equipment suppliers and partners such as Babolat.", icon: "handshake" },
      { title: "Marketing", text: "Launch campaign, social media, content and community building – all handled for you.", icon: "megaphone" },
    ],
  },
  partnership: {
    eyebrow: "Partnership",
    title: "What we deliver. What you bring.",
    weProvideLabel: "PadelCity delivers",
    youBringLabel: "You bring",
    weProvide: [
      "Brand rights & corporate design for your club",
      "The PadelCity app incl. booking and payment system",
      "Site and business case analysis",
      "Construction know-how, court planning & supplier network",
      "Academy concept & coach onboarding",
      "Launch marketing & ongoing campaigns",
      "Access to events, leagues and partner deals",
    ],
    youBring: [
      "A hall or site (owned or leased)",
      "Willingness to invest & financing",
      "Entrepreneurial spirit and a passion for community",
      "A local network in your city",
      "An on-site team for operations & service",
    ],
  },
  steps: {
    eyebrow: "The process",
    title: "Five steps to your own club",
    lead: "From the first call to opening night, a dedicated expansion team is at your side.",
    items: [
      { title: "Get to know us", text: "First conversation: who are you, where do you want to go – and is PadelCity the right fit?" },
      { title: "Site check", text: "Together we analyse the space, the catchment area and the competition." },
      { title: "Business case & contract", text: "Investment plan, profitability and franchise agreement – clear and transparent." },
      { title: "Build & set-up", text: "Courts, fit-out, app set-up and team onboarding, all with our playbook." },
      { title: "Opening & operations", text: "A big opening – and afterwards we support you with marketing, events and benchmarks." },
    ],
  },
  requirements: {
    eyebrow: "Requirements",
    title: "What you should bring",
    items: [
      { title: "Hall / site", value: "20 x 10 m", text: "That's the size of one padel court. Ideally an indoor hall with enough ceiling height or an easily accessible outdoor site." },
      { title: "Investment", value: "Tailored", text: "The total investment depends on size, fit-out and existing building. We work through the numbers together in the business case." },
      { title: "Location", value: "Prime spot", text: "Easy to reach, with parking and a catchment area full of sport-loving people." },
    ],
  },
  clubs: {
    eyebrowSuffix: "franchise clubs live",
    title: "They've already done it",
    lead: "Our franchise partners play in the same league as our own clubs – same app, same events, same community.",
  },
  form: {
    title: "Let's talk about your",
    accent: "site",
    titleEnd: "",
    text: "Tell us a little about yourself and your space. Our expansion team will get back to you within two working days.",
    checks: ["No-obligation first conversation", "Free site check", "Your details treated in confidence"],
    submit: "Send enquiry",
    successTitle: "Thanks – we'll be in touch!",
    successText: "Our expansion team will review your details and get back to you within two working days to arrange a first call.",
    fields: {
      name: "Name",
      email: "Email",
      phone: "Phone",
      city: "City / region",
      space: "Do you have a site?",
      spaceOptions: ["Yes, an indoor hall", "Yes, an outdoor site", "In planning / negotiation", "No, still looking"],
      message: "Message",
      messagePlaceholder: "Tell us about yourself, your site and your timeline.",
    },
  },
};

export const franchiseContent: Record<Locale, FranchiseContent> = { de, en };
