"use client";

import { animate, useInView, useReducedMotion } from "motion/react";
import { useEffect, useRef, useState } from "react";

/** Animated number counter that starts when scrolled into view. Years are rendered without grouping. */
export function CountUp({
  value,
  prefix = "",
  suffix = "",
  duration = 1.6,
  intl = "de-DE",
}: {
  value: number;
  prefix?: string;
  suffix?: string;
  duration?: number;
  /** BCP-47 tag for number formatting – pass localeTags[locale].intl. */
  intl?: string;
}) {
  const ref = useRef<HTMLSpanElement>(null);
  const inView = useInView(ref, { once: true, margin: "-40px" });
  const reduce = useReducedMotion();
  const isYear = value >= 1900 && value <= 2100;
  const from = isYear ? value - 4 : 0;
  const [display, setDisplay] = useState(reduce ? value : from);

  useEffect(() => {
    if (!inView || reduce) {
      if (reduce) setDisplay(value);
      return;
    }
    const controls = animate(from, value, {
      duration,
      ease: [0.22, 1, 0.36, 1],
      onUpdate: (v) => setDisplay(Math.round(v)),
    });
    return () => controls.stop();
  }, [inView, reduce, value, from, duration]);

  const fmt = (n: number) => (isYear ? String(n) : n.toLocaleString(intl));
  return (
    // Invisible final value in the same grid cell reserves the width → no reflow while counting.
    <span ref={ref} aria-label={`${prefix}${fmt(value)}${suffix}`} className="inline-grid tabular-nums">
      <span aria-hidden className="invisible col-start-1 row-start-1">
        {prefix}
        {fmt(value)}
        {suffix}
      </span>
      <span aria-hidden className="col-start-1 row-start-1">
        {prefix}
        {fmt(display)}
        {suffix}
      </span>
    </span>
  );
}
