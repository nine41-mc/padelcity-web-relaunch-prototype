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
import { CollegiateBadge, VarsityText } from "@/components/play/Collegiate";
import { Button } from "@/components/ui/Button";
import { Chip } from "@/components/ui/Chip";
import { AppIcon } from "@/components/ui/Icon";
import { Marquee } from "@/components/ui/Marquee";
import { StoreBadges } from "@/components/ui/StoreBadges";
import { WhatsAppGroups } from "@/components/community/WhatsAppGroups";
import { ClubCard } from "@/components/cards/ClubCard";
import { EventCard } from "@/components/cards/EventCard";
import { cn } from "@/components/ui/cn";
import codeConnect from "@/lib/codeConnect.json";
import { FormDemo } from "./FormDemo";

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
  ["code-connect", "Code Connect"],
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
    // Internal page, written in German on every locale → lang="de" for screen readers (WCAG 3.1.2)
    <div lang="de">
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
              <a key={id} href={`#${id}`} className="inline-flex min-h-10 items-center rounded-full border border-fg/40 bg-fg/5 px-4 text-sm font-medium text-fg/90 hover:border-fg hover:text-fg">
                {label}
              </a>
            ))}
          </nav>
        </div>
      </Section>

      {/* Haltung */}
      <Block id="haltung" eyebrow="01" title="Haltung" lead="PadelCity ist Deutschlands Nummer 1 im Padel. Die Website soll sich anfühlen wie ein Abend im Club: laut, schnell, gemeinsam.">
        <div className="grid gap-4 md:grid-cols-3">
          <Principle title="Dunkel ist die Bühne">Ink-Schwarz trägt die Seite. Fotos, das Verlaufs-Pink und ein einziger Optic-Yellow-Akzent leuchten davor – wie Flutlicht auf dem Court.</Principle>
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
            bb={ROLE_BRANDBOOK.primary}
            uses={["Primäre Buttons", "Aktive Zustände: Tab, Filter, Segment, gewählte Option", "Offene Akkordeons", "Lila Flächen und Glows", "Pulsierender Punkt im Eyebrow (Pink)", "Text im Verlauf (Kennzahlen, Titel): eine Stufe heller, Magenta 400 → Purple 400"]}
          />
          <RoleCard
            role="Secondary"
            name="Weiß auf Ink"
            swatch={<div className="grid h-28 place-items-center rounded-[16px] border border-fg/15 bg-canvas text-2xl font-semibold text-fg">Aa</div>}
            values="#FFFFFF auf #0B0B0F"
            bb={ROLE_BRANDBOOK.secondary}
            uses={["Fließtext und alle Icons", "Outline-Buttons, Rahmen, Hover", "Textlinks im Hover: Magenta 300", "Ausnahme: Öffnungsstatus auf Club-Karten in Magenta 300"]}
          />
          <RoleCard
            role="Highlight"
            name="Optic Yellow („Tennisball“)"
            swatch={<div className="h-28 rounded-[16px] bg-optic-500" />}
            values="#DFFF4F · RGB 223 255 79"
            bb={ROLE_BRANDBOOK.highlight}
            uses={["Brush-Wort in Headlines", "Ticker-Bänder", "Level-Labels", "Coach-Kennzahlen", "Newsletter-Modul", "Fokus-Ring", "Aktiver Pin auf der Home-Karte", "Padelball im Footer"]}
          />
        </div>
        <Note>Optic Yellow ist knapp gehalten, damit es wirkt. Es erscheint nie als Hover-Farbe und nie als Text auf hellem Grund (Kontrast 1,1 : 1).</Note>

        <H3>Hell &amp; Dunkel: Farbrollen</H3>
        <p className="max-w-3xl text-fg/75">
          Komponenten nutzen Rollen statt fester Farben, jede Rolle hat einen Wert für Dunkel und Hell (Umschalter im Header, ohne Wahl
          folgt die Seite der Systemeinstellung). Fotos, Marken-Verläufe, Header und Footer bleiben auch im hellen Modus dunkel
          (<code className="font-mono text-[13px]">data-theme=&quot;dark&quot;</code>). Figma: 02 Semantic Tokens mit den Modi Dark und Light.
        </p>
        <div className="mt-6 grid gap-4 md:grid-cols-2">
          {(["dark", "light"] as const).map((mode) => (
            <div key={mode} data-theme={mode} className="rounded-[24px] border border-fg/10 bg-canvas p-5 md:p-6">
              <p className="text-[13px] font-semibold uppercase tracking-[0.14em] text-fg/70">{mode === "dark" ? "Dunkel" : "Hell"}</p>
              <ul className="mt-4 grid grid-cols-2 gap-3 sm:grid-cols-3">
                {THEME_ROLES.map((r) => (
                  <li key={r.name} className="min-w-0">
                    <span className={`block h-12 rounded-xl border border-fg/10 ${r.swatch}`} aria-hidden />
                    <span className="mt-1.5 block truncate font-mono text-[12px] text-fg">{r.name}</span>
                    <span className="block text-[12px] text-fg/70">{r.use}</span>
                  </li>
                ))}
              </ul>
              <p className="mt-5 text-fg">
                Text <span className="text-fg/70">· gedämpft</span> · <span className="font-brush text-2xl text-highlight-fg">Highlight</span> ·{" "}
                <span className="text-accent-fg">Live-Info</span>
              </p>
            </div>
          ))}
        </div>

        <H3>Farbpass Optic Yellow (Entwurf)</H3>
        <p className="mb-4 max-w-3xl text-fg/75">
          „Optic Yellow“ ist der Name der Tennisball-Farbe beim Tennis-Weltverband ITF – einen offiziellen Farbwert gibt es nicht (die Regeln verlangen nur „weiß oder gelb“).
          Seit 19.10.2026 ersetzt #DFFF4F das bisherige #B4E854: frischer, näher am echten Ball, mit Grünstich klar vom Schwarz-Gelb des BVB getrennt.
          Druck- und Materialwerte sind Empfehlungen und werden erst nach Proofs final festgelegt.
        </p>
        <Table
          head={["Medium", "Wert", "Status"]}
          rows={[
            ["Digital (sRGB)", "#DFFF4F · RGB 223 255 79", "festgelegt"],
            ["Print Volltonfarbe", "Pantone 388 C / 388 U", "Empfehlung, final zu prüfen – Tennis Canada nutzt 388 C für „Tennis Ball Yellow“ (#E0FF2D); am Fächer gegen einen echten Ball prüfen"],
            ["Print CMYK", "C20 M0 Y100 K0 (gestrichen und ungestrichen)", "Empfehlung, final zu prüfen – aus derselben Quelle; CMYK wirkt matter als der Bildschirm"],
            ["Leuchtfarbe (Merch, Club)", "offen", "Pantone 803 C ist reines Neongelb (≈ #FFE900) – zu nah am BVB; passende Leuchtfarbe per Proof suchen"],
            ["Textil", "Pantone TCX offen", "per Proof auf Stoff"],
            ["Wand, Folie, Schilder", "RAL/NCS bzw. Folienfarbe offen", "mit Schilder- und Folienhersteller, im Hallenlicht prüfen"],
          ]}
        />

        <H3>Paletten</H3>
        <div className="space-y-4">
          <Palette name="Purple" steps={[["50", "#f6e8fd"], ["200", "#dda2f6"], ["400", "#ba45ed"], ["500", "#8412b5"], ["700", "#660e8b"], ["800", "#44095d"], ["900", "#22052e"]]} />
          <Palette name="Magenta" steps={[["50", "#fee6fb"], ["200", "#fd9bf0"], ["300", "#fc69e8"], ["500", "#e005c3"], ["700", "#960382"], ["900", "#32012b"]]} />
          <Palette name="Ink" steps={[["50", "#d2d3d5"], ["100", "#b5b5b9"], ["200", "#909197"], ["300", "#6a6c74"], ["400", "#36384a"], ["600", "#1b1c26"], ["700", "#15171f"], ["800 · Figma 900", "#0b0b0f"]]} />
          <Palette name="Optic Yellow" steps={[["300", "#eaff8f"], ["400", "#e5ff70"], ["500", "#DFFF4F"], ["600", "#c1e425"]]} />
          <Palette name="Status" steps={[["Erfolg", "#00b894"], ["Fehler", "#ff2e47"], ["Warnung", "#ffd500"], ["Chalk", "#f8f8f8"]]} />
        </div>
        <p className="mt-4 flex flex-wrap items-center gap-x-5 gap-y-2 text-sm text-fg/70">
          <span>Abgleich mit dem Brandbook (Maus drüber oder antippen für den Quicktipp):</span>
          <span className="inline-flex items-center gap-2"><span className="grid size-5 place-items-center rounded-full bg-fg text-[10px] font-bold text-ink-800">●</span> trifft</span>
          <span className="inline-flex items-center gap-2"><span className="grid size-5 place-items-center rounded-full border border-fg text-[10px] font-bold">≈</span> nah dran</span>
          <span className="inline-flex items-center gap-2"><span className="grid size-5 place-items-center rounded-full border border-dashed border-fg/70 text-[10px] font-bold">≠</span> bewusst abweichend</span>
        </p>
        <p className="mt-2 max-w-3xl text-sm text-fg/60">
          Ohne Markierung = Abstufung aus der PadelCity-Farbbibliothek ohne direkten Brandbook-Bezug – nicht für die Website erfunden: Purple, Magenta, Ink und
          die Statusfarben sind dieselben Werte wie in App und Web-App (padel_city_color_scheme.dart, padel_colors.dart) bzw. der Figma-Library „PadelCity [Master]“.
          Nur die Optic-Yellow-Stufen 300/400/600 sind für die Website aus #DFFF4F abgeleitet.
        </p>

        <H3>Brandbook-Farben und ihr nächster Website-Ton</H3>
        <Table
          head={["Brandbook", "Nächster Website-Ton", "Abstand", "Bewertung"]}
          rows={[
            ["PC Verlauf Purple #401B78", "Purple 800 #44095D", "ΔE 6,1", "nah – Brandbook etwas bläulicher"],
            ["PC Verlauf Mitte #791979 (Pantone 2592 C)", "Magenta 700 #960382", "ΔE 5,3", "nah"],
            ["PC Verlauf Magenta #AC007D", "Magenta 700 #960382", "ΔE 5,4", "nah – kein Hauptton trifft es (Magenta 500: ΔE 14)"],
            ["PC Schwarz #000000", "Ink 800 #0B0B0F", "ΔE 2,7", "nah – bewusst minimal angehoben"],
            ["PC Hellgrau #B8B8BE", "Ink 100 #B5B5B9", "ΔE 1,3", "trifft"],
            ["PC Dunkelgrau #646464", "Ink 300 #6A6C74", "ΔE 5,4", "nah – Website kühler"],
            ["PC Weiß #FFFFFF", "Weiß (Text)", "ΔE 0", "trifft"],
            ["Brandbook-Verlauf #401B78 → #791979 → #AC007D", "bg-brandbook-gradient", "identisch", "trifft – für große Flächen; Buttons nutzen den helleren App-Verlauf"],
          ]}
        />
        <Note>ΔE ist der wahrgenommene Farbabstand (CIEDE2000): bis 2 kaum sichtbar, bis etwa 7 nah, darüber klar unterschiedlich. Die Haupttöne Purple 500 und Magenta 500 weichen bewusst ab – sie kommen aus App und Figma-Library und sind fürs Display optimiert; ob das so bleibt, ist Teil der offenen Brand-Abstimmung.</Note>
        <p className="mt-4 text-sm text-fg/70">Purple, Magenta und Ink stammen aus der Figma-Library „PadelCity [Master]“ (dort „Gray-Blue“), die auch App und Admin-Portal nutzen. Achtung Benennung: Website ink-800 #0B0B0F entspricht Figma gray-blue-900; Figma gray-blue-800 #101117 nutzt die Website nicht. Optic Yellow ist für den Relaunch neu und steht noch nicht in der Library (Token-Name im Code: optic-*).</p>

        <H3>Kontraste (WCAG 2.2 AA)</H3>
        <Table
          head={["Kombination", "Kontrast", "Einsatz"]}
          rows={[
            ["Weiß auf Brand-Verlauf", "≥ 4,6 : 1", "Button-Labels – dafür wurde der Magenta-Stopp auf #DC05A1 justiert"],
            ["Text-Verlauf (Magenta 400 → Purple 400) auf Ink 700/800", "≥ 4,4 : 1", "Kennzahlen und Titel im Verlauf (text-brand-gradient) – der Brand-Verlauf selbst erreicht als Text nur 2,3 : 1"],
            ["Weiß auf Ink 800", "19,8 : 1", "Fließtext"],
            ["Magenta 300 auf Ink 800", "≈ 7 : 1", "Textlinks im Hover, Öffnungsstatus"],
            ["Optic Yellow auf Ink 800", "≈ 17 : 1", "Fokus-Ring, Level-Labels, Akzente"],
            ["Optic Yellow auf Purple 500", "≈ 6,8 : 1", "Akzente auf Purple-Flächen"],
            ["Optic Yellow auf Chalk", "1,1 : 1", "Verboten"],
          ]}
        />
      </Block>

      {/* Typografie */}
      <Block id="typo" eyebrow="03" title="Typografie" lead="Drei Schriften mit klaren Aufgaben: eine schreit, eine kritzelt, eine erklärt.">
        <div className="grid gap-5 lg:grid-cols-3">
          <TypeCard name="Söhne Schmal Fett Kursiv" role="Display" sample={<span className="font-display text-6xl font-extrabold italic uppercase leading-none">Game. Set. Match.</span>}>
            Headlines, Buttons, Zahlen, Ticker. Immer in Versalien und kursiv. Schmal geschnitten, deshalb eine Stufe größer setzen als Poppins.
          </TypeCard>
          <TypeCard name="Good Brush" role="Akzent" sample={<span className="font-brush text-6xl leading-none text-highlight-fg">noise</span>}>
            Genau ein Wort pro Headline über die Accent-Komponente: leicht gedreht, in Optic Yellow. Nie für ganze Sätze und nie für Fließtext.
          </TypeCard>
          <TypeCard name="Poppins" role="Text" sample={<span className="text-3xl font-semibold leading-tight">Let&apos;s play Padel.</span>}>
            Fließtext, Labels, Formulare, Navigation. Schnitte 400, 500, 600 und 700. Zeilenlänge maximal etwa 70 Zeichen.
          </TypeCard>
        </div>

        <H3>Headline-Größen</H3>
        <div className="space-y-6 rounded-[24px] border border-fg/10 bg-raised p-6 md:p-10">
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
            <p className="max-w-2xl text-fg/85">Padel ist der am schnellsten wachsende Sport Europas. Bei PadelCity spielst du in über 30 Clubs – indoor wie outdoor, für jedes Level.</p>
          </Spec>
          <Spec label="Label · Poppins 600, 13 px, Versalien, Sperrung 0,14 em">
            <p className="text-[13px] font-semibold uppercase tracking-[0.14em] text-fg/75">Öffnungszeiten</p>
          </Spec>
        </div>

        <H3>Academy-Stil („Collegiate“)</H3>
        <p className="max-w-3xl text-fg/75">
          Nur auf der Academy-Seite: Das Brandbook setzt die Academy in Octin College. Die Schrift ist für den Prototyp nicht lizenziert, deshalb
          ahmen zwei Komponenten den College-Look nach – mit derselben Söhne Schmal Fett Kursiv wie alle Headlines, aber mit versetzter
          Magenta-Kontur bzw. als Konturschrift im Abzeichen. Ob Octin College für die Website lizenziert wird, ist offen (HANDOVER.md).
        </p>
        <div className="space-y-6 rounded-[24px] border border-fg/10 bg-raised p-6 md:p-10">
          <Spec label="VarsityText · Söhne Schmal Fett Kursiv, Kontur Magenta-500 1,5 px um 0,06 em versetzt">
            <p className="text-[2.6rem] leading-[0.95] md:text-7xl">
              <VarsityText>Dein Weg</VarsityText>
              <br />
              <VarsityText className="text-fg/90">auf den Court</VarsityText>
            </p>
          </Spec>
          <Spec label="CollegiateBadge · Academy-Hero, gedreht −4°, nur ab Tablet">
            <CollegiateBadge />
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
          <Demo label="outline · Link zur Übersichtsseite, unter dem Inhalt">
            <Button href="#buttons" variant="outline" className="w-fit">Alle Events</Button>
          </Demo>
          <Demo label="optic · nur im Newsletter-Modul" className="bg-canvas">
            <Button variant="optic" type="button">Anmelden</Button>
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
            donts={["„Mehr erfahren“, „Hier klicken“, „Weiter“ ohne Ziel", "Zwei gleich laute Buttons, die dasselbe tun", "Optic-Yellow-Buttons außerhalb des Newsletters", "Versprechen, die die Website nicht hält (z. B. freie Slots)"]}
          />
        <Note>Links zu Übersichtsseiten („Alle Events“, „Alle Coaches“, „Alle FAQ“, „Alle Standorte“) sind immer Outline-Buttons mit Pfeil. Sie stehen unter dem Inhalt, auf den sie sich beziehen, nicht klein neben der Headline. Kleine Textlinks mit „→“ gibt es dafür nicht. Breadcrumbs und Zurück-Links oben entfallen; die Navigation und der Browser übernehmen das.</Note>
        <Note>Pro Bildschirm gibt es höchstens eine primäre Aktion. Auf Mobilgeräten übernimmt sie die Buchungsleiste unten, die ausblendet, sobald der Buchungsblock selbst sichtbar ist.</Note>
      </Block>

      {/* Icons */}
      <Block id="icons" eyebrow="05" title="Icons" lead="Zwei Familien, eine Regel: Icons sind weiß und stehen nie allein, wenn ihre Bedeutung nicht eindeutig ist.">
        <H3>App-Icons · Sportarten und Ausstattung</H3>
        <p className="mb-5 max-w-3xl text-fg/75">Direkt aus der PadelCity App übernommen, damit Website und App dieselbe Bildsprache sprechen. Eingefärbt über currentColor. Einsatz: Clubseite und Filter – auf Club-Kacheln stehen Sportarten nur als Text.</p>
        <ul className="grid grid-cols-3 gap-2 sm:grid-cols-4 md:grid-cols-7">
          {APP_ICONS.map((name) => (
            <li key={name} className="flex flex-col items-center gap-2 rounded-[12px] border border-fg/10 bg-raised px-2 py-4 text-center">
              <AppIcon name={name} className="size-7 text-fg" />
              <span className="break-all font-mono text-[11px] text-fg/60">{name}</span>
            </li>
          ))}
        </ul>

        <H3>UI-Icons · Lucide</H3>
        <p className="mb-5 max-w-3xl text-fg/75">Für Navigation und Bedienung: Lucide, Outline, Strichstärke 2 (Pfeile 2,5). Größen 16, 20 und 24 px.</p>
        <ul className="grid grid-cols-2 gap-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6">
          {UI_ICONS.map(([Icon, name, use]) => (
            <li key={name} className="flex items-center gap-3 rounded-[12px] border border-fg/10 bg-raised px-3 py-3">
              <Icon className="size-5 shrink-0 text-fg" aria-hidden />
              <span className="min-w-0">
                <span className="block truncate font-mono text-[12px] text-fg/85">{name}</span>
                <span className="block truncate text-[12px] text-fg/60">{use}</span>
              </span>
            </li>
          ))}
        </ul>
        <H3>Social</H3>
        <ul className="flex flex-wrap gap-2">
          {[[Linkedin, "LinkedIn"], [Facebook, "Facebook"], [Instagram, "Instagram"], [Youtube, "YouTube"]].map(([Icon, name]) => {
            const I = Icon as typeof Linkedin;
            return (
              <li key={name as string} className="grid size-12 place-items-center rounded-full border border-fg/25" title={name as string}>
                <I className="size-5" aria-hidden />
              </li>
            );
          })}
          <li className="grid size-12 place-items-center rounded-full border border-fg/25 text-[11px] font-semibold" title="TikTok">TikTok</li>
        </ul>
        <p className="mt-3 text-sm text-fg/70">Runde Outline-Buttons, im Hover weiß gefüllt. TikTok kommt als eigenes SVG (nicht in Lucide).</p>
        <Note>Icon-only-Buttons (Filter, Liste/Karte auf dem Handy) bekommen immer ein unsichtbares Label für Screenreader und eine Fläche von mindestens 44 × 44 px.</Note>
      </Block>

      {/* Chips */}
      <Block id="chips" eyebrow="06" title="Chips & Labels" lead="Kleine Etiketten für Kategorie, Level und Zustand.">
        <div className="flex flex-wrap items-center gap-3 rounded-[24px] border border-fg/10 bg-raised p-6">
          <Chip>Indoor</Chip>
          <Chip tone="gradient">Turnier</Chip>
          <Chip tone="solid">Neu</Chip>
          <Chip tone="dark">10 Fotos</Chip>
          <Chip tone="level">Level 4+</Chip>
          <span className="inline-flex items-center gap-1.5 text-sm font-semibold text-accent-fg">
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
            ["level", "Spielstärke – die einzige Chip-Variante in Optic Yellow"],
            ["Öffnungsstatus", "Live-Info auf Club-Karten in Magenta 300, Court-Anzahl bleibt weiß"],
            ["Gutschein-Modul", "Startseite: „Verschenke eine Padel Session“ mit drei Schritten (Text von padelcity.de) und dem Gutschein im Look des physischen Gutscheins – heller Beton-Grund, Chevrons im Verlauf, PadelCity-Symbol im Verlauf, „Gutschein“ und „ab 10 € Geschenkwert“; kein Chip, keine Kreditkarten-Optik; Merch-Shop nur als Hinweis"],
            ["Highlight-Vergleich (Startseite)", "Klick auf ein Highlight-Element (Brush-Wort, Ticker, Karten-Label, Footer-Ball) oder auf den Button unten links wechselt reihum Optic Yellow · Purple · Magenta · Türkis #15C0D3 (App-Abo-Badge). Nur zum Vergleich; Text auf Highlight-Flächen über Token on-optic (dunkel bzw. weiß)"],
            ["Content-Modell", "Footer-Link „Content-Modell“: alle Seitentypen und Module mit der Herkunft jedes Felds (API vorhanden, API erweitern, neuer Contentful-Space, extern, unklar) – Daten in src/lib/content/contentModel.ts"],
            ["Jobs: Personio-Embed", "Seite statisch aus Contentful; nur „Offene Stellen“ ist die eingebettete Personio-Karriereseite (iframe, Höhe per postMessage), als helle Karte mit Ansprechpartnerin daneben; bis die Personio-URL steht, zeigt eine Vorschau im Personio-Look die 8 Stellen von padelcity.de/jobs"],
            ["Franchise: Leistungen & Kontakt", "Drei Phasen-Karten (Bauphase, Aktivierung, Regelbetrieb) mit den Leistungen von padelcity.de, optionale Leistungen gedämpft markiert; Ansprechpartner mit Foto neben dem Formular"],
            ["Poster-Kacheln", "Auch für die Franchise-Clubs – im Raster in voller Zellbreite"],
            ["Preis auf Karten", "Club- und Event-Karten: Preis unten rechts auf dem Bild, Söhne Schmal groß, mit Abdunklung"],
            ["Courts & Sportarten", "Auf Kacheln zwei bündige Textzeilen: „13 Courts · Indoor & Outdoor“ (weiß), darunter „Padel · Tennis“ (gedämpft) – ohne Pillen und Icons; Aufschlüsselung nur auf der Clubseite"],
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
        <div className="flex h-14 items-center overflow-hidden rounded-[16px] bg-optic-500 text-on-optic">
          <Marquee>
            {["30+ Clubs", "200+ Courts", "25+ Städte", "3 Länder", "#bettertogether"].map((item) => (
              <span key={item} className="flex items-center gap-8 px-4 font-display text-xl font-extrabold italic uppercase">
                {item} <span className="inline-block size-[0.26em] translate-y-[0.03em] rounded-full bg-purple-600" aria-hidden />
              </span>
            ))}
          </Marquee>
        </div>
        <p className="mt-3 text-sm text-fg/70">Nur freigegebene Kennzahlen. Der Ticker hält bei Hover und Fokus an.</p>
        <H3>Store-Badges</H3>
        <StoreBadges locale={locale} />
        <p className="mt-3 text-sm text-fg/70">Offizielle Badges von Apple und Google, nicht nachgebaut. Nur auf der App-Seite – nicht im Footer und nicht auf Clubseiten, dort führt „In der App buchen“ direkt in die App.</p>

        <H3>Club-Poster („Clubs mit Vibe“ und Club-Karten)</H3>
        <p className="max-w-3xl text-fg/75">
          Look aus den Instagram-Posts zu Neueröffnungen, automatisch für jeden Club: lila, körniger Himmel über dem Club-Foto, Stadt in Poppins Bold mit fester Schriftgröße je Kachel-Typ. Regel: bis 7 Buchstaben
          einzeilig (Berlin, München), längere Namen an einer Silbe geteilt (Frank|furt), zweite Zeile als Outline – damit sitzt die Abrisskante immer auf einer von zwei festen Höhen, der Standort innerhalb der Stadt (z. B. Frankfurter Ring, Tucherpark) kleiner unter der Abrisskante, weiße Abrisskante. Oben links der Öffnungsstatus in PadelCity-Pink. Courts und Sportarten erscheinen erst beim Hover (auf Touch-Geräten
          immer sichtbar), damit das Poster ruhig bleibt. Die Club-Karten (Standorte, Academy, Franchise, Clubs in der Nähe) nutzen denselben Look im Bild – Status oben, Stadt mit Abrisskante, Preis unten rechts im Bild –, auf den kleineren Kacheln bleiben Städte bis 11 Buchstaben einzeilig, nur wirklich lange Namen werden geteilt (Reckling|hausen); darunter statisch Adresse, Courts („13 Courts · Indoor & Outdoor“), Sportarten als reiner Text und Pfeil.
        </p>

        <H3>Instagram-Bildwand (Startseite)</H3>
        <p className="max-w-3xl text-fg/75">
          Dichtes Raster wie das Instagram-Profil: 3 Spalten auf dem Handy, 6 ab Tablet, Format 4 : 5, 4 px Abstand, Reels mit Play-Icon, im Hover lila Fläche mit Instagram-Icon.
          Jede Kachel öffnet @padelcity.de. Live werden die Posts serverseitig beim Build geladen (Instagram Graph API oder ein Feed-Tool mit JSON-Schnittstelle) – kein
          Fremd-Skript im Browser, damit kein zusätzlicher Consent nötig ist.
        </p>

        <H3>Stories des Clubs (Clubseite)</H3>
        <p className="max-w-3xl text-fg/75">
          Kreise wie Instagram-Story-Highlights unter dem Clubnamen: Verlaufsring = noch nicht angesehen, grauer Ring = angesehen. Der erste Kreis ist „Welcome to PadelCity
          &lt;Stadt&gt;“ im Magenta-Look der Instagram-Cover. Klick öffnet eine Story-Ansicht im Format 9 : 16 mit Fortschrittsbalken, Tippen links/rechts, Halten pausiert,
          Esc schließt. Beschriftungen werden nie gekürzt – jeder Kreis bekommt die Breite seines Labels. Story-Highlights liefert die Instagram-API nicht – sie werden pro Club in Contentful gepflegt.
        </p>

        <H3>Offene Stellen (Jobs-Seite)</H3>
        <p className="max-w-3xl text-fg/75">
          Direkt unter dem Hero: Filter nach Bereich und Standort, Stellenliste mit Bereich in Magenta 300, Titel in Söhne Schmal, Standort und Umfang mit Icons. Jede Stelle öffnet
          eine Bewerbungs-E-Mail mit Stelle und Standort im Betreff. Daneben die Kontakt-Kachel von Astrid Nindl (People &amp; Culture), auf dem Desktop mitlaufend.
        </p>

        <H3>Coming-soon-Seite mit Padel-Pong</H3>
        <p className="max-w-3xl text-fg/75">
          Ziel aller Links, die im Prototyp noch ins Leere laufen würden (App-Deeplinks, Event-Anmeldung in der Web-App). Endloses Pong auf einem dunklen Court: Schläger in Purple
          und Magenta, Ball in Optic Yellow mit Leuchtspur, Rally-Zähler in Optic Yellow. Wer die Maus oder den Finger über das Feld bewegt, übernimmt den linken Schläger. Bei reduzierter Bewegung
          steht das Bild still. Zweisprachig, weil Links von DE- und EN-Seiten hier landen.
        </p>

        <H3>Clubkarte auf der Startseite</H3>
        <p className="max-w-3xl text-fg/75">
          Deutschland im Brand-Verlauf mit Punktraster. Österreich und Polen sind grau und gestrichelt angedeutet, damit Innsbruck, Warschau, Krakau und Kielce nicht frei schweben.
          Beim Hover über das Land oder einen Pin darin färbt es sich ein – dieselbe Logik wie bei den Coach-Kacheln (erst grau, dann farbig). Nach rechts läuft Polen weich aus.
          Aktiver Pin und Label in Optic Yellow; geplante Clubs als gestrichelte Pins.
        </p>

        <H3>Presse-Logos („Bekannt aus …“)</H3>
        <p className="max-w-3xl text-fg/75">
          Laufband wie bei den Partnern, nur auf der Magazin-Seite. Original-Logos von padelcity.de, weiß auf Schwarz, 70 % Deckkraft, im Hover voll. Logos werden in der Höhe optisch
          angeglichen, nicht alle gleich hoch gesetzt.
        </p>

        <H3>Overlays (ein Design für alle)</H3>
        <p className="max-w-3xl text-fg/75">
          Coach, Club-Info und WhatsApp-Community nutzen dasselbe Overlay (Komponente Overlay): Rand mit Verlauf-Glow, Bild links (Desktop) bzw. oben (Handy) mit optionaler Pill,
          rechts Titel in Söhne Schmal, eine Zeile darunter (z. B. Ort) und Abschnitte mit kleinem Label in Versalien („Kontakt“, „Training &amp; Preise“, „Allgemeine Hinweise“).
          Schließen-X rund oben rechts, Esc und Klick auf den Hintergrund schließen, die Seite dahinter scrollt nicht. Ausnahme: die Club-Stories (Bildbetrachter im Vollbild).
        </p>

        <H3>WhatsApp-Community-Overlay</H3>
        <div className="flex flex-wrap items-center gap-4 rounded-[24px] border border-fg/10 bg-raised p-6">
          <WhatsAppGroups locale={locale} label="Gruppe finden" variant="gradient" track="styleguide_whatsapp_overlay" />
          <p className="max-w-xl text-sm text-fg/75">
            Es gibt keinen zentralen Community-Link. Jeder Einstieg (Startseite, Footer-Band) öffnet dieses Overlay mit der direkten Gruppe pro Standort, mit Suche.
            Geteilte Gruppen stehen bei jeder Stadt, die eigene Stadt zuerst („Andernach & Mülheim-Kärlich“, „Mülheim-Kärlich & Andernach“), Kanäle sind gekennzeichnet. Auf der Clubseite führt die Kachel direkt in die Gruppe des Clubs.
          </p>
        </div>

        <H3>Info-Kacheln mit großem Wert</H3>
        <p className="max-w-3xl text-fg/75">
          Kacheln aus Label, großem Wert und Text (Vision &amp; Mission, Voraussetzungen und Phasen im Franchise, Kennzahlen bei Investoren, Säulen auf „Über uns“): Label grau in Versalien,
          Wert bzw. Kachel-Headline im Brand-Verlauf, Text in Weiß 70 %. Kacheln mit Icon bekommen ihren Farbakzent über das Icon und behalten die weiße Headline.
        </p>

        <H3>Partner-Modul („Better together.“)</H3>
        <p className="max-w-3xl text-fg/75">
          Ein Partner-Modul für die ganze Website: Eyebrow „Unsere Partner“, Headline „Better together.“, Button „Partner werden“, darunter die Logos als Laufband in Graustufen.
          Auf der Startseite mit allen Partnern, auf Event-Seiten nur mit den Partnern des Events. Einen zweiten Logo-Streifen gibt es nicht.
        </p>

        <H3>News &amp; Magazin (Startseite)</H3>
        <p className="max-w-3xl text-fg/75">
          Aufbau wie die Events-Sektion: Pill „News &amp; Magazin“, Headline „Stories vom Court.“, Button „Zum Magazin“, darunter die drei neuesten Artikel als Artikel-Karten.
        </p>

        <H3>Event-Detail: eine Seite für alle Events</H3>
        <p className="max-w-3xl text-fg/75">
          Links Bild, Kategorie, Titel, Text, darunter Beginn, Ende und Ort. Rechts die mitlaufende Anmelde-Karte: Format (Einzelanmeldung / Team), Anmeldefrist, max. Teilnehmer,
          freie Plätze (live aus der API, „Ausgebucht“ in Magenta 300), Preis und Anmeldung. Darunter die Stornierungsbedingungen als Tabelle wie in der App („Bis … Kostenfreie
          Rückerstattung“ in Success-Grün, „Ab … 100 %“), nur bei der Regel „24 Std. vor Beginn“. Claim mit Countdown (Tage · Std · Min · Sek), Intro, weitere Eckdaten, Ablauf,
          Zeitplan, Video und Partner erscheinen nur, wenn sie in Contentful gepflegt sind.
        </p>

        <H3>Library ↔ Code (Code Connect)</H3>
        <p className="max-w-3xl text-fg/75">
          Jede Library-Komponente hat genau eine Code-Komponente, in Figma per Code Connect verknüpft – die vollständige Zuordnung steht unter{" "}
          <a href="#code-connect" className="underline underline-offset-4 hover:text-fg">Code Connect</a>. Neue Muster entstehen erst als Code-Komponente, dann als
          Library-Komponente – nie als Kopie im Seiten-Code.
        </p>

        <H3>Footer</H3>
        <ul className="grid gap-3 md:grid-cols-2">
          {[
            ["Ticker in Optic Yellow", "Übergang von der Seite in den Footer, freigegebene Kennzahlen"],
            ["Claim + Newsletter", "„Make some noise for Padel.“ links, das Newsletter-Modul steht rechts für sich allein"],
            ["WhatsApp-Band", "Volle Breite im Brandbook-Verlauf: „Never play alone.“ mit Button ins Gruppen-Overlay"],
            ["Drei Spalten", "„Fall in love with padel.“ + Follow us! mit allen Social-Profilen · Spielen · PadelCity inkl. Sitemap"],
            ["Social-Reihenfolge", "LinkedIn, Facebook, Instagram, YouTube, TikTok – wie auf padelcity.de"],
            ["Copyright-Zeile", "Öffnet diesen Styleguide (Easter Egg, ohne sichtbaren Hinweis)"],
          ].map(([t, d]) => (
            <li key={t} className="rounded-[16px] border border-fg/10 bg-raised p-5">
              <p className="font-semibold">{t}</p>
              <p className="mt-1 text-sm text-fg/70">{d}</p>
            </li>
          ))}
        </ul>

        <H3>Academy: Level-Skala</H3>
        <p className="max-w-3xl text-fg/75">
          Sieben Level mit den Namen aus der App (Figma Master „New Skill Level Intro“): Starter, Starter+, Intermediate, Intermediate+, Advanced, Expert, Professional.
          Die Timeline ist die Steuerung: Ein Klick auf ein Level färbt die Kachel im Verlauf und holt die passende Kachel darunter in die Mitte; inaktive Kacheln treten zurück.
          Pro Level eine Kachel mit dem App-Text; das Etikett oben rechts nennt die Stufe (Einsteiger · Fortgeschritten · Competition), die Bullets kommen aus der Stufe.
        </p>

        <H3>App-Seite: Screens & Overlays</H3>
        <p className="max-w-3xl text-fg/75">
          In den Handy-Rahmen stehen nur vollständige App-Screenshots (Originale aus der Figma-Datei „Store Assets“, mit Statusleiste, ohne Store-Headlines).
          Darüber schwebt pro Feature ein Element des jeweiligen Screens – in HTML nachgebaut, immer vollständig sichtbar und nie abgeschnitten – mit einer kleinen Schleife:
          Startzeit wählen, „Anteilige Zahlung“ einschalten, Spieler:innen treten bei, Gutscheincode tippen, Discount-Hinweis. Store-Bewertungen stehen direkt im Hero.
        </p>

        <H3>Standortfinder: Filter</H3>
        <p className="max-w-3xl text-fg/75">
          Eine Zeile: Länder als Segment-Schalter (ab Tablet), Anzahl, Filter-Icon, Liste/Karte. Alle weiteren Kriterien liegen hinter dem Filter-Icon: Sortierung (Empfohlen,
          Entfernung, A–Z, Z–A), „Gerade geöffnet“, Sportarten, Ausstattung (Indoor, Outdoor, Center Court, Franchise) und auf dem Handy auch die Länder. Auf dem Handy als Bottom
          Sheet, ab Tablet als Panel von rechts. Aktive Kriterien färben das Icon im Verlauf und zeigen einen Zähler. Filter wirken sofort; der Button zeigt die Trefferzahl.
        </p>

        <H3>Formulare</H3>
        <p className="mb-6 max-w-3xl text-fg/75">
          Felder im Glas-Look auf dunkler Karte (components/forms), genutzt von der Event-Anfrage und dem Anfrage-Formular für Franchise und Partner. Pflichtfelder tragen ein
          magentafarbenes Sternchen, optionale den grauen Zusatz „(optional)“. Fehler stehen als Text direkt am Feld und ersetzen dessen Hinweis; der Rahmen wird rot. Beim Absenden
          springt der Fokus auf das erste fehlerhafte Feld. Ja/Nein-Fragen sind zwei Filter-Chips, Auswahlen mit Erklärung Karten mit Verlaufsrahmen. Lange Formulare gliedern
          nummerierte Schritte.
        </p>
        <FormDemo locale={locale} />
      </Block>

      {/* Flächen */}
      <Block id="flaechen" eyebrow="08" title="Flächen, Radien, Schatten">
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          <Surface className="bg-canvas border border-fg/10" name="Ink 800" text="Seitengrund" />
          <Surface className="bg-raised border border-fg/10" name="Ink 700" text="Karten, Panels" />
          <Surface className="bg-canvas-deep border border-fg/10" name="Black" text="Abschnittswechsel" />
          <Surface className="bg-brandbook-gradient" name="Brandbook-Verlauf" text="Bühnen-Abschnitte" />
          <Surface className="bg-canvas bg-court-lines border border-fg/10" name="Court-Linien" text="Symbol aus dem Brandbook" />
          <Surface className="bg-raised bg-grain border border-fg/10" name="Grain" text="Filmkorn auf Heros" />
          <Surface className="bg-raised shadow-elevated border border-fg/10" name="Elevated" text="Schwebende Leisten" />
          <Surface className="bg-raised shadow-glow border border-fg/10" name="Glow" text="Hover auf Karten und Buttons" />
        </div>
        <H3>Radien</H3>
        <div className="flex flex-wrap items-end gap-4">
          {[["8", "rounded-[8px]", "Chips"], ["12", "rounded-[12px]", "kleine Kacheln"], ["16", "rounded-[16px]", "Medien"], ["20–24", "rounded-[24px]", "Karten"], ["32", "rounded-[32px]", "große Module"], ["Pille", "rounded-full", "Buttons, Filter, Suche"]].map(([r, cls, use]) => (
            <div key={r} className="text-center">
              <div className={cn("size-20 border-2 border-fg/40 bg-fg/5", cls)} />
              <p className="mt-2 text-sm font-semibold">{r}</p>
              <p className="text-[12px] text-fg/60">{use}</p>
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
              <p className="font-mono text-[11px] text-fg/60">spacing-{n}</p>
            </div>
          ))}
        </div>
        <p className="mt-3 text-sm text-fg/70">Spacing-Skala aus der Library. Die Website hält sich an das 4/8-Raster; Abschnittsabstände (80 / 112 / 128 px) sind Website-spezifisch.</p>
        <H3>Innenabstände von Karten & Panels</H3>
        <Table
          head={["Stufe", "Innenabstand (Handy / Tablet / Desktop)", "Wofür"]}
          rows={[
            ["pad-card", "20 px", "Kacheln im Raster: Schritte, Kennzahlen, Bewertungen, Benefits, Team-Links, Sport-Kacheln"],
            ["pad-panel", "24 / 32 px", "Einzelne Boxen: Info, Formulare, Testimonials, Overlays, Anmelde-Karte, mobiles Menü"],
            ["pad-banner", "24 / 40 / 56 px", "Volle Breite: CTA-Banner, Teaser, Newsletter, Lead-Formulare, leere Zustände"],
          ]}
        />
        <p className="mt-3 text-sm text-fg/70">
          Keine Einzelwerte: Jede Karte nutzt eine der drei Stufen. Gestapelte Panels haben 24 px Abstand (Raster-Abstand). Ausnahmen sind kompakte Zeilen und Pillen (FAQ-Zeilen,
          WhatsApp-Gruppen, Kontakt-Kacheln 2 × 2 auf dem Handy, Buchungsleiste).
        </p>
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
            ["Ticker", "Endlos, hält bei Hover und Fokus; Inhalt wird so oft wiederholt, dass auch sehr breite Bildschirme lückenlos gefüllt sind"],
            ["App-Overlays", "Kurze Schleifen, die eine Interaktion des Screens zeigen (z. B. Schalter an, Code tippen)"],
            ["Reduzierte Bewegung", "Systemeinstellung wird respektiert: alle Animationen aus"],
          ].map(([t, d]) => (
            <li key={t} className="rounded-[16px] border border-fg/10 bg-raised p-5">
              <p className="font-semibold">{t}</p>
              <p className="mt-1 text-sm text-fg/70">{d}</p>
            </li>
          ))}
        </ul>
      </Block>

      {/* A11y */}
      <Block id="a11y" eyebrow="11" title="Barrierefreiheit" lead="Ziel ist WCAG 2.2 AA – nicht als Abhaken am Ende, sondern als Designregel.">
        <ul className="grid gap-3 md:grid-cols-2">
          {[
            "Fokus-Ring in Optic Yellow, auf hellen Flächen automatisch in Ink",
            "Klickflächen mindestens 44 × 44 px",
            "Eigene Auswahllisten (Select) mit voller Tastatursteuerung",
            "Karten und Bottom Sheets lassen sich mit Esc schließen",
            "Jedes Bild hat einen Alternativtext, Icon-Buttons ein Label",
            "Sprunglink „Zum Inhalt springen“ ganz oben",
          ].map((t) => (
            <li key={t} className="flex gap-3 rounded-[16px] border border-fg/10 bg-raised p-4 text-fg/85">
              <Check className="mt-0.5 size-5 shrink-0 text-fg" aria-hidden /> {t}
            </li>
          ))}
        </ul>
        <p className="mt-6 flex flex-wrap items-center gap-3 text-sm text-fg/70">
          Fokus testen:{" "}
          <button type="button" className="rounded-full border border-fg/40 px-4 py-2 text-fg">
            Mit Tab hierher springen
          </button>
        </p>
              <H3>Darstellungs-Panel</H3>
        <p className="max-w-3xl text-fg/75">
          Runder Button unten rechts, wie bei Barrierefreiheits-Tools üblich (auf Clubseiten am Handy über der Buchungsleiste) öffnet „Darstellung“: Schriftgröße (100–150 %), Abstände (Stufe „Weit“ = WCAG-1.4.12-Werte),
          gut lesbare Schrift (Poppins aufrecht statt kursiver Display- und Brush-Schrift), Bewegung aus (Video, Ticker, Animationen) und hoher Kontrast mit unterstrichenen Links.
          Eigenes Panel ohne Drittanbieter und ohne Tracking: setzt nur data-a11y-* auf &lt;html&gt; (vor dem ersten Rendern) und merkt sich die Wahl im Browser.
          Es ergänzt eine barrierefreie Seite, ersetzt sie nicht – die WCAG-Konformität liegt im Code.
        </p>
        <H3>Regeln aus dem WCAG-Check</H3>
        <ul className="grid gap-3 md:grid-cols-2">
          {[
            ["Name enthält sichtbaren Text", "Sprachumschalter „de – Deutsch“, Level „Level 1 Starter“: Zusatz nur per sr-only, kein abweichendes aria-label (2.5.3)"],
            ["Listen sauber verschachteln", "Animation (Reveal) im <li>, nie um das <li> herum (1.3.1)"],
            ["Bewegung > 5 s pausierbar", "Ticker mit Pause-Button, App-Overlays laufen max. 5 s, Hero-Video mit Pause (2.2.2)"],
            ["Englische Claims auszeichnen", "lang=\"en\" auf DE/PL-Seiten (claimLang), damit Screenreader richtig aussprechen (3.1.2)"],
          ].map(([t, d]) => (
            <li key={t} className="rounded-[16px] border border-fg/10 bg-raised p-5">
              <p className="font-semibold">{t}</p>
              <p className="mt-1 text-sm text-fg/70">{d}</p>
            </li>
          ))}
        </ul>
      </Block>

      {/* Sprache */}
      <Block id="sprache" eyebrow="12" title="Sprache & Inhalte" lead="Wir duzen, wir sind kurz, wir übertreiben nicht.">
        <H3>Drei Sprachen</H3>
        <p className="max-w-3xl text-fg/75">
          Deutsch unter /, Englisch unter /en, Polnisch unter /pl (lokalisierte Pfade, z. B. /pl/lokalizacje) – Sprachumschalter DE · EN · PL, hreflang für alle drei.
          Polnisch duzt wie Deutsch („ty“), Begriffe wie in der polnischen App (kort, trener, otwarte mecze, poziom), Anführungszeichen „…”, Preise in €.
          Zahlen mit Polnisch-Plural (1 kort · 2–4 korty · 5+ kortów). Englische Claims bleiben in allen Sprachen englisch.
        </p>

        <H3>Claims</H3>
        <div className="flex flex-wrap gap-3">
          {["Game. Set. Match.", "Drive the Padel Boom!", "Loyalty hits reach.", "Experience for the win.", "Make some noise for Padel.", "Never play alone.", "Fall in love with padel.", "#bettertogether", "Let's play Padel!"].map((c) => (
            <span key={c} className="rounded-full bg-fg/5 px-4 py-2 font-display text-xl font-extrabold italic uppercase">
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
        <p className="mt-10 text-sm text-fg/60">
          Quelle der Regeln im Code: <code className="font-mono">src/app/globals.css</code> (Farbrollen) und <code className="font-mono">src/components/ui</code>. Diese Seite ist absichtlich nicht verlinkt.
        </p>
      </Block>

      {/* Figma */}
      <Block id="figma" eyebrow="13" title="Abgleich mit der Figma-Library" lead="Die Website hat eine eigene Library („PadelCity Website Relaunch“), abgeleitet aus diesem Prototyp und wertgleich mit dem Theme. Referenz für Farben und Schriften bleibt „PadelCity [Master]“ – dieselbe Library nutzen App und Admin-Portal (dort ergänzt um shadcn).">
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
            ["Seitengrund", "Ink 800 (#0B0B0F), Karten Ink 700", "color-background = gray-blue-700, Surface = gray-blue-500", "Website eine Stufe dunkler – Fotos und Optic Yellow wirken stärker"],
            ["Primary Button", "Weiße Pille mit Verlaufs-Pfeil oder Verlaufs-Pille", "Primary = flächig Purple 500, Hover Purple 700", "Elephant-Pitch; der Verlauf ist die Website-Signatur"],
            ["Secondary Button", "Outline weiß", "Outline Magenta", "Farbrolle Secondary = Weiß auf Ink"],
            ["Button-Schrift", "Söhne Schmal, Versalien", "Poppins Medium 14–18 px", "Stärkere Markenwirkung auf großen Flächen"],
            ["Gewählter Chip / Filter", "Brand-Verlauf", "Magenta (color-background-chip-selected)", "Gleiche Logik wie aktive Tabs"],
            ["Fokus-Ring", "Optic Yellow 2 px", "Magenta-Schatten 24 %", "Auf Ink deutlich sichtbarer (≈ 17 : 1)"],
            ["Labels / Overline", "Poppins 600, 13 px, Sperrung 0,14 em", "Overline 1: Poppins Bold 12/18", "Etwas größer für mobile Lesbarkeit"],
            ["Highlight-Farbe", "Optic Yellow #DFFF4F", "nicht vorhanden", "Neu für den Relaunch"],
          ]}
        />
        <H3>Was die Website-Library ergänzt</H3>
        <ul className="grid gap-3 md:grid-cols-2">
          {[
            "Optic Yellow als Farbfamilie und semantisches Token „Highlight“",
            "Website-Verlauf (#DC05A1 → #8512B5) als Paint-Style „Gradient/Brand“, für Text auf Ink „Gradient/Brand-Text“ (#FB37E1 → #BA45ED), Brandbook-Verlauf als „Gradient/Brandbook“",
            "Radien 12, 32 und „full“ sowie Karten-, Modul- und Gutschein-Radien",
            "Website-Textstyles (Display, Accent, Button, Label, Body) mit Responsive-Modi Desktop, Tablet und Mobil",
            "Button-Varianten der Website (Primary, Gradient, Outline, Optic) als Komponenten-Sets",
            "Benennung Ink statt Gray-Blue – die Werte sind identisch",
          ].map((t) => (
            <li key={t} className="flex gap-3 rounded-[16px] border border-fg/10 bg-raised p-4 text-fg/85">
              <Check className="mt-0.5 size-5 shrink-0 text-fg" aria-hidden /> {t}
            </li>
          ))}
        </ul>
        <p className="mt-6 max-w-3xl text-fg/75">
          Offen: eine gemeinsame Core-Library für App, Admin-Portal und Website, aus der die Website-Library ihre Basis-Tokens bezieht.
        </p>
        <p className="mt-6 text-sm text-fg/60">Stand des Abgleichs: 28.10.2026.</p>
      </Block>

      {/* Code Connect */}
      <CodeConnectBlock />
    </div>
  );
}

