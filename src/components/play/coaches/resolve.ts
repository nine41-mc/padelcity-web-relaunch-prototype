import type { Club } from "@/lib/data/types";
import type { Locale } from "@/lib/i18n/config";
import { href } from "@/lib/i18n/routes";
import { deeplinks } from "@/lib/site";
import { coachClubKeys, isHeadCoach, type CoachClubRef } from "./clubs";
import type { Person } from "@/lib/content/people";

const norm = (s: string) => s.toLocaleLowerCase("de").trim();

/**
 * Maps coach club keys ("Fürth", "Frankfurt", "München Tucherpark") to clubs. Matching runs against the German
 * club list (coach clubs are written in German); labels/links use the page locale (slugs and ids are shared).
 * Exact club name ("PadelCity <key>") wins; otherwise city match. Exactly one match → club detail page + app
 * deep link + `clubId`; several (e.g. "München" alone) → locations overview + `candidates`; none → overview.
 * Shared by the Academy page (coach filter) and the club detail page (coaches at this club).
 */
export function resolveCoachClubs(keys: string[], deClubs: Club[], localClubs: Club[], locale: Locale): Record<string, CoachClubRef> {
  const bySlug = new Map(localClubs.map((c) => [c.slug, c]));
  const out: Record<string, CoachClubRef> = {};
  for (const key of new Set(keys)) {
    const k = norm(key);
    const exact = deClubs.find((c) => norm(c.name) === `padelcity ${k}` || norm(c.name) === k);
    const matches = exact ? [exact] : deClubs.filter((c) => norm(c.city) === k || norm(c.city).startsWith(`${k} `));
    const one = matches.length === 1 ? matches[0] : undefined;
    const local = matches[0] ? bySlug.get(matches[0].slug) : undefined;
    // Translate the city part only ("München" → "Munich"), keep the rest of the key.
    const label = local && matches[0] && local.city !== matches[0].city ? key.replace(matches[0].city, local.city) : key;
    out[key] = {
      key,
      label,
      href: one ? href(locale, "locations", one.slug) : href(locale, "locations"),
      appHref: one ? deeplinks.club(one.id) : undefined,
      clubId: one?.id,
      candidates: matches.length > 1 ? matches.map((c) => c.id) : undefined,
    };
  }
  return out;
}

/** Club refs for a list of coaches (convenience wrapper around resolveCoachClubs). */
export function resolveCoachClubsFor(coaches: Person[], deClubs: Club[], localClubs: Club[], locale: Locale) {
  return resolveCoachClubs(
    coaches.flatMap((c) => coachClubKeys(c.club)),
    deClubs,
    localClubs,
    locale,
  );
}

/**
 * Coaches of one club. `exact`: a coach key resolves to exactly this club. `nearby`: a key is ambiguous
 * (e.g. "München" → several Munich clubs) and this club is one of the candidates – shown only as a hint
 * ("Coaches in München") when nothing exact matches. Head Coaches first, otherwise source order.
 */
export function coachesForClub(coaches: Person[], clubId: string, refs: Record<string, CoachClubRef>) {
  const keysOf = (c: Person) => coachClubKeys(c.club).map((k) => refs[k]).filter(Boolean);
  const byHead = (list: Person[]) => [...list].sort((a, b) => Number(isHeadCoach(b.role)) - Number(isHeadCoach(a.role)));
  const exact = coaches.filter((c) => keysOf(c).some((r) => r.clubId === clubId));
  const nearby = exact.length
    ? []
    : coaches.filter((c) => keysOf(c).some((r) => !r.clubId && r.candidates?.includes(clubId)));
  return { exact: byHead(exact), nearby: byHead(nearby) };
}
