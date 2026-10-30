import type { Locale } from "@/lib/i18n/config";
import { asset } from "@/lib/asset";
import { Marquee } from "../ui/Marquee";

// Contentful module: pressLogos (references → press entries { name, logo }). Logos as on padelcity.de ("Bekannt aus").
const PRESS = [
  { name: "SPORT1", file: "sport1-logo.svg", h: "h-8" },
  { name: "BILD", file: "bild-logo.svg", h: "h-12" },
  { name: "Business Insider", file: "business-insider-768x239.png", h: "h-12" },
  { name: "OMR", file: "omr-logo.svg", h: "h-11" },
  { name: "Handelsblatt", file: "handelsblatt-logo.svg", h: "h-7" },
  { name: "SPORT BILD", file: "sport-bild-logo.svg", h: "h-12" },
  { name: "Süddeutsche Zeitung", file: "sz-768x239.png", h: "h-14" },
  { name: "MEEDIA", file: "meedia-768x239.png", h: "h-10" },
  { name: "Capital", file: "capital-768x239.png", h: "h-11" },
  { name: "Focus Money", file: "focus-money-768x239.png", h: "h-10" },
  { name: "Welt am Sonntag", file: "was-768x200.png", h: "h-8" },
  { name: "Business Punk", file: "Business-Punk-Logo-768x350.png", h: "h-12" },
];

const copy = {
  de: { title: "Bekannt aus …" },
  en: { title: "As seen in …" },
  pl: { title: "Pisali o nas …" },
};

/** Press logos as a running band – same pattern as the partner logos, used on the magazine page. */
export function PressLogos({ locale }: { locale: Locale }) {
  const t = copy[locale];
  return (
    <section aria-labelledby="press-title" className="border-y border-fg/10 bg-canvas-deep py-14 md:py-20">
      <div className="container-site mb-8 md:mb-10">
        <h2 id="press-title" className="font-display text-4xl font-extrabold italic uppercase leading-none md:text-5xl">
          {t.title}
        </h2>
      </div>
      <Marquee>
        {PRESS.map((p) => (
          <div key={p.name} className="flex h-16 items-center px-7 opacity-70 transition hover:opacity-100 md:px-10">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src={asset(`/images/press/${p.file}`)} alt={p.name} className={`logo-white ${p.h} w-auto max-w-none`} loading="lazy" />
          </div>
        ))}
      </Marquee>
    </section>
  );
}