/* ---------- building blocks of this page ---------- */

function Block({ id, eyebrow, title, lead, children }: { id: string; eyebrow: string; title: string; lead?: string; children: React.ReactNode }) {
  return (
    <Section id={id} tone="ink" className="scroll-mt-24 border-t border-fg/10 !py-16 md:!py-24">
      <div className="mb-10 flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
        <div>
          <p className="mb-3 font-display text-2xl font-extrabold italic text-brand-gradient">{eyebrow}</p>
          <Headline size="md">{title}</Headline>
        </div>
        {lead && <p className="max-w-xl text-fg/75 md:text-right">{lead}</p>}
      </div>
      {children}
    </Section>
  );
}

function H3({ children }: { children: React.ReactNode }) {
  return <h3 className="mb-4 mt-12 text-[13px] font-semibold uppercase tracking-[0.14em] text-fg/75">{children}</h3>;
}

function Note({ children }: { children: React.ReactNode }) {
  return <p className="mt-6 max-w-3xl rounded-[16px] border border-fg/10 bg-fg/[0.03] px-5 py-4 text-sm leading-relaxed text-fg/80">{children}</p>;
}

function Principle({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div className="rounded-[24px] border border-fg/10 bg-raised p-6">
      <p className="font-display text-2xl font-extrabold italic uppercase leading-none">{title}</p>
      <p className="mt-3 text-fg/75">{children}</p>
    </div>
  );
}

