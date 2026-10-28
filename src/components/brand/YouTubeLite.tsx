"use client";

import { useState } from "react";
import { Play } from "lucide-react";
import { Media } from "../ui/Media";

// Contentful module: videoEmbed { youtubeId, title, poster }

/**
 * Privacy-friendly YouTube embed: shows a local poster and only loads youtube-nocookie.com after a click
 * (no third-party request before consent). Without `videoId` it renders a PadelCity TV placeholder.
 */
type VideoStrings = { play: string; soon: string; poster: string; placeholder: string; consent: string };

export function YouTubeLite({ videoId, title, poster, t }: { videoId?: string; title: string; poster?: string; t: VideoStrings }) {
  const [play, setPlay] = useState(false);

  if (play && videoId) {
    return (
      <div className="relative aspect-video overflow-hidden rounded-[20px] bg-black">
        <iframe
          className="absolute inset-0 size-full"
          src={`https://www.youtube-nocookie.com/embed/${videoId}?autoplay=1&rel=0`}
          title={title}
          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
          allowFullScreen
        />
      </div>
    );
  }

  return (
    <div className="group relative aspect-video overflow-hidden rounded-[20px] border border-white/10">
      <Media src={poster} alt={`${t.poster}: ${title}`} className="absolute inset-0" overlay />
      <button
        type="button"
        onClick={() => setPlay(true)}
        disabled={!videoId}
        data-track="video_play"
        className="absolute inset-0 flex flex-col items-center justify-center gap-4 text-center"
      >
        {/* Accessible name = action + the visible text (WCAG 2.5.3: the visible label is part of the name) */}
        <span className="sr-only">{videoId ? t.play : t.soon}: </span>
        <span className="grid size-16 place-items-center rounded-full bg-brand-gradient text-white shadow-glow transition-transform duration-300 group-hover:scale-110 md:size-20">
          <Play className="size-7 translate-x-0.5 fill-current md:size-8" aria-hidden />
        </span>
        <span className="px-6">
          <span className="block text-[13px] font-semibold uppercase tracking-[0.16em] text-white/70">PadelCity TV</span>
          <span className="mt-1 block font-display text-2xl font-extrabold italic uppercase md:text-3xl">{title}</span>
          {!videoId && <span className="mt-2 block text-sm text-white/70">{t.placeholder}</span>}
        </span>
      </button>
      <p className="absolute bottom-3 right-4 text-[13px] text-white/80">{t.consent}</p>
    </div>
  );
}
