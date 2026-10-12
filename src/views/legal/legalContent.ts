import type { Locale } from "@/lib/i18n/config";

export type LegalKey = "imprint" | "privacy" | "terms";
type LegalDoc = { title: string; description: string; sections: { heading: string; text: string }[] };

/**
 * Placeholder legal copy (Contentful content type `legalPage`, localised).
 * TODO(content): legal entity details, privacy policy (incl. tracking, newsletter, forms, YouTube, maps) and terms
 * (same source as the app's AGB) from Legal / DPO. The German version is the legally binding one.
 */
export const legalContent: Record<LegalKey, Record<Locale, LegalDoc>> = {
  imprint: {
    de: {
      title: "Impressum",
      description: "Impressum der PadelCity Website.",
      sections: [
        { heading: "Angaben gemäß § 5 DDG", text: "[Firmenname] · [Straße Nr.] · [PLZ Ort] · Deutschland" },
        { heading: "Vertreten durch", text: "[Geschäftsführung]" },
        { heading: "Kontakt", text: "E-Mail: info@padelcity.de · Telefon: [Telefonnummer]" },
        { heading: "Registereintrag", text: "Registergericht: [Amtsgericht] · Registernummer: [HRB XXXXX]" },
        { heading: "Umsatzsteuer-ID", text: "[DE XXX XXX XXX]" },
        { heading: "Verantwortlich für den Inhalt", text: "[Name, Anschrift]" },
      ],
    },
    en: {
      title: "Imprint",
      description: "Legal notice for the PadelCity website.",
      sections: [
        { heading: "Information pursuant to Section 5 DDG", text: "[Company name] · [Street no.] · [Postcode, city] · Germany" },
        { heading: "Represented by", text: "[Managing directors]" },
        { heading: "Contact", text: "Email: info@padelcity.de · Phone: [Phone number]" },
        { heading: "Commercial register", text: "Register court: [Local court] · Registration number: [HRB XXXXX]" },
        { heading: "VAT ID", text: "[DE XXX XXX XXX]" },
        { heading: "Responsible for content", text: "[Name, address]" },
      ],
    },
  },
  privacy: {
    de: {
      title: "Datenschutz",
      description: "Datenschutzerklärung der PadelCity Website.",
      sections: [
        { heading: "1. Verantwortlicher", text: "[Firmenname, Anschrift, Kontakt des Datenschutzbeauftragten]" },
        { heading: "2. Erhebung und Verarbeitung von Daten", text: "[Beschreibung der verarbeiteten Daten beim Besuch der Website, in Formularen und beim Newsletter.]" },
        { heading: "3. Cookies & Tracking", text: "[Consent-Management, eingesetzte Tools, Rechtsgrundlagen, Speicherdauer.]" },
        { heading: "4. Eingebettete Inhalte", text: "[YouTube (erweiterter Datenschutzmodus), Karten, Social Media.]" },
        { heading: "5. Deine Rechte", text: "[Auskunft, Berichtigung, Löschung, Einschränkung, Datenübertragbarkeit, Widerspruch, Beschwerde.]" },
      ],
    },
    en: {
      title: "Privacy policy",
      description: "Privacy policy for the PadelCity website.",
      sections: [
        { heading: "1. Controller", text: "[Company name, address, contact details of the data protection officer]" },
        { heading: "2. Collection and processing of data", text: "[Description of the data processed when visiting the website, using forms and signing up for the newsletter.]" },
        { heading: "3. Cookies & tracking", text: "[Consent management, tools used, legal bases, retention periods.]" },
        { heading: "4. Embedded content", text: "[YouTube (privacy-enhanced mode), maps, social media.]" },
        { heading: "5. Your rights", text: "[Access, rectification, erasure, restriction, data portability, objection, complaint.]" },
      ],
    },
  },
  terms: {
    de: {
      title: "AGB",
      description: "Allgemeine Geschäftsbedingungen von PadelCity.",
      sections: [
        { heading: "§ 1 Geltungsbereich", text: "[Geltungsbereich der Allgemeinen Geschäftsbedingungen.]" },
        { heading: "§ 2 Buchungen über die PadelCity App", text: "[Vertragsschluss, Buchung, Bezahlung.]" },
        { heading: "§ 3 Stornierung", text: "[Stornierungsbedingungen und Fristen.]" },
        { heading: "§ 4 Hausordnung & Haftung", text: "[Nutzung der Anlagen, Haftung.]" },
        { heading: "§ 5 Schlussbestimmungen", text: "[Gerichtsstand, anwendbares Recht.]" },
      ],
    },
    en: {
      title: "Terms & conditions",
      description: "PadelCity's general terms and conditions.",
      sections: [
        { heading: "§ 1 Scope", text: "[Scope of the general terms and conditions.]" },
        { heading: "§ 2 Bookings via the PadelCity app", text: "[Conclusion of contract, booking, payment.]" },
        { heading: "§ 3 Cancellation", text: "[Cancellation terms and deadlines.]" },
        { heading: "§ 4 House rules & liability", text: "[Use of the facilities, liability.]" },
        { heading: "§ 5 Final provisions", text: "[Place of jurisdiction, applicable law.]" },
      ],
    },
  },
};