function RoleCard({ role, name, swatch, values, uses, bb }: { role: string; name: string; swatch: React.ReactNode; values: string; uses: string[]; bb?: BrandbookNote }) {
  const tipId = `bb-role-${role.toLowerCase()}`;
  return (
    <div className="group relative flex flex-col gap-4 rounded-[24px] border border-fg/10 bg-raised p-5 focus-within:z-40 hover:z-40">
      <div className="relative">
        {swatch}
        {bb && (
          // focusable marker: quick tip by mouse, keyboard or tap (tooltip linked via aria-describedby)
          <button type="button" aria-describedby={tipId} className={`absolute right-2 top-2 grid size-7 place-items-center rounded-full text-xs font-bold ${BB_MARK[bb.status].cls}`}>
            <span aria-hidden>{bb.status === "match" ? "●" : bb.status === "near" ? "≈" : "≠"}</span>
            <span className="sr-only">
              {name}: {BB_MARK[bb.status].label}
            </span>
          </button>
        )}
        {bb && <BrandbookTip id={tipId} note={bb} className="top-full mt-2" />}
      </div>
      <div>
        <p className="text-[13px] font-semibold uppercase tracking-[0.14em] text-fg/70">{role}</p>
        <p className="mt-1 font-display text-3xl font-extrabold italic uppercase leading-none">{name}</p>
        <p className="mt-2 font-mono text-[13px] text-fg/70">{values}</p>
      </div>
      <ul className="space-y-1.5 text-sm text-fg/85">
        {uses.map((u) => (
          <li key={u} className="flex gap-2">
            <span className="mt-2 size-1 shrink-0 rounded-full bg-fg/60" aria-hidden /> {u}
          </li>
        ))}
      </ul>
    </div>
  );
}

