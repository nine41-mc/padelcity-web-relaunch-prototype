import {
  ArrowUpRight,
  CalendarDays,
  Check,
  ChevronDown,
  Facebook,
  Instagram,
  Linkedin,
  Youtube,
  Clock,
  LayoutGrid,
  LocateFixed,
  Mail,
  Map as MapIcon,
  MapPin,
  MessageCircle,
  Monitor,
  Phone,
  Search,
  SlidersHorizontal,
  Smartphone,
  X,
} from "lucide-react";
import type { Locale } from "@/lib/i18n/config";
import { getClubs, getEvents } from "@/lib/data";
import { Section } from "@/components/ui/Section";
import { Accent, Eyebrow, Headline, Lead } from "@/components/ui/Headline";
import { Button } from "@/components/ui/Button";
import { Chip } from "@/components/ui/Chip";
import { AppIcon } from "@/components/ui/Icon";
import { Marquee } from "@/components/ui/Marquee";
import { StoreBadges } from "@/components/ui/StoreBadges";
import { WhatsAppGroups } from "@/components/community/WhatsAppGroups";
import { ClubCard } from "@/components/cards/ClubCard";
import { EventCard } from "@/components/cards/EventCard";
import { cn } from "@/components/ui/cn";

/**
 * Hidden styleguide / pattern library (easter egg: footer © line).
 * Shows the real components of the prototype plus the reasoning behind colours, type, icons and copy.
 * Single source for the rules: the colour-role comment in src/app/globals.css – keep both in sync.
 */

const TOC = [
  ["haltung", "Haltung"],
  ["farben", "Farben"],
  ["typo", "Typografie"],
  ["buttons", "Buttons & Button-Sprache"],
  ["icons", "Icons"],
  ["chips", "Chips & Labels"],
  ["module", "Karten & Module"],
  ["flaechen", "Flächen, Radien, Schatten"],
  ["layout", "Layout & Breakpoints"],
  ["motion", "Bewegung"],
  ["a11y", "Barrierefreiheit"],
  ["sprache", "Sprache & Inhalte"],
  ["figma", "Figma-Abgleich"],
] as const;

const APP_ICONS = [
  "padel", "pickleball", "tennis", "squash", "badminton", "soccer", "multisport",
  "double_court", "single_court", "interactive_playwall", "ball_machine", "trophy", "users", "muscle",
  "parking_space", "locker_room", "shower", "sauna", "wc", "restaurant", "bar", "vending_machine",
  "shopping_bag", "reception", "wifi", "charging", "summer", "winter",
];

const UI_ICONS = [
  [ArrowUpRight, "ArrowUpRight", "Weiter / extern"],
  [MapPin, "MapPin", "Adresse"],
  [Clock, "Clock", "Öffnungszeiten"],
  [CalendarDays, "CalendarDays", "Datum"],
  [Phone, "Phone", "Telefon"],
  [Mail, "Mail", "E-Mail"],
  [MessageCircle, "MessageCircle", "WhatsApp"],
  [Search, "Search", "Suche"],
  [LocateFixed, "LocateFixed", "In meiner Nähe"],
  [SlidersHorizontal, "SlidersHorizontal", "Filter"],
  [LayoutGrid, "LayoutGrid", "Listenansicht"],
  [MapIcon, "Map", "Kartenansicht"],
  [Monitor, "Monitor", "Im Web"],
  [Smartphone, "Smartphone", "In der App"],
  [ChevronDown, "ChevronDown", "Auswahl"],
  [Check, "Check", "Gewählt"],
  [X, "X", "Schließen"],
] as const;

