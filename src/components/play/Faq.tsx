import { Plus } from "lucide-react";
import { cn } from "@/components/ui/cn";

// Contentful module: faq (items: question, answer)
/** Accessible FAQ accordion based on <details>, plus FAQPage JSON-LD. */
export function Faq({ items, className }: { items: { q: string; a: string }[]; className?: string }) {
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: items.map((i) => ({ "@type": "Question", name: i.q, acceptedAnswer: { "@type": "Answer", text: i.a } })),
  };
  return (
    <div className={cn("divide-y divide-white/10 border-y border-white/10", className)}>
      {items.map((item) => (
        <details key={item.q} className="group py-2">
          <summary className="flex cursor-pointer list-none items-center justify-between gap-6 py-4 text-lg font-semibold md:text-xl [&::-webkit-details-marker]:hidden">
            {item.q}
            <span className="grid size-9 shrink-0 place-items-center rounded-full border border-white/20 transition-transform duration-300 group-open:rotate-45 group-open:border-transparent group-open:bg-brand-gradient group-open:text-white">
              <Plus className="size-4" aria-hidden />
            </span>
          </summary>
          <p className="max-w-3xl pb-5 text-white/70">{item.a}</p>
        </details>
      ))}
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
    </div>
  );
}
