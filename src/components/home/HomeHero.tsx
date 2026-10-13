"use client";

// Contentful module: heroHome (headline, accent word, sublines, media, CTAs)
import { useRouter } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import { motion, useReducedMotion, useScroll, useTransform } from "motion/react";
import { MapPin, Pause, Play, Search } from "lucide-react";
import { Button } from "../ui/Button";
import { Accent } from "../ui/Headline";
import { asset } from "@/lib/asset";
import type { Locale } from "@/lib/i18n/config";
import { href } from "@/lib/i18n/routes";
import type { HomeContent } from "@/lib/content/home";

export function HomeHero({ locale, t }: { locale: Locale; t: HomeContent["hero"] }) {
  const router = useRouter();
  const [q, setQ] = useState("");
  const reduce = useReducedMotion();
  const { scrollY } = useScroll();
  const y = useTransform(scrollY, [0, 800], [0, reduce ? 0 : 160]);
  const scale = useTransform(scrollY, [0, 800], [1, reduce ? 1 : 1.12]);
  // WCAG 2.2.2: looping background video needs a pause control; reduced motion → start paused.
  const video = useRef<HTMLVideoElement>(null);
  const [playing, setPlaying] = useState(true);
  useEffect(() => {
    if (reduce) {
      video.current?.pause();
      setPlaying(false);
    }
  }, [reduce]);
  const toggleVideo = () => {
    const v = video.current;
    if (!v) return;
    if (v.paused) {
      void v.play();
      setPlaying(true);
    } else {
      v.pause();
      setPlaying(false);
    }
  };

  return (
    <section className="relative isolate flex min-h-[100svh] items-end overflow-hidden pb-14 pt-32 md:items-center md:pb-24">
      <motion.div style={{ y, scale }} className="absolute inset-0 -z-20">
        <video
          ref={video}
          className="h-full w-full object-cover grayscale-[40%]"
          autoPlay={!reduce}
          muted
          loop
          playsInline
          preload="metadata"
          poster={asset("/images/hero/home-1.jpg")}
          aria-hidden
        >
          <source src={asset("/video/hero.mp4")} type="video/mp4" />
        </video>
      </motion.div>
      <div className="absolute inset-0 -z-10 bg-[radial-gradient(ellipse_at_30%_20%,rgb(132_18_181/0.55),transparent_60%),linear-gradient(to_bottom,rgb(11_11_15/0.6),rgb(64_27_120/0.7)_55%,#0b0b0f)]" />
      <div className="absolute inset-0 -z-10 bg-grain" />
      <button
        type="button"
        onClick={toggleVideo}
        aria-label={playing ? t.videoPause : t.videoPlay}
        className="absolute bottom-4 right-4 z-10 grid size-11 place-items-center rounded-full border border-white/40 bg-black/40 text-white backdrop-blur transition hover:border-white md:bottom-6 md:right-6"
      >
        {playing ? <Pause className="size-4" aria-hidden /> : <Play className="size-4" aria-hidden />}
      </button>
      {/* Brush stroke (brand book: dynamic gestures) */}
      <svg className="pointer-events-none absolute -bottom-10 -left-20 -z-10 w-[140%] max-w-none opacity-70 md:w-[110%]" viewBox="0 0 1600 500" fill="none" aria-hidden>
        <motion.path
          d="M-20 420 C 220 120, 420 120, 520 330 S 860 520, 1000 300 S 1380 60, 1640 240"
          stroke="url(#heroStroke)"
          strokeWidth="70"
          strokeLinecap="round"
          initial={{ pathLength: reduce ? 1 : 0 }}
          animate={{ pathLength: 1 }}
          transition={{ duration: 2.2, ease: [0.22, 1, 0.36, 1], delay: 0.3 }}
        />
        <defs>
          <linearGradient id="heroStroke" x1="0" x2="1">
            <stop offset="0" stopColor="#8412b5" />
            <stop offset="1" stopColor="#e005c3" />
          </linearGradient>
        </defs>
      </svg>

      <div className="container-site">
        <motion.p
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="mb-6 inline-flex items-center gap-2 rounded-full border border-white/15 bg-black/30 px-3.5 py-1.5 text-[13px] font-semibold tracking-wide text-white/90 backdrop-blur md:text-sm"
        >
          <span className="size-2 rounded-full bg-neon-500 animate-pulse-dot" aria-hidden />
          {t.badge}
        </motion.p>
        <motion.h1
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1], delay: 0.1 }}
          className="max-w-6xl font-display text-[15vw] leading-[0.86] font-extrabold italic uppercase tracking-tight md:text-[10.5vw] lg:text-[9.5rem]"
        >
          {t.line1}
          <br />
          {t.line2} <Accent>{t.accent}</Accent>
          <br />
          <span className="text-white/90">{t.line3}</span>
        </motion.h1>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.35 }}
          className="mt-8 flex flex-col gap-6 md:mt-12 lg:flex-row lg:items-end lg:justify-between"
        >
          <p className="max-w-md text-lg text-white/90 md:text-xl">
            {t.text}
          </p>
          <form
            role="search"
            onSubmit={(e) => {
              e.preventDefault();
              router.push(`${href(locale, "locations")}${q ? `?q=${encodeURIComponent(q)}` : ""}`);
            }}
            className="flex w-full max-w-xl items-center gap-2 rounded-full border border-white/45 bg-black/40 p-1.5 pl-5 backdrop-blur-xl focus-within:border-white"
          >
            <MapPin className="size-5 shrink-0 text-white" aria-hidden />
            <label htmlFor="hero-q" className="sr-only">
              {t.searchLabel}
            </label>
            <input
              id="hero-q"
              value={q}
              onChange={(e) => setQ(e.target.value)}
              placeholder={t.searchPlaceholder}
              className="h-12 min-w-0 flex-1 bg-transparent text-base text-white placeholder:text-white/60 focus:outline-none"
            />
            <button type="submit" className="grid size-12 shrink-0 place-items-center rounded-full bg-brand-gradient text-white transition hover:shadow-glow hover:brightness-110" aria-label={t.searchSubmit}>
              <Search className="size-5" />
            </button>
          </form>
        </motion.div>
        <div className="mt-6 flex flex-wrap gap-3">
          <Button href={href(locale, "app")} size="md" data-track="hero_app_cta">
            {t.ctaApp}
          </Button>
          {/* Phone: the search above already leads to the locations – one CTA less keeps the hero calm */}
          <div className="hidden md:block">
            <Button href={href(locale, "locations")} variant="outline" size="md">
              {t.ctaLocations}
            </Button>
          </div>
        </div>
      </div>
    </section>
  );
}
