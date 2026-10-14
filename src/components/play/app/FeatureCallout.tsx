"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import { AnimatePresence, motion, useReducedMotion } from "motion/react";
import { Check, Minus, Plus, Ticket, User } from "lucide-react";
import type { AppCallouts, AppFeatureId } from "@/lib/content/app";
import { cn } from "@/components/ui/cn";

/*
 * One UI element of the screen in the phone, rebuilt in HTML and floating fully visible over the
 * phone (no cut-off crops). Each element plays a short loop – the interaction it stands for
 * (pick a start time, switch on split payment, type a voucher code …). Reduced motion → final state.
 */

const card = "rounded-2xl border border-white/10 bg-[#23242b]/95 p-4 font-sans text-white shadow-[0_24px_60px_-12px_rgb(0_0_0/0.7)] backdrop-blur";

/** Steps 0…n-1 in a loop while mounted (static last step with reduced motion). */
function useLoop(steps: number, ms: number) {
  const reduce = useReducedMotion();
  const [step, setStep] = useState(reduce ? steps - 1 : 0);
  useEffect(() => {
    if (reduce) return;
    const id = window.setInterval(() => setStep((s) => (s + 1) % steps), ms);
    return () => window.clearInterval(id);
  }, [reduce, steps, ms]);
  return reduce ? steps - 1 : step;
}

function Booking({ c }: { c: AppCallouts["booking"] }) {
  const step = useLoop(c.times.length, 1600);
  return (
    <div className={card}>
      <div className="flex gap-2">
        {c.times.map((t, i) => (
          <span
            key={t}
            className={cn(
              "flex-1 rounded-lg border py-2 text-center text-sm transition-colors duration-300",
              i === step ? "border-magenta-400 bg-magenta-500/15 text-white" : "border-white/10 bg-white/5 text-white/70",
            )}
          >
            {t}
          </span>
        ))}
      </div>
      <div className="mt-3 grid grid-cols-2 gap-2">
        {c.durations.map((d) => (
          <motion.div key={`${d.value}-${step}`} initial={{ scale: 0.94, opacity: 0.6 }} animate={{ scale: 1, opacity: 1 }} transition={{ duration: 0.3 }} className="flex items-center gap-2 rounded-lg bg-brand-gradient px-3 py-2">
            <span className="text-center leading-none">
              <span className="block text-lg">{d.value}</span>
              <span className="text-[10px] text-white/80">{d.unit}</span>
            </span>
            <span className="ml-auto border-l border-white/40 pl-2 text-lg font-semibold">{d.price}</span>
          </motion.div>
        ))}
      </div>
    </div>
  );
}

