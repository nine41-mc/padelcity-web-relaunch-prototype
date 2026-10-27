import type { Club } from "../types";

/** Polish overrides for the mock clubs (Contentful delivers localized fields via locale=pl). */
const teasers: Record<string, string> = {
  "muenchen-tucherpark": "Padel pod drzewami, tuż nad Eisbach.",
  "muenchen-frankfurter-ring": "Padel pod dachem przy Frankfurter Ring.",
  muenchen: "Klasyk na północy Monachium.",
  berlin: "Padel w stolicy.",
  frankfurt: "Między skyline'em a fajrantem.",
  dortmund: "Home of the PadelCity Open.",
  ingolstadt: "Tu wszystko zaczęło się w 2022 roku.",
  leipzig: "Padelowy hotspot na wschodzie.",
  fuerth: "Padel we Frankonii.",
  erding: "Tuż pod Monachium.",
  ravensburg: "Padel nad Jeziorem Bodeńskim.",
  wiesbaden: "Uzdrowisko spotyka kort.",
  recklinghausen: "Energia Zagłębia Ruhry na korcie.",
  bielefeld: "Naprawdę istnieje. I gra w padla.",
  regensburg: "Miasto z listy UNESCO, korty światowej klasy.",
  erlangen: "Dla uczelni, biznesu i wszystkich pomiędzy.",
  andernach: "Padel nad Renem.",
  lingen: "Emsland goes Padel.",
  marburg: "Nasz pierwszy klub franczyzowy.",
  neufahrn: "Padel na świeżym powietrzu niedaleko lotniska.",
  heilsbronn: "Mały, ale wyjątkowy – po frankońsku.",
  leun: "Padel w dolinie Lahn.",
};

const facilities: Record<string, string> = {
  shower: "Prysznice",
  locker_room: "Szatnie",
  parking_space: "Bezpłatny parking",
  restaurant: "Bistro i lounge",
  interactive_playwall: "Interaktywna ściana do gry",
  vending_machine: "Napoje, przekąski i piłki",
  wifi: "Wi-Fi",
  charging: "Ładowarki do aut elektrycznych",
  wc: "Toalety",
  bar: "Bar",
};

const cities: Record<string, string> = { München: "Monachium", "Frankfurt am Main": "Frankfurt nad Menem", Leipzig: "Lipsk" };
const tags: Record<string, string> = { Neu: "Nowość", "Der Erste": "Pierwszy", "Deutscher Meister": "Mistrz Niemiec", Franchise: "Franczyza" };
const days: Record<string, string> = { "Mo – Fr": "pon. – pt.", "Sa & So": "sob. – niedz." };

export function toPolishMock(club: Club): Club {
  const teaser = teasers[club.slug] ?? club.teaser;
  const loc = club.courts[0]?.locationType === "outdoor" ? "Korty odkryte" : "Korty kryte";
  return {
    ...club,
    city: cities[club.city] ?? club.city,
    teaser,
    description: `${teaser} ${loc}, rakiety do wypożyczenia na miejscu i społeczność, która przyjmie cię z otwartymi ramionami. Zarezerwuj kort w aplikacji PadelCity – w kilka kliknięć.`,
    facilities: club.facilities.map((f) => ({ ...f, name: facilities[f.type] ?? f.name })),
    tags: club.tags.map((t) => tags[t] ?? t),
    openingHours: club.openingHours.map((h) => ({ ...h, label: days[h.label] ?? h.label })),
    address: { ...club.address, localityName: cities[club.address.localityName] ?? club.address.localityName },
  };
}
