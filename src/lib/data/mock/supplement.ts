import type { Club, ClubCountry, ImageAsset } from "../types";

/**
 * Supplement to Contentful / base mock (source: "mock").
 * Source of truth: padelcity.de/locations (DE) + /en/locations, checked 2026-10-12.
 *
 * (a) OPEN clubs that are live on padelcity.de but missing in Contentful (Innsbruck), or missing in the
 *     base mock used without Contentful credentials (Warschau – Contentful has it and wins).
 *     Only facts stated on padelcity.de (or padelcity.pl, which padelcity.de links for Warschau) are
 *     filled in; everything else stays neutral/empty.
 * (b) PLANNED clubs – tiles labelled "– soon –" on padelcity.de. No opening date is published for
 *     any of them, so `openingDate` stays empty. No courts, prices or ratings; the card image is a city landmark illustration (not the venue).
 *     Coordinates are CITY CENTRES (well-known city coordinates), not venue addresses.
 *
 * Merged in src/lib/data/index.ts; Contentful (or the base mock) wins on slug/name collisions.
 */

const NO_ADDRESS = (city: string): Club["address"] => ({ streetName: "", buildingNumber: "", postalCode: "", localityName: city });

/** (a) Live on padelcity.de, not (yet) in Contentful. */
const innsbruck: Club = {
  id: "innsbruck",
  slug: "innsbruck",
  name: "PadelCity Innsbruck",
  city: "Innsbruck",
  region: "Tirol",
  country: "AT",
  status: "open",
  // padelcity.de/innsbruck: 4 courts = 2 indoor double + 2 indoor single, Mon–Sun & holidays 07:00–22:00,
  // 60 min from 34 € (double) / 22 € (single). Address: Stadlweg 40, 6020 Innsbruck.
  teaser: "Unser erster Club in Österreich.",
  description:
    "PadelCity Innsbruck: 4 Indoor-Courts (2 Doppel, 2 Einzel), täglich und an Feiertagen von 7 bis 22 Uhr geöffnet. Leihschläger buchst du in der PadelCity App einfach dazu.",
  address: { streetName: "Stadlweg", buildingNumber: "40", postalCode: "6020", localityName: "Innsbruck" },
  // City centre of Innsbruck – exact venue coordinates not published; replace once the club is in Contentful.
  position: { latitude: 47.2692, longitude: 11.4041 },
  courts: [
    { id: "innsbruck-c1", name: "Court 1", courtType: "double", locationType: "indoor" },
    { id: "innsbruck-c2", name: "Court 2", courtType: "double", locationType: "indoor" },
    { id: "innsbruck-c3", name: "Court 3", courtType: "single", locationType: "indoor" },
    { id: "innsbruck-c4", name: "Court 4", courtType: "single", locationType: "indoor" },
  ],
  facilities: [],
  openingHours: [{ label: "Mo – So", open: "07:00", close: "22:00" }, { label: "Feiertage", open: "07:00", close: "22:00" }],
  defaultPricePerHour: 34, // double court, Mon–Fri until 16:00 (padelcity.de)
  images: [],
  tags: ["Indoor", "Neu"],
  source: "mock",
};

/** Fallback only: Contentful delivers "PadelCity Warschau" and wins (same slug). Facts: padelcity.pl. */
const warschau: Club = {
  id: "warschau",
  slug: "warschau",
  name: "PadelCity Warschau",
  city: "Warschau",
  region: "Masowien",
  country: "PL",
  status: "open",
  // padelcity.pl: "Warsaw – Arkadia", al. Jana Pawła II 82, outdoor, 3 courts (2 double, 1 single), daily 8:00–23:00.
  teaser: "Outdoor-Padel mitten in Warschau.",
  description:
    "PadelCity Warschau an der Westfield Arkadia: 3 Outdoor-Courts (2 Doppel, 1 Einzel), täglich von 8 bis 23 Uhr geöffnet. Gebucht wird in der PadelCity App.",
  address: { streetName: "al. Jana Pawła II", buildingNumber: "82", postalCode: "", localityName: "Warschau" },
  // Approximate position of Westfield Arkadia (al. Jana Pawła II 82) – not from Contentful.
  position: { latitude: 52.2569, longitude: 20.9845 },
  courts: [
    { id: "warschau-c1", name: "Court 1", courtType: "double", locationType: "outdoor" },
    { id: "warschau-c2", name: "Court 2", courtType: "double", locationType: "outdoor" },
    { id: "warschau-c3", name: "Court 3", courtType: "single", locationType: "outdoor" },
  ],
  facilities: [],
  openingHours: [{ label: "Mo – So", open: "08:00", close: "23:00" }],
  images: [],
  tags: ["Outdoor", "Neu"],
  source: "mock",
};