export async function StyleguideView({ locale }: { locale: Locale }) {
  const [clubs, events] = await Promise.all([getClubs(locale), getEvents({ locale })]);
  const club = clubs.find((c) => c.mainImage && c.defaultPricePerHour) ?? clubs[0];
  const event = events.find((e) => e.level && e.image) ?? events[0];

  return (
    <>
      {/* Intro */}
      <Section tone="purple" className="pt-36 md:pt-44 !pb-16">
        <div className="absolute inset-0 bg-court-lines opacity-50" aria-hidden />
        <div className="relative">
          <Eyebrow className="mb-6">Easter Egg · Prototyp Oktober 2026</Eyebrow>
          <Headline as="h1" size="lg" className="max-w-5xl">
            Styleguide & <Accent>Patterns</Accent>
          </Headline>
          <Lead className="mt-6 max-w-3xl">
            Die Bausteine des Relaunch-Prototyps und die Gedanken dahinter: Farbrollen, Schriften, Icons, Button-Sprache und Module. Alles, was du hier
            siehst, sind die echten Komponenten der Website.
          </Lead>
          <nav aria-label="Inhalt des Styleguides" className="mt-10 flex flex-wrap gap-2">
            {TOC.map(([id, label]) => (
              <a key={id} href={`#${id}`} className="inline-flex min-h-10 items-center rounded-full border border-white/40 bg-white/5 px-4 text-sm font-medium text-white/90 hover:border-white hover:text-white">
                {label}
              </a>
            ))}
          </nav>
        </div>
      </Section>

      {/* Haltung */}
      <Block id="haltung" eyebrow="01" title="Haltung" lead="PadelCity ist Deutschlands Nummer 1 im Padel. Die Website soll sich anfühlen wie ein Abend im Club: laut, schnell, gemeinsam.">
        <div className="grid gap-4 md:grid-cols-3">
          <Principle title="Dunkel ist die Bühne">Ink-Schwarz trägt die Seite. Fotos, das Verlaufs-Pink und ein einziger Neon-Akzent leuchten davor – wie Flutlicht auf dem Court.</Principle>
          <Principle title="Eine laute Stimme pro Fläche">Pro Abschnitt gibt es genau einen Hingucker: eine Headline mit Brush-Wort, ein Bild oder einen Call-to-Action. Alles andere tritt zurück.</Principle>
          <Principle title="Buchen passiert in der App">Die Website inspiriert und informiert, gebucht wird in der App. Darum führt jeder primäre Button genau dorthin – oder zur Event-Anmeldung im Web.</Principle>
        </div>
      </Block>

      {/* Farben */}
      <Block id="farben" eyebrow="02" title="Farben" lead="Drei Rollen, strikt getrennt. Jede neue Farbverwendung wird gegen diese Liste geprüft.">
        <div className="grid gap-5 lg:grid-cols-3">
          <RoleCard
            role="Primary"
            name="Brand-Verlauf"
            swatch={<div className="h-28 rounded-[16px] bg-brand-gradient" />}
            values="#8412B5 → #DC05A1"
            uses={["Primäre Buttons", "Aktive Zustände: Tab, Filter, Segment, gewählte Option", "Offene Akkordeons", "Lila Flächen und Glows"]}
          />
          <RoleCard
            role="Secondary"
            name="Weiß auf Ink"
            swatch={<div className="grid h-28 place-items-center rounded-[16px] border border-white/15 bg-ink-800 text-2xl font-semibold text-white">Aa</div>}
            values="#FFFFFF auf #0B0B0F"
            uses={["Fließtext und alle Icons", "Outline-Buttons, Rahmen, Hover", "Textlinks im Hover: Magenta 300", "Ausnahme: Öffnungsstatus auf Club-Karten in Magenta 300"]}
          />
          <RoleCard
            role="Highlight"
            name="Neon „Tennisball“"
            swatch={<div className="h-28 rounded-[16px] bg-neon-500" />}
            values="#B4E854"
            uses={["Brush-Wort in Headlines", "Ticker-Bänder", "Level-Labels", "Coach-Kennzahlen", "Newsletter-Modul", "Fokus-Ring", "Aktiver Pin auf der Home-Karte", "Padelball im Footer", "Live-Punkt im Eyebrow"]}
          />
        </div>
        <Note>Neon ist knapp gehalten, damit es wirkt. Es erscheint nie als Hover-Farbe und nie als Text auf hellem Grund (Kontrast 1,35 : 1).</Note>

        <H3>Paletten</H3>
        <div className="space-y-4">
          <Palette name="Purple" steps={[["50", "#f6e8fd"], ["200", "#dda2f6"], ["400", "#ba45ed"], ["500", "#8412b5"], ["700", "#660e8b"], ["900", "#22052e"]]} />
          <Palette name="Magenta" steps={[["50", "#fee6fb"], ["200", "#fd9bf0"], ["300", "#fc69e8"], ["500", "#e005c3"], ["700", "#960382"], ["900", "#32012b"]]} />
          <Palette name="Ink" steps={[["50", "#d2d3d5"], ["200", "#909197"], ["400", "#36384a"], ["600", "#1b1c26"], ["700", "#15171f"], ["800 · Figma 900", "#0b0b0f"]]} />
          <Palette name="Neon" steps={[["300", "#d4f58f"], ["400", "#c4ef6e"], ["500", "#b4e854"], ["600", "#95c93a"]]} />
          <Palette name="Status" steps={[["Erfolg", "#00b894"], ["Fehler", "#ff2e47"], ["Warnung", "#ffd500"], ["Chalk", "#f8f8f8"]]} />
        </div>
        <p className="mt-4 text-sm text-white/70">Purple, Magenta und Ink stammen aus der Figma-Library „PadelCity [Master]“ (dort „Gray-Blue“), die auch App und Admin-Portal nutzen. Achtung Benennung: Website ink-800 #0B0B0F entspricht Figma gray-blue-900; Figma gray-blue-800 #101117 nutzt die Website nicht. Neon ist für den Relaunch neu und steht noch nicht in der Library.</p>

        <H3>Kontraste (WCAG 2.2 AA)</H3>
        <Table
          head={["Kombination", "Kontrast", "Einsatz"]}
          rows={[
            ["Weiß auf Brand-Verlauf", "≥ 4,6 : 1", "Button-Labels – dafür wurde der Magenta-Stopp auf #DC05A1 justiert"],
            ["Weiß auf Ink 800", "19,8 : 1", "Fließtext"],
            ["Magenta 300 auf Ink 800", "≈ 7 : 1", "Textlinks im Hover, Öffnungsstatus"],
            ["Neon auf Ink 800", "≈ 13 : 1", "Fokus-Ring, Level-Labels, Akzente"],
            ["Neon auf Chalk", "1,35 : 1", "Verboten"],
          ]}
        />
      </Block>

      {/* Typografie */}
      <Block id="typo" eyebrow="03" title="Typografie" lead="Drei Schriften mit klaren Aufgaben: eine schreit, eine kritzelt, eine erklärt.">
        <div className="grid gap-5 lg:grid-cols-3">
          <TypeCard name="Söhne Schmal Fett Kursiv" role="Display" sample={<span className="font-display text-6xl font-extrabold italic uppercase leading-none">Game. Set. Match.</span>}>
            Headlines, Buttons, Zahlen, Ticker. Immer in Versalien und kursiv. Schmal geschnitten, deshalb eine Stufe größer setzen als Poppins.
          </TypeCard>
          <TypeCard name="Good Brush" role="Akzent" sample={<span className="font-brush text-6xl leading-none text-neon-500">noise</span>}>
            Genau ein Wort pro Headline über die Accent-Komponente: leicht gedreht, in Neon. Nie für ganze Sätze und nie für Fließtext.
          </TypeCard>
          <TypeCard name="Poppins" role="Text" sample={<span className="text-3xl font-semibold leading-tight">Let&apos;s play Padel.</span>}>
            Fließtext, Labels, Formulare, Navigation. Schnitte 400, 500, 600 und 700. Zeilenlänge maximal etwa 70 Zeichen.
          </TypeCard>
        </div>

        <H3>Headline-Größen</H3>
        <div className="space-y-6 rounded-[24px] border border-white/10 bg-ink-700 p-6 md:p-10">
          <Spec label="Headline xl · Home-Hero">
            <Headline as="p" size="xl">
              Drive the <Accent>Padel</Accent> Boom!
            </Headline>
          </Spec>
          <Spec label="Headline lg · Seiten-Hero">
            <Headline as="p" size="lg">
              Finde deinen Court. Starte dein <Accent>Game.</Accent>
            </Headline>
          </Spec>
          <Spec label="Headline md · Abschnitt">
            <Headline as="p" size="md">
              Better <Accent>together.</Accent>
            </Headline>
          </Spec>
          <Spec label="Headline sm · Unterabschnitt">
            <Headline as="p" size="sm">
              Events & Turniere
            </Headline>
          </Spec>
          <Spec label="Eyebrow">
            <Eyebrow>Experience for the win.</Eyebrow>
          </Spec>
          <Spec label="Lead">
            <Lead>Schlechte Nachrichten für deine Ausrede: Der nächste Court ist näher, als du denkst.</Lead>
          </Spec>
          <Spec label="Fließtext · Poppins 400, 16–18 px">
            <p className="max-w-2xl text-white/85">Padel ist der am schnellsten wachsende Sport Europas. Bei PadelCity spielst du in über 30 Clubs – indoor wie outdoor, für jedes Level.</p>
          </Spec>
          <Spec label="Label · Poppins 600, 13 px, Versalien, Sperrung 0,14 em">
            <p className="text-[13px] font-semibold uppercase tracking-[0.14em] text-white/75">Öffnungszeiten</p>
          </Spec>
        </div>
      </Block>

      {/* Buttons */}
      <Block id="buttons" eyebrow="04" title="Buttons & Button-Sprache" lead="Pillenform, Söhne Schmal, optional mit rundem Pfeil. Der Pfeil dreht sich beim Hover um 45° und zeigt: Hier geht es weiter.">
        <div className="grid gap-5 lg:grid-cols-2">
          <Demo label="primary · der Standard-CTA auf dunklem Grund">
            <Button href="#buttons">In der App buchen</Button>
          </Demo>
          <Demo label="gradient · Hauptaktion auf Karten und in Formularen">
            <Button href="#buttons" variant="gradient">Clubs finden</Button>
          </Demo>
          <Demo label="outline · zweite Aktion neben primary">
            <Button href="#buttons" variant="outline" arrow={false}>Format & Zeitplan</Button>
          </Demo>
          <Demo label="ghost · leise Aktion im Fließtext">
            <Button href="#buttons" variant="ghost" arrow={false}>Alle Events</Button>
          </Demo>
          <Demo label="neon · nur im Newsletter-Modul" className="bg-ink-800">
            <Button variant="neon" type="button">Anmelden</Button>
          </Demo>
          <Demo label="Größen sm · md · lg">
            <div className="flex flex-wrap items-center gap-3">
              <Button href="#buttons" size="sm">Small</Button>
              <Button href="#buttons" size="md">Medium</Button>
              <Button href="#buttons" size="lg">Large</Button>
            </div>
          </Demo>
        </div>

        <H3>So schreiben wir Buttons</H3>
        <DoDont
            dos={["Verb plus Ziel: „In der App buchen“, „Club finden“, „Route öffnen“", "Den Ort der Aktion nennen: „Im Web“ und „In der App“ bei der Event-Anmeldung", "Höchstens drei Wörter", "Du-Ansprache, aktiv: „Jetzt Padel spielen“"]}
            donts={["„Mehr erfahren“, „Hier klicken“, „Weiter“ ohne Ziel", "Zwei gleich laute Buttons, die dasselbe tun", "Neon-Buttons außerhalb des Newsletters", "Versprechen, die die Website nicht hält (z. B. freie Slots)"]}
          />
        <Note>Pro Bildschirm gibt es höchstens eine primäre Aktion. Auf Mobilgeräten übernimmt sie die Buchungsleiste unten, die ausblendet, sobald der Buchungsblock selbst sichtbar ist.</Note>
      </Block>

      {/* Icons */}
      <Block id="icons" eyebrow="05" title="Icons" lead="Zwei Familien, eine Regel: Icons sind weiß und stehen nie allein, wenn ihre Bedeutung nicht eindeutig ist.">
        <H3>App-Icons · Sportarten und Ausstattung</H3>
        <p className="mb-5 max-w-3xl text-white/75">Direkt aus der PadelCity App übernommen, damit Website und App dieselbe Bildsprache sprechen. Eingefärbt über currentColor.</p>
        <ul className="grid grid-cols-3 gap-2 sm:grid-cols-4 md:grid-cols-7">
          {APP_ICONS.map((name) => (
            <li key={name} className="flex flex-col items-center gap-2 rounded-[12px] border border-white/10 bg-ink-700 px-2 py-4 text-center">
              <AppIcon name={name} className="size-7 text-white" />
              <span className="break-all font-mono text-[11px] text-white/60">{name}</span>
            </li>
          ))}
        </ul>

        <H3>UI-Icons · Lucide</H3>
        <p className="mb-5 max-w-3xl text-white/75">Für Navigation und Bedienung: Lucide, Outline, Strichstärke 2 (Pfeile 2,5). Größen 16, 20 und 24 px.</p>
        <ul className="grid grid-cols-2 gap-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6">
          {UI_ICONS.map(([Icon, name, use]) => (
            <li key={name} className="flex items-center gap-3 rounded-[12px] border border-white/10 bg-ink-700 px-3 py-3">
              <Icon className="size-5 shrink-0 text-white" aria-hidden />
              <span className="min-w-0">
                <span className="block truncate font-mono text-[12px] text-white/85">{name}</span>
                <span className="block truncate text-[12px] text-white/60">{use}</span>
              </span>
            </li>
          ))}
        </ul>
        <H3>Social</H3>
        <ul className="flex flex-wrap gap-2">
          {[[Linkedin, "LinkedIn"], [Facebook, "Facebook"], [Instagram, "Instagram"], [Youtube, "YouTube"]].map(([Icon, name]) => {
            const I = Icon as typeof Linkedin;
            return (
              <li key={name as string} className="grid size-12 place-items-center rounded-full border border-white/25" title={name as string}>
                <I className="size-5" aria-hidden />
              </li>
            );
          })}
          <li className="grid size-12 place-items-center rounded-full border border-white/25 text-[11px] font-semibold" title="TikTok">TikTok</li>
        </ul>
        <p className="mt-3 text-sm text-white/70">Runde Outline-Buttons, im Hover weiß gefüllt. TikTok kommt als eigenes SVG (nicht in Lucide).</p>
        <Note>Icon-only-Buttons (Filter, Liste/Karte auf dem Handy) bekommen immer ein unsichtbares Label für Screenreader und eine Fläche von mindestens 44 × 44 px.</Note>
      </Block>

      {/* Chips */}
      <Block id="chips" eyebrow="06" title="Chips & Labels" lead="Kleine Etiketten für Kategorie, Level und Zustand.">
        <div className="flex flex-wrap items-center gap-3 rounded-[24px] border border-white/10 bg-ink-700 p-6">
          <Chip>Indoor</Chip>
          <Chip tone="gradient">Turnier</Chip>
          <Chip tone="solid">Neu</Chip>
          <Chip tone="dark">10 Fotos</Chip>
          <Chip tone="level">Level 4+</Chip>
          <span className="inline-flex items-center gap-1.5 text-sm font-semibold text-magenta-300">
            <Clock className="size-4" aria-hidden /> Geöffnet bis 22:00
          </span>
        </div>
        <Table
          head={["Variante", "Einsatz"]}
          rows={[
            ["default", "Eigenschaften: Indoor, Outdoor, Anzahl Courts"],
            ["gradient", "Event-Typ: Turnier, Training, Event"],
            ["solid", "Seltene Hervorhebung auf Bildern"],
            ["dark", "Auf Fotos, z. B. Bildanzahl in der Galerie"],
            ["level", "Spielstärke – die einzige Chip-Variante in Neon"],
            ["Öffnungsstatus", "Live-Info auf Club-Karten in Magenta 300, Court-Anzahl bleibt weiß"],
          ]}
        />
      </Block>

      {/* Module */}
      <Block id="module" eyebrow="07" title="Karten & Module" lead="Die wichtigsten Bausteine, live mit echten Daten.">
        <div className="grid gap-6 lg:grid-cols-2">
          <Demo label="ClubCard · Standorte, Academy, Franchise, Clubs in der Nähe" plain>
            {club && <ClubCard club={club} locale={locale} className="w-full max-w-md" />}
          </Demo>
          <Demo label="EventCard · Event-Liste und Clubseite" plain>
            {event && <EventCard event={event} locale={locale} className="w-full max-w-md" />}
          </Demo>
        </div>
        <H3>Ticker</H3>
        <div className="flex h-14 items-center overflow-hidden rounded-[16px] bg-neon-500 text-ink-800">
          <Marquee>
            {["30+ Clubs", "200+ Courts", "25+ Städte", "3 Länder", "#bettertogether"].map((item) => (
              <span key={item} className="flex items-center gap-8 px-4 font-display text-xl font-extrabold italic uppercase">
                {item} <span className="text-purple-600" aria-hidden>●</span>
              </span>
            ))}
          </Marquee>
        </div>
        <p className="mt-3 text-sm text-white/70">Nur freigegebene Kennzahlen. Der Ticker hält bei Hover und Fokus an.</p>
        <H3>Store-Badges</H3>
        <StoreBadges locale={locale} />
        <p className="mt-3 text-sm text-white/70">Offizielle Badges von Apple und Google, nicht nachgebaut. Nur auf der App-Seite – nicht im Footer und nicht auf Clubseiten, dort führt „In der App buchen“ direkt in die App.</p>

        <H3>Club-Poster („Clubs mit Vibe“ auf der Startseite)</H3>
        <p className="max-w-3xl text-white/75">
          Look aus den Instagram-Posts zu Neueröffnungen, automatisch für jeden Club: lila, körniger Himmel über dem Club-Foto, Stadt riesig in Poppins Bold (Silbentrennung
          automatisch, letzte Zeile als Outline), der Standort innerhalb der Stadt (z. B. Frankfurter Ring, Tucherpark) kleiner unter der Abrisskante, weiße Abrisskante. Oben links der Öffnungsstatus in PadelCity-Pink. Courts und Sportarten erscheinen erst beim Hover (auf Touch-Geräten
          immer sichtbar), damit das Poster ruhig bleibt.
        </p>

        <H3>Instagram-Bildwand (Startseite)</H3>
        <p className="max-w-3xl text-white/75">
          Dichtes Raster wie das Instagram-Profil: 3 Spalten auf dem Handy, 6 ab Tablet, Format 4 : 5, 4 px Abstand, Reels mit Play-Icon, im Hover lila Fläche mit Instagram-Icon.
          Jede Kachel öffnet @padelcity.de. Live werden die Posts serverseitig beim Build geladen (Instagram Graph API oder ein Feed-Tool mit JSON-Schnittstelle) – kein
          Fremd-Skript im Browser, damit kein zusätzlicher Consent nötig ist.
        </p>

        <H3>Club-Highlights (Clubseite)</H3>
        <p className="max-w-3xl text-white/75">
          Kreise wie Instagram-Story-Highlights unter dem Clubnamen: Verlaufsring = noch nicht angesehen, grauer Ring = angesehen. Der erste Kreis ist „Welcome to PadelCity
          &lt;Stadt&gt;“ im Magenta-Look der Instagram-Cover. Klick öffnet eine Story-Ansicht im Format 9 : 16 mit Fortschrittsbalken, Tippen links/rechts, Halten pausiert,
          Esc schließt. Highlights liefert die Instagram-API nicht – sie werden pro Club in Contentful gepflegt.
        </p>

        <H3>Offene Stellen (Jobs-Seite)</H3>
        <p className="max-w-3xl text-white/75">
          Direkt unter dem Hero: Filter nach Bereich und Standort, Stellenliste mit Bereich in Magenta 300, Titel in Söhne Schmal, Standort und Umfang mit Icons. Jede Stelle öffnet
          eine Bewerbungs-E-Mail mit Stelle und Standort im Betreff. Daneben die Kontakt-Kachel von Astrid Nindl (People &amp; Culture), auf dem Desktop mitlaufend.
        </p>

        <H3>Coming-soon-Seite mit Padel-Pong</H3>
        <p className="max-w-3xl text-white/75">
          Ziel aller Links, die im Prototyp noch ins Leere laufen würden (App-Deeplinks, Event-Anmeldung in der Web-App). Endloses Pong auf einem dunklen Court: Schläger in Purple
          und Magenta, Ball in Neon mit Leuchtspur, Rally-Zähler in Neon. Wer die Maus oder den Finger über das Feld bewegt, übernimmt den linken Schläger. Bei reduzierter Bewegung
          steht das Bild still. Zweisprachig, weil Links von DE- und EN-Seiten hier landen.
        </p>

        <H3>Clubkarte auf der Startseite</H3>
        <p className="max-w-3xl text-white/75">
          Deutschland im Brand-Verlauf mit Punktraster. Österreich und Polen sind grau und gestrichelt angedeutet, damit Innsbruck, Warschau, Krakau und Kielce nicht frei schweben.
          Beim Hover über das Land oder einen Pin darin färbt es sich ein – dieselbe Logik wie bei den Coach-Kacheln (erst grau, dann farbig). Nach rechts läuft Polen weich aus.
          Aktiver Pin und Label in Neon; geplante Clubs als gestrichelte Pins.
        </p>

        <H3>Presse-Logos („Bekannt aus …“)</H3>
        <p className="max-w-3xl text-white/75">
          Laufband wie bei den Partnern, nur auf der Magazin-Seite. Original-Logos von padelcity.de, weiß auf Schwarz, 70 % Deckkraft, im Hover voll. Logos werden in der Höhe optisch
          angeglichen, nicht alle gleich hoch gesetzt.
        </p>

        <H3>WhatsApp-Community-Overlay</H3>
        <div className="flex flex-wrap items-center gap-4 rounded-[24px] border border-white/10 bg-ink-700 p-6">
          <WhatsAppGroups locale={locale} label="Gruppe finden" variant="gradient" track="styleguide_whatsapp_overlay" />
          <p className="max-w-xl text-sm text-white/75">
            Es gibt keinen zentralen Community-Link. Jeder Einstieg (Startseite, Footer-Band) öffnet dieses Overlay mit der direkten Gruppe pro Standort, mit Suche.
            Geteilte Gruppen und Kanäle sind gekennzeichnet. Auf der Clubseite führt die Kachel direkt in die Gruppe des Clubs.
          </p>
        </div>

        <H3>Footer</H3>
        <ul className="grid gap-3 md:grid-cols-2">
          {[
            ["Neon-Ticker", "Übergang von der Seite in den Footer, freigegebene Kennzahlen"],
            ["Claim + Newsletter", "„Make some noise for Padel.“ links, das Newsletter-Modul steht rechts für sich allein"],
            ["WhatsApp-Band", "Volle Breite im Brandbook-Verlauf: „Never play alone.“ mit Button ins Gruppen-Overlay"],
            ["Drei Spalten", "„Fall in love with padel.“ + Follow us! mit allen Social-Profilen · Spielen · PadelCity inkl. Sitemap"],
            ["Social-Reihenfolge", "LinkedIn, Facebook, Instagram, YouTube, TikTok – wie auf padelcity.de"],
            ["Copyright-Zeile", "Öffnet diesen Styleguide (Easter Egg, ohne sichtbaren Hinweis)"],
          ].map(([t, d]) => (
            <li key={t} className="rounded-[16px] border border-white/10 bg-ink-700 p-5">
              <p className="font-semibold">{t}</p>
              <p className="mt-1 text-sm text-white/70">{d}</p>
            </li>
          ))}
        </ul>

        <H3>Standortfinder: Filter</H3>
        <p className="max-w-3xl text-white/75">
          Eine Zeile: Länder als Segment-Schalter (ab Tablet), Anzahl, Filter-Icon, Liste/Karte. Alle weiteren Kriterien liegen hinter dem Filter-Icon: Sortierung (Empfohlen,
          Entfernung, A–Z, Z–A), „Gerade geöffnet“, Sportarten, Ausstattung (Indoor, Outdoor, Panorama Court, Franchise) und auf dem Handy auch die Länder. Auf dem Handy als Bottom
          Sheet, ab Tablet als Panel von rechts. Aktive Kriterien färben das Icon im Verlauf und zeigen einen Zähler. Filter wirken sofort; der Button zeigt die Trefferzahl.
        </p>
      </Block>

      {/* Flächen */}
      <Block id="flaechen" eyebrow="08" title="Flächen, Radien, Schatten">
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          <Surface className="bg-ink-800 border border-white/10" name="Ink 800" text="Seitengrund" />
          <Surface className="bg-ink-700 border border-white/10" name="Ink 700" text="Karten, Panels" />
          <Surface className="bg-black border border-white/10" name="Black" text="Abschnittswechsel" />
          <Surface className="bg-brandbook-gradient" name="Brandbook-Verlauf" text="Bühnen-Abschnitte" />
          <Surface className="bg-ink-800 bg-court-lines border border-white/10" name="Court-Linien" text="Symbol aus dem Brandbook" />
          <Surface className="bg-ink-700 bg-grain border border-white/10" name="Grain" text="Filmkorn auf Heros" />
          <Surface className="bg-ink-700 shadow-elevated border border-white/10" name="Elevated" text="Schwebende Leisten" />
          <Surface className="bg-ink-700 shadow-glow border border-white/10" name="Glow" text="Hover auf Karten und Buttons" />
        </div>
        <H3>Radien</H3>
        <div className="flex flex-wrap items-end gap-4">
          {[["8", "rounded-[8px]", "Chips"], ["12", "rounded-[12px]", "kleine Kacheln"], ["16", "rounded-[16px]", "Medien"], ["20–24", "rounded-[24px]", "Karten"], ["32", "rounded-[32px]", "große Module"], ["Pille", "rounded-full", "Buttons, Filter, Suche"]].map(([r, cls, use]) => (
            <div key={r} className="text-center">
              <div className={cn("size-20 border-2 border-white/40 bg-white/5", cls)} />
              <p className="mt-2 text-sm font-semibold">{r}</p>
              <p className="text-[12px] text-white/60">{use}</p>
            </div>
          ))}
        </div>
        <Note>Die Library kennt radius-sm 4, md 8, lg 16, xl 24. Die Website nutzt 8 für Chips, 16 für Medien und 24 für Karten (deckungsgleich) und zusätzlich 12 und 32 sowie die Pillenform für Buttons – die fehlen in der Library.</Note>
        <H3>Abstände</H3>
        <div className="flex flex-wrap items-end gap-4">
          {[["xxs", 2], ["xs", 4], ["s", 8], ["m", 16], ["l", 24], ["xl", 32], ["xxl", 40], ["3xl", 48]].map(([n, v]) => (
            <div key={n as string} className="text-center">
              <div className="bg-brand-gradient" style={{ width: v as number, height: 48 }} />
              <p className="mt-2 text-sm font-semibold">{v}</p>
              <p className="font-mono text-[11px] text-white/60">spacing-{n}</p>
            </div>
          ))}
        </div>
        <p className="mt-3 text-sm text-white/70">Spacing-Skala aus der Library. Die Website hält sich an das 4/8-Raster; Abschnittsabstände (80 / 112 / 128 px) sind Website-spezifisch.</p>
      </Block>

      {/* Layout */}
      <Block id="layout" eyebrow="09" title="Layout & Breakpoints" lead="Mobile first: Laut Briefing kommen rund 80 % der Besuche vom Handy.">
        <Table
          head={["Gerät", "Breite", "Seitenrand", "Raster"]}
          rows={[
            ["Handy", "< 768 px", "16 px", "1 Spalte, Filter im Bottom Sheet, Buchungsleiste unten"],
            ["Tablet", "768–1199 px", "32 px", "2 Spalten"],
            ["Desktop", "≥ 1200 px", "64 px", "3–4 Spalten, Inhalt max. 1440 px"],
          ]}
        />
        <Note>Abschnitte haben 80 / 112 / 128 px Abstand oben und unten. Kacheln in einer Reihe sind gleich hoch, Inhalte springen beim Laden nicht (Layout Shift unter 0,02).</Note>
      </Block>

      {/* Motion */}
      <Block id="motion" eyebrow="10" title="Bewegung" lead="Bewegung belohnt Interaktion, sie unterhält nicht nebenbei.">
        <ul className="grid gap-3 md:grid-cols-2">
          {[
            ["Pfeil dreht 45°", "Buttons und Karten im Hover – das Signal für „los“"],
            ["Karten heben sich", "4 px nach oben plus Glow im Hover"],
            ["Bilder zoomen leicht", "Auf Karten, 700 ms"],
            ["Einblenden beim Scrollen", "Abschnitte erscheinen weich, sind aber nie unsichtbar, falls JavaScript fehlt"],
            ["Ticker", "Endlos, hält bei Hover und Fokus"],
            ["Reduzierte Bewegung", "Systemeinstellung wird respektiert: alle Animationen aus"],
          ].map(([t, d]) => (
            <li key={t} className="rounded-[16px] border border-white/10 bg-ink-700 p-5">
              <p className="font-semibold">{t}</p>
              <p className="mt-1 text-sm text-white/70">{d}</p>
            </li>
          ))}
        </ul>
      </Block>

      {/* A11y */}
      <Block id="a11y" eyebrow="11" title="Barrierefreiheit" lead="Ziel ist WCAG 2.2 AA – nicht als Abhaken am Ende, sondern als Designregel.">
        <ul className="grid gap-3 md:grid-cols-2">
          {[
            "Fokus-Ring in Neon, auf hellen Flächen automatisch in Ink",
            "Klickflächen mindestens 44 × 44 px",
            "Eigene Auswahllisten (Select) mit voller Tastatursteuerung",
            "Karten und Bottom Sheets lassen sich mit Esc schließen",
            "Jedes Bild hat einen Alternativtext, Icon-Buttons ein Label",
            "Sprunglink „Zum Inhalt springen“ ganz oben",
          ].map((t) => (
            <li key={t} className="flex gap-3 rounded-[16px] border border-white/10 bg-ink-700 p-4 text-white/85">
              <Check className="mt-0.5 size-5 shrink-0 text-white" aria-hidden /> {t}
            </li>
          ))}
        </ul>
        <p className="mt-6 flex flex-wrap items-center gap-3 text-sm text-white/70">
          Fokus testen:{" "}
          <button type="button" className="rounded-full border border-white/40 px-4 py-2 text-white">
            Mit Tab hierher springen
          </button>
        </p>
      </Block>

      {/* Sprache */}
      <Block id="sprache" eyebrow="12" title="Sprache & Inhalte" lead="Wir duzen, wir sind kurz, wir übertreiben nicht.">
        <H3>Claims</H3>
        <div className="flex flex-wrap gap-3">
          {["Game. Set. Match.", "Drive the Padel Boom!", "Loyalty hits reach.", "Experience for the win.", "Make some noise for Padel.", "Never play alone.", "Fall in love with padel.", "#bettertogether", "Let's play Padel!"].map((c) => (
            <span key={c} className="rounded-full bg-white/5 px-4 py-2 font-display text-xl font-extrabold italic uppercase">
              {c}
            </span>
          ))}
        </div>
        <H3>Was auf die Website darf – und was nicht</H3>
        <DoDont
          dos={[
            "Freigegebene Kennzahlen: 30+ Clubs, 200+ Courts, 25+ Städte, 3 Länder",
            "Echte Fotos aus den Clubs, echte Menschen: Gründer, Team, Coaches",
            "Clubnamen ohne „PadelCity“-Präfix in der Oberfläche",
            "Preise als Einstieg („ab 24 €/h“, auf Club-Karten unten rechts in der Headline-Schrift)",
          ]}
          donts={[
            "Buchungsdaten: freie Slots, Auslastung, „noch X Plätze“",
            "Erfundene Bewertungen, Testimonials oder Fakten",
            "Zahlen aus der Finanzierungsrunde",
            "Stockfotos von Menschen, die nicht bei uns spielen",
          ]}
        />
        <p className="mt-10 text-sm text-white/60">
          Quelle der Regeln im Code: <code className="font-mono">src/app/globals.css</code> (Farbrollen) und <code className="font-mono">src/components/ui</code>. Diese Seite ist absichtlich nicht verlinkt.
        </p>
      </Block>

      {/* Figma */}
      <Block id="figma" eyebrow="13" title="Abgleich mit der Figma-Library" lead="Referenz ist „PadelCity [Master]“ – dieselbe Library nutzen App und Admin-Portal (dort ergänzt um shadcn). Elephants Website-Entwurf hat noch keine eigene Library.">
        <H3>Was übereinstimmt</H3>
        <Table
          head={["Thema", "Website", "Figma-Library"]}
          rows={[
            ["Purple / Magenta", "purple-*, magenta-*", "purple/*, magenta/* – identische Werte"],
            ["Dunkle Flächen", "ink-50 … ink-700", "gray-blue-50 … gray-blue-700 – identisch"],
            ["Chalk", "#F8F8F8", "gray-25"],
            ["Status", "Erfolg #00B894, Fehler #FF2E47, Warnung #FFD500", "green-500, red-500, yellow-500"],
            ["Brandbook-Verlauf", "#AC007D → #791979 → #401B78", "Paint-Style „new_gradient“"],
            ["Display-Schrift", "Söhne Schmal Fett Kursiv, Versalien", "Headline 1 (44 px), Display 2/3 (32/24 px), Sperrung 0,5"],
            ["Brush-Schrift", "Good Brush für das Akzentwort", "Display 1 (128 px) und Skill-Level-Styles"],
            ["Textschrift", "Poppins 400–700", "Body 1/2, Subtitle, Caption, Button – alle Poppins"],
          ]}
        />
        <H3>Bewusste Abweichungen der Website</H3>
        <Table
          head={["Thema", "Website", "Library", "Warum"]}
          rows={[
            ["Brand-Verlauf", "#DC05A1 → #8512B5", "„gradient“ #E005A4 → #8512B5", "Magenta-Stopp minimal dunkler, damit weiße Button-Texte WCAG AA erreichen"],
            ["Seitengrund", "Ink 800 (#0B0B0F), Karten Ink 700", "color-background = gray-blue-700, Surface = gray-blue-500", "Website eine Stufe dunkler – Fotos und Neon wirken stärker"],
            ["Primary Button", "Weiße Pille mit Verlaufs-Pfeil oder Verlaufs-Pille", "Primary = flächig Purple 500, Hover Purple 700", "Elephant-Pitch; der Verlauf ist die Website-Signatur"],
            ["Secondary Button", "Outline weiß", "Outline Magenta", "Farbrolle Secondary = Weiß auf Ink"],
            ["Button-Schrift", "Söhne Schmal, Versalien", "Poppins Medium 14–18 px", "Stärkere Markenwirkung auf großen Flächen"],
            ["Gewählter Chip / Filter", "Brand-Verlauf", "Magenta (color-background-chip-selected)", "Gleiche Logik wie aktive Tabs"],
            ["Fokus-Ring", "Neon 2 px", "Magenta-Schatten 24 %", "Auf Ink deutlich sichtbarer (≈ 13 : 1)"],
            ["Labels / Overline", "Poppins 600, 13 px, Sperrung 0,14 em", "Overline 1: Poppins Bold 12/18", "Etwas größer für mobile Lesbarkeit"],
            ["Highlight-Farbe", "Neon #B4E854", "nicht vorhanden", "Neu für den Relaunch"],
          ]}
        />
        <H3>Vorschlag für die Library</H3>
        <ul className="grid gap-3 md:grid-cols-2">
          {[
            "Neon (300–600) als neue Farbfamilie plus semantisches Token „highlight“ aufnehmen",
            "Website-Verlauf (#DC05A1) als eigenen Paint-Style „gradient-web“ ergänzen oder den bestehenden angleichen",
            "Radius 12, 32 und „pill“ ergänzen",
            "Website-Textstyles (Headline xl/lg/md/sm, Eyebrow, Lead, Label) als eigene Gruppe „Web“ anlegen",
            "Button-Varianten der Website (primary-white, gradient, outline-white, neon) als Komponenten-Set",
            "Benennung Ink ↔ Gray-Blue vereinheitlichen (Website ink-800 = gray-blue-900)",
          ].map((t) => (
            <li key={t} className="flex gap-3 rounded-[16px] border border-white/10 bg-ink-700 p-4 text-white/85">
              <ArrowUpRight className="mt-0.5 size-5 shrink-0 text-white" aria-hidden /> {t}
            </li>
          ))}
        </ul>
        <p className="mt-6 text-sm text-white/60">Stand des Abgleichs: 15.10.2026.</p>
      </Block>
    </>
  );
}

