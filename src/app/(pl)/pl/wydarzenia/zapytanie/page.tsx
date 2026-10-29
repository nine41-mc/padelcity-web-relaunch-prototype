import type { Metadata } from "next";
import { EventInquiryView } from "@/views/events/EventInquiryView";
import { eventInquiryContent } from "@/lib/content/eventInquiry";
import { alternates } from "@/lib/i18n/routes";

export const metadata: Metadata = {
  title: eventInquiryContent.pl.meta.title,
  description: eventInquiryContent.pl.meta.description,
  alternates: alternates("eventInquiry", undefined, "pl"),
};

export default function Page() {
  return <EventInquiryView locale="pl" />;
}