type PlannedSeed = { slug: string; name: string; city: string; region: string; country: ClubCountry; lat: number; lng: number };

/** (b) "– soon –" on padelcity.de/locations. Coordinates = city centres. */
const plannedSeeds: PlannedSeed[] = [
  { slug: "bamberg", name: "PadelCity Bamberg", city: "Bamberg", region: "Bayern", country: "DE", lat: 49.8988, lng: 10.9028 },
  { slug: "bayreuth", name: "PadelCity Bayreuth", city: "Bayreuth", region: "Bayern", country: "DE", lat: 49.9456, lng: 11.5713 },
  { slug: "bielefeld-zentrum", name: "PadelCity Bielefeld Zentrum", city: "Bielefeld", region: "Nordrhein-Westfalen", country: "DE", lat: 52.0302, lng: 8.5325 },
  { slug: "bocholt", name: "PadelCity Bocholt", city: "Bocholt", region: "Nordrhein-Westfalen", country: "DE", lat: 51.8389, lng: 6.6156 },
  { slug: "chemnitz", name: "PadelCity Chemnitz", city: "Chemnitz", region: "Sachsen", country: "DE", lat: 50.8278, lng: 12.9214 },
  { slug: "emsbueren", name: "PadelCity Emsbüren", city: "Emsbüren", region: "Niedersachsen", country: "DE", lat: 52.3925, lng: 7.2925 },
  { slug: "frankfurt-palmengarten", name: "PadelCity Frankfurt Palmengarten", city: "Frankfurt am Main", region: "Hessen", country: "DE", lat: 50.1109, lng: 8.6821 },
  { slug: "freiburg", name: "PadelCity Freiburg", city: "Freiburg", region: "Baden-Württemberg", country: "DE", lat: 47.999, lng: 7.8421 },
  { slug: "hannover", name: "PadelCity Hannover", city: "Hannover", region: "Niedersachsen", country: "DE", lat: 52.3759, lng: 9.732 },
  { slug: "kiel", name: "PadelCity Kiel", city: "Kiel", region: "Schleswig-Holstein", country: "DE", lat: 54.3233, lng: 10.1228 },
  { slug: "koeln", name: "PadelCity Köln", city: "Köln", region: "Nordrhein-Westfalen", country: "DE", lat: 50.9375, lng: 6.9603 },
  { slug: "mannheim", name: "PadelCity Mannheim", city: "Mannheim", region: "Baden-Württemberg", country: "DE", lat: 49.4875, lng: 8.466 },
  { slug: "muenchen-langwied", name: "PadelCity München Langwied", city: "München", region: "Bayern", country: "DE", lat: 48.1351, lng: 11.582 },
  { slug: "rheine", name: "PadelCity Rheine", city: "Rheine", region: "Nordrhein-Westfalen", country: "DE", lat: 52.2756, lng: 7.4383 },
  { slug: "rostock", name: "PadelCity Rostock", city: "Rostock", region: "Mecklenburg-Vorpommern", country: "DE", lat: 54.0924, lng: 12.0991 },
  { slug: "stuttgart", name: "PadelCity Stuttgart", city: "Stuttgart", region: "Baden-Württemberg", country: "DE", lat: 48.7758, lng: 9.1829 },
  { slug: "waiblingen", name: "PadelCity Waiblingen", city: "Waiblingen", region: "Baden-Württemberg", country: "DE", lat: 48.8303, lng: 9.3169 },
  { slug: "kielce", name: "PadelCity Kielce", city: "Kielce", region: "Heiligkreuz", country: "PL", lat: 50.8661, lng: 20.6286 },
  { slug: "krakau", name: "PadelCity Krakau", city: "Krakau", region: "Kleinpolen", country: "PL", lat: 50.0647, lng: 19.945 },
];

