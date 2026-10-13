"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import type { Locale } from "@/lib/i18n/config";
import { basePath } from "@/lib/asset";
import { href, localeFromPath, type RouteKey } from "@/lib/i18n/routes";
import { getDictionary } from "@/lib/i18n/dictionaries";
import { Button } from "../ui/Button";
import { Accent, Headline } from "../ui/Headline";

const copy = {
  de: {
    title: "Ball im",
    accent: "Aus!",
    text: "Diese Seite gibt es nicht (mehr). Kein Problem – nächster Punkt, neues Glück.",
    home: "Zur Startseite",
    other: "English site",
    otherLocale: "en" as Locale,
    popular: "Beliebte Seiten",
  },
  en: {
    title: "Ball",
    accent: "out!",
    text: "This page doesn't exist (any more). No worries – next point, fresh start.",
    home: "Back to home",
    other: "Deutsche Seite",
    otherLocale: "de" as Locale,
    popular: "Popular pages",
  },
} satisfies Record<Locale, unknown>;

const popular: RouteKey[] = ["locations", "events", "magazine", "app"];

/**
 * 404 content for the single global-not-found document (static export serves one 404.html for every locale).
 * Renders German first and switches to English on the client when the requested URL is under /en.
 */
export function NotFoundContent() {
  const [locale, setLocale] = useState<Locale>("de");

  useEffect(() => {
    const path = window.location.pathname.slice(basePath.length) || "/";
    const detected = localeFromPath(path);
    if (detected !== "de") setLocale(detected);
  }, []);

  const t = copy[locale];
  const nav = getDictionary(locale).nav;

  return (
    <section lang={locale} className="relative isolate flex min-h-[90vh] items-center overflow-hidden pt-32 pb-20">
      <div className="absolute inset-0 -z-10 bg-brandbook-gradient" aria-hidden />
      <div className="absolute inset-0 -z-10 bg-court-lines" aria-hidden />
      <div className="absolute inset-0 -z-10 bg-gradient-to-b from-transparent via-transparent to-ink-800" aria-hidden />
      {/* Ball flying out of the court */}
      <span className="absolute right-[8%] top-[22%] -z-10 size-16 rounded-full bg-white opacity-90 shadow-glow md:size-24" aria-hidden />
      <div className="container-site">
        <p className="font-display text-[34vw] font-extrabold italic leading-[0.8] text-white/10 md:text-[22vw] lg:text-[16rem]" aria-hidden>
          404
        </p>
        <Headline as="h1" size="lg" className="-mt-[12vw] md:-mt-[8vw] lg:-mt-24">
          {t.title} <Accent>{t.accent}</Accent>
        </Headline>
        <p className="mt-6 max-w-lg text-lg text-white/80">{t.text}</p>
        <div className="mt-10 flex flex-wrap gap-3">
          <Button href={href(locale, "home")} size="lg">
            {t.home}
          </Button>
          <Button href={href(t.otherLocale, "home")} variant="outline" size="lg" lang={t.otherLocale}>
            {t.other}
          </Button>
        </div>
        <nav aria-label={t.popular} className="mt-10 flex flex-wrap gap-2">
          {popular.map((key) => (
            <Link
              key={key}
              href={href(locale, key)}
              className="rounded-full border border-white/25 px-4 py-2 text-sm transition-colors hover:border-white hover:bg-white/10"
            >
              {nav[key]}
            </Link>
          ))}
        </nav>
      </div>
    </section>
  );
}
