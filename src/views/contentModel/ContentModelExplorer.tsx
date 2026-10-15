"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import { ChevronDown } from "lucide-react";
import type { Locale } from "@/lib/i18n/config";
import { href } from "@/lib/i18n/routes";
import type { Field, PageType, Source } from "@/lib/content/contentModel.types";
import { cn } from "@/components/ui/cn";

export const SOURCES: { id: Source; label: string; short: string; text: string; chip: string; dot: string }[] = [
  { id: "api", label: "API · vorhanden", short: "API", text: "Liefert die API heute schon (Endpunkt + Feld vorhanden).", chip: "border-emerald-400/50 bg-emerald-400/10 text-emerald-200", dot: "bg-emerald-400" },
  { id: "apiExtend", label: "API · erweitern", short: "API +", text: "Soll aus der API kommen, die API muss dafür erweitert werden (Feld fehlt oder ist nicht freigegeben).", chip: "border-amber-400/60 bg-amber-400/10 text-amber-200", dot: "bg-amber-400" },
  { id: "cms", label: "Neuer Contentful-Space", short: "CTFL", text: "Website-exklusive Inhalte im zweiten Contentful-Space.", chip: "border-magenta-400/60 bg-magenta-500/15 text-magenta-200", dot: "bg-magenta-400" },
  { id: "external", label: "Externer Dienst", short: "Extern", text: "Drittanbieter, z. B. Personio, Google, YouTube, Instagram, App Stores, Link-Service.", chip: "border-sky-400/50 bg-sky-400/10 text-sky-200", dot: "bg-sky-400" },
  { id: "unknown", label: "Unklar", short: "?", text: "Quelle noch nicht entschieden.", chip: "border-dashed border-white/40 bg-white/5 text-white/80", dot: "bg-white/50" },
];
const byId = Object.fromEntries(SOURCES.map((s) => [s.id, s])) as Record<Source, (typeof SOURCES)[number]>;

const count = (fields: Field[]) => {
  const c: Record<Source, number> = { api: 0, apiExtend: 0, cms: 0, external: 0, unknown: 0 };
  for (const f of fields) c[f.source]++;
  return c;
};

export function SourceChip({ source, className }: { source: Source; className?: string }) {
  const s = byId[source];
  return <span className={cn("inline-flex items-center whitespace-nowrap rounded-full border px-2.5 py-0.5 text-xs font-semibold", s.chip, className)}>{s.label}</span>;
}

