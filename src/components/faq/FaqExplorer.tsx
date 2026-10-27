"use client";

import { useDeferredValue, useId, useMemo, useState } from "react";
import {
  BadgePercent,
  CalendarDays,
  CircleUser,
  CreditCard,
  Dumbbell,
  Info,
  Lock,
  MapPin,
  MessageCircleQuestionMark,
  Plus,
  RotateCcw,
  Search,
  Users,
  X,
  type LucideIcon,
} from "lucide-react";
import type { FaqCategory, FaqContent } from "@/lib/content/faq";
import { cn } from "@/components/ui/cn";

const ICONS: Record<string, LucideIcon> = {
  infoCircle: Info,
  userCircle: CircleUser,
  calendar: CalendarDays,
  markerPin: MapPin,
  muscle: Dumbbell,
  users: Users,
  messageQuestionSquare: MessageCircleQuestionMark,
  lock: Lock,
  wellPass: BadgePercent,
  hansefit: BadgePercent,
  creditCard2: CreditCard,
};

const fill = (tpl: string, vars: Record<string, string | number>) => tpl.replace(/\{(\w+)\}/g, (_, k: string) => String(vars[k] ?? ""));
const norm = (s: string) => s.toLocaleLowerCase().normalize("NFD").replace(/\p{Diacritic}/gu, "");

