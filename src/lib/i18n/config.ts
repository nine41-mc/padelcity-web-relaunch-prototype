export const locales = ["de", "en", "pl"] as const;
export type Locale = (typeof locales)[number];
export const defaultLocale: Locale = "de";

/** BCP-47 tags for <html lang>, Intl and Open Graph. */
export const localeTags: Record<Locale, { lang: string; intl: string; og: string; label: string }> = {
  de: { lang: "de", intl: "de-DE", og: "de_DE", label: "Deutsch" },
  en: { lang: "en", intl: "en-GB", og: "en_GB", label: "English" },
  pl: { lang: "pl", intl: "pl-PL", og: "pl_PL", label: "Polski" },
};
