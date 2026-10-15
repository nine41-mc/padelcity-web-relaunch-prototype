"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { X } from "lucide-react";
import type { ImageAsset } from "@/lib/data/types";
import type { Locale } from "@/lib/i18n/config";
import { asset } from "@/lib/asset";
import { cn } from "@/components/ui/cn";

/*
 * Contentful module: clubHighlights (club → highlight entries { title, cover, frames: image|video[] }).
 * Instagram story highlights are not available through the Instagram API, so the club's highlight
 * stories are uploaded to Contentful. Prototype: frames come from the club gallery.
 */
const copy = {
  de: { title: "Highlights des Clubs", groups: ["Welcome", "Courts", "Community", "Events"], close: "Schließen", prev: "Vorherige", next: "Nächste", welcome: "Welcome to" },
  en: { title: "Club highlights", groups: ["Welcome", "Courts", "Community", "Events"], close: "Close", prev: "Previous", next: "Next", welcome: "Welcome to" },
  pl: { title: "Highlights klubu", groups: ["Welcome", "Courts", "Community", "Events"], close: "Zamknij", prev: "Poprzednie", next: "Następne", welcome: "Welcome to" },
};
const FRAME_MS = 5000;
const src = (url: string) => (url.startsWith("/") ? asset(url) : url);

type Highlight = { label: string; frames: ImageAsset[] };

function groupFrames(images: ImageAsset[], labels: string[]): Highlight[] {
  const per = Math.max(2, Math.ceil(images.length / labels.length));
  const groups: Highlight[] = [];
  for (let i = 0; i < labels.length && i * per < images.length; i++) groups.push({ label: labels[i], frames: images.slice(i * per, i * per + per) });
  return groups;
}

