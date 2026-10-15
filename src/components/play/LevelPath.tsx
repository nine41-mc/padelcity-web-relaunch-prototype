"use client";

import { useRef, useState } from "react";
import { Check } from "lucide-react";
import type { AcademyLevel, AcademyLevelStage } from "@/lib/content/academy";
import { cn } from "@/components/ui/cn";

const stageTone: Record<AcademyLevelStage["key"], string> = {
  beginner: "from-purple-700/70 to-purple-900/20",
  intermediate: "from-magenta-700/70 to-purple-900/20",
  competition: "from-magenta-600/50 to-ink-700/20",
};

const stageOf = (stages: AcademyLevelStage[], level: number) => stages.find((s) => level >= s.levels[0] && level <= s.levels[1]) ?? stages[0];

// Contentful module: levelPath (scale with one text per level, stages for grouping + bullets)
/**
 * PadelCity scale 1–7 (names/texts as in the app). Choosing a level on the timeline activates its
 * tile below and scrolls it into view; tapping a tile does the same. Bullets come from the stage
 * (Einsteiger / Fortgeschritten / Competition) the level belongs to.
 */
export function LevelPath({
  stages,
  scale,
  scaleLabel,
  levelLabel,
}: {
  stages: AcademyLevelStage[];
  scale: AcademyLevel[];
  scaleLabel: string;
  levelLabel: string;
}) {
  const [active, setActive] = useState(scale[0]?.level ?? 1);
  const rail = useRef<HTMLOListElement>(null);

  const select = (level: number) => {
    setActive(level);
    const el = rail.current;
    const card = el?.querySelector<HTMLElement>(`[data-level="${level}"]`);
    if (!el || !card) return;
    // horizontal scroll only – never moves the page vertically
    const left = card.offsetLeft - (el.clientWidth - card.offsetWidth) / 2;
    el.scrollTo({ left, behavior: window.matchMedia("(prefers-reduced-motion: reduce)").matches ? "auto" : "smooth" });
  };

  return (
    <div>
      {/* Timeline 1–7 */}
      <div className="relative mb-10 md:mb-14">
        <div className="absolute inset-x-0 top-[22px] h-1.5 rounded-full bg-gradient-to-r from-purple-500 via-magenta-500 to-magenta-300 md:top-7" aria-hidden />
        <ol className="relative grid grid-cols-7 gap-1" aria-label={scaleLabel}>
          {scale.map((l) => {
            const on = l.level === active;
            return (
              <li key={l.level} className="flex flex-col items-center text-center">
                <button
                  type="button"
                  onClick={() => select(l.level)}
                  aria-pressed={on}
                  aria-controls={`level-card-${l.level}`}
                  className="group flex flex-col items-center"
                >
                  <span
                    className={cn(
                      "grid size-11 place-items-center rounded-[10px] border-2 font-display text-2xl font-extrabold not-italic transition-all duration-300 md:size-14 md:text-3xl",
                      on
                        ? "scale-110 border-transparent bg-brand-gradient shadow-glow"
                        : cn("bg-ink-800 group-hover:scale-105", l.level <= 2 ? "border-purple-400" : l.level <= 5 ? "border-magenta-400" : "border-white"),
                    )}
                  >
                    <span className="sr-only">{levelLabel} </span>
                    {l.level}
                  </span>
                  {/* name visible from tablet up; on phones only for screen readers ("Level 1 Starter") */}
                  <span className={cn("mt-2 text-sm transition-colors max-md:sr-only md:block", on ? "font-semibold text-white" : "text-white/70 group-hover:text-white")}>{l.label}</span>
                </button>
              </li>
            );
          })}
        </ol>
      </div>

      {/* One tile per level */}
      <ol
        ref={rail}
        className="-mx-4 flex snap-x snap-mandatory gap-4 overflow-x-auto scroll-px-4 px-4 pb-4 [scrollbar-width:none] md:-mx-8 md:scroll-px-8 md:px-8 lg:-mx-16 lg:gap-5 lg:scroll-px-16 lg:px-16 [&::-webkit-scrollbar]:hidden"
      >
        {scale.map((l) => {
          const on = l.level === active;
          const stage = stageOf(stages, l.level);
          return (
            <li key={l.level} id={`level-card-${l.level}`} data-level={l.level} className="w-[85%] shrink-0 snap-center sm:w-[360px] lg:w-[380px]">
              <button
                type="button"
                onClick={() => select(l.level)}
                aria-pressed={on}
                className={cn(
                  "flex h-full w-full flex-col rounded-[20px] border bg-gradient-to-br p-6 text-left transition-all duration-300 md:p-7",
                  on ? cn("border-magenta-400/70 opacity-100 shadow-glow", stageTone[stage.key]) : "border-white/10 from-ink-700 to-ink-700 opacity-60 hover:opacity-90",
                )}
              >
                <span className="flex items-center justify-between gap-3">
                  <span className="text-[13px] font-semibold uppercase tracking-[0.25em] text-white/70">
                    {levelLabel} 0{l.level}
                  </span>
                  <span className="rounded-md border border-white/40 px-2 py-0.5 font-display text-lg font-extrabold uppercase italic tracking-wide">{stage.title}</span>
                </span>
                <span className="mt-5 block font-display text-4xl font-extrabold uppercase not-italic leading-none tracking-wide md:text-5xl">{l.label}</span>
                <span className="mt-4 block text-white/75">{l.text}</span>
                <span className="mt-auto block pt-6 text-sm">
                  <span className="block space-y-2 border-t border-white/15 pt-5">
                    {stage.bullets.map((b) => (
                      <span key={b} className="flex items-start gap-2">
                        <Check className="mt-0.5 size-4 shrink-0 text-magenta-300" aria-hidden /> {b}
                      </span>
                    ))}
                  </span>
                </span>
              </button>
            </li>
          );
        })}
      </ol>
    </div>
  );
}
