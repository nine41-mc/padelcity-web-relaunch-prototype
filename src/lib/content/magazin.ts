import type { Locale } from "../i18n/config";
import { localeTags } from "../i18n/config";
import type { Article, ImageAsset } from "../data/types";

/**
 * PadelCity Magazin – illustrative articles for the prototype (DE + EN + PL).
 * Later: Contentful content type `article` (localised fields: title, excerpt, body rich text, pullQuote, alt texts),
 * served through `@/lib/data` (getArticles / getArticle). Slugs are shared across locales.
 */

export type Hub = Article["hub"];

export const hubs: Record<Locale, { id: Hub; label: string; text: string }[]> = {
  de: [
    { id: "lernen", label: "Padel Lernen", text: "Regeln, Technik, Taktik – alles für deinen nächsten Schritt." },
    { id: "spielen", label: "Padel Spielen", text: "Matches, Turniere, Community – raus auf den Court." },
    { id: "erleben", label: "Padel Erleben", text: "Events, Culture, Behind the Scenes – die Welt von PadelCity." },
  ],
  en: [
    { id: "lernen", label: "Learn Padel", text: "Rules, technique, tactics – everything for your next step." },
    { id: "spielen", label: "Play Padel", text: "Matches, tournaments, community – get out on court." },
    { id: "erleben", label: "Live Padel", text: "Events, culture, behind the scenes – the world of PadelCity." },
  ],
  pl: [
    { id: "lernen", label: "Ucz się padla", text: "Zasady, technika, taktyka – wszystko, czego potrzebujesz na kolejny krok." },
    { id: "spielen", label: "Graj w padla", text: "Mecze, turnieje, społeczność – wychodź na kort." },
    { id: "erleben", label: "Przeżyj padla", text: "Eventy, kultura, behind the scenes – świat PadelCity." },
  ],
};

export type MagazinArticle = Article & {
  pullQuote?: string;
  inlineImage?: ImageAsset;
  /** YouTube video id (PadelCity TV). Undefined = placeholder in the prototype. */
  youtubeId?: string;
  featured?: boolean;
};

type ArticleText = {
  title: string;
  excerpt: string;
  category: string;
  author: string;
  imageAlt: string;
  body: string[];
  pullQuote?: string;
};

type ArticleSeed = {
  slug: string;
  hub: Hub;
  publishedAt: string;
  readingTimeMin: number;
  featured?: boolean;
  youtubeId?: string;
  // TODO(content): inline images per article (no matching photos available yet).
  inlineImage?: string;
} & Record<Locale, ArticleText>;

