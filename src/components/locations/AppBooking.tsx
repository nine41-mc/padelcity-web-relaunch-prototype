// Contentful module: appBookingBlock (config only: headline, text, steps – price/hours/courts come from the club entry)

import { ChevronDown, Euro, LayoutGrid, Smartphone, Sparkles } from "lucide-react";
import type { Club } from "@/lib/data/types";
import { getDictionary } from "@/lib/i18n/dictionaries";
import type { Locale } from "@/lib/i18n/config";
import { deeplinks } from "@/lib/site";
import { fill, locationsContent } from "@/lib/content/locations";
import { appContent } from "@/lib/content/app";
import { clubPrices, lowestPrice, type CourtKind, type PriceRow, type SportPrices } from "@/lib/content/clubPrices";
import { Button } from "@/components/ui/Button";
import { Accent, Eyebrow, Headline } from "@/components/ui/Headline";
import { AppIcon } from "@/components/ui/Icon";

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

const tile = "rounded-[20px] border border-white/10 bg-ink-700 p-5";
const tileLabel = "mb-3 flex items-center gap-2 text-[13px] font-semibold uppercase tracking-[0.14em] text-white/70";

/**
 * Price from, courts and facilities (section "Preise & Ausstattung" under the club intro). Clubs with a full price
 * list get "Alle Preise anzeigen": off-peak/peak by day group and court type, per sport.
 */
export function ClubPricing({ club, locale }: { club: Club; locale: Locale }) {
  const t = locationsContent[locale].club;
  const premium = club.courts.filter((c) => c.isPremium).length;
  const list = clubPrices[club.slug];
  const from = list ? lowestPrice(list) : club.defaultPricePerHour;
  return (
    <div>
      {/* auto-fit: a club without facilities gets two tiles, not an empty third one */}
      <div className="grid gap-3 md:grid-cols-[repeat(auto-fit,minmax(0,1fr))]">
        <div className={tile}>
          <p className={tileLabel}>
            <Euro className="size-4" aria-hidden /> {t.book.perCourt}
          </p>
          {from ? (
            <p className="font-display text-5xl font-extrabold italic uppercase">
              <span className="text-2xl text-white/70">{t.book.priceFrom} </span>
              {formatPrice(from, locale, club.currency)}
              <span className="text-2xl text-white/70"> {t.book.perHour}</span>
            </p>
          ) : (
            <p className="text-lg font-semibold">{t.book.priceOnRequest}</p>
          )}
        </div>

        <div className={tile}>
          <p className={tileLabel}>
            <LayoutGrid className="size-4" aria-hidden /> {t.book.courts}
          </p>
          <ul className="space-y-2.5" aria-label={t.courtsLabel}>
            {courtGroups(club, locale).map((g) => (
              <li key={g.key} className="flex items-center gap-3">
                <AppIcon name={`${g.courtType}_court`} className="size-5 shrink-0 text-white" />
                <span className="font-medium leading-tight">{g.label}</span>
              </li>
            ))}
            {premium > 0 && (
              <li className="flex items-center gap-3">
                <span className="grid size-5 shrink-0 place-items-center rounded-full bg-brand-gradient text-[10px] font-bold" aria-hidden>
                  ★
                </span>
                <span className="font-medium">
                  {premium}× {t.panorama}
                </span>
              </li>
            )}
          </ul>
        </div>

        {/* Contentful module: facilityGrid */}
        {club.facilities.length > 0 && (
          <div className={tile}>
            <p className={tileLabel}>
              <Sparkles className="size-4" aria-hidden /> {t.facilities.title}
            </p>
            <ul className="space-y-2.5">
              {club.facilities.map((f) => (
                <li key={f.type} className="flex items-center gap-3">
                  <AppIcon name={f.icon ?? f.type} className="size-5 shrink-0 text-white" />
                  {/* TODO(content): facility names come from Contentful in the requested locale */}
                  <span className="font-medium leading-tight">{f.name}</span>
                </li>
              ))}
            </ul>
          </div>
        )}
      </div>

      {list && (
        <details className="faq-item group mt-3">
          <summary className="inline-flex min-h-12 cursor-pointer list-none items-center gap-2 rounded-full border-2 border-white/60 px-5 font-display text-lg uppercase italic tracking-wide transition hover:border-white hover:bg-white hover:text-ink-800 [&::-webkit-details-marker]:hidden">
            <span className="group-open:hidden">{t.priceList.show}</span>
            <span className="hidden group-open:inline">{t.priceList.hide}</span>
            <ChevronDown className="size-4 transition-transform group-open:rotate-180" aria-hidden />
          </summary>
          <div className="mt-3 grid gap-3">
            {list.sports.map((sp) => (
              <PriceTable key={sp.sport} sport={sp} durationMin={list.durationMin} club={club} locale={locale} />
            ))}
          </div>
        </details>
      )}
    </div>
  );
}

