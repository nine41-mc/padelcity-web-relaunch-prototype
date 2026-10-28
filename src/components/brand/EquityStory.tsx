"use client";

import { useEffect, useRef, useState } from "react";
import { Check } from "lucide-react";
import type { EquityChapter } from "@/lib/content/investors";
import { cn } from "../ui/cn";

// Contentful module: investorsContent – Equity Story (entries: equityChapter { kicker, title, text, bullets[] })

/**
 * Equity story in chapters. Desktop: sticky chapter index on the left that follows the scroll
 * position; chapters scroll on the right. Phone/tablet: simple stacked cards.
 */
export function EquityStory({ chapters, ariaLabel }: { chapters: EquityChapter[]; ariaLabel: string }) {
  const [active, setActive] = useState(0);
  const refs = useRef<(HTMLElement | null)[]>([]);

  useEffect(() => {
    const io = new IntersectionObserver(
      (entries) => {
        for (const e of entries) {
          if (e.isIntersecting) setActive(Number((e.target as HTMLElement).dataset.index));
        }
      },
      { rootMargin: "-45% 0px -45% 0px" },
    );
    refs.current.forEach((el) => el && io.observe(el));
    return () => io.disconnect();
  }, []);

  return (
    <div className="grid gap-10 lg:grid-cols-[0.9fr_1.1fr] lg:gap-16">
      {/* Sticky index (desktop only) */}
      <div className="hidden lg:block">
        <div className="sticky top-32">
          <ol className="space-y-2" aria-label={ariaLabel}>
            {chapters.map((c, i) => (
              <li key={c.id}>
                <a
                  href={`#story-${c.id}`}
                  className={cn(
                    "group flex items-baseline gap-5 rounded-2xl px-5 py-4 transition-all duration-500",
                    active === i ? "bg-white/[0.06]" : "opacity-70 hover:opacity-100 focus-visible:opacity-100",
                  )}
                  aria-current={active === i ? "step" : undefined}
                >
                  <span className={cn("font-display text-4xl font-extrabold italic transition-colors", active === i ? "text-white" : "text-white/70")}>
                    {String(i + 1).padStart(2, "0")}
                  </span>
                  <span className="font-display text-3xl font-extrabold italic uppercase leading-none">{c.label}</span>
                </a>
              </li>
            ))}
          </ol>
          <div className="mt-8 h-1 w-full overflow-hidden rounded-full bg-white/10" aria-hidden>
            <div className="h-full bg-brand-gradient transition-all duration-500" style={{ width: `${((active + 1) / chapters.length) * 100}%` }} />
          </div>
        </div>
      </div>

      {/* Chapters */}
      <div className="space-y-5 lg:space-y-[18vh] lg:pb-[8vh]">
        {chapters.map((c, i) => (
          <article
            key={c.id}
            id={`story-${c.id}`}
            data-index={i}
            ref={(el) => {
              refs.current[i] = el;
            }}
            className={cn(
              "scroll-mt-32 rounded-[28px] border pad-banner transition-all duration-500",
              active === i ? "border-magenta-500/40 bg-ink-700 lg:shadow-glow" : "border-white/10 bg-ink-700/60",
            )}
          >
            <p className="text-[13px] font-semibold uppercase tracking-[0.16em] text-magenta-300">{c.kicker}</p>
            <h3 className="mt-4 font-display text-4xl font-extrabold italic uppercase leading-[0.95] md:text-5xl">{c.title}</h3>
            <p className="mt-5 text-base leading-relaxed text-white/75 md:text-lg">{c.text}</p>
            <ul className="mt-6 space-y-3">
              {c.bullets.map((b) => (
                <li key={b} className="flex gap-3 text-sm text-white/80 md:text-base">
                  <span className="mt-0.5 grid size-5 shrink-0 place-items-center rounded-full bg-white/10">
                    <Check className="size-3" strokeWidth={3} aria-hidden />
                  </span>
                  <span>{b}</span>
                </li>
              ))}
            </ul>
          </article>
        ))}
      </div>
    </div>
  );
}
