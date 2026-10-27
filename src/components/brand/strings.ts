import type { Locale } from "@/lib/i18n/config";

/** UI strings for the shared brand components (page copy lives in src/lib/content/*). */
const de = {
  timeline: { aria: "Meilensteine", swipe: "← Wischen für mehr →" },
  leadForm: {
    choose: "Bitte wählen",
    consent: "Ich bin einverstanden, dass PadelCity meine Angaben zur Bearbeitung meiner Anfrage verarbeitet. Details in der",
    privacy: "Datenschutzerklärung",
    required: "* Pflichtfeld",
    successTitle: "Danke! Wir melden uns.",
    successText: "Dein Ansprechpartner meldet sich innerhalb von zwei Werktagen bei dir.",
    prototype: "Prototyp: Es wurden keine Daten übermittelt.",
  },
  legal: {
    eyebrow: "Rechtliches",
    notice: "Text übernommen von padelcity.de. Vor dem Go-live prüft und ergänzt die Rechtsabteilung ihn für die neue Website (Tracking, Consent, Newsletter, Formulare, Hosting).",
  },
  people: { photoSoon: "Foto folgt", linkedin: (name: string) => `${name} auf LinkedIn` },
};

export type BrandStrings = typeof de;

const en: BrandStrings = {
  timeline: { aria: "Milestones", swipe: "← Swipe for more →" },
  leadForm: {
    choose: "Please choose",
    consent: "I agree that PadelCity may process my details to handle my enquiry. Details in our",
    privacy: "privacy policy",
    required: "* Required field",
    successTitle: "Thanks! We'll be in touch.",
    successText: "Your contact will get back to you within two working days.",
    prototype: "Prototype: no data has been sent.",
  },
  legal: {
    eyebrow: "Legal",
    notice: "Text taken over from padelcity.de. Before go-live our legal team reviews and extends it for the new website (tracking, consent, newsletter, forms, hosting).",
  },
  people: { photoSoon: "Photo coming soon", linkedin: (name: string) => `${name} on LinkedIn` },
};

const pl: BrandStrings = {
  timeline: { aria: "Kamienie milowe", swipe: "← Przesuń, aby zobaczyć więcej →" },
  leadForm: {
    choose: "Wybierz",
    consent: "Wyrażam zgodę na przetwarzanie moich danych przez PadelCity w celu obsługi mojego zapytania. Szczegóły w",
    privacy: "polityce prywatności",
    required: "* Pole obowiązkowe",
    successTitle: "Dzięki! Odezwiemy się.",
    successText: "Twoja osoba kontaktowa odezwie się do ciebie w ciągu dwóch dni roboczych.",
    prototype: "Prototyp: żadne dane nie zostały przesłane.",
  },
  legal: {
    eyebrow: "Informacje prawne",
    notice: "Tekst przejęty z padelcity.de. Przed startem nasz dział prawny sprawdzi go i uzupełni pod kątem nowej strony (tracking, zgody, newsletter, formularze, hosting).",
  },
  people: { photoSoon: "Zdjęcie wkrótce", linkedin: (name: string) => `${name} na LinkedInie` },
};

export const brandStrings: Record<Locale, BrandStrings> = { de, en, pl };
