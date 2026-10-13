"use client";

import { useEffect, useId, useRef } from "react";
import Link from "next/link";
import { ArrowUpRight, Clock, Mail, MapPin, Phone, X } from "lucide-react";
import type { CoachOffer, Person } from "@/lib/content/people";
import type { Locale } from "@/lib/i18n/config";
import { localeTags } from "@/lib/i18n/config";
import { Media } from "@/components/ui/Media";
import { Button } from "@/components/ui/Button";
import { cn } from "@/components/ui/cn";
import { CoachStat, DotGrid } from "./CoachCard";
import { coachClubKeys, fill, type CoachClubRef } from "./clubs";
import type { CoachLabels } from "./labels";

const FOCUSABLE = 'a[href], button:not([disabled]), input, select, textarea, [tabindex]:not([tabindex="-1"])';

// Contentful module: coach (detail: contact + coachTrainingTime offer)
/**
 * Native modal <dialog>: showModal() makes the page inert, Esc closes (cancel → close event),
 * backdrop click closes, Tab is wrapped inside the dialog, focus returns to the trigger (handled by the parent).
 */
export function CoachDialog({
  coach,
  locale,
  labels,
  clubs,
  fallbackEmail,
  fallbackAppHref,
  appHref: appHrefOverride,
  onClose,
}: {
  coach: Person | null;
  locale: Locale;
  labels: CoachLabels;
  clubs: Record<string, CoachClubRef>;
  fallbackEmail: string;
  fallbackAppHref: string;
  /** Forces the "book in the app" deep link (club detail page: always this club). */
  appHref?: string;
  onClose: () => void;
}) {
  const ref = useRef<HTMLDialogElement>(null);
  const titleId = useId();

  useEffect(() => {
    const d = ref.current;
    if (!d) return;
    if (coach && !d.open) {
      d.showModal();
      d.querySelector<HTMLElement>("[data-autofocus]")?.focus();
    } else if (!coach && d.open) d.close();
    if (!coach) return;
    // Lock page scroll while open.
    const root = document.documentElement;
    const prev = root.style.overflow;
    root.style.overflow = "hidden";
    return () => {
      root.style.overflow = prev;
    };
  }, [coach]);

  const onKeyDown = (e: React.KeyboardEvent<HTMLDialogElement>) => {
    if (e.key !== "Tab") return;
    const items = Array.from(e.currentTarget.querySelectorAll<HTMLElement>(FOCUSABLE)).filter((el) => el.offsetParent !== null);
    if (items.length === 0) return;
    const first = items[0];
    const last = items[items.length - 1];
    if (e.shiftKey && document.activeElement === first) {
      e.preventDefault();
      last.focus();
    } else if (!e.shiftKey && document.activeElement === last) {
      e.preventDefault();
      first.focus();
    }
  };

  const keys = coach ? coachClubKeys(coach.club) : [];
  const refs = keys.map((k) => clubs[k] ?? { key: k, label: k, href: "" });
  const single = refs.length === 1 ? refs[0] : undefined;
  const appHref = appHrefOverride ?? single?.appHref ?? fallbackAppHref;
  const hasDirect = Boolean(coach?.email || coach?.phone);

  return (
    <dialog
      ref={ref}
      aria-labelledby={titleId}
      onClose={onClose}
      onKeyDown={onKeyDown}
      onClick={(e) => {
        if (e.target === e.currentTarget) e.currentTarget.close();
      }}
      className={cn(
        "m-auto w-[calc(100%-32px)] max-w-4xl overflow-hidden rounded-[20px] border border-white/10 bg-ink-700 p-0 text-chalk shadow-glow md:rounded-[28px]",
        "max-h-[calc(100dvh-32px)] backdrop:bg-black/75 backdrop:backdrop-blur-sm",
      )}
    >
      {coach && (
        <div className="grid max-h-[calc(100dvh-34px)] overflow-y-auto overscroll-contain md:grid-cols-[minmax(0,300px)_1fr] md:overflow-hidden">
          {/* Photo column */}
          <div className="relative aspect-[16/10] md:aspect-auto md:min-h-full">
            <Media
              src={coach.image}
              alt={coach.name}
              className="absolute inset-0"
              imgClassName="object-[50%_22%]"
              overlay
              sizes="(min-width:768px) 300px, 100vw"
            />
            <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(120%_70%_at_0%_100%,rgb(224_5_195/0.4),transparent_65%)]" aria-hidden />
            <span className="absolute left-4 top-4 inline-flex h-8 items-center gap-2 rounded-full border border-white/15 bg-black/55 px-3 backdrop-blur">
              <DotGrid />
              <span className="font-display text-base font-extrabold uppercase italic leading-none tracking-[0.06em]">{coach.role[locale]}</span>
            </span>
          </div>

          {/* Content column */}
          <div className="relative p-5 md:max-h-[calc(100dvh-34px)] md:overflow-y-auto md:p-8">
            <button
              type="button"
              data-autofocus
              onClick={() => ref.current?.close()}
              aria-label={labels.close}
              className="absolute right-3 top-3 grid size-11 place-items-center rounded-full border border-white/25 bg-ink-800/70 transition hover:border-white hover:bg-white/10 max-md:fixed max-md:right-6 max-md:top-6 md:right-5 md:top-5"
            >
              <X className="size-5" aria-hidden />
            </button>

            <h2 id={titleId} className="pr-14 font-display text-4xl font-extrabold uppercase italic leading-[0.9] tracking-tight md:text-5xl">
              {coach.name}
            </h2>
            {coach.bio && <p className="mt-2 text-sm text-white/70">{coach.bio[locale]}</p>}
            {refs.length > 0 && (
              <p className="mt-2 flex items-center gap-1.5 text-sm text-white/80">
                <MapPin className="size-3.5 shrink-0" aria-hidden /> {refs.map((r) => r.label).join(" & ")}
              </p>
            )}

            <div className="mt-6 grid grid-cols-2 gap-4 rounded-2xl border border-white/10 bg-black/30 p-4">
              <CoachStat value={coach.hoursOnCourt} label={labels.hours} pending={labels.pending} locale={locale} size="md" />
              <CoachStat value={coach.students} label={labels.students} pending={labels.pending} locale={locale} size="md" suffix="+" />
            </div>

            {/* Contact */}
            <section className="mt-8" aria-labelledby={`${titleId}-contact`}>
              <h3 id={`${titleId}-contact`} className="text-[13px] font-semibold uppercase tracking-[0.14em] text-white/60">
                {labels.contactTitle}
              </h3>
              {hasDirect ? (
                <ul className="mt-3 grid gap-2 sm:grid-cols-2">
                  {coach.email && (
                    <li>
                      <ContactLink href={`mailto:${coach.email}?subject=${encodeURIComponent(fill(labels.mailSubject, { name: coach.name }))}`} icon={<Mail className="size-4" aria-hidden />} label={labels.email} value={coach.email} />
                    </li>
                  )}
                  {coach.phone && (
                    <li>
                      <ContactLink href={`tel:${coach.phone.replace(/[^\d+]/g, "")}`} icon={<Phone className="size-4" aria-hidden />} label={labels.phone} value={coach.phone} />
                    </li>
                  )}
                </ul>
              ) : (
                <div className="mt-3 rounded-2xl border border-white/10 p-4">
                  <p className="font-display text-xl font-extrabold uppercase italic leading-none">{labels.viaClub}</p>
                  <p className="mt-2 text-sm text-white/70">{labels.viaClubText}</p>
                  <ul className="mt-4 flex flex-wrap gap-2">
                    {refs.map((r) =>
                      r.href ? (
                        <li key={r.key}>
                          <Link href={r.href} className="inline-flex min-h-11 items-center gap-2 rounded-full border border-white/25 px-4 text-sm transition hover:border-white hover:bg-white/5">
                            <MapPin className="size-3.5" aria-hidden /> {r.label}
                            <span className="sr-only">– {labels.clubPage}</span>
                            <ArrowUpRight className="size-4" aria-hidden />
                          </Link>
                        </li>
                      ) : null,
                    )}
                    <li>
                      <a
                        href={`mailto:${fallbackEmail}?subject=${encodeURIComponent(fill(labels.mailSubject, { name: coach.name }))}`}
                        className="inline-flex min-h-11 items-center gap-2 rounded-full border border-white/25 px-4 text-sm transition hover:border-white hover:bg-white/5"
                      >
                        <Mail className="size-3.5" aria-hidden />
                        <span>
                          <span className="sr-only">{labels.generalMail}: </span>
                          {fallbackEmail}
                        </span>
                      </a>
                    </li>
                  </ul>
                </div>
              )}
            </section>

            {/* Offer: training times + prices (static Contentful data, not availability) */}
            <section className="mt-8" aria-labelledby={`${titleId}-offer`}>
              <h3 id={`${titleId}-offer`} className="text-[13px] font-semibold uppercase tracking-[0.14em] text-white/60">
                {labels.offerTitle}
              </h3>
              {coach.offers?.length ? (
                <div className="mt-3 grid gap-4">
                  {coach.offers.map((o, i) => (
                    <Offer key={`${o.club ?? "club"}-${i}`} offer={o} labels={labels} locale={locale} showClub={coach.offers!.length > 1} />
                  ))}
                </div>
              ) : (
                <div className="mt-3 flex gap-3 rounded-2xl border border-dashed border-white/20 p-4">
                  <Clock className="mt-0.5 size-5 shrink-0 text-white/60" aria-hidden />
                  <div>
                    <p className="font-display text-xl font-extrabold uppercase italic leading-none">{labels.offerPending}</p>
                    <p className="mt-2 text-sm text-white/70">{labels.offerPendingText}</p>
                  </div>
                </div>
              )}
            </section>

            <div className="mt-8 flex flex-col items-start gap-2 border-t border-white/10 pt-6">
              <Button href={appHref} variant="gradient" size="sm" data-track="coach_book_click">
                {labels.book}
              </Button>
              <p className="text-xs text-white/60">{labels.bookNote}</p>
            </div>
          </div>
        </div>
      )}
    </dialog>
  );
}

