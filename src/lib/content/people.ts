import type { Locale } from "../i18n/config";

/**
 * REAL people only (names, roles, photos must belong together).
 * Source of truth for founders, team ("Faces of PadelCity") and coaches.
 *
 * Source: padelcity.de, checked 2026-10-12
 *   - Founders + team: https://padelcity.de/padelcity-unser-team/ ("Our Founders", "Our A-Team")
 *   - Coaches (role + club): https://padelcity.de/academy/ ("Meet your coaches")
 *   Every photo was published on padelcity.de in the same block as the name (see public/images/SOURCES.md).
 *   German roles are copied from the site; English and Polish roles are our translation.
 * `team` = A-Team members who are not listed as Academy coaches; `coaches` = the Academy list
 * (several coaches also run a club – see `bio`). No person appears in both lists.
 * Founders are also shown with name captions in the brand book (PC26, p. 11 "Unser Gründerteam") – same
 * people/photos, there only 202 px B/W; those are saved as /images/founders/<slug>-bw.jpg (optional B/W variant).
 * Languages are not published on padelcity.de → `languages` stays undefined.
 * A person without a confirmed photo has `image: undefined` → branded placeholder.
 * Coaches: pages load them via `getCoaches(locale)` (@/lib/data) – Contentful first, this list as fallback.
 *   Stats (hoursOnCourt, students), contact (email, phone) and offers are NOT set here: no confirmed
 *   figures/consent → the UI renders placeholders ("–", "Kontakt über den Club", "Preise & Zeiten folgen").
 * Owner: people agent. Pages import from here – never invent people elsewhere.
 */
export type Person = {
  id: string;
  name: string;
  role: Record<Locale, string>;
  /** Short additional line(s) as published on padelcity.de (e.g. other roles). */
  bio?: Record<Locale, string>;
  image?: string; // /images/... or Contentful URL
  quote?: Record<Locale, string>;
  club?: string; // coaches / club staff: home club(s), as named on padelcity.de
  languages?: string[]; // coaches
  /** Coaches: hours on court / number of students. NO real figures yet → leave undefined (UI shows "–"). Never estimate. */
  hoursOnCourt?: number;
  students?: number;
  /** Coaches: contact data from Contentful (`EmailAddress`, `phoneNumber`). Only with the coach's consent – never invent. */
  email?: string;
  phone?: string;
  /** Coaches: static training offer per club from Contentful `coachTrainingTime` (not booking availability). */
  offers?: CoachOffer[];
  source: "padelcity.de" | "contentful" | "brandbook";
};

/** 1 = Monday … 7 = Sunday (as in api-platform CoachHandler::transformOpeningTimesToList). */
export type Weekday = 1 | 2 | 3 | 4 | 5 | 6 | 7;
/** Weekly training window, local club time "HH:mm" (Contentful `coachTrainingTime.trainingTimes`). */
export type CoachTrainingSlot = { weekday: Weekday; startsAt: string; endsAt: string };
/** One price row (Contentful `coachTrainingTime.trainingPrices[]`): price PER PLAYER in minor units (cents) by group size. */
export type CoachTrainingPrice = { durationMinutes: number; perPlayerCents: Partial<Record<1 | 2 | 3 | 4, number>> };
/** Training offer of one coach at one club. */
export type CoachOffer = { club?: string; times: CoachTrainingSlot[]; prices: CoachTrainingPrice[] };

const same = (s: string): Record<Locale, string> => ({ de: s, en: s, pl: s });

