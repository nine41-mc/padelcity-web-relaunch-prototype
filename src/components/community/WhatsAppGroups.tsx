"use client";

import { useLayoutEffect, useMemo, useRef, useState } from "react";
import { ArrowUpRight, MessageCircle } from "lucide-react";
import type { Locale } from "@/lib/i18n/config";
import { whatsappByCity } from "@/lib/content/whatsapp";
import { Button } from "@/components/ui/Button";
import { cn } from "@/components/ui/cn";
import { Overlay } from "@/components/ui/Overlay";
import { SearchInput } from "@/components/ui/SearchInput";

const copy = {
  de: {
    title: "WhatsApp-Community",
    text: "Jeder Standort hat seine eigene Gruppe: Mitspieler:innen finden, spontane Matches, News aus dem Club.",
    search: "Stadt suchen",
    join: "Beitreten",
    channel: "Kanal",
    close: "Schließen",
    clear: "Suche löschen",
    empty: "Für diese Stadt gibt es noch keine Gruppe.",
  },
  en: {
    title: "WhatsApp community",
    text: "Every location has its own group: find players, spontaneous matches, news from the club.",
    search: "Search city",
    join: "Join",
    channel: "Channel",
    close: "Close",
    clear: "Clear search",
    empty: "There's no group for this city yet.",
  },
  pl: {
    title: "Społeczność WhatsApp",
    text: "Każda lokalizacja ma własną grupę: znajdź partnerów do gry, spontaniczne mecze i newsy z klubu.",
    search: "Szukaj miasta",
    join: "Dołącz",
    channel: "Kanał",
    close: "Zamknij",
    clear: "Wyczyść wyszukiwanie",
    empty: "Dla tego miasta nie ma jeszcze grupy.",
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
 * City name on one line: long names ("Andernach & Mülheim-Kärlich") step down from 16 to 13 px
 * instead of wrapping, so every tile keeps the same height. Below 13 px it wraps after all.
 */
function CityName({ name }: { name: string }) {
  const ref = useRef<HTMLSpanElement>(null);
  const [fit, setFit] = useState({ px: 16, wrap: false });
  useLayoutEffect(() => {
    const el = ref.current;
    if (!el) return;
    const measure = () => {
      if (!el.clientWidth) return; // dialog still closed – measure once it opens
      let px = 16;
      el.style.whiteSpace = "nowrap";
      el.style.fontSize = `${px}px`;
      while (px > 13 && el.scrollWidth > el.clientWidth) el.style.fontSize = `${--px}px`;
      const fits = el.scrollWidth <= el.clientWidth;
      el.style.whiteSpace = "";
      setFit((f) => (f.px === px && f.wrap === !fits ? f : { px, wrap: !fits }));
    };
    measure();
    const ro = new ResizeObserver(measure);
    ro.observe(el.parentElement ?? el); // the row's width, not the name's – that one changes with the font
    return () => ro.disconnect();
  }, [name]);
  return (
    <span ref={ref} style={{ fontSize: fit.px }} className={cn("min-w-0 font-semibold", fit.wrap ? "whitespace-normal" : "whitespace-nowrap")}>
      {name}
    </span>
  );
}

/**
 * Trigger + overlay listing the direct WhatsApp link of every location.
 * Shared overlay design (image left, list right).
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
  const [open, setOpen] = useState(false);
  const [q, setQ] = useState("");
  const all = useMemo(() => groups(locale), [locale]);
  const norm = (s: string) => s.toLocaleLowerCase(locale).normalize("NFD").replace(/[̀-ͯ]/g, "");
  const list = all.filter((g) => !q || norm(g.city).includes(norm(q.trim())));

  return (
    <>
      <Button type="button" variant={variant} size={size} className={className} data-track={track} aria-haspopup="dialog" onClick={() => setOpen(true)}>
        {label}
      </Button>
      <Overlay
        open={open}
        onClose={() => {
          setOpen(false);
          setQ("");
        }}
        title={t.title}
        meta={<p className="md:text-base">{t.text}</p>}
        image="/images/events/social-1.jpg"
        imageAlt=""
        badge={
          <>
            <MessageCircle className="size-4" aria-hidden />
            <span className="font-display text-base font-extrabold uppercase italic leading-none tracking-[0.06em]">WhatsApp</span>
          </>
        }
        closeLabel={t.close}
      >
      <div className="mt-6">
        <SearchInput value={q} onChange={setQ} placeholder={t.search} ariaLabel={t.search} clearLabel={t.clear} />
      </div>

      <ul className="mt-4 grid gap-2 sm:grid-cols-2">
        {list.map((g) => (
          <li key={g.city}>
            <a
              href={g.url}
              target="_blank"
              rel="noopener noreferrer"
              data-track="whatsapp_group_join"
              className="group flex min-h-14 items-center gap-3 rounded-[16px] border border-white/10 bg-white/[0.03] px-4 py-3 transition-colors hover:border-white/40 hover:bg-white/[0.06]"
            >
              <span className="flex min-w-0 flex-1 items-center gap-2">
                <CityName name={g.city} />
                {g.channel && <span className="shrink-0 rounded-md border border-white/35 px-1.5 py-0.5 text-[11px] font-semibold uppercase tracking-[0.08em] text-white/80">{t.channel}</span>}
              </span>
              <span className="inline-flex shrink-0 items-center gap-1.5 text-sm font-semibold text-white group-hover:text-magenta-300">
                {t.join}
                <ArrowUpRight className="size-4 transition-transform group-hover:rotate-45" aria-hidden />
              </span>
            </a>
          </li>
        ))}
        {list.length === 0 && <li className={cn("col-span-full py-6 text-center text-white/70")}>{t.empty}</li>}
      </ul>
      </Overlay>
    </>
  );
}
