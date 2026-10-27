import type { Club } from "../types";

/** English overrides for the supplement clubs (mock/supplement.ts). */
const cities: Record<string, string> = { München: "Munich", "Frankfurt am Main": "Frankfurt", Köln: "Cologne", Krakau: "Kraków", Warschau: "Warsaw" };
const names: Record<string, string> = {
  "PadelCity München Langwied": "PadelCity Munich Langwied",
  "PadelCity Köln": "PadelCity Cologne",
  "PadelCity Krakau": "PadelCity Kraków",
  "PadelCity Warschau": "PadelCity Warsaw",
};

/** EN alt texts for the planned-club landmark illustrations (DE: plannedImageAlt in supplement.ts). */
const plannedImageAltEn: Record<string, string> = {
  bamberg: "Illustration: Bamberg's Old Town Hall above the river Regnitz",
  bayreuth: "Illustration: the Festival Theatre on Bayreuth's Green Hill",
  "bielefeld-zentrum": "Illustration: Sparrenburg castle above Bielefeld",
  bocholt: "Illustration: Bocholt's historic town hall",
  chemnitz: "Illustration: the Karl Marx Monument in Chemnitz",
  emsbueren: "Illustration: windmill and village church in the Emsland near Emsbüren",
  "frankfurt-palmengarten": "Illustration: the Palm House at Frankfurt's Palmengarten with the skyline",
  freiburg: "Illustration: Freiburg Minster above the old town",
  hannover: "Illustration: Hanover's New Town Hall on the Maschteich",
  kiel: "Illustration: lighthouse and sailing boats on the Kiel Fjord",
  koeln: "Illustration: Cologne Cathedral and the Hohenzollern Bridge over the Rhine",
  mannheim: "Illustration: Mannheim's Water Tower with fountains",
  "muenchen-langwied": "Illustration: the Olympic Tower and tent roof in Munich's Olympic Park",
  rheine: "Illustration: St Dionysius basilica on the river Ems in Rheine",
  rostock: "Illustration: Rostock's city harbour with a tall ship and cranes",
  stuttgart: "Illustration: Stuttgart's TV Tower above wooded hills",
  waiblingen: "Illustration: the Hochwacht tower and half-timbered houses in Waiblingen",
  kielce: "Illustration: the Bishops' Palace in Kielce",
  krakau: "Illustration: the Cloth Hall and St Mary's Basilica in Kraków",
};

export function toEnglishSupplement(club: Club): Club {
  const city = cities[club.city] ?? club.city;
  const name = names[club.name] ?? club.name;
  // Regions stay German (as for all clubs); CityIndex localizes them for display.
  const base = { ...club, name, city };
  if (club.status === "planned") {
    return {
      ...base,
      teaser: "Opening soon.",
      description: `${name} is in the pipeline. We'll announce the opening date as soon as it's fixed.`,
      address: { ...club.address, localityName: city },
      mainImage: club.mainImage && { ...club.mainImage, alt: plannedImageAltEn[club.slug] ?? club.mainImage.alt },
    };
  }
  if (club.slug === "innsbruck") {
    return {
      ...base,
      teaser: "Our first club in Austria.",
      description:
        "PadelCity Innsbruck: 4 indoor courts (2 doubles, 2 singles), open daily including public holidays from 7 am to 10 pm. Add rental rackets to your booking in the PadelCity app.",
      tags: club.tags.map((t) => (t === "Neu" ? "New" : t)),
    };
  }
  if (club.slug === "warschau") {
    return {
      ...base,
      teaser: "Outdoor padel in the heart of Warsaw.",
      description:
        "PadelCity Warsaw at Westfield Arkadia: 3 outdoor courts (2 doubles, 1 singles), open daily from 8 am to 11 pm. Book in the PadelCity app.",
      tags: club.tags.map((t) => (t === "Neu" ? "New" : t)),
      address: { ...club.address, localityName: city },
    };
  }
  return base;
}
