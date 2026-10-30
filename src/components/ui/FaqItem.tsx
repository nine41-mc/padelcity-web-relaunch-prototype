import { Plus } from "lucide-react";

/**
 * One accordion row (Figma: FAQ Item) on native <details>/<summary> – works without JS.
 * Rows are grouped in a card (FaqGroup: ink-700, radius 20, dividers white/10). Open: plus turns 45° on the brand gradient.
 */
export function FaqItem({ question, id, defaultOpen, children }: { question: string; id?: string; defaultOpen?: boolean; children: React.ReactNode }) {
  return (
    <details id={id} className="faq-item group scroll-mt-28" open={defaultOpen}>
      <summary className="flex min-h-14 cursor-pointer list-none items-center justify-between gap-4 rounded-[20px] px-5 py-4 font-semibold transition hover:text-fg md:px-6 md:text-lg [&::-webkit-details-marker]:hidden focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-inset focus-visible:ring-optic-500">
        {question}
        <span className="grid size-9 shrink-0 place-items-center rounded-full border border-white/20 transition-transform duration-300 group-open:rotate-45 group-open:border-transparent group-open:bg-brand-gradient group-open:text-white motion-reduce:transition-none">
          <Plus className="size-4" aria-hidden />
        </span>
      </summary>
      <div className="max-w-3xl px-5 pb-5 text-fg/75 md:px-6">{children}</div>
    </details>
  );
}

/** Card that groups FAQ rows. */
export function FaqGroup({ children, className }: { children: React.ReactNode; className?: string }) {
  return <div className={["divide-y divide-fg/10 rounded-[20px] border border-fg/10 bg-raised", className].filter(Boolean).join(" ")}>{children}</div>;
}
