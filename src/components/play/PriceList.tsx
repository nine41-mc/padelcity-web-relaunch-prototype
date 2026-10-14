import type { PriceRow } from "@/lib/content/academy";
import type { Locale } from "@/lib/i18n/config";
import { formatPrice } from "@/lib/format";
import { cn } from "@/components/ui/cn";

// Contentful module: priceTable (rows: format, persons, price coach / head coach per hour)
/** Academy price list: one row per format, Coach vs. Headcoach per hour – a real table, also on the phone. */
export function PriceList({
  rows,
  locale,
  labels,
}: {
  rows: PriceRow[];
  locale: Locale;
  labels: { unit: string; coach: string; headCoach: string; caption: string };
}) {
  const head = "px-3 pb-3 text-right text-[12px] font-semibold uppercase tracking-[0.18em] text-white/70 md:px-6";
  const price = "px-3 py-5 text-right font-display text-3xl font-extrabold italic leading-none md:px-6 md:text-4xl";
  return (
    <div className="overflow-hidden rounded-[24px] border border-white/10 bg-ink-700">
      <table className="w-full border-collapse">
        <caption className="sr-only">{labels.caption}</caption>
        <thead>
          <tr className="border-b border-white/10">
            <td className="pt-5" />
            <th scope="col" className={cn(head, "pt-5")}>
              {labels.coach}
              <span className="block text-[11px] font-medium normal-case tracking-normal text-white/60">{labels.unit}</span>
            </th>
            <th scope="col" className={cn(head, "pt-5")}>
              <span className="text-magenta-300">{labels.headCoach}</span>
              <span className="block text-[11px] font-medium normal-case tracking-normal text-white/60">{labels.unit}</span>
            </th>
          </tr>
        </thead>
        <tbody>
          {rows.map((r) => (
            <tr key={r.title} className="border-b border-white/10 last:border-b-0 transition-colors hover:bg-white/[0.03]">
              <th scope="row" className="py-5 pl-4 pr-2 text-left md:pl-6">
                <span className="block font-display text-xl font-extrabold uppercase italic leading-none md:text-2xl">{r.title}</span>
                {r.sub && <span className="mt-1 block text-sm font-normal text-white/60">{r.sub}</span>}
              </th>
              <td className={price}>{formatPrice(r.coach, locale, "EUR")}</td>
              <td className={price}>{formatPrice(r.headCoach, locale, "EUR")}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
