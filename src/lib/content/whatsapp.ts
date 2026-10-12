/**
 * Club WhatsApp community links, by city.
 * Source: padelcity.de start page, section "You'll never play alone" (fetched 13.10.2026).
 * Proposal: move to a Contentful field on the club (whatsappGroupUrl) – a Contentful value always wins.
 * Notes: Andernach & Mülheim-Kärlich share one group; München is a WhatsApp channel (both Munich clubs).
 */
export const whatsappByCity: Record<string, string> = {
  Andernach: "https://chat.whatsapp.com/Hrc8Zza4b6EKqw1I13M3xP",
  Berlin: "https://chat.whatsapp.com/IojHLOIEIvGIypVuICXJhK",
  Bielefeld: "https://chat.whatsapp.com/KNPmrncVh077uQi5w5bHwY",
  Cadolzburg: "https://chat.whatsapp.com/F9uzVAKlfc625JYsySz2Wg",
  Dortmund: "https://chat.whatsapp.com/GPlzIOo4zq74Vg9jRmK9AJ",
  Düsseldorf: "https://chat.whatsapp.com/KlA0mhYMHIq0KSHjie14Gj",
  Erlangen: "https://chat.whatsapp.com/KO7CkeAgVzxLZh0tPnnMmR",
  Erding: "https://chat.whatsapp.com/ClmO62KycIG8FHlZkDzHkV",
  Frankfurt: "https://chat.whatsapp.com/ILnZefjFusk7VVoOWaSdTR",
  Fürth: "https://chat.whatsapp.com/I7c2MNz185JHkewsS9fcCb",
  Gelsenkirchen: "https://chat.whatsapp.com/L7wQwBMxw6w0go041lBtwy",
  Heilsbronn: "https://chat.whatsapp.com/KwMnpNs3LdBA6Ootihvzuj",
  Ingolstadt: "https://chat.whatsapp.com/IVeKpoPcxxgAYg6hMpI7It",
  Innsbruck: "https://chat.whatsapp.com/JqwwSdCCHCM0p3YDV5U72q",
  Jena: "https://chat.whatsapp.com/IR6pE3RaQsXBEHXdLPQj4v",
  Karlsruhe: "https://chat.whatsapp.com/FsRlAy6RXqWCPnfV8XKvSY",
  Leipzig: "https://chat.whatsapp.com/COeB3gwECoO4XxqW7iM3ih",
  Lingen: "https://chat.whatsapp.com/HQnn0PO4fCyEydPMp0H57h",
  Marburg: "https://chat.whatsapp.com/G2x8IdMLGSA4osdUj3d8S4",
  "Mülheim-Kärlich": "https://chat.whatsapp.com/Hrc8Zza4b6EKqw1I13M3xP",
  München: "https://whatsapp.com/channel/0029Vb7lsXn2Jl890YRhEB3c",
  Neufahrn: "https://chat.whatsapp.com/HzKjHROwRWdAa8GwJVerEp",
  "Neu-Ulm": "https://chat.whatsapp.com/JT0hE0NZSKXIGzWrSCemFl",
  Radolfzell: "https://chat.whatsapp.com/GsfbHKYFlf4Fzq2CYXfiJX",
  Ravensburg: "https://chat.whatsapp.com/FPFUjj4hgV9IHbZSSbJIER",
  Recklinghausen: "https://chat.whatsapp.com/CPIQsmvrvZbIAA6E0dwLNv",
  Reutlingen: "https://chat.whatsapp.com/DwcsZZDHlJt3BU2QXNJzBc",
  Regensburg: "https://chat.whatsapp.com/BB3zOO371hdGbilpVXhNGc",
  Rothenburg: "https://chat.whatsapp.com/Gube3TsSJxXHCtm9x7ijuy",
  Schwabach: "https://chat.whatsapp.com/Lgk2sLPs7VuDiENM0uJ3Ek",
  Wetzlar: "https://chat.whatsapp.com/DCG2yixaC4xLYfQcVdJxSg",
  Wiesbaden: "https://chat.whatsapp.com/D2S0d7DHKYC55sZGwqk4hb",
};

const norm = (s: string) =>
  s.toLocaleLowerCase("de").replace(/ä/g, "ae").replace(/ö/g, "oe").replace(/ü/g, "ue").replace(/ß/g, "ss").replace(/[^a-z]/g, "");

const lookup = new Map(Object.entries(whatsappByCity).map(([city, url]) => [norm(city), url]));
// English city names used in the EN mock overrides
lookup.set(norm("Munich"), whatsappByCity["München"]);
lookup.set(norm("Fuerth"), whatsappByCity["Fürth"]);

/** WhatsApp link for a club, matched on its city or the city part of its name ("PadelCity Bielefeld Dornberg"). */
export function whatsappForClub(club: { city: string; name: string }): string | undefined {
  const byCity = lookup.get(norm(club.city));
  if (byCity) return byCity;
  const name = club.name.replace(/^PadelCity\s+/i, "");
  for (const [key, url] of lookup) if (norm(name).startsWith(key)) return url;
  return undefined;
}
