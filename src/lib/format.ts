import type { Locale } from "./i18n/config";
import { localeTags } from "./i18n/config";

/** Price "32 €" / "€32" / "60 zł" / "13,50 €" – in the club's currency (EUR default, PLN for Poland). */
export function formatPrice(value: number, locale: Locale, currency: "EUR" | "PLN" = "EUR") {
  // whole amounts without cents ("40 €"), others with two decimals ("13,50 €")
  const digits = Number.isInteger(value) ? 0 : 2;
  return new Intl.NumberFormat(localeTags[locale].intl, { style: "currency", currency, minimumFractionDigits: digits, maximumFractionDigits: digits }).format(value);
}
