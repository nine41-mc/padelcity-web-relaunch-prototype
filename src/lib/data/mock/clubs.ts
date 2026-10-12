import type { Club, CourtSummary, Facility } from "../types";

/**
 * Fallback club data (source: "mock"). City list from the PC26 brand book milestones.
 * Addresses, court counts and prices are ILLUSTRATIVE ONLY — the live
 * adapters (Contentful / api-platform) replace them when credentials are configured.
 * Hannover was removed: padelcity.de lists it as "soon" → planned club in mock/supplement.ts.
 */

const F = (type: string, name: string): Facility => ({ type, name });
const facilitySets = {
  full: [
    F("shower", "Duschen"),
    F("locker_room", "Umkleiden"),
    F("parking_space", "Kostenfreie Parkplätze"),
    F("restaurant", "Bistro & Lounge"),
    F("interactive_playwall", "Interaktive Spielwand"),
    F("vending_machine", "Drinks, Snacks & Bälle"),
    F("wifi", "WLAN"),
    F("charging", "E-Ladesäulen"),
  ],
  outdoor: [
    F("wc", "WC"),
    F("parking_space", "Parkplätze"),
    F("vending_machine", "Drinks, Snacks & Bälle"),
    F("bar", "Bar"),
  ],
  base: [
    F("shower", "Duschen"),
    F("locker_room", "Umkleiden"),
    F("parking_space", "Kostenfreie Parkplätze"),
    F("vending_machine", "Drinks, Snacks & Bälle"),
  ],
};

function courts(
  slug: string,
  doubles: number,
  singles: number,
  locationType: "indoor" | "outdoor",
  premium = 0,
): CourtSummary[] {
  const list: CourtSummary[] = [];
  let n = 1;
  for (let i = 0; i < doubles; i++, n++)
    list.push({ id: `${slug}-c${n}`, name: `Court ${n}`, courtType: "double", locationType, isPremium: i < premium });
  for (let i = 0; i < singles; i++, n++)
    list.push({ id: `${slug}-c${n}`, name: `Court ${n}`, courtType: "single", locationType });
  return list;
}

type Seed = {
  slug: string;
  name: string;
  city: string;
  region: string;
  lat: number;
  lng: number;
  doubles: number;
  singles: number;
  loc: "indoor" | "outdoor";
  premium?: number;
  price: number;
  teaser: string;
  tags?: string[];
  franchise?: boolean;
  street?: [string, string, string];
  facilities?: Facility[];
};