/** Quick-tip box for brandbook notes (hidden until the parent .group is hovered or focused). */
function BrandbookTip({ id, note, className }: { id: string; note: BrandbookNote; className?: string }) {
  return (
    <div
      id={id}
      role="tooltip"
      className={`pointer-events-none invisible absolute left-0 z-40 w-full max-w-md rounded-[14px] border border-fg/15 bg-surface p-4 text-left opacity-0 shadow-elevated transition-opacity group-hover:visible group-hover:opacity-100 group-focus-within:visible group-focus-within:opacity-100 ${className ?? ""}`}
    >
      <p className="text-[11px] font-semibold uppercase tracking-[0.14em] text-fg/60">Quicktipp · {BB_MARK[note.status].label}</p>
      <p className="mt-1 text-sm font-semibold">
        {note.target} <span className="font-normal text-fg/60">({note.de})</span>
      </p>
      <p className="mt-2 text-sm text-fg/80">{note.tip}</p>
    </div>
  );
}

const ROLE_BRANDBOOK: Record<"primary" | "secondary" | "highlight", BrandbookNote> = {
  primary: {
    status: "differs",
    target: "Brandbook-Verlauf #401B78 → #791979 → #AC007D",
    de: "ΔE 14 / 11 an den Enden",
    tip: "Der Button-Verlauf ist die App-Variante: heller (#8512B5 → #DC05A1), damit weiße Schrift mindestens 4,5 : 1 erreicht und der Verlauf auf dunklem Grund leuchtet. Der Brandbook-Verlauf ist 1:1 als „bg-brandbook-gradient“ vorhanden und wird für große Flächen genutzt (z. B. Partnerschafts-Karte, Kultur-Band, Club-Showcase).",
  },
  secondary: {
    status: "near",
    target: "PC Weiß #FFFFFF / PC Schwarz #000000",
    de: "Weiß ΔE 0 · Grund ΔE 2,7",
    tip: "Weiß trifft PC Weiß genau. Der Grund ist nicht reines PC Schwarz, sondern Ink 800 #0B0B0F – minimal angehoben und leicht bläulich: wirkt auf OLED-Displays ruhiger (kein Nachziehen beim Scrollen) und ist identisch mit der App.",
  },
  highlight: {
    status: "differs",
    target: "nicht im Brandbook",
    de: "neu",
    tip: "Neu für den Relaunch (Tennisball-Farbe „Optic Yellow“). Das Brandbook kennt keine Highlight-Farbe; Farbpass im Entwurf, Druckwerte als Empfehlung (Pantone 388 C, final zu prüfen).",
  },
};