/* ---------- building blocks of this page ---------- */

function Block({ id, eyebrow, title, lead, children }: { id: string; eyebrow: string; title: string; lead?: string; children: React.ReactNode }) {
  return (
    <Section id={id} tone="ink" className="scroll-mt-24 border-t border-white/10 !py-16 md:!py-24">
      <div className="mb-10 flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
        <div>
          <p className="mb-3 font-display text-2xl font-extrabold italic text-brand-gradient">{eyebrow}</p>
          <Headline size="md">{title}</Headline>
        </div>
        {lead && <p className="max-w-xl text-white/75 md:text-right">{lead}</p>}
      </div>
      {children}
    </Section>
  );
}

function H3({ children }: { children: React.ReactNode }) {
  return <h3 className="mb-4 mt-12 text-[13px] font-semibold uppercase tracking-[0.14em] text-white/75">{children}</h3>;
}

function Note({ children }: { children: React.ReactNode }) {
  return <p className="mt-6 max-w-3xl rounded-[16px] border border-white/10 bg-white/[0.03] px-5 py-4 text-sm leading-relaxed text-white/80">{children}</p>;
}

function Principle({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div className="rounded-[24px] border border-white/10 bg-ink-700 p-6">
      <p className="font-display text-2xl font-extrabold italic uppercase leading-none">{title}</p>
      <p className="mt-3 text-white/75">{children}</p>
    </div>
  );
}

