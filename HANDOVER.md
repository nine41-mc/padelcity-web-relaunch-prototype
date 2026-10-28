# Übergabe an den Produktiv-Build (Next.js)

Der Prototyp ist kein Produktivcode, aber auf dem Ziel-Stack gebaut (Next.js App Router, React 19, TypeScript strict,
Tailwind CSS v4, Contentful). Foundations und Komponenten sind so geschnitten, dass sie 1:1 übernommen werden können:
Jede Komponente der Figma-Library hat genau eine Code-Komponente, verknüpft per Code Connect.

## 1. Foundations – direkt übernehmen

| Was | Wo | Hinweis |
|---|---|---|
| Tailwind-Theme (Farben, Radien, Breakpoints, Schatten, Animationen) | `src/app/globals.css` (`@theme`) | wertgleich mit den Figma-Variablen, geprüft mit `npm run tokens:check` |
| Design Tokens (DTCG) | `figma/tokens/tokens.json` | alle 200 Variablen inkl. Aliasse und Responsive-Modi, Verläufe, Schatten, Text-Styles – Basis für Style Dictionary |
| Verläufe | `--gradient-brand` (313°), `--gradient-brandbook` (120°) + Utilities `bg-brand-gradient`, `bg-brandbook-gradient`, `text-brand-gradient` | `globals.css` |
| Abstands-Skala für Kacheln und Panels | Utilities `pad-card` (20), `pad-panel` (24/32), `pad-banner` (24/40/56) | Figma: `Layout/pad-*` (05 Responsive) – keine Einzelwerte daneben |
| Container | Utility `container-site` (max. 1440, Rand 16/32/64) | Figma: `Layout/gutter`, `Layout/container-max` |
| Schriften | `src/app/fonts.ts` | Söhne Schmal und Good Brush sind lizenziert und liegen in einem privaten Repo (Deploy-Key im CI) |
| Breakpoints | Phone < 768 · Tablet `md` ≥ 768 · Desktop `lg` ≥ 1200 | Figma-Modi Mobile / Tablet / Desktop |
| Farbrollen | Kommentar oben in `globals.css`, Tabelle in `README.md` | Primär (Verlauf) · Sekundär (Weiß) · Highlight (Optic Yellow, nur definierte Stellen) · Status |

## 2. Komponenten

Alle Code-Komponenten liegen unter `src/components/`; die Code-Connect-Templates in `figma/components/` nennen je
Komponente Quelle und Figma-Node.

| Bereich | Komponenten (Datei) |
|---|---|
| Basis (`ui/`) | Button (4 Varianten), Chip, Eyebrow + Headline + Accent (`Headline.tsx`), Section, Select, SearchInput, FaqItem/FaqGroup, CardArrow, CarouselArrow, InfoTile, ShareButton, Overlay/OverlaySection, StoreBadges, Marquee (Ticker) |
| Layout (`layout/`) | Header mit NavLink (Nav Item), MobileMenu, LanguageSwitch, Footer |
| Karten (`cards/`, `brand/`, `play/coaches/`) | ClubCard, EventCard, ArticleCard, CoachCard, KpiTiles, TestimonialCard, VoucherCard, PersonCard, OpenStatus (`ClubMeta.tsx`) |
| Events (`events/`, `play/`) | FactRow, EventSignupCard, CancellationTable (`EventFacts.tsx`), EventSignup, Countdown |
| Standorte (`locations/`) | CourtPill, AppBookingBar, Filter-Chip (`FilterSheet.tsx`), Map-Pin (`ClubMap.tsx`) |
| Module (`modules/`, `brand/`, `home/`) | PageHero, HomeHero, GermanyMap (Club Map), SectionIntro, NewsletterSignup, PartnerBand |
| Barrierefreiheit (`a11y/`) | A11yPanel; `useSystemReducedMotion` in `src/lib/a11y.ts` (hydrationssicher) |

Seitenmodule (Header, Home Hero, Page Hero, Section, Partner Band, Footer) haben in Figma die Variante
Device=Desktop/Mobile; Templates für Startseite und Event-Detail liegen auf der Seite „🧱 Templates“ in 1440 und 390 px.

