"use client";

import { useEffect, useId, useRef } from "react";
import { X } from "lucide-react";
import { Media } from "./Media";
import { cn } from "./cn";

const FOCUSABLE = 'a[href], button:not([disabled]), input, select, textarea, [tabindex]:not([tabindex="-1"])';

/**
 * The one overlay design of the site (coach, club info, WhatsApp groups): glow border, image column left,
 * title + content right, round close button top right.
 * Native modal <dialog>: showModal() makes the page inert, Esc closes (cancel → close event), backdrop click closes,
 * Tab is wrapped inside the dialog, page scroll is locked while open.
 */
export function Overlay({
  open,
  onClose,
  title,
  meta,
  image,
  imageAlt,
  imageClassName,
  badge,
  closeLabel,
  children,
}: {
  open: boolean;
  onClose: () => void;
  title: React.ReactNode;
  /** Line under the title (e.g. location). */
  meta?: React.ReactNode;
  image?: string;
  imageAlt: string;
  /** Extra classes for the image, e.g. object-position for portraits. */
  imageClassName?: string;
  /** Pill on the image (e.g. coach role). */
  badge?: React.ReactNode;
  closeLabel: string;
  children: React.ReactNode;
}) {
  const ref = useRef<HTMLDialogElement>(null);
  const titleId = useId();

  useEffect(() => {
    const d = ref.current;
    if (!d) return;
    if (open && !d.open) {
      d.showModal();
      d.querySelector<HTMLElement>("[data-autofocus]")?.focus();
    } else if (!open && d.open) d.close();
    if (!open) return;
    const root = document.documentElement;
    const prev = root.style.overflow;
    root.style.overflow = "hidden";
    return () => {
      root.style.overflow = prev;
    };
  }, [open]);

  const onKeyDown = (e: React.KeyboardEvent<HTMLDialogElement>) => {
    if (e.key !== "Tab") return;
    const items = Array.from(e.currentTarget.querySelectorAll<HTMLElement>(FOCUSABLE)).filter((el) => el.offsetParent !== null);
    if (items.length === 0) return;
    const first = items[0];
    const last = items[items.length - 1];
    if (e.shiftKey && document.activeElement === first) {
      e.preventDefault();
      last.focus();
    } else if (!e.shiftKey && document.activeElement === last) {
      e.preventDefault();
      first.focus();
    }
  };

  return (
    <dialog
      ref={ref}
      aria-labelledby={titleId}
      onClose={onClose}
      onKeyDown={onKeyDown}
      onClick={(e) => {
        if (e.target === e.currentTarget) e.currentTarget.close();
      }}
      className={cn(
        "m-auto w-[calc(100%-32px)] max-w-4xl overflow-hidden rounded-[20px] border border-white/10 bg-ink-700 p-0 text-chalk shadow-glow md:rounded-[28px]",
        "max-h-[calc(100dvh-32px)] backdrop:bg-black/75 backdrop:backdrop-blur-sm",
      )}
    >
      {open && (
        <div className="grid max-h-[calc(100dvh-34px)] overflow-y-auto overscroll-contain md:grid-cols-[minmax(0,300px)_1fr] md:overflow-hidden">
          {/* Image column */}
          <div className="relative aspect-[16/10] md:aspect-auto md:min-h-full">
            <Media
              src={image}
              alt={imageAlt}
              className="absolute inset-0"
              imgClassName={imageClassName}
              overlay
              sizes="(min-width:768px) 300px, 100vw"
            />
            <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(120%_70%_at_0%_100%,rgb(224_5_195/0.4),transparent_65%)]" aria-hidden />
            {badge && (
              <span className="absolute left-4 top-4 inline-flex h-8 items-center gap-2 rounded-full border border-white/15 bg-black/55 px-3 backdrop-blur">{badge}</span>
            )}
          </div>

          {/* Content column */}
          <div className="relative p-5 md:max-h-[calc(100dvh-34px)] md:overflow-y-auto md:p-8">
            <button
              type="button"
              data-autofocus
              onClick={() => ref.current?.close()}
              aria-label={closeLabel}
              className="absolute right-3 top-3 grid size-11 place-items-center rounded-full border border-white/25 bg-ink-800/70 transition hover:border-white hover:bg-white/10 max-md:fixed max-md:right-6 max-md:top-6 md:right-5 md:top-5"
            >
              <X className="size-5" aria-hidden />
            </button>

            <h2 id={titleId} className="pr-14 font-display text-4xl font-extrabold uppercase italic leading-[0.9] tracking-tight md:text-5xl">
              {title}
            </h2>
            {meta && <div className="mt-2 text-sm text-white/80">{meta}</div>}
            {children}
          </div>
        </div>
      )}
    </dialog>
  );
}

/** Section label inside an overlay ("Kontakt", "Training & Preise"). */
export function OverlaySection({ title, children, className }: { title: string; children: React.ReactNode; className?: string }) {
  const id = useId();
  return (
    <section className={cn("mt-8", className)} aria-labelledby={id}>
      <h3 id={id} className="text-[13px] font-semibold uppercase tracking-[0.14em] text-white/60">
        {title}
      </h3>
      {children}
    </section>
  );
}
