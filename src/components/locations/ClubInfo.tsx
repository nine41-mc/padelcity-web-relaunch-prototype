"use client";

import { useState } from "react";
import { Info, MapPin } from "lucide-react";
import { Overlay } from "@/components/ui/Overlay";

type Block = { heading?: string; lines: string[]; bullets: string[] };

/**
 * Splits the club description (Contentful rich text, kept as plain lines) into blocks: a line ending in ":" starts a
 * new block with that heading ("Allgemeine Hinweise:"), "•"/"-" lines become list items, the rest stays text.
 */
function blocks(text: string): Block[] {
  const out: Block[] = [];
  let cur: Block = { lines: [], bullets: [] };
  for (const raw of text.split("\n")) {
    const line = raw.trim();
    if (!line) continue;
    const bullet = line.match(/^[•\-–*]\s*(.+)$/);
    if (bullet) cur.bullets.push(bullet[1]);
    else if (line.endsWith(":") && line.length <= 60) {
      if (cur.heading || cur.lines.length || cur.bullets.length) out.push(cur);
      cur = { heading: line.slice(0, -1), lines: [], bullets: [] };
    } else cur.lines.push(line);
  }
  if (cur.heading || cur.lines.length || cur.bullets.length) out.push(cur);
  return out;
}

/**
 * "Info" button next to "Teilen" in the club head: the club description opens in the shared overlay
 * (club photo left, notes right) instead of sitting half-cut next to the title.
 */
export function ClubInfo({
  title,
  text,
  address,
  image,
  label,
  closeLabel,
}: {
  title: string;
  text: string;
  address: string;
  image?: string;
  label: string;
  closeLabel: string;
}) {
  const [open, setOpen] = useState(false);
  if (!text.trim()) return null;
  return (
    <>
      <button
        type="button"
        onClick={() => setOpen(true)}
        aria-haspopup="dialog"
        data-track="club_info_open"
        className="inline-flex min-h-11 shrink-0 items-center gap-2 rounded-full border border-white/30 px-4 text-sm font-semibold text-white transition hover:border-transparent hover:bg-brand-gradient"
      >
        <Info className="size-4" aria-hidden /> {label}
      </button>
      <Overlay
        open={open}
        onClose={() => setOpen(false)}
        title={title}
        meta={
          <p className="flex items-center gap-1.5">
            <MapPin className="size-3.5 shrink-0" aria-hidden /> {address}
          </p>
        }
        image={image}
        imageAlt={title}
        closeLabel={closeLabel}
      >
        {blocks(text).map((b, i) => (
          <section key={i} className="mt-8 text-[15px] leading-relaxed text-fg/80 md:text-base">
            {b.heading && <h3 className="mb-3 text-[13px] font-semibold uppercase tracking-[0.14em] text-fg/60">{b.heading}</h3>}
            {b.lines.map((l, j) => (
              <p key={j} className="mt-2 first:mt-0">
                {l}
              </p>
            ))}
            {b.bullets.length > 0 && (
              <ul className="mt-2 grid gap-2 first:mt-0">
                {b.bullets.map((l, j) => (
                  <li key={j} className="flex gap-3">
                    <span className="mt-[0.6em] size-1.5 shrink-0 rounded-full bg-magenta-500" aria-hidden />
                    <span>{l}</span>
                  </li>
                ))}
              </ul>
            )}
          </section>
        ))}
      </Overlay>
    </>
  );
}
