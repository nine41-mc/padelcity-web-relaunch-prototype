"use client";

// Contentful module: clubHero (Club.images, ordered; first = hero)

import { useCallback, useEffect, useRef, useState } from "react";
import { ChevronLeft, ChevronRight, Images, X } from "lucide-react";
import type { ImageAsset } from "@/lib/data/types";
import type { Locale } from "@/lib/i18n/config";
import { fill, locationsContent } from "@/lib/content/locations";
import { Media } from "@/components/ui/Media";
import { cn } from "@/components/ui/cn";

/**
 * Bento gallery: 1 large (2/3) + 2 stacked (1/3) on tablet/desktop, swipeable scroll-snap strip on phone.
 * "+N Fotos" opens a simple lightbox (Esc / arrows / backdrop to close).
 */
export function ClubGallery({ images, name, locale = "de" }: { images: ImageAsset[]; name: string; locale?: Locale }) {
  const t = locationsContent[locale].club.gallery;
  const [open, setOpen] = useState<number | null>(null);
  const dialogRef = useRef<HTMLDivElement>(null);
  const shown = images.slice(0, 3);
  const more = images.length - shown.length;

  const close = useCallback(() => setOpen(null), []);
  const step = useCallback((d: number) => setOpen((i) => (i === null ? i : (i + d + images.length) % images.length)), [images.length]);

  useEffect(() => {
    if (open === null) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") close();
      if (e.key === "ArrowRight") step(1);
      if (e.key === "ArrowLeft") step(-1);
    };
    document.addEventListener("keydown", onKey);
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    dialogRef.current?.focus();
    return () => {
      document.removeEventListener("keydown", onKey);
      document.body.style.overflow = prev;
    };
  }, [open, close, step]);

  return (
    <>
      {/* Phone: swipe strip */}
      <div role="group" className="-mx-4 flex snap-x snap-mandatory gap-2 overflow-x-auto px-4 scrollbar-none md:hidden" aria-label={fill(t.photosOf, { club: name })}>
        {images.map((img, i) => (
          <button key={i} type="button" onClick={() => setOpen(i)} className="relative w-[86%] shrink-0 snap-center overflow-hidden rounded-[20px]"
            // the first photo shows "10 Fotos" → the accessible name starts with it (WCAG 2.5.3)
            aria-label={i === 0 ? `${images.length} ${images.length === 1 ? t.photo : t.photos}: ${fill(t.enlarge, { i: 1, n: images.length })}` : fill(t.enlarge, { i: i + 1, n: images.length })}
          >
            <Media src={img.url} alt={img.alt} className="aspect-[4/3]" priority={i === 0} sizes="86vw" />
            {i === 0 && (
              <span className="absolute bottom-3 right-3 inline-flex items-center gap-1.5 rounded-full bg-black/60 px-3 py-1.5 text-[13px] font-semibold backdrop-blur">
                <Images className="size-3.5" aria-hidden /> {images.length} {images.length === 1 ? t.photo : t.photos}
              </span>
            )}
          </button>
        ))}
      </div>

      {/* Tablet/desktop: bento */}
      <div className="hidden h-[340px] grid-cols-3 grid-rows-2 gap-2 overflow-hidden rounded-[28px] md:grid lg:h-[380px]">
        {shown.map((img, i) => (
          <button
            key={i}
            type="button"
            onClick={() => setOpen(i)}
            className={cn(
              "group relative overflow-hidden",
              i === 0 && (shown.length === 1 ? "col-span-3 row-span-2" : "col-span-2 row-span-2"),
              shown.length === 2 && i === 1 && "row-span-2",
            )}
            // visible "+3 Fotos" on the last tile → the accessible name starts with it (WCAG 2.5.3)
            aria-label={i === shown.length - 1 && more > 0 ? `+${more} ${t.photos}: ${fill(t.enlarge, { i: i + 1, n: images.length })}` : fill(t.enlarge, { i: i + 1, n: images.length })}
          >
            <Media
              src={img.url}
              alt={img.alt}
              className="h-full w-full"
              imgClassName="transition-transform duration-700 group-hover:scale-105"
              priority={i === 0}
              sizes={i === 0 ? "66vw" : "33vw"}
            />
            {i === shown.length - 1 && more > 0 && (
              <span className="absolute inset-0 grid place-items-center bg-purple-900/60 text-lg font-semibold backdrop-blur-[2px] transition-colors group-hover:bg-purple-900/40">
                +{more} {t.photos}
              </span>
            )}
          </button>
        ))}
      </div>

      {open !== null && (
        <div
          ref={dialogRef}
          role="dialog"
          aria-modal="true"
          data-theme="dark"
          aria-label={fill(t.galleryOf, { club: name })}
          tabIndex={-1}
          className="fixed inset-0 z-[70] flex flex-col bg-black/95 outline-none"
          onClick={(e) => e.target === e.currentTarget && close()}
        >
          <div className="flex items-center justify-between p-4 text-sm text-fg/70">
            <span>
              {open + 1} / {images.length}
            </span>
            <button type="button" onClick={close} className="grid size-11 place-items-center rounded-full bg-fg/10 hover:bg-fg/20" aria-label={t.close}>
              <X className="size-5" />
            </button>
          </div>
          <div className="relative flex flex-1 items-center justify-center px-4 pb-6" onClick={(e) => e.target === e.currentTarget && close()}>
            <Media src={images[open].url} alt={images[open].alt} className="aspect-[4/3] w-full max-w-5xl rounded-[20px] lg:aspect-[16/9]" sizes="100vw" />
            {images.length > 1 && (
              <>
                <button type="button" onClick={() => step(-1)} className="absolute left-2 grid size-12 place-items-center rounded-full bg-black/60 hover:bg-fg/20 md:left-6" aria-label={t.prev}>
                  <ChevronLeft className="size-6" />
                </button>
                <button type="button" onClick={() => step(1)} className="absolute right-2 grid size-12 place-items-center rounded-full bg-black/60 hover:bg-fg/20 md:right-6" aria-label={t.next}>
                  <ChevronRight className="size-6" />
                </button>
              </>
            )}
          </div>
          <p className="px-4 pb-6 text-center text-sm text-fg/70">{images[open].alt}</p>
        </div>
      )}
    </>
  );
}
