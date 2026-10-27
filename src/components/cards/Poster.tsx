import type { Club } from "@/lib/data/types";
import { cn } from "../ui/cn";

/*
 * Instagram-poster look shared by the home showcase posters and the club cards:
 * purple grainy sky over the photo, the city name huge in Poppins Bold (last line outlined),
 * and the location inside the city below it. The parent needs
 * `[container-type:inline-size]` – font sizes are in container units (cqw).
 */

const VOWELS = "aeiouäöüy";
const ONSETS = ["bl", "br", "dr", "fl", "fr", "gl", "gr", "kl", "kr", "pf", "pl", "pr", "sp", "st", "tr", "zw"];

/** Splits a long single word for the poster ("Radolfzell" → Radolf | zell): prefer a break between two consonants near the middle. */
function splitWord(word: string, maxOneLine = 7): string[] {
  if (word.length <= maxOneLine) return [word];
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
    if (score < bestScore) {
      bestScore = score;
      best = i;
    }
  }
  return [word.slice(0, best), word.slice(best)];
}

/**
 * Poster title = the city, big; the location inside the city goes small below it.
 * "München Frankfurter Ring" → München + Frankfurter Ring · "Frankfurt" (city Frankfurt am Main) → Frankfurt ·
 * "Karlsruhe" with district Rheinstetten → Karlsruhe + Rheinstetten.
 */
export function posterName(club: Pick<Club, "name" | "city" | "district">): { city: string; spot: string } {
  const name = club.name.trim();
  const cityFull = club.city.trim();
  const city = cityFull.length > 12 ? cityFull.split(/\s+/)[0] : cityFull;
  for (const prefix of [cityFull, city]) {
    if (name.toLowerCase().startsWith(prefix.toLowerCase()))
      return { city: prefix.length > 12 ? city : prefix, spot: name.slice(prefix.length).replace(/^[\s–-]+/, "").trim() || (club.district ?? "") };
  }
  return { city, spot: name };
}

function posterLines(name: string, maxOneLine?: number): string[] {
  const words = name.split(/\s+/).filter(Boolean);
  return (words.length === 1 ? splitWord(words[0], maxOneLine) : words).slice(0, 3);
}

// Grain for the purple sky (inline SVG noise – no extra asset)
const NOISE =
  "url(\"data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' width='220' height='220'><filter id='n'><feTurbulence type='fractalNoise' baseFrequency='1.1' numOctaves='2' stitchTiles='stitch'/><feColorMatrix values='0 0 0 0 1  0 0 0 0 1  0 0 0 0 1  0 0 0 0.9 0'/></filter><rect width='100%' height='100%' filter='url(%23n)'/></svg>\")";

/** Purple sky + grain at the top, darkening at the bottom (for text/price over the photo). */
export function PosterSky({ bottom = "h-1/2" }: { bottom?: string }) {
  return (
    <>
      <div className="absolute inset-0 bg-[linear-gradient(to_bottom,rgb(132_18_181/0.9),rgb(132_18_181/0.6)_42%,rgb(132_18_181/0)_68%)] mix-blend-multiply" aria-hidden />
      <div className="absolute inset-x-0 top-0 h-[70%] opacity-35 mix-blend-overlay [mask-image:linear-gradient(to_bottom,black_55%,transparent)]" style={{ backgroundImage: NOISE }} aria-hidden />
      <div className={cn("absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/75 to-transparent", bottom)} aria-hidden />
    </>
  );
}

/**
 * City name + location – fixed rules so every tile looks the same (the torn paper line was dropped in Design QA):
 *  - ONE font size per tile type (container units), independent of the name length;
 *  - names up to 7 letters stay on one line (Berlin, München, Fürth), longer ones split at a syllable
 *    (Frank|furt, Gelsen|kirchen) with the second line outlined;
 *  - so the location sits at exactly two heights: below one line or below two lines.
 * Sized so the longest line we have (8 letters, "Reckling") still fits the tile width.
 */
export function PosterTitle({
  club,
  className,
  size = { font: 19, spot: 7 },
  maxOneLine = 7,
}: {
  club: Pick<Club, "name" | "city">;
  className?: string;
  size?: { font: number; spot: number };
  /** Names up to this many letters stay on one line (small cards: 11 – only really long names split). */
  maxOneLine?: number;
}) {
  const { city, spot } = posterName(club);
  const lines = posterLines(city, maxOneLine);
  return (
    <div className={cn("absolute inset-x-0", className)} aria-hidden>
      <p className="px-4 font-sans font-bold leading-[0.82] tracking-[-0.05em] text-white" style={{ fontSize: `${size.font}cqw` }}>
        {lines.map((l, i) => (
          <span key={i} className={i > 0 && i === lines.length - 1 ? "block text-transparent [-webkit-text-stroke:1.5px_white]" : "block"}>
            {l}
          </span>
        ))}
      </p>
      {/* Location within the city (e.g. München → Frankfurter Ring / Tucherpark) */}
      {spot && (
        <p className="mt-3 px-4 font-sans font-bold leading-none tracking-[-0.03em] text-white" style={{ fontSize: `${size.spot}cqw` }}>
          {spot}
        </p>
      )}
    </div>
  );
}