// Contentful module: faqExplorer (sections + questions; source: app help centre via api-platform /faq)
/** Search + topic chips + native <details> accordion. Works without JS (all answers in the HTML). */
export function FaqExplorer({ categories, labels }: { categories: FaqCategory[]; labels: FaqContent["explorer"] }) {
  const [query, setQuery] = useState("");
  const deferred = useDeferredValue(query);
  const searchId = useId();
  const q = norm(deferred.trim());

  const filtered = useMemo(() => {
    if (!q) return categories;
    const terms = q.split(/\s+/);
    return categories
      .map((c) => ({
        ...c,
        items: c.items.filter((i) => {
          const hay = norm(`${i.q} ${i.a} ${c.title}`);
          return terms.every((t) => hay.includes(t));
        }),
      }))
      .filter((c) => c.items.length > 0);
  }, [categories, q]);

  const total = filtered.reduce((n, c) => n + c.items.length, 0);
  const status = q
    ? fill(total === 1 ? labels.resultsOne : labels.resultsMany, { n: total, q: deferred.trim() })
    : fill(labels.countMany, { n: total });

  return (
    <div>
      {/* Search */}
      <div className="flex flex-col gap-3 md:flex-row md:items-end md:justify-between">
        <div className="w-full md:max-w-xl">
          <label htmlFor={searchId} className="mb-2 block text-[13px] font-semibold uppercase tracking-[0.14em] text-white/70">
            {labels.searchLabel}
          </label>
          <div className="relative">
            <Search className="pointer-events-none absolute left-4 top-1/2 size-5 -translate-y-1/2 text-white/60" aria-hidden />
            <input
              id={searchId}
              type="search"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder={labels.searchPlaceholder}
              autoComplete="off"
              className="h-14 w-full rounded-full border border-white/20 bg-ink-700 pl-12 pr-14 text-base text-chalk placeholder:text-white/60 transition hover:border-white/50 focus-visible:border-white focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-white [&::-webkit-search-cancel-button]:hidden"
            />
            {query && (
              <button
                type="button"
                onClick={() => setQuery("")}
                aria-label={labels.clear}
                className="absolute right-1.5 top-1/2 grid size-11 -translate-y-1/2 place-items-center rounded-full text-white/70 transition hover:bg-white/10 hover:text-white"
              >
                <X className="size-5" aria-hidden />
              </button>
            )}
          </div>
        </div>
        <p className="text-sm text-white/70" aria-live="polite" aria-atomic="true">
          {status}
        </p>
      </div>

      <div className="mt-8 grid gap-8 md:mt-10 lg:grid-cols-[260px_1fr] lg:gap-12">
        {/* Topic chips (anchors) – horizontal scroller on phones, sticky list on desktop */}
        <nav aria-label={labels.categoriesLabel} className="min-w-0 lg:sticky lg:top-28 lg:self-start">
          <p className="mb-3 hidden text-[13px] font-semibold uppercase tracking-[0.14em] text-white/60 lg:block">{labels.categoriesLabel}</p>
          <ul className="-mx-4 flex gap-2 overflow-x-auto px-4 pb-1 scrollbar-none md:-mx-8 md:px-8 lg:mx-0 lg:flex-col lg:overflow-visible lg:px-0">
            {filtered.map((c) => {
              const Icon = ICONS[c.icon] ?? MessageCircleQuestionMark;
              return (
                <li key={c.id} className="shrink-0">
                  <a
                    href={`#faq-${c.id}`}
                    className="group inline-flex min-h-11 items-center gap-2 whitespace-nowrap rounded-full border border-white/20 bg-white/5 px-4 text-sm font-semibold text-white/85 transition hover:border-white/60 hover:text-white lg:w-full lg:justify-between lg:whitespace-normal lg:rounded-2xl lg:py-2"
                  >
                    <span className="inline-flex items-center gap-2">
                      <Icon className="size-4 shrink-0 text-white" aria-hidden />
                      {c.title}
                    </span>
                    <span className="text-xs font-medium text-white/50 tabular-nums">{c.items.length}</span>
                  </a>
                </li>
              );
            })}
          </ul>
        </nav>

        {/* Questions */}
        <div className="min-w-0">
          {filtered.length === 0 ? (
            <div className="grid place-items-center gap-4 rounded-[28px] border border-dashed border-white/20 px-6 py-16 text-center">
              <p className="font-display text-3xl font-extrabold uppercase italic leading-none md:text-4xl">{labels.emptyTitle}</p>
              <p className="max-w-md text-white/70">{labels.emptyText}</p>
              <button
                type="button"
                onClick={() => setQuery("")}
                className="inline-flex h-11 items-center gap-2 rounded-full bg-white px-5 text-sm font-semibold text-ink-800 transition hover:shadow-glow"
              >
                <RotateCcw className="size-4" aria-hidden /> {labels.reset}
              </button>
            </div>
          ) : (
            <div className="flex flex-col gap-10 md:gap-14">
              {filtered.map((c) => {
                const Icon = ICONS[c.icon] ?? MessageCircleQuestionMark;
                return (
                  <section key={c.id} id={`faq-${c.id}`} aria-labelledby={`faq-${c.id}-title`} className="scroll-mt-28">
                    <h2 id={`faq-${c.id}-title`} className="mb-4 flex items-center gap-3">
                      <span className="grid size-10 shrink-0 place-items-center rounded-full bg-brand-gradient">
                        <Icon className="size-5" aria-hidden />
                      </span>
                      <span className="font-display text-2xl font-extrabold uppercase italic leading-none tracking-tight md:text-3xl">{c.title}</span>
                    </h2>
                    <div className="divide-y divide-white/10 rounded-[20px] border border-white/10 bg-ink-700">
                      {c.items.map((i) => (
                        <details key={i.id} id={`faq-q-${i.id}`} className="group scroll-mt-28" open={Boolean(q) && total <= 3}>
                          <summary className="flex min-h-14 cursor-pointer list-none items-center justify-between gap-4 rounded-[20px] px-5 py-4 font-semibold transition hover:text-white md:px-6 md:text-lg [&::-webkit-details-marker]:hidden focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-inset focus-visible:ring-optic-500">
                            {i.q}
                            <span className="grid size-9 shrink-0 place-items-center rounded-full border border-white/20 transition-transform duration-300 group-open:rotate-45 group-open:border-transparent group-open:bg-brand-gradient group-open:text-white motion-reduce:transition-none">
                              <Plus className="size-4" aria-hidden />
                            </span>
                          </summary>
                          {i.html ? (
                            <div
                              className={cn(
                                "max-w-3xl px-5 pb-5 text-white/75 md:px-6",
                                "[&_p+p]:mt-3 [&_ul]:mt-3 [&_ul]:list-disc [&_ul]:pl-5 [&_ol]:mt-3 [&_ol]:list-decimal [&_ol]:pl-5 [&_li]:mt-1",
                                "[&_a]:font-medium [&_a]:text-white [&_a]:underline [&_a]:underline-offset-4 hover:[&_a]:text-magenta-300 [&_strong]:text-white [&_a]:break-words",
                              )}
                              // Sanitised server-side (allow-list) in src/lib/data/faq.ts
                              dangerouslySetInnerHTML={{ __html: i.html }}
                            />
                          ) : (
                            <p className="max-w-3xl px-5 pb-5 text-white/75 md:px-6">{i.a}</p>
                          )}
                        </details>
                      ))}
                    </div>
                  </section>
                );
              })}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
