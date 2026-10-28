"use client";

import { useState } from "react";
import { AnimatePresence, motion } from "motion/react";
import type { Value } from "@/lib/content/about";
import { cn } from "../ui/cn";
import { useSystemReducedMotion } from "@/lib/a11y";

// Contentful module: valuesGrid (entries: value { name, claim, text })

/** Interactive values grid: pick a value (click / hover / focus) to show its story in the spotlight panel. */
export function ValuesGrid({ items, ariaLabel }: { items: Value[]; ariaLabel: string }) {
  const [active, setActive] = useState(0);
  const reduce = useSystemReducedMotion();
  const current = items[active];

  return (
    <div className="grid gap-4 lg:grid-cols-[1fr_1.1fr] lg:gap-8">
      <div className="grid grid-cols-2 gap-3 md:grid-cols-4 lg:grid-cols-2" role="group" aria-label={ariaLabel}>
        {items.map((v, i) => (
          <button
            key={v.name}
            type="button"
            onClick={() => setActive(i)}
            onMouseEnter={() => setActive(i)}
            onFocus={() => setActive(i)}
            aria-pressed={active === i}
            className={cn(
              "group relative flex min-h-24 flex-col justify-between overflow-hidden rounded-[20px] border pad-card text-left transition-all duration-300 md:min-h-28",
              active === i ? "border-transparent bg-brand-gradient shadow-glow" : "border-white/10 bg-ink-700 hover:-translate-y-0.5 hover:border-white/25",
              i === items.length - 1 && "col-span-2 md:col-span-1 lg:col-span-2",
            )}
          >
            <span className={cn("text-[13px] font-semibold", active === i ? "text-white" : "text-white/75")}>{String(i + 1).padStart(2, "0")}</span>
            <span className="font-display text-2xl font-extrabold italic uppercase leading-none md:text-3xl">{v.name}</span>
          </button>
        ))}
      </div>
      <div className="relative min-h-72 overflow-hidden rounded-[28px] bg-brandbook-gradient pad-banner" aria-live="polite">
        <div className="absolute inset-0 bg-court-lines opacity-70" aria-hidden />
        <AnimatePresence mode="wait">
          <motion.div
            key={current.name}
            initial={reduce ? false : { opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            exit={reduce ? undefined : { opacity: 0, y: -16 }}
            transition={{ duration: 0.35 }}
            className="relative flex h-full flex-col justify-end"
          >
            <p className="font-brush text-3xl text-white md:text-4xl">{current.claim}</p>
            <p className="mt-3 font-display text-6xl font-extrabold italic uppercase leading-[0.9] md:text-8xl">{current.name}</p>
            <p className="mt-5 max-w-md text-lg text-white/85">{current.text}</p>
          </motion.div>
        </AnimatePresence>
      </div>
    </div>
  );
}
