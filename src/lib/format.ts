import type { Locale } from "./i18n/config";
import { localeTags } from "./i18n/config";

/** Club price "32 €" / "€32" / "60 zł" – whole units, in the club's currency (EUR default, PLN for Poland). */
export function formatPrice(value: number, locale: Locale, currency: "EUR" | "PLN" = "EUR") {
  return new Intl.NumberFormat(localeTags[locale].intl, { style: "currency", currency, maximumFractionDigits: 0 }).format(value);
}
