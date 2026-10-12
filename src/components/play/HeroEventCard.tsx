import Link from "next/link";
import { keepTogether } from "@/lib/typography";
import { ArrowUpRight, MapPin } from "lucide-react";
import type { ClubEvent } from "@/lib/data/types";
import type { Locale } from "@/lib/i18n/config";
import { href } from "@/lib/i18n/routes";
import { eventsContent } from "@/lib/content/events";
import { Media } from "@/components/ui/Media";
import { Chip } from "@/components/ui/Chip";
import { cn } from "@/components/ui/cn";
import { Countdown } from "./Countdown";
import { dayParts, formatDateRange } from "./eventFormat";

// Contentful module: featuredEvent (reference → event, optional override image/claim)
/** Big immersive card for hero events (One Point Challenge, Series Finals). */
export function HeroEventCard({ event, locale, className, priority }: { event: ClubEvent; locale: Locale; className?: string; priority?: boolean }) {
  const t = eventsContent[locale];
  const { day, month } = dayParts(event.start, locale);
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

      <div className="absolute left-5 top-5 flex items-start gap-3 md:left-8 md:top-8">
        <div className="grid min-w-16 place-items-center rounded-2xl bg-white px-3 py-2 text-ink-800">
          <span className="font-display text-3xl font-extrabold italic leading-none">{day}</span>
          <span className="text-[13px] font-semibold uppercase">{month}</span>
        </div>
        <Chip tone="gradient" className="mt-1">{t.types.hero}</Chip>
      </div>

      <div className="flex flex-col gap-5 p-5 md:p-8 lg:p-10">
        <p className="flex items-center gap-2 text-sm text-white/85">
          <MapPin className="size-4" aria-hidden /> {event.city} · {formatDateRange(event.start, event.end, locale)}
        </p>
        <h3 className="font-display text-4xl font-extrabold italic uppercase leading-[0.92] md:text-5xl lg:text-6xl">
          <Link href={href(locale, "events", event.slug)} className="after:absolute after:inset-0 after:content-['']" data-track="event_details_click">
            {keepTogether(event.title)}
          </Link>
        </h3>
        {event.subtitle && <p className="max-w-md text-white/85">{event.subtitle}</p>}
        <div className="flex flex-wrap items-end justify-between gap-5">
          <Countdown start={event.start} labels={t.countdown} size="sm" />
          <span className="inline-flex h-12 items-center gap-3 rounded-full bg-white pl-6 pr-1.5 font-display text-lg italic uppercase tracking-wide text-ink-800 md:text-xl transition-shadow group-hover:shadow-glow">
            {t.card.more}
            <span className="grid size-9 place-items-center rounded-full bg-brand-gradient text-white transition-transform duration-300 group-hover:rotate-45">
              <ArrowUpRight className="size-4" strokeWidth={2.5} aria-hidden />
            </span>
          </span>
        </div>
      </div>
    </article>
  );
}