function PriceTable({ sport, durationMin, club, locale }: { sport: SportPrices; durationMin: number; club: Club; locale: Locale }) {
  const t = locationsContent[locale].club;
  const sports = getDictionary(locale).sports;
  const column = (k: CourtKind) => {
    const [loc, kind] = k.split("_") as ["indoor" | "outdoor", "double" | "single"];
    return `${t[loc]} ${t[kind]}`;
  };
  const title = `${sports[sport.sport]} · ${fill(t.priceList.duration, { n: durationMin })}`;
  const slot = (r: PriceRow) => (r.until ? fill(t.priceList.until, { t: r.until }) : r.from ? fill(t.priceList.from, { t: r.from }) : t.priceList.allDay);
  return (
    <div className={`${tile} overflow-x-auto`}>
      {/* Visible label as a paragraph: a flex <caption> drops below the header row */}
      <p className={tileLabel} aria-hidden>
        <Euro className="size-4" /> {title}
      </p>
      <table className="w-full min-w-[420px] text-left">
        <caption className="sr-only">{title}</caption>
        <thead>
          <tr className="text-[13px] uppercase tracking-[0.14em] text-white/60">
            <th scope="col" className="py-2 pr-4 font-semibold">{t.priceList.time}</th>
            {sport.columns.map((c) => (
              <th key={c} scope="col" className="py-2 pl-4 text-right font-semibold">{column(c)}</th>
            ))}
          </tr>
        </thead>
        {sport.groups.map((g) => (
          <tbody key={g.days} className="border-t border-white/10">
            <tr>
              <th scope="rowgroup" colSpan={sport.columns.length + 1} className="pb-1 pt-3 font-semibold">{t.priceList[g.days]}</th>
            </tr>
            {g.rows.map((r) => (
              <tr key={slot(r)}>
                <th scope="row" className="py-1.5 pr-4 font-normal text-white/70">{slot(r)}</th>
                {sport.columns.map((c) => (
                  <td key={c} className="py-1.5 pl-4 text-right font-display text-2xl font-extrabold italic tabular-nums">
                    {r.prices[c] !== undefined ? formatPrice(r.prices[c], locale, club.currency) : "–"}
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        ))}
      </table>
    </div>
  );
}

/**
 * "Court buchen in der App" at the end of the club page: pitch + deep link, what only the app can do, 3 steps.
 * PadelCity credo: no times, slots or availability on the website – booking lives in the app.
 */
export function AppBookingBlock({ club, locale }: { club: Club; locale: Locale }) {
  const t = locationsContent[locale].club.book;
  // App-only features, copy shared with the app page (split payment, open matches, corporate benefits)
  const exclusive = appContent[locale].features.items.filter((f) => ["split", "matches", "benefits"].includes(f.id));

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

        {/* Only in the app */}
        <div>
          <h3 className="mb-4 flex items-center gap-2 text-[13px] font-semibold uppercase tracking-[0.14em] text-white/70">
            <Smartphone className="size-4" aria-hidden /> {t.exclusive}
          </h3>
          <ul className="grid gap-3">
            {exclusive.map((f) => (
              <li key={f.id} className="flex gap-4 rounded-[20px] border border-white/10 bg-ink-800/70 p-5 backdrop-blur">
                <span className="grid size-11 shrink-0 place-items-center rounded-full bg-brand-gradient">
                  <AppIcon name={f.icon} className="size-5 text-white" />
                </span>
                <span>
                  <span className="block font-display text-xl font-extrabold italic uppercase leading-tight">{f.eyebrow}</span>
                  <span className="mt-1 block text-sm text-white/70">{f.text}</span>
                </span>
              </li>
            ))}
          </ul>
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
