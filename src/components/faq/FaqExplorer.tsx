"use client";

import { useDeferredValue, useId, useMemo, useState } from "react";
import { BadgePercent, CalendarDays, CircleUser, CreditCard, Dumbbell, Info, Lock, MapPin, MessageCircleQuestionMark, RotateCcw, Users, type LucideIcon } from "lucide-react";
import type { FaqCategory, FaqContent } from "@/lib/content/faq";
import { cn } from "@/components/ui/cn";
import { SearchInput } from "@/components/ui/SearchInput";
import { FaqGroup, FaqItem } from "@/components/ui/FaqItem";

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
          <label htmlFor={searchId} className="mb-2 block text-[13px] font-semibold uppercase tracking-[0.14em] text-fg/70">
            {labels.searchLabel}
          </label>
          <SearchInput id={searchId} value={query} onChange={setQuery} placeholder={labels.searchPlaceholder} clearLabel={labels.clear} />
        </div>
        <p className="text-sm text-fg/70" aria-live="polite" aria-atomic="true">
          {status}
        </p>
      </div>

      <div className="mt-8 grid gap-8 md:mt-10 lg:grid-cols-[260px_1fr] lg:gap-12">
        {/* Topic chips (anchors) – horizontal scroller on phones, sticky list on desktop */}
        <nav aria-label={labels.categoriesLabel} className="min-w-0 lg:sticky lg:top-28 lg:self-start">
          <p className="mb-3 hidden text-[13px] font-semibold uppercase tracking-[0.14em] text-fg/60 lg:block">{labels.categoriesLabel}</p>
          <ul className="-mx-4 flex gap-2 overflow-x-auto px-4 pb-1 scrollbar-none md:-mx-8 md:px-8 lg:mx-0 lg:flex-col lg:overflow-visible lg:px-0">
            {filtered.map((c) => {
              const Icon = ICONS[c.icon] ?? MessageCircleQuestionMark;
              return (
                <li key={c.id} className="shrink-0">
                  <a
                    href={`#faq-${c.id}`}
                    className="group inline-flex min-h-11 items-center gap-2 whitespace-nowrap rounded-full border border-fg/20 bg-fg/5 px-4 text-sm font-semibold text-fg/85 transition hover:border-fg/60 hover:text-fg lg:w-full lg:justify-between lg:whitespace-normal lg:rounded-2xl lg:py-2"
                  >
                    <span className="inline-flex items-center gap-2">
                      <Icon className="size-4 shrink-0 text-fg" aria-hidden />
                      {c.title}
                    </span>
                    <span className="text-xs font-medium text-fg/50 tabular-nums">{c.items.length}</span>
                  </a>
                </li>
              );
            })}
          </ul>
        </nav>

        {/* Questions */}
        <div className="min-w-0">
          {filtered.length === 0 ? (
            <div className="grid place-items-center gap-4 rounded-[28px] border border-dashed border-fg/20 pad-banner text-center">
              <p className="font-display text-3xl font-extrabold uppercase italic leading-none md:text-4xl">{labels.emptyTitle}</p>
              <p className="max-w-md text-fg/70">{labels.emptyText}</p>
              <button
                type="button"
                onClick={() => setQuery("")}
                className="inline-flex h-11 items-center gap-2 rounded-full bg-fg px-5 text-sm font-semibold text-fg-inverse transition hover:shadow-glow"
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
                    <FaqGroup>
                      {c.items.map((i) => (
                        <FaqItem key={i.id} id={`faq-q-${i.id}`} question={i.q} defaultOpen={Boolean(q) && total <= 3}>
                          {i.html ? (
                            <div
                              className={cn(
                                "[&_p+p]:mt-3 [&_ul]:mt-3 [&_ul]:list-disc [&_ul]:pl-5 [&_ol]:mt-3 [&_ol]:list-decimal [&_ol]:pl-5 [&_li]:mt-1",
                                "[&_a]:font-medium [&_a]:text-fg [&_a]:underline [&_a]:underline-offset-4 hover:[&_a]:text-accent-fg [&_strong]:text-fg [&_a]:break-words",
                              )}
                              // Sanitised server-side (allow-list) in src/lib/data/faq.ts
                              dangerouslySetInnerHTML={{ __html: i.html }}
                            />
                          ) : (
                            <p>{i.a}</p>
                          )}
                        </FaqItem>
                      ))}
                    </FaqGroup>
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
