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
    <div className="relative overflow-hidden rounded-[28px] border border-white/10 bg-ink-700">
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_20%_50%,rgb(132_18_181/0.55),transparent_60%),radial-gradient(ellipse_at_90%_100%,rgb(224_5_195/0.35),transparent_55%)]" aria-hidden />
      <div className="absolute inset-0 bg-court-lines opacity-50" aria-hidden />
      <div className="relative grid gap-8 p-8 md:p-14 lg:grid-cols-[auto_1fr] lg:items-center lg:gap-14">
        <div className="grid size-20 place-items-center rounded-full bg-brand-gradient shadow-glow md:size-28" aria-hidden>
          <MapPin className="size-9 text-white md:size-12" />
        </div>
        <div className="grid gap-6 lg:grid-cols-[1.3fr_1fr] lg:items-end">
          <Headline size="md">
            {t.title} <Accent>{t.accent}</Accent>
            {t.titleEnd}
          </Headline>
          <div>
            <p className="text-white/80">{fill(t.text, { clubs: keyFacts.clubs, courts: keyFacts.courts })}</p>
            <Button href={href(locale, "franchise")} className="mt-6" data-track="franchise_teaser">
              {t.cta}
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