type BrandbookNote = { status: "match" | "near" | "differs"; target: string; de: string; tip: string };

/*
 * Brandbook comparison per swatch (ΔE 2000 against the brandbook colours PC Verlauf #401B78 / #791979 / #AC007D,
 * PC Schwarz, Hellgrau, Dunkelgrau, Weiß). ≤ 2 = matches (difference barely visible), ≤ 7 = close, otherwise a
 * deliberate digital variant. Only notable steps are annotated.
 */
const BRANDBOOK: Record<string, BrandbookNote> = {
  "Purple 500": { status: "differs", target: "PC Verlauf Mitte #791979 / Purple #401B78", de: "ΔE 10 / 14", tip: "Digitaler Hauptton aus App und Figma-Library: heller und gesättigter, damit Purple auf dunklen Screens leuchtet (weiße Schrift 7,7 : 1). Das Brandbook-Purple #401B78 ist auf Druck ausgelegt und wirkt am Bildschirm fast schwarz-violett." },
  "Purple 700": { status: "near", target: "PC Verlauf Mitte #791979", de: "ΔE 6,7", tip: "Kommt dem Brandbook-Mittelton nahe – nutzbar, wenn eine Fläche den Druck-Look tragen soll." },
  "Purple 800": { status: "near", target: "PC Verlauf Purple #401B78", de: "ΔE 6,1", tip: "Nächster Ton zum Brandbook-Purple; das Brandbook-Purple ist etwas bläulicher." },
  "Magenta 500": { status: "differs", target: "PC Verlauf Magenta #AC007D", de: "ΔE 14", tip: "Digital deutlich leuchtender als das Druck-Magenta (CMYK M100). Nachteil: weiße Schrift nur 4,2 : 1 – deshalb endet der Button-Verlauf bei #DC05A1." },
  "Magenta 700": { status: "near", target: "PC Verlauf Mitte #791979 / Magenta #AC007D", de: "ΔE 5,3 / 5,4", tip: "Liegt zwischen Brandbook-Mitte und -Magenta – der beste Brückenton zwischen Website und Brandbook." },
  "Ink 100": { status: "match", target: "PC Hellgrau #B8B8BE", de: "ΔE 1,3", tip: "Trifft das Brandbook-Hellgrau praktisch genau." },
  "Ink 300": { status: "near", target: "PC Dunkelgrau #646464", de: "ΔE 5,4", tip: "Etwas kühler als das neutrale Brandbook-Dunkelgrau – die Ink-Skala ist durchgehend leicht blaugrau wie in der App." },
  "Ink 800 · Figma 900": { status: "near", target: "PC Schwarz #000000", de: "ΔE 2,7", tip: "Fast Schwarz, minimal angehoben und bläulich: wirkt auf OLED-Displays ruhiger (kein Nachziehen beim Scrollen) und entspricht der App." },
  "Optic Yellow 500": { status: "differs", target: "nicht im Brandbook", de: "–", tip: "Neu für den Relaunch (Tennisball-Farbe). Farbpass im Entwurf, Druckwerte als Empfehlung." },
};

