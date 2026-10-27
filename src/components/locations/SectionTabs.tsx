"use client";

import { useEffect, useRef, useState } from "react";
import { cn } from "@/components/ui/cn";

/**
 * Sticky in-page tab nav (anchor links). Highlights the section the reader is in: the last one whose top has
 * passed the line below header + tabs. That line sits just under the sections' scroll margin (md:scroll-mt-48 =
 * 192px), so a click on a tab lands exactly on an active section – no extra scrolling needed.
 * Tablet/desktop only: on phones header + tabs + booking bar covered ~25 % of the screen (PadelCity, 14.10.2026).
 */
const ACTIVE_LINE = 200;

export function SectionTabs({ items, label, className }: { items: { id: string; label: string }[]; label: string; className?: string }) {
  const [active, setActive] = useState(items[0]?.id);
  const listRef = useRef<HTMLUListElement>(null);

  useEffect(() => {
    let frame = 0;
    const update = () => {
      frame = 0;
      const atBottom = window.innerHeight + window.scrollY >= document.documentElement.scrollHeight - 2;
      let current = items[0]?.id;
      for (const i of items) {
        const el = document.getElementById(i.id);
        if (el && (atBottom || el.getBoundingClientRect().top <= ACTIVE_LINE)) current = i.id;
      }
      setActive(current);
    };
    const onScroll = () => {
      if (!frame) frame = requestAnimationFrame(update);
    };
    update();
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onScroll);
    return () => {
      cancelAnimationFrame(frame);
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onScroll);
    };
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
                onClick={() => setActive(i.id)}
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