/** Instagram-style highlight circles + a story viewer (progress bars, tap left/right, Esc, auto-advance). */
export function ClubHighlights({ images, city, locale }: { images: ImageAsset[]; city: string; locale: Locale }) {
  const t = copy[locale];
  const highlights = groupFrames(images, t.groups);
  const dialog = useRef<HTMLDialogElement>(null);
  const [open, setOpen] = useState<{ h: number; f: number } | null>(null);
  const [seen, setSeen] = useState<Set<number>>(new Set());
  const [paused, setPaused] = useState(false);

  const close = useCallback(() => {
    dialog.current?.close();
    setOpen(null);
  }, []);
  const step = useCallback(
    (dir: 1 | -1) =>
      setOpen((cur) => {
        if (!cur) return cur;
        const frames = highlights[cur.h].frames.length;
        if (cur.f + dir >= 0 && cur.f + dir < frames) return { h: cur.h, f: cur.f + dir };
        const h = cur.h + dir;
        if (h < 0 || h >= highlights.length) {
          dialog.current?.close();
          return null;
        }
        setSeen((s) => new Set(s).add(h));
        return { h, f: dir === 1 ? 0 : highlights[h].frames.length - 1 };
      }),
    [highlights],
  );

  // Auto-advance
  useEffect(() => {
    if (!open || paused) return;
    const id = window.setTimeout(() => step(1), FRAME_MS);
    return () => window.clearTimeout(id);
  }, [open, paused, step]);

  // Keyboard
  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "ArrowRight") step(1);
      if (e.key === "ArrowLeft") step(-1);
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [open, step]);

  if (highlights.length === 0) return null;
  const start = (h: number) => {
    setSeen((s) => new Set(s).add(h));
    setOpen({ h, f: 0 });
    setPaused(false);
    dialog.current?.showModal();
  };
  const current = open ? highlights[open.h] : null;
  const frame = current && open ? current.frames[open.f] : null;

  return (
    <div className="mt-7">
      <p className="mb-3 text-[13px] font-semibold uppercase tracking-[0.14em] text-white/70">{t.title}</p>
      <ul className="-mx-4 flex gap-4 overflow-x-auto px-4 pb-1 scrollbar-none md:mx-0 md:px-0">
        {highlights.map((h, i) => (
          <li key={h.label} className="shrink-0">
            <button type="button" onClick={() => start(i)} className="group flex w-[76px] flex-col items-center gap-1.5 text-center" data-track="club_highlight_open">
              <span className={cn("grid size-[76px] place-items-center rounded-full p-[3px] transition-transform group-hover:scale-105", seen.has(i) ? "bg-white/25" : "bg-brand-gradient")}>
                <span className="relative grid size-full place-items-center overflow-hidden rounded-full border-2 border-ink-800 bg-magenta-700">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img src={src(h.frames[0].url)} alt="" className="absolute inset-0 size-full object-cover opacity-60 mix-blend-luminosity" loading="lazy" />
                  <span className="absolute inset-0 bg-magenta-600/55" aria-hidden />
                  {i === 0 ? (
                    <span className="relative px-1 font-display text-[9px] font-extrabold italic uppercase leading-[1.05] text-white">
                      {t.welcome}
                      <br />
                      PadelCity
                      <span className="block truncate text-[12px]">{city}</span>
                    </span>
                  ) : (
                    <span className="relative font-display text-[13px] font-extrabold italic uppercase text-white">{h.label}</span>
                  )}
                </span>
              </span>
              <span className="w-full truncate text-[12px] font-semibold uppercase tracking-wide text-white/85">{i === 0 ? city : h.label}</span>
            </button>
          </li>
        ))}
      </ul>

      <dialog
        ref={dialog}
        onClose={() => setOpen(null)}
        aria-label={current ? `${t.title}: ${current.label}` : t.title}
        className="m-0 h-dvh max-h-none w-screen max-w-none bg-black/95 p-0 text-white backdrop:bg-black/90"
      >
        {current && frame && open && (
          <div className="relative mx-auto flex h-full max-w-[min(100vw,calc(100dvh*9/16))] flex-col">
            {/* Progress bars */}
            <div className="absolute inset-x-3 top-3 z-20 flex gap-1">
              {current.frames.map((_, i) => (
                <span key={i} className="h-[3px] flex-1 overflow-hidden rounded-full bg-white/30">
                  <span
                    key={`${open.h}-${open.f}-${i}`}
                    className={cn("block h-full bg-white", i < open.f ? "w-full" : i > open.f ? "w-0" : paused ? "w-1/2" : "w-full animate-[story-progress_linear_forwards]")}
                    style={i === open.f ? { animationDuration: `${FRAME_MS}ms` } : undefined}
                  />
                </span>
              ))}
            </div>
            <div className="absolute inset-x-3 top-7 z-20 flex items-center gap-2">
              <span className="grid size-8 place-items-center rounded-full bg-brand-gradient font-display text-[10px] font-extrabold italic">PC</span>
              <span className="text-sm font-semibold">padelcity.de</span>
              <span className="text-sm text-white/70">· {open.h === 0 ? city : current.label}</span>
              <button type="button" onClick={close} aria-label={t.close} className="ml-auto grid size-10 place-items-center rounded-full hover:bg-white/10">
                <X className="size-6" aria-hidden />
              </button>
            </div>
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src={src(frame.url)} alt={frame.alt ?? city} className="h-full w-full select-none object-cover md:rounded-[18px]" draggable={false} />
            {/* Tap zones: left = back, right = next; hold to pause */}
            <button
              type="button"
              aria-label={t.prev}
              onClick={() => step(-1)}
              onPointerDown={() => setPaused(true)}
              onPointerUp={() => setPaused(false)}
              className="absolute inset-y-16 left-0 w-1/3"
            />
            <button
              type="button"
              aria-label={t.next}
              onClick={() => step(1)}
              onPointerDown={() => setPaused(true)}
              onPointerUp={() => setPaused(false)}
              className="absolute inset-y-16 right-0 w-2/3"
            />
          </div>
        )}
      </dialog>
    </div>
  );
}
