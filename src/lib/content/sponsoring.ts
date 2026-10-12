import type { Locale } from "../i18n/config";
import type { Partner } from "../data/types";
import { keyFacts } from "./partners";

/** Partner & Sponsoring content. Contentful content type proposal: `sponsoringPage`. */

type FormatIcon = "building" | "trophy" | "shirt" | "smartphone" | "clapperboard" | "briefcase";

const de = {
  meta: {
    title: "Partner & Sponsoring",
    description: `Werde Partner von PadelCity: Club Branding, Event-Titelsponsoring, Apparel, App & Digital, PadelCity TV und Corporate Events in ${keyFacts.clubs}+ Clubs.`,
  },
  hero: {
    eyebrow: "Partner & Sponsoring",
    imageAlt: "Spieler:innen in Partner-Shirts bei einem PadelCity Club-Opening",
    title: "Deine Marke. Unser",
    accent: "Court.",
    lead: `Padel ist der Sport einer jungen, urbanen Community. Mit ${keyFacts.clubs}+ Clubs, eigener App und Top-Events bringen wir deine Marke mitten ins Spiel.`,
    ctaPrimary: "Partner werden",
    ctaSecondary: "Firmenevents",
  },
  stats: { clubs: "Clubs", courts: "Courts", cities: "Städte", founded: "Seit" },
  formats: {
    eyebrow: "Formate",
    title: "So wirst du Teil von PadelCity",
    lead: "Vom Court-Naming bis zum eigenen Turnier: Wir bauen das Paket, das zu deinen Zielen passt.",
    items: [
      { title: "Club Branding", text: `Court-Namings, Banden, Netze und Lounge-Flächen in ${keyFacts.clubs}+ Clubs.`, icon: "building" },
      { title: "Event-Titelsponsoring", text: "Werde Presenter, z. B. wie CUPRA bei der One Point Challenge.", icon: "trophy" },
      { title: "Trikot & Apparel", text: "Auf dem Shirt unserer Teams und Coaches – wie Haier und Natural Elements.", icon: "shirt" },
      { title: "App & Digital", text: "Native Platzierungen, Challenges und Rewards in der PadelCity App.", icon: "smartphone" },
      { title: "Content & PadelCity TV", text: "Formate auf PadelCity TV, im Magazin und auf Social Media.", icon: "clapperboard" },
      { title: "Corporate Events & B2B", text: "Firmen-Turniere, Team-Events und Mitarbeiter-Angebote.", icon: "briefcase" },
    ] as { title: string; text: string; icon: FormatIcon }[],
    other: "Sonstiges",
  },
  personas: {
    eyebrow: "Loyalty hits reach.",
    title: "Wen du bei uns erreichst",
    lead: "Sechs Personas aus unserem Brand Book – von der Turnierspielerin bis zum Kids-Academy-Spieler.",
    // TODO(content): align persona descriptions with the brand book persona sheets.
    items: [
      { name: "Leo", age: "27", text: "Urban, kompetitiv, spielt 3× pro Woche und kennt jedes neue Racket." },
      { name: "Nina", age: "32", text: "Sucht Spaß & Leute – Padel ist ihr Social Club nach Feierabend." },
      { name: "Steffen", age: "45", text: "Business-Spieler, bucht für Kunden-Events und Team-Abende." },
      { name: "Valeria", age: "24", text: "Turnierspielerin mit Ranking-Ambitionen und großer Reichweite." },
      { name: "Kathrin", age: "39", text: "Fitness & Gesundheit im Fokus, spielt mit Freundinnen am Vormittag." },
      { name: "Tim", age: "11", text: "Kids-Academy-Spieler – die nächste Generation Padel." },
    ],
  },
  logos: {
    title: "In guter Gesellschaft",
    text: "Marken, die mit uns Padel groß machen.",
    tiers: {
      premium: { title: "Premium Partner", text: "Presenter & strategische Partner" },
      official: { title: "Official Partner", text: "Trikot, Apparel & Kategorie-Partner" },
      supplier: { title: "Supplier", text: "Food & Beverage, Services, Benefits" },
    } satisfies Record<Partner["tier"], { title: string; text: string }>,
    descriptions: {
      CUPRA: "Mobility Partner & Presenter der One Point Challenge",
      Babolat: "Official Racket & Ball Partner, PadelCity Series",
      Haier: "Trikot-Sponsor",
      "Natural Elements": "Trikot-Sponsor",
    } as Record<string, string>,
  },
  cases: {
    eyebrow: "Case Studies",
    title: "Partnerschaften, die man spürt",
    items: [
      {
        partner: "CUPRA",
        title: "CUPRA × One Point Challenge",
        text: "Ein Punkt entscheidet – um bis zu 100.000 € Preisgeld. CUPRA präsentiert das spektakulärste Format im deutschen Padel und ist als Mobility Partner in den Clubs präsent.",
        tags: ["Titelsponsoring", "Event", "Club Branding"],
        image: { url: "/images/partner/cupra-one-point-challenge.jpg", alt: "Court mit CUPRA-Branding in einem PadelCity Club" },
      },
      {
        partner: "Babolat",
        title: "Babolat × PadelCity Series",
        text: "Die PadelCity Series powered by Babolat bringt Turnier-Feeling in jeden Club – mit Equipment, Coaching und Content rund um die Serie.",
        tags: ["Turnierserie", "Equipment", "Content"],
        image: { url: "/images/partner/babolat-series.jpg", alt: "Babolat-Bälle im Automaten eines PadelCity Clubs" },
      },
    ],
  },
  corporate: {
    eyebrow: "Corporate Events & B2B",
    title: "Firmenevents buchen",
    text: "Teambuilding, das wirklich verbindet: Padel ist in zehn Minuten gelernt und sorgt für Gesprächsstoff bis zum nächsten Meeting. Wir organisieren alles – Courts, Coaches, Catering.",
    cta: "Event anfragen",
    formats: ["Firmen-Turnier mit Siegerehrung", "Team-Event mit Coach & Schnupperkurs", "Kunden-Event in der Club-Lounge", "Mitarbeiter-Padel als Benefit"],
  },
  form: {
    title: "Let's play",
    accent: "together",
    text: "Erzähl uns von deiner Marke und deinen Zielen. Unser Partnership-Team meldet sich mit einer ersten Idee.",
    submit: "Anfrage senden",
    successTitle: "Danke! Wir melden uns.",
    successText: "Unser Partnership-Team meldet sich innerhalb von zwei Werktagen mit einer ersten Idee.",
    fields: {
      name: "Name",
      company: "Unternehmen",
      email: "E-Mail",
      phone: "Telefon",
      interest: "Interesse",
      message: "Nachricht",
      messagePlaceholder: "Ziele, Zeitraum, Budgetrahmen – alles, was uns hilft.",
    },
  },
};

