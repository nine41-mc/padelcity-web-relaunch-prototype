"use client";

import { animate, useInView } from "motion/react";
import { useEffect, useRef, useState } from "react";
import { useSystemReducedMotion } from "@/lib/a11y";

export function CountUp({ to, suffix = "", duration = 1.6, intl = "de-DE" }: { to: number; suffix?: string; duration?: number; intl?: string }) {
  const ref = useRef<HTMLSpanElement>(null);
  const inView = useInView(ref, { once: true, margin: "-40px" });
  const reduce = useSystemReducedMotion();
  const [value, setValue] = useState(0);
  useEffect(() => {
    if (reduce) return setValue(to);
    if (!inView) return;
    const controls = animate(0, to, { duration, ease: "easeOut", onUpdate: (v) => setValue(Math.round(v)) });
    return () => controls.stop();
  }, [inView, to, duration, reduce]);
  return (
    // Invisible final value in the same grid cell reserves the width → no reflow while counting.
    <span ref={ref} className="inline-grid tabular-nums">
      <span aria-hidden className="invisible col-start-1 row-start-1">
        {to.toLocaleString(intl)}
        {suffix}
      </span>
      <span className="col-start-1 row-start-1">
        {value.toLocaleString(intl)}
        {suffix}
      </span>
    </span>
  );
}
