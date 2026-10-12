# Datenschicht (`src/lib/data`)

## Grundsatz

**Die Website liest nichts aus dem Buchungssystem.** Keine freien Slots, keine Verfügbarkeit, keine Auslastung („noch 2 Plätze frei“) – solche Daten bleiben in der App (PadelCity-Credo). Gebucht wird ausschließlich in der App; die Website verlinkt per Deeplink (`deeplinks.club(id)`, `deeplinks.event(id)` in `src/lib/site.ts`).

## Architektur

```
Seiten (Server Components) ──► @/lib/data (index.ts = Fassade)
                                   ├─ contentful.ts          Contentful Delivery API (Clubs, Courts, Facilities)
                                   ├─ contentful-coaches.ts  Coaches inkl. Kontakt + Trainingsangebot
                                   ├─ faq.ts                 FAQ (Hilfe-Bereich der App) via api-platform /faq, öffentlich
                                   ├─ mappers.ts             reine Mapping-Helfer (Slug, Öffnungszeiten, Region)
                                   └─ mock/*                 Fallback-Daten
```

| Daten | Quelle | Fallback |
|---|---|---|
| Clubs (Stammdaten, Bilder, Facilities, Öffnungszeiten, Basispreis) | Contentful, Locale `de`/`en` | Mock |
| Events (Marketing) | noch offen – Vorschlag: eigener Content-Type in Contentful | Mock |
| FAQ (`getFaq(locale)` in `faq.ts`) | api-platform `GET /faq/sections` + `/faq/sections/{id}/topics` (öffentlich) | `src/lib/content/faq.ts` (statisch) |
| Coaches (`getCoaches(locale)`) | Contentful `coach` + `coachTrainingTime` (`contentful-coaches.ts`) | `src/lib/content/people.ts` (ohne Kontakt/Preise/Zahlen) |

- Die Seite wird **statisch exportiert** (`output: "export"`); Contentful wird beim Build gelesen. Inhaltsänderungen → Pipeline neu laufen lassen (Schedule oder Contentful-Webhook auf den GitLab-Pipeline-Trigger).
- Fehlende Env-Variablen oder Fehler → stiller Fallback auf Mock-Daten (ein `console.warn` pro Build).
- Was Contentful nicht kennt (Teaser, kuratierte Tags, Franchise-Flag), wird aus dem Mock-Club mit gleichem Slug/Namen/Ort ergänzt.
- **Locale-Fallback**: Clubs, Courts und Coaches werden mit `locale=*` geladen. Text kommt in der Seitensprache, alle übrigen Felder (Bilder, `location`, `openingTimes`, Preis, Court-Typen) fallen auf die Default-Locale `en` zurück – api-platform pflegt/liest diese Felder nur in EN (`ClubHandler.php`, `setLocale(LOCALE__EN)`).
- **Supplement** (`mock/supplement.ts`, Stand padelcity.de/locations 12.10.2026): live Clubs, die in Contentful fehlen (Innsbruck), und geplante Clubs (`status: "planned"`, „– soon –“). Contentful gewinnt bei gleichem Slug/Namen. `getClubs()` liefert nur offene Clubs, `getPlannedClubs()` die geplanten (keine Detailseiten).
- **Land**: `deriveCountry()` (Subdivision → Zeitzone → Stadt/Name → PLZ-Format), weil `subdivisionCode` für Clubs im Ausland nicht verlässlich ist.

## Zugangsdaten

Nur ein **Contentful Content Delivery API**-Token (read-only, nur veröffentlichte Inhalte) wird gebraucht:

1. In Contentful den Space öffnen, in dem die Club-Stammdaten liegen (derselbe, den api-platform synchronisiert).
2. **Settings → API keys → Add API key**, Name z. B. `website-prototype`, Environment `master` auswählen.
3. *Space ID* und *Content Delivery API – access token* kopieren. (Den Preview-Token und Management-Tokens **nicht** verwenden.)
4. Lokal: `.env.local` aus `.env.example` anlegen. GitLab: als **masked** CI/CD-Variablen `CONTENTFUL_SPACE_ID`, `CONTENTFUL_ENVIRONMENT_ID`, `CONTENTFUL_DELIVERY_TOKEN` hinterlegen.

API-Keys anlegen dürfen Space-Admins; ein eigener Key pro Anwendung lässt sich später einzeln widerrufen.

## Offene Punkte für den Workshop

- **Contentful direkt vs. über den API-Layer**: Elephant schlägt vor, alles über den PadelCity-API-Layer zu laden. Für reine Marketing-Inhalte und Club-Stammdaten ist der direkte, read-only Delivery-API-Zugriff beim Build einfacher und berührt das Buchungssystem nicht. Entscheidung im Workshop.
- **Stabile Club-Slugs** in Contentful (SEO-URLs) statt aus dem Namen abgeleiteter Slugs.
- **Sichtbarkeit**: `isShownInApp`/`isActive` existieren nur in der api-platform-DB, nicht in Contentful → Website-Flag in Contentful nötig, damit Test- oder noch nicht eröffnete Clubs nicht erscheinen.
- **Events**: Quelle für Marketing-Events (Hero-Events, wiederkehrende Formate) ohne Buchungsdaten festlegen.
- **Google-Bewertungen**: Place-IDs pro Club + API-Key (Places API (New), Abrechnung über Google Cloud) – siehe unten.