export type SponsoringContent = typeof de;

const en: SponsoringContent = {
  meta: {
    title: "Partners & Sponsoring",
    description: `Partner with PadelCity: club branding, event title sponsorship, apparel, app & digital, PadelCity TV and corporate events across ${keyFacts.clubs}+ clubs.`,
  },
  hero: {
    eyebrow: "Partners & Sponsoring",
    imageAlt: "Players in partner shirts at a PadelCity club opening",
    title: "Your brand. Our",
    accent: "court.",
    lead: `Padel is the sport of a young, urban community. With ${keyFacts.clubs}+ clubs, our own app and headline events, we put your brand right in the middle of the game.`,
    ctaPrimary: "Become a partner",
    ctaSecondary: "Corporate events",
  },
  stats: { clubs: "Clubs", courts: "Courts", cities: "Cities", founded: "Since" },
  formats: {
    eyebrow: "Formats",
    title: "How to become part of PadelCity",
    lead: "From court naming to your own tournament: we'll build the package that fits your goals.",
    items: [
      { title: "Club branding", text: `Court naming, boards, nets and lounge areas across ${keyFacts.clubs}+ clubs.`, icon: "building" },
      { title: "Event title sponsorship", text: "Become a presenting partner – just like CUPRA at the One Point Challenge.", icon: "trophy" },
      { title: "Kit & apparel", text: "On the shirts of our teams and coaches – like Haier and Natural Elements.", icon: "shirt" },
      { title: "App & digital", text: "Native placements, challenges and rewards in the PadelCity app.", icon: "smartphone" },
      { title: "Content & PadelCity TV", text: "Formats on PadelCity TV, in the magazine and across social media.", icon: "clapperboard" },
      { title: "Corporate events & B2B", text: "Company tournaments, team events and employee offers.", icon: "briefcase" },
    ],
    other: "Something else",
  },
  personas: {
    eyebrow: "Loyalty hits reach.",
    title: "Who you'll reach with us",
    lead: "Six personas from our brand book – from the tournament player to the kids' academy star.",
    items: [
      { name: "Leo", age: "27", text: "Urban and competitive, plays three times a week and knows every new racket." },
      { name: "Nina", age: "32", text: "Looking for fun and new faces – padel is her after-work social club." },
      { name: "Steffen", age: "45", text: "Business player who books for client events and team nights." },
      { name: "Valeria", age: "24", text: "Tournament player with ranking ambitions and a big following." },
      { name: "Kathrin", age: "39", text: "Focused on fitness and health, plays with friends in the morning." },
      { name: "Tim", age: "11", text: "Kids' academy player – the next generation of padel." },
    ],
  },
  logos: {
    title: "In good company",
    text: "Brands helping us make padel big.",
    tiers: {
      premium: { title: "Premium partners", text: "Presenting & strategic partners" },
      official: { title: "Official partners", text: "Kit, apparel & category partners" },
      supplier: { title: "Suppliers", text: "Food & beverage, services, benefits" },
    },
    descriptions: {
      CUPRA: "Mobility partner & presenter of the One Point Challenge",
      Babolat: "Official racket & ball partner, PadelCity Series",
      Haier: "Kit sponsor",
      "Natural Elements": "Kit sponsor",
    },
  },
  cases: {
    eyebrow: "Case studies",
    title: "Partnerships you can feel",
    items: [
      {
        partner: "CUPRA",
        title: "CUPRA × One Point Challenge",
        text: "One point decides it all – for up to €100,000 in prize money. CUPRA presents the most spectacular format in German padel and is visible in our clubs as mobility partner.",
        tags: ["Title sponsorship", "Event", "Club branding"],
        image: { url: "/images/partner/cupra-one-point-challenge.jpg", alt: "Court with CUPRA branding at a PadelCity club" },
      },
      {
        partner: "Babolat",
        title: "Babolat × PadelCity Series",
        text: "The PadelCity Series powered by Babolat brings a tournament feel to every club – with equipment, coaching and content around the series.",
        tags: ["Tournament series", "Equipment", "Content"],
        image: { url: "/images/partner/babolat-series.jpg", alt: "Babolat balls in a vending machine at a PadelCity club" },
      },
    ],
  },
  corporate: {
    eyebrow: "Corporate events & B2B",
    title: "Book a corporate event",
    text: "Team building that genuinely brings people together: padel takes ten minutes to learn and gives everyone something to talk about until the next meeting. We take care of everything – courts, coaches, catering.",
    cta: "Enquire about an event",
    formats: ["Company tournament with prize-giving", "Team event with coach & taster session", "Client event in the club lounge", "Padel as an employee benefit"],
  },
  form: {
    title: "Let's play",
    accent: "together",
    text: "Tell us about your brand and your goals. Our partnerships team will come back to you with a first idea.",
    submit: "Send enquiry",
    successTitle: "Thanks! We'll be in touch.",
    successText: "Our partnerships team will get back to you within two working days with a first idea.",
    fields: {
      name: "Name",
      company: "Company",
      email: "Email",
      phone: "Phone",
      interest: "Interest",
      message: "Message",
      messagePlaceholder: "Goals, timing, budget range – anything that helps us.",
    },
  },
};

export const sponsoringContent: Record<Locale, SponsoringContent> = { de, en };
