"use client";

import { ArrowUpRight, Award, MapPin } from "lucide-react";
import type { Person } from "@/lib/content/people";
import type { Locale } from "@/lib/i18n/config";
import { localeTags } from "@/lib/i18n/config";
import { Media } from "@/components/ui/Media";
import { cn } from "@/components/ui/cn";
import { coachClubKeys, fill, isHeadCoach, type CoachClubRef } from "./clubs";
import type { CoachLabels } from "./labels";

// Contentful module: coach (card) – inside coachCarousel
/** White 3×3 dot grid (Elephant inspo "dot-grid badge"). */
export function DotGrid({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 14 14" className={cn("size-3.5 shrink-0 text-white", className)} aria-hidden>
      {[2, 7, 12].flatMap((y) => [2, 7, 12].map((x) => <circle key={`${x}-${y}`} cx={x} cy={y} r="1.6" fill="currentColor" />))}
    </svg>
  );
}

/** One stat; missing value → clean placeholder ("–" + "folgt"/"tbc"), never an estimate. */
export function CoachStat({
  value,
  label,
  pending,
  locale,
  size = "lg",
  align = "left",
  suffix = "",
}: {
  value?: number;
  /** e.g. "+" for "700+ students" */
  suffix?: string;
  label: string;
  pending: string;
  locale: Locale;
  size?: "lg" | "md";
  align?: "left" | "right";
}) {
  const has = typeof value === "number";
  const formatted = has ? new Intl.NumberFormat(localeTags[locale].intl).format(value) : undefined;
  return (
    <div className={cn("min-w-0", align === "right" && "md:text-right")}>
      <p
        className={cn(
          "flex items-baseline gap-2 font-display font-extrabold italic uppercase leading-none",
          align === "right" && "md:justify-end",
          size === "lg" ? "text-4xl md:text-5xl lg:text-6xl" : "text-3xl",
        )}
      >
        {has ? (
          <span className="text-optic-500">
            {formatted}
            {suffix}
          </span>
        ) : (
          <>
            <span className="inline-block h-[0.09em] min-h-[3px] w-[0.7em] -translate-y-[0.28em] -skew-x-12 rounded-full bg-white/40" aria-hidden />
            <span className="rounded-md border border-white/20 px-1.5 py-0.5 font-sans text-[11px] font-semibold not-italic tracking-[0.12em] text-white/70">
              {pending}
            </span>
          </>
        )}
      </p>
      <p className="mt-1.5 text-[13px] font-semibold uppercase leading-tight tracking-[0.12em] text-white/85">{label}</p>
    </div>
  );
}

