"use client";

import { useEffect, useRef, useState } from "react";
import { cn } from "@/components/ui/cn";

/** Text cut after three lines with "mehr anzeigen"; the toggle only appears when the text really is longer. */
export function ClampText({ text, more, less, className }: { text: string; more: string; less: string; className?: string }) {
  const ref = useRef<HTMLParagraphElement>(null);
  const [open, setOpen] = useState(false);
  const [overflows, setOverflows] = useState(false);
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const check = () => setOverflows(el.scrollHeight > el.clientHeight + 1);
    check();
    window.addEventListener("resize", check);
    return () => window.removeEventListener("resize", check);
  }, [text]);
  return (
    <div className={className}>
      <p ref={ref} className={cn("whitespace-pre-line text-[15px] leading-relaxed text-white/75 md:text-base", !open && "line-clamp-3")}>
        {text}
      </p>
      {(overflows || open) && (
        <div className="flex justify-end">
          <button type="button" onClick={() => setOpen((o) => !o)} aria-expanded={open} className="mt-1 inline-flex min-h-11 items-center text-[15px] font-semibold text-white md:text-base underline-offset-4 hover:underline">
            {open ? less : more}
          </button>
        </div>
      )}
    </div>
  );
}
