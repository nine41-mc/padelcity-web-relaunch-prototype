"use client";

import Link from "next/link";
import { ArrowUpRight, Clock, Mail, MapPin, Phone } from "lucide-react";
import type { CoachOffer, Person } from "@/lib/content/people";
import type { Locale } from "@/lib/i18n/config";
import { localeTags } from "@/lib/i18n/config";
import { Overlay, OverlaySection } from "@/components/ui/Overlay";
import { Button } from "@/components/ui/Button";
import { cn } from "@/components/ui/cn";
import { CoachStat, DotGrid } from "./CoachCard";
import { coachClubKeys, fill, type CoachClubRef } from "./clubs";
import type { CoachLabels } from "./labels";

// Content type coach (detail: contact + coachTrainingTime offer) – opened from coachCarousel and clubCoaches
/** Coach detail in the shared overlay; focus returns to the trigger (handled by the parent). */
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
  const keys = coach ? coachClubKeys(coach.club) : [];
  const refs = keys.map((k) => clubs[k] ?? { key: k, label: k, href: "" });
  const single = refs.length === 1 ? refs[0] : undefined;
  const appHref = appHrefOverride ?? single?.appHref ?? fallbackAppHref;
  const hasDirect = Boolean(coach?.email || coach?.phone);

  return (
    <Overlay
      open={Boolean(coach)}
      onClose={onClose}
      title={coach?.name}
      meta={
        refs.length > 0 && (
          <p className="flex items-center gap-1.5">
            <MapPin className="size-3.5 shrink-0" aria-hidden /> {refs.map((r) => r.label).join(" & ")}
          </p>
        )
      }
      image={coach?.image}
      imageAlt={coach?.name ?? ""}
      imageClassName="object-[50%_22%]"
      badge={
        coach && (
          <>
        <DotGrid />
        <span className="font-display text-base font-extrabold uppercase italic leading-none tracking-[0.06em]">{coach.role[locale]}</span>
      </>
    )
  }
  closeLabel={labels.close}
>
  {coach && (
    <>
        <div className="mt-6 grid grid-cols-2 gap-4 rounded-2xl border border-fg/10 bg-canvas-deep/30 p-4">
          <CoachStat value={coach.hoursOnCourt} label={labels.hours} pending={labels.pending} locale={locale} size="md" />
          <CoachStat value={coach.students} label={labels.students} pending={labels.pending} locale={locale} size="md" suffix="+" />
        </div>

        {/* Contact */}
        <OverlaySection title={labels.contactTitle}>
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
            <div className="mt-3 rounded-2xl border border-fg/10 p-4">
              <p className="font-display text-xl font-extrabold uppercase italic leading-none">{labels.viaClub}</p>
              <p className="mt-2 text-sm text-fg/70">{labels.viaClubText}</p>
              <ul className="mt-4 flex flex-wrap gap-2">
                {refs.map((r) =>
                  r.href ? (
                    <li key={r.key}>
                      <Link href={r.href} className="inline-flex min-h-11 items-center gap-2 rounded-full border border-fg/25 px-4 text-sm transition hover:border-fg hover:bg-fg/5">
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
                    className="inline-flex min-h-11 items-center gap-2 rounded-full border border-fg/25 px-4 text-sm transition hover:border-fg hover:bg-fg/5"
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
        </OverlaySection>

        {/* Offer: training times + prices (static Contentful data, not availability) */}
        <OverlaySection title={labels.offerTitle}>
          {coach.offers?.length ? (
            <div className="mt-3 grid gap-4">
              {coach.offers.map((o, i) => (
                <Offer key={`${o.club ?? "club"}-${i}`} offer={o} labels={labels} locale={locale} showClub={coach.offers!.length > 1} />
              ))}
            </div>
          ) : (
            <div className="mt-3 flex gap-3 rounded-2xl border border-dashed border-fg/20 p-4">
              <Clock className="mt-0.5 size-5 shrink-0 text-fg/60" aria-hidden />
              <div>
                <p className="font-display text-xl font-extrabold uppercase italic leading-none">{labels.offerPending}</p>
                <p className="mt-2 text-sm text-fg/70">{labels.offerPendingText}</p>
              </div>
            </div>
          )}
        </OverlaySection>

        <div className="mt-8 flex flex-col items-start gap-2 border-t border-fg/10 pt-6">
          <Button href={appHref} variant="gradient" size="sm" data-track="coach_book_click">
            {labels.book}
          </Button>
          <p className="text-xs text-fg/60">{labels.bookNote}</p>
        </div>
        </>
      )}
    </Overlay>
  );
}

function ContactLink({ href, icon, label, value }: { href: string; icon: React.ReactNode; label: string; value: string }) {
  return (
    <a href={href} className="flex min-h-11 items-center gap-3 rounded-2xl border border-fg/15 px-4 py-3 transition hover:border-fg/40 hover:bg-fg/5">
      <span className="grid size-9 shrink-0 place-items-center rounded-full bg-brand-gradient">{icon}</span>
      <span className="min-w-0">
        <span className="block text-[11px] font-semibold uppercase tracking-[0.14em] text-fg/60">{label}</span>
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
    <div className="rounded-2xl border border-fg/10 bg-canvas-deep/30 p-4">
      {showClub && offer.club && (
        <p className="mb-3 flex items-center gap-1.5 text-sm font-semibold">
          <MapPin className="size-3.5" aria-hidden /> {offer.club}
        </p>
      )}
      {offer.times.length > 0 && (
        <>
          <p className="text-xs font-semibold uppercase tracking-[0.14em] text-fg/60">{labels.times}</p>
          <dl className="mt-2 grid grid-cols-[auto_1fr] gap-x-4 gap-y-1 text-sm tabular-nums">
            {offer.times.map((t) => (
              <div key={t.weekday} className="contents">
                <dt className="text-fg/60">{labels.weekdays[t.weekday - 1]}</dt>
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
            <caption className="mb-2 text-left text-xs font-semibold uppercase tracking-[0.14em] text-fg/60">
              {labels.prices} <span className="normal-case tracking-normal text-fg/50">({sizes.length > 1 ? `1–${sizes[sizes.length - 1]}` : sizes[0]} {labels.playersHint})</span>
            </caption>
            <thead>
              <tr className="border-b border-fg/10 text-xs text-fg/60">
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
                <tr key={p.durationMinutes} className="border-b border-fg/5 last:border-0">
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
