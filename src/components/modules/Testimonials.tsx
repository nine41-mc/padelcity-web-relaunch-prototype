"use client";

// Contentful module: testimonials ("Let the players talk" – references to testimonial entries)
import { useEffect, useRef, useState } from "react";
import { ArrowLeft, ArrowRight, Quote } from "lucide-react";
import type { Locale } from "@/lib/i18n/config";
import { testimonials as allTestimonials, testimonialsContent, type Testimonial } from "@/lib/content/testimonials";
import { Accent, Eyebrow, Headline, Lead } from "../ui/Headline";
import { Media } from "../ui/Media";
import { Reveal } from "../ui/Reveal";
import { cn } from "../ui/cn";

const fill = (s: string, v: Record<string, string | number>) => s.replace(/\{(\w+)\}/g, (_, k) => String(v[k] ?? ""));

/** Quote text with the highlight sentence emphasised (highlight must be an exact substring). */
function QuoteText({ text, highlight }: { text: string; highlight: string }) {
  const i = text.indexOf(highlight);
  if (i < 0) return <>{text}</>;
  return (
    <>
      {text.slice(0, i)}
      <strong className="font-semibold text-white">{highlight}</strong>
      {text.slice(i + highlight.length)}
    </>
  );
}

function Card({ t, locale, index, total }: { t: Testimonial; locale: Locale; index: number; total: number }) {
  const c = testimonialsContent[locale];
  const [open, close] = locale === "de" ? ["„", "“"] : locale === "pl" ? ["„", "”"] : ["“", "”"];
  return (
    <figure
      role="group"
      aria-roledescription="slide"
      aria-label={fill(c.slide, { i: index + 1, n: total })}
      className="relative flex h-full flex-col overflow-hidden rounded-[28px] border border-white/10 bg-ink-700 p-6 md:p-8"
    >
      <Quote aria-hidden className="pointer-events-none absolute right-6 top-6 size-10 rotate-180 fill-magenta-500/25 text-magenta-500/70" />
      <figcaption className="relative flex items-center gap-4">
        <span className="shrink-0 rounded-full bg-brand-gradient p-[3px]">
          <Media src={t.photo} alt={fill(c.photoAlt, { name: t.name })} className="size-16 rounded-full md:size-[72px]" imgClassName="object-[50%_25%]" sizes="72px" />
        </span>
        <span className="font-display text-4xl leading-none font-extrabold italic uppercase md:text-5xl">{t.name}</span>
      </figcaption>
      <blockquote lang={locale} className="relative mt-6 text-base leading-relaxed text-white/75 md:text-[17px]">
        <p>
          {open}
          <QuoteText text={t.quote[locale]} highlight={t.highlight[locale]} />
          {close}
        </p>
      </blockquote>
      {c.translated && <p className="relative mt-auto pt-5 text-xs text-white/60">{c.translated}</p>}
    </figure>
  );
}

/**
 * "Let the players talk": real player voices from padelcity.de.
 * Phone: swipeable carousel (scroll-snap, labelled prev/next + dots, no autoplay). md: 2 columns, xl: 4 columns.
 */
export function Testimonials({ locale, items = allTestimonials }: { locale: Locale; items?: Testimonial[] }) {
  const c = testimonialsContent[locale];
  const listRef = useRef<HTMLUListElement>(null);
  const [active, setActive] = useState(0);
  // Target of a running smooth scroll, so fast repeated clicks keep advancing.
  const target = useRef<number | null>(null);

  useEffect(() => {
    const list = listRef.current;
    if (!list) return;
    const onScroll = () => {
      const first = list.children[0] as HTMLElement | undefined;
      if (!first) return;
      const step = first.offsetWidth + parseFloat(getComputedStyle(list).columnGap || "0");
      const idx = Math.max(0, Math.min(items.length - 1, Math.round(list.scrollLeft / step)));
      if (idx === target.current) target.current = null; // fallback where "scrollend" isn't supported
      setActive(idx);
    };
    const onEnd = () => (target.current = null);
    list.addEventListener("scroll", onScroll, { passive: true });
    list.addEventListener("scrollend", onEnd);
    return () => {
      list.removeEventListener("scroll", onScroll);
      list.removeEventListener("scrollend", onEnd);
    };
  }, [items.length]);

  const goTo = (i: number) => {
    const list = listRef.current;
    const el = list?.children[i] as HTMLElement | undefined;
    if (!list || !el) return;
    target.current = i;
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    list.scrollTo({ left: el.offsetLeft - list.offsetLeft, behavior: reduce ? "auto" : "smooth" });
  };

  return (
    <div>
      <Reveal className="mb-10 md:mb-12">
        <Eyebrow>{c.eyebrow}</Eyebrow>
        <Headline className="mt-6" size="md">
          <span lang="en">{c.title}</span> <Accent>{c.accent}</Accent>
        </Headline>
        <Lead className="mt-5">{c.lead}</Lead>
      </Reveal>

      <div role="region" aria-roledescription="carousel" aria-label={c.regionLabel}>
        <ul
          ref={listRef}
          className="scrollbar-none -mx-4 flex snap-x snap-mandatory gap-4 overflow-x-auto scroll-px-4 px-4 pb-2 md:mx-0 md:grid md:grid-cols-2 md:gap-5 md:overflow-visible md:px-0 md:pb-0 xl:grid-cols-4"
        >
          {items.map((t, i) => (
            <li key={t.id} className="w-[86%] shrink-0 snap-start md:w-auto">
              <Card t={t} locale={locale} index={i} total={items.length} />
            </li>
          ))}
        </ul>

        {/* Carousel controls – phone only (tablet/desktop show all cards) */}
        <div className="mt-6 flex items-center justify-between md:hidden">
          <div className="flex gap-1">
            {items.map((t, i) => (
              <button
                key={t.id}
                type="button"
                onClick={() => goTo(i)}
                aria-label={fill(c.goTo, { i: i + 1, name: t.name })}
                aria-current={active === i ? "true" : undefined}
                className="grid size-11 place-items-center"
              >
                <span className={cn("block h-2 rounded-full transition-all", active === i ? "w-6 bg-brand-gradient" : "w-2 bg-white/40")} />
              </button>
            ))}
          </div>
          <div className="flex gap-2">
            <button
              type="button"
              onClick={() => goTo(Math.max(0, (target.current ?? active) - 1))}
              disabled={active === 0}
              aria-label={c.prev}
              className="grid size-12 place-items-center rounded-full border border-white/40 transition hover:border-white hover:bg-white/10 disabled:opacity-40"
            >
              <ArrowLeft className="size-5" aria-hidden />
            </button>
            <button
              type="button"
              onClick={() => goTo(Math.min(items.length - 1, (target.current ?? active) + 1))}
              disabled={active === items.length - 1}
              aria-label={c.next}
              className="grid size-12 place-items-center rounded-full border border-white/40 transition hover:border-white hover:bg-white/10 disabled:opacity-40"
            >
              <ArrowRight className="size-5" aria-hidden />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
