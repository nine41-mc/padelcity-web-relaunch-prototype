/**
 * Brand claims stay English in every language. On DE/PL pages they are marked lang="en"
 * so screen readers pronounce them in English (WCAG 3.1.2 Language of Parts).
 */
const ENGLISH_CLAIMS = new Set([
  "Let's play Padel",
  "Let's play Padel!",
  "Game. Set. Match.",
  "#bettertogether",
  "Make some noise",
  "Make some noise for Padel",
  "Make some noise for Padel.",
  "Follow us!",
  "Never play",
  "alone.",
  "Loyalty hits reach.",
  "Experience for the win.",
]);

/** `lang="en"` for an English claim (undefined otherwise – the page language applies). */
export function claimLang(text: string): "en" | undefined {
  return ENGLISH_CLAIMS.has(text.trim()) ? "en" : undefined;
}
