"use client";

import { useEffect, useRef, useState } from "react";
import { AnimatePresence, motion, useReducedMotion } from "motion/react";
import { Check } from "lucide-react";
import Image from "next/image";
import type { AppFeature, AppScreenshot, ScreenKey } from "@/lib/content/app";
import { deeplinks } from "@/lib/site";
import type { Locale } from "@/lib/i18n/config";
import { href } from "@/lib/i18n/routes";
import { Accent } from "@/components/ui/Headline";
import { AppIcon } from "@/components/ui/Icon";
import { Button } from "@/components/ui/Button";
import { cn } from "@/components/ui/cn";
import { PhoneMockup } from "./PhoneMockup";
import { AppScreenImage } from "./AppScreens";
import { AppPhone } from "./app/AppPhone";

type CoachCard = { src: string; width: number; height: number; alt: string };

/** Real coach card from the App Store panel, floating over the lower part of the phone. */
function CoachOverlay({ card, className }: { card: CoachCard; className?: string }) {
  return (
    <Image
      src={card.src}
      alt={card.alt}
      width={card.width}
      height={card.height}
      sizes="320px"
      className={cn("absolute left-1/2 h-auto w-[115%] max-w-none -translate-x-1/2 drop-shadow-[0_20px_40px_rgb(0_0_0/0.5)]", className)}
    />
  );
}

function ctaHref(f: AppFeature, locale: Locale): string {
  switch (f.deeplink) {
    case "openMatches":
      return deeplinks.openMatches();
    case "events":
      return deeplinks.events();
    case "vouchers":
      return deeplinks.vouchers();
    case "locations":
      return href(locale, "locations");
    default:
      return "#download";
  }
}

// Contentful module: featureStory (items: eyebrow, title, accent, text, bullets, screen, cta)
/**
 * Sticky-scroll storytelling: on desktop the phone stays pinned while the feature texts scroll
 * past and the screen swaps. On phone/tablet every feature renders its own inline phone.
 */
export function FeatureStory({
  features,
  screens,
  coachCard,
  phonePrefix,
  locale,
}: {
  features: AppFeature[];
  screens: Record<ScreenKey, AppScreenshot>;
  coachCard: CoachCard;
  phonePrefix: string;
  locale: Locale;
}) {
  const [active, setActive] = useState(0);
  const refs = useRef<(HTMLElement | null)[]>([]);
  const reduce = useReducedMotion();
  const activeFeature = features[active] ?? features[0];
  const activeShot = screens[activeFeature.screen];

  useEffect(() => {
    const io = new IntersectionObserver(
      (entries) => {
        for (const e of entries) if (e.isIntersecting) setActive(Number((e.target as HTMLElement).dataset.index));
      },
      { rootMargin: "-45% 0px -45% 0px" },
    );
    refs.current.forEach((el) => el && io.observe(el));
    return () => io.disconnect();
  }, []);

  return (
    <div className="lg:grid lg:grid-cols-[1fr_minmax(380px,0.8fr)] lg:gap-16">
      <div>
        {features.map((f, i) => {
          return (
            <article
              key={f.id}
              ref={(el) => {
                refs.current[i] = el;
              }}
              data-index={i}
              aria-labelledby={`feature-${f.id}`}
              className={cn(
                "grid items-center gap-10 border-t border-white/10 py-14 first:border-t-0 first:pt-0 md:grid-cols-[1fr_auto] md:py-20 lg:flex lg:min-h-[88vh] lg:flex-col lg:items-start lg:justify-center lg:py-0",
                "transition-opacity duration-500 lg:opacity-70 lg:focus-within:opacity-100",
                active === i && "lg:opacity-100",
              )}
            >
              <div>
                <p className="mb-5 inline-flex items-center gap-2 text-sm font-medium uppercase tracking-[0.14em] text-white/70">
                  <span className="grid size-9 place-items-center rounded-full bg-brand-gradient">
                    <AppIcon name={f.icon} className="size-4" />
                  </span>
                  {f.eyebrow}
                </p>
                <h3 id={`feature-${f.id}`} className="font-display text-5xl font-extrabold uppercase italic leading-[0.92] text-balance md:text-6xl lg:text-7xl">
                  {f.title} <Accent>{f.accent}</Accent>
                </h3>
                <p className="mt-5 max-w-xl text-lg text-white/70">{f.text}</p>
                <ul className="mt-6 space-y-2">
                  {f.bullets.map((b) => (
                    <li key={b} className="flex items-center gap-3">
                      <Check className="size-4 text-magenta-300" aria-hidden /> {b}
                    </li>
                  ))}
                </ul>
                <Button href={ctaHref(f, locale)} variant="outline" className="mt-8" data-track={f.track}>
                  {f.cta}
                </Button>
              </div>
              <div className={cn("relative flex justify-center lg:hidden", f.overlay && "pb-10")}>
                <div className="relative">
                  <AppPhone shot={screens[f.screen]} prefix={phonePrefix} className="w-[240px] md:w-[260px]" sizes="260px" />
                  {f.overlay === "coach" && <CoachOverlay card={coachCard} className="-bottom-8" />}
                </div>
              </div>
            </article>
          );
        })}
      </div>

      <div className="hidden lg:block">
        <div className="sticky top-0 flex h-screen items-center justify-center">
          <div className="absolute size-[460px] rounded-full bg-magenta-500/25 blur-[120px]" aria-hidden />
          <div className="relative">
            <PhoneMockup className="relative !w-[320px]" label={activeShot.alt} prefix={phonePrefix} statusBar={!activeShot.hasStatusBar}>
              <AnimatePresence mode="wait" initial={false}>
                <motion.div
                  key={activeFeature.id}
                  className="absolute inset-0"
                  initial={reduce ? false : { opacity: 0, y: 24 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={reduce ? undefined : { opacity: 0, y: -24 }}
                  transition={{ duration: 0.35, ease: [0.22, 1, 0.36, 1] }}
                >
                  <AppScreenImage shot={activeShot} sizes="320px" eager />
                </motion.div>
              </AnimatePresence>
            </PhoneMockup>
            {/* preload every screen so the swap never shows an empty phone */}
            <div className="hidden" aria-hidden>
              {features.map((f) => (
                <AppScreenImage key={f.id} shot={screens[f.screen]} sizes="320px" eager />
              ))}
            </div>
            <AnimatePresence>
              {activeFeature.overlay === "coach" && (
                <motion.div
                  key="coach"
                  className="absolute inset-x-0 bottom-16"
                  initial={reduce ? false : { opacity: 0, y: 16 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={reduce ? undefined : { opacity: 0 }}
                  transition={{ duration: 0.35, delay: reduce ? 0 : 0.2 }}
                >
                  <CoachOverlay card={coachCard} className="bottom-0" />
                </motion.div>
              )}
            </AnimatePresence>
          </div>
          <ol className="absolute right-0 top-1/2 flex -translate-y-1/2 flex-col gap-2" aria-hidden>
            {features.map((f, i) => (
              <li key={f.id} className={cn("h-8 w-1 rounded-full transition-colors", i === active ? "bg-brand-gradient" : "bg-white/15")} />
            ))}
          </ol>
        </div>
      </div>
    </div>
  );
}
