
import type { Locale } from "@/lib/i18n/config";

import type { Person } from "@/lib/content/people";

import { Reveal } from "../ui/Reveal";
import { cn } from "../ui/cn";

import { PersonCard } from "./PersonCard";

// Contentful module: peopleGrid (references: person { name, role, image, quote }) – source: src/lib/content/people.ts

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
            <PersonCard person={p} locale={locale} variant={variant} compact={compact} showBio={showBio} />
          </Reveal>
        </li>
      ))}
    </ul>
  );
}
