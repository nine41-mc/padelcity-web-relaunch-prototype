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
    return <p className={cn("font-display text-2xl italic uppercase text-neon-500", className)}>{labels.live}</p>;
  }

  const units: [string, number | undefined][] = [
    [labels.days, t?.d],
    [labels.hours, t?.h],
    [labels.minutes, t?.m],
    [labels.seconds, t?.s],
  ];

  return (
    <div className={cn("flex gap-2 md:gap-3", className)} role="timer" aria-label={labels.aria}>
      {units.map(([label, v]) => (
        <div
          key={label}
          className={cn(
            "flex flex-col items-center rounded-xl border border-white/15 bg-black/40 backdrop-blur",
            size === "md" ? "min-w-16 px-3 py-2 md:min-w-20" : "min-w-12 px-2 py-1.5",
          )}
        >
          <span className={cn("font-display font-extrabold italic tabular-nums leading-none", size === "md" ? "text-3xl md:text-4xl" : "text-xl")}>
            {v === undefined ? "--" : String(v).padStart(2, "0")}
          </span>
          <span className="mt-1 text-[13px] font-semibold uppercase tracking-[0.14em] text-white/70">{label}</span>
        </div>
      ))}
    </div>
  );
}
