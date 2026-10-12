"use client";

import { animate, useInView, useReducedMotion } from "motion/react";
import { useEffect, useRef, useState } from "react";

export function CountUp({ to, suffix = "", duration = 1.6, intl = "de-DE" }: { to: number; suffix?: string; duration?: number; intl?: string }) {
  const ref = useRef<HTMLSpanElement>(null);
  const inView = useInView(ref, { once: true, margin: "-40px" });
  const reduce = useReducedMotion();
  const [value, setValue] = useState(reduce ? to : 0);
  useEffect(() => {
    if (!inView || reduce) return;
    const controls = animate(0, to, { duration, ease: "easeOut", onUpdate: (v) => setValue(Math.round(v)) });
    return () => controls.stop();
  }, [inView, to, duration, reduce]);
  return (
    <span ref={ref} className="tabular-nums">
      {value.toLocaleString(intl)}
      {suffix}
    </span>
  );
}
