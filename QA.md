# QA-Checkliste

Was vor einem Commit, nach einer Library-Änderung und vor einer Übergabe geprüft wird – in dieser Reihenfolge.
Die Befehle laufen im Prototyp-Ordner.

## 1. Code (bei jeder Änderung)

- [ ] `npx tsc --noEmit` – Typen
- [ ] `npm run lint`
- [ ] `npm run figma:check` – Code-Connect-Vorlagen kompilieren, `src/lib/codeConnect.json` ist aktuell, ids eindeutig,
      Quelldatei, Import-Pfad und importierte Namen jeder Vorlage existieren im Code
- [ ] `npm run tokens:check` – wenn `globals.css` oder Figma-Variablen geändert wurden (100 Werte Figma ↔ Theme)
- [ ] `npm run build` – statischer Export aller Routen
- [ ] `npm run qa` – alle Seiten in 390 und 1440 px, ca. 3 Minuten (Details unten)
- [ ] Styleguide (`/styleguide`) nachziehen, wenn sich ein Muster oder eine Regel geändert hat

### Was `npm run qa` prüft

Startet einen Server für `out/`, crawlt alle internen Links ab Startseite und Sitemaps (DE/EN/PL) und prüft dann
jede Seite:

| Prüfung | Fund, wenn … |
|---|---|
| Links | ein internes Link-Ziel nicht HTTP 200 liefert |
| Sitemap | eine Seite in keiner Sitemap steht (Ausnahme `/coming-soon/`, siehe `scripts/qa.mjs`) |
| Konsole | ein Konsolenfehler oder ein ungefangener Seitenfehler auftritt |
| Anfragen | eine Anfrage an die eigene Seite mit 4xx/5xx antwortet |
| Layout | die Seite horizontal scrollt |
| Bilder | ein Bild nicht lädt |
| Barrierefreiheit | axe einen Verstoß gegen WCAG 2.2 AA meldet |
| Interaktionen | Mobilmenü, Overlays (WhatsApp, Barrierefreiheit, Filter, Club-Info, Galerie, Coach), Suche, Sprachwechsel, Öffnungszeiten, FAQ oder Teilen nicht funktionieren – Overlays müssen in die Breite passen, einen Schließen-Button haben, mit Esc schließen und im geöffneten Zustand axe bestehen |

Bericht: `.qa/report.json`, Exit-Code 1 bei Funden. Schneller: `npm run qa -- --only /,/events/` (ohne
Interaktionen) oder `--widths 768`; `--no-interactions` lässt die Interaktionen weg. Erstmalig
`npx playwright install chromium` ausführen. Nicht gegen den Dev-Server testen – der hängt nach einigen hundert
Seitenaufrufen.

## 2. Figma-Library (nach jeder Änderung an Variablen, Styles oder Komponenten)

- [ ] `figma/audit/library-audit.js` per Figma-MCP (`use_figma`) ausführen – `findings` muss leer sein; neue
      Ausnahmen nur mit Begründung im Skript (`EXCEPTIONS`) und in `figma/audit/README.md`
- [ ] Neue oder geänderte Komponenten per Screenshot ansehen, auch in schmaler und breiter Instanz
      (wachsen Bilder mit, brechen Texte um?)
- [ ] Feste Texte und Beispielwerte gegen den Code prüfen (Beschriftungen wie im Code, Beispielzahlen nur, wenn sie
      der Code auch zeigt)
- [ ] Neue Komponente: Beschreibung mit Code-Pfad, Code-Connect-Vorlage in `figma/components/` mit Kopfzeilen
      `url`, `source`, `component`, `figma`
- [ ] Komponente wurde zum Variantenset (z. B. neue `Device`-Variante): `url` in der Vorlage auf die neue Set-ID
      ändern – sonst lehnt `figma:publish` sie ab
- [ ] Vor `figma:publish`: `node figma/overview/verify-targets.mjs` → Ausgabe per `use_figma` ausführen; `problems`
      muss leer sein (jede Vorlage zeigt auf eine Komponente oberster Ebene mit dem erwarteten Namen)
- [ ] `node figma/overview/build-overview.mjs`, dann die Figma-Seite „🔗 Code Connect“ neu erzeugen
      (`node figma/overview/figma-page.mjs` → `use_figma`)
- [ ] Bei geänderten Variablen: `figma/tokens/export-tokens.js` ausführen, `tokens.json` speichern, `npm run tokens:check`
- [ ] Library in Figma veröffentlichen, danach `npm run figma:publish`
- [ ] „📖 Start hier“ aktualisieren (Komponentenzahl, neue Seiten)

## 3. Figma-Captures (Seiten des Prototyps in Figma)

- [ ] Während der Aufnahme nichts am Code ändern (Neuladen bricht die Aufnahme ab)
- [ ] Danach Schriften zuordnen und Konturtexte nachziehen – siehe `figma/capture/README.md`
- [ ] Desktop 1440, Tablet 768 und Mobil 390 pro Seitentyp nebeneinander
- [ ] Content-Modell geändert: `node figma/content-model/build-annotations.mjs` und die Annotationen in Figma
      nachziehen (siehe `figma/content-model/README.md`)

## 4. Inhalte (vor jeder Übergabe)

- [ ] Keine Daten aus dem Buchungssystem – einzige Ausnahme Event-Detail: max. Teilnehmer, freie Plätze, Storno-Tabelle
- [ ] Nur freigegebene Kennzahlen (30+ Clubs, 200+ Courts, 25+ Städte, 3 Länder), keine Finanzierungszahlen
- [ ] Keine erfundenen Fakten, Personen oder Links; Platzhalter bleiben als solche erkennbar
- [ ] Neue offene Inhalte als `TODO(content)` im Code und in `HANDOVER.md` (Abschnitt 8) nach Zuständigkeit
- [ ] Code-Kommentare „Contentful module: …“ nennen Modul-IDs aus `src/lib/content/contentModel.ts`
- [ ] Seiten, deren Inhalt in allen Sprachen deutsch ist (Styleguide, Content-Modell), tragen `lang="de"`

## 5. Übergabe

- [ ] Alle Punkte aus 1 und 2 grün
- [ ] `HANDOVER.md` aktuell: Komponenten, Qualitäts-Gates, offene Punkte, offene Inhalte
- [ ] `README.md`: Grundsätze, Seitenübersicht, Workshop-Themen und Code-Connect-Zahlen aktuell
- [ ] Deploy auf GitHub Pages erfolgreich (`gh run list`) und Library in Figma veröffentlicht
      (keine Komponente im Status „geändert“)