function ContactLink({ href, icon, label, value }: { href: string; icon: React.ReactNode; label: string; value: string }) {
  return (
    <a href={href} className="flex min-h-11 items-center gap-3 rounded-2xl border border-white/15 px-4 py-3 transition hover:border-white/40 hover:bg-white/5">
      <span className="grid size-9 shrink-0 place-items-center rounded-full bg-brand-gradient">{icon}</span>
      <span className="min-w-0">
        <span className="block text-[11px] font-semibold uppercase tracking-[0.14em] text-white/60">{label}</span>
        <span className="block truncate text-sm">{value}</span>
      </span>
    </a>
  );
}

function Offer({ offer, labels, locale, showClub }: { offer: CoachOffer; labels: CoachLabels; locale: Locale; showClub: boolean }) {
  const money = new Intl.NumberFormat(localeTags[locale].intl, { style: "currency", currency: "EUR" });
  // Only show group sizes that have a price in at least one row.
  const sizes = ([1, 2, 3, 4] as const).filter((n) => offer.prices.some((p) => p.perPlayerCents[n] !== undefined));
  return (
    <div className="rounded-2xl border border-white/10 bg-black/30 p-4">
      {showClub && offer.club && (
        <p className="mb-3 flex items-center gap-1.5 text-sm font-semibold">
          <MapPin className="size-3.5" aria-hidden /> {offer.club}
        </p>
      )}
      {offer.times.length > 0 && (
        <>
          <p className="text-xs font-semibold uppercase tracking-[0.14em] text-white/60">{labels.times}</p>
          <dl className="mt-2 grid grid-cols-[auto_1fr] gap-x-4 gap-y-1 text-sm tabular-nums">
            {offer.times.map((t) => (
              <div key={t.weekday} className="contents">
                <dt className="text-white/60">{labels.weekdays[t.weekday - 1]}</dt>
                <dd>
                  {t.startsAt}–{t.endsAt}
                </dd>
              </div>
            ))}
          </dl>
        </>
      )}
      {offer.prices.length > 0 && sizes.length > 0 && (
        <div className={cn("overflow-x-auto", offer.times.length > 0 && "mt-4")}>
          <table className="w-full min-w-[260px] text-left text-sm tabular-nums">
            <caption className="mb-2 text-left text-xs font-semibold uppercase tracking-[0.14em] text-white/60">
              {labels.prices} <span className="normal-case tracking-normal text-white/50">({sizes.length > 1 ? `1–${sizes[sizes.length - 1]}` : sizes[0]} {labels.playersHint})</span>
            </caption>
            <thead>
              <tr className="border-b border-white/10 text-xs text-white/60">
                <th scope="col" className="py-1.5 pr-3 font-medium">
                  <span className="sr-only">{labels.durationHead}</span>
                </th>
                {sizes.map((n) => (
                  <th key={n} scope="col" className="py-1.5 pr-3 text-right font-medium">
                    {fill(labels.players, { n })}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {offer.prices.map((p) => (
                <tr key={p.durationMinutes} className="border-b border-white/5 last:border-0">
                  <th scope="row" className="py-1.5 pr-3 font-medium">
                    {fill(labels.duration, { m: p.durationMinutes })}
                  </th>
                  {sizes.map((n) => {
                    const cents = p.perPlayerCents[n];
                    return (
                      <td key={n} className="py-1.5 pr-3 text-right">
                        {cents === undefined ? "–" : money.format(cents / 100)}
                      </td>
                    );
                  })}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
