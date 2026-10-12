import type { Locale } from "@/lib/i18n/config";
import { Eyebrow, Headline } from "../ui/Headline";
import { brandStrings } from "./strings";

// Contentful module: legalPage { title, body (rich text), updatedAt }

/** Simple text layout for legal pages (imprint, privacy, terms). Prototype: placeholder copy. */
export function LegalPage({ locale, title, sections }: { locale: Locale; title: string; sections: { heading: string; text: string }[] }) {
  const t = brandStrings[locale].legal;
  return (
    <section className="pt-36 pb-24 md:pt-44 md:pb-32">
      <div className="container-site max-w-4xl">
        <Eyebrow dot={false}>{t.eyebrow}</Eyebrow>
        <Headline as="h1" size="md" className="mt-6">
          {title}
        </Headline>
        <p className="mt-6 rounded-2xl border border-dashed border-white/25 bg-white/[0.03] p-4 text-sm text-white/70">{t.notice}</p>
        <div className="mt-12 space-y-10">
          {sections.map((s) => (
            <section key={s.heading}>
              <h2 className="text-xl font-semibold">{s.heading}</h2>
              <p className="mt-3 leading-relaxed text-white/70">{s.text}</p>
            </section>
          ))}
        </div>
      </div>
    </section>
  );
}
