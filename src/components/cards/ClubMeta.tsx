"use client";

import { useEffect, useState } from "react";
import { Clock } from "lucide-react";
import type { Club, Sport } from "@/lib/data/types";
import type { Locale } from "@/lib/i18n/config";
import { getDictionary } from "@/lib/i18n/dictionaries";
import { todaysHours } from "@/components/locations/geo";
import { cn } from "../ui/cn";

/** Sports offered at a club (from its courts), padel first. */
export function clubSports(club: Pick<Club, "courts">): Sport[] {
  const set = new Set(club.courts.map((c) => c.sport ?? "padel"));
  if (set.size === 0) set.add("padel");
  return [...set].sort((a, b) => (a === "padel" ? -1 : b === "padel" ? 1 : a.localeCompare(b)));
}

/**
 * "Geöffnet bis 23:00" – computed in the browser so it is correct for *today* even on a static build.
 * Opening hours are master data (Contentful), not booking data.
 */
export function OpenStatus({ club, locale, className }: { club: Club; locale: Locale; className?: string }) {
  const t = getDictionary(locale).clubCard;
  const [text, setText] = useState<string | null>(null);
  useEffect(() => {
    const h = todaysHours(club.openingHours);
    setText(!h ? t.closed : h.state === "before" ? t.opensAt.replace("{t}", h.open) : h.state === "open" ? t.openUntil.replace("{t}", h.close) : t.closed);
  }, [club.openingHours, t]);
  return (
    // Opening status is the one meta line in PadelCity pink (colour roles: SECONDARY exception, see globals.css)
    <p className={cn("flex min-h-5 items-center gap-1.5 text-sm font-semibold text-magenta-300", className)}>
      <Clock className="size-4 shrink-0" aria-hidden />
      {/* Reserve the line before hydration so nothing jumps */}
      <span>{text ?? " "}</span>
    </p>
  );
}

/** Sports as plain text ("Padel · Tennis") – flush left with the court line; icons only on the club page and in the filter. */
export function SportList({ club, locale, className }: { club: Club; locale: Locale; className?: string }) {
  const d = getDictionary(locale);
  return (
    <p className={cn("text-sm", className ?? "text-white/70")}>
      <span className="sr-only">{d.clubCard.sportsLabel}: </span>
      {clubSports(club).map((s) => d.sports[s]).join(" · ")}
    </p>
  );
}
