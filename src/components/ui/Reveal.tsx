"use client";

import { motion } from "motion/react";
import { useMotionOff, useSystemReducedMotion } from "@/lib/a11y";

/** Fade-up on scroll. Keep delays small; stagger lists with `delay={i * 0.06}`. */
export function Reveal({
  children,
  delay = 0,
  className,
  y = 24,
}: {
  children: React.ReactNode;
  delay?: number;
  className?: string;
  y?: number;
}) {
  const systemReduce = useSystemReducedMotion();
  const motionOff = useMotionOff();
  const reduce = systemReduce || motionOff;
  return (
    <motion.div
      // data-reveal: the static HTML ships the start state (opacity 0) – globals.css shows it without the fade when
      // motion is reduced or off, SiteShell's <noscript> when JS never runs
      data-reveal=""
      className={className}
      initial={reduce ? false : { opacity: 0, y }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-60px" }}
      transition={{ duration: 0.6, delay, ease: [0.22, 1, 0.36, 1] }}
    >
      {children}
    </motion.div>
  );
}