function RoleCard({ role, name, swatch, values, uses }: { role: string; name: string; swatch: React.ReactNode; values: string; uses: string[] }) {
  return (
    <div className="flex flex-col gap-4 rounded-[24px] border border-white/10 bg-ink-700 p-5">
      {swatch}
      <div>
        <p className="text-[13px] font-semibold uppercase tracking-[0.14em] text-white/70">{role}</p>
        <p className="mt-1 font-display text-3xl font-extrabold italic uppercase leading-none">{name}</p>
        <p className="mt-2 font-mono text-[13px] text-white/70">{values}</p>
      </div>
      <ul className="space-y-1.5 text-sm text-white/85">
        {uses.map((u) => (
          <li key={u} className="flex gap-2">
            <span className="mt-2 size-1 shrink-0 rounded-full bg-white/60" aria-hidden /> {u}
          </li>
        ))}
      </ul>
    </div>
  );
}

function Palette({ name, steps }: { name: string; steps: [string, string][] }) {
  return (
    <div className="grid items-center gap-3 sm:grid-cols-[110px_minmax(0,1fr)]">
      <p className="text-sm font-semibold">{name}</p>
      <ul className="grid grid-cols-3 gap-2 sm:grid-cols-6">
        {steps.map(([step, hex]) => (
          <li key={step}>
            <div className="h-12 rounded-[10px] border border-white/10" style={{ background: hex }} />
            <p className="mt-1 text-[12px] font-semibold">{step}</p>
            <p className="font-mono text-[11px] uppercase text-white/60">{hex}</p>
          </li>
        ))}
      </ul>
    </div>
  );
}

