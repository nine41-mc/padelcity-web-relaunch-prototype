"use client";

import { useId, useRef } from "react";
import { Info, X } from "lucide-react";

/**
 * "Info" button next to "Teilen" in the club head: the club description (Contentful rich text, lines and list
 * items kept) opens in a dialog instead of sitting half-cut next to the title.
 * Native <dialog>: focus trap, Esc and backdrop handling come from the browser.
 */
export function ClubInfo({ title, text, label, closeLabel }: { title: string; text: string; label: string; closeLabel: string }) {
  const ref = useRef<HTMLDialogElement>(null);
  const titleId = useId();
  if (!text.trim()) return null;
  return (
    <>
      <button
        type="button"
        onClick={() => ref.current?.showModal()}
        aria-haspopup="dialog"
        data-track="club_info_open"
        className="inline-flex min-h-11 shrink-0 items-center gap-2 rounded-full border border-white/30 px-4 text-sm font-semibold text-white transition hover:border-transparent hover:bg-brand-gradient"
      >
        <Info className="size-4" aria-hidden /> {label}
      </button>
      <dialog
        ref={ref}
        aria-labelledby={titleId}
        onClick={(e) => {
          if (e.target === ref.current) ref.current.close(); // click on the backdrop
        }}
        className="m-auto max-h-[min(88vh,820px)] w-[min(100vw-32px,680px)] overflow-hidden rounded-[28px] border border-white/15 bg-ink-700 p-0 text-white shadow-elevated backdrop:bg-black/70 backdrop:backdrop-blur-sm"
      >
        <div className="flex max-h-[inherit] flex-col">
          <div className="flex items-start gap-4 border-b border-white/10 p-5 md:p-7">
            <h2 id={titleId} className="min-w-0 flex-1 font-display text-3xl font-extrabold italic uppercase leading-none md:text-4xl">
              {title}
            </h2>
            <button type="button" onClick={() => ref.current?.close()} aria-label={closeLabel} className="grid size-11 shrink-0 place-items-center rounded-full bg-white/10 hover:bg-white/15">
              <X className="size-5" aria-hidden />
            </button>
          </div>
          <p className="overflow-y-auto overscroll-contain whitespace-pre-line p-5 text-[15px] leading-relaxed text-white/80 md:p-7 md:text-base">{text}</p>
        </div>
      </dialog>
    </>
  );
}
