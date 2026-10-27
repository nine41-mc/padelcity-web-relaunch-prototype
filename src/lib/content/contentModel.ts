import type { Field, PageType, Source } from "./contentModel.types";

export type { Field, Module, PageType, Source } from "./contentModel.types";

/*
 * Content model of the prototype (shown at /content-modell, footer link). One entry per page type with its modules;
 * every field carries its source. Module ids = proposed Contentful content types / module names in the code.
 * API references were checked against api-platform (see contentModelMeta.checked).
 */
export const contentModelMeta = {
  decided: "15.10.2026",
  checked: "15.10.2026",
  /** findings that apply to every "API" field (api-platform, read-only review) */
  notes: [
    "Öffentlich ohne Login sind heute nur FAQ, Länder und Rechtsdokumente. Clubs, Coaches, Events, Sportarten und Preise brauchen ein Spieler-Login (Keycloak).",
    "Routen nur freizuschalten reicht nicht: Adresse, Position, Ausstattung, Öffnungszeiten, Kontakt und alle Coach-Felder werden nur für eingeloggte Spieler ausgegeben. Nötig ist ein eigener öffentlicher Website-Zugang (eigene Endpunkte/Felder oder Export) – siehe Workshop Kapitel 3.",
    "Texte sind übersetzbar: die API liefert DE, EN und PL über ?_locale= bzw. Accept-Language (Pflege der Übersetzungen in Contentful prüfen).",
  ],
};

const f = (name: string, source: Source, ref?: string, note?: string): Field => ({ name, source, ref, note });

// Reused field groups ---------------------------------------------------------------------------------------------
const clubCore = (): Field[] => [
  f("Name", "api", "GET /clubs → name"),
  f("Stadt, Adresse", "api", "GET /clubs → address.*"),
  f("Bilder (Hauptbild, Galerie)", "api", "GET /clubs → mainImage, images[]", "Contentful-Asset-URLs"),
];
const clubSlug = () => f("Sprechende URL (Slug)", "apiExtend", undefined, "fehlt komplett – SEO, Redirects; Pflege im operativen Contentful oder Backend klären");
const priceFrom = () => f("Preis „ab … €/h“", "apiExtend", "Club.defaultPricePerHour", "gespeichert, aber nicht ausgegeben; nur indirekt als minimumCourtFee über /club-schedules/clubs");
const sectionHead = (): Field[] => [f("Eyebrow, Headline, Akzentwort, Text", "cms")];
const ctas = () => f("Buttons (Label, Ziel)", "cms");

