import Image from "next/image";
import type { ClubCountry } from "@/lib/data/types";
import { cn } from "@/components/ui/cn";

/** Flags from the PadelCity app (mobile-app-flutter/assets/icons/country_*.svg → public/icons). */
const FLAGS: Partial<Record<ClubCountry, string>> = {
  DE: "/icons/country_DE.svg",
  AT: "/icons/country_AT.svg",
  PL: "/icons/country_PL.svg",
};

/** Round country flag; decorative (the country name is always rendered next to it). */
export function CountryFlag({ country, className }: { country: ClubCountry; className?: string }) {
  const src = FLAGS[country];
  if (!src) return null;
  return <Image src={src} alt="" aria-hidden width={20} height={20} className={cn("size-5 shrink-0 rounded-full", className)} />;
}
