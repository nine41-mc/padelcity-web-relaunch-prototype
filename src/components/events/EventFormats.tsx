import Link from "next/link";
import { CalendarDays, MapPin } from "lucide-react";
import type { ClubEvent } from "@/lib/data/types";
import type { Locale } from "@/lib/i18n/config";
import { href } from "@/lib/i18n/routes";
import { deeplinks } from "@/lib/site";
import { eventFormats, eventsContent } from "@/lib/content/events";
import { formatEventDate } from "../cards/EventCard";
import { Media } from "../ui/Media";
import { Chip } from "../ui/Chip";
import { Reveal } from "../ui/Reveal";

// Contentful module: eventFormats – the recurring formats as a series (team feedback v-event-9). Name, tag, text and
// image are Contentful content; the next date is the earliest APL event of the format. Without one, the card points to the app.
export function EventFormats({ events, locale }: { events: ClubEvent[]; locale: Locale }) {
  const t = eventsContent[locale].formats;
  return (
    <ul className="grid gap-5 md:grid-cols-2 lg:grid-cols-3">
      {eventFormats[locale].map((f, i) => {
        const next = events
          .filter((e) => f.match.some((m) => e.id.startsWith(m)))
          .sort((a, b) => a.start.localeCompare(b.start))[0];
        return (
          <li key={f.id}>
            <Reveal delay={(i % 3) * 0.06} className="h-full">
              <article className="group relative flex h-full flex-col overflow-hidden rounded-[20px] border border-fg/10 bg-raised transition-all duration-300 hover:-translate-y-1 hover:border-magenta-500/50">
                <div data-theme="dark" className="relative">
                  <Media src={f.image.url} alt={f.image.alt} className="aspect-[16/9]" overlay sizes="(min-width:1200px) 33vw, (min-width:768px) 50vw, 100vw" />
                  <Chip tone="dark" className="absolute left-3 top-3">
                    {f.tag}
                  </Chip>
                </div>
                <div className="flex flex-1 flex-col gap-3 p-5">
                  <h3 className="font-display text-2xl font-extrabold italic uppercase leading-none">
                    <Link
                      href={next ? href(locale, "events", next.slug) : deeplinks.events("event-formats")}
                      className="after:absolute after:inset-0 after:content-['']"
                      data-track="event_format_click"
                    >
                      {f.name}
                    </Link>
                  </h3>
                  <p className="text-sm text-fg/75">{f.text}</p>
                  <div className="mt-auto border-t border-fg/10 pt-4 text-sm">
                    {next ? (
                      <>
                        <p className="text-[13px] font-semibold uppercase tracking-[0.14em] text-fg/60">{t.next}</p>
                        <p className="mt-1 flex items-center gap-2">
                          <CalendarDays className="size-4 text-fg/70" aria-hidden /> {formatEventDate(next.start, locale)}
                        </p>
                        {(next.clubName ?? next.city) && (
                          <p className="mt-1 flex items-center gap-2 text-fg/70">
                            <MapPin className="size-4" aria-hidden /> {next.clubName ?? next.city}
                          </p>
                        )}
                      </>
                    ) : (
                      <p className="text-fg/70">{t.none}</p>
                    )}
                  </div>
                </div>
              </article>
            </Reveal>
          </li>
        );
      })}
    </ul>
  );
}