function TypeCard({ name, role, sample, children }: { name: string; role: string; sample: React.ReactNode; children: React.ReactNode }) {
  return (
    <div className="flex flex-col gap-4 rounded-[24px] border border-white/10 bg-ink-700 p-6">
      <div className="flex min-h-24 items-center overflow-hidden">{sample}</div>
      <div>
        <p className="text-[13px] font-semibold uppercase tracking-[0.14em] text-white/70">{role}</p>
        <p className="mt-1 text-lg font-semibold">{name}</p>
      </div>
      <p className="text-sm text-white/75">{children}</p>
    </div>
  );
}

function Spec({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div className="grid gap-3 border-b border-white/10 pb-6 last:border-0 last:pb-0 lg:grid-cols-[220px_minmax(0,1fr)] lg:items-center">
      <p className="font-mono text-[12px] text-white/60">{label}</p>
      <div className="min-w-0">{children}</div>
    </div>
  );
}

function Demo({ label, children, className, plain }: { label: string; children: React.ReactNode; className?: string; plain?: boolean }) {
  return (
    <div className={cn("flex flex-col gap-5 rounded-[24px] border border-white/10 p-6", plain ? "bg-transparent" : "bg-ink-700", className)}>
      <p className="font-mono text-[12px] text-white/60">{label}</p>
      <div className="flex flex-wrap items-center gap-3">{children}</div>
    </div>
  );
}

