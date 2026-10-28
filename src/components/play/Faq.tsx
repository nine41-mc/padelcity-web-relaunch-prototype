

import { FaqGroup, FaqItem } from "@/components/ui/FaqItem";

// Contentful module: faq (items: question, answer)
/** Accessible FAQ accordion based on <details>, plus FAQPage JSON-LD. */
export function Faq({ items, className }: { items: { q: string; a: string }[]; className?: string }) {
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: items.map((i) => ({ "@type": "Question", name: i.q, acceptedAnswer: { "@type": "Answer", text: i.a } })),
  };
  return (
    <FaqGroup className={className}>
      {items.map((item) => (
        <FaqItem key={item.q} question={item.q}>
          <p>{item.a}</p>
        </FaqItem>
      ))}
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
    </FaqGroup>
  );
}