// Contentful module: founders (Our Founders)
export const founders: Person[] = [
  {
    id: "jonathan-sierck",
    name: "Jonathan Sierck",
    role: same("Co-Founder & CEO"),
    bio: {
      de: "CEO PadelCity & PadelCity Entertainment · Serial Entrepreneur & Investor · Buchautor & Podcast-Moderator",
      en: "CEO of PadelCity & PadelCity Entertainment · Serial entrepreneur & investor · Author & podcast host",
      pl: "CEO PadelCity i PadelCity Entertainment · Seryjny przedsiębiorca i inwestor · Autor książek i prowadzący podcast",
    },
    image: "/images/founders/jonathan-sierck.jpg",
    // Quote: brand book PC26, p. 11 "Wie haben wir angefangen" (EN = our translation)
    quote: {
      de: "So geht es tausenden Menschen in der Republik – lass uns die flächendeckende Infrastruktur dafür bauen und Padel zu einem Breitensport machen.",
      en: "Thousands of people across Germany feel the same – so let's build the infrastructure everywhere and make padel a sport for everyone.",
      pl: "Tysiące ludzi w całych Niemczech mają tak samo – zbudujmy więc infrastrukturę w całym kraju i zróbmy z padla sport dla każdego.",
    },
    source: "padelcity.de",
  },
  {
    id: "sebastian-weil",
    name: "Dr. Sebastian Weil",
    role: same("Co-Founder"),
    bio: {
      de: "Serial Entrepreneur & Investor · Medienmanager",
      en: "Serial entrepreneur & investor · Media executive",
      pl: "Seryjny przedsiębiorca i inwestor · Menedżer mediów",
    },
    image: "/images/founders/sebastian-weil.jpg",
    source: "padelcity.de",
  },
  {
    id: "marcus-englert",
    name: "Dr. Marcus Englert",
    role: same("Co-Founder"),
    bio: {
      de: "Vorsitzender des Aufsichtsrates der Rocket Internet AG · Serial Entrepreneur & Investor",
      en: "Chairman of the Supervisory Board of Rocket Internet AG · Serial entrepreneur & investor",
      pl: "Przewodniczący rady nadzorczej Rocket Internet AG · Seryjny przedsiębiorca i inwestor",
    },
    image: "/images/founders/marcus-englert.jpg",
    source: "padelcity.de",
  },
  {
    id: "hansi-flick",
    name: "Hansi Flick",
    role: same("Co-Founder"),
    bio: { de: "Fußballtrainer & Investor", en: "Football coach & investor", pl: "Trener piłkarski i inwestor" },
    image: "/images/founders/hansi-flick.jpg",
    source: "padelcity.de",
  },
];

const t = (slug: string) => `/images/team/${slug}.jpg`;