Regel: Neue Muster entstehen erst als Code-Komponente, dann als Library-Komponente – nie als Kopie im Seiten-Code.
Der Styleguide (`/styleguide`) zeigt alle Muster mit Zuständen; `/styleguide#code-connect` die vollständige Zuordnung
Library ↔ Code (Figma-Name, Komponente, Datei, Figma-Eigenschaften, Hinweise), generiert aus den Code-Connect-Vorlagen.

## 3. Inhalte und Daten

- **Content-Modell:** Seite `/content-modell` (aus `src/lib/content/contentModel.ts`) und die Figma-Seite
  „🧩 Content-Modell“ mit 176 Annotationen – jedes Modul mit seinen Feldern, der Datenquelle (API vorhanden, API
  erweitern, neuer Contentful-Space, externer Dienst, unklar) und Hinweisen.
- **Datenschicht:** `src/lib/data/` als Fassade (Contentful → Mock-Fallback), Details in `src/lib/data/README.md`.
- **Grundsatz:** keine Buchungssystem-Daten auf der Website. Einzige Ausnahme (seit 27.10.2026): Event-Detail mit
  max. Teilnehmern, freien Plätzen (live) und der Storno-Tabelle für die Regel „kostenfrei bis 24 h vor Start“.
- **Texte:** `src/lib/content/*.ts` (DE/EN/PL) bilden die späteren Contentful-Einträge ab; UI-Strings in
  `src/lib/i18n/dictionaries.ts`, lokalisierte Pfade über `href()`.

## 4. Nicht übernehmen

- `scripts/encrypt-export.mjs`, `public/sw.js` – Passwortschutz nur für das Prototyp-Hosting auf GitHub Pages.
- `src/lib/data/mock/*` und Platzhalter: Testimonials (Einwilligung offen), Google-Rating, LinkedIn-Link auf die
  Firmenseite, Coach-Kennzahlen (Beispielwerte 7.000 Std. on Court / 350 Trainierende, von PadelCity am 13.10.2026
  vorgegeben, bis echte Werte je Coach vorliegen – `EXAMPLE_COACH_STATS` in `src/lib/data/index.ts`).
- `AGENTS_BRIEF.md` – historischer Arbeitsstand, teils veraltet.

## 5. Qualitäts-Gates

| Prüfung | Befehl |
|---|---|
| Typen | `npx tsc --noEmit` |
| Lint | `npm run lint` |
| Code-Connect-Templates und -Übersicht | `npm run figma:check` |
| Tokens Figma ↔ Theme | `npm run tokens:check` |
| Figma-Library (Variablen, Bindungen, Kontrast, Styles) | `figma/audit/library-audit.js` per `use_figma`, siehe `figma/audit/README.md` |
| Seiten: Links, Sitemap, Konsole, Layout, Bilder, axe (WCAG 2.2 AA) | `npm run build && npm run qa` |

Die vollständige Checkliste mit Reihenfolge steht in `QA.md`. Stand 29.10.2026: `npm run qa` über alle 205 Seiten
(DE/EN/PL) in 390 und 1440 px ohne Fund. Im Produktiv-Build gehört dieser Lauf als CI-Schritt dazu.

Code Connect veröffentlichen: Library in Figma publizieren, dann `npm run figma:publish` mit einem Token mit
Code-Connect-Schreibrecht.

## 6. Für den Produktiv-Build

- **Next.js 16** statt 15 (der Prototyp bleibt auf 15.5; Audit-Findings dort behoben).
- **SEO:** übernehmen lassen sich `hreflang` (`alternates()` in `src/lib/i18n/routes.ts`, auf allen öffentlichen
  Seiten) und die strukturierten Daten (Organization, SportsActivityLocation, SportsEvent, Article, FAQPage,
  MobileApplication). Neu im Produktiv-Build: `sitemap.xml`, `robots.txt` und Open-Graph-Bilder pro Seitentyp – der
  Prototyp braucht sie als passwortgeschützter Export nicht.
