import type { Metadata } from "next";
import { Section } from "@/components/ui/Section";
import { Accent, Eyebrow, Headline, Lead } from "@/components/ui/Headline";
import { Button } from "@/components/ui/Button";
import { StoreBadges } from "@/components/ui/StoreBadges";
import { PadelPong } from "@/components/brand/PadelPong";

// Target of the event sign-up links (app + web app) while the events are mock data – their ids exist nowhere.
// Bilingual on purpose: links from DE and EN pages land here (see COMING_SOON in src/lib/site.ts). Never indexed.
export const metadata: Metadata = { title: "Coming soon", robots: { index: false, follow: false } };

export default function Page() {
  return (
    <Section tone="ink" className="pt-32 md:pt-40">
      <div className="grid items-center gap-10 lg:grid-cols-[1fr_1.3fr] lg:gap-14">
        <div>
          <Eyebrow>Bald in der App · Coming soon</Eyebrow>
          <Headline as="h1" size="lg" className="mt-6">
            Coming <Accent>soon.</Accent>
          </Headline>
          <Lead className="mt-6">Dieser Link führt bald direkt in die PadelCity App. Bis dahin: ein kleines Match für zwischendurch.</Lead>
          <p lang="en" className="mt-3 text-fg/70">
            This link will soon open the PadelCity app. Until then, enjoy a quick rally.
          </p>
          <div className="mt-8 flex flex-wrap items-center gap-3">
            <Button href="/" variant="primary">
              Zur Startseite
            </Button>
            <StoreBadges locale="de" campaign="coming-soon-page" />
          </div>
        </div>
        <div>
          <PadelPong label="Animiertes Padel-Pong: ein gelbgrüner Ball fliegt zwischen zwei Schlägern hin und her" />
          <p className="mt-3 text-sm text-fg/60">Maus oder Finger über das Feld bewegen und links mitspielen · Move your pointer over the court to play.</p>
        </div>
      </div>
    </Section>
  );
}
