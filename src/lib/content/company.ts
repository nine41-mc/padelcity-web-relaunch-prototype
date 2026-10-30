import type { Locale } from "../i18n/config";
import type { RouteKey } from "../i18n/routes";

/**
 * Company hub (/unternehmen): everything that is not for players – who we are, partners, franchise, investors, jobs.
 * Team feedback 28.10.2026 (m-1, m-9): the home page belongs to the players; the paths for partners, investors and
 * franchise and the Series A block moved here from the home page.
 */
type Path = { key: RouteKey; title: string; text: string };

export const companyContent: Record<
  Locale,
  {
    meta: { title: string; description: string };
    hero: { eyebrow: string; title: string; accent: string; lead: string; cta: string; imageAlt: string };
    who: { eyebrow: string; title: string; accent: string; text: string; cta: string };
    paths: { title: string; accent: string; items: Path[] };
    momentum: { eyebrow: string; title: string; title2: string; accent: string; text: string; ir: string; jobs: string };
  }
> = {
  de: {
    meta: {
      title: "Unternehmen",
      description: "PadelCity als Unternehmen: wer wir sind, wohin wir wachsen und wie du Partner, Franchise-Partner, Investor oder Teil des Teams wirst.",
    },
    hero: {
      eyebrow: "Unternehmen",
      title: "Mehr als",
      accent: "Courts.",
      lead: "Wer hinter PadelCity steht, wohin wir wachsen – und wie du mit uns zusammenarbeitest: als Partner, Franchise-Partner, Investor oder im Team.",
      cta: "Zusammenarbeiten",
      imageAlt: "PadelCity Team bei einem Event",
    },
    who: {
      eyebrow: "Wer wir sind",
      title: "Gekommen fürs Spiel.",
      accent: "Geblieben für die Community.",
      text: "Was 2022 mit dem ersten Club in Ingolstadt begann, ist heute die größte Padel-Community des Landes. Wir bauen Courts, bringen Menschen zusammen und machen Padel zum Breitensport.",
      cta: "Über uns",
    },
    paths: {
      title: "Arbeite mit",
      accent: "uns.",
      items: [
        { key: "partners", title: "Partner werden", text: "Sponsoring, Events & Corporate Padel mit der größten Community." },
        { key: "franchise", title: "Franchise", text: "Deine Stadt soll eine PadelCity werden? Lass uns reden." },
        { key: "investors", title: "Investieren", text: "Series A closed. Wir skalieren Padel über Deutschland hinaus." },
        { key: "jobs", title: "Jobs", text: "In den Clubs, in der Academy oder in der Zentrale: offene Stellen und Initiativbewerbung." },
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
  },
  en: {
    meta: {
      title: "Company",
      description: "PadelCity as a company: who we are, where we are growing and how to become a partner, franchise partner, investor or part of the team.",
    },
    hero: {
      eyebrow: "Company",
      title: "More than",
      accent: "courts.",
      lead: "Who is behind PadelCity, where we are growing – and how to work with us: as a partner, franchise partner, investor or on the team.",
      cta: "Work with us",
      imageAlt: "PadelCity team at an event",
    },
    who: {
      eyebrow: "Who we are",
      title: "Came for the game.",
      accent: "Stayed for the community.",
      text: "What started in 2022 with our first club in Ingolstadt is now the country's biggest padel community. We build courts, bring people together and make padel a sport for everyone.",
      cta: "About us",
    },
    paths: {
      title: "Work with",
      accent: "us.",
      items: [
        { key: "partners", title: "Partner up", text: "Sponsoring, events & corporate padel with the biggest community." },
        { key: "franchise", title: "Franchise", text: "Want PadelCity in your city? Let's talk." },
        { key: "investors", title: "Invest", text: "Series A closed. We're scaling padel beyond Germany." },
        { key: "jobs", title: "Jobs", text: "In our clubs, the academy or at headquarters: open positions and speculative applications." },
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
  },
  pl: {
    meta: {
      title: "Firma",
      description: "PadelCity jako firma: kim jesteśmy, dokąd rośniemy i jak zostać partnerem, franczyzobiorcą, inwestorem lub częścią zespołu.",
    },
    hero: {
      eyebrow: "Firma",
      title: "Więcej niż",
      accent: "korty.",
      lead: "Kto stoi za PadelCity, dokąd rośniemy – i jak możesz z nami współpracować: jako partner, franczyzobiorca, inwestor albo w zespole.",
      cta: "Współpraca",
      imageAlt: "Zespół PadelCity podczas eventu",
    },
    who: {
      eyebrow: "Kim jesteśmy",
      title: "Przyszli dla gry.",
      accent: "Zostali dla społeczności.",
      text: "To, co zaczęło się w 2022 roku od pierwszego klubu w Ingolstadt, jest dziś największą społecznością padlową w kraju. Budujemy korty, łączymy ludzi i sprawiamy, że padel staje się sportem dla wszystkich.",
      cta: "O nas",
    },
    paths: {
      title: "Współpracuj",
      accent: "z nami.",
      items: [
        { key: "partners", title: "Zostań partnerem", text: "Sponsoring, eventy i padel firmowy z największą społecznością." },
        { key: "franchise", title: "Franczyza", text: "Chcesz, żeby twoje miasto stało się PadelCity? Porozmawiajmy." },
        { key: "investors", title: "Inwestuj", text: "Series A zamknięta. Skalujemy padla poza Niemcy." },
        { key: "jobs", title: "Kariera", text: "W klubach, w akademii lub w centrali: otwarte stanowiska i aplikacje spontaniczne." },
      ],
    },
    momentum: {
      eyebrow: "Momentum 2026",
      title: "Series A.",
      title2: "Next",
      accent: "level.",
      text: "Ze świeżym kapitałem i silnymi partnerami u boku wprowadzamy padla do nowych miast i nowych krajów. Więcej klubów, więcej eventów, więcej społeczności.",
      ir: "Investor Relations",
      jobs: "Dołącz do zespołu",
    },
  },
};
