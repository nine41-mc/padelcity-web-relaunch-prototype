import type { Milestone } from "@/lib/content/about";
import type { Locale } from "@/lib/i18n/config";
import { brandStrings } from "./strings";
import { Reveal } from "../ui/Reveal";
import { cn } from "../ui/cn";

// Contentful module: milestoneTimeline (entries: milestone { year, title, text, highlight })

/**
 * Milestone timeline shared by About and Investors.
 * Phone + tablet: horizontal snap-scroll strip. Desktop: all milestones in one row on a court line.
 */
export function Timeline({ items, locale, className }: { items: Milestone[]; locale: Locale; className?: string }) {
  const t = brandStrings[locale].timeline;
  return (
    <div className={cn("relative", className)}>
      <ol
        className="scrollbar-none -mx-4 flex snap-x snap-mandatory gap-4 overflow-x-auto px-4 pb-4 md:-mx-8 md:px-8 lg:mx-0 lg:grid lg:snap-none lg:gap-6 lg:overflow-visible lg:px-0"
        style={{ gridTemplateColumns: `repeat(${items.length}, minmax(0, 1fr))` }}
        aria-label={t.aria}
        // Swipe strip below lg: focusable so keyboard users can scroll it (WCAG 2.1.1)
        tabIndex={0}
      >
        {items.map((m, i) => (
          <li key={m.year + m.title} className="relative w-[78%] shrink-0 snap-start sm:w-[46%] lg:w-auto">
            <Reveal delay={i * 0.06} className="h-full">
              <div className="relative mb-5 flex items-center">
                <span
                  className={cn(
                    "relative z-10 size-4 rounded-full ring-4 ring-ink-800",
                    m.highlight ? "bg-brand-gradient shadow-glow" : "bg-magenta-500",
                  )}
                  aria-hidden
                />
                {/* connecting line */}
                {i < items.length - 1 && <span className="absolute left-4 right-[-1rem] top-1/2 h-px -translate-y-1/2 bg-gradient-to-r from-magenta-500/70 to-white/10 lg:right-[-1.5rem]" aria-hidden />}
              </div>
              <div
                className={cn(
                  "flex h-[calc(100%-2.25rem)] flex-col rounded-[20px] border pad-card",
                  m.highlight ? "border-magenta-500/50 bg-magenta-500/[0.08]" : "border-white/10 bg-ink-700",
                )}
              >
                <p className={cn("font-display text-5xl font-extrabold italic leading-none", m.highlight ? "text-white" : "text-brand-gradient")}>{m.year}</p>
                <h3 className="mt-4 min-h-[2lh] text-lg font-semibold leading-snug">{m.title}</h3>
                <p className="mt-2 text-sm leading-relaxed text-white/70">{m.text}</p>
              </div>
            </Reveal>
          </li>
        ))}
      </ol>
      <p className="mt-2 text-sm text-white/70 lg:hidden" aria-hidden>
        {t.swipe}
      </p>
    </div>
  );
}
