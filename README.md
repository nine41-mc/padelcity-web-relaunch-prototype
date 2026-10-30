# PadelCity Website – Relaunch-Prototyp

Klickbarer, responsiver Prototyp (Phone < 768 px · Tablet ≥ 768 px · Desktop ≥ 1200 px), dreisprachig (DE unter `/`, EN unter `/en`, PL unter `/pl`), als Vorarbeit für den technischen Workshop mit der Elephant Agency. Kein Produktivcode – aber bewusst auf dem Ziel-Stack gebaut (Next.js App Router + Contentful), damit die Architekturfragen konkret werden.

## Grundsätze

- **Keine Buchungssystem-Daten auf der Website.** Keine freien Slots, keine Verfügbarkeit, keine Auslastung. Gebucht wird ausschließlich in der App; die Website verlinkt per Deeplink über den Link-Service `link.padelcity.de` (seit der aktuellen App-Version; Adjust/go.link ist abgelöst). Einzige Ausnahme (seit 27.10.2026): das Event-Detail zeigt max. Teilnehmer, freie Plätze (live) und die Storno-Tabelle für die Regel „kostenfrei bis 24 Std. vor Beginn“.
- **Nur freigegebene Kennzahlen:** 30+ Clubs, 200+ Courts, 25+ Städte, 3 Länder. Keine Series-A- oder Finanzierungszahlen.
- **Nur echte Personen:** Gründer, Team und Coaches mit echten Namen, Rollen und Fotos (`src/lib/content/people.ts`, Quellen in `public/images/SOURCES.md`).

## Starten

```bash
npm install
npm run dev        # http://localhost:3000 (DE) · http://localhost:3000/en (EN)
npm run build      # statischer Export nach out/
```

Ohne Konfiguration läuft alles mit Mock-Daten. Für Contentful `.env.example` nach `.env.local` kopieren (Space ID + Content Delivery Token). Details: [`src/lib/data/README.md`](src/lib/data/README.md).

## Deployment

GitHub Pages über `.github/workflows/deploy.yml`: jeder Push auf `main` (oder ein manueller Run) läuft zuerst durch die Checks (`.github/workflows/checks.yml`: Lint, Typen, Code Connect, Tokens, `npm run qa` in Chromium, WebKit und Firefox), baut dann den statischen Export und veröffentlicht ihn. Pushes auf andere Branches laufen nur durch die Checks.

Alternativ für GitLab Pages: `.gitlab-ci.yml` mit denselben Code-Checks und einer schlankeren QA (Chromium, 390 und 1440 px – der GitLab-Runner schafft die volle Matrix nicht); Pages auf dem Default-Branch, per Zeitplan oder manuell, nur wenn die Checks grün sind. Braucht die CI/CD-Variable `FONTS_DEPLOY_KEY` (Typ File) für die lizenzierten Fonts – siehe Kopf der Datei. Contentful-Zugangsdaten und der Deploy-Key für die lizenzierten Fonts liegen als Repository-Secrets.

**Passwortschutz:** GitHub Pages kennt keine Zugriffskontrolle. Deshalb verschlüsselt [`scripts/encrypt-export.mjs`](scripts/encrypt-export.mjs) nach dem Build jede HTML-Seite und jede RSC-Datei (`*.txt`) mit AES-256-GCM (Schlüssel per PBKDF2 aus dem Secret `PROTOTYPE_PASSWORD`). Jede Seite ist zunächst eine Passwortabfrage. Nach der Eingabe speichert der Browser den Schlüssel (IndexedDB) und der Service Worker [`public/sw.js`](public/sw.js) entschlüsselt Seiten und Seitendaten, bevor der Browser sie sieht – die Seite verhält sich wie ein ungeschützter Build (Video, Skripte, schnelle Seitenwechsel). Browser ohne Service Worker entschlüsseln über `document.write` (Fallback). Nicht geschützt sind JS-Bundles (UI-Texte), Bilder, Fonts und der Quellcode in diesem öffentlichen Repository. Ohne gesetztes Secret bricht der Deploy ab.