## FAQ (`faq.ts`)

Die Seite `/faq` · `/en/faq` zeigt dieselben Fragen wie der Hilfe-Bereich der App. Das ist **redaktioneller Inhalt aus Contentful**, keine Buchungsdaten – deshalb ist es mit dem Grundsatz oben vereinbar.

- Quelle: api-platform (Prod) `GET https://api.prod.cluster.padelcity.de/faq/sections` → `[{ id, title, icon, totalTopics }]`, danach je Sektion `GET /faq/sections/{id}/topics` → `[{ id, title, html }]` (`FaqSection.php`, `FaqTopic.php`, `GetFaqSectionsProvider.php`). `^/faq` ist in `security.yaml` `PUBLIC_ACCESS` – kein Token.
- Sprache über den Header `Accept-Language: de|en` (nicht per Query-Parameter; `ContentfulLocaleService` fällt sonst auf EN zurück). Stand 13.10.2026: 11 Sektionen, 62 Fragen je Sprache.
- Wird **beim Build** gelesen (statischer Export), sequenziell (~24 Requests pro Build). Die Ingress drosselt generische User-Agents (`Python-urllib` → 429), daher sendet der Build einen eigenen User-Agent.
- Antwort-HTML wird mit einer Allow-List bereinigt (`p, br, ul, ol, li, strong, b, em, i, u, a[href]`); Links auf `padelcity.de/locations` werden auf die lokalisierte Standortseite umgeschrieben, externe Links öffnen in neuem Tab. Klartext (Suche, JSON-LD `FAQPage`) wird daraus abgeleitet.
- Fallback bei Fehler/Timeout/leerem Ergebnis: statische FAQ aus `src/lib/content/faq.ts` (fünf Themen: Buchen & Bezahlen, Vor Ort, Benefits, Academy & Events, Konto & App; offene Fakten als `TODO(content)`), ein `console.warn` pro Build.
- Env (optional): `FAQ_API_URL` (Default Prod-URL), `FAQ_SOURCE=static` erzwingt den Fallback (z. B. Offline-Build).
- Offen: Änderungen an den FAQ in Contentful erscheinen erst nach dem nächsten Build (wie Clubs/Coaches).

## Coaches aus Contentful

`getCoaches(locale)` (Fassade) → `fetchContentfulCoaches(locale)` in `contentful-coaches.ts` → `Person[]` (Typ aus `src/lib/content/people.ts`). Ohne Zugangsdaten, bei Fehlern oder 0 Einträgen: Fallback auf `coaches` aus `people.ts` (Stand padelcity.de). Head Coaches zuerst. Genutzt von der Academy-Seite (`CoachExplorer`) und der Clubseite (Abschnitt „Coachings“, `ClubCoaches`). Zuordnung Coach → Club über `resolveCoachClubs()` in `src/components/play/coaches/resolve.ts`: exakter Clubname („München Tucherpark“) oder eindeutige Stadt; ein mehrdeutiger Schlüssel (nur „München“) wird keinem Club fest zugeordnet – solche Coaches erscheinen auf den Clubs dieser Stadt nur als Hinweis „Coaches in München“, wenn dort kein Coach exakt passt.

| Website (`Person`) | Contentful | Hinweis |
|---|---|---|
| `name` | `coach.firstName` + `coach.lastName` | |
| `role` | `coach.title` | z. B. „Head Coach“ (Rollen-Filter matcht „head“) |
| `image` | `coach.ProfileImage` (Asset) | |
| `club` | `coach.clubs[]` → `club.name` | mit „ & “ verbunden; Club-Filter splittet wieder |
| `email` | `coach.EmailAddress` | `mailto:` |
| `phone` | `coach.phoneNumber` | Format „+49 170 1234567“ (Contentful-Validierung), `tel:` ohne Leerzeichen |
| `offers[].club` | `coachTrainingTime.club` → `club.name` | ein Eintrag je Coach × Club |
| `offers[].times` | `coachTrainingTime.trainingTimes` | `{ monday: { startsAt: "08:00", endsAt: "20:00" } \| null, … }`, Ortszeit Europe/Berlin |
| `offers[].prices` | `coachTrainingTime.trainingPrices` | `[{ durationInSeconds, pricePerOnePlayer … pricePerFourPlayer }]`, **Preis pro Person in Cent** |
| `hoursOnCourt`, `students` | – | gibt es nicht → UI zeigt „– folgt“; neue Felder am `coach`-Typ nötig |

