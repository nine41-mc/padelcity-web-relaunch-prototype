# PadelCity Website – Relaunch-Prototyp

Klickbarer, responsiver Prototyp (Phone < 768 px · Tablet ≥ 768 px · Desktop ≥ 1200 px), dreisprachig (DE unter `/`, EN unter `/en`, PL unter `/pl`), als Vorarbeit für den technischen Workshop mit der Elephant Agency. Kein Produktivcode – aber bewusst auf dem Ziel-Stack gebaut (Next.js App Router + Contentful), damit die Architekturfragen konkret werden.

## Grundsätze

- **Keine Buchungssystem-Daten auf der Website.** Keine freien Slots, keine Verfügbarkeit, keine Auslastung. Gebucht wird ausschließlich in der App; die Website verlinkt per Deeplink (Adjust/go.link).
- **Nur öffentliche Kennzahlen:** 30+ Clubs, 200+ Courts, 25+ Städte. Keine Series-A-Zahlen.
- **Nur echte Personen:** Gründer, Team und Coaches mit echten Namen, Rollen und Fotos (`src/lib/content/people.ts`, Quellen in `public/images/SOURCES.md`).

## Starten

```bash
npm install
npm run dev        # http://localhost:3000 (DE) · http://localhost:3000/en (EN)
npm run build      # statischer Export nach out/
```

Ohne Konfiguration läuft alles mit Mock-Daten. Für Contentful `.env.example` nach `.env.local` kopieren (Space ID + Content Delivery Token). Details: [`src/lib/data/README.md`](src/lib/data/README.md).

## Deployment

GitHub Pages über `.github/workflows/deploy.yml`: jeder Push auf `main` (oder ein manueller Run) baut den statischen Export und veröffentlicht ihn. Contentful-Zugangsdaten und der Deploy-Key für die lizenzierten Fonts liegen als Repository-Secrets.

**Passwortschutz:** GitHub Pages kennt keine Zugriffskontrolle. Deshalb verschlüsselt [`scripts/encrypt-export.mjs`](scripts/encrypt-export.mjs) nach dem Build jede HTML-Seite und jede RSC-Datei (`*.txt`) mit AES-256-GCM (Schlüssel per PBKDF2 aus dem Secret `PROTOTYPE_PASSWORD`). Jede Seite ist zunächst eine Passwortabfrage. Nach der Eingabe speichert der Browser den Schlüssel (IndexedDB) und der Service Worker [`public/sw.js`](public/sw.js) entschlüsselt Seiten und Seitendaten, bevor der Browser sie sieht – die Seite verhält sich wie ein ungeschützter Build (Video, Skripte, schnelle Seitenwechsel). Browser ohne Service Worker entschlüsseln über `document.write` (Fallback). Nicht geschützt sind JS-Bundles (UI-Texte), Bilder, Fonts und der Quellcode in diesem öffentlichen Repository. Ohne gesetztes Secret bricht der Deploy ab.

Passwort wechseln: neues Secret `PROTOTYPE_PASSWORD` setzen und den Workflow neu starten.

## Seiten (DE · EN)

| DE | EN | Inhalt |
|---|---|---|
| `/` | `/en` | Video-Hero, Nr.-1-Zahlen + Club-Karte, Club-Showcase, Zielgruppen-Einstiege, Series A (qualitativ), Events, Academy/Magazin, Community, Shop-Teaser (Phase 2), Partner |
| `/standorte`, `/standorte/[slug]` | `/en/locations/…` | Club-Finder (Suche, Filter, Nähe, Liste/Karte), Club-Seite mit Galerie, „In der App buchen“ (Preis ab, Öffnungszeiten, Courts, Deeplink), Facilities, Coaches, Events, FAQ |
| `/events`, `/events/[slug]` | `/en/events/…` | Hero-Events (Countdown) + lokale Events, Anmeldung im Web (`webApp.event`) oder per App-Deeplink |
| `/academy` | `/en/academy` | Level-Pfad, Programme, 19 echte Coaches, Standorte, Videos |
| `/app` | `/en/app` | App-Landingpage mit Feature-Story |
| `/franchise`, `/investoren`, `/partner` | `/en/franchise`, `/en/investors`, `/en/partners` | B2B-Zielgruppen inkl. Lead-Formularen (Prototyp: sendet nichts) |
| `/ueber-uns`, `/jobs`, `/magazin` | `/en/about`, `/en/jobs`, `/en/magazine` | Story, Gründer & Team, Employer Branding, Editorial Hub mit 6 Artikeln |

