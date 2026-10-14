"use client";

import { useEffect, useRef, useState } from "react";
import { cn } from "@/components/ui/cn";

/**
 * Sticky in-page tab nav (anchor links). Highlights the section in view via IntersectionObserver.
 * Tablet/desktop only: on phones header + tabs + booking bar covered ~25 % of the screen (PadelCity, 14.10.2026).
 */
export function SectionTabs({ items, label, className }: { items: { id: string; label: string }[]; label: string; className?: string }) {
  const [active, setActive] = useState(items[0]?.id);
  const listRef = useRef<HTMLUListElement>(null);

  useEffect(() => {
    const els = items.map((i) => document.getElementById(i.id)).filter((e): e is HTMLElement => !!e);
    const visible = new Map<string, boolean>();
    const obs = new IntersectionObserver(
      (entries) => {
        for (const e of entries) visible.set(e.target.id, e.isIntersecting);
        const first = items.find((i) => visible.get(i.id));
        if (first) setActive(first.id);
      },
      { rootMargin: "-170px 0px -55% 0px" },
    );
    els.forEach((el) => obs.observe(el));
    return () => obs.disconnect();
  }, [items]);

  // Keep the active tab visible in the horizontally scrollable bar (phone).
  useEffect(() => {
    const el = listRef.current?.querySelector<HTMLElement>(`[data-id="${active}"]`);
    const list = listRef.current;
    if (el && list) list.scrollTo({ left: el.offsetLeft - 16, behavior: "smooth" });
  }, [active]);

  return (
    <nav aria-label={label} className={cn("sticky top-[92px] z-30 hidden md:block", className)}>
      <div className="container-site">
        <ul ref={listRef} className="flex gap-1 overflow-x-auto rounded-full border border-white/10 bg-ink-700/85 p-1 shadow-elevated backdrop-blur-xl scrollbar-none">
          {items.map((i) => (
            <li key={i.id} data-id={i.id} className="shrink-0 lg:flex-1">
              <a
                href={`#${i.id}`}
                aria-current={active === i.id ? "location" : undefined}
                className={cn(
                  "flex min-h-11 items-center justify-center rounded-full px-4 font-display text-lg italic uppercase tracking-wide transition-colors md:text-xl",
                  active === i.id ? "bg-brand-gradient text-white" : "text-white/70 hover:text-white",
                )}
              >
                {i.label}
              </a>
            </li>
          ))}
        </ul>
      </div>
    </nav>
  );
}