// Contentful module: team (Our A-Team) – order as on padelcity.de
export const team: Person[] = [
  { id: "markus-balzat", name: "Dr. Markus Balzat", role: { de: "CPO & Geschäftsführer", en: "CPO & Managing Director", pl: "CPO i dyrektor zarządzający" }, image: t("markus-balzat"), source: "padelcity.de" },
  { id: "timo-gieb", name: "Timo Gieb", role: { de: "CFO & Geschäftsführer", en: "CFO & Managing Director", pl: "CFO i dyrektor zarządzający" }, image: t("timo-gieb"), source: "padelcity.de" },
  { id: "daniel-maus", name: "Daniel Maus", role: same("Head of Finance"), image: t("daniel-maus"), source: "padelcity.de" },
  { id: "astrid-nindl", name: "Astrid Nindl", role: same("Head of People & Culture"), bio: same("Founders Associate"), image: t("astrid-nindl"), source: "padelcity.de" },
  { id: "esther-de-moll", name: "Esther de Moll", role: same("Head of Operations"), image: t("esther-de-moll"), source: "padelcity.de" },
  { id: "valentin-finkenzeller", name: "Valentin Finkenzeller", role: same("Head of Brand & Onsite Experience"), image: t("valentin-finkenzeller"), source: "padelcity.de" },
  { id: "martin-muehlen", name: "Martin Mühlen", role: same("Head of Venue Planning"), image: t("martin-muehlen"), source: "padelcity.de" },
  { id: "daniel-sierck", name: "Daniel Sierck", role: same("Sales Manager"), image: t("daniel-sierck"), source: "padelcity.de" },
  { id: "steffen-wohlfarth", name: "Steffen Wohlfarth", role: { de: "Regionalmanager Westfalen/Hessen", en: "Regional Manager Westphalia/Hesse", pl: "Menedżer regionalny Westfalia/Hesja" }, image: t("steffen-wohlfarth"), source: "padelcity.de" },
  { id: "sarah-vastola", name: "Sarah Vastola", role: { de: "Accountant Managerin", en: "Accounting Manager", pl: "Menedżerka ds. księgowości" }, image: t("sarah-vastola"), source: "padelcity.de" },
  { id: "maximilian-weiss", name: "Maximilian Weiss", role: same("Junior Sales Manager"), image: t("maximilian-weiss"), source: "padelcity.de" },
  { id: "ari-kryeziu", name: "Ari Kryeziu", role: { de: "Anlagenmitarbeiter", en: "Club Staff", pl: "Pracownik klubu" }, club: "Ingolstadt", image: t("ari-kryeziu"), source: "padelcity.de" },
  { id: "kosta", name: "Kosta", role: same("Facility Manager"), image: t("kosta"), source: "padelcity.de" },
  { id: "sebastian-hirschbeck", name: "Sebastian Hirschbeck", role: { de: "Senior Eventmanager", en: "Senior Event Manager", pl: "Senior Event Manager" }, image: t("sebastian-hirschbeck"), source: "padelcity.de" },
  { id: "tom-richter", name: "Tom Richter", role: { de: "Anlagenleiter", en: "Club Manager", pl: "Kierownik klubu" }, club: "Regensburg", image: t("tom-richter"), source: "padelcity.de" },
  { id: "elma-mesic", name: "Elma Mesic", role: { de: "Accountant Managerin", en: "Accounting Manager", pl: "Menedżerka ds. księgowości" }, image: t("elma-mesic"), source: "padelcity.de" },
  { id: "zoe-de-moll", name: "Zoe de Moll", role: { de: "Operations Managerin", en: "Operations Manager", pl: "Operations Manager" }, image: t("zoe-de-moll"), source: "padelcity.de" },
  { id: "tobias-everding", name: "Tobias Everding", role: { de: "Anlagenleiter", en: "Club Manager", pl: "Kierownik klubu" }, club: "Lingen", image: t("tobias-everding"), source: "padelcity.de" },
  { id: "victoria-voigt", name: "Victoria Voigt", role: { de: "Anlagenleiterin", en: "Club Manager", pl: "Kierowniczka klubu" }, club: "Berlin", image: t("victoria-voigt"), source: "padelcity.de" },
  { id: "elias-koppold", name: "Elias Koppold", role: { de: "Junior Eventmanager", en: "Junior Event Manager", pl: "Junior Event Manager" }, image: t("elias-koppold"), source: "padelcity.de" },
  { id: "felix-schmid", name: "Felix Schmid", role: same("Junior Key Account Manager"), image: t("felix-schmid"), source: "padelcity.de" },
  { id: "john-felix-reiniger", name: "John Felix Reiniger", role: { de: "Anlagenleiter", en: "Club Manager", pl: "Kierownik klubu" }, club: "Leipzig", image: t("john-felix-reiniger"), source: "padelcity.de" },
  { id: "kristina-herlt", name: "Kristina Herlt", role: { de: "Club Managerin & Event Managerin", en: "Club Manager & Event Manager", pl: "Club Manager i Event Manager" }, club: "Erding & Ingolstadt", image: t("kristina-herlt"), source: "padelcity.de" },
  { id: "anna-schmied", name: "Anna Schmied", role: { de: "Designerin", en: "Designer", pl: "Projektantka" }, image: t("anna-schmied"), source: "padelcity.de" },
  { id: "philipp-hermenau", name: "Philipp Hermenau", role: same("Co-Club Manager"), club: "Fürth", image: t("philipp-hermenau"), source: "padelcity.de" },
  { id: "stefano-de-benedetta", name: "Stefano De Benedetta", role: same("Senior Key Account & Business Development Manager"), image: t("stefano-de-benedetta"), source: "padelcity.de" },
  { id: "tim-meyer-ricks", name: "Tim Meyer-Ricks", role: same("Creative Director"), image: t("tim-meyer-ricks"), source: "padelcity.de" },
];

const c = (slug: string) => `/images/academy/real-coaches/${slug}.jpg`;
const headCoach = same("Head Coach");
const coach = same("Coach");

