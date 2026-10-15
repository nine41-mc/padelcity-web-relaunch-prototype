import type { Locale } from "@/lib/i18n/config";
import type { Person } from "@/lib/content/people";
import { Media } from "../ui/Media";
import { Reveal } from "../ui/Reveal";
import { cn } from "../ui/cn";
import { brandStrings } from "./strings";

// Contentful module: peopleGrid (references: person { name, role, image, quote }) – source: src/lib/content/people.ts

function initials(name: string) {
  return name
    .replace(/^(Dr\.|Prof\.)\s+/g, "")
    .split(/\s+/)
    .filter(Boolean)
    .map((part) => part[0])
    .slice(0, 2)
    .join("")
    .toUpperCase();
}

/** Branded placeholder for people without a confirmed photo – never a stand-in photo of someone else. */
function PersonPlaceholder({ name, label }: { name: string; label: string }) {
  return (
    <div className="relative aspect-[4/5] overflow-hidden bg-brandbook-gradient" role="img" aria-label={`${name} – ${label}`}>
      <div className="absolute inset-0 bg-court-lines opacity-70" aria-hidden />
      <span
        className="absolute inset-0 grid place-items-center pb-16 font-display text-6xl font-extrabold italic text-white/85 md:text-8xl"
        aria-hidden
      >
        {initials(name)}
      </span>
      <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-black/90 via-black/40 to-transparent" aria-hidden />
    </div>
  );
}

/** Portrait grid for founders and team ("Faces of PadelCity"). Real people only (people.ts). */
export function PeopleGrid({
  people,
  locale,
  variant = "portrait",
  compact = false,
  showBio = false,
  className,
}: {
  people: Person[];
  locale: Locale;
  variant?: "portrait" | "quote";
  /** Dense grid for large teams. */
  compact?: boolean;
  /** Show the published short bio under the role. */
  showBio?: boolean;
  className?: string;
}) {
  const t = brandStrings[locale].people;
  const [open, close] = locale === "de" ? ["„", "“"] : locale === "pl" ? ["„", "”"] : ["“", "”"];
  return (
    <ul
      className={cn(
        "grid grid-cols-2 gap-3",
        compact ? "md:grid-cols-4 md:gap-4 lg:grid-cols-6" : cn("md:gap-5", people.length % 3 === 0 ? "md:grid-cols-3" : "lg:grid-cols-4"),
        className,
      )}
    >
      {people.map((p, i) => (
        <li key={p.id}>
          <Reveal delay={i * 0.06} className="h-full">
            <figure className="group relative h-full overflow-hidden rounded-[20px] border border-white/10 bg-ink-700">
              {p.image ? (
                <Media
                  src={p.image}
                  alt={p.name}
                  className="aspect-[4/5]"
                  imgClassName="object-[50%_22%] grayscale transition-all duration-700 group-hover:scale-105 group-hover:grayscale-0"
                  sizes={compact ? "(min-width:1200px) 16vw, (min-width:768px) 25vw, 50vw" : "(min-width:1200px) 25vw, 50vw"}
                  overlay
                />
              ) : (
                <PersonPlaceholder name={p.name} label={t.photoSoon} />
              )}
              <figcaption className={cn(showBio ? "relative -mt-16" : "absolute inset-x-0 bottom-0", compact ? "p-3 md:p-4" : "p-4 md:p-5")}>
                {variant === "quote" && p.quote && <p className="mb-3 text-sm italic leading-snug text-white/80">{open}{p.quote[locale]}{close}</p>}
                <p className={cn("font-display font-extrabold italic uppercase leading-none", compact ? "text-lg" : "text-xl md:text-2xl")}>{p.name}</p>
                <p className={cn("mt-1 font-medium uppercase tracking-[0.12em] text-magenta-300", compact ? "text-[13px] font-semibold leading-snug" : "text-[13px] font-semibold md:text-sm")}>
                  {p.role[locale]}
                  {p.club && <span className="text-white/70"> · {p.club}</span>}
                </p>
                {showBio && p.bio && <p className="mt-2 text-sm leading-snug text-white/75">{p.bio[locale]}</p>}
              </figcaption>
            </figure>
          </Reveal>
        </li>
      ))}
    </ul>
  );
}
