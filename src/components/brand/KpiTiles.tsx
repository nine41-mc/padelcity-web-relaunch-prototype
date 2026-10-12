import type { Kpi } from "@/lib/content/investors";
import { Reveal } from "../ui/Reveal";
import { cn } from "../ui/cn";
import { CountUp } from "./CountUp";

// Contentful module: kpiTiles (entries: kpi { label, value, prefix, suffix, note }) – only approved public figures.

/** KPI tiles with animated counters. */
export function KpiTiles({ items, intl, className }: { items: Kpi[]; intl: string; className?: string }) {
  return (
    <ul className={cn("grid grid-cols-2 gap-3 md:gap-4 lg:grid-cols-4", className)}>
      {items.map((k, i) => (
        <li key={k.label}>
          <Reveal delay={i * 0.05} className="h-full">
            <div className="flex h-full flex-col justify-between gap-6 rounded-[20px] border border-white/10 bg-ink-700 p-5 md:p-7">
              <p className="text-[13px] font-semibold uppercase tracking-[0.14em] text-white/70">{k.label}</p>
              <div>
                <p className="font-display text-5xl font-extrabold italic leading-none text-white md:text-6xl lg:text-7xl">
                  <CountUp value={k.value} prefix={k.prefix} suffix={k.suffix} intl={intl} />
                </p>
                {k.note && <p className="mt-2 text-sm text-white/70">{k.note}</p>}
              </div>
            </div>
          </Reveal>
        </li>
      ))}
    </ul>
  );
}