const seeds: ArticleSeed[] = [
  {
    slug: "warum-padel-am-schnellsten-waechst",
    hub: "erleben",
    publishedAt: "2026-09-28",
    readingTimeMin: 6,
    featured: true,
    de: {
      title: "Warum Padel Deutschlands am schnellsten wachsender Sport ist",
      excerpt: "Leicht zu lernen, sozial, süchtig machend: Was hinter dem Padel-Boom steckt – und warum er gerade erst beginnt.",
      category: "Culture",
      author: "PadelCity Redaktion",
      imageAlt: "Luftaufnahme eines PadelCity Clubs mit mehreren Courts",
      body: [
        "Wer zum ersten Mal einen Padel-Court betritt, merkt es nach zehn Minuten: Das hier ist anders. Der Ball bleibt im Spiel, die Wände spielen mit, und plötzlich lachen vier Menschen, die sich eben noch nicht kannten.",
        "Genau das ist das Geheimnis. Padel ist zugänglich wie kaum ein anderer Racket-Sport. Kein jahrelanges Techniktraining, bevor es Spaß macht – der erste Ballwechsel gelingt fast immer.",
        "Gleichzeitig ist Padel ein sozialer Sport. Gespielt wird im Doppel, auf kleinem Feld, mit viel Kommunikation. Nach dem Match geht's an die Bar statt in die Umkleide.",
        "In Spanien, Italien und Schweden ist Padel längst Breitensport. In Deutschland holen wir gerade auf – und die Nachfrage nach Courts ist an vielen Orten größer als das Angebot.",
        "Deshalb bauen wir: Clubs in Großstädten und Regionen, eine App, die Spieler:innen zusammenbringt, und eine Community, die jeden Tag wächst.",
      ],
      pullQuote: "Der erste Ballwechsel gelingt fast immer – und dann willst du nicht mehr aufhören.",
    },
    en: {
      title: "Why padel is Germany's fastest-growing sport",
      excerpt: "Easy to learn, social and seriously addictive: what's behind the padel boom – and why it's only just getting started.",
      category: "Culture",
      author: "PadelCity Editorial",
      imageAlt: "Aerial view of a PadelCity club with several courts",
      body: [
        "Step onto a padel court for the first time and you'll notice it within ten minutes: this is different. The ball stays in play, the walls join the game, and suddenly four people who were strangers a moment ago are laughing together.",
        "That's the secret. Padel is more accessible than almost any other racket sport. No years of technique drills before it gets fun – your first rally almost always works.",
        "Padel is also a social sport. It's played in doubles, on a compact court, with plenty of chat. After the match you head to the bar rather than the changing room.",
        "In Spain, Italy and Sweden padel has long been a mass sport. Germany is catching up fast – and in many places demand for courts is outstripping supply.",
        "That's why we build: clubs in big cities and regional hubs, an app that brings players together, and a community that grows every day.",
      ],
      pullQuote: "Your first rally almost always works – and then you never want to stop.",
    },
    pl: {
      title: "Dlaczego padel to najszybciej rosnący sport w Niemczech",
      excerpt: "Łatwy do nauczenia, towarzyski, uzależniający: co stoi za boomem na padla – i dlaczego to dopiero początek.",
      category: "Kultura",
      author: "Redakcja PadelCity",
      imageAlt: "Widok z lotu ptaka na klub PadelCity z kilkoma kortami",
      body: [
        "Kto pierwszy raz wchodzi na kort do padla, po dziesięciu minutach już wie: to coś innego. Piłka zostaje w grze, ściany grają razem z tobą, a czwórka ludzi, którzy przed chwilą się nie znali, nagle śmieje się razem.",
        "I właśnie w tym tkwi sekret. Padel jest dostępny jak mało który sport rakietowy. Żadnych lat treningu techniki, zanim zacznie sprawiać frajdę – pierwsza wymiana prawie zawsze się udaje.",
        "Jednocześnie padel to sport towarzyski. Gra się w deblu, na małym korcie, przy ciągłej komunikacji. Po meczu idzie się do baru, a nie do szatni.",
        "W Hiszpanii, we Włoszech i w Szwecji padel od dawna jest sportem masowym. Niemcy właśnie nadrabiają zaległości – a w wielu miejscach popyt na korty przewyższa podaż.",
        "Dlatego budujemy: kluby w dużych miastach i regionach, aplikację, która łączy graczy, i społeczność, która rośnie każdego dnia.",
      ],
      pullQuote: "Pierwsza wymiana prawie zawsze się udaje – a potem nie chcesz już przestać.",
    },
  },
  {
    slug: "padel-regeln-in-5-minuten",
    hub: "lernen",
    publishedAt: "2026-09-21",
    readingTimeMin: 5,
    de: {
      title: "Padel-Regeln in 5 Minuten",
      excerpt: "Aufschlag, Wände, Zählweise: Alles, was du für dein erstes Match wissen musst – kompakt erklärt.",
      category: "Basics",
      author: "PadelCity Academy",
      imageAlt: "Netz mit PadelCity-Logo auf einem Court",
      body: [
        "Padel wird fast immer im Doppel gespielt, auf einem 20 × 10 Meter großen Court, umgeben von Glas- und Gitterwänden. Gezählt wird wie im Tennis: 15, 30, 40, Spiel.",
        "Aufgeschlagen wird von unten, diagonal ins gegnerische Aufschlagfeld. Der Ball muss vorher einmal hinter der Linie aufspringen und wird unterhalb der Hüfte getroffen.",
        "Nach dem Aufprall im eigenen Feld darf der Ball die Wände berühren – und du darfst ihn danach noch spielen. Genau das macht die langen Ballwechsel aus.",
        "Direkt in die Wand oder ins Gitter des Gegners zu spielen, ist dagegen ein Fehler. Der Ball muss immer zuerst im gegnerischen Feld aufkommen.",
        "Das war's schon fast. Den Rest lernst du am besten auf dem Court – zum Beispiel in einem Einsteigerkurs der PadelCity Academy.",
      ],
      pullQuote: "Die Wand ist nicht dein Gegner. Sie ist dein bester Mitspieler.",
    },
    en: {
      title: "Padel rules in 5 minutes",
      excerpt: "Serve, walls, scoring: everything you need to know for your first match – explained in a nutshell.",
      category: "Basics",
      author: "PadelCity Academy",
      imageAlt: "Net with the PadelCity logo on a court",
      body: [
        "Padel is almost always played as doubles, on a 20 × 10 metre court enclosed by glass and mesh walls. Scoring works just like tennis: 15, 30, 40, game.",
        "You serve underarm, diagonally into your opponents' service box. The ball has to bounce once behind the line first and is struck below hip height.",
        "Once the ball has bounced on your side, it's allowed to hit the walls – and you can still play it afterwards. That's what makes the long rallies possible.",
        "Hitting the ball straight into your opponents' wall or fence, on the other hand, is a fault. The ball must always land in their half first.",
        "That's pretty much it. The rest is best learned on court – for example in a beginners' course at the PadelCity Academy.",
      ],
      pullQuote: "The wall isn't your opponent. It's your best teammate.",
    },
    pl: {
      title: "Zasady padla w 5 minut",
      excerpt: "Serwis, ściany, liczenie punktów: wszystko, co musisz wiedzieć przed pierwszym meczem – w pigułce.",
      category: "Podstawy",
      author: "PadelCity Academy",
      imageAlt: "Siatka z logo PadelCity na korcie",
      body: [
        "W padla gra się prawie zawsze w deblu, na korcie o wymiarach 20 × 10 metrów, otoczonym szklanymi ścianami i siatką. Punkty liczy się jak w tenisie: 15, 30, 40, gem.",
        "Serwuje się od dołu, po przekątnej, w pole serwisowe przeciwnika. Piłka musi najpierw raz odbić się za linią i jest uderzana poniżej wysokości bioder.",
        "Po odbiciu na twojej połowie piłka może dotknąć ścian – a ty nadal możesz ją potem zagrać. To właśnie dzięki temu wymiany są tak długie.",
        "Zagranie piłki bezpośrednio w ścianę lub siatkę przeciwnika to natomiast błąd. Piłka zawsze musi najpierw odbić się na połowie przeciwnika.",
        "To w zasadzie wszystko. Resztę najlepiej poznasz na korcie – na przykład na kursie dla początkujących w PadelCity Academy.",
      ],
      pullQuote: "Ściana nie jest twoim przeciwnikiem. To twój najlepszy partner.",
    },
  },
  {
    slug: "die-bandeja-erklaert",
    hub: "lernen",
    publishedAt: "2026-09-14",
    readingTimeMin: 4,
    youtubeId: undefined, // TODO(content): PadelCity TV video id
    de: {
      title: "Die Bandeja erklärt",
      excerpt: "Der wichtigste Schlag im Padel ist kein Smash. So spielst du die Bandeja – und wann du sie einsetzt.",
      category: "Technik",
      author: "PadelCity Academy",
      imageAlt: "Spielszene auf einem PadelCity Court",
      body: [
        "Die Bandeja ist ein Überkopfschlag, der nicht auf den direkten Punkt zielt, sondern auf Kontrolle. Du hältst damit die Netzposition, wenn der Gegner dich mit einem Lob nach hinten drängen will.",
        "Der Schläger bleibt dabei vor dem Körper, die Schlagfläche leicht geöffnet. Statt voller Power gibst du dem Ball Slice mit – er springt flach ab und bleibt im Spiel.",
        "Ziel ist meist die Ecke oder der Bereich vor der Rückwand des Gegners. So gewinnst du Zeit, um wieder ans Netz zu kommen.",
        "Typischer Fehler: zu viel wollen. Die Bandeja ist kein Smash. Wer jeden Lob schmettern will, verliert die Netzposition schneller, als ihm lieb ist.",
      ],
      pullQuote: "Kontrolle schlägt Power – fast immer.",
    },
    en: {
      title: "The bandeja explained",
      excerpt: "Padel's most important shot isn't the smash. Here's how to play the bandeja – and when to use it.",
      category: "Technique",
      author: "PadelCity Academy",
      imageAlt: "Rally on a PadelCity court",
      body: [
        "The bandeja is an overhead shot that isn't about winning the point outright – it's about control. It lets you hold the net when your opponents try to push you back with a lob.",
        "Keep the racket in front of your body with the face slightly open. Instead of going for full power, you put slice on the ball so it stays low after the bounce and keeps the rally alive.",
        "Usually you aim for the corner or the area just in front of your opponents' back wall. That buys you time to get back to the net.",
        "The classic mistake: trying to do too much. The bandeja is not a smash. Try to put away every lob and you'll lose the net faster than you'd like.",
      ],
      pullQuote: "Control beats power – nearly every time.",
    },
    pl: {
      title: "Bandeja w pigułce",
      excerpt: "Najważniejsze uderzenie w padlu to nie smecz. Jak zagrać bandeję – i kiedy jej używać.",
      category: "Technika",
      author: "PadelCity Academy",
      imageAlt: "Scena z gry na korcie PadelCity",
      body: [
        "Bandeja to uderzenie nad głową, które nie ma na celu bezpośredniego zdobycia punktu, tylko kontrolę. Dzięki niej utrzymujesz pozycję przy siatce, gdy przeciwnik lobem próbuje zepchnąć cię do tyłu.",
        "Rakieta pozostaje przed ciałem, a jej powierzchnia jest lekko otwarta. Zamiast pełnej siły nadajesz piłce slajs – odbija się nisko i zostaje w grze.",
        "Celem jest zwykle narożnik albo strefa przed tylną ścianą przeciwnika. Tak zyskujesz czas, żeby wrócić do siatki.",
        "Typowy błąd: chcieć za dużo. Bandeja to nie smecz. Kto próbuje zabić każdy lob, traci pozycję przy siatce szybciej, niżby chciał.",
      ],
      pullQuote: "Kontrola wygrywa z siłą – prawie zawsze.",
    },
  },
  {
    slug: "one-point-challenge",
    hub: "erleben",
    publishedAt: "2026-09-07",
    readingTimeMin: 4,
    youtubeId: undefined, // TODO(content): PadelCity TV aftermovie id
    de: {
      title: "One Point Challenge: Ein Punkt, 100.000 €",
      excerpt: "Ein Ballwechsel entscheidet. Die One Point Challenge powered by CUPRA ist das spektakulärste Format im deutschen Padel.",
      category: "Events",
      author: "PadelCity Redaktion",
      imageAlt: "Smash bei einem PadelCity Event mit CUPRA-Branding",
      body: [
        "Stell dir vor, ein einziger Punkt entscheidet. Kein Satz, kein Tiebreak – nur ein Ballwechsel. Das ist die One Point Challenge powered by CUPRA.",
        "Das Format ist so einfach wie gnadenlos: Wer den Punkt gewinnt, kommt weiter. Wer ihn verliert, ist raus. Am Ende geht es um bis zu 100.000 € Preisgeld.",
        "Genau deshalb ist die Stimmung einzigartig. Jeder Ballwechsel ist ein Finale – auf dem Court und auf der Tribüne.",
        "Mitmachen kann jede:r mit PadelCity-Account. Alle Termine und die Anmeldung findest du in der App.",
      ],
      pullQuote: "Ein Punkt. Kein Netz, kein doppelter Boden.",
    },
    en: {
      title: "One Point Challenge: one point, €100,000",
      excerpt: "A single rally decides it all. The One Point Challenge powered by CUPRA is the most spectacular format in German padel.",
      category: "Events",
      author: "PadelCity Editorial",
      imageAlt: "A smash at a PadelCity event with CUPRA branding",
      body: [
        "Imagine a single point deciding everything. No set, no tie-break – just one rally. That's the One Point Challenge powered by CUPRA.",
        "The format is as simple as it is ruthless: win the point and you're through. Lose it and you're out. At the end, up to €100,000 in prize money is up for grabs.",
        "That's exactly why the atmosphere is unique. Every rally is a final – on court and in the stands.",
        "Anyone with a PadelCity account can take part. You'll find all the dates and sign-up in the app.",
      ],
      pullQuote: "One point. No safety net, no second chance.",
    },
    pl: {
      title: "One Point Challenge: jeden punkt, 100 000 €",
      excerpt: "Decyduje jedna wymiana. One Point Challenge powered by CUPRA to najbardziej spektakularny format w niemieckim padlu.",
      category: "Eventy",
      author: "Redakcja PadelCity",
      imageAlt: "Smecz podczas eventu PadelCity z brandingiem CUPRA",
      body: [
        "Wyobraź sobie, że o wszystkim decyduje jeden punkt. Żadnego seta, żadnego tie-breaka – tylko jedna wymiana. To właśnie One Point Challenge powered by CUPRA.",
        "Format jest tak prosty, jak bezlitosny: kto wygra punkt, przechodzi dalej. Kto przegra, odpada. Na końcu do zgarnięcia jest do 100 000 € nagrody.",
        "Właśnie dlatego atmosfera jest wyjątkowa. Każda wymiana to finał – na korcie i na trybunach.",
        "Wziąć udział może każdy, kto ma konto PadelCity. Wszystkie terminy i zapisy znajdziesz w aplikacji.",
      ],
      pullQuote: "Jeden punkt. Bez siatki asekuracyjnej, bez drugiej szansy.",
    },
  },
  {
    slug: "padel-mit-kindern",
    hub: "spielen",
    publishedAt: "2026-08-30",
    readingTimeMin: 5,
    de: {
      title: "Padel mit Kindern: So macht der Einstieg Spaß",
      excerpt: "Kleiner Court, große Wirkung: Warum Padel der perfekte Familiensport ist und wie Kids am besten starten.",
      category: "Family",
      author: "PadelCity Academy",
      // TODO(content): real kids photo – current image is a generic match scene.
      imageAlt: "Spielszene bei einem PadelCity Club-Opening",
      body: [
        "Kinder lieben Padel, weil sie schnell Erfolgserlebnisse haben. Der Court ist kleiner als im Tennis, der Schläger kürzer, und der Ball kommt über die Wände oft noch einmal zurück.",
        "Für den Einstieg reichen bequeme Sportkleidung, Hallenschuhe und ein leichter Kinderschläger. Leihschläger gibt's in den Clubs.",
        "Am besten startet ihr spielerisch: Ball zuspielen, Wand-Spiele, kleine Challenges. Regeln kommen später fast von allein.",
        "In der PadelCity Academy gibt es eigene Kids-Kurse, in denen Coaches mit kindgerechten Übungen arbeiten.",
        "Und das Schönste: Padel ist eine der wenigen Sportarten, die Eltern und Kinder wirklich gemeinsam spielen können.",
      ],
      pullQuote: "Eine der wenigen Sportarten, die Eltern und Kinder wirklich gemeinsam spielen können.",
    },
    en: {
      title: "Padel with kids: how to make the first steps fun",
      excerpt: "Small court, big impact: why padel is the perfect family sport and how kids get off to the best start.",
      category: "Family",
      author: "PadelCity Academy",
      imageAlt: "Match scene at a PadelCity club opening",
      body: [
        "Kids love padel because they get that winning feeling quickly. The court is smaller than in tennis, the racket is shorter, and the ball often comes back off the walls for a second chance.",
        "To get started, all you need is comfortable sportswear, indoor shoes and a light junior racket. You can borrow rackets at the clubs.",
        "Start playfully: feeding the ball, wall games, little challenges. The rules will follow almost by themselves.",
        "The PadelCity Academy runs dedicated kids' courses, where coaches use age-appropriate drills.",
        "And the best bit: padel is one of the few sports parents and children can genuinely play together.",
      ],
      pullQuote: "One of the few sports parents and children can genuinely play together.",
    },
    pl: {
      title: "Padel z dziećmi: jak sprawić, by początki były frajdą",
      excerpt: "Mały kort, duży efekt: dlaczego padel to idealny sport rodzinny i jak dzieciaki najlepiej mogą zacząć.",
      category: "Rodzina",
      author: "PadelCity Academy",
      imageAlt: "Scena z gry podczas otwarcia klubu PadelCity",
      body: [
        "Dzieci kochają padla, bo szybko odnoszą sukcesy. Kort jest mniejszy niż w tenisie, rakieta krótsza, a piłka często wraca jeszcze raz od ściany.",
        "Na początek wystarczy wygodny strój sportowy, buty halowe i lekka rakieta dla dzieci. Rakiety można wypożyczyć w klubach.",
        "Najlepiej zacznijcie od zabawy: podawanie piłki, gry ze ścianą, małe wyzwania. Zasady przyjdą później niemal same.",
        "W PadelCity Academy są osobne kursy dla dzieci, na których trenerzy pracują z ćwiczeniami dopasowanymi do wieku.",
        "A najlepsze jest to, że padel to jeden z niewielu sportów, w które rodzice i dzieci naprawdę mogą grać razem.",
      ],
      pullQuote: "Jeden z niewielu sportów, w które rodzice i dzieci naprawdę mogą grać razem.",
    },
  },
  {
    slug: "behind-the-scenes-neuer-club",
    hub: "erleben",
    publishedAt: "2026-08-22",
    readingTimeMin: 6,
    youtubeId: undefined, // TODO(content): PadelCity TV timelapse id
    de: {
      title: "Behind the scenes: So entsteht ein neuer Club",
      excerpt: "Von der leeren Halle zum Opening-Abend: Wir zeigen, wie ein PadelCity Club entsteht.",
      category: "Behind the Scenes",
      author: "PadelCity Redaktion",
      imageAlt: "Neuer PadelCity Club in Wetzlar mit frisch gebauten Courts",
      body: [
        "Am Anfang steht fast immer eine leere Halle. Unser Expansion-Team prüft Deckenhöhe, Boden, Lage und Erreichbarkeit – und rechnet, wie viele Courts hineinpassen.",
        "Dann geht es schnell: Courts werden geliefert, Glaswände montiert, Kunstrasen verlegt, Licht eingemessen. Parallel entstehen Lounge, Empfang und Umkleiden.",
        "Während auf der Baustelle gearbeitet wird, startet das Marketing: Pre-Opening-Events, Social-Kampagnen und die ersten Buchungen in der App.",
        "Das Team vor Ort wird eingearbeitet – vom Empfang bis zu den Coaches der Academy. Unser Playbook sorgt dafür, dass jeder Club sich nach PadelCity anfühlt.",
        "Und dann ist er da: der Opening-Abend. Musik, Licht, volle Courts. Make some noise for Padel.",
      ],
      pullQuote: "Unser Playbook sorgt dafür, dass jeder Club sich nach PadelCity anfühlt.",
    },
    en: {
      title: "Behind the scenes: how a new club comes to life",
      excerpt: "From an empty hall to opening night: we show you how a PadelCity club is born.",
      category: "Behind the Scenes",
      author: "PadelCity Editorial",
      imageAlt: "New PadelCity club in Wetzlar with freshly built courts",
      body: [
        "It almost always starts with an empty hall. Our expansion team checks the ceiling height, floor, location and access – and works out how many courts will fit.",
        "Then things move fast: courts are delivered, glass walls fitted, artificial turf laid and lighting calibrated. At the same time the lounge, reception and changing rooms take shape.",
        "While work carries on at the site, marketing kicks off: pre-opening events, social campaigns and the first bookings in the app.",
        "The local team is trained up – from reception to the academy coaches. Our playbook makes sure every club feels like PadelCity.",
        "And then it's here: opening night. Music, lights, packed courts. Make some noise for Padel.",
      ],
      pullQuote: "Our playbook makes sure every club feels like PadelCity.",
    },
    pl: {
      title: "Behind the scenes: tak powstaje nowy klub",
      excerpt: "Od pustej hali do wieczoru otwarcia: pokazujemy, jak powstaje klub PadelCity.",
      category: "Behind the Scenes",
      author: "Redakcja PadelCity",
      imageAlt: "Nowy klub PadelCity w Wetzlar ze świeżo zbudowanymi kortami",
      body: [
        "Na początku prawie zawsze jest pusta hala. Nasz zespół ds. ekspansji sprawdza wysokość sufitu, podłoże, lokalizację i dojazd – i liczy, ile kortów się zmieści.",
        "Potem wszystko dzieje się szybko: dostarczane są korty, montowane szklane ściany, układana sztuczna trawa, kalibrowane oświetlenie. Równolegle powstają lounge, recepcja i szatnie.",
        "Kiedy na budowie trwają prace, startuje marketing: eventy przed otwarciem, kampanie w social mediach i pierwsze rezerwacje w aplikacji.",
        "Zespół na miejscu przechodzi wdrożenie – od recepcji po trenerów Akademii. Nasz playbook dba o to, żeby każdy klub był w stu procentach PadelCity.",
        "I wreszcie nadchodzi: wieczór otwarcia. Muzyka, światła, pełne korty. Make some noise for Padel.",
      ],
      pullQuote: "Nasz playbook dba o to, żeby każdy klub był w stu procentach PadelCity.",
    },
  },
];

