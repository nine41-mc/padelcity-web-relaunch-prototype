"use client";

import { useState } from "react";
import type { Hub, MagazinArticle } from "@/lib/content/magazin";
import { cn } from "../ui/cn";

// Contentful module: contentHubs (article list filtered by hub)

/**
 * Hub filter + article grid. Cards are rendered on the server and passed in as a map
 * (slug → card) so this client component only handles filtering.
 */
export function MagazinHub({
  hubs,
  articles,
  cards,
  t,
}: {
  t: { aria: string; all: string; count: string };
  hubs: { id: Hub; label: string; text: string }[];
  articles: Pick<MagazinArticle, "slug" | "hub">[];
  cards: Record<string, React.ReactNode>;
}) {
  const [hub, setHub] = useState<Hub | "alle">("alle");
  const list = articles.filter((a) => hub === "alle" || a.hub === hub);
  const active = hubs.find((h) => h.id === hub);

  return (
    <div>
      <div role="group" aria-label={t.aria} className="scrollbar-none -mx-4 flex gap-2 overflow-x-auto px-4 md:mx-0 md:flex-wrap md:px-0">
        {[{ id: "alle" as const, label: t.all }, ...hubs].map((h) => (
          <button
            key={h.id}
            type="button"
            aria-pressed={hub === h.id}
            onClick={() => setHub(h.id)}
            data-track="magazin_filter"
            className={cn(
              "h-11 shrink-0 rounded-full border px-5 font-display text-lg italic uppercase transition-colors",
              hub === h.id ? "border-transparent bg-brand-gradient text-white" : "border-fg/20 text-fg/80 hover:border-fg/50",
            )}
          >
            {h.label}
          </button>
        ))}
      </div>
      <p className="mt-4 min-h-6 text-sm text-fg/70" aria-live="polite">
        {active ? active.text : t.count.replace("{n}", String(list.length))}
      </p>
      <ul className="mt-6 grid gap-4 md:grid-cols-2 md:gap-5 lg:grid-cols-3">
        {list.map((a) => (
          <li key={a.slug}>{cards[a.slug]}</li>
        ))}
      </ul>
    </div>
  );
}
