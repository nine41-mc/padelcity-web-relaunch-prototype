// Contentful module: appBookingBlock (config only: headline, text, steps – price/hours/courts come from the club entry)

import { Clock, Euro, LayoutGrid, Smartphone } from "lucide-react";
import type { Club } from "@/lib/data/types";
import { getDictionary } from "@/lib/i18n/dictionaries";
import type { Locale } from "@/lib/i18n/config";
import { deeplinks } from "@/lib/site";
import { fill, locationsContent } from "@/lib/content/locations";
import { Button } from "@/components/ui/Button";
import { Accent, Eyebrow, Headline } from "@/components/ui/Headline";
import { AppIcon } from "@/components/ui/Icon";
import { dayLabel } from "./geo";

export { formatPrice } from "@/lib/format";
import { formatPrice } from "@/lib/format";

/** Groups courts by indoor/outdoor × double/single, e.g. "4 Indoor Double Courts" (Double/Single is self-explanatory – no player count). */
export function courtGroups(club: Pick<Club, "courts">, locale: Locale) {
  const t = locationsContent[locale].club;
  const groups = new Map<string, number>();
  for (const c of club.courts) {
    // Padel: indoor/outdoor × double/single. Other sports (tennis, pickleball, …): indoor/outdoor × sport.
    const sport = c.sport ?? "padel";
    const key = `${c.locationType}|${sport === "padel" ? c.courtType : sport}`;
    groups.set(key, (groups.get(key) ?? 0) + 1);
  }
  const sports = getDictionary(locale).sports;
  return [...groups.entries()].map(([key, n]) => {
    const [loc, kind] = key.split("|") as ["indoor" | "outdoor", string];
    const isPadel = kind === "double" || kind === "single";
    return {
      key,
      courtType: (isPadel ? kind : "double") as "double" | "single",
      label: locale === "pl"
        ? `${n} × ${t.court} ${t[loc]} ${isPadel ? t[kind as "double" | "single"] : (sports[kind as keyof typeof sports] ?? kind)}`
        : isPadel
        ? `${n} ${t[loc]} ${t[kind as "double" | "single"]} ${n > 1 ? t.courtsPlural : t.court}`
        : `${n} ${t[loc]} ${sports[kind as keyof typeof sports] ?? kind} ${n > 1 ? t.courtsPlural : t.court}`,
    };
  });
}

/**
 * "Court buchen in der App": price from, opening hours, court overview, deep link + 3 steps.
 * PadelCity credo: no times, slots or availability on the website – booking lives in the app.
 */
export function AppBookingBlock({ club, locale }: { club: Club; locale: Locale }) {
  const t = locationsContent[locale].club.book;
  const premium = club.courts.filter((c) => c.isPremium).length;
  const tile = "rounded-[20px] border border-white/10 bg-ink-800/70 p-5 backdrop-blur";
  const tileLabel = "mb-3 flex items-center gap-2 text-[13px] font-semibold uppercase tracking-[0.14em] text-white/70";

  return (
    <div className="relative overflow-hidden rounded-[28px] border border-white/10 bg-ink-700">
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_0%_0%,rgb(132_18_181/0.55),transparent_55%),radial-gradient(ellipse_at_100%_100%,rgb(224_5_195/0.3),transparent_55%)]" aria-hidden />
      <div className="absolute inset-0 bg-court-lines opacity-40" aria-hidden />

      <div className="relative grid gap-10 p-6 md:p-10 lg:grid-cols-[1.05fr_1fr] lg:gap-14 lg:p-14">
        {/* Pitch + CTA */}
        <div className="flex flex-col">
          <Eyebrow>{t.eyebrow}</Eyebrow>
          <Headline size="md" className="mt-5">
            {t.title} <Accent>{t.accent}</Accent>
          </Headline>
          <p className="mt-5 max-w-lg text-white/75 md:text-lg">{t.text}</p>
          <div className="mt-8 flex flex-col gap-5">
            <Button href={deeplinks.club(club.id)} variant="primary" size="lg" className="w-full sm:w-fit" data-track="club_book_in_app">
              {t.cta}
            </Button>
          </div>
        </div>

        {/* Facts: price, hours, courts */}
        <div className="grid gap-3 md:grid-cols-2 lg:grid-cols-1 xl:grid-cols-2">
          <div className={`${tile} md:col-span-2 lg:col-span-1 xl:col-span-2`}>
            <p className={tileLabel}>
              <Euro className="size-4" aria-hidden /> {t.perCourt}
            </p>
            {club.defaultPricePerHour ? (
              <p className="font-display text-5xl font-extrabold italic uppercase md:text-6xl">
                <span className="text-2xl text-white/70 md:text-3xl">{t.priceFrom} </span>
                {formatPrice(club.defaultPricePerHour, locale, club.currency)}
                <span className="text-2xl text-white/70 md:text-3xl"> {t.perHour}</span>
              </p>
            ) : (
              <p className="text-lg font-semibold">{t.priceOnRequest}</p>
            )}
            {/* TODO(content): price note (peak/off-peak, member prices) from Contentful once defined */}
          </div>

          <div className={tile}>
            <p className={tileLabel}>
              <Clock className="size-4" aria-hidden /> {t.hours}
            </p>
            <dl className="space-y-2">
              {club.openingHours.map((h) => (
                <div key={h.label} className="flex justify-between gap-4">
                  <dt className="text-white/70">{dayLabel(h.label, locale)}</dt>
                  <dd className="font-medium tabular-nums">
                    {h.open} – {h.close}
                  </dd>
                </div>
              ))}
            </dl>
          </div>

          <div className={tile}>
            <p className={tileLabel}>
              <LayoutGrid className="size-4" aria-hidden /> {t.courts}
            </p>
            <ul className="space-y-2.5">
              {courtGroups(club, locale).map((g) => (
                <li key={g.key} className="flex items-center gap-3">
                  <AppIcon name={`${g.courtType}_court`} className="size-5 shrink-0 text-white" />
                  <span className="leading-tight">
                    <span className="font-medium">{g.label}</span>
                  </span>
                </li>
              ))}
              {premium > 0 && (
                <li className="flex items-center gap-3">
                  <span className="grid size-5 shrink-0 place-items-center rounded-full bg-brand-gradient text-[10px] font-bold" aria-hidden>
                    ★
                  </span>
                  <span className="font-medium">
                    {premium}× {locationsContent[locale].club.panorama}
                  </span>
                </li>
              )}
            </ul>
          </div>
        </div>
      </div>

      {/* So buchst du */}
      <div className="relative border-t border-white/10 px-6 py-8 md:px-10 lg:px-14 lg:py-10">
        <h3 className="mb-6 flex items-center gap-2 text-[13px] font-semibold uppercase tracking-[0.14em] text-white/70">
          <Smartphone className="size-4" aria-hidden /> {t.stepsTitle}
        </h3>
        <ol className="grid gap-6 md:grid-cols-3 md:gap-8">
          {t.steps.map((s, i) => (
            <li key={s.title} className="flex gap-4">
              <span className="font-display text-5xl leading-none font-extrabold italic text-transparent [-webkit-text-stroke:1.5px_rgb(255_255_255/0.6)]" aria-hidden>
                {i + 1}
              </span>
              <span>
                <span className="block font-display text-xl font-extrabold italic uppercase">{s.title}</span>
                <span className="mt-1 block text-sm text-white/70">{fill(s.text, { club: club.name })}</span>
              </span>
            </li>
          ))}
        </ol>
      </div>
    </div>
  );
}
