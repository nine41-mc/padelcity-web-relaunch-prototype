import type { Metadata } from "next";
import { EventInquiryView } from "@/views/events/EventInquiryView";
import { eventInquiryContent } from "@/lib/content/eventInquiry";
import { alternates } from "@/lib/i18n/routes";

export const metadata: Metadata = {
  title: eventInquiryContent.en.meta.title,
  description: eventInquiryContent.en.meta.description,
  alternates: alternates("eventInquiry", undefined, "en"),
};

export default function Page() {
  return <EventInquiryView locale="en" />;
}
