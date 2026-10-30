"use client";

import { useEffect, useRef, useState } from "react";
import { Briefcase } from "lucide-react";
import type { Locale } from "@/lib/i18n/config";
import type { PersonioLang } from "@/lib/content/jobs";
import { PersonioPreview } from "./PersonioPreview";

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
    // Until PadelCity's Personio URL is set: the published roles in the Personio look (PersonioPreview)
    return (
      <div>
        <PersonioPreview initialLang={PERSONIO_LANGUAGE[locale] as PersonioLang} />
        <p className="mt-3 flex items-start gap-2 text-sm text-fg/60">
          <Briefcase className="mt-0.5 size-4 shrink-0" aria-hidden />
          <span>
            <span className="font-semibold text-fg/80">{placeholder.title}.</span> {placeholder.text}
          </span>
        </p>
      </div>
    );
  }

  const src = new URL(PERSONIO_URL);
  src.searchParams.set("language", PERSONIO_LANGUAGE[locale]);

  return (
    // Personio renders its own (light) career page – framed as a card so it sits calmly on the dark site
    <div className="overflow-hidden rounded-[24px] border border-fg/10 bg-white">
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