export function CoachCard({
  coach,
  locale,
  labels,
  clubs,
  variant,
  onOpen,
}: {
  coach: Person;
  locale: Locale;
  labels: CoachLabels;
  clubs: Record<string, CoachClubRef>;
  /** feature = big carousel tile, compact = grid tile. Each variant has ONE fixed aspect ratio per breakpoint. */
  variant: "feature" | "compact";
  onOpen: (coach: Person, trigger: HTMLElement) => void;
}) {
  const head = isHeadCoach(coach.role);
  const keys = coachClubKeys(coach.club);
  const clubLabel = keys.map((k) => clubs[k]?.label ?? k).join(" & ");
  const [first, ...rest] = coach.name.split(" ");
  const feature = variant === "feature";

  return (
    <article
      className={cn(
        "group relative isolate h-full overflow-hidden rounded-[20px] border border-white/10 bg-ink-700 transition-all duration-300 md:rounded-[28px]",
        "hover:-translate-y-1 hover:border-magenta-500/50 hover:shadow-glow motion-reduce:hover:translate-y-0",
        "has-[:focus-visible]:ring-2 has-[:focus-visible]:ring-optic-500 has-[:focus-visible]:ring-offset-2 has-[:focus-visible]:ring-offset-ink-800",
        feature ? "aspect-[4/5] md:aspect-[16/11] lg:aspect-[16/10]" : "aspect-[3/4]",
      )}
    >
      {/* Photo: full bleed, darkened, faces at ~50% 22% */}
      <Media
        src={coach.image}
        alt=""
        className="absolute inset-0 -z-10"
        imgClassName="object-[50%_22%] grayscale-[70%] brightness-[0.8] transition duration-700 group-hover:scale-105 group-hover:grayscale-0 motion-reduce:group-hover:scale-100"
        sizes={feature ? "(min-width:1200px) 50vw, (min-width:768px) 72vw, 86vw" : "(min-width:1200px) 25vw, (min-width:768px) 33vw, 50vw"}
      />
      {/* Darken + brand glow (purple/magenta from bottom-left) */}
      <div className="pointer-events-none absolute inset-0 -z-10 bg-gradient-to-t from-black via-black/45 to-black/10" aria-hidden />
      <div
        className="pointer-events-none absolute inset-0 -z-10 bg-[radial-gradient(110%_70%_at_0%_100%,rgb(224_5_195/0.38),rgb(132_18_181/0.18)_45%,transparent_70%)] opacity-80 transition-opacity duration-500 group-hover:opacity-100"
        aria-hidden
      />
      {feature && (
        <div className="pointer-events-none absolute inset-y-0 right-0 -z-10 hidden w-1/2 bg-gradient-to-l from-black/70 to-transparent md:block" aria-hidden />
      )}

      {/* Top-left: dot-grid badge + stacked icon chips */}
      <div className={cn("absolute flex flex-col items-start gap-2", feature ? "left-4 top-4 md:left-6 md:top-6" : "left-3 top-3")}>
        <span className="inline-flex h-8 items-center gap-2 rounded-full border border-white/15 bg-black/55 px-3 backdrop-blur">
          <DotGrid />
          <span className={cn("font-display font-extrabold uppercase italic leading-none tracking-[0.06em]", feature ? "text-base md:text-lg" : "text-sm")}>
            {coach.role[locale]}
          </span>
        </span>
        {feature && (
          <ul className="flex flex-col gap-1.5" aria-label={coach.name}>
            {head && (
              <li className="grid size-9 place-items-center rounded-xl border border-white/15 bg-black/55 backdrop-blur" title={labels.headBadge}>
                <Award className="size-4 text-white" aria-hidden />
                <span className="sr-only">{labels.headBadge}</span>
              </li>
            )}
            {keys.length > 1 && (
              <li
                className="relative grid size-9 place-items-center rounded-xl border border-white/15 bg-black/55 backdrop-blur"
                title={fill(labels.clubsCount, { n: keys.length })}
              >
                <MapPin className="size-4" aria-hidden />
                <span className="absolute -right-1.5 -top-1.5 grid size-5 place-items-center rounded-full bg-brand-gradient text-[10px] font-bold" aria-hidden>
                  {keys.length}
                </span>
                <span className="sr-only">{fill(labels.clubsCount, { n: keys.length })}</span>
              </li>
            )}
          </ul>
        )}
      </div>

      {/* Top-right: open contact & offer dialog. The ::after stretches the hit area over the whole card. */}
      <button
        type="button"
        onClick={(e) => onOpen(coach, e.currentTarget)}
        aria-haspopup="dialog"
        aria-label={fill(labels.openFor, { name: coach.name })}
        className={cn(
          "absolute z-10 inline-flex items-center justify-center gap-2 rounded-full border border-white/25 bg-black/55 font-display uppercase italic tracking-wide backdrop-blur transition",
          "hover:border-white hover:bg-white/10 focus-visible:outline-none after:absolute after:inset-[-999px] after:content-['']",
          feature ? "right-4 top-4 h-11 px-4 text-base md:right-6 md:top-6 md:text-lg" : "right-3 top-3 size-11",
        )}
      >
        {feature && <span className="hidden leading-none sm:inline">{labels.open}</span>}
        <ArrowUpRight className="size-5 transition-transform duration-300 group-hover:rotate-45" aria-hidden />
      </button>

      {/* Right side (md+ feature): big stats */}
      {feature && (
        <div className="absolute right-6 top-1/2 hidden -translate-y-1/2 flex-col gap-5 md:flex lg:right-8">
          <CoachStat value={coach.hoursOnCourt} label={labels.hours} pending={labels.pending} locale={locale} align="right" />
          <CoachStat value={coach.students} label={labels.students} pending={labels.pending} locale={locale} align="right" />
        </div>
      )}

      {/* Bottom: (phone stats) name, bio, club */}
      <div className={cn("absolute inset-x-0 bottom-0", feature ? "p-5 md:p-6 lg:p-8" : "p-3 md:p-4")}>
        {feature && (
          <div className="mb-4 grid grid-cols-2 gap-3 md:hidden">
            <CoachStat value={coach.hoursOnCourt} label={labels.hours} pending={labels.pending} locale={locale} size="md" />
            <CoachStat value={coach.students} label={labels.students} pending={labels.pending} locale={locale} size="md" />
          </div>
        )}
        <div className={cn(feature && "md:flex md:items-end md:justify-between md:gap-6")}>
          <div className={cn("min-w-0", feature && "md:max-w-[62%]")}>
            <h3
              className={cn(
                "font-display font-extrabold uppercase italic leading-[0.86] tracking-tight [overflow-wrap:anywhere]",
                feature ? "line-clamp-3 text-[2.6rem] md:text-5xl lg:text-6xl" : "line-clamp-2 text-xl md:text-3xl",
              )}
            >
              <span className="block">{first}</span>
              {rest.length > 0 && <span className="block">{rest.join(" ")}</span>}
            </h3>
            {/* Bio line is always reserved so names sit at the same height on every carousel tile */}
            {feature && <p className="mt-2 line-clamp-1 min-h-[1lh] text-sm text-white/70">{coach.bio?.[locale]}</p>}
            {!feature && clubLabel && (
              <p className="mt-1.5 flex items-center gap-1 truncate text-xs text-white/70 md:text-sm">
                <MapPin className="size-3 shrink-0" aria-hidden />
                <span className="truncate">{clubLabel}</span>
              </p>
            )}
          </div>
          {feature && clubLabel && (
            <p className="mt-2 flex items-start gap-1.5 text-sm text-white/80 md:mt-0 md:max-w-[36%] md:shrink-0 md:justify-end md:text-right">
              <MapPin className="mt-0.5 size-3.5 shrink-0" aria-hidden />
              <span className="line-clamp-2">{clubLabel}</span>
            </p>
          )}
        </div>
        {!feature && (
          <div className="mt-3 hidden grid-cols-2 gap-2 border-t border-white/15 pt-3 md:grid">
            <CoachStat value={coach.hoursOnCourt} label={labels.hours} pending={labels.pending} locale={locale} size="md" />
            <CoachStat value={coach.students} label={labels.students} pending={labels.pending} locale={locale} size="md" />
          </div>
        )}
      </div>
    </article>
  );
}
