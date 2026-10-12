/**
 * Typographic helpers for display copy.
 * `keepTogether` swaps the space after short abbreviations ("Vol. 3", "Nr. 1", "No. 1")
 * and before a trailing "€" for a non-breaking space, so big headlines never break
 * into an orphaned "3" or "€" on the next line.
 */
export function keepTogether(text: string): string {
  return text.replace(/\b(Vol\.|Nr\.|No\.|Bd\.)\s+/g, "$1 ").replace(/(\d)\s+(€|%)/g, "$1 $2");
}
