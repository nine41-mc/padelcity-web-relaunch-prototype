/** Club reference for a coach's club key (built server-side via resolveCoachClubs() in ./resolve.ts). */
export type CoachClubRef = {
  /** Key as written in coach.club, e.g. "Fürth" (from "Fürth & Erlangen"). */
  key: string;
  /** Display label in the page locale, e.g. "Munich". */
  label: string;
  /** Club detail page if the key maps to exactly one club, otherwise the locations overview. */
  href: string;
  /** App deep link to the club (only for an unambiguous match). */
  appHref?: string;
  /** Id of the club if the key maps to exactly one club. */
  clubId?: string;
  /** Ids of all matching clubs if the key is ambiguous (e.g. "München" → several Munich clubs). */
  candidates?: string[];
};

/**
 * Splits a coach's `club` string into single club keys:
 * "Fürth & Erlangen" → ["Fürth", "Erlangen"], "PadelCity Leipzig" (Contentful name) → ["Leipzig"].
 */
export function coachClubKeys(club?: string): string[] {
  if (!club) return [];
  const keys = club
    .split(/\s*(?:&|\/|,|\+)\s*/)
    .map((s) => s.replace(/^PadelCity\s+/i, "").trim())
    .filter(Boolean);
  return [...new Set(keys)];
}

export const isHeadCoach = (role: { en: string }) => /head/i.test(role.en);

export const fill = (tpl: string, vars: Record<string, string | number>) =>
  tpl.replace(/\{(\w+)\}/g, (_, k: string) => String(vars[k] ?? ""));
