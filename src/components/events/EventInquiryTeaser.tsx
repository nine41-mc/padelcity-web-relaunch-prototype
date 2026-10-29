import type { Locale } from "@/lib/i18n/config";
import { href } from "@/lib/i18n/routes";
import { eventInquiryContent } from "@/lib/content/eventInquiry";
import { Section } from "../ui/Section";
import { Accent, Eyebrow, Headline } from "../ui/Headline";
import { Button } from "../ui/Button";
import { InfoTile } from "../ui/InfoTile";
import { Reveal } from "../ui/Reveal";

/** The three conditions for event requests (lead time, minimum size, app for smaller bookings) as Info Tiles. */
export function EventInquiryFacts({ locale }: { locale: Locale }) {
  const t = eventInquiryContent[locale].facts;
  return (
    <ul className="grid gap-4 md:grid-cols-3">
      {t.items.map((item, i) => (
        <li key={item.label}>
          <Reveal delay={i * 0.06} className="h-full">
            <InfoTile label={item.label} value={item.value} text={item.text} />
          </Reveal>
        </li>
      ))}
    </ul>
  );
}

// Contentful module: eventInquiryTeaser (on /events)
/** Teaser for group and company events with the conditions and the way to the request form. */
export function EventInquiryTeaser({ locale }: { locale: Locale }) {
  const t = eventInquiryContent[locale].teaser;
  return (
    <Section tone="black">
      <div className="mb-10 grid gap-6 lg:grid-cols-2 lg:items-end lg:gap-12">
        <div>
          <Eyebrow className="mb-4">{t.eyebrow}</Eyebrow>
          <Headline size="md">
            {t.title} <Accent>{t.accent}</Accent>
          </Headline>
        </div>
        <div>
          <p className="text-lg text-white/75">{t.text}</p>
          <Button href={href(locale, "eventInquiry")} variant="gradient" arrow className="mt-6" data-track="event_inquiry_open">
            {t.cta}
          </Button>
        </div>
      </div>
      <EventInquiryFacts locale={locale} />
    </Section>
  );
}
