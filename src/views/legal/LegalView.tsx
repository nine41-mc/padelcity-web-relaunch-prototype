import type { Locale } from "@/lib/i18n/config";
import { LegalPage } from "@/components/brand/LegalPage";
import { legalContent, type LegalKey } from "./legalContent";

/** Imprint / privacy / terms – shared by DE (/impressum, /datenschutz, /agb) and EN (/en/imprint, /en/privacy, /en/terms). */
export function LegalView({ page, locale }: { page: LegalKey; locale: Locale }) {
  const doc = legalContent[page][locale];
  return <LegalPage locale={locale} title={doc.title} sections={doc.sections} updated={doc.updated} />;
}
