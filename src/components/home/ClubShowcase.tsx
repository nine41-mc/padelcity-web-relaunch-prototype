"use client";

// Contentful module: clubShowcase (selected clubs, headline)
import Link from "next/link";
import { useCallback, useEffect, useId, useRef, useState } from "react";
import { ArrowLeft, ArrowRight, ArrowUpRight } from "lucide-react";
import type { Club } from "@/lib/data/types";
import { Media } from "../ui/Media";
import { courtSummary } from "../cards/ClubCard";
import { OpenStatus, SportChips } from "../cards/ClubMeta";
import type { Locale } from "@/lib/i18n/config";
import { href } from "@/lib/i18n/routes";

/**
 * Big, swipeable club posters – "every location as a hero moment".
 * Look taken from PadelCity's Instagram opening posts: purple grainy sky, huge city name (second line outlined),
 * torn paper line. Opening status top-left; courts + sports appear on hover (always visible on touch devices).
 */
export function ClubShowcase({
  clubs,
  locale,
  labels,
  action,
}: {
  clubs: Club[];
  locale: Locale;
  labels: { prev: string; next: string };
  action?: React.ReactNode;
}) {
  const ref = useRef<HTMLDivElement>(null);
  const trackId = useId();
  const [edges, setEdges] = useState({ start: true, end: false });
  const updateEdges = useCallback(() => {
    const el = ref.current;
    if (!el) return;
    setEdges({ start: el.scrollLeft <= 4, end: el.scrollLeft + el.clientWidth >= el.scrollWidth - 4 });
  }, []);
  useEffect(() => {
    updateEdges();
    window.addEventListener("resize", updateEdges);
    return () => window.removeEventListener("resize", updateEdges);
  }, [updateEdges]);
  const scroll = (dir: 1 | -1) => {
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    ref.current?.scrollBy({ left: dir * ref.current.clientWidth * 0.8, behavior: reduce ? "auto" : "smooth" });
  };
  const arrowCls =
    "size-12 place-items-center rounded-full border border-white/40 transition hover:border-white hover:bg-white/10 disabled:pointer-events-none disabled:opacity-30";
  return (
    <div className="relative">
      <div className="container-site mb-6 flex items-center gap-2 md:justify-end">
        {action && <div className="mr-auto md:mr-2">{action}</div>}
        <button type="button" onClick={() => scroll(-1)} disabled={edges.start} aria-controls={trackId} className={`hidden md:grid ${arrowCls}`} aria-label={labels.prev}>
          <ArrowLeft className="size-5" aria-hidden />
        </button>
        <button type="button" onClick={() => scroll(1)} disabled={edges.end} aria-controls={trackId} className={`hidden md:grid ${arrowCls}`} aria-label={labels.next}>
          <ArrowRight className="size-5" aria-hidden />
        </button>
      </div>
      <div
        ref={ref}
        id={trackId}
        onScroll={updateEdges}
        className="scrollbar-none flex snap-x snap-mandatory gap-4 overflow-x-auto scroll-px-4 px-4 pb-4 md:gap-6 md:scroll-px-8 md:px-8 lg:scroll-px-16 lg:px-16"
      >
        {clubs.map((club) => (
          <ClubPoster key={club.id} club={club} locale={locale} />
        ))}
      </div>
    </div>
  );
}

/* ---------- Poster tile ---------- */

const VOWELS = "aeiouäöüy";
const ONSETS = ["bl", "br", "dr", "fl", "fr", "gl", "gr", "kl", "kr", "pf", "pl", "pr", "sp", "st", "tr", "zw"];
/** Splits a long single word for the poster ("Radolfzell" → Radolf | zell): prefer a break between two consonants near the middle. */
function splitWord(word: string): string[] {
  if (word.length <= 7) return [word];
  const lower = word.toLowerCase();
  let best = Math.ceil(word.length / 2);
  let bestScore = Infinity;
  for (let i = 3; i <= word.length - 3; i++) {
    const before = VOWELS.includes(lower[i - 1]), after = VOWELS.includes(lower[i]);
    let penalty = !before && !after ? 0 : before && !after ? 1.5 : 4;
    // A new line should not start with a consonant pair that can't open a German syllable ("Fran|kfurt" → "Frank|furt").
    const onset = lower.slice(i, i + 2);
    if (!VOWELS.includes(lower[i + 1] ?? "a") && !ONSETS.includes(onset) && !lower.startsWith("sch", i)) penalty += 2;
    if (["sc", "ch", "ck", "ph"].includes(lower.slice(i - 1, i + 1))) penalty += 6; // never split inside "sch", "ch", "ck", "ph"
    const hasVowel = (part: string) => [...part].some((ch) => VOWELS.includes(ch));
    if (!hasVowel(lower.slice(0, i)) || !hasVowel(lower.slice(i))) penalty += 10; // both halves need a vowel ("Sch|wabach")
    const score = Math.abs(i - word.length / 2) + penalty;
    if (score < bestScore) { bestScore = score; best = i; }
  }
  return [word.slice(0, best), word.slice(best)];
}
/**
 * Poster title = the city, big; the location inside the city goes small below the torn line.
 * "München Frankfurter Ring" → München + Frankfurter Ring · "Tucherpark" (city München) → München + Tucherpark ·
 * "Frankfurt" (city Frankfurt am Main) → Frankfurt.
 */
