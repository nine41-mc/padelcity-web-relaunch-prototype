"use client";

import Image from "next/image";
import { useCallback, useEffect, useRef, useState } from "react";
import { ArrowLeft, ArrowRight } from "lucide-react";
import type { StorePanel } from "@/lib/content/app";
import { cn } from "@/components/ui/cn";

// Contentful module: appStoreGallery (items: image, alt; link: store URL)
/**
 * Horizontal scroll-snap strip with the official App Store screenshots. No autoplay; swipe/scroll,
 * keyboard (focusable region) or prev/next buttons. Panels are rendered at ≤ 240 CSS px width
 * (DE source 560 px ≈ 2.3×, EN source 392 px ≈ 1.6× – the English store images are only available in low-res).
 */
export function StoreGallery({
  panels,
  labels,
  className,
}: {
  panels: StorePanel[];
  labels: { label: string; prev: string; next: string };
  className?: string;
}) {
  const scroller = useRef<HTMLDivElement>(null);
  const [edges, setEdges] = useState({ start: true, end: false });
  const updateEdges = useCallback(() => {
    const el = scroller.current;
    if (!el) return;
    setEdges({ start: el.scrollLeft <= 4, end: el.scrollLeft + el.clientWidth >= el.scrollWidth - 4 });
  }, []);
  useEffect(() => {
    updateEdges();
    window.addEventListener("resize", updateEdges);
    return () => window.removeEventListener("resize", updateEdges);
  }, [updateEdges]);
  const scroll = (dir: 1 | -1) => {
    const el = scroller.current;
    if (!el) return;
    const item = el.querySelector("li");
    const step = item ? item.getBoundingClientRect().width + 16 : 256;
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    el.scrollBy({ left: dir * step * 2, behavior: reduce ? "auto" : "smooth" });
  };

  return (
    <div className={cn("relative", className)}>
      <div
        ref={scroller}
        onScroll={updateEdges}
        role="region"
        aria-label={labels.label}
        tabIndex={0}
        className="-mx-4 snap-x snap-mandatory gap-4 overflow-x-auto scroll-px-4 px-4 pb-4 focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-optic-500 md:-mx-0 md:scroll-px-0 md:px-0 [&::-webkit-scrollbar]:hidden [scrollbar-width:none]"
      >
        <ul className="flex w-max gap-4">
        {panels.map((p) => (
          <li key={p.src} className="w-[200px] shrink-0 snap-start md:w-[220px] lg:w-[240px]">
            <Image
              src={p.src}
              alt={p.alt}
              width={p.width}
              height={p.height}
              sizes="(min-width: 1200px) 240px, (min-width: 768px) 220px, 200px"
              className="h-auto w-full rounded-[20px] border border-white/10"
            />
          </li>
        ))}
        </ul>
      </div>
      <div className="mt-4 flex gap-3">
        <button
          type="button"
          onClick={() => scroll(-1)}
          disabled={edges.start}
          aria-label={labels.prev}
          className="grid size-11 place-items-center rounded-full border border-white/40 transition-colors disabled:pointer-events-none disabled:opacity-30 hover:bg-white/10 focus-visible:outline-2 focus-visible:outline-optic-500"
        >
          <ArrowLeft className="size-5" aria-hidden />
        </button>
        <button
          type="button"
          onClick={() => scroll(1)}
          disabled={edges.end}
          aria-label={labels.next}
          className="grid size-11 place-items-center rounded-full border border-white/40 transition-colors disabled:pointer-events-none disabled:opacity-30 hover:bg-white/10 focus-visible:outline-2 focus-visible:outline-optic-500"
        >
          <ArrowRight className="size-5" aria-hidden />
        </button>
      </div>
    </div>
  );
}
