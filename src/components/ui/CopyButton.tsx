"use client";

import { useState } from "react";
import { Check, Copy } from "lucide-react";
import { cn } from "./cn";

/** Round icon button that copies a value (address, phone, email) and confirms with a check for a moment. */
export function CopyButton({ value, label, copiedLabel, className, track }: { value: string; label: string; copiedLabel: string; className?: string; track?: string }) {
  const [done, setDone] = useState(false);
  return (
    <button
      type="button"
      aria-label={done ? copiedLabel : label}
      title={done ? copiedLabel : label}
      data-track={track}
      onClick={async () => {
        await navigator.clipboard?.writeText(value);
        setDone(true);
        setTimeout(() => setDone(false), 1600);
      }}
      className={cn("grid size-11 shrink-0 place-items-center rounded-full border border-white/15 text-white/75 transition-colors hover:border-white/40 hover:text-white", className)}
    >
      {done ? <Check className="size-[18px] text-success" aria-hidden /> : <Copy className="size-[18px]" aria-hidden />}
      <span className="sr-only" aria-live="polite">{done ? copiedLabel : ""}</span>
    </button>
  );
}
