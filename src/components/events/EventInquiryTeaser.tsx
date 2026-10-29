import type { Locale } from "@/lib/i18n/config";
import { href } from "@/lib/i18n/routes";
import { eventInquiryContent } from "@/lib/content/eventInquiry";
import { Section } from "../ui/Section";
import { Accent } from "../ui/Headline";
import { SectionIntro } from "../brand/SectionIntro";
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
/** Teaser for group and company events: intro with the text under the headline, the conditions, then the CTA. */
export function EventInquiryTeaser({ locale }: { locale: Locale }) {
  const t = eventInquiryContent[locale].teaser;
  return (
    <Section tone="black">
      <SectionIntro eyebrow={t.eyebrow} title={<>{t.title} <Accent>{t.accent}</Accent></>} lead={t.text} />
      <EventInquiryFacts locale={locale} />
      <Button href={href(locale, "eventInquiry")} variant="gradient" arrow className="mt-8" data-track="event_inquiry_open">
        {t.cta}
      </Button>
    </Section>
  );
}