Passwort wechseln: neues Secret `PROTOTYPE_PASSWORD` setzen und den Workflow neu starten.

## Seiten (DE · EN · PL)

| DE | EN | PL | Inhalt |
|---|---|---|---|
| `/` | `/en` | `/pl` | Video-Hero, Nr.-1-Zahlen + Club-Karte, Club-Showcase, Zielgruppen-Einstiege, Series A (qualitativ), Events, News & Magazin, Community, Stimmen, Gutscheine, Partner |
| `/standorte`, `/standorte/[slug]` | `/en/locations/…` | `/pl/lokalizacje/…` | Club-Finder (Suche, Filter, Nähe, Liste/Karte); Club-Seite: Galerie, Öffnungszeiten unter dem Namen (aufklappbar), Kontakt-Kacheln (Route · Anrufen · E-Mail · WhatsApp, je mit Kopieren), „Preise & Courts“ mit einem Sportarten-Filter, Ausstattung, Highlights, Events, Coaches, „In der App buchen“, Karte, Clubs in der Nähe, Teilen |
| `/events`, `/events/[slug]` | `/en/events/…` | `/pl/wydarzenia/…` | Hero-Events (Countdown) + lokale Events; Event-Detail mit Eckdaten, freien Plätzen, Storno-Tabelle, Anmeldung im Web (`webApp.event`) oder per App-Deeplink, Teilen |
| `/academy` | `/en/academy` | `/pl/akademia` | Level-Pfad, Programme, Preisliste (1er–4er Training, Coach/Head Coach), echte Coaches, Standorte, Videos, FAQ |
| `/app` | `/en/app` | `/pl/aplikacja` | App-Landingpage mit Feature-Story |
| `/magazin`, `/magazin/[slug]` | `/en/magazine/…` | `/pl/magazyn/…` | Editorial Hub mit 6 Artikeln, Artikel mit Teilen |
| `/franchise`, `/investoren`, `/partner` | `/en/franchise`, `/en/investors`, `/en/partners` | `/pl/franczyza`, `/pl/inwestorzy`, `/pl/partnerzy` | B2B-Zielgruppen inkl. Lead-Formularen (Prototyp: sendet nichts) |
| `/ueber-uns`, `/jobs`, `/faq` | `/en/about`, `/en/jobs`, `/en/faq` | `/pl/o-nas`, `/pl/kariera`, `/pl/faq` | Story, Gründer & Team, Employer Branding (Personio), FAQ live aus der API |
| `/impressum`, `/datenschutz`, `/agb` | `/en/imprint`, `/en/privacy`, `/en/terms` | `/pl/nota-prawna`, `/pl/polityka-prywatnosci`, `/pl/regulamin` | Rechtstexte |
| `/sitemap`, `/content-modell` | `/en/sitemap`, `/en/content-model` | `/pl/mapa-strony`, `/pl/model-tresci` | Sitemap aller Seiten; Content-Modell (jedes Modul und Feld mit Datenquelle) |

Nicht verlinkt und `noindex`: `/styleguide` (Komponenten-Übersicht, Easter Egg im Footer), `/coming-soon` (Ziel der Event-Anmeldung in App und Web-App, solange die Events Mock-Daten sind und `NEXT_PUBLIC_EVENT_LINKS_LIVE` nicht gesetzt ist – siehe `src/lib/site.ts`). Die 404-Seite mit Padel-Pong ist absichtlich über „404“ im Footer erreichbar.

## Struktur

- `src/app/(de)/…`, `src/app/(en)/en/…` und `src/app/(pl)/pl/…` – dünne Routen-Wrapper je Sprache (eigene Root-Layouts, `lang`, hreflang)
- `src/views/<bereich>/` – Seitenlogik, sprachunabhängig (`locale`-Prop)
- `src/lib/content/*.ts` – Texte als `{ de, en, pl }` (später Contentful-Module, Modell in `contentModel.ts`)
- `src/lib/i18n/` – Locales, lokalisierte Pfade (`href()`), UI-Wörterbuch
- `src/lib/data/` – Datenfassade (Contentful → Mock)