export function ContentModelExplorer({ pages, locale }: { pages: PageType[]; locale: Locale }) {
  const [active, setActive] = useState<Set<Source>>(new Set());
  const [open, setOpen] = useState<Set<string>>(new Set());
  const show = (f: Field) => active.size === 0 || active.has(f.source);
  const all = useMemo(() => pages.flatMap((p) => p.modules.flatMap((m) => m.fields)), [pages]);
  const total = count(all);

  const toggle = (s: Source) =>
    setActive((prev) => {
      const next = new Set(prev);
      if (next.has(s)) next.delete(s);
      else next.add(s);
      return next;
    });
  const toggleOpen = (id: string) =>
    setOpen((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });

  return (
    <div className="space-y-12">
      {/* Legend = filter */}
      <div>
        <h2 className="text-[13px] font-semibold uppercase tracking-[0.14em] text-white/70">Herkunft der Daten · zum Filtern antippen</h2>
        <ul className="mt-4 grid gap-3 sm:grid-cols-2 lg:grid-cols-5">
          {SOURCES.map((s) => {
            const on = active.has(s.id);
            return (
              <li key={s.id}>
                <button
                  type="button"
                  aria-pressed={on}
                  onClick={() => toggle(s.id)}
                  className={cn(
                    "flex h-full w-full flex-col gap-2 rounded-[18px] border p-4 text-left transition-colors",
                    on ? "border-white bg-white/10" : "border-white/10 bg-ink-700 hover:border-white/40",
                  )}
                >
                  <span className="flex items-center justify-between gap-2">
                    <span className="flex items-center gap-2 font-semibold">
                      <span className={cn("size-2.5 rounded-full", s.dot)} aria-hidden />
                      {s.label}
                    </span>
                    <span className="font-display text-2xl font-extrabold italic leading-none">{total[s.id]}</span>
                  </span>
                  <span className="text-sm text-white/65">{s.text}</span>
                </button>
              </li>
            );
          })}
        </ul>
        {active.size > 0 && (
          <button type="button" onClick={() => setActive(new Set())} className="mt-3 min-h-11 text-sm font-semibold text-magenta-300 hover:text-white">
            Filter zurücksetzen
          </button>
        )}
      </div>

      {/* Overview matrix: page type × source */}
      <div>
        <h2 className="text-[13px] font-semibold uppercase tracking-[0.14em] text-white/70">Übersicht pro Seitentyp</h2>
        <div className="mt-4 overflow-x-auto rounded-[20px] border border-white/10">
          <table className="w-full min-w-[640px] border-collapse text-sm">
            <caption className="sr-only">Anzahl der Felder je Seitentyp und Herkunft</caption>
            <thead>
              <tr className="border-b border-white/10 bg-ink-700 text-left">
                <th scope="col" className="px-4 py-3 font-semibold">Seitentyp</th>
                {SOURCES.map((s) => (
                  <th key={s.id} scope="col" className="px-3 py-3 text-right font-semibold">
                    <span className="inline-flex items-center gap-1.5">
                      <span className={cn("size-2 rounded-full", s.dot)} aria-hidden />
                      {s.short}
                    </span>
                  </th>
                ))}
                <th scope="col" className="w-[28%] px-4 py-3 font-semibold">Verteilung</th>
              </tr>
            </thead>
            <tbody>
              {pages.map((p) => {
                const fields = p.modules.flatMap((m) => m.fields);
                const c = count(fields);
                return (
                  <tr key={p.id} className="border-b border-white/10 last:border-0">
                    <th scope="row" className="px-4 py-2.5 text-left font-medium">
                      <a href={`#pt-${p.id}`} onClick={() => setOpen((o) => new Set(o).add(p.id))} className="hover:text-magenta-300">
                        {p.name}
                      </a>
                    </th>
                    {SOURCES.map((s) => (
                      <td key={s.id} className={cn("px-3 py-2.5 text-right tabular-nums", c[s.id] ? "text-white" : "text-white/30")}>
                        {c[s.id]}
                      </td>
                    ))}
                    <td className="px-4 py-2.5">
                      <span className="flex h-2.5 overflow-hidden rounded-full bg-white/5" aria-hidden>
                        {SOURCES.map((s) => (c[s.id] ? <span key={s.id} className={s.dot} style={{ width: `${(c[s.id] / fields.length) * 100}%` }} /> : null))}
                      </span>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

      {/* Page types → modules → fields */}
      <div>
        <div className="flex flex-wrap items-center justify-between gap-3">
          <h2 className="text-[13px] font-semibold uppercase tracking-[0.14em] text-white/70">Seitentypen & Module</h2>
          <button
            type="button"
            onClick={() => setOpen(open.size === pages.length ? new Set() : new Set(pages.map((p) => p.id)))}
            className="min-h-11 rounded-full border border-white/30 px-4 text-sm font-semibold hover:border-white"
          >
            {open.size === pages.length ? "Alle zuklappen" : "Alle aufklappen"}
          </button>
        </div>
        <ul className="mt-4 space-y-3">
          {pages.map((p) => {
            const isOpen = open.has(p.id);
            const fields = p.modules.flatMap((m) => m.fields);
            const c = count(fields);
            const visibleModules = p.modules.filter((m) => m.fields.some(show));
            if (!visibleModules.length) return null;
            return (
              <li key={p.id} id={`pt-${p.id}`} className="scroll-mt-28 rounded-[20px] border border-white/10 bg-ink-700">
                <h3>
                  <button
                    type="button"
                    aria-expanded={isOpen}
                    aria-controls={`pt-body-${p.id}`}
                    onClick={() => toggleOpen(p.id)}
                    className="flex w-full flex-wrap items-center gap-x-4 gap-y-2 px-5 py-4 text-left md:px-6"
                  >
                    <span className="font-display text-2xl font-extrabold italic uppercase leading-none md:text-3xl">{p.name}</span>
                    <span className="font-mono text-xs text-white/55">{p.path}</span>
                    <span className="ml-auto flex items-center gap-3">
                      <span className="hidden gap-1.5 sm:flex" aria-hidden>
                        {SOURCES.map((s) => (c[s.id] ? <span key={s.id} className={cn("rounded-full px-2 py-0.5 text-xs font-semibold", byId[s.id].chip)}>{c[s.id]}</span> : null))}
                      </span>
                      <ChevronDown className={cn("size-5 transition-transform", isOpen && "rotate-180")} aria-hidden />
                    </span>
                  </button>
                </h3>
                {isOpen && (
                  <div id={`pt-body-${p.id}`} className="border-t border-white/10 px-5 pb-6 pt-4 md:px-6">
                    {p.text && <p className="max-w-3xl text-white/70">{p.text}</p>}
                    <div className="mt-4 grid gap-4 xl:grid-cols-2">
                      {visibleModules.map((m) => (
                        <section key={m.id} className="rounded-[16px] border border-white/10 bg-ink-800/60 p-4" aria-labelledby={`m-${p.id}-${m.id}`}>
                          <h4 id={`m-${p.id}-${m.id}`} className="flex flex-wrap items-baseline gap-x-3 gap-y-1">
                            <span className="text-lg font-semibold">{m.name}</span>
                            <code className="text-xs text-white/50">{m.id}</code>
                          </h4>
                          {m.text && <p className="mt-1 text-sm text-white/65">{m.text}</p>}
                          <ul className="mt-3 divide-y divide-white/5">
                            {m.fields.filter(show).map((f) => (
                              <li key={f.name} className="grid gap-1 py-2 sm:grid-cols-[minmax(0,1fr)_auto] sm:gap-3">
                                <div className="min-w-0">
                                  <p className="text-sm font-medium">{f.name}</p>
                                  {(f.ref || f.note) && (
                                    <p className="text-xs text-white/55">
                                      {f.ref && <code className="text-white/70">{f.ref}</code>}
                                      {f.ref && f.note && " · "}
                                      {f.note}
                                    </p>
                                  )}
                                </div>
                                <SourceChip source={f.source} className="w-fit sm:self-start" />
                              </li>
                            ))}
                          </ul>
                        </section>
                      ))}
                    </div>
                  </div>
                )}
              </li>
            );
          })}
        </ul>
      </div>
      <p className="text-sm text-white/50">
        Seiten im Prototyp: <Link href={href(locale, "home")} className="underline hover:text-white">Startseite</Link> · Quelle dieser Übersicht: <code>src/lib/content/contentModel.ts</code>
      </p>
    </div>
  );
}