const seeds: Seed[] = [
  { slug: "muenchen-tucherpark", name: "PadelCity Tucherpark", city: "München", region: "Bayern", lat: 48.1522, lng: 11.5986, doubles: 6, singles: 3, loc: "outdoor", premium: 1, price: 32, teaser: "Padel unter Bäumen, direkt am Eisbach.", street: ["Am Eisbach", "5", "80538"], facilities: facilitySets.outdoor, tags: ["Outdoor", "Panorama Court"] },
  { slug: "muenchen-frankfurter-ring", name: "PadelCity Frankfurter Ring", city: "München", region: "Bayern", lat: 48.1823, lng: 11.5869, doubles: 10, singles: 2, loc: "indoor", premium: 2, price: 36, teaser: "Münchens Indoor-Flagship mit 12 Courts.", tags: ["Indoor", "Flagship"] },
  { slug: "muenchen", name: "PadelCity München Freimann", city: "München", region: "Bayern", lat: 48.1937, lng: 11.6133, doubles: 6, singles: 1, loc: "indoor", price: 34, teaser: "Der Klassiker im Münchner Norden.", tags: ["Indoor"] },
  { slug: "berlin", name: "PadelCity Berlin", city: "Berlin", region: "Berlin", lat: 52.5011, lng: 13.4180, doubles: 8, singles: 2, loc: "indoor", premium: 1, price: 34, teaser: "Hauptstadt-Padel mit Rooftop-Vibes.", tags: ["Indoor", "Neu"] },
  { slug: "frankfurt", name: "PadelCity Frankfurt", city: "Frankfurt am Main", region: "Hessen", lat: 50.1109, lng: 8.6821, doubles: 8, singles: 2, loc: "indoor", price: 34, teaser: "Zwischen Skyline und Feierabend.", tags: ["Indoor"] },
  { slug: "dortmund", name: "PadelCity Dortmund", city: "Dortmund", region: "Nordrhein-Westfalen", lat: 51.5136, lng: 7.4653, doubles: 8, singles: 1, loc: "indoor", premium: 1, price: 28, teaser: "Home of the PadelCity Open.", tags: ["Indoor", "Deutscher Meister"] },
  { slug: "ingolstadt", name: "PadelCity Ingolstadt", city: "Ingolstadt", region: "Bayern", lat: 48.7665, lng: 11.4258, doubles: 4, singles: 1, loc: "indoor", price: 26, teaser: "Hier hat 2022 alles angefangen.", tags: ["Indoor", "Der Erste"] },
  { slug: "leipzig", name: "PadelCity Leipzig", city: "Leipzig", region: "Sachsen", lat: 51.3397, lng: 12.3731, doubles: 6, singles: 1, loc: "indoor", price: 26, teaser: "Padel-Hotspot im Osten.", tags: ["Indoor"] },
  { slug: "fuerth", name: "PadelCity Fürth", city: "Fürth", region: "Bayern", lat: 49.4771, lng: 10.9887, doubles: 6, singles: 2, loc: "indoor", price: 28, teaser: "Mit eigenem PadelCity Center Court.", tags: ["Indoor", "Center Court"] },
  { slug: "erding", name: "PadelCity Erding", city: "Erding", region: "Bayern", lat: 48.3064, lng: 11.9076, doubles: 4, singles: 1, loc: "indoor", price: 26, teaser: "Vor den Toren Münchens.", tags: ["Indoor"] },
  { slug: "ravensburg", name: "PadelCity Ravensburg", city: "Ravensburg", region: "Baden-Württemberg", lat: 47.7811, lng: 9.6110, doubles: 4, singles: 1, loc: "indoor", price: 26, teaser: "Padel am Bodensee.", tags: ["Indoor"] },
  { slug: "wiesbaden", name: "PadelCity Wiesbaden", city: "Wiesbaden", region: "Hessen", lat: 50.0782, lng: 8.2398, doubles: 5, singles: 1, loc: "indoor", price: 28, teaser: "Kurstadt trifft Court.", tags: ["Indoor"] },
  { slug: "recklinghausen", name: "PadelCity Recklinghausen", city: "Recklinghausen", region: "Nordrhein-Westfalen", lat: 51.6141, lng: 7.1979, doubles: 6, singles: 1, loc: "indoor", price: 26, teaser: "Ruhrpott-Energie auf 7 Courts.", tags: ["Indoor"] },
  { slug: "bielefeld", name: "PadelCity Bielefeld", city: "Bielefeld", region: "Nordrhein-Westfalen", lat: 52.0302, lng: 8.5325, doubles: 6, singles: 1, loc: "indoor", price: 26, teaser: "Gibt's wirklich. Und spielt Padel.", tags: ["Indoor"] },
  { slug: "regensburg", name: "PadelCity Regensburg", city: "Regensburg", region: "Bayern", lat: 49.0134, lng: 12.1016, doubles: 6, singles: 1, loc: "indoor", price: 26, teaser: "Welterbe-Stadt, Weltklasse-Courts.", tags: ["Indoor"] },
  { slug: "erlangen", name: "PadelCity Erlangen", city: "Erlangen", region: "Bayern", lat: 49.5897, lng: 11.0078, doubles: 5, singles: 1, loc: "indoor", price: 26, teaser: "Für Uni, Business und alle dazwischen.", tags: ["Indoor"] },
  { slug: "andernach", name: "PadelCity Andernach", city: "Andernach", region: "Rheinland-Pfalz", lat: 50.4393, lng: 7.4017, doubles: 4, singles: 1, loc: "indoor", price: 24, teaser: "Padel am Rhein.", tags: ["Indoor"] },
  { slug: "lingen", name: "PadelCity Lingen", city: "Lingen", region: "Niedersachsen", lat: 52.5233, lng: 7.3172, doubles: 4, singles: 1, loc: "indoor", price: 24, teaser: "Emsland goes Padel.", tags: ["Indoor"] },
  { slug: "marburg", name: "PadelCity Marburg", city: "Marburg", region: "Hessen", lat: 50.8021, lng: 8.7667, doubles: 4, singles: 0, loc: "indoor", price: 26, teaser: "Unser erster Franchise-Club.", tags: ["Indoor", "Franchise"], franchise: true },
  { slug: "neufahrn", name: "PadelCity Neufahrn", city: "Neufahrn", region: "Bayern", lat: 48.3156, lng: 11.6638, doubles: 4, singles: 1, loc: "outdoor", price: 24, teaser: "Outdoor-Padel nahe Flughafen.", tags: ["Outdoor", "Franchise"], franchise: true, facilities: facilitySets.outdoor },
  { slug: "heilsbronn", name: "PadelCity Heilsbronn", city: "Heilsbronn", region: "Bayern", lat: 49.3386, lng: 10.7908, doubles: 3, singles: 0, loc: "indoor", price: 24, teaser: "Klein, fein, Franken.", tags: ["Indoor", "Franchise"], franchise: true },
  { slug: "leun", name: "PadelCity Leun", city: "Leun", region: "Hessen", lat: 50.5506, lng: 8.3570, doubles: 3, singles: 1, loc: "indoor", price: 24, teaser: "Padel im Lahntal.", tags: ["Indoor", "Franchise"], franchise: true },
];

export const mockClubs: Club[] = seeds.map((s, i) => {
  const [streetName, buildingNumber, postalCode] = s.street ?? ["Musterstraße", String(10 + i), "00000"];
  const image = { url: `/images/clubs/${s.slug}.jpg`, alt: `${s.name} – Courts` };
  return {
    id: s.slug,
    slug: s.slug,
    name: s.name,
    city: s.city,
    region: s.region,
    country: "DE",
    description: `${s.teaser} ${s.doubles + s.singles} ${s.loc === "indoor" ? "Indoor" : "Outdoor"}-Courts, Leihschläger vor Ort und eine Community, die dich mit offenen Armen empfängt. Buche deinen Court in der PadelCity App – in wenigen Klicks.`,
    teaser: s.teaser,
    address: { streetName, buildingNumber, postalCode, localityName: s.city },
    position: { latitude: s.lat, longitude: s.lng },
    courts: courts(s.slug, s.doubles, s.singles, s.loc, s.premium ?? 0),
    facilities: s.facilities ?? (s.doubles >= 8 ? facilitySets.full : facilitySets.base),
    openingHours: [
      { label: "Mo – Fr", open: "07:00", close: "23:00" },
      { label: "Sa – So", open: "08:00", close: "22:00" },
    ],
    defaultPricePerHour: s.price,
    mainImage: image,
    images: [image],
    contact: { name: "Club-Team", emailAddress: "info@padelcity.de" },
    tags: s.tags ?? [],
    isFranchise: s.franchise,
    source: "mock",
  };
});
