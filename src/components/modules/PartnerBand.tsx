import type { Locale } from "@/lib/i18n/config";
import { href } from "@/lib/i18n/routes";
import { partners as allPartners } from "@/lib/content/partners";
import type { Partner } from "@/lib/data/types";
import { Section } from "../ui/Section";
import { Reveal } from "../ui/Reveal";
import { Accent, Eyebrow, Headline } from "../ui/Headline";
import { Button } from "../ui/Button";
import { Marquee } from "../ui/Marquee";
import { PartnerLogo } from "../ui/PartnerLogo";

// Contentful module: partnerLogos (references → partner entries). One partner band for the whole site.
const copy = {
  de: { eyebrow: "Unsere Partner", title: "Better", accent: "together.", cta: "Partner werden" },
  en: { eyebrow: "Our partners", title: "Better", accent: "together.", cta: "Become a partner" },
  pl: { eyebrow: "Nasi partnerzy", title: "Better", accent: "together.", cta: "Zostań partnerem" },
};

/** "Better together." – section intro with "Partner werden" and the partner logos as a running band. */
export function PartnerBand({ locale, partners = allPartners }: { locale: Locale; partners?: Partner[] }) {
  const t = copy[locale];
  return (
    <Section tone="black" bleed className="border-t border-white/10">
      <div className="container-site mb-10 flex flex-col gap-6 md:flex-row md:items-end md:justify-between">
        <Reveal>
          <Eyebrow>{t.eyebrow}</Eyebrow>
          <Headline className="mt-6">
            {t.title} <Accent>{t.accent}</Accent>
          </Headline>
        </Reveal>
        <Button href={href(locale, "partners")} variant="outline">
          {t.cta}
        </Button>
      </div>
      <Marquee>
        {partners.map((p) => (
          <div key={p.name} className="flex h-16 items-center px-7 opacity-60 grayscale transition hover:opacity-100 hover:grayscale-0 md:px-10">
            <PartnerLogo partner={p} className="h-9 max-w-none md:h-10" />
          </div>
        ))}
      </Marquee>
    </Section>
  );
}
