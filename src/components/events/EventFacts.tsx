import type { Locale } from "@/lib/i18n/config";
import { localeTags } from "@/lib/i18n/config";
import { eventsContent } from "@/lib/content/events";

/** One key fact (Figma: Fact Row) – icon, small label in caps, value. Use inside a <dl>. */
export function FactRow({ icon, label, children }: { icon: React.ReactNode; label: string; children: React.ReactNode }) {
  return (
    // dt and dd stay direct children of the row (valid <dl>); the icon (size-5) sits in the dt's left padding
    <div className="pl-8">
      <dt className="relative text-[11px] font-semibold uppercase tracking-[0.14em] text-fg/60">
        <span className="absolute -left-8 top-0.5 text-fg/70" aria-hidden>
          {icon}
        </span>
        {label}
      </dt>
      <dd className="mt-0.5">{children}</dd>
    </div>
  );
}

/**
 * Sign-up card of the event detail (Figma: Event Signup Card) – sticky right column on desktop.
 * Fact rows (format, deadline, max. participants, free places), price, sign-up buttons, note. pad-panel.
 */
export function EventSignupCard({
  price,
  priceNote,
  signup,
  note,
  children,
}: {
  price: string;
  priceNote?: string;
  signup: React.ReactNode;
  note?: string;
  children: React.ReactNode;
}) {
  return (
    <div className="rounded-[28px] border border-fg/10 bg-raised pad-panel">
      <dl className="space-y-4">{children}</dl>
      <p className="mt-6 flex items-baseline gap-2 border-t border-fg/10 pt-6">
        <span className="font-display text-4xl font-extrabold italic">{price}</span>
        {priceNote && <span className="text-sm text-fg/70">{priceNote}</span>}
      </p>
      <div className="mt-6">{signup}</div>
      {note && <p className="mt-4 text-center text-sm text-fg/70">{note}</p>}
    </div>
  );
}

/**
 * Cancellation policy as in the app (Figma: Cancellation Table) – APL terms for the fixed-time rule
 * "free until 24 h before start": free refund until the cut-off (success green), full fee from then on.
 */
export function CancellationTable({ cutoff, locale }: { cutoff: Date; locale: Locale }) {
  const t = eventsContent[locale];
  const intl = localeTags[locale].intl;
  // cutoff is a wall-clock time (eventWallClock) – formatted in UTC, so the build machine's time zone does not matter
  const day = cutoff.toLocaleDateString(intl, { day: "numeric", month: "short", timeZone: "UTC" });
  const clock = new Intl.DateTimeFormat("en-GB", { hour: "2-digit", minute: "2-digit", hourCycle: "h23", timeZone: "UTC" }).format(cutoff);
  const time = `${clock}${t.date.time ? ` ${t.date.time}` : ""}`;
  const rows = [
    { when: t.detail.until, text: t.detail.freeRefund, free: true },
    { when: t.detail.from, text: t.detail.fullFee, free: false },
  ];
  return (
    <section className="mb-8" aria-labelledby="cancellation-title">
      <h2 id="cancellation-title" className="text-[13px] font-semibold uppercase tracking-[0.14em] text-fg/60">
        {t.detail.cancellationTitle}
      </h2>
      <dl className="mt-3 divide-y divide-fg/10 rounded-[20px] border border-fg/10 bg-raised">
        {rows.map((r) => (
          <div key={r.when} className="grid grid-cols-[7rem_1fr] items-center gap-4 pad-card md:grid-cols-[9rem_1fr]">
            <dt className="text-sm text-fg/70">
              {r.when}
              <span className="block text-lg font-semibold text-fg">{day}</span>
              {time}
            </dt>
            <dd className={r.free ? "text-lg font-semibold text-success" : "text-fg/85"}>{r.text}</dd>
          </div>
        ))}
      </dl>
    </section>
  );
}