- `coachTrainingTime` wird separat geladen (`include=1`, `locale=*`), gruppiert über `coach.sys.id`. Fehlt der Content-Type oder schlägt die Abfrage fehl, werden nur die Angebote weggelassen.
- Trainingszeiten und Preise sind **statische Angebotsdaten** (Wochenfenster + Preisliste), keine Buchungs-Verfügbarkeit – Gebucht wird weiterhin nur in der App. Währung: aktuell fest EUR (api-platform nimmt die Club-Währung, `MoneyFactory::forClub`) – für CH-Clubs offen.
- Nur Coaches mit gesetztem `UserId` (wie in api-platform: ohne verknüpften User ist der Coach in der App inaktiv). `UserId` wird nur gefiltert, nicht ausgegeben.
- Sprachen, Bio, Zitat, Stunden auf dem Platz und Anzahl Trainierende gibt es in Contentful nicht. Für die Website bräuchte es neue Felder am `coach`-Typ, z. B. `languages`, `bio` (lokalisiert), `hoursOnCourt`, `students`, `isShownOnWebsite`.
- Fotos kommen von `images.ctfassets.net` – der globale Image-Loader (`src/lib/image-loader.ts`) skaliert sie über die Contentful Images API.
- **Fallback `people.ts`**: keine E-Mail, kein Telefon, keine Preise/Zeiten, keine Zahlen – es wird nichts erfunden. Das Overlay zeigt „Kontakt über den Club“ (Link zur Clubseite bzw. Standortübersicht + `site.email`) und „Preise & Zeiten folgen“.

### Datenschutz: Kontaktdaten von Coaches

`EmailAddress` und `phoneNumber` sind **personenbezogene Daten**. Auf der öffentlichen Website dürfen sie **nur mit Einwilligung des Coaches** erscheinen (dokumentiert, widerrufbar). api-platform gibt sie bewusst nur in einzelnen Operationen heraus (PDCP-8195/8233, `CoachContactFieldExposureTest`). Bis es ein Freigabe-Flag gibt (Vorschlag: `coach.showContactOnWebsite`, Boolean, Default `false`), muss vor Go-live sichergestellt sein, dass alle veröffentlichten Coaches eingewilligt haben – sonst Kontakt nur über den Club bzw. dienstliche Adressen (z. B. Club-Mailbox) pflegen. Daten landen im statischen Export (HTML), also auch in Caches/Archiven: Widerruf = Eintrag ändern + neu bauen.

## Google-Bewertungen (`google-reviews.ts`)

**Keine erfundenen Sterne.** Mock-Clubs haben kein Rating mehr; `Club` hat bewusst kein `rating`-Feld. Bewertungen erscheinen nur im Modul `clubReviews` (Clubseite, Tab „Bewertungen“) und nur für Clubs in `reviewModuleClubs` (aktuell `muenchen-tucherpark`).

- `getClubReviews(club, locale)` ruft beim Build `GET https://places.googleapis.com/v1/places/{placeId}` mit Field-Mask `rating,userRatingCount,reviews,googleMapsUri` und `languageCode=de|en` auf – nur wenn `GOOGLE_PLACES_API_KEY` gesetzt ist **und** für den Slug eine Place-ID in `placeIds` steht (aktuell leer).
- Sonst (oder bei Fehlern, ein `console.warn` pro Build) → `{ status: "placeholder" }`: gleiches Layout, deutlich als Platzhalter markiert, keine Namen, keine Zitate, keine Zahlen („–“).
- Key: in der Google Cloud Console nur für die *Places API (New)* freischalten und per API-Restriction einschränken; GitLab: masked CI/CD-Variable `GOOGLE_PLACES_API_KEY`. Wird nur beim Build verwendet, nie im Browser.

**Darstellungsregeln (Google Maps Platform Policies):**
- Quelle sichtbar machen: „Google“-Attribution („Bewertungen von Google“, „via Google“; später ggf. Google-Logo nach Brand-Guidelines).
- Autor:innen-Name **so wie geliefert** (`authorAttribution.displayName`), verlinkt auf `authorAttribution.uri`, wenn vorhanden.
- Relative Zeit aus der API (`relativePublishTimeDescription`).
- Link zu Google Maps (`googleMapsUri`) – „Alle Bewertungen auf Google“.
- Die API liefert **max. 5** Bewertungen (Auswahl durch Google); wir zeigen 3 davon, ohne eigene Filterung nach Sternen.
- Bewertungstext **nie kürzen oder bearbeiten** (auch nicht per CSS abschneiden) – keine Übersetzung durch uns; `text` ist ggf. von Google übersetzt.
- Keine `aggregateRating`-Auszeichnung im JSON-LD (selbst ausgespielte Bewertungen wertet Google nicht als Rich Result).
- Static Export: Daten sind so aktuell wie der letzte Build → Pipeline-Schedule (z. B. täglich) einplanen; Google erlaubt Caching von Place-Inhalten nur eingeschränkt (Place-ID dauerhaft, Inhalte kurzfristig) – vor Go-live prüfen.
