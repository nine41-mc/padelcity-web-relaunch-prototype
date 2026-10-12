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
    notice: "Platzhalter im Prototyp. Der rechtsverbindliche Text wird von der Rechtsabteilung geliefert und in Contentful gepflegt.",
  },
  people: { photoSoon: "Foto folgt" },
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
    notice: "Placeholder in the prototype. The legally binding text will be supplied by our legal team and managed in Contentful.",
  },
  people: { photoSoon: "Photo coming soon" },
};

export const brandStrings: Record<Locale, BrandStrings> = { de, en };