const BB_MARK: Record<BrandbookNote["status"], { label: string; cls: string }> = {
  match: { label: "trifft das Brandbook", cls: "bg-fg text-ink-800" },
  near: { label: "nah am Brandbook", cls: "border border-fg bg-canvas/80 text-fg" },
  differs: { label: "bewusst abweichend", cls: "border border-dashed border-fg/70 bg-canvas/80 text-fg" },
};

function Palette({ name, steps }: { name: string; steps: [string, string][] }) {
  return (
    <div className="grid items-center gap-3 sm:grid-cols-[110px_minmax(0,1fr)]">
      <p className="text-sm font-semibold">{name}</p>
      {/* tooltips are anchored to the row (ul is relative) so they never leave the frame on small screens */}
      <ul className="relative grid grid-cols-3 gap-2 sm:grid-cols-[repeat(auto-fill,minmax(88px,1fr))]">
        {steps.map(([step, hex]) => {
          const key = `${name} ${step}`;
          const bb = BRANDBOOK[key];
          const tipId = `bb-${key.replace(/[^a-z0-9]+/gi, "-").toLowerCase()}`;
          return (
            <li key={step} className="group">
              {bb ? (
                // focusable so the quick tip also works by keyboard; tooltip linked via aria-describedby
                <button type="button" aria-describedby={tipId} className="relative block h-12 w-full rounded-[10px] border border-fg/10" style={{ background: hex }}>
                  <span className={`absolute right-1.5 top-1.5 grid size-5 place-items-center rounded-full text-[10px] font-bold ${BB_MARK[bb.status].cls}`} aria-hidden>
                    {bb.status === "match" ? "●" : bb.status === "near" ? "≈" : "≠"}
                  </span>
                  <span className="sr-only">
                    {key}: {BB_MARK[bb.status].label}
                  </span>
                </button>
              ) : (
                <div className="h-12 rounded-[10px] border border-fg/10" style={{ background: hex }} />
              )}
              <p className="mt-1 text-[12px] font-semibold">{step}</p>
              <p className="font-mono text-[11px] uppercase text-fg/60">{hex}</p>
              {bb && <BrandbookTip id={tipId} note={bb} className="top-full mt-2" />}
            </li>
          );
        })}
      </ul>
    </div>
  );
}

