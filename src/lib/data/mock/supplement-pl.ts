import type { Club } from "../types";

/** Polish overrides for the supplement clubs (mock/supplement.ts). */
const cities: Record<string, string> = {
  München: "Monachium",
  "Frankfurt am Main": "Frankfurt nad Menem",
  Köln: "Kolonia",
  Hannover: "Hanower",
  Freiburg: "Fryburg",
  Krakau: "Kraków",
  Warschau: "Warszawa",
};
/** Club names stay official; only the Polish clubs carry their Polish city name. */
const names: Record<string, string> = {
  "PadelCity Krakau": "PadelCity Kraków",
  "PadelCity Warschau": "PadelCity Warszawa",
};

/** PL alt texts for the planned-club landmark illustrations (DE: plannedImageAlt in supplement.ts). */
const plannedImageAltPl: Record<string, string> = {
  bamberg: "Ilustracja: Stary Ratusz w Bambergu nad rzeką Regnitz",
  bayreuth: "Ilustracja: Teatr Festiwalowy na Zielonym Wzgórzu w Bayreuth",
  "bielefeld-zentrum": "Ilustracja: zamek Sparrenburg nad Bielefeld",
  bocholt: "Ilustracja: zabytkowy ratusz w Bocholt",
  chemnitz: "Ilustracja: pomnik Karola Marksa w Chemnitz",
  emsbueren: "Ilustracja: wiatrak i wiejski kościół w Emslandzie koło Emsbüren",
  "frankfurt-palmengarten": "Ilustracja: Palmiarnia we frankfurckim Palmengarten na tle skyline'u",
  freiburg: "Ilustracja: katedra we Fryburgu nad starym miastem",
  hannover: "Ilustracja: Nowy Ratusz w Hanowerze nad stawem Maschteich",
  kiel: "Ilustracja: latarnia morska i żaglówki w zatoce Kilońskiej",
  koeln: "Ilustracja: katedra w Kolonii i most Hohenzollernów na Renie",
  mannheim: "Ilustracja: wieża ciśnień w Mannheim z fontannami",
  "muenchen-langwied": "Ilustracja: wieża olimpijska i dach namiotowy w Parku Olimpijskim w Monachium",
  rheine: "Ilustracja: bazylika św. Dionizego nad rzeką Ems w Rheine",
  rostock: "Ilustracja: port miejski w Rostocku z żaglowcem i dźwigami",
  stuttgart: "Ilustracja: wieża telewizyjna w Stuttgarcie nad zalesionymi zboczami",
  waiblingen: "Ilustracja: wieża Hochwacht i domy szachulcowe w Waiblingen",
  kielce: "Ilustracja: Pałac Biskupów Krakowskich w Kielcach",
  krakau: "Ilustracja: Sukiennice i Bazylika Mariacka w Krakowie",
};

export function toPolishSupplement(club: Club): Club {
  const city = cities[club.city] ?? club.city;
  const name = names[club.name] ?? club.name;
  // Regions stay German (as for all clubs); regionLabel() localizes them for display.
  const base = { ...club, name, city };
  if (club.status === "planned") {
    return {
      ...base,
      teaser: "Wkrótce otwarcie.",
      description: `${name} jest w przygotowaniu. Termin otwarcia ogłosimy, gdy tylko zostanie ustalony.`,
      address: { ...club.address, localityName: city },
      mainImage: club.mainImage && { ...club.mainImage, alt: plannedImageAltPl[club.slug] ?? club.mainImage.alt },
    };
  }
  if (club.slug === "innsbruck") {
    return {
      ...base,
      teaser: "Nasz pierwszy klub w Austrii.",
      description:
        "PadelCity Innsbruck: 4 korty kryte (2 podwójne, 2 pojedyncze), otwarte codziennie, także w święta, od 7:00 do 22:00. Rakiety do wypożyczenia dodasz po prostu do rezerwacji w aplikacji PadelCity.",
      tags: club.tags.map((t) => (t === "Neu" ? "Nowość" : t)),
      openingHours: club.openingHours.map((h) => ({ ...h, label: h.label === "Mo – So" ? "pon. – niedz." : h.label })),
    };
  }
  if (club.slug === "warschau") {
    return {
      ...base,
      teaser: "Padel na świeżym powietrzu w samym sercu Warszawy.",
      description:
        "PadelCity Warszawa przy Westfield Arkadia: 3 korty odkryte (2 podwójne, 1 pojedynczy), otwarte codziennie od 8:00 do 23:00. Rezerwacja w aplikacji PadelCity.",
      tags: club.tags.map((t) => (t === "Neu" ? "Nowość" : t)),
      openingHours: club.openingHours.map((h) => ({ ...h, label: h.label === "Mo – So" ? "pon. – niedz." : h.label })),
      address: { ...club.address, localityName: city },
    };
  }
  return base;
}
