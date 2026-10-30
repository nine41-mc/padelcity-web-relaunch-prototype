import { asset } from "@/lib/asset";
import type { LatLng } from "./geo";

/**
 * Place lookup for the radius search in the club finder: when a search matches no club ("Neuburg"), the finder
 * looks the place up here and lists the clubs around it (team feedback m-4). public/data/places.json holds the
 * populated places of Germany, Austria and Poland with 1,000+ inhabitants from GeoNames (CC BY 4.0,
 * geonames.org), largest first; big cities carry other spellings (Warschau, Warszawa …). Rebuild it with
 * scripts/build-places.py. Loaded only on the first search without a club match.
 */
type Place = [name: string, lat: number, lon: number, alternates?: string];
export type FoundPlace = { name: string; position: LatLng };

let places: Promise<Place[]> | null = null;
const load = (): Promise<Place[]> => (places ??= fetch(asset("/data/places.json")).then((r) => (r.ok ? (r.json() as Promise<Place[]>) : [])).catch(() => []));

const fold = (s: string) => s.toLowerCase().normalize("NFD").replace(/\p{Diacritic}/gu, "").replace(/ß/g, "ss").trim();

/**
 * The largest place that is the query or starts with it as a word ("Neuburg" → Neuburg an der Donau, not the village
 * of the same name), then any name starting with the query. A match on another spelling keeps the visitor's spelling.
 */
export async function findPlace(query: string): Promise<FoundPlace | null> {
  const q = fold(query);
  if (q.length < 3) return null;
  const list = await load();
  const wordMatch = (s: string) => s === q || s.startsWith(`${q} `);
  const hit =
    list.find(([name, , , alts]) => wordMatch(fold(name)) || (alts ?? "").split("|").some((a) => wordMatch(fold(a)))) ??
    list.find(([name]) => fold(name).startsWith(q));
  if (!hit) return null;
  const byName = wordMatch(fold(hit[0])) || fold(hit[0]).startsWith(q);
  return { name: byName ? hit[0] : query.trim(), position: { latitude: hit[1], longitude: hit[2] } };
}
