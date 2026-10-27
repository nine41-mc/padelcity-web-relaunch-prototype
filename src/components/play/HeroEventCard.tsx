import Link from "next/link";
import { keepTogether } from "@/lib/typography";
import { MapPin } from "lucide-react";
import type { ClubEvent } from "@/lib/data/types";
import type { Locale } from "@/lib/i18n/config";
import { href } from "@/lib/i18n/routes";
import { eventsContent } from "@/lib/content/events";
import { Media } from "@/components/ui/Media";
import { Chip } from "@/components/ui/Chip";
import { EventSignup } from "@/components/events/EventSignup";
import { cn } from "@/components/ui/cn";
import { Countdown } from "./Countdown";
import { dateBadge } from "./eventFormat";

// Contentful module: featuredEvent (reference → event, optional override image/claim)
/** Big immersive card for hero events (One Point Challenge, Series Finals). */
export function HeroEventCard({ event, locale, className, priority }: { event: ClubEvent; locale: Locale; className?: string; priority?: boolean }) {
  const t = eventsContent[locale];
  const date = dateBadge(event.start, event.end, locale);
  return (
    <article
      className={cn(
        "group relative isolate flex min-h-[520px] flex-col justify-end overflow-hidden rounded-[28px] border border-white/10 md:min-h-[560px] lg:min-h-[640px]",
        className,
      )}
    >
      <Media
        src={event.image?.url}
        alt={event.image?.alt ?? event.title}
        className="!absolute inset-0 -z-10"
        imgClassName="transition-transform duration-[1.2s] group-hover:scale-105"
        sizes="(min-width:1200px) 50vw, 100vw"
        priority={priority}
      />
      <div className="absolute inset-0 -z-10 bg-gradient-to-t from-black via-black/60 to-black/10" />
      <div className="absolute inset-0 -z-10 bg-grain" />

      {/* Date badge carries the whole period; city and type as pills next to it */}
      <div className="absolute left-5 right-5 top-5 flex items-start gap-3 md:left-8 md:right-8 md:top-8">
        {/* Fixed width, so every badge is the same size whatever the date ("05", "04–06", "30–02") */}
        <div className="grid w-24 shrink-0 place-items-center rounded-2xl bg-white py-2 text-ink-800">
          <span className="font-display text-3xl font-extrabold italic leading-none whitespace-nowrap">{date.day}</span>
          <span className="text-[13px] font-semibold uppercase">{date.month}</span>
          {date.year && <span className="text-[11px] font-semibold">{date.year}</span>}
        </div>
        <div className="mt-1 flex flex-wrap gap-2">
          <Chip tone="dark" className="px-3 py-1.5 text-sm">
            <MapPin className="size-4" aria-hidden /> {event.city}
          </Chip>
          <Chip tone="gradient" className="py-1.5 text-sm">{t.types.hero}</Chip>
        </div>
      </div>

      <div className="flex flex-col gap-5 p-5 md:p-8 lg:p-10">
        <h3 className="font-display text-4xl font-extrabold italic uppercase leading-[0.92] md:text-5xl lg:text-6xl">
          <Link href={href(locale, "events", event.slug)} className="after:absolute after:inset-0 after:content-['']" data-track="event_details_click">
            {keepTogether(event.title)}
          </Link>
        </h3>
        {event.subtitle && <p className="max-w-md text-white/85">{event.subtitle}</p>}
        <div className="flex flex-wrap items-end justify-between gap-5">
          <Countdown start={event.start} labels={t.countdown} size="sm" />
          {/* Sign-up (app primary, web outline); the card itself links to the detail page */}
          <EventSignup eventId={event.id} locale={locale} size="md" className="w-full sm:w-auto" />
        </div>
      </div>
    </article>
  );
}