## Design-System

- Tokens in `src/app/globals.css` – wertgleich mit der Figma-Library „PadelCity Website Relaunch“ (`figma/tokens/tokens.json`, geprüft mit `npm run tokens:check`); Farbwerte wie in „PadelCity [Master]“, dort heißt Ink Gray-Blue.
- **Farbrollen (verbindlich, Details im Kommentar oben in `globals.css`):**

  | Rolle | Farbe | Wofür |
  |---|---|---|
  | Primär | Brand-Gradient Purple `#8412B5` → Magenta `#E005C3` (`bg-brand-gradient`) | Primäre CTAs (inkl. runder Pfeil auf weißen Buttons), aktive Zustände (aktiver Tab, gewählter Filter-Chip/Segment, gewählte Option, offenes Akkordeon), lila Flächen und Glows (`shadow-glow`) |
  | Sekundär | Weiß auf Ink | Text, **alle** Icons (Ausstattung, Sportarten, Kontakt, Social, Filter …), Outline-Buttons, Rahmen, Hover (→ Weiß bzw. Magenta-300 bei Links) |
  | Highlight | Optic Yellow `#DFFF4F` (Tennisball-Farbe) | **Nur:** `<Accent>`-Brush-Wort, Ticker (Home), Level-Labels (`Chip tone="level"`), Coach-Statistikzahlen, Newsletter-Modul, Tastatur-Fokusring/Skip-Link, aktiver Pin + Label auf der Home-Karte, Footer-Padelball |
  | Status | Success / Danger / Warning | Nur System-Feedback |

  Kontrast (WCAG AA): Weiß auf Gradient ≥ 4,5:1, Text-Verlauf (Magenta-400 → Purple-400) auf Ink ≥ 4,4:1, Magenta-300 auf Ink ≈ 7:1, Optic-Yellow-Fokusring auf Ink ≈ 17:1 (Token-Name im Code: `optic-*`). Druckwerte: Pantone 388 C/U und CMYK 20/0/100/0 als Empfehlung, final zu prüfen.
- Vergleichs-Umschalter nur auf der Startseite (unten links, für die Marken-Diskussion): Highlight-Farbe (`HighlightDemo`) und Dunkel/Hell (`ThemeDemo`). Hell tauscht per `html[data-theme="light"]` die Flächen-Tokens; Fotos, Verläufe, Header und Footer bleiben dunkel (`.theme-dark`), Highlight-Text wird auf Hell Lila. Nichts wird gespeichert; Dunkel bleibt der Standard. Figma-Gegenstück: Entwurf „Startseite · Light Mode“ ohne Library-Variablen.
- Schriften wie in der App: Söhne Schmal Fett Kursiv (Headlines), Good Brush (Akzentwort), Poppins (Text).
- Icons: App-Icons aus `mobile-app-flutter/assets/icons` (als CSS-Mask), sonst lucide.

## Qualität

Checks und Reihenfolge: [`QA.md`](QA.md) – u. a. `npm run qa` (alle Seiten in 390, 768 und 1440 px: Links, Konsole, Layout, Bilder, axe, Interaktionen, Weiterleitungsliste, SEO und strukturierte Daten). Dieselben Checks laufen in der CI vor jedem Deploy.

## Offene Themen für den Workshop

