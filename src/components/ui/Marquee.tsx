"use client";

import { useState } from "react";
import { usePathname } from "next/navigation";
import { Pause, Play } from "lucide-react";
import { localeFromPath } from "@/lib/i18n/routes";
import { useMotionOff } from "@/lib/a11y";
import { cn } from "./cn";

/** Each half repeats the children this often, so one half is wider than any screen (no empty strip on wide displays). */
const REPEAT = 4;

const LABELS = {
  de: { pause: "Laufband anhalten", play: "Laufband fortsetzen" },
  en: { pause: "Pause ticker", play: "Play ticker" },
  pl: { pause: "Zatrzymaj pasek", play: "Wznów pasek" },
};

/**
 * Infinite horizontal ticker: two identical halves, the track moves by one half for a seamless loop.
 * WCAG 2.2.2: moving content > 5 s needs a pause control → visible button (also stops on hover/focus,
 * with "reduce motion" and with "Bewegung aus" in the accessibility panel).
 */
export function Marquee({ children, className, reverse }: { children: React.ReactNode; className?: string; reverse?: boolean }) {
  const [paused, setPaused] = useState(false);
  const motionOff = useMotionOff();
  const t = LABELS[localeFromPath(usePathname() ?? "/")];
  const stopped = paused || motionOff;
  const half = (hidden: boolean) => (
    <div className="flex shrink-0 items-center" aria-hidden={hidden || undefined}>
      {Array.from({ length: REPEAT }, (_, i) => (
        <div key={i} className="flex shrink-0 items-center" aria-hidden={(!hidden && i > 0) || undefined}>
          {children}
        </div>
      ))}
    </div>
  );
  return (
    <div className={cn("relative flex w-full items-center", className)}>
      <div className="relative flex min-w-0 flex-1 overflow-hidden [mask-image:linear-gradient(to_right,transparent,black_8%,black_92%,transparent)]">
        {/* 40 s per content length × REPEAT */}
        <div
          className={cn(
            "flex w-max shrink-0 animate-marquee items-center [animation-duration:160s] hover:[animation-play-state:paused] focus-within:[animation-play-state:paused]",
            reverse && "[animation-direction:reverse]",
            stopped && "[animation-play-state:paused]",
          )}
        >
          {half(false)}
          {half(true)}
        </div>
      </div>
      {!motionOff && (
        <button
          type="button"
          onClick={() => setPaused((p) => !p)}
          aria-pressed={paused}
          aria-label={paused ? t.play : t.pause}
          className="relative z-10 mx-2 grid size-8 shrink-0 place-items-center rounded-full bg-black/15 text-current transition-colors hover:bg-black/25 motion-reduce:hidden md:mx-3"
        >
          {paused ? <Play className="size-3.5 fill-current" aria-hidden /> : <Pause className="size-3.5 fill-current" aria-hidden />}
        </button>
      )}
    </div>
  );
}