function Split({ c }: { c: AppCallouts["split"] }) {
  const step = useLoop(3, 1500); // 0 off · 1 on · 2 on + slots
  const on = step > 0;
  return (
    <div className={card}>
      <div className="flex items-center gap-3">
        <span className={cn("relative h-6 w-10 shrink-0 rounded-full transition-colors duration-300", on ? "bg-brand-gradient" : "bg-white/20")}>
          <span className={cn("absolute top-0.5 size-5 rounded-full bg-white shadow transition-all duration-300", on ? "left-[18px]" : "left-0.5")} />
        </span>
        <span className="text-sm font-semibold">{c.label}</span>
      </div>
      <p className="mt-2 text-xs text-white/70">{c.text}</p>
      <AnimatePresence initial={false}>
        {step === 2 && (
          <motion.div initial={{ height: 0, opacity: 0 }} animate={{ height: "auto", opacity: 1 }} exit={{ height: 0, opacity: 0 }} transition={{ duration: 0.3 }} className="overflow-hidden">
            <div className="mt-3 flex items-center gap-2 border-t border-white/10 pt-3">
              <span className="grid size-7 place-items-center rounded-full border border-white/30"><Minus className="size-3.5" /></span>
              <span className="text-sm">{c.slots}</span>
              <span className="grid size-7 place-items-center rounded-full border border-white/30"><Plus className="size-3.5" /></span>
              <span className="ml-auto text-lg font-semibold text-magenta-300">{c.price}</span>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

function Matches({ c }: { c: AppCallouts["matches"] }) {
  const step = useLoop(5, 1100); // players join one by one (2 → 4), then the match is confirmed
  const joined = Math.min(2 + step, 4);
  const confirmed = joined === 4;
  return (
    <div className={card}>
      <div className="flex items-center gap-2">
        {[0, 1, 2, 3].map((i) => (
          <span key={i} className={cn("grid size-9 place-items-center rounded-full border transition-all duration-300", i < joined ? "border-transparent bg-brand-gradient" : "border-dashed border-white/40")}>
            {i < joined ? <User className="size-4" /> : <Plus className="size-4 text-white/60" />}
          </span>
        ))}
        <span className="ml-auto text-sm text-white/70">{joined}/4</span>
      </div>
      <div className={cn("mt-3 flex items-start gap-2 border-t border-white/10 pt-3 transition-opacity duration-300", confirmed ? "opacity-100" : "opacity-30")}>
        <svg viewBox="0 0 32 32" className="size-6 shrink-0 text-success" fill="none" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round">
          <circle cx="16" cy="16" r="14" />
          <motion.path d="M10 16.5l4 4 8-9" initial={false} animate={{ pathLength: confirmed ? 1 : 0 }} transition={{ duration: 0.5 }} />
        </svg>
        <div>
          <p className="text-sm font-semibold text-success">{c.title}</p>
          <p className="mt-0.5 text-xs text-white/70">{c.text}</p>
        </div>
      </div>
    </div>
  );
}

function Coach({ c }: { c: AppCallouts["events"] }) {
  return (
    <div className="flex items-center gap-4 rounded-2xl border-2 border-magenta-400 bg-gradient-to-br from-purple-700 to-[#6c1d86] p-4 font-sans text-white shadow-[0_24px_60px_-12px_rgb(0_0_0/0.7)]">
      <Image src={c.image} alt="" width={64} height={64} className="size-14 shrink-0 rounded-full object-cover" />
      <div>
        <p className="text-base font-medium">{c.name}</p>
        <p className="text-sm text-white/90">{c.text}</p>
      </div>
    </div>
  );
}

function Vouchers({ c }: { c: AppCallouts["vouchers"] }) {
  const total = c.code.length + 4; // type the code, then show "applied" for a few ticks
  const step = useLoop(total + 1, 220);
  const typed = c.code.slice(0, Math.min(step, c.code.length));
  const done = step >= c.code.length;
  return (
    <div className={card}>
      <p className="flex items-center gap-2 text-sm"><Ticket className="size-4 text-magenta-300" aria-hidden /> {c.label}</p>
      <div className="mt-2 flex h-10 items-center rounded-lg border border-white/15 bg-white/5 px-3 font-mono text-sm tracking-wider">
        {typed}
        {!done && <span className="ml-0.5 h-4 w-px animate-pulse bg-white" />}
      </div>
      <p className={cn("mt-2 flex items-center gap-1.5 text-xs text-success transition-opacity duration-300", done ? "opacity-100" : "opacity-0")}>
        <Check className="size-3.5" aria-hidden /> {c.applied}
      </p>
    </div>
  );
}

function Benefits({ c }: { c: AppCallouts["benefits"] }) {
  return (
    <div className="rounded-2xl bg-magenta-500 p-4 font-sans text-white shadow-[0_24px_60px_-12px_rgb(0_0_0/0.7)]">
      <p className="text-sm font-semibold">{c.title}</p>
      <p className="mt-1 text-xs text-white/90">{c.text}</p>
    </div>
  );
}

/** `onMount`: animate in right away (sticky phone swaps); otherwise when scrolled into view. */
export function FeatureCallout({ id, callouts, className, onMount }: { id: AppFeatureId; callouts: AppCallouts; className?: string; onMount?: boolean }) {
  const reduce = useReducedMotion();
  const body =
    id === "booking" ? <Booking c={callouts.booking} /> :
    id === "split" ? <Split c={callouts.split} /> :
    id === "matches" ? <Matches c={callouts.matches} /> :
    id === "events" ? <Coach c={callouts.events} /> :
    id === "vouchers" ? <Vouchers c={callouts.vouchers} /> :
    <Benefits c={callouts.benefits} />;
  return (
    <motion.div
      key={id}
      aria-hidden
      className={cn("w-[264px] md:w-[280px]", className)}
      initial={reduce ? false : { opacity: 0, y: 20, scale: 0.96 }}
      {...(onMount ? { animate: { opacity: 1, y: 0, scale: 1 } } : { whileInView: { opacity: 1, y: 0, scale: 1 }, viewport: { once: true, amount: 0.6 } })}
      exit={reduce ? undefined : { opacity: 0, y: 10 }}
      transition={{ duration: 0.45, delay: reduce ? 0 : 0.25, ease: [0.22, 1, 0.36, 1] }}
    >
      {body}
    </motion.div>
  );
}
