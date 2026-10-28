import Link from "next/link";
import { keepTogether } from "@/lib/typography";
import { CalendarDays, MapPin } from "lucide-react";
import type { ClubEvent } from "@/lib/data/types";
import { Media } from "../ui/Media";
import { Chip } from "../ui/Chip";
import { EventSignup } from "../events/EventSignup";
import { cn } from "../ui/cn";
import type { Locale } from "@/lib/i18n/config";
import { localeTags } from "@/lib/i18n/config";
import { href } from "@/lib/i18n/routes";
import { getDictionary } from "@/lib/i18n/dictionaries";
import { eventWallClock } from "../play/eventFormat";

// Safari's ICU joins the parts differently ("Do. 05. Nov." instead of "Do., 05. Nov.") – the server HTML would not
// match the client render (React hydration error). So only the parts come from Intl, the separators are fixed.
const DATE_PATTERN: Record<Locale, (p: Record<string, string>) => string> = {
  de: (p) => `${p.weekday}, ${p.day}. ${p.month}`,
  en: (p) => `${p.weekday} ${p.day} ${p.month}`,
  pl: (p) => `${p.weekday}, ${p.day} ${p.month}`,
};

export function formatEventDate(iso: string, locale: Locale = "de") {
  const fmt = new Intl.DateTimeFormat(localeTags[locale].intl, { weekday: "short", day: "2-digit", month: "short", timeZone: "UTC" });
  const parts = Object.fromEntries(fmt.formatToParts(eventWallClock(iso)).map((p) => [p.type, p.value]));
  const suffix = getDictionary(locale).eventCard.time;
  return DATE_PATTERN[locale](parts) + " · " + iso.slice(11, 16) + (suffix ? ` ${suffix}` : "");
}

export function EventCard({ event, locale = "de", className }: { event: ClubEvent; locale?: Locale; className?: string }) {
  const t = getDictionary(locale).eventCard;
  const price = event.pricePerPerson
    ? new Intl.NumberFormat(localeTags[locale].intl, { style: "currency", currency: "EUR", maximumFractionDigits: 0 }).format(event.pricePerPerson)
    : t.free;
  return (
    <article
      className={cn(
        "group relative flex min-w-0 flex-col overflow-hidden rounded-[20px] border border-white/10 bg-ink-700 transition-all duration-300 hover:-translate-y-1 hover:border-magenta-500/50",
        className,
      )}
    >
      <div className="relative">
        <Media src={event.image?.url} alt={event.image?.alt ?? event.title} className="aspect-[16/10]" overlay sizes="(min-width:1200px) 33vw, (min-width:768px) 50vw, 100vw" />
        <div className="absolute inset-x-3 top-3 flex justify-between">
          {event.recurrence ? <Chip tone="gradient">{event.recurrence}</Chip> : <Chip tone="dark">{event.type === "tournament" ? t.tournament : event.type === "training" ? t.training : t.event}</Chip>}
        </div>
        {/* Price bottom-right on the image – same placement as on the club cards */}
        <div className="pointer-events-none absolute inset-x-0 bottom-0 h-2/5 bg-gradient-to-t from-black/75 to-transparent" aria-hidden />
        <p className="absolute bottom-3 right-4 whitespace-nowrap font-display text-4xl font-extrabold italic uppercase leading-none text-white drop-shadow-[0_2px_8px_rgba(0,0,0,0.6)]">{price}</p>
      </div>
      <div className="flex flex-1 flex-col gap-3 p-5">
        <div className="flex items-start justify-between gap-3">
          <h3 className="text-lg font-semibold leading-tight">
            <Link href={href(locale, "events", event.slug)} className="after:absolute after:inset-0 after:content-['']">
              {keepTogether(event.title)}
            </Link>
          </h3>
          {event.level && <Chip tone="level" className="shrink-0">{event.level}</Chip>}
        </div>
        <ul className="space-y-1 text-sm text-white/70">
          <li className="flex items-center gap-2">
            <CalendarDays className="size-4 text-white/70" /> {formatEventDate(event.start, locale)}
          </li>
          {event.clubName && (
            <li className="flex items-center gap-2">
              <MapPin className="size-4 text-white/70" /> {event.clubName}
            </li>
          )}
        </ul>
        {/* Sign-up: app primary, web as outline. No capacity/places left. */}
        <div className="relative z-10 mt-auto border-t border-white/10 pt-4">
          <EventSignup eventId={event.id} locale={locale} size="sm" />
        </div>
      </div>
    </article>
  );
}