1. **Contentful-Zugriff** – direkt (read-only Delivery API beim Build) oder über den PadelCity-API-Layer, wie Elephant vorschlägt? Für Marketing-Inhalte und Club-Stammdaten ist der direkte Weg einfacher und berührt das Buchungssystem nicht.
2. **Content-Modell** – stabile Club-Slugs, Website-Sichtbarkeits-Flag (heute nur `isShownInApp` in der api-platform-DB), englische Club-Texte, Marketing-Events ohne Buchungsdaten, Coach-Kennzahlen (Std. on Court, Trainierende) ohne API-Felder.
3. **App-Deeplinks** – Alle App-Links laufen über `link.padelcity.de` (`deeplinks` in `src/lib/site.ts`): Club, Open Matches, Event-Liste, Gutscheine; ohne App leitet der Link-Service auf padelcity.de/app/ weiter. UTM: `utm_source=padelcity-website`, `utm_medium=website`, `utm_campaign=<seite>-page`, `utm_content=<cta>`; Store-Badges mit App-Store-`ct` bzw. Play-`referrer`. Club-Links brauchen die App-Club-ID (api-platform `club.id`), die Website kennt nur die Contentful-ID – im Prototyp eine feste Tabelle (`src/lib/appClubs.ts`); für den Live-Betrieb eine Quelle festlegen (z. B. öffentlicher Endpunkt mit `contentful_id` → `id`). Offen: Event-Links (warten auf echte Event-IDs), QR-Code für Desktop.
4. **Karten-Provider** – CARTO verlangt inzwischen API-Key; Prototyp nutzt abgedunkelte OSM-Kacheln. Anbieter + Key festlegen.
5. **Google-Bewertungen** – Rating ist Mock; Quelle (Places API) + Caching/Lizenz klären.
6. **Tracking/Consent** – CTAs tragen `data-track`-Attribute; GA4 Server-Side + CMP noch nicht eingebaut.
7. **Inhalte** – `TODO(content)`-Stellen nach Zuständigkeit in `HANDOVER.md` (Abschnitt 8); einige Clubs mit generischen Fotos (`public/images/SOURCES.md`).
8. **Ziel-Stack** – Der Prototyp läuft auf Next.js 15.5 (alle Audit-Findings behoben bis auf `zod` in der Code-Connect-CLI, nur Dev-Tool). Für den Produktiv-Build direkt auf Next.js 16 aufsetzen.

## Figma Code Connect

`figma/` holds Code Connect templates (`*.figma.ts`) that link the web library in the Figma file
„PadelCity Website Relaunch“ to the React components here (54 components, 86 icons, 5 logos, 3 country flags). Dev Mode then shows
the matching code snippet for a selected component. Every library component has exactly one code component – new
patterns are built as a code component first, then as a library component.

- Config: `figma.config.json` (label „React“, language tsx). The templates are excluded from the app's
  `tsconfig`/ESLint and checked separately: `npm run figma:check` (types, overview up to date, unique ids, and that every
  template's source file, import path and imported names exist in the code).
- Publish (needs the Figma library to be published and an Organization/Enterprise plan):
  `FIGMA_ACCESS_TOKEN=… npm run figma:publish` (token with Code Connect write scope, e.g. from the keychain:
  `FIGMA_ACCESS_TOKEN=$(security find-generic-password -s <entry> -w) npm run figma:publish`).
- Overview: `/styleguide#code-connect` lists every mapping (Figma name, code component, file, Figma properties, notes),
  generated from the templates into `src/lib/codeConnect.json` by `node figma/overview/build-overview.mjs`;
  `npm run figma:check` fails when the list is out of date.
- When a library component becomes a variant set (e.g. a new `Device` variant), its node ID changes: update the
  `url` in the template, otherwise `figma:publish` rejects it as "not a top level component".
- Library quality audit: `figma/audit/library-audit.js` (run via the Figma MCP tool `use_figma`, see
  `figma/audit/README.md`). Run it after every library change and before every publish.
- Design tokens: `figma/tokens/tokens.json` (DTCG export of all variables, gradients, shadows and text styles) and
  `npm run tokens:check`, which compares it with the Tailwind theme in `globals.css`. See `figma/tokens/README.md`.
- Handover for the production build: [`HANDOVER.md`](HANDOVER.md).
