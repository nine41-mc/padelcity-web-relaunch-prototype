import { Linkedin } from "lucide-react";
import type { Locale } from "@/lib/i18n/config";
import type { Person } from "@/lib/content/people";
import { site } from "@/lib/site";
import { Media } from "../ui/Media";
import { cn } from "../ui/cn";
import { brandStrings } from "./strings";

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

/**
 * Portrait card (Figma: Person Card) – founders, team, management. Photo in greyscale (colour on hover), name and role
 * inside the photo with air below; with `showBio` the published short bio and a round LinkedIn button follow.
 */
export function PersonCard({
  person,
  locale,
  variant = "portrait",
  compact = false,
  showBio = false,
}: {
  person: Person;
  locale: Locale;
  variant?: "portrait" | "quote";
  compact?: boolean;
  showBio?: boolean;
}) {
  const t = brandStrings[locale].people;
  const [open, close] = locale === "de" ? ["„", "“"] : locale === "pl" ? ["„", "”"] : ["“", "”"];
  return (
    <figure className="group relative flex h-full flex-col overflow-hidden rounded-[20px] border border-white/10 bg-ink-700">
      <div className="relative">
        {person.image ? (
          <Media
            src={person.image}
            alt={person.name}
            className="aspect-[4/5]"
            imgClassName="object-[50%_22%] grayscale transition-all duration-700 group-hover:scale-105 group-hover:grayscale-0"
            sizes={compact ? "(min-width:1200px) 16vw, (min-width:768px) 25vw, 50vw" : "(min-width:1200px) 25vw, 50vw"}
            overlay
          />
        ) : (
          <PersonPlaceholder name={person.name} label={t.photoSoon} />
        )}
        {/* Name and role sit inside the photo with air below, not glued to the bio box */}
        <div className={cn("absolute inset-x-0 bottom-0", compact ? "p-3 md:p-4" : "p-4 pb-5 md:p-5 md:pb-6")}>
          {variant === "quote" && person.quote && <p className="mb-3 text-sm italic leading-snug text-white/80">{open}{person.quote[locale]}{close}</p>}
          <p className={cn("font-display font-extrabold italic uppercase leading-none", compact ? "text-lg" : "text-xl md:text-2xl")}>{person.name}</p>
          <p className={cn("mt-1 font-medium uppercase tracking-[0.12em] text-magenta-300", compact ? "text-[13px] font-semibold leading-snug" : "text-[13px] font-semibold md:text-sm")}>
            {person.role[locale]}
            {person.club && <span className="text-white/70"> · {person.club}</span>}
          </p>
        </div>
      </div>
      {showBio && (
        <figcaption className="flex flex-1 flex-col gap-4 p-4 md:p-5">
          {person.bio && <p className="text-sm leading-snug text-white/75">{person.bio[locale]}</p>}
          {/* Round LinkedIn button as in the footer "Follow us!" – prototype: company page until profiles come from Contentful */}
          <a
            href={person.linkedin ?? site.social.linkedin}
            target="_blank"
            rel="noopener noreferrer"
            aria-label={t.linkedin(person.name)}
            data-track="person_linkedin_click"
            className="mt-auto grid size-11 place-items-center rounded-full border border-white/25 transition-all hover:-translate-y-0.5 hover:border-white hover:bg-white hover:text-ink-800"
          >
            <Linkedin className="size-5" aria-hidden />
          </a>
        </figcaption>
      )}
    </figure>
  );
}
