import type { Club } from "../types";

/** English overrides for the mock clubs (Contentful delivers localized fields via locale=en). */
const teasers: Record<string, string> = {
  "muenchen-tucherpark": "Padel under the trees, right by the Eisbach.",
  "muenchen-frankfurter-ring": "Indoor padel at Frankfurter Ring.",
  muenchen: "The classic in the north of Munich.",
  berlin: "Capital-city padel.",
  frankfurt: "Between skyline and after-work.",
  dortmund: "Home of the PadelCity Open.",
  ingolstadt: "Where it all began in 2022.",
  leipzig: "Padel hotspot in the east.",
  fuerth: "Padel in Franconia.",
  erding: "Right outside Munich.",
  ravensburg: "Padel by Lake Constance.",
  wiesbaden: "Spa town meets court.",
  recklinghausen: "Ruhr energy on court.",
  bielefeld: "It does exist. And it plays padel.",
  regensburg: "World-heritage city, world-class courts.",
  erlangen: "For uni, business and everyone in between.",
  andernach: "Padel on the Rhine.",
  lingen: "Emsland goes padel.",
  marburg: "Our first franchise club.",
  neufahrn: "Outdoor padel near the airport.",
  heilsbronn: "Small, fine, Franconian.",
  leun: "Padel in the Lahn valley.",
};

const facilities: Record<string, string> = {
  shower: "Showers",
  locker_room: "Changing rooms",
  parking_space: "Free parking",
  restaurant: "Bistro & lounge",
  interactive_playwall: "Interactive play wall",
  vending_machine: "Drinks, snacks & balls",
  wifi: "Wi-Fi",
  charging: "EV charging",
  wc: "Toilets",
  bar: "Bar",
};

const cities: Record<string, string> = { München: "Munich", "Frankfurt am Main": "Frankfurt", Fürth: "Fuerth" };
const tags: Record<string, string> = { Neu: "New", "Der Erste": "The first", "Deutscher Meister": "German champions" };
const days: Record<string, string> = { "Mo – Fr": "Mon – Fri", "Sa – So": "Sat – Sun" };

export function toEnglishMock(club: Club): Club {
  const teaser = teasers[club.slug] ?? club.teaser;
  const n = club.courts.length;
  const loc = club.courts[0]?.locationType === "outdoor" ? "outdoor" : "indoor";
  return {
    ...club,
    city: cities[club.city] ?? club.city,
    teaser,
    description: `${teaser} ${loc} courts, rental rackets on site and a community that welcomes you with open arms. Book your court in the PadelCity app – in just a few taps.`,
    facilities: club.facilities.map((f) => ({ ...f, name: facilities[f.type] ?? f.name })),
    tags: club.tags.map((t) => tags[t] ?? t),
    openingHours: club.openingHours.map((h) => ({ ...h, label: days[h.label] ?? h.label })),
    address: { ...club.address, localityName: cities[club.address.localityName] ?? club.address.localityName },
  };
}
