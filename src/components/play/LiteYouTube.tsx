"use client";

import { useState } from "react";
import { Play } from "lucide-react";
import { Media } from "@/components/ui/Media";
import { cn } from "@/components/ui/cn";
import type { Locale } from "@/lib/i18n/config";

const labels = {
  de: { play: "Video abspielen", soon: "Video folgt bald.", privacy: "Beim Abspielen wird ein Video von YouTube (youtube-nocookie.com) geladen." },
  en: { play: "Play video", soon: "Video coming soon.", privacy: "Playing this loads a video from YouTube (youtube-nocookie.com)." },
  pl: { play: "Odtwórz wideo", soon: "Wideo już wkrótce.", privacy: "Odtworzenie spowoduje załadowanie wideo z YouTube (youtube-nocookie.com)." },
} satisfies Record<Locale, Record<string, string>>;

// Contentful module: videoEmbed (youtubeId, title, thumbnail)
/**
 * Privacy-friendly YouTube embed: shows a local thumbnail + play button and only loads the
 * youtube-nocookie iframe after an explicit click (no requests to Google before consent).
 */
export function LiteYouTube({
  youtubeId,
  title,
  thumbnail,
  duration,
  locale,
  className,
}: {
  youtubeId?: string;
  title: string;
  thumbnail?: string;
  duration?: string;
  locale: Locale;
  className?: string;
}) {
  const t = labels[locale];
  const [state, setState] = useState<"idle" | "playing" | "missing">("idle");

  return (
    <div className={cn("group relative aspect-video overflow-hidden rounded-[20px] border border-white/10 bg-ink-700", className)}>
      {state === "playing" && youtubeId ? (
        <iframe
          className="absolute inset-0 size-full"
          src={`https://www.youtube-nocookie.com/embed/${youtubeId}?autoplay=1&rel=0`}
          title={title}
          allow="accelerometer; autoplay; encrypted-media; gyroscope; picture-in-picture"
          allowFullScreen
        />
      ) : (
        <button
          type="button"
          onClick={() => setState(youtubeId ? "playing" : "missing")}
          data-track="video_play"
          className="absolute inset-0 block size-full text-left"
          aria-label={`${t.play}: ${title}`}
        >
          <Media src={thumbnail} alt="" className="!absolute inset-0" imgClassName="transition-transform duration-700 group-hover:scale-105" overlay sizes="(min-width:1200px) 50vw, 100vw" />
          <span className="absolute left-1/2 top-1/2 grid size-16 -translate-x-1/2 -translate-y-1/2 place-items-center rounded-full bg-brand-gradient shadow-glow transition-transform duration-300 group-hover:scale-110 md:size-20">
            <Play className="ml-1 size-7 fill-white text-white md:size-8" aria-hidden />
          </span>
          <span className="absolute inset-x-4 bottom-4 flex items-end justify-between gap-3">
            <span className="font-semibold leading-tight">{title}</span>
            {duration && <span className="shrink-0 rounded-md bg-black/60 px-2 py-0.5 text-[13px] font-semibold">{duration}</span>}
          </span>
          {state === "missing" && (
            <span role="status" className="absolute inset-x-4 top-4 rounded-md bg-black/70 px-3 py-2 text-sm text-white/90">
              {t.soon} {/* TODO(content): youtubeId missing */}
            </span>
          )}
        </button>
      )}
      <p className="sr-only">{t.privacy}</p>
    </div>
  );
}
