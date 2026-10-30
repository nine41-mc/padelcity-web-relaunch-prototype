// Contentful module: franchiseTeaser

import { MapPin } from "lucide-react";
import { Button } from "@/components/ui/Button";
import { Accent, Headline } from "@/components/ui/Headline";
import { keyFacts } from "@/lib/content/partners";
import { fill, locationsContent } from "@/lib/content/locations";
import type { Locale } from "@/lib/i18n/config";
import { href } from "@/lib/i18n/routes";

/** "Deine Stadt soll eine PadelCity werden?" – teaser linking to the franchise page. */
export function FranchiseTeaser({ locale = "de" }: { locale?: Locale }) {
  const t = locationsContent[locale].franchise;
  return (
    <div className="relative overflow-hidden rounded-[28px] border border-fg/10 bg-raised">
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_20%_50%,rgb(132_18_181/0.55),transparent_60%),radial-gradient(ellipse_at_90%_100%,rgb(224_5_195/0.35),transparent_55%)]" aria-hidden />
      <div className="absolute inset-0 bg-court-lines opacity-50" aria-hidden />
      <div className="relative grid gap-8 pad-banner lg:grid-cols-[auto_1fr] lg:items-center lg:gap-14">
        <div className="grid size-20 place-items-center rounded-full bg-brand-gradient shadow-glow md:size-28" aria-hidden>
          <MapPin className="size-9 text-fg md:size-12" />
        </div>
        {/* Text under the headline, button under the text – no text column beside the headline */}
        <div>
          <Headline size="md">
            {t.title} <Accent>{t.accent}</Accent>
            {t.titleEnd}
          </Headline>
          <p className="mt-5 max-w-2xl text-fg/80">{fill(t.text, { clubs: keyFacts.clubs, courts: keyFacts.courts })}</p>
          <Button href={href(locale, "franchise")} className="mt-6" data-track="franchise_teaser">
            {t.cta}
          </Button>
        </div>
      </div>
    </div>
  );
}
