"use client";

import { useEffect, useState } from "react";
import { cn } from "@/components/ui/cn";

function diff(target: number) {
  const ms = Math.max(0, target - Date.now());
  return {
    d: Math.floor(ms / 86_400_000),
    h: Math.floor((ms / 3_600_000) % 24),
    m: Math.floor((ms / 60_000) % 60),
    s: Math.floor((ms / 1000) % 60),
    done: ms === 0,
  };
}

/** Live countdown to an ISO start date. Renders placeholders until mounted (no hydration mismatch). */
export type CountdownLabels = { days: string; hours: string; minutes: string; seconds: string; live: string; aria: string };

export function Countdown({ start, labels, className, size = "md" }: { start: string; labels: CountdownLabels; className?: string; size?: "sm" | "md" }) {
  const target = new Date(start).getTime();
  const [t, setT] = useState<ReturnType<typeof diff> | null>(null);

  useEffect(() => {
    setT(diff(target));
    const id = window.setInterval(() => setT(diff(target)), 1000);
    return () => window.clearInterval(id);
  }, [target]);

  if (t?.done) {
    return <p className={cn("font-display text-2xl italic uppercase text-fg", className)}>{labels.live}</p>;
  }

  const units: [string, number | undefined][] = [
    [labels.days, t?.d],
    [labels.hours, t?.h],
    [labels.minutes, t?.m],
    [labels.seconds, t?.s],
  ];

  // One pill, the units separated by thin dividers (Design QA: four bubbles read as four elements);
  // four equal cells with short units (Tage, Std, Min, Sek), so the pill never changes width
  return (
    <div
      className={cn("grid w-fit grid-cols-4 divide-x divide-fg/15 rounded-2xl border border-fg/15 bg-canvas-deep/40 backdrop-blur", className)}
      role="timer"
      aria-label={labels.aria}
    >
      {units.map(([label, v]) => (
        <div key={label} className={cn("flex flex-col items-center", size === "md" ? "w-16 py-2 md:w-20" : "w-14 py-1.5")}>
          <span className={cn("font-display font-extrabold italic tabular-nums leading-none", size === "md" ? "text-3xl md:text-4xl" : "text-xl")}>
            {v === undefined ? "--" : String(v).padStart(2, "0")}
          </span>
          <span className={cn("mt-1 font-semibold uppercase text-fg/70", size === "md" ? "text-[11px] tracking-[0.06em] md:text-[13px] md:tracking-[0.08em]" : "text-[10px] tracking-[0.04em]")}>{label}</span>
        </div>
      ))}
    </div>
  );
}