function posterName(club: Club): { city: string; spot: string } {
  const name = club.name.trim();
  const cityFull = club.city.trim();
  const city = cityFull.length > 12 ? cityFull.split(/\s+/)[0] : cityFull;
  for (const prefix of [cityFull, city]) {
    if (name.toLowerCase().startsWith(prefix.toLowerCase())) return { city: prefix.length > 12 ? city : prefix, spot: name.slice(prefix.length).replace(/^[\s–-]+/, "").trim() };
  }
  return { city, spot: name };
}

function posterLines(name: string): string[] {
  const words = name.split(/\s+/).filter(Boolean);
  return (words.length === 1 ? splitWord(words[0]) : words).slice(0, 3);
}

// Grain for the purple sky (inline SVG noise – no extra asset)
const NOISE = "url(\"data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' width='220' height='220'><filter id='n'><feTurbulence type='fractalNoise' baseFrequency='1.1' numOctaves='2' stitchTiles='stitch'/><feColorMatrix values='0 0 0 0 1  0 0 0 0 1  0 0 0 0 1  0 0 0 0.9 0'/></filter><rect width='100%' height='100%' filter='url(%23n)'/></svg>\")";

function ClubPoster({ club, locale }: { club: Club; locale: Locale }) {
  const { city, spot } = posterName(club);
  const lines = posterLines(city);
  const longest = Math.max(...lines.map((l) => l.length));
  return (
    <Link
      href={href(locale, "locations", club.slug)}
      aria-label={club.fullName ?? club.name}
      className="group relative aspect-[3/4] w-[78vw] shrink-0 snap-start overflow-hidden rounded-[28px] bg-ink-700 [container-type:inline-size] md:w-[42vw] lg:aspect-[4/5] lg:w-[30vw] xl:w-[420px]"
    >
      <Media
        src={club.mainImage?.url}
        alt=""
        className="absolute inset-0"
        imgClassName="transition-transform duration-[1.2s] ease-out group-hover:scale-110"
        sizes="(min-width:1200px) 420px, (min-width:768px) 42vw, 78vw"
      />
      {/* Purple sky + grain (top), darkening for the stats (bottom) */}
      <div className="absolute inset-0 bg-[linear-gradient(to_bottom,rgb(132_18_181/0.9),rgb(132_18_181/0.6)_42%,rgb(132_18_181/0)_68%)] mix-blend-multiply" aria-hidden />
      <div className="absolute inset-x-0 top-0 h-[70%] opacity-35 mix-blend-overlay [mask-image:linear-gradient(to_bottom,black_55%,transparent)]" style={{ backgroundImage: NOISE }} aria-hidden />
      <div className="absolute inset-x-0 bottom-0 h-1/2 bg-gradient-to-t from-black/75 to-transparent transition-colors" aria-hidden />

      {/* Opening status (PadelCity pink) where the Instagram posts carry their chip */}
      <span className="absolute left-4 top-4 rounded-full bg-black/55 px-3 py-1.5 backdrop-blur">
        <OpenStatus club={club} locale={locale} />
      </span>

      {/* City name: huge Poppins Bold, last line outlined */}
      <div className="absolute inset-x-0 top-[12%]" aria-hidden>
        <p className="px-3 font-sans font-bold leading-[0.8] tracking-[-0.05em] text-white" style={{ fontSize: `min(${(150 / longest).toFixed(1)}cqw, 30cqw)` }}>
          {lines.map((l, i) => (
            <span key={i} className={i > 0 && i === lines.length - 1 ? "block text-transparent [-webkit-text-stroke:1.5px_white]" : "block"}>
              {l}
            </span>
          ))}
        </p>
        {/* Torn paper line */}
        <svg viewBox="0 0 400 12" preserveAspectRatio="none" className="mt-3 h-2.5 w-full text-white" aria-hidden>
          <path d="M0 5 L22 3 L38 6 L61 2 L80 5 L104 4 L131 7 L150 3 L178 5 L203 2 L229 6 L251 4 L276 6 L300 2 L323 5 L349 3 L372 6 L400 4 L400 9 L377 8 L351 10 L330 7 L305 9 L280 8 L252 10 L230 8 L206 10 L181 7 L158 9 L131 8 L109 10 L84 8 L60 9 L39 7 L18 10 L0 8 Z" fill="currentColor" />
        </svg>
        {/* Location within the city (e.g. München → Frankfurter Ring / Tucherpark) below the torn line */}
        {spot && (
          <p className="mt-2 px-4 font-sans text-[8cqw] font-bold leading-none tracking-[-0.03em] text-white">{spot}</p>
        )}
      </div>

      {/* Courts + sports: revealed on hover/focus; always visible on touch devices (no hover) */}
      <div className="absolute inset-x-5 bottom-5 pr-14 transition-all duration-300 [@media(hover:hover)]:translate-y-3 [@media(hover:hover)]:opacity-0 [@media(hover:hover)]:group-hover:translate-y-0 [@media(hover:hover)]:group-hover:opacity-100 [@media(hover:hover)]:group-focus-visible:translate-y-0 [@media(hover:hover)]:group-focus-visible:opacity-100">
        <p className="text-sm font-medium text-white">{courtSummary(club, locale)}</p>
        <SportChips club={club} locale={locale} className="mt-2.5" />
      </div>
      <h3 className="sr-only">{club.name}</h3>
      <span className="absolute bottom-5 right-5 grid size-11 place-items-center rounded-full bg-white/15 text-white backdrop-blur transition-all group-hover:rotate-45 group-hover:bg-brand-gradient" aria-hidden>
        <ArrowUpRight className="size-5" />
      </span>
    </Link>
  );
}
