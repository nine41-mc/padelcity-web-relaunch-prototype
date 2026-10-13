"use client";

import { useEffect, useState } from "react";
import { ArrowUpRight } from "lucide-react";
import type { Locale } from "@/lib/i18n/config";
import { locationsContent } from "@/lib/content/locations";
import { cn } from "@/components/ui/cn";

/**
 * Phone/tablet sticky bottom bar: "ab X € / Std." + "In der App buchen" (deep link).
 * Hides when the footer scrolls in so it never covers footer links.
 */
export function AppBookingBar({ href, price, locale }: { href: string; price?: string; locale: Locale }) {
  const t = locationsContent[locale].club.book;
  const [footerVisible, setFooterVisible] = useState(false);

  useEffect(() => {
    const footer = document.querySelector("footer");
    if (!footer) return;
    const obs = new IntersectionObserver(([e]) => setFooterVisible(e.isIntersecting));
    obs.observe(footer);
    // WCAG 2.4.11: keep keyboard-focused elements from scrolling underneath the fixed bar.
    const root = document.documentElement;
    root.style.scrollPaddingBottom = "120px";
    return () => {
      obs.disconnect();
      root.style.scrollPaddingBottom = "";
    };
  }, []);

  return (
    <div
      role="region"
      aria-label={t.barLabel}
      className={cn("fixed inset-x-0 bottom-0 z-40 transition-transform duration-300 lg:hidden", footerVisible && "translate-y-[120%]")}
    >
      <div className="mx-2 mb-2 flex items-center gap-3 rounded-[24px] border border-white/10 bg-ink-700/95 p-3 shadow-elevated backdrop-blur-xl md:mx-auto md:max-w-xl">
        <p className="min-w-0 flex-1 pl-2 text-sm leading-tight text-white/70">
          {price ? (
            <>
              {t.priceFrom} <span className="font-display text-2xl font-extrabold italic leading-none text-white">{price}</span> {t.perHour}
            </>
          ) : (
            t.priceOnRequest
          )}
          <span className="block text-[13px] text-white/75">{t.barNote}</span>
        </p>
        <a
          href={href}
          data-track="club_book_in_app_bar"
          className="flex min-h-12 shrink-0 items-center justify-center gap-2 rounded-full bg-brand-gradient px-5 font-display text-lg italic uppercase tracking-wide text-white"
        >
          {t.ctaShort} <ArrowUpRight className="size-5" aria-hidden />
        </a>
      </div>
    </div>
  );
}
