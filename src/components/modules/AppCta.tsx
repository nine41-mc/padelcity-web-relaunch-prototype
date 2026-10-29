import { deeplinks } from "@/lib/site";
import { Button } from "../ui/Button";
import { Accent, Headline } from "../ui/Headline";
import { StoreBadges } from "../ui/StoreBadges";
import type { Locale } from "@/lib/i18n/config";
import { href } from "@/lib/i18n/routes";
import { getDictionary } from "@/lib/i18n/dictionaries";

/** Reusable "Court-Buchung bleibt App-exklusiv" banner. */
export function AppCta({
  clubSlug,
  campaign,
  locale = "de",
  showStores = true,
}: {
  clubSlug?: string;
  /** utm_campaign of the page (`<page>-page`) for the store badges */
  campaign?: string;
  locale?: Locale;
  showStores?: boolean;
}) {
  const t = getDictionary(locale).appCta;
  return (
    <div className="relative overflow-hidden rounded-[28px] bg-brandbook-gradient pad-banner">
      <div className="absolute inset-0 bg-court-lines opacity-60" aria-hidden />
      {/* Left: copy + CTA (club deep link or the app page); right: the store badges get the room */}
      <div className="relative grid items-center gap-8 md:grid-cols-[1.4fr_1fr]">
        <div>
          <Headline size="md">
            {t.title} <Accent>{t.accent}</Accent>
          </Headline>
          <p className="mt-4 max-w-lg text-white/80">
            {t.text}
          </p>
          <Button href={clubSlug ? deeplinks.club(clubSlug) : href(locale, "app")} size="md" className="mt-8" data-track="app_cta">
            {clubSlug ? t.open : t.discover}
          </Button>
        </div>
        {showStores && <StoreBadges locale={locale} campaign={campaign} size="lg" className="md:justify-end" />}
      </div>
    </div>
  );
}
