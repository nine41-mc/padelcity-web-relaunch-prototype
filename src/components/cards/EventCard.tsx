import Link from "next/link";
import { keepTogether } from "@/lib/typography";
import { CalendarDays, MapPin } from "lucide-react";
import type { ClubEvent } from "@/lib/data/types";
import { deeplinks, webApp } from "@/lib/site";
import { Media } from "../ui/Media";
import { Chip } from "../ui/Chip";
import { cn } from "../ui/cn";
import type { Locale } from "@/lib/i18n/config";
import { localeTags } from "@/lib/i18n/config";
import { href } from "@/lib/i18n/routes";
import { getDictionary } from "@/lib/i18n/dictionaries";

export function formatEventDate(iso: string, locale: Locale = "de") {
  const d = new Date(iso);
  const suffix = getDictionary(locale).eventCard.time;
  return d.toLocaleDateString(localeTags[locale].intl, { weekday: "short", day: "2-digit", month: "short" }) + " · " + iso.slice(11, 16) + (suffix ? ` ${suffix}` : "");
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
        {/* Sign-up: web app (primary) or app deep link (secondary). No capacity/places left. */}
        <div className="relative z-10 mt-auto flex items-end justify-between gap-3 border-t border-white/10 pt-4">
          <p className="pb-1 font-display text-3xl font-extrabold italic leading-none">{price}</p>
          <div className="flex flex-col items-end gap-1">
            <a
              href={webApp.event(event.id)}
              target="_blank"
              rel="noopener noreferrer"
              data-track="event_signup_web"
              className="inline-flex min-h-11 items-center rounded-full bg-brand-gradient px-5 font-display text-lg italic leading-none uppercase tracking-wide text-white transition hover:brightness-110"
            >
              {t.signup}
            </a>
            <a
              href={deeplinks.event(event.id)}
              data-track="event_signup_app"
              className="inline-flex min-h-7 items-center px-1 text-[13px] font-semibold text-white/70 underline-offset-4 transition hover:text-white hover:underline"
            >
              {t.signupApp}
            </a>
          </div>
        </div>
      </div>
    </article>
  );
}
