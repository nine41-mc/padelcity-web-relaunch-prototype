import type { Locale } from "@/lib/i18n/config";
import { localeTags } from "@/lib/i18n/config";
import { eventsContent } from "@/lib/content/events";

/** One key fact (Figma: Fact Row) – icon, small label in caps, value. Use inside a <dl>. */
export function FactRow({ icon, label, children }: { icon: React.ReactNode; label: string; children: React.ReactNode }) {
  return (
    <div className="flex items-start gap-3">
      <span className="mt-0.5 text-white/70" aria-hidden>
        {icon}
      </span>
      <div>
        <dt className="text-[11px] font-semibold uppercase tracking-[0.14em] text-white/60">{label}</dt>
        <dd className="mt-0.5">{children}</dd>
      </div>
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
    <div className="rounded-[28px] border border-white/10 bg-ink-700 pad-panel">
      <dl className="space-y-4">{children}</dl>
      <p className="mt-6 flex items-baseline gap-2 border-t border-white/10 pt-6">
        <span className="font-display text-4xl font-extrabold italic">{price}</span>
        {priceNote && <span className="text-sm text-white/70">{priceNote}</span>}
      </p>
      <div className="mt-6">{signup}</div>
      {note && <p className="mt-4 text-center text-sm text-white/70">{note}</p>}
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
  const day = cutoff.toLocaleDateString(intl, { day: "numeric", month: "short" });
  const time = `${String(cutoff.getHours()).padStart(2, "0")}:${String(cutoff.getMinutes()).padStart(2, "0")}${t.date.time ? ` ${t.date.time}` : ""}`;
  const rows = [
    { when: t.detail.until, text: t.detail.freeRefund, free: true },
    { when: t.detail.from, text: t.detail.fullFee, free: false },
  ];
  return (
    <section className="mb-8" aria-labelledby="cancellation-title">
      <h2 id="cancellation-title" className="text-[13px] font-semibold uppercase tracking-[0.14em] text-white/60">
        {t.detail.cancellationTitle}
      </h2>
      <dl className="mt-3 divide-y divide-white/10 rounded-[20px] border border-white/10 bg-ink-700">
        {rows.map((r) => (
          <div key={r.when} className="grid grid-cols-[7rem_1fr] items-center gap-4 pad-card md:grid-cols-[9rem_1fr]">
            <dt className="text-sm text-white/70">
              {r.when}
              <span className="block text-lg font-semibold text-white">{day}</span>
              {time}
            </dt>
            <dd className={r.free ? "text-lg font-semibold text-success" : "text-white/85"}>{r.text}</dd>
          </div>
        ))}
      </dl>
    </section>
  );
}
