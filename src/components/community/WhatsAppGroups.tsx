"use client";

import { useEffect, useId, useMemo, useRef, useState } from "react";
import { ArrowUpRight, MessageCircle, Search, X } from "lucide-react";
import type { Locale } from "@/lib/i18n/config";
import { whatsappByCity } from "@/lib/content/whatsapp";
import { Button } from "@/components/ui/Button";
import { cn } from "@/components/ui/cn";

const copy = {
  de: {
    title: "WhatsApp-Community",
    text: "Jeder Standort hat seine eigene Gruppe: Mitspieler:innen finden, spontane Matches, News aus dem Club.",
    search: "Stadt suchen",
    join: "Beitreten",
    channel: "Kanal",
    close: "Schließen",
    empty: "Für diese Stadt gibt es noch keine Gruppe.",
  },
  en: {
    title: "WhatsApp community",
    text: "Every location has its own group: find players, spontaneous matches, news from the club.",
    search: "Search city",
    join: "Join",
    channel: "Channel",
    close: "Close",
    empty: "There's no group for this city yet.",
  },
};

type Group = { city: string; url: string; channel: boolean };

/** One entry per city, alphabetical; a shared group names the city first, then its partners ("Mülheim-Kärlich & Andernach"). */
function groups(locale: Locale): Group[] {
  const entries = Object.entries(whatsappByCity);
  return entries
    .map(([city, url]) => ({
      city: [city, ...entries.filter(([c, u]) => u === url && c !== city).map(([c]) => c)].join(" & "),
      url,
      channel: url.includes("/channel/"),
    }))
    .sort((a, b) => a.city.localeCompare(b.city, locale));
}

/**
 * Trigger + overlay listing the direct WhatsApp link of every location.
 * Native <dialog>: focus trap, Esc and backdrop handling come from the browser.
 */
export function WhatsAppGroups({
  locale,
  label,
  variant = "gradient",
  size = "md",
  className,
  track = "whatsapp_overlay_open",
}: {
  locale: Locale;
  label: string;
  variant?: "primary" | "gradient" | "outline";
  size?: "sm" | "md" | "lg";
  className?: string;
  track?: string;
}) {
  const t = copy[locale];
  const ref = useRef<HTMLDialogElement>(null);
  const [q, setQ] = useState("");
  const titleId = useId();
  const all = useMemo(() => groups(locale), [locale]);
  const norm = (s: string) => s.toLocaleLowerCase(locale).normalize("NFD").replace(/[̀-ͯ]/g, "");
  const list = all.filter((g) => !q || norm(g.city).includes(norm(q.trim())));

  useEffect(() => {
    const d = ref.current;
    if (!d) return;
    const onClose = () => setQ("");
    d.addEventListener("close", onClose);
    return () => d.removeEventListener("close", onClose);
  }, []);

  return (
    <>
      <Button type="button" variant={variant} size={size} className={className} data-track={track} aria-haspopup="dialog" onClick={() => ref.current?.showModal()}>
        {label}
      </Button>
      <dialog
        ref={ref}
        aria-labelledby={titleId}
        onClick={(e) => {
          if (e.target === ref.current) ref.current.close(); // click on the backdrop
        }}
        className="m-auto max-h-[min(88vh,820px)] w-[min(100vw-32px,760px)] overflow-hidden rounded-[28px] border border-white/15 bg-ink-700 p-0 text-white shadow-elevated backdrop:bg-black/70 backdrop:backdrop-blur-sm"
      >
        <div className="flex max-h-[inherit] flex-col">
          <div className="flex items-start gap-4 border-b border-white/10 p-5 md:p-7">
            <span className="grid size-12 shrink-0 place-items-center rounded-full bg-brand-gradient" aria-hidden>
              <MessageCircle className="size-6" />
            </span>
            <div className="min-w-0 flex-1">
              <h2 id={titleId} className="font-display text-3xl font-extrabold italic uppercase leading-none md:text-4xl">
                {t.title}
              </h2>
              <p className="mt-2 text-sm text-white/75 md:text-base">{t.text}</p>
            </div>
            <button type="button" onClick={() => ref.current?.close()} aria-label={t.close} className="grid size-11 shrink-0 place-items-center rounded-full bg-white/10 hover:bg-white/15">
              <X className="size-5" aria-hidden />
            </button>
          </div>

          <div className="px-5 pt-4 md:px-7">
            <label className="flex min-h-12 items-center gap-3 rounded-full border border-white/40 bg-ink-800 px-4 focus-within:border-white">
              <Search className="size-5 shrink-0 text-white/70" aria-hidden />
              <input
                type="search"
                value={q}
                onChange={(e) => setQ(e.target.value)}
                placeholder={t.search}
                aria-label={t.search}
                className="w-full bg-transparent text-base text-white placeholder:text-white/60 focus:outline-none"
              />
            </label>
          </div>

          <ul className="grid flex-1 gap-2 overflow-y-auto overscroll-contain p-5 sm:grid-cols-2 md:p-7 md:pt-5">
            {list.map((g) => (
              <li key={g.city}>
                <a
                  href={g.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  data-track="whatsapp_group_join"
                  className="group flex min-h-14 items-center gap-3 rounded-[16px] border border-white/10 bg-white/[0.03] px-4 py-3 transition-colors hover:border-white/40 hover:bg-white/[0.06]"
                >
                  <span className="min-w-0 flex-1">
                    <span className="flex flex-wrap items-center gap-x-2 gap-y-1 font-semibold">
                      {g.city}
                      {g.channel && <span className="rounded-md border border-white/35 px-1.5 py-0.5 text-[11px] font-semibold uppercase tracking-[0.08em] text-white/80">{t.channel}</span>}
                    </span>
                  </span>
                  <span className="inline-flex items-center gap-1.5 text-sm font-semibold text-white group-hover:text-magenta-300">
                    {t.join}
                    <ArrowUpRight className="size-4 transition-transform group-hover:rotate-45" aria-hidden />
                  </span>
                </a>
              </li>
            ))}
            {list.length === 0 && <li className={cn("col-span-full py-6 text-center text-white/70")}>{t.empty}</li>}
          </ul>
        </div>
      </dialog>
    </>
  );
}
