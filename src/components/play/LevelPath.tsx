import { Check } from "lucide-react";
import type { AcademyLevelStage } from "@/lib/content/academy";
import { Reveal } from "@/components/ui/Reveal";
import { cn } from "@/components/ui/cn";

const stageTone: Record<AcademyLevelStage["key"], string> = {
  beginner: "from-purple-700/70 to-purple-900/20",
  intermediate: "from-magenta-700/70 to-purple-900/20",
  competition: "from-neon-600/50 to-ink-700/20",
};

// Contentful module: levelPath (stages, scale)
/** Beginner → Intermediate → Competition, mapped onto the 1–7 PadelCity scale. */
export function LevelPath({
  stages,
  scale,
  scaleLabel,
  stageLabel,
}: {
  stages: AcademyLevelStage[];
  scale: { level: number; label: string }[];
  scaleLabel: string;
  stageLabel: string;
}) {
  return (
    <div>
      {/* Scale 1–7 */}
      <div className="relative mb-12 md:mb-16" role="img" aria-label={scaleLabel}>
        <div className="absolute inset-x-0 top-[22px] h-1.5 rounded-full bg-gradient-to-r from-purple-500 via-magenta-500 to-neon-500 md:top-7" aria-hidden />
        <ol className="relative grid grid-cols-7 gap-1">
          {scale.map((l) => (
            <li key={l.level} className="flex flex-col items-center text-center">
              <span
                className={cn(
                  "grid size-11 place-items-center rounded-[10px] border-2 bg-ink-800 font-display text-2xl font-extrabold not-italic md:size-14 md:text-3xl",
                  l.level <= 2 ? "border-purple-400" : l.level <= 5 ? "border-magenta-400" : "border-neon-500 text-neon-500",
                )}
              >
                {l.level}
              </span>
              <span className="mt-2 hidden text-sm text-white/70 md:block">{l.label}</span>
            </li>
          ))}
        </ol>
      </div>

      {/* Stages */}
      <ol className="grid gap-5 md:grid-cols-3">
        {stages.map((s, i) => (
          <Reveal key={s.key} delay={i * 0.08} className="h-full">
            <li className={cn("relative flex h-full flex-col overflow-hidden rounded-[20px] border border-white/10 bg-gradient-to-br p-6 md:p-7", stageTone[s.key])}>
              <div className="flex items-center justify-between">
                <span className="text-[13px] font-semibold uppercase tracking-[0.25em] text-white/70">{stageLabel} 0{i + 1}</span>
                <span className="rounded-md border border-white/40 px-2 py-0.5 font-display text-lg font-extrabold uppercase italic tracking-wide">
                  Level {s.levels[0]}–{s.levels[1]}
                </span>
              </div>
              <h3 className="mt-5 font-display text-4xl font-extrabold uppercase not-italic leading-none tracking-wide md:text-5xl">{s.title}</h3>
              <p className="mt-4 text-white/75">{s.text}</p>
              <ul className="mt-6 space-y-2 border-t border-white/15 pt-5 text-sm">
                {s.bullets.map((b) => (
                  <li key={b} className="flex items-start gap-2">
                    <Check className="mt-0.5 size-4 shrink-0 text-neon-500" aria-hidden /> {b}
                  </li>
                ))}
              </ul>
            </li>
          </Reveal>
        ))}
      </ol>
    </div>
  );
}
