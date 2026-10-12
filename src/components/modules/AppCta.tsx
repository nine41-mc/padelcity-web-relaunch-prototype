import { deeplinks } from "@/lib/site";
import { Button } from "../ui/Button";
import { Accent, Headline } from "../ui/Headline";
import { StoreBadges } from "../ui/StoreBadges";
import type { Locale } from "@/lib/i18n/config";
import { href } from "@/lib/i18n/routes";
import { getDictionary } from "@/lib/i18n/dictionaries";

/** Reusable "Court-Buchung bleibt App-exklusiv" banner. */
export function AppCta({ clubId, locale = "de", showStores = true }: { clubId?: string; locale?: Locale; showStores?: boolean }) {
  const t = getDictionary(locale).appCta;
  return (
    <div className="relative overflow-hidden rounded-[28px] bg-brandbook-gradient p-8 md:p-14">
      <div className="absolute inset-0 bg-court-lines opacity-60" aria-hidden />
      <div className="relative grid items-end gap-8 md:grid-cols-[1.4fr_1fr]">
        <div>
          <Headline size="md">
            {t.title} <Accent>{t.accent}</Accent>
          </Headline>
          <p className="mt-4 max-w-lg text-white/80">
            {t.text}
          </p>
        </div>
        <div className="flex flex-col gap-4 md:items-end">
          <Button href={clubId ? deeplinks.club(clubId) : href(locale, "app")} size="lg" data-track="app_cta">
            {t.open}
          </Button>
          {showStores && <StoreBadges locale={locale} />}
        </div>
      </div>
    </div>
  );
}
