"use client";

// Contentful module: testimonials ("Let the players talk" – references to testimonial entries)
import { useEffect, useRef, useState } from "react";
import type { Locale } from "@/lib/i18n/config";
import { testimonials as allTestimonials, testimonialsContent, type Testimonial } from "@/lib/content/testimonials";
import { Accent, Eyebrow, Headline, Lead } from "../ui/Headline";

import { Reveal } from "../ui/Reveal";
import { cn } from "../ui/cn";
import { CarouselArrow } from "@/components/ui/CarouselArrow";
import { TestimonialCard } from "@/components/brand/TestimonialCard";

const fill = (s: string, v: Record<string, string | number>) => s.replace(/\{(\w+)\}/g, (_, k) => String(v[k] ?? ""));

/**
 * "Let the players talk": real player voices from padelcity.de.
 * Phone: swipeable carousel (scroll-snap, labelled prev/next + dots, no autoplay). md: 2 columns, xl: 4 columns.
 */
export function Testimonials({ locale, items = allTestimonials }: { locale: Locale; items?: Testimonial[] }) {
  const c = testimonialsContent[locale];
  const listRef = useRef<HTMLUListElement>(null);
  const [active, setActive] = useState(0);
  // Target of a running smooth scroll, so fast repeated clicks keep advancing.
  const target = useRef<number | null>(null);

  useEffect(() => {
    const list = listRef.current;
    if (!list) return;
    const onScroll = () => {
      const first = list.children[0] as HTMLElement | undefined;
      if (!first) return;
      const step = first.offsetWidth + parseFloat(getComputedStyle(list).columnGap || "0");
      const idx = Math.max(0, Math.min(items.length - 1, Math.round(list.scrollLeft / step)));
      if (idx === target.current) target.current = null; // fallback where "scrollend" isn't supported
      setActive(idx);
    };
    const onEnd = () => (target.current = null);
    list.addEventListener("scroll", onScroll, { passive: true });
    list.addEventListener("scrollend", onEnd);
    return () => {
      list.removeEventListener("scroll", onScroll);
      list.removeEventListener("scrollend", onEnd);
    };
  }, [items.length]);

  const goTo = (i: number) => {
    const list = listRef.current;
    const el = list?.children[i] as HTMLElement | undefined;
    if (!list || !el) return;
    target.current = i;
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    list.scrollTo({ left: el.offsetLeft - list.offsetLeft, behavior: reduce ? "auto" : "smooth" });
  };

  return (
    <div>
      <Reveal className="mb-10 md:mb-12">
        <Eyebrow>{c.eyebrow}</Eyebrow>
        <Headline className="mt-6" size="md">
          <span lang="en">{c.title}</span> <Accent>{c.accent}</Accent>
        </Headline>
        <Lead className="mt-5">{c.lead}</Lead>
      </Reveal>

      <div role="region" aria-roledescription="carousel" aria-label={c.regionLabel}>
        <ul
          ref={listRef}
          className="scrollbar-none -mx-4 flex snap-x snap-mandatory gap-4 overflow-x-auto scroll-px-4 px-4 pb-2 md:mx-0 md:grid md:grid-cols-2 md:gap-5 md:overflow-visible md:px-0 md:pb-0 xl:grid-cols-4"
        >
          {items.map((t, i) => (
            <li key={t.id} className="w-[86%] shrink-0 snap-start md:w-auto">
              <TestimonialCard t={t} locale={locale} index={i} total={items.length} />
            </li>
          ))}
        </ul>

        {/* Carousel controls – phone only (tablet/desktop show all cards) */}
        <div className="mt-6 flex items-center justify-between md:hidden">
          <div className="flex gap-1">
            {items.map((t, i) => (
              <button
                key={t.id}
                type="button"
                onClick={() => goTo(i)}
                aria-label={fill(c.goTo, { i: i + 1, name: t.name })}
                aria-current={active === i ? "true" : undefined}
                className="grid size-11 place-items-center"
              >
                <span className={cn("block h-2 rounded-full transition-all", active === i ? "w-6 bg-brand-gradient" : "w-2 bg-white/40")} />
              </button>
            ))}
          </div>
          <div className="flex gap-2">
            <CarouselArrow direction="prev" label={c.prev} onClick={() => goTo(Math.max(0, (target.current ?? active) - 1))} disabled={active === 0} />
            <CarouselArrow direction="next" label={c.next} onClick={() => goTo(Math.min(items.length - 1, (target.current ?? active) + 1))} disabled={active === items.length - 1} />
          </div>
        </div>
      </div>
    </div>
  );
}
