// Contentful module: clubReviews (club page; data from Google Places API at build time)
import { ArrowUpRight, Star } from "lucide-react";
import type { ClubReviews as ClubReviewsData, GoogleReview } from "@/lib/data/google-reviews";
import type { Locale } from "@/lib/i18n/config";
import { localeTags } from "@/lib/i18n/config";
import { fill, locationsContent } from "@/lib/content/locations";
import { Accent, Headline } from "@/components/ui/Headline";
import { cn } from "@/components/ui/cn";

/** Five stars; `value` undefined = outline only (placeholder). Decorative – callers provide the text alternative. */
function Stars({ value, className, starClassName = "size-4" }: { value?: number; className?: string; starClassName?: string }) {
  const filled = value === undefined ? 0 : Math.round(value);
  return (
    <span className={cn("flex w-fit gap-1", className)} aria-hidden>
      {[0, 1, 2, 3, 4].map((i) => (
        <Star key={i} className={cn(starClassName, "text-white", i < filled ? "fill-white" : "fill-transparent")} strokeWidth={1.75} />
      ))}
    </span>
  );
}

function SkeletonLine({ w }: { w: string }) {
  return <span className={cn("block h-3 rounded-full bg-white/10", w)} />;
}

function ReviewCard({ review, locale }: { review: GoogleReview; locale: Locale }) {
  const t = locationsContent[locale].club.reviews;
  return (
    <li className="flex h-full flex-col rounded-[20px] border border-white/10 bg-ink-700 p-6">
      <p className="sr-only">{fill(t.stars, { n: review.rating })}</p>
      <Stars value={review.rating} />
      {/* Review text exactly as delivered by Google – never edit */}
      <blockquote className="mt-4 text-white/80">{review.text}</blockquote>
      <div className="mt-auto flex items-end justify-between gap-3 pt-5 text-sm">
        <span>
          {review.authorUri ? (
            <a href={review.authorUri} target="_blank" rel="noopener noreferrer" className="font-semibold hover:text-magenta-300">
              {review.author}
            </a>
          ) : (
            <span className="font-semibold">{review.author}</span>
          )}
          <span className="block text-white/70">{review.relativeTime}</span>
        </span>
        <span className="shrink-0 text-xs text-white/70">{t.via}</span>
      </div>
    </li>
  );
}

/** Placeholder card: same layout, no invented names, quotes or numbers. Hidden from assistive tech (one note covers it). */
function PlaceholderCard({ widths, locale, className }: { widths: string[]; locale: Locale; className?: string }) {
  const t = locationsContent[locale].club.reviews;
  return (
    <li aria-hidden className={cn("flex h-full flex-col rounded-[20px] border border-dashed border-white/20 bg-ink-700/70 p-6", className)}>
      <Stars />
      <span className="mt-5 flex flex-col gap-2.5">
        {widths.map((w, i) => (
          <SkeletonLine key={i} w={w} />
        ))}
      </span>
      <span className="mt-auto flex items-end justify-between gap-3 pt-6 text-sm">
        <span className="flex flex-col gap-2">
          <SkeletonLine w="w-20" />
          <span className="text-white/60">–</span>
        </span>
        <span className="shrink-0 text-xs text-white/60">{t.via}</span>
      </span>
    </li>
  );
}

export function ClubReviews({ data, locale }: { data: ClubReviewsData; locale: Locale }) {
  const t = locationsContent[locale].club.reviews;
  const intl = localeTags[locale].intl;
  const live = data.status === "live" ? data : undefined;
  const reviews = live?.reviews.slice(0, 3) ?? [];

  return (
    <div>
      <div className="mb-8 flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
        <Headline size="sm" className="max-w-2xl">
          {t.title} <Accent>{t.accent}</Accent>
        </Headline>
        {!live && (
          <p className="inline-flex w-fit items-center gap-2 rounded-full border border-dashed border-white/50 px-4 py-2 text-sm font-semibold text-white/85">
            <span className="size-2 rounded-full bg-white/70" aria-hidden />
            {t.placeholderBadge}
          </p>
        )}
      </div>

      <div className="grid gap-4 md:grid-cols-3 lg:grid-cols-4">
        {/* Summary */}
        <div className="flex flex-col gap-5 rounded-[20px] border border-white/10 bg-brandbook-gradient p-6 md:col-span-3 md:flex-row md:items-center md:justify-between lg:col-span-1 lg:flex-col lg:items-start">
          <div>
            <p className="text-[13px] font-semibold uppercase tracking-[0.14em] text-white/80">{t.source}</p>
            <p className="mt-3 flex items-baseline gap-2">
              {live ? (
                <span className="font-display text-7xl leading-none font-extrabold italic">
                  {live.rating.toLocaleString(intl, { minimumFractionDigits: 1, maximumFractionDigits: 1 })}
                </span>
              ) : (
                <span className="text-6xl leading-none font-light text-white/80">–</span>
              )}
              <span className="text-white/80">/ 5</span>
              {live && <span className="sr-only">{fill(t.stars, { n: live.rating.toLocaleString(intl) })}</span>}
            </p>
            <Stars value={live?.rating} className="mt-3" starClassName="size-5" />
            <p className="mt-3 text-sm text-white/85">{live ? fill(t.count, { n: live.count.toLocaleString(intl) }) : t.countUnknown}</p>
          </div>
          <a
            href={data.mapsUri}
            target="_blank"
            rel="noopener noreferrer"
            className="group inline-flex min-h-11 w-fit items-center gap-2 rounded-full bg-white px-5 py-2 text-left text-sm leading-tight font-semibold text-ink-800 transition hover:shadow-glow"
          >
            {t.all} <ArrowUpRight className="size-4 transition-transform group-hover:rotate-45" aria-hidden />
            <span className="sr-only">{t.newTab}</span>
          </a>
        </div>

        {live ? (
          <ul className="contents">
            {reviews.map((r, i) => (
              <ReviewCard key={`${r.author}-${i}`} review={r} locale={locale} />
            ))}
          </ul>
        ) : (
          <ul className="contents">
              <PlaceholderCard locale={locale} widths={["w-full", "w-11/12", "w-4/5", "w-2/3"]} />
              <PlaceholderCard locale={locale} widths={["w-full", "w-5/6", "w-full", "w-1/2"]} className="hidden md:flex" />
              <PlaceholderCard locale={locale} widths={["w-11/12", "w-full", "w-3/4"]} className="hidden md:flex" />
          </ul>
        )}
      </div>
      {!live && <p className="mt-5 max-w-2xl text-sm text-white/70">{t.placeholderNote}</p>}
    </div>
  );
}