// Contentful module: coaches (Academy "Meet your coaches") – order as on padelcity.de/academy
export const coaches: Person[] = [
  { id: "daniel-lingen", name: "Daniel Lingen", role: headCoach, club: "Dortmund", bio: { de: "Sport- und Regionalmanager", en: "Sports & Regional Manager", pl: "Menedżer sportowy i regionalny" }, image: c("daniel-lingen"), source: "padelcity.de" },
  { id: "harry-payrleitner", name: "Harry Payrleitner", role: headCoach, club: "Fürth & Erlangen", bio: { de: "Anlagenleiter Fürth", en: "Club Manager, Fürth", pl: "Kierownik klubu, Fürth" }, image: c("harry-payrleitner"), source: "padelcity.de" },
  { id: "alvaro-bastarreche", name: "Álvaro Bastarreche", role: headCoach, club: "Leipzig", bio: { de: "Sportlicher Leiter Leipzig", en: "Head of Sport, Leipzig", pl: "Kierownik sportowy, Lipsk" }, image: c("alvaro-bastarreche"), source: "padelcity.de" },
  { id: "markus-erdmann", name: "Markus Erdmann", role: headCoach, club: "Frankfurt & Wiesbaden", bio: { de: "Anlagenleiter Wiesbaden", en: "Club Manager, Wiesbaden", pl: "Kierownik klubu, Wiesbaden" }, image: c("markus-erdmann"), source: "padelcity.de" },
  { id: "fabian-scheckenbach", name: "Fabian Scheckenbach", role: headCoach, club: "Regensburg", bio: { de: "Sportlicher Leiter Regensburg", en: "Head of Sport, Regensburg", pl: "Kierownik sportowy, Ratyzbona" }, image: c("fabian-scheckenbach"), source: "padelcity.de" },
  { id: "noah-kerner", name: "Noah Kerner", role: headCoach, club: "München", bio: { de: "Junior Club Manager München", en: "Junior Club Manager, Munich", pl: "Junior Club Manager, Monachium" }, image: c("noah-kerner"), source: "padelcity.de" },
  { id: "kai-knaus", name: "Kai Knaus", role: coach, club: "Ravensburg", image: c("kai-knaus"), source: "padelcity.de" },
  { id: "theo-patrikalakis", name: "Theo Patrikalakis", role: coach, club: "Dortmund", image: c("theo-patrikalakis"), source: "padelcity.de" },
  { id: "julia-van-den-berg", name: "Julia van den Berg", role: coach, club: "Recklinghausen", bio: { de: "Anlagenleiterin Recklinghausen", en: "Club Manager, Recklinghausen", pl: "Kierowniczka klubu, Recklinghausen" }, image: c("julia-van-den-berg"), source: "padelcity.de" },
  { id: "joerg-silberbach", name: "Jörg Silberbach „Fisch“", role: coach, club: "Dortmund", image: c("joerg-silberbach"), source: "padelcity.de" },
  { id: "julien-marx", name: "Julien Marx", role: coach, club: "Dortmund", image: c("julien-marx"), source: "padelcity.de" },
  { id: "lasse-stenner", name: "Lasse Stenner", role: coach, club: "Bielefeld", image: c("lasse-stenner"), source: "padelcity.de" },
  { id: "benedikt-dahlen", name: "Benedikt Dahlen", role: coach, club: "Dortmund", image: c("benedikt-dahlen"), source: "padelcity.de" },
  { id: "mike-meyer", name: "Mike Meyer", role: coach, club: "Erlangen", bio: { de: "Sportlicher Leiter Erlangen", en: "Head of Sport, Erlangen", pl: "Kierownik sportowy, Erlangen" }, image: c("mike-meyer"), source: "padelcity.de" },
  { id: "bijan-wardjawand", name: "Bijan Wardjawand", role: coach, club: "Andernach", bio: { de: "Anlagenleiter Andernach/Mülheim-Kärlich", en: "Club Manager, Andernach/Mülheim-Kärlich", pl: "Kierownik klubu, Andernach/Mülheim-Kärlich" }, image: c("bijan-wardjawand"), source: "padelcity.de" },
  { id: "florian-boldt", name: "Florian Boldt", role: coach, club: "Hannover", bio: { de: "Anlagenleiter Hannover", en: "Club Manager, Hanover", pl: "Kierownik klubu, Hanower" }, image: c("florian-boldt"), source: "padelcity.de" },
  { id: "christian-rohling", name: "Christian Rohling", role: coach, club: "Lingen", image: c("christian-rohling"), source: "padelcity.de" },
  { id: "alfredo-estigarribia", name: "Alfredo Estigarribia", role: coach, club: "Lingen", bio: { de: "Co-Anlagenleiter Lingen", en: "Co-Club Manager, Lingen", pl: "Współkierownik klubu, Lingen" }, image: c("alfredo-estigarribia"), source: "padelcity.de" },
  { id: "heiko-olbrisch", name: "Heiko Olbrisch", role: coach, club: "Dortmund", image: c("heiko-olbrisch"), source: "padelcity.de" },
];

/** Coaches whose `club` names the given city/club (case-insensitive substring match, e.g. "Dortmund"). */
export function coachesForClub(clubName: string): Person[] {
  const needle = clubName.toLowerCase();
  return coaches.filter((p) => p.club?.toLowerCase().includes(needle));
}
