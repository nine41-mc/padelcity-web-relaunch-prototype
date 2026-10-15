import { localeTags, type Locale } from "./config";

/**
 * Polish needs three forms (1 kort · 2–4 korty · 5+ kortów); German/English only singular/plural.
 * Content keeps two fields (one / many = DE/EN plural, PL genitive plural for 0 and 5+);
 * the Polish 2–4 form ("few") comes from this map, keyed by the "many" form.
 */
const PL_FEW: Record<string, string> = {
  "kortów": "korty",
  "ofert pracy": "oferty pracy",
  "wydarzeń": "wydarzenia",
};

/** "{n} {word}" with the grammatically right form for the locale. */
export function plural(locale: Locale, n: number, one: string, many: string): string {
  const form = new Intl.PluralRules(localeTags[locale].intl).select(n);
  if (form === "one") return one;
  if (locale === "pl" && form === "few") return PL_FEW[many] ?? many;
  return many;
}
