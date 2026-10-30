import { Quote } from "lucide-react";
import type { Locale } from "@/lib/i18n/config";
import { testimonialsContent, type Testimonial } from "@/lib/content/testimonials";
import { Media } from "../ui/Media";

// Contentful entry: testimonial { name, photo, quote, highlight } – placeholders until the players consent

const fill = (s: string, v: Record<string, string | number>) => s.replace(/\{(\w+)\}/g, (_, k) => String(v[k] ?? ""));

/** Quote text with the highlight sentence emphasised (highlight must be an exact substring). */
function QuoteText({ text, highlight }: { text: string; highlight: string }) {
  const i = text.indexOf(highlight);
  if (i < 0) return <>{text}</>;
  return (
    <>
      {text.slice(0, i)}
      <strong className="font-semibold text-fg">{highlight}</strong>
      {text.slice(i + highlight.length)}
    </>
  );
}

export function TestimonialCard({ t, locale, index, total }: { t: Testimonial; locale: Locale; index: number; total: number }) {
  const c = testimonialsContent[locale];
  const [open, close] = locale === "de" ? ["„", "“"] : locale === "pl" ? ["„", "”"] : ["“", "”"];
  return (
    <figure
      role="group"
      aria-roledescription="slide"
      aria-label={fill(c.slide, { i: index + 1, n: total })}
      className="relative flex h-full flex-col overflow-hidden rounded-[28px] border border-fg/10 bg-raised pad-panel"
    >
      <Quote aria-hidden className="pointer-events-none absolute right-6 top-6 size-10 rotate-180 fill-magenta-500/25 text-magenta-500/70" />
      <figcaption className="relative flex items-center gap-4">
        <span className="shrink-0 rounded-full bg-brand-gradient p-[3px]">
          <Media src={t.photo} alt={fill(c.photoAlt, { name: t.name })} className="size-16 rounded-full md:size-[72px]" imgClassName="object-[50%_25%]" sizes="72px" />
        </span>
        <span className="font-display text-4xl leading-none font-extrabold italic uppercase md:text-5xl">{t.name}</span>
      </figcaption>
      <blockquote lang={locale} className="relative mt-6 text-base leading-relaxed text-fg/75 md:text-[17px]">
        <p>
          {open}
          <QuoteText text={t.quote[locale]} highlight={t.highlight[locale]} />
          {close}
        </p>
      </blockquote>
      {c.translated && <p className="relative mt-auto pt-5 text-xs text-fg/60">{c.translated}</p>}
    </figure>
  );
}