function DoDont({ dos, donts }: { dos: string[]; donts: string[] }) {
  return (
    <div className="grid gap-4 md:grid-cols-2">
      <div className="rounded-[24px] border border-white/10 bg-ink-700 p-6">
        <p className="mb-3 text-[13px] font-semibold uppercase tracking-[0.14em] text-success">So</p>
        <ul className="space-y-2 text-white/85">
          {dos.map((d) => (
            <li key={d} className="flex gap-2">
              <Check className="mt-1 size-4 shrink-0 text-success" aria-hidden /> {d}
            </li>
          ))}
        </ul>
      </div>
      <div className="rounded-[24px] border border-white/10 bg-ink-700 p-6">
        <p className="mb-3 text-[13px] font-semibold uppercase tracking-[0.14em] text-danger">Nicht so</p>
        <ul className="space-y-2 text-white/85">
          {donts.map((d) => (
            <li key={d} className="flex gap-2">
              <X className="mt-1 size-4 shrink-0 text-danger" aria-hidden /> {d}
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}

function Surface({ className, name, text }: { className: string; name: string; text: string }) {
  return (
    <div className={cn("flex h-32 flex-col justify-end rounded-[20px] p-4", className)}>
      <p className="font-semibold">{name}</p>
      <p className="text-[12px] text-white/70">{text}</p>
    </div>
  );
}

function Table({ head, rows }: { head: string[]; rows: string[][] }) {
  return (
    <div className="mt-6 overflow-x-auto rounded-[16px] border border-white/10">
      <table className="w-full min-w-[520px] text-left text-sm">
        <thead className="bg-white/5 text-[12px] uppercase tracking-[0.1em] text-white/70">
          <tr>
            {head.map((h) => (
              <th key={h} className="px-4 py-3 font-semibold">
                {h}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {rows.map((r) => (
            <tr key={r[0]} className="border-t border-white/10">
              {r.map((c, i) => (
                <td key={i} className={cn("px-4 py-3 align-top", i === 0 ? "font-semibold text-white" : "text-white/80")}>
                  {c}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