function localise(seed: ArticleSeed, locale: Locale): MagazinArticle {
  const t = seed[locale];
  return {
    slug: seed.slug,
    hub: seed.hub,
    publishedAt: seed.publishedAt,
    readingTimeMin: seed.readingTimeMin,
    featured: seed.featured,
    youtubeId: seed.youtubeId,
    title: t.title,
    excerpt: t.excerpt,
    category: t.category,
    author: t.author,
    body: t.body,
    pullQuote: t.pullQuote,
    image: { url: `/images/magazin/${seed.slug}.jpg`, alt: t.imageAlt },
    inlineImage: seed.inlineImage ? { url: seed.inlineImage, alt: t.imageAlt } : undefined,
  };
}

export const articleSlugs = seeds.map((s) => s.slug);

export function getArticles(locale: Locale): MagazinArticle[] {
  return seeds.map((s) => localise(s, locale));
}

export function getArticle(slug: string, locale: Locale): MagazinArticle | undefined {
  const seed = seeds.find((s) => s.slug === slug);
  return seed ? localise(seed, locale) : undefined;
}

export function getRelated(article: MagazinArticle, locale: Locale, n = 3) {
  const all = getArticles(locale);
  const same = all.filter((a) => a.slug !== article.slug && a.hub === article.hub);
  const rest = all.filter((a) => a.slug !== article.slug && a.hub !== article.hub);
  return [...same, ...rest].slice(0, n);
}