- **Tracking und Consent:** GA4 server-side und CMP; die CTAs tragen bereits `data-track`-Attribute.
- **Weiterleitungen (301) von padelcity.de:** fast alle URLs ändern sich (z. B. `/padelcity-unser-team/` →
  `/ueber-uns/`, `/berlin/` → `/standorte/berlin/`). Entwurf mit allen 139 URLs der heutigen Sitemap (Stand
  28.10.2026): `seo/redirects-draft.csv` – 93 eindeutig zugeordnet, 8 zu prüfen, 38 offen (vor allem alte
  Blog-Artikel und Portfolio-Einträge, die es im neuen Magazin nicht gibt; Leipzig und Neufahrn; die
  Bestätigungsseite für das Newsletter-Double-Opt-in). Ohne Weiterleitungen gehen Rankings und externe Links verloren.

## 7. Offene Punkte

- **Kontrast Verlaufswerte:** Kennzahlen in `text-brand-gradient` (KPI, Info Tile) erreichen am lila Startpunkt
  nur ~2,3:1 auf Ink – im Audit als bekannte Ausnahme geführt, Entscheidung beim Design-Team.
- **Event-Karten:** Level und Wiederholung kommen weder aus der APL noch aus Contentful.
- **Öffnungszeiten-Liste** (`locations/ClubHours.tsx`) ist nicht als eigene Library-Komponente angelegt; der
  Status steht als Open Status in der Library.
- **Personenfotos:** ohne bestätigtes Foto zeigt die Person Card den Marken-Platzhalter mit Initialen.
- **Dev-Warnung:** der eigene `next/image`-Loader meldet im Dev-Modus eine Warnung; im statischen Export ohne Folgen.

## 8. Offene Inhalte (nach Zuständigkeit)

Im Code als `TODO(content)` markiert (`grep -rn "TODO(content)" src`); hier nach Ansprechpartner sortiert.

| Wer | Was | Stelle im Code |
|---|---|---|
| Events-Team | finale Texte, Zeitpläne und Partner der Hero-Events; Ticketing („Zuschauer frei“); Preisgeld (Platzhalter `[XX.XXX] €`) | `lib/content/events.ts` |
| Ops / AGB | Fristen für anteilige Zahlung; Storno-Fenster und Gebühren; Leihschläger und -bälle in jedem Club; Partner-Benefits je Club | `lib/content/faq.ts` |
| HR | Benefits; Personio-Subdomain und Karriereseiten-Design (danach Vorschau entfernen) | `lib/content/jobs.ts`, `components/brand/PersonioJobs.tsx` |
| Franchise-Team | Mindestanzahl Courts, Deckenhöhe, Investitionsrahmen – erst nach Freigabe | `lib/content/franchise.ts` |
| Investor Relations | Downloads als echte Dateien; eigenes IR-Postfach; Series-A-Details nur nach Freigabe | `lib/content/investors.ts`, `views/home/HomeView.tsx` |
| Academy | Texte prüfen; Preisliste vor Go-live bestätigen; Benefit-Regeln je Programm; welche Clubs Academy anbieten; YouTube-IDs „Learn with PadelCity“ | `lib/content/academy.ts`, `views/academy/AcademyView.tsx` |
| Marketing / Brand | Texte der App-Seite; Zahlungsarten; Timeline und Werte gegen das Brandbook; Personas Sponsoring; Einwilligungen der Testimonials | `lib/content/app.ts`, `about.ts`, `sponsoring.ts`, `testimonials.ts` |
| Content / Fotos & Video | Galerien je Club (5+ Bilder) aus Contentful; Inline-Bilder und PadelCity-TV-IDs im Magazin; echtes Kinder-Foto; Social Wall live (Instagram API) | `views/locations/ClubView.tsx`, `lib/content/magazin.ts`, `components/modules/SocialWall.tsx` |
| Clubs / Daten | Ausstattung lokalisiert aus Contentful; Eröffnungsmonate geplanter Clubs (heute Platzhalter) | `components/locations/AppBooking.tsx`, `lib/data/mock/supplement.ts` |
| Technik | Google-Places-API-Key für Bewertungen; Magazin hinter die Datenschicht (`TODO(data)`) | `lib/data/google-reviews.ts`, `views/home/HomeView.tsx`, `views/magazine/MagazineView.tsx` |
