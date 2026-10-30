"use client";

import { useState } from "react";
import { Check, Share2 } from "lucide-react";
import type { Locale } from "@/lib/i18n/config";
import { getDictionary } from "@/lib/i18n/dictionaries";
import { cn } from "./cn";

/**
 * One share button for clubs, events and articles: the phone's share sheet (WhatsApp, Messages … – one tap),
 * on desktop without a share sheet it copies the link and confirms. Shares the current page URL without hash.
 */
export function ShareButton({ title, locale, track, className }: { title: string; locale: Locale; track: string; className?: string }) {
  const t = getDictionary(locale).share;
  const [copied, setCopied] = useState(false);
  return (
    <button
      type="button"
      data-track={track}
      onClick={async () => {
        const url = window.location.href.split("#")[0];
        if (navigator.share) {
          try {
            await navigator.share({ title, url });
          } catch {
            /* dismissed */
          }
          return;
        }
        try {
          await navigator.clipboard?.writeText(url);
        } catch {
          return; // clipboard blocked (permission, insecure context) – nothing to confirm
        }
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
      }}
      className={cn(
        "inline-flex min-h-11 shrink-0 items-center gap-2 rounded-full border border-fg/25 px-4 text-sm font-semibold text-fg transition hover:border-transparent hover:bg-brand-gradient hover:text-white",
        className,
      )}
    >
      {copied ? <Check className="size-4 text-success-fg" aria-hidden /> : <Share2 className="size-4" aria-hidden />}
      <span aria-live="polite">{copied ? t.copied : t.label}</span>
    </button>
  );
}