/** Semantic colour roles (globals.css) – shown side by side in both modes in the colour block. */
const THEME_ROLES = [
  { name: "canvas", use: "Seite", swatch: "bg-canvas" },
  { name: "canvas-deep", use: "tiefere Abschnitte", swatch: "bg-canvas-deep" },
  { name: "raised", use: "Karten, Panels", swatch: "bg-raised" },
  { name: "surface", use: "Felder, Kacheln", swatch: "bg-surface" },
  { name: "fg", use: "Text, Icons", swatch: "bg-fg" },
  { name: "fg/10", use: "Linien", swatch: "bg-fg/10" },
  { name: "fg-inverse", use: "Text auf fg-Buttons", swatch: "bg-fg-inverse" },
  { name: "highlight-fg", use: "Highlight als Text", swatch: "bg-highlight-fg" },
  { name: "accent-fg", use: "Live-Info, Link-Hover", swatch: "bg-accent-fg" },
] as const;

function TypeCard({ name, role, sample, children }: { name: string; role: string; sample: React.ReactNode; children: React.ReactNode }) {
  return (
    <div className="flex flex-col gap-4 rounded-[24px] border border-fg/10 bg-raised p-6">
      <div className="flex min-h-24 items-center overflow-hidden">{sample}</div>
      <div>
        <p className="text-[13px] font-semibold uppercase tracking-[0.14em] text-fg/70">{role}</p>
        <p className="mt-1 text-lg font-semibold">{name}</p>
      </div>
      <p className="text-sm text-fg/75">{children}</p>
    </div>
  );
}

