// Contentful module: faqAccordion (per club, with global defaults)

import { ChevronDown } from "lucide-react";
import type { Locale } from "@/lib/i18n/config";
import { locationsContent } from "@/lib/content/locations";

export type FaqItem = { q: string; a: string };

/** Native <details> accordion: accessible, no JS needed. */
export function ClubFaq({ items }: { items: FaqItem[] }) {
  return (
    <div className="divide-y divide-white/10 rounded-[20px] border border-white/10 bg-ink-700">
      {items.map((f, i) => (
        <details key={i} className="group" name="club-faq">
          <summary className="flex min-h-14 cursor-pointer list-none items-center justify-between gap-4 px-5 py-4 font-medium md:px-6 [&::-webkit-details-marker]:hidden">
            {f.q}
            <ChevronDown className="size-5 shrink-0 text-white/70 transition-transform group-open:rotate-180" aria-hidden />
          </summary>
          <p className="px-5 pb-5 text-white/70 md:px-6">{f.a}</p>
        </details>
      ))}
    </div>
  );
}

/** Per-club FAQ (copy in src/lib/content/locations.ts). */
export function clubFaqs(club: { name: string; facilities: { type: string }[] }, locale: Locale = "de"): FaqItem[] {
  return locationsContent[locale].faqs({ name: club.name, parking: club.facilities.some((f) => f.type === "parking_space") });
}
