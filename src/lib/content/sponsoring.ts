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

const pl: SponsoringContent = {
  meta: {
    title: "Partnerzy i sponsoring",
    description: `Zostań partnerem PadelCity: branding klubów, sponsoring tytularny wydarzeń, odzież, aplikacja i digital, PadelCity TV oraz eventy firmowe w ${keyFacts.clubs}+ klubach.`,
  },
  hero: {
    eyebrow: "Partnerzy i sponsoring",
    imageAlt: "Gracze w koszulkach partnerów podczas otwarcia klubu PadelCity",
    title: "Twoja marka. Nasz",
    accent: "kort.",
    lead: `Padel to sport młodej, miejskiej społeczności. Dzięki ${keyFacts.clubs}+ klubom, własnej aplikacji i topowym wydarzeniom wprowadzamy twoją markę w sam środek gry.`,
    ctaPrimary: "Zostań partnerem",
    ctaSecondary: "Eventy firmowe",
  },
  stats: { clubs: "Kluby", courts: "Korty", cities: "Miasta", founded: "Od" },
  formats: {
    eyebrow: "Formaty",
    title: "Jak stać się częścią PadelCity",
    lead: "Od nazwy kortu po własny turniej: przygotujemy pakiet dopasowany do twoich celów.",
    items: [
      { title: "Branding klubów", text: `Nazwy kortów, bandy, siatki i strefy lounge w ${keyFacts.clubs}+ klubach.`, icon: "building" },
      { title: "Sponsoring tytularny wydarzeń", text: "Zostań sponsorem prezentującym – tak jak CUPRA przy One Point Challenge.", icon: "trophy" },
      { title: "Koszulki i odzież", text: "Na koszulkach naszych drużyn i trenerów – jak Haier i Natural Elements.", icon: "shirt" },
      { title: "Aplikacja i digital", text: "Natywne placementy, wyzwania i nagrody w aplikacji PadelCity.", icon: "smartphone" },
      { title: "Content i PadelCity TV", text: "Formaty w PadelCity TV, w magazynie i w social mediach.", icon: "clapperboard" },
      { title: "Eventy firmowe i B2B", text: "Turnieje firmowe, eventy zespołowe i oferty dla pracowników.", icon: "briefcase" },
    ],
    other: "Inne",
  },
  personas: {
    eyebrow: "Loyalty hits reach.",
    title: "Do kogo docierasz z nami",
    lead: "Sześć person z naszego brand booka – od zawodniczki turniejowej po gracza Kids Academy.",
    items: [
      { name: "Leo", age: "27", text: "Miejski, nastawiony na rywalizację, gra 3 razy w tygodniu i zna każdą nową rakietę." },
      { name: "Nina", age: "32", text: "Szuka frajdy i ludzi – padel to jej klub towarzyski po pracy." },
      { name: "Steffen", age: "45", text: "Gracz biznesowy, rezerwuje korty na eventy dla klientów i wieczory zespołowe." },
      { name: "Valeria", age: "24", text: "Zawodniczka turniejowa z ambicjami rankingowymi i dużym zasięgiem." },
      { name: "Kathrin", age: "39", text: "Stawia na fitness i zdrowie, gra z przyjaciółkami przed południem." },
      { name: "Tim", age: "11", text: "Gracz Kids Academy – następne pokolenie padla." },
    ],
  },
  logos: {
    title: "W dobrym towarzystwie",
    text: "Marki, które razem z nami rozwijają padla.",
    tiers: {
      premium: { title: "Premium Partner", text: "Sponsorzy prezentujący i partnerzy strategiczni" },
      official: { title: "Official Partner", text: "Koszulki, odzież i partnerzy kategorii" },
      supplier: { title: "Supplier", text: "Jedzenie i napoje, usługi, benefity" },
    },
    descriptions: {
      CUPRA: "Mobility Partner i sponsor prezentujący One Point Challenge",
      Babolat: "Official Racket & Ball Partner, PadelCity Series",
      Haier: "Sponsor koszulek",
      "Natural Elements": "Sponsor koszulek",
    },
  },
  cases: {
    eyebrow: "Case studies",
    title: "Partnerstwa, które widać i czuć",
    items: [
      {
        partner: "CUPRA",
        title: "CUPRA × One Point Challenge",
        text: "Jeden punkt decyduje – o nawet 100 000 € nagrody. CUPRA prezentuje najbardziej spektakularny format w niemieckim padlu i jako Mobility Partner jest obecna w klubach.",
        tags: ["Sponsoring tytularny", "Wydarzenie", "Branding klubów"],
        image: { url: "/images/partner/cupra-one-point-challenge.jpg", alt: "Kort z brandingiem CUPRA w klubie PadelCity" },
      },
      {
        partner: "Babolat",
        title: "Babolat × PadelCity Series",
        text: "PadelCity Series powered by Babolat wnosi turniejową atmosferę do każdego klubu – ze sprzętem, treningami i contentem wokół cyklu.",
        tags: ["Cykl turniejowy", "Sprzęt", "Content"],
        image: { url: "/images/partner/babolat-series.jpg", alt: "Piłki Babolat w automacie w klubie PadelCity" },
      },
    ],
  },
  corporate: {
    eyebrow: "Eventy firmowe i B2B",
    title: "Zarezerwuj event firmowy",
    text: "Teambuilding, który naprawdę łączy: padla nauczysz się w dziesięć minut, a tematów do rozmów wystarczy do następnego spotkania. Organizujemy wszystko – korty, trenerów, catering.",
    cta: "Zapytaj o event",
    formats: ["Turniej firmowy z dekoracją zwycięzców", "Event zespołowy z trenerem i lekcją próbną", "Event dla klientów w klubowym lounge", "Padel dla pracowników jako benefit"],
  },
  form: {
    title: "Let's play",
    accent: "together",
    text: "Opowiedz nam o swojej marce i swoich celach. Nasz zespół ds. partnerstw odezwie się z pierwszym pomysłem.",
    submit: "Wyślij zapytanie",
    successTitle: "Dziękujemy! Odezwiemy się.",
    successText: "Nasz zespół ds. partnerstw odezwie się w ciągu dwóch dni roboczych z pierwszym pomysłem.",
    fields: {
      name: "Imię i nazwisko",
      company: "Firma",
      email: "E-mail",
      phone: "Telefon",
      interest: "Zainteresowanie",
      message: "Wiadomość",
      messagePlaceholder: "Cele, termin, budżet – wszystko, co nam pomoże.",
    },
  },
};

export const sponsoringContent: Record<Locale, SponsoringContent> = { de, en, pl };