export function hubLabel(hub: Hub, locale: Locale) {
  return hubs[locale].find((h) => h.id === hub)?.label ?? hub;
}

export function formatDate(iso: string, locale: Locale) {
  return new Date(iso).toLocaleDateString(localeTags[locale].intl, { day: "numeric", month: "long", year: "numeric" });
}

// Contentful: page "magazine" (modules listed in src/views/magazine/*View.tsx)
const de = {
  meta: {
    title: "Magazin – Padel lernen, spielen, erleben",
    description: "Das PadelCity Magazin: Regeln, Technik, Events, Culture und Behind the Scenes aus der Welt von PadelCity.",
  },
  hero: { eyebrow: "PadelCity Magazin", title: "Stories vom", accent: "Court" },
  featured: "Featured",
  minutes: "Min.",
  readingTime: "Min. Lesezeit",
  filter: { aria: "Magazin filtern", all: "Alle Stories", count: "{n} Stories aus der Welt von PadelCity" },
  newsletter: { title: "Der Magazin-Newsletter", text: "Die besten Stories, Technik-Tipps und Event-News – einmal im Monat in deinem Postfach." },
  article: {
    back: "Magazin",
    share: "Teile die Story",
    related: "Weiterlesen",
    more: { title: "Mehr Stories?", text: "Die besten Magazin-Artikel und Event-News – einmal im Monat in deinem Postfach." },
    video: "PadelCity TV",
  },
  shareUi: { aria: "Artikel teilen", share: "Teilen", copy: "Link kopieren", copied: "Kopiert!" },
  videoUi: {
    play: "Video abspielen",
    soon: "Video folgt",
    poster: "Vorschaubild",
    placeholder: "Platzhalter – Video-ID folgt aus Contentful",
    consent: "Beim Abspielen werden Daten an YouTube übertragen.",
  },
};