/**
 * Card visuals for planned clubs: one landmark illustration per city (PadelCity series: ink bg,
 * purple→magenta glow, white line work, Optic Yellow padel ball). Files: public/images/cities/v2/<slug>.jpg (v2 = ball recoloured to Optic Yellow),
 * provenance in public/images/SOURCES.md. Alt texts DE here, EN in supplement-en.ts.
 */
export const plannedImageAlt: Record<string, string> = {
  bamberg: "Illustration: Altes Rathaus in Bamberg über der Regnitz",
  bayreuth: "Illustration: Festspielhaus auf dem Grünen Hügel in Bayreuth",
  "bielefeld-zentrum": "Illustration: Sparrenburg über Bielefeld",
  bocholt: "Illustration: Historisches Rathaus in Bocholt",
  chemnitz: "Illustration: Karl-Marx-Monument in Chemnitz",
  emsbueren: "Illustration: Windmühle und Dorfkirche im Emsland bei Emsbüren",
  "frankfurt-palmengarten": "Illustration: Palmenhaus im Frankfurter Palmengarten mit Skyline",
  freiburg: "Illustration: Freiburger Münster über der Altstadt",
  hannover: "Illustration: Neues Rathaus in Hannover am Maschteich",
  kiel: "Illustration: Leuchtturm und Segelboote auf der Kieler Förde",
  koeln: "Illustration: Kölner Dom und Hohenzollernbrücke am Rhein",
  mannheim: "Illustration: Wasserturm in Mannheim mit Brunnen",
  "muenchen-langwied": "Illustration: Olympiaturm und Zeltdach im Münchner Olympiapark",
  rheine: "Illustration: Basilika St. Dionysius an der Ems in Rheine",
  rostock: "Illustration: Stadthafen Rostock mit Großsegler und Kränen",
  stuttgart: "Illustration: Fernsehturm Stuttgart über bewaldeten Hängen",
  waiblingen: "Illustration: Hochwachtturm und Fachwerkhäuser in Waiblingen",
  kielce: "Illustration: Bischofspalast in Kielce",
  krakau: "Illustration: Tuchhallen und Marienkirche in Krakau",
};

// TODO(content): placeholder opening months for the prototype (Nov / Dec / Jan in turn) – replace with real dates.
const PLACEHOLDER_OPENING = ["2026-11", "2026-12", "2027-01"];

const plannedClubs: Club[] = plannedSeeds.map((s, i) => ({
  id: `planned-${s.slug}`,
  slug: s.slug,
  name: s.name,
  city: s.city,
  region: s.region,
  country: s.country,
  status: "planned",
  openingDate: PLACEHOLDER_OPENING[i % PLACEHOLDER_OPENING.length],
  teaser: "Bald eröffnet.",
  description: `${s.name} ist in Planung. Den Eröffnungstermin geben wir bekannt, sobald er feststeht.`,
  address: NO_ADDRESS(s.city),
  position: { latitude: s.lat, longitude: s.lng },
  courts: [],
  facilities: [],
  openingHours: [],
  mainImage: { url: `/images/cities/v2/${s.slug}.jpg`, alt: plannedImageAlt[s.slug] ?? s.name, width: 1600, height: 1000 },
  images: [] as ImageAsset[],
  tags: [],
  source: "mock",
}));

export const supplementClubs: Club[] = [innsbruck, warschau, ...plannedClubs];
