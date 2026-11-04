// Contentful module: appBooking (config only: headline, text) + facilityGrid (club entry)

import type { Club } from "@/lib/data/types";
import type { Locale } from "@/lib/i18n/config";
import { deeplinks } from "@/lib/site";
import { locationsContent } from "@/lib/content/locations";
import { href } from "@/lib/i18n/routes";
import { Button } from "@/components/ui/Button";
import { Accent, Headline } from "@/components/ui/Headline";
import { AppIcon } from "@/components/ui/Icon";

export { formatPrice } from "@/lib/format";

/** Section "Ausstattung": facility tiles with a white icon in the brand circle. */
export function ClubFacilities({ club }: { club: Club }) {
  if (club.facilities.length === 0) return null;
  return (
    <ul className="grid grid-cols-2 gap-3 md:grid-cols-4">
      {club.facilities.map((f) => (
        <li key={f.type} className="flex items-center gap-3 rounded-[20px] border border-fg/10 bg-raised pad-card">
          <span className="grid size-11 shrink-0 place-items-center rounded-full bg-brand-gradient">
            <AppIcon name={f.icon ?? f.type} className="size-5 text-fg" />
          </span>
          {/* TODO(content): facility names come from Contentful in the requested locale */}
          <span className="min-w-0 text-sm font-medium leading-tight [overflow-wrap:anywhere] hyphens-auto">{f.name}</span>
        </li>
      ))}
    </ul>
  );
}

/**
 * "Court buchen in der App" on the club page: pitch + deep link straight to this club in the app, plus a link to the
 * app page. How the app works (features, steps) lives on the app page only (design feedback 04.11.2026).
 * PadelCity credo: no times, slots or availability on the website – booking lives in the app.
 */
export function AppBookingBlock({ club, locale }: { club: Club; locale: Locale }) {
  const t = locationsContent[locale].club.book;
  return (
    <div className="relative overflow-hidden rounded-[28px] border border-fg/10 bg-raised">
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_0%_0%,rgb(132_18_181/0.55),transparent_55%),radial-gradient(ellipse_at_100%_100%,rgb(224_5_195/0.3),transparent_55%)]" aria-hidden />
      <div className="absolute inset-0 bg-court-lines opacity-40" aria-hidden />
      <div className="relative grid gap-8 p-6 md:p-10 lg:grid-cols-[minmax(0,1fr)_auto] lg:items-end lg:p-14">
        <div>
          <Headline size="md">
            {t.title} <Accent>{t.accent}</Accent>
          </Headline>
          <p className="mt-5 max-w-xl text-fg/75 md:text-lg">{t.text}</p>
        </div>
        <div className="flex flex-col gap-3 sm:flex-row">
          <Button href={deeplinks.club(club.slug)} variant="primary" size="md" data-track="club_book_in_app">
            {t.cta}
          </Button>
          <Button href={href(locale, "app")} variant="outline" size="md" arrow={false} data-track="club_app_page">
            {t.appPage}
          </Button>
        </div>
      </div>
    </div>
  );
}
