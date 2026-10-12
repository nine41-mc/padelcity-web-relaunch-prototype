import type { Locale } from "../i18n/config";

/**
 * "Let the players talk" – REAL testimonials from padelcity.de (home page, slider "Let the players talk",
 * fetched 2026-10-13). German quotes are VERBATIM – never edit the wording; shorten only at sentence
 * boundaries with "…". English = our translation, always shown with the translation note.
 * Names: first name only, as on padelcity.de. Photos: public/images/testimonials (see public/images/SOURCES.md).
 *
 * TODO(content): confirm consent of the four players for the new website. The quotes date from 2023
 * ("seit zwei Jahren", "Ende des Sommers"). Giersi's photo probably isn't him (the text mentions "meine Frau") –
 * check with Marketing before go-live.
 *
 * Contentful: content type "testimonial" (name, photo, quote [localized], highlight [localized], isTranslated),
 * referenced by module "testimonials".
 */

export type Testimonial = {
  id: string;
  name: string;
  photo: string;
  /** Full quote. `de` = original (verbatim), `en` = translation. */
  quote: Record<Locale, string>;
  /** One complete sentence of `quote` that is visually emphasised (must be an exact substring). */
  highlight: Record<Locale, string>;
};

export const testimonials: Testimonial[] = [
  {
    id: "kathrin",
    name: "Kathrin",
    photo: "/images/testimonials/kathrin.jpg",
    quote: {
      de: "Ich bin in meinem Leben von Sportart zu Sportart gehüpft und jede einzelne davon war großartig, von Beachvolleyball bis Skateboarding. Padel toppt sie einfach alle. Seit zwei Jahren bin ich verliebt in die irren Ballwechsel, das Spielerische, den Fokuswechsel in einer vollen Arbeitswoche, die Weiterentwicklung im eigenen Spiel – und in die Menschen auf dem Court sowieso.",
      en: "All my life I've hopped from one sport to the next, and every single one of them was great, from beach volleyball to skateboarding. Padel simply tops them all. For two years now I've been in love with the crazy rallies, the playfulness, the change of focus in a packed working week, the progress in my own game – and with the people on court, of course.",
    },
    highlight: { de: "Padel toppt sie einfach alle.", en: "Padel simply tops them all." },
  },
  {
    id: "silke",
    name: "Silke",
    photo: "/images/testimonials/silke.jpg",
    quote: {
      de: "Als kompetitive Person begeistert mich der steile Lernprozess und die schnellen Erfolge beim Padel, einem kommunikativen Sport, der alters- und geschlechtsübergreifend ausgeglichene Matches ermöglicht. Das Spielen hat mein Netzwerk signifikant erweitert, und ein gemeinsames Kaltgetränk nach dem Match ist Standard. Und nach dem Auspowern braucht es das!",
      en: "As a competitive person, I love the steep learning curve and the quick wins in padel – a sociable sport that makes for evenly matched games across ages and genders. Playing has grown my network significantly, and a cold drink together after the match is standard. And after giving it everything, you need one!",
    },
    highlight: {
      de: "Das Spielen hat mein Netzwerk signifikant erweitert, und ein gemeinsames Kaltgetränk nach dem Match ist Standard.",
      en: "Playing has grown my network significantly, and a cold drink together after the match is standard.",
    },
  },
  {
    id: "emal",
    name: "Emal",
    photo: "/images/testimonials/emal.jpg",
    quote: {
      de: "Fun, Fun, FUN!! Egal wen ich mitbringe, alle feiern es. Wir sind keine Pros, aber es kommt in jeder Runde ein Spiel zustande, auch wenn man das vorher manchmal nicht denkt. Perfektion sieht wahrscheinlich anders aus als bei uns, aber der Ball kommt regelmäßig übers Netz und darauf kommt es an. Wir werden die Zeit nutzen und besser werden, zieht euch Ende des Sommers warm an 😉",
      en: "Fun, fun, FUN!! No matter who I bring along, everyone loves it. We're no pros, but every round turns into a proper game, even when you sometimes wouldn't think so beforehand. Perfection probably looks different from what we do, but the ball regularly makes it over the net, and that's what counts. We'll use the time to get better – so by the end of the summer, you'd better watch out 😉",
    },
    highlight: { de: "Fun, Fun, FUN!!", en: "Fun, fun, FUN!!" },
  },
  {
    id: "giersi",
    name: "Giersi",
    photo: "/images/testimonials/giersi.jpg",
    quote: {
      de: "Kurz und knapp: Ich liebe Padel und bin süchtig! Neben meiner Familie und der Arbeit versuche ich die meiste Zeit auf dem Court zu verbringen und bin daher dankbar mit PadelCity nun auch endlich eine coole Halle in München für den Winter zu haben. Meine Frau und Kinder sehen mich dadurch weniger, aber ich glaube die freuen sich, dass ich so glücklich nach Hause komme.",
      en: "In short: I love padel and I'm addicted! Besides my family and work, I try to spend most of my time on court, so I'm grateful that with PadelCity there's finally a cool indoor venue in Munich for the winter, too. My wife and kids see less of me because of it, but I think they're glad I come home so happy.",
    },
    highlight: { de: "Kurz und knapp: Ich liebe Padel und bin süchtig!", en: "In short: I love padel and I'm addicted!" },
  },
];

/** Module copy ("Let the players talk" + lead taken over from padelcity.de). */
export const testimonialsContent = {
  de: {
    eyebrow: "Community",
    title: "Let the players",
    accent: "talk.",
    lead: "Zeit und Raum für die Hauptakteure.",
    translated: null,
    regionLabel: "Stimmen aus der PadelCity Community",
    slide: "Stimme {i} von {n}",
    prev: "Vorherige Stimme",
    next: "Nächste Stimme",
    goTo: "Zu Stimme {i}: {name}",
    photoAlt: "Porträt von {name}",
  },
  en: {
    eyebrow: "Community",
    title: "Let the players",
    accent: "talk.",
    lead: "Time and space for the people who matter most.",
    translated: "Translated from German",
    regionLabel: "Voices from the PadelCity community",
    slide: "Voice {i} of {n}",
    prev: "Previous voice",
    next: "Next voice",
    goTo: "Go to voice {i}: {name}",
    photoAlt: "Portrait of {name}",
  },
} satisfies Record<Locale, Record<string, string | null>>;

export type TestimonialsCopy = (typeof testimonialsContent)[Locale];
