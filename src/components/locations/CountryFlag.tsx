import { asset } from "@/lib/asset";
import type { ClubCountry } from "@/lib/data/types";
import { cn } from "@/components/ui/cn";

/** Round flags (public/icons/country_*.svg) – redrawn as clean vectors: one circular clip, hairline ring. */
const FLAGS: Partial<Record<ClubCountry, string>> = {
  DE: "/icons/country_DE.svg",
  AT: "/icons/country_AT.svg",
  PL: "/icons/country_PL.svg",
};

/** Round country flag; decorative (the country name is always rendered next to it). */
export function CountryFlag({ country, className }: { country: ClubCountry; className?: string }) {
  const src = FLAGS[country];
  if (!src) return null;
  // Plain <img>: vector stays vector (no resampling)
  // eslint-disable-next-line @next/next/no-img-element
  return <img src={asset(src)} alt="" aria-hidden width={20} height={20} className={cn("size-5 shrink-0", className)} />;
}