function Spec({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div className="grid gap-3 border-b border-fg/10 pb-6 last:border-0 last:pb-0 lg:grid-cols-[220px_minmax(0,1fr)] lg:items-center">
      <p className="font-mono text-[12px] text-fg/60">{label}</p>
      <div className="min-w-0">{children}</div>
    </div>
  );
}

function Demo({ label, children, className, plain }: { label: string; children: React.ReactNode; className?: string; plain?: boolean }) {
  return (
    <div className={cn("flex flex-col gap-5 rounded-[24px] border border-fg/10 p-6", plain ? "bg-transparent" : "bg-raised", className)}>
      <p className="font-mono text-[12px] text-fg/60">{label}</p>
      <div className="flex flex-wrap items-center gap-3">{children}</div>
    </div>
  );
}

function DoDont({ dos, donts }: { dos: string[]; donts: string[] }) {
  return (
    <div className="grid gap-4 md:grid-cols-2">
      <div className="rounded-[24px] border border-fg/10 bg-raised p-6">
        <p className="mb-3 text-[13px] font-semibold uppercase tracking-[0.14em] text-success-fg">So</p>
        <ul className="space-y-2 text-fg/85">
          {dos.map((d) => (
            <li key={d} className="flex gap-2">
              <Check className="mt-1 size-4 shrink-0 text-success-fg" aria-hidden /> {d}
            </li>
          ))}
        </ul>
      </div>
      <div className="rounded-[24px] border border-fg/10 bg-raised p-6">
        <p className="mb-3 text-[13px] font-semibold uppercase tracking-[0.14em] text-danger-fg">Nicht so</p>
        <ul className="space-y-2 text-fg/85">
          {donts.map((d) => (
            <li key={d} className="flex gap-2">
              <X className="mt-1 size-4 shrink-0 text-danger-fg" aria-hidden /> {d}
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
      <p className="text-[12px] text-fg/70">{text}</p>
    </div>
  );
}

const CC_AREAS = ["Basis", "Layout", "Karten", "Events", "Standorte", "Module", "Barrierefreiheit"];

function CodeConnectBlock() {
  const entries = codeConnect.entries;
  const components = entries.filter((e) => e.kind === "component");
  const assets = entries.filter((e) => e.kind !== "component");
  const count = (kind: string) => entries.filter((e) => e.kind === kind).length;
  return (
    <Block
      id="code-connect"
      eyebrow="14"
      title="Code Connect"
      lead="Welche Library-Komponente welcher Code-Komponente entspricht – generiert aus den Code-Connect-Vorlagen, damit die Liste nie veraltet."
    >
      <div className="grid gap-3 sm:grid-cols-4">
        {[
          [count("component"), "Komponenten"],
          [count("icon"), "Icons"],
          [count("logo"), "Logos"],
          [count("flag"), "Länderflaggen"],
        ].map(([n, label]) => (
          <div key={label} className="rounded-[16px] border border-fg/10 bg-raised p-5">
            <p className="font-display text-4xl font-extrabold italic">{n}</p>
            <p className="mt-1 text-sm text-fg/70">{label}</p>
          </div>
        ))}
      </div>
      <p className="mt-6 max-w-3xl text-fg/75">
        In Figma zeigt Dev Mode für eine ausgewählte Instanz den passenden Code. Die Spalte „Figma-Eigenschaften“ nennt die Properties, die im Code ankommen; Hover-,
        Fokus- und Offen-Zustände sind CSS bzw. Laufzeit-Zustände ohne Prop. Quelle: <code className="text-fg">figma/**/*.figma.ts</code>, Liste:{" "}
        <code className="text-fg">node figma/overview/build-overview.mjs</code>, geprüft mit <code className="text-fg">npm run figma:check</code>.
      </p>
      {CC_AREAS.map((area) => {
        const rows = components.filter((e) => e.area === area);
        if (!rows.length) return null;
        return (
          <div key={area}>
            <H3>{area}</H3>
            <div className="mt-6 overflow-x-auto rounded-[16px] border border-fg/10">
              <table className="w-full min-w-[760px] text-left text-sm">
                <thead className="bg-fg/5 text-[12px] uppercase tracking-[0.1em] text-fg/70">
                  <tr>
                    {["Figma", "Code", "Datei", "Figma-Eigenschaften", "Hinweis"].map((h) => (
                      <th key={h} className="px-4 py-3 font-semibold">
                        {h}
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {rows.map((e) => (
                    <tr key={e.id} className="border-t border-fg/10">
                      <td className="px-4 py-3 align-top">
                        <a href={e.url} target="_blank" rel="noreferrer" className="inline-flex items-center gap-1 font-semibold text-fg underline-offset-4 hover:underline">
                          {e.figma} <ArrowUpRight className="size-3.5" aria-label="öffnet Figma" />
                        </a>
                      </td>
                      <td className="px-4 py-3 align-top font-mono text-[13px] text-accent-fg">{`<${e.code} />`}</td>
                      <td className="px-4 py-3 align-top font-mono text-[12px] text-fg/70">{e.source?.replace("src/components/", "")}</td>
                      <td className="px-4 py-3 align-top text-fg/80">{e.props?.length ? e.props.map((p) => `${p.name} (${p.kind})`).join(", ") : "–"}</td>
                      <td className="px-4 py-3 align-top text-fg/70">{e.notes || "–"}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        );
      })}
      <H3>Icons, Logos und Flaggen</H3>
      <p className="max-w-3xl text-fg/75">
        App-Icons werden zu <code className="text-fg">{"<AppIcon name=… />"}</code>, UI-Icons zu lucide-Komponenten, Logos zu Dateien unter <code className="text-fg">/brand</code>,
        Flaggen zu <code className="text-fg">{"<CountryFlag />"}</code>.
      </p>
      <ul className="mt-6 grid gap-2 text-sm sm:grid-cols-2 lg:grid-cols-3">
        {assets.map((e) => (
          <li key={e.id} className="flex min-w-0 flex-col gap-0.5 rounded-[12px] border border-fg/10 bg-raised px-3 py-2">
            <a href={e.url} target="_blank" rel="noreferrer" className="truncate text-fg/85 hover:text-fg hover:underline">
              {e.figma}
            </a>
            <span className="truncate font-mono text-[12px] text-accent-fg">{e.example}</span>
          </li>
        ))}
      </ul>
    </Block>
  );
}

function Table({ head, rows }: { head: string[]; rows: string[][] }) {
  return (
    // Scrolls sideways on phones: focusable so keyboard users can scroll it (WCAG 2.1.1)
    <div className="mt-6 overflow-x-auto rounded-[16px] border border-fg/10" tabIndex={0} role="region" aria-label={head.join(" · ")}>
      <table className="w-full min-w-[520px] text-left text-sm">
        <thead className="bg-fg/5 text-[12px] uppercase tracking-[0.1em] text-fg/70">
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
            <tr key={r[0]} className="border-t border-fg/10">
              {r.map((c, i) => (
                <td key={i} className={cn("px-4 py-3 align-top", i === 0 ? "font-semibold text-fg" : "text-fg/80")}>
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
