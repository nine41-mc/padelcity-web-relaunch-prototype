"use client";

import { useEffect, useRef, useState } from "react";
import { Briefcase } from "lucide-react";
import type { Locale } from "@/lib/i18n/config";

/**
 * Open positions straight from Personio (decision 2026-10: the jobs page itself is static Contentful content,
 * only this section is the Personio career page, embedded like apploft.de/karriere/#jobs).
 *
 * Personio's career page posts ["setHeight", px] to the parent → the iframe grows with its content (no inner scrollbar).
 * URL per environment: NEXT_PUBLIC_PERSONIO_URL, e.g. "https://<company>.jobs.personio.de/".
 * TODO(content): Personio subdomain of PadelCity · career page colours/logo in Personio (Settings → Career page) ·
 * check with the CMP whether the embedded page sets cookies (then load it only after consent).
 */
const PERSONIO_URL = process.env.NEXT_PUBLIC_PERSONIO_URL ?? "";

// Personio career pages come in these languages; Polish visitors get the English page.
const PERSONIO_LANGUAGE: Record<Locale, string> = { de: "de", en: "en", pl: "en" };

export function PersonioJobs({
  locale,
  title,
  placeholder,
}: {
  locale: Locale;
  /** iframe title for screen readers, e.g. "Offene Stellen bei PadelCity (Personio)" */
  title: string;
  placeholder: { title: string; text: string };
}) {
  const frame = useRef<HTMLIFrameElement>(null);
  const [height, setHeight] = useState(900);

  useEffect(() => {
    if (!PERSONIO_URL) return;
    const allowed = new URL(PERSONIO_URL).origin;
    const onMessage = (e: MessageEvent) => {
      // only Personio may resize the frame
      if (e.origin !== allowed || e.source !== frame.current?.contentWindow) return;
      const [name, value] = Array.isArray(e.data) ? e.data : [];
      if (name === "setHeight" && Number.isFinite(Number(value))) setHeight(Math.max(300, Number(value)));
    };
    window.addEventListener("message", onMessage);
    return () => window.removeEventListener("message", onMessage);
  }, []);

  if (!PERSONIO_URL) {
    return (
      <div className="grid place-items-center gap-4 rounded-[24px] border border-dashed border-white/25 bg-ink-700/60 px-6 py-16 text-center">
        <span className="grid size-14 place-items-center rounded-full bg-brand-gradient" aria-hidden>
          <Briefcase className="size-6" />
        </span>
        <p className="font-display text-3xl font-extrabold italic uppercase leading-none">{placeholder.title}</p>
        <p className="max-w-xl text-white/70">{placeholder.text}</p>
      </div>
    );
  }

  const src = new URL(PERSONIO_URL);
  src.searchParams.set("language", PERSONIO_LANGUAGE[locale]);

  return (
    // Personio renders its own (light) career page – framed as a card so it sits calmly on the dark site
    <div className="overflow-hidden rounded-[24px] border border-white/10 bg-white">
      <iframe
        ref={frame}
        src={src.toString()}
        title={title}
        loading="lazy"
        style={{ height }}
        className="block w-full border-0"
      />
    </div>
  );
}
