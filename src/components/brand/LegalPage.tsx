import type { Locale } from "@/lib/i18n/config";
import { Eyebrow, Headline } from "../ui/Headline";
import { brandStrings } from "./strings";

// Contentful module: legalPage { title, body (rich text), updatedAt }

/** Simple text layout for legal pages (imprint, privacy, terms). Copy taken over from padelcity.de. */
export function LegalPage({
  locale,
  title,
  sections,
  updated,
}: {
  locale: Locale;
  title: string;
  sections: { heading: string; text: string }[];
  updated?: string;
}) {
  const t = brandStrings[locale].legal;
  // Consecutive paragraphs without a heading (e.g. address + contact at the top of the imprint) form one block.
  const blocks = sections.reduce<{ heading: string; text: string }[]>((acc, s) => {
    const prev = acc[acc.length - 1];
    if (prev && !prev.heading && !s.heading) prev.text += "\n\n" + s.text;
    else acc.push({ ...s });
    return acc;
  }, []);
  return (
    <section className="pt-36 pb-24 md:pt-44 md:pb-32">
      <div className="container-site max-w-4xl">
        <Eyebrow dot={false}>{t.eyebrow}</Eyebrow>
        <Headline as="h1" size="md" className="mt-6">
          {title}
        </Headline>
        <p className="mt-6 rounded-2xl border border-dashed border-fg/25 bg-fg/[0.03] p-4 text-sm text-fg/70">{t.notice}</p>
        <div className="mt-12 space-y-10">
          {blocks.map((s, i) => (
            <section key={`${i}-${s.heading}`}>
              {s.heading && <h2 className="mb-3 text-xl font-semibold">{s.heading}</h2>}
              {/* Paragraphs separated by blank lines; line breaks (addresses, lists) are kept */}
              <div className="space-y-3 leading-relaxed text-fg/75">
                {s.text.split("\n\n").map((para, j) => (
                  <p key={j} className="whitespace-pre-line [overflow-wrap:anywhere]">
                    {para}
                  </p>
                ))}
              </div>
            </section>
          ))}
        </div>
        {updated && <p className="mt-12 text-sm text-fg/60">{updated}</p>}
      </div>
    </section>
  );
}
