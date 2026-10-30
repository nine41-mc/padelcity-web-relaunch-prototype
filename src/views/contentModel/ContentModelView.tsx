import type { Locale } from "@/lib/i18n/config";
import { contentModel, contentModelMeta } from "@/lib/content/contentModel";
import { Section } from "@/components/ui/Section";
import { Eyebrow, Headline, Accent } from "@/components/ui/Headline";
import { ContentModelExplorer } from "./ContentModelExplorer";

/**
 * "Content-Modell" – internal overview (German, like the styleguide): every page type of the prototype with its
 * modules and the source of each field (API today / API to extend / new Contentful space / external / unknown).
 */
export function ContentModelView({ locale }: { locale: Locale }) {
  return (
    // Internal page, written in German on every locale → lang="de" for screen readers (WCAG 3.1.2)
    <div lang="de">
      <Section tone="ink" className="!pt-36 md:!pt-44">
        <Eyebrow className="mb-5">Intern · Website-Relaunch</Eyebrow>
        <Headline as="h1" size="lg">
          Content-<Accent>Modell</Accent>
        </Headline>
        <div className="mt-8 grid gap-6 text-lg text-fg/75 lg:grid-cols-2 lg:gap-12">
          <p>
            Alle Seitentypen und Module des Prototyps – und für jedes Feld, woher die Daten künftig kommen. Grundlage ist die Entscheidung vom{" "}
            {contentModelMeta.decided}: Website-exklusive Inhalte in einem <strong className="text-fg">zweiten Contentful-Space</strong> im
            bestehenden Account; Clubs, Coaches, Events und andere operative Daten aus der <strong className="text-fg">bestehenden API</strong>.
          </p>
          <p>
            „API vorhanden“ heißt: Endpunkt und Feld gibt es heute. Welche Teile davon öffentlich für die Website werden, wird noch genau
            definiert (Website-Zugang, siehe Workshop Kapitel 3). Stand der API-Prüfung: {contentModelMeta.checked}.
          </p>
        </div>
        <div className="mt-10 rounded-[20px] border border-amber-400/40 bg-amber-400/[0.06] p-5 md:p-6">
          <h2 className="font-semibold text-amber-200">Wichtig zur API (Prüfung der api-platform)</h2>
          <ul className="mt-3 space-y-2 text-fg/80">
            {contentModelMeta.notes.map((n) => (
              <li key={n} className="flex gap-3">
                <span className="mt-2 size-1.5 shrink-0 rounded-full bg-amber-400" aria-hidden />
                {n}
              </li>
            ))}
          </ul>
        </div>
      </Section>
      <Section tone="black" className="!pt-10">
        <ContentModelExplorer pages={contentModel} locale={locale} />
      </Section>
    </div>
  );
}
