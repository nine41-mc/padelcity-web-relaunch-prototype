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
| Layout (`layout/`) | Header, MobileMenu, LanguageSwitch, Footer |
| Karten (`cards/`, `brand/`, `play/coaches/`) | ClubCard, EventCard, ArticleCard, CoachCard, KpiTiles, TestimonialCard, VoucherCard, PersonCard, OpenStatus (`ClubMeta.tsx`) |
| Events (`events/`, `play/`) | FactRow, EventSignupCard, CancellationTable (`EventFacts.tsx`), EventSignup, Countdown |
| Standorte (`locations/`) | CourtPill, AppBookingBar, Filter-Chip (`FilterSheet.tsx`), Map-Pin (`ClubMap.tsx`) |
| Module (`modules/`, `brand/`) | SectionIntro, NewsletterSignup, PartnerBand |
| Barrierefreiheit (`a11y/`) | A11yPanel; `useSystemReducedMotion` in `src/lib/a11y.ts` (hydrationssicher) |

Regel: Neue Muster entstehen erst als Code-Komponente, dann als Library-Komponente – nie als Kopie im Seiten-Code.
Der Styleguide (`/styleguide`) zeigt alle Muster mit Zuständen und die Zuordnung Library ↔ Code.

## 3. Inhalte und Daten

- **Content-Modell:** Seite `/content-modell` (aus `src/lib/content/contentModel.ts`) und die Figma-Seite
  „🧩 Content-Modell“ mit 176 Annotationen – jedes Modul mit Contentful-Feldern, Quelle und Pflicht/Optional.
- **Datenschicht:** `src/lib/data/` als Fassade (Contentful → Mock-Fallback), Details in `src/lib/data/README.md`.
- **Grundsatz:** keine Buchungssystem-Daten auf der Website. Einzige Ausnahme (seit 27.10.2026): Event-Detail mit
  max. Teilnehmern, freien Plätzen (live) und der Storno-Tabelle für die Regel „kostenfrei bis 24 h vor Start“.
- **Texte:** `src/lib/content/*.ts` (DE/EN/PL) bilden die späteren Contentful-Einträge ab; UI-Strings in
  `src/lib/i18n/dictionaries.ts`, lokalisierte Pfade über `href()`.

## 4. Nicht übernehmen

- `scripts/encrypt-export.mjs`, `public/sw.js` – Passwortschutz nur für das Prototyp-Hosting auf GitHub Pages.
- `src/lib/data/mock/*` und Platzhalter (Testimonials, Coaches, Google-Rating, LinkedIn-Link auf die Firmenseite).
- `AGENTS_BRIEF.md` – historischer Arbeitsstand, teils veraltet.

## 5. Qualitäts-Gates

| Prüfung | Befehl |
|---|---|
| Typen | `npx tsc --noEmit` |
| Lint | `npm run lint` |
| Code-Connect-Templates | `npm run figma:check` |
| Tokens Figma ↔ Theme | `npm run tokens:check` |
| Figma-Library (Variablen, Bindungen, Kontrast, Styles) | `figma/audit/library-audit.js` per `use_figma`, siehe `figma/audit/README.md` |

Code Connect veröffentlichen: Library in Figma publizieren, dann `npm run figma:publish` mit einem Token mit
Code-Connect-Schreibrecht.

## 6. Offene Punkte

- **Kontrast Verlaufswerte:** Kennzahlen in `text-brand-gradient` (KPI, Info Tile) erreichen am lila Startpunkt
  nur ~2,3:1 auf Ink – im Audit als bekannte Ausnahme geführt, Entscheidung beim Design-Team.
- **Event-Karten:** Level und Wiederholung kommen weder aus der APL noch aus Contentful.
- **Öffnungszeiten-Liste** (`locations/ClubHours.tsx`) ist nicht als eigene Library-Komponente angelegt; der
  Status steht als Open Status in der Library.
- **Personenfotos:** ohne bestätigtes Foto zeigt die Person Card den Marken-Platzhalter mit Initialen.
- **Dev-Warnung:** der eigene `next/image`-Loader meldet im Dev-Modus eine Warnung; im statischen Export ohne Folgen.
