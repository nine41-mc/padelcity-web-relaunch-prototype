// Contentful module: appBookingBlock (config only: headline, text, steps) + facilityGrid (club entry)

import { Smartphone } from "lucide-react";
import type { Club } from "@/lib/data/types";
import type { Locale } from "@/lib/i18n/config";
import { deeplinks } from "@/lib/site";
import { fill, locationsContent } from "@/lib/content/locations";
import { appContent } from "@/lib/content/app";
import { Button } from "@/components/ui/Button";
import { Accent, Eyebrow, Headline } from "@/components/ui/Headline";
import { AppIcon } from "@/components/ui/Icon";

export { formatPrice } from "@/lib/format";

/** Section "Ausstattung": facility tiles with a white icon in the brand circle. */
export function ClubFacilities({ club }: { club: Club }) {
  if (club.facilities.length === 0) return null;
  return (
    <ul className="grid grid-cols-2 gap-3 md:grid-cols-4">
      {club.facilities.map((f) => (
        <li key={f.type} className="flex items-center gap-3 rounded-[20px] border border-white/10 bg-ink-700 p-4 md:p-5">
          <span className="grid size-11 shrink-0 place-items-center rounded-full bg-brand-gradient">
            <AppIcon name={f.icon ?? f.type} className="size-5 text-white" />
          </span>
          {/* TODO(content): facility names come from Contentful in the requested locale */}
          <span className="min-w-0 text-sm font-medium leading-tight [overflow-wrap:anywhere] hyphens-auto">{f.name}</span>
        </li>
      ))}
    </ul>
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