## Struktur

- `src/app/(de)/…` und `src/app/(en)/en/…` – dünne Routen-Wrapper je Sprache (eigene Root-Layouts, `lang`, hreflang)
- `src/views/<bereich>/` – Seitenlogik, sprachunabhängig (`locale`-Prop)
- `src/lib/content/*.ts` – Texte als `{ de, en }` (später Contentful-Module)
- `src/lib/i18n/` – Locales, lokalisierte Pfade (`href()`), UI-Wörterbuch
- `src/lib/data/` – Datenfassade (Contentful → Mock)

## Design-System

- Tokens in `src/app/globals.css` – 1:1 aus den Figma-Foundations bzw. `padel_city_ui` (Purple, Magenta, Gray-Blue, Radii, Shadows).
- **Farbrollen (verbindlich, Details im Kommentar oben in `globals.css`):**

  | Rolle | Farbe | Wofür |
  |---|---|---|
  | Primär | Brand-Gradient Purple `#8412B5` → Magenta `#E005C3` (`bg-brand-gradient`) | Primäre CTAs (inkl. runder Pfeil auf weißen Buttons), aktive Zustände (aktiver Tab, gewählter Filter-Chip/Segment, gewählte Option, offenes Akkordeon), lila Flächen und Glows (`shadow-glow`) |
  | Sekundär | Weiß auf Ink | Text, **alle** Icons (Ausstattung, Sportarten, Kontakt, Social, Filter …), Outline-Buttons, Rahmen, Hover (→ Weiß bzw. Magenta-300 bei Links) |
  | Highlight | Neon `#B4E854` („Tennisball“) | **Nur:** `<Accent>`-Brush-Wort, Neon-Ticker (Home + Footer), Level-Labels (`Chip tone="level"`), Coach-Statistikzahlen, Newsletter-Modul, Tastatur-Fokusring/Skip-Link, aktiver Pin + Label auf der Home-Karte, Footer-Padelball |
  | Status | Success / Danger / Warning | Nur System-Feedback |

  Kontrast (WCAG AA): Weiß auf Gradient ≥ 4,5:1, Magenta-300 auf Ink ≈ 7:1, Neon-Fokusring auf Ink ≈ 13,7:1.
- Schriften wie in der App: Söhne Schmal Fett Kursiv (Headlines), Good Brush (Akzentwort), Poppins (Text).
- Icons: App-Icons aus `mobile-app-flutter/assets/icons` (als CSS-Mask), sonst lucide.

## Offene Themen für den Workshop

1. **Contentful-Zugriff** – direkt (read-only Delivery API beim Build) oder über den PadelCity-API-Layer, wie Elephant vorschlägt? Für Marketing-Inhalte und Club-Stammdaten ist der direkte Weg einfacher und berührt das Buchungssystem nicht.
2. **Content-Modell** – stabile Club-Slugs, Website-Sichtbarkeits-Flag (heute nur `isShownInApp` in der api-platform-DB), englische Club-Texte, Marketing-Events ohne Buchungsdaten, Coach-Felder (Sprachen, Bio).
3. **App-Deeplinks** – Club- und Event-Deeplinks existieren (Adjust/go.link); QR-Code für Desktop, Store-Fallback und Tracking abstimmen.
4. **Karten-Provider** – CARTO verlangt inzwischen API-Key; Prototyp nutzt abgedunkelte OSM-Kacheln. Anbieter + Key festlegen.
5. **Google-Bewertungen** – Rating ist Mock; Quelle (Places API) + Caching/Lizenz klären.
6. **Tracking/Consent** – CTAs tragen `data-track`-Attribute; GA4 Server-Side + CMP noch nicht eingebaut.
7. **Inhalte** – `TODO(content)`-Stellen (Jobs/Personio, Franchise-Konditionen, Rechtstexte, YouTube-IDs); einige Clubs mit generischen Fotos (`public/images/SOURCES.md`).
8. **Abhängigkeiten** – `npm audit` meldet transitive Findings (u. a. sharp/libvips, postcss in Next) – im Projekt sauber aufsetzen.