export type MagazinContent = typeof de;

const en: MagazinContent = {
  meta: {
    title: "Magazine – learn, play and live padel",
    description: "The PadelCity magazine: rules, technique, events, culture and behind-the-scenes stories from the world of PadelCity.",
  },
  hero: { eyebrow: "PadelCity Magazine", title: "Stories from the", accent: "court" },
  featured: "Featured",
  minutes: "min",
  readingTime: "min read",
  filter: { aria: "Filter the magazine", all: "All stories", count: "{n} stories from the world of PadelCity" },
  newsletter: { title: "The magazine newsletter", text: "The best stories, technique tips and event news – once a month, straight to your inbox." },
  article: {
    back: "Magazine",
    share: "Share the story",
    related: "Read on",
    more: { title: "Want more stories?", text: "The best magazine articles and event news – once a month, straight to your inbox." },
    video: "PadelCity TV",
  },
  shareUi: { aria: "Share article", share: "Share", copy: "Copy link", copied: "Copied!" },
  videoUi: {
    play: "Play video",
    soon: "Video coming soon",
    poster: "Preview image",
    placeholder: "Placeholder – video ID to follow from Contentful",
    consent: "Playing the video transfers data to YouTube.",
  },
};

const pl: MagazinContent = {
  meta: {
    title: "Magazyn – ucz się padla, graj, przeżywaj",
    description: "Magazyn PadelCity: zasady, technika, eventy, kultura i behind the scenes ze świata PadelCity.",
  },
  hero: { eyebrow: "Magazyn PadelCity", title: "Historie prosto z", accent: "kortu" },
  featured: "Polecane",
  minutes: "min",
  readingTime: "min czytania",
  filter: { aria: "Filtruj magazyn", all: "Wszystkie historie", count: "Historie ze świata PadelCity: {n}" },
  newsletter: { title: "Newsletter magazynu", text: "Najlepsze historie, porady techniczne i wieści o eventach – raz w miesiącu w twojej skrzynce." },
  article: {
    back: "Magazyn",
    share: "Udostępnij historię",
    related: "Czytaj dalej",
    more: { title: "Chcesz więcej historii?", text: "Najlepsze artykuły z magazynu i wieści o eventach – raz w miesiącu w twojej skrzynce." },
    video: "PadelCity TV",
  },
  shareUi: { aria: "Udostępnij artykuł", share: "Udostępnij", copy: "Kopiuj link", copied: "Skopiowano!" },
  videoUi: {
    play: "Odtwórz wideo",
    soon: "Wideo wkrótce",
    poster: "Miniatura",
    placeholder: "Placeholder – ID wideo pojawi się z Contentful",
    consent: "Podczas odtwarzania dane są przesyłane do YouTube.",
  },
};

export const magazinContent: Record<Locale, MagazinContent> = { de, en, pl };