export const contentModel: PageType[] = [
  {
    id: "global",
    name: "Global",
    path: "auf jeder Seite",
    text: "Bausteine, die auf allen Seiten vorkommen.",
    modules: [
      { id: "siteNavigation", name: "Header & Navigation", fields: [f("Menüpunkte, Reihenfolge, Kurzbeschreibungen", "cms"), f("CTA „Jetzt Padel spielen“", "cms"), f("Sprachumschalter DE · EN · PL", "cms", "Contentful-Locales")] },
      {
        id: "siteFooter",
        name: "Footer",
        fields: [
          f("Kennzahlen-Ticker (freigegebene Zahlen)", "cms"),
          f("Claim, Social-Links", "cms"),
          f("Newsletter-Anmeldung", "unknown", undefined, "Newsletter-Tool (Brevo/HubSpot?) offen"),
          f("WhatsApp-Gruppen je Stadt", "apiExtend", undefined, "Link pro Club fehlt in der API; heute nur auf padelcity.de gepflegt"),
          f("Rechtliche Links, Sitemap, Content-Modell", "cms"),
        ],
      },
      { id: "seo", name: "SEO & Teilen", fields: [f("Titel, Beschreibung, Social-Bild je Seite", "cms"), f("hreflang, Sitemap.xml", "cms", undefined, "aus Seiten-Einträgen generiert")] },
      { id: "consent", name: "Cookie-Consent", fields: [f("Consent-Banner und Kategorien", "unknown", undefined, "CMP-Anbieter noch offen")] },
      { id: "deeplinks", name: "App-Deeplinks", fields: [f("Links in die App (Club, Event, Open Matches, Gutscheine)", "external", "link.padelcity.de", "neuer Link-Service, IDs aus der API")] },
    ],
  },
  {
    id: "home",
    name: "Startseite",
    path: "/",
    modules: [
      { id: "heroHome", name: "Hero", fields: [f("Headline, Akzentwort, Text", "cms"), f("Video / Bild", "cms", "Contentful-Asset"), ctas(), f("Club-Suche (Städte, Clubs)", "api", "GET /clubs")] },
      { id: "factTicker", name: "Kennzahlen-Ticker", fields: [f("Freigegebene Kennzahlen, Claims", "cms")] },
      { id: "leaderMap", name: "Nr. 1 + Karte", fields: [...sectionHead(), f("Club-Pins (Position, Name)", "api", "GET /clubs → position"), f("Geplante Clubs auf der Karte", "apiExtend", undefined, "inaktive Clubs werden nie ausgegeben; Status „bald eröffnet“ fehlt")] },
      { id: "clubShowcase", name: "Club-Showcase (Poster)", fields: [...sectionHead(), f("Auswahl und Reihenfolge der Clubs", "cms", "Referenz auf Club-ID"), ...clubCore(), f("Öffnungsstatus „Geöffnet bis …“", "api", "GET /clubs → openingSchedule"), f("Courts, Sportarten (Hover)", "api", "GET /clubs → courts[].locationType, sportType")] },
      { id: "audienceEntries", name: "Zielgruppen-Einstiege", fields: [f("Kacheln (Titel, Text, Bild, Ziel)", "cms")] },
      { id: "seriesATeaser", name: "Series-A-Teaser", fields: [f("Text (qualitativ, keine Zahlen)", "cms")] },
      {
        id: "featuredEvents",
        name: "Events-Teaser",
        fields: [
          f("Hero-Event (Auswahl, Bild, Claim)", "cms", "Referenz auf Event-ID"),
          f("Event-Karten: Titel, Datum, Club, Preis, Bild", "api", "GET /v2/club-events → title, eventPeriod, club, pricePerPerson, teaserImage"),
          f("Level, Wiederholung", "apiExtend", undefined, "Felder fehlen"),
        ],
      },
      { id: "academyMagazineTeaser", name: "Academy- & Magazin-Teaser", fields: [f("Texte, Bilder, Artikel-Auswahl", "cms")] },
      { id: "community", name: "Community / WhatsApp", fields: [...sectionHead(), f("Gruppen-Links je Stadt", "apiExtend", undefined, "WhatsApp-Link fehlt in der API")] },
      { id: "testimonials", name: "Stimmen", fields: [f("Zitate", "cms", undefined, "im Prototyp Platzhalter – echte Stimmen nur mit Einwilligung")] },
      { id: "socialWall", name: "Instagram-Wand", fields: [f("Neueste Posts @padelcity.de", "external", "Instagram API")] },
      { id: "voucherTeaser", name: "Gutschein-Modul", fields: [f("Text, Schritte, Karten-Visual, Betrag", "cms"), f("Gutschein kaufen", "external", "App-Deeplink /gift-vouchers", "Kauf braucht Login – bleibt in der App")] },
      { id: "partnerLogos", name: "Partner-Logos", fields: [f("Logos, Links", "cms")] },
      { id: "appCta", name: "App-CTA", fields: [f("Text, CTA, Store-Badges", "cms")] },
    ],
  },
  {
    id: "locations",
    name: "Standorte",
    path: "/standorte",
    modules: [
      { id: "pageHero", name: "Hero", fields: sectionHead() },
      {
        id: "locationFinder",
        name: "Club-Finder (Liste & Karte)",
        fields: [
          ...clubCore(),
          f("Geo-Position (Nähe, Karte)", "api", "GET /clubs → position.latitude, longitude"),
          f("Courts: Anzahl, indoor/outdoor, Double/Single, Sportart", "api", "GET /clubs → courts[].locationType, courtType, sportType"),
          f("Panorama-Court (Filter)", "apiExtend", "Court.isPremium", "isPremium gespeichert, nicht ausgegeben; „Panorama“ gibt es nicht"),
          f("Ausstattung (Filter)", "api", "GET /clubs → facilities[]"),
          f("„Gerade geöffnet“", "api", "GET /clubs → openingSchedule"),
          priceFrom(),
          f("Franchise-Kennzeichen (Filter)", "apiExtend", undefined, "fehlt – nur operatorName vorhanden"),
          f("Sichtbarkeit auf der Website, Testclubs ausblenden", "apiExtend", "isShownInApp", "es gibt nur das App-Flag, kein Website- oder Testclub-Kennzeichen"),
          f("Kartenkacheln", "external", undefined, "Karten-Anbieter offen (OSM/CARTO braucht Key)"),
        ],
      },
      { id: "cityIndex", name: "Städte-Index", fields: [f("Stadt", "api", "GET /clubs → address.localityName"), f("Land, Region (Bundesland)", "apiExtend", "Club.subdivisionCode, Club.country", "gespeichert, aber für Spieler nicht ausgegeben")] },
      {
        id: "plannedClubs",
        name: "Bald eröffnet",
        fields: [f("Geplante Clubs mit Stadt", "apiExtend", undefined, "Status „geplant“ + Eröffnungszeitraum fehlen; inaktive Clubs werden gefiltert"), f("Stadt-Illustrationen", "cms"), f("„Benachrichtige mich“", "unknown", undefined, "Newsletter-Tool offen")],
      },
      { id: "franchiseTeaser", name: "Franchise-Teaser", fields: [...sectionHead(), f("Kennzahlen im Text (Clubs, Courts)", "cms", undefined, "nur freigegebene Zahlen"), ctas()] },
    ],
  },
  {
    id: "club",
    name: "Clubseite",
    path: "/standorte/[club]",
    modules: [
      { id: "clubHero", name: "Kopf & Galerie", fields: [clubSlug(), ...clubCore(), f("Claim", "cms", undefined, "optional, Website-Text")] },
      { id: "clubHighlights", name: "Highlights & News", fields: [f("Story-Kreise, Bilder", "cms")] },
      { id: "clubDescription", name: "Beschreibung", fields: [f("Text DE/EN/PL", "api", "GET /clubs → description (?_locale=)", "als gerendertes Rich Text; ob PL gepflegt ist, prüfen"), f("Kurz-Teaser", "apiExtend", undefined, "kein eigenes Teaser-Feld")] },
      { id: "clubHours", name: "Öffnungszeiten", fields: [f("Öffnungszeiten je Wochentag inkl. Feiertage", "api", "GET /clubs → openingTimes, openingSchedule", "Sondertage nur für die nächsten 7 Tage")] },
      {
        id: "clubPricing",
        name: "Preise & Ausstattung",
        fields: [
          priceFrom(),
          f("Preisliste: Peak/Off-Peak, Tage, Sportarten, Court-Typen", "unknown", undefined, "Quelle offen: Tarife aus dem Buchungssystem oder Pflege in Contentful; der Ab-Preis ist der günstigste Preis der Liste"),
          f("Court-Übersicht", "api", "GET /clubs → courts[]"),
          f("Ausstattungs-Liste", "api", "GET /clubs → facilities[].type, name, iconUrl"),
        ],
      },
      {
        id: "clubReach",
        name: "So erreichst du uns",
        fields: [
          f("Kontakt: Name, E-Mail, Telefon, Website", "api", "GET /clubs → contact.*", "ein Kontakt pro Club; ob Name/E-Mail öffentlich gezeigt werden, ist offen"),
          f("WhatsApp-Gruppe", "apiExtend", undefined, "fehlt"),
          f("Adresse, Position", "api", "GET /clubs → address, position"),
          f("Karte", "external", undefined, "Karten-Anbieter offen"),
        ],
      },
      { id: "clubCoaches", name: "Coaches im Club", fields: [f("Name, Bild, Rolle", "api", "GET /clubs/{id}/coaches → firstName, lastName, profileImage, title", "nur aktive Coaches mit verknüpftem Nutzerkonto"), f("Bio, Sprachen", "apiExtend", undefined, "fehlen (evtl. im operativen Contentful, aber nicht synchronisiert)")] },
      { id: "clubEvents", name: "Events im Club", fields: [f("Events des Clubs", "api", "GET /v2/club-events", "Filter nach Club und Seitenweise 3 Events – für die Website anpassen")] },
      {
        id: "appBooking",
        name: "In der App buchen",
        text: "Keine freien Slots, keine Auslastung auf der Website.",
        fields: [f("Headline, Text, „Nur in der App“, 3 Schritte", "cms"), f("Deeplink zum Club", "external", "Link-Service mit Club-ID", "API baut heute nur Match-Deeplinks")],
      },
      { id: "nearbyClubs", name: "Clubs in der Nähe", fields: [...clubCore(), f("Entfernung", "api", "GET /clubs → position", "wird auf der Website aus den Positionen berechnet")] },
      { id: "clubReviews", name: "Google-Bewertungen", fields: [f("Sterne, Anzahl, Auszüge", "external", "Google Places API")] },
      { id: "faq", name: "FAQ", fields: [f("Fragen & Antworten", "api", "GET /faq/sections, /faq/topics", "heute schon öffentlich")] },
    ],
  },
  {
    id: "events",
    name: "Events",
    path: "/events",
    modules: [
      { id: "pageHero", name: "Hero", fields: sectionHead() },
      { id: "heroEvents", name: "Hero-Events", fields: [f("Auswahl, Bild, Claim, Countdown", "cms", "Referenz auf Event-ID")] },
      {
        id: "eventList",
        name: "Event-Liste & Filter",
        fields: [
          f("Titel, Datum/Uhrzeit, Club, Preis, Bild, Sportart", "api", "GET /v2/club-events → title, eventPeriod, club, pricePerPerson, teaserImage, sportType"),
          f("Kategorie (Turnier, Training, Social)", "apiExtend", "type", "type meint nur das Team-Format (REGULAR/TEAM) – Kategorie fehlt"),
          f("Level, Wiederholung", "apiExtend", undefined, "fehlen"),
          f("Liste ohne Login, alle Events", "apiExtend", undefined, "/v2 ist pro Spieler (ohne gebuchte Events, 3 pro Seite, 100-km-Radius)"),
          f("Kapazität / freie Plätze", "api", "maxConfirmedRegistrations", "vorhanden, wird bewusst NICHT gezeigt"),
        ],
      },
    ],
  },
  {
    id: "event",
    name: "Event-Detail",
    path: "/events/[event]",
    modules: [
      { id: "eventHero", name: "Kopf", fields: [f("Titel, Untertitel, Datum, Club", "api", "GET /club-events/{id} → title, subtitle, eventPeriod, club"), f("Bild", "api", "teaserImage", "aus der Event-Vorlage; Hero-Events optional mit eigenem Bild im neuen Space")] },
      { id: "eventSignupCard", name: "Anmeldung", fields: [f("Preis pro Person", "api", "GET /club-events/{id} → pricePerPerson, isFreeEvent"), f("Im Web anmelden", "external", "Events-Web-App /events/{id}", "Event-ID aus der API"), f("In der App anmelden", "external", "Link-Service")] },
      { id: "richText", name: "Beschreibung", fields: [f("Text", "api", "GET /club-events/{id} → description", "Event-Text überschreibt Vorlagen-Text; übersetzbar")] },
      { id: "formatSteps", name: "Ablauf / Format", fields: [f("Schritte, Zeitplan", "cms")] },
    ],
  },
  {
    id: "app",
    name: "App",
    path: "/app",
    modules: [
      { id: "appHero", name: "Hero", fields: [...sectionHead(), f("Store-Bewertungen (Sterne, Anzahl)", "external", "App Store / Google Play"), f("Handy-Screens", "cms", "Contentful-Assets")] },
      { id: "featureStory", name: "Feature-Story", fields: [f("Features: Texte, Screens, Overlays", "cms")] },
      { id: "appStoreGallery", name: "Store-Screenshots", fields: [f("Bilder DE/EN", "cms")] },
      { id: "howItWorks", name: "So funktioniert's", fields: [f("Schritte", "cms")] },
      { id: "faq", name: "FAQ", fields: [f("Fragen & Antworten", "cms")] },
      { id: "appFinalCta", name: "Schluss-CTA", fields: [...sectionHead(), f("Store-Badges, Handy-Screen", "cms"), ctas()] },
    ],
  },
  {
    id: "academy",
    name: "Academy",
    path: "/academy",
    modules: [
      { id: "pageHero", name: "Hero", fields: sectionHead() },
      { id: "levelPath", name: "Level-Skala", fields: [f("7 Level: Name, Text", "unknown", undefined, "dieselben Texte wie in der App – zentrale Quelle klären"), f("Stufen, Bullets", "cms")] },
      { id: "programmeGrid", name: "Programme", fields: [f("Kurse/Formate: Titel, Text, Bild, Level", "unknown", undefined, "keine Kurs-/Programm-Entität in der API – redaktionell im neuen Space oder neue API-Entität?")] },
      { id: "priceTable", name: "Preisliste Training", fields: [f("Formate, Preise Coach / Headcoach", "unknown", undefined, "API hat Preise nur pro Coach und Club (trainingPrices), keine Club-Preisliste")] },
      {
        id: "coachCarousel",
        name: "Coaches",
        fields: [f("Name, Bild, Rolle, Clubs", "api", "GET /clubs/{id}/coaches → firstName, lastName, profileImage, title, clubs"), f("Sprachen, Bio", "apiExtend", undefined, "fehlen"), f("Trainingszeiten, Preise", "api", "trainingSchedules, trainingPrices", "pro Club; öffentlich zeigen nur mit Einwilligung"), f("E-Mail, Telefon", "apiExtend", "emailAddress", "E-Mail vorhanden, Telefon nur für Staff; Freigabe offen")],
      },
      { id: "academyLocations", name: "Academy-Standorte", fields: [f("Clubs mit Academy", "apiExtend", undefined, "Kennzeichen fehlt (ableitbar aus Clubs mit Coaches?)")] },
      { id: "videoTeaserGrid", name: "Videos", fields: [f("Titel, Vorschaubild", "cms"), f("Video", "external", "YouTube")] },
      { id: "faq", name: "FAQ", fields: [f("Fragen & Antworten", "cms")] },
    ],
  },
  {
    id: "magazine",
    name: "Magazin & Artikel",
    path: "/magazin, /magazin/[artikel]",
    modules: [
      { id: "pageHero", name: "Hero", fields: sectionHead() },
      { id: "contentHubs", name: "Rubriken", fields: [f("Rubriken (Hubs)", "cms")] },
      { id: "article", name: "Artikel", fields: [f("Titel, Teaser, Text, Bilder, Autor, Datum, Lesezeit", "cms")] },
      { id: "relatedArticles", name: "Weiterlesen", fields: [f("Weitere Artikel", "cms", "article.relatedArticles", "im Prototyp automatisch: gleiche Rubrik zuerst")] },
      { id: "pressLogos", name: "Presse", fields: [f("Logos, Links", "cms")] },
      { id: "newsletterSignup", name: "Newsletter", fields: [f("Anmeldung", "unknown", undefined, "Newsletter-Tool offen")] },
    ],
  },
  {
    id: "franchise",
    name: "Franchise",
    path: "/franchise",
    modules: [
      { id: "franchiseContent", name: "Inhalte", text: "Hero, Vorteile, Leistungen je Phase, Ablauf, Voraussetzungen", fields: [f("Alle Texte und Bilder", "cms")] },
      { id: "clubList", name: "Franchise-Clubs", fields: [...clubCore(), f("Franchise-Kennzeichen", "apiExtend", "operatorName", "fehlt – nur über Betreiber ableitbar")] },
      { id: "contactCard", name: "Ansprechpartner", fields: [f("Person, Foto, Rolle", "cms")] },
      { id: "leadForm", name: "Anfrage-Formular", fields: [f("Formular-Texte", "cms"), f("Ziel der Anfragen", "unknown", undefined, "CRM/E-Mail offen")] },
    ],
  },
  {
    id: "investors",
    name: "Investor Relations",
    path: "/investoren",
    modules: [
      { id: "investorsContent", name: "Inhalte", text: "Hero, Equity Story, Meilensteine, Downloads", fields: [f("Alle Texte", "cms"), f("Kennzahlen (nur freigegebene)", "cms"), f("Downloads (Pressemappe, Factsheet)", "cms", "Contentful-Assets")] },
      { id: "peopleGrid", name: "Gründer & Management", fields: [f("Name, Rolle, Foto, Zitat", "cms")] },
    ],
  },
  {
    id: "partners",
    name: "Partner & Sponsoring",
    path: "/partner",
    modules: [
      { id: "partnersContent", name: "Inhalte", text: "Formate, Personas, Case Study, Firmen-Events", fields: [f("Alle Texte und Bilder", "cms")] },
      { id: "partnerLogoWall", name: "Partner-Logos", fields: [f("Logos, Links", "cms")] },
      { id: "leadForm", name: "Anfrage-Formular", fields: [f("Ziel der Anfragen", "unknown", undefined, "CRM/E-Mail offen")] },
    ],
  },
  {
    id: "about",
    name: "Über uns",
    path: "/ueber-uns",
    modules: [
      { id: "aboutContent", name: "Inhalte", text: "Story, Vision, Werte, Säulen, Meilensteine", fields: [f("Alle Texte und Bilder", "cms")] },
      { id: "peopleGrid", name: "Team", fields: [f("Name, Rolle, Foto", "cms")] },
      { id: "testimonials", name: "Stimmen", fields: [f("Zitate", "cms")] },
    ],
  },
  {
    id: "jobs",
    name: "Jobs",
    path: "/jobs",
    modules: [
      { id: "jobsContent", name: "Inhalte", text: "Hero, Benefits, Kultur, Team, Initiativbewerbung", fields: [f("Alle Texte und Bilder", "cms")] },
      { id: "openings", name: "Offene Stellen", fields: [f("Stellen, Anzeigen, Bewerbungsformular", "external", "Personio-Karriereseite (Embed)")] },
      { id: "contactCard", name: "Ansprechpartnerin", fields: [f("Name, Foto, E-Mail, Telefon", "cms")] },
    ],
  },
  {
    id: "faqPage",
    name: "FAQ",
    path: "/faq",
    modules: [
      { id: "pageHero", name: "Hero", fields: sectionHead() },
      { id: "faqExplorer", name: "FAQ-Übersicht", fields: [f("Kategorien, Fragen, Antworten", "api", "GET /faq/sections, /faq/sections/{id}/topics, /faq/topics/{id}", "heute schon öffentlich, live aus Contentful")] },
      { id: "contactTeaser", name: "Kontakt", fields: [...sectionHead(), f("E-Mail-Adresse, Buttons", "cms")] },
    ],
  },
  {
    id: "legal",
    name: "Rechtstexte",
    path: "/impressum, /datenschutz, /agb",
    modules: [{ id: "legalPage", name: "Rechtstext", fields: [f("Text DE (Quelle), EN/PL Übersetzung, Stand", "cms", undefined, "deutsche padelcity.de-Seiten als Quelle; Alternative: API liefert App-Impressum/-Datenschutz öffentlich (GET /documents/{id}) – prüfen, ob identisch")] }],
  },
];
