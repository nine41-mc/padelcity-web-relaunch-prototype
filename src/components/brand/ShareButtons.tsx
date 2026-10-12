"use client";

import { useState } from "react";
import { Check, Link2, Linkedin, MessageCircle, Share2 } from "lucide-react";

const btn =
  "inline-flex h-11 items-center gap-2 rounded-full border border-white/20 px-4 text-sm font-medium transition-colors hover:border-neon-500 hover:text-neon-500";

/** Share bar for articles: native share (if available), WhatsApp, LinkedIn, copy link. */
export function ShareButtons({ url, title, t }: { url: string; title: string; t: { aria: string; share: string; copy: string; copied: string } }) {
  const [copied, setCopied] = useState(false);
  const enc = encodeURIComponent;
  return (
    <div className="flex flex-wrap gap-2" aria-label={t.aria} role="group">
      <button
        type="button"
        className={btn}
        data-track="share_native"
        onClick={async () => {
          if (navigator.share) {
            try {
              await navigator.share({ title, url });
            } catch {
              /* dismissed */
            }
          } else {
            await navigator.clipboard?.writeText(url);
            setCopied(true);
          }
        }}
      >
        <Share2 className="size-4" aria-hidden /> {t.share}
      </button>
      <a className={btn} href={`https://wa.me/?text=${enc(`${title} ${url}`)}`} target="_blank" rel="noopener noreferrer" data-track="share_whatsapp">
        <MessageCircle className="size-4" aria-hidden /> WhatsApp
      </a>
      <a className={btn} href={`https://www.linkedin.com/sharing/share-offsite/?url=${enc(url)}`} target="_blank" rel="noopener noreferrer" data-track="share_linkedin">
        <Linkedin className="size-4" aria-hidden /> LinkedIn
      </a>
      <button
        type="button"
        className={btn}
        data-track="share_copy"
        onClick={async () => {
          await navigator.clipboard?.writeText(url);
          setCopied(true);
          setTimeout(() => setCopied(false), 2000);
        }}
      >
        {copied ? <Check className="size-4 text-neon-500" aria-hidden /> : <Link2 className="size-4" aria-hidden />}
        <span aria-live="polite">{copied ? t.copied : t.copy}</span>
      </button>
    </div>
  );
}
