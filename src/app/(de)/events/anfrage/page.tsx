import type { Metadata } from "next";
import { EventInquiryView } from "@/views/events/EventInquiryView";
import { eventInquiryContent } from "@/lib/content/eventInquiry";
import { alternates } from "@/lib/i18n/routes";

export const metadata: Metadata = {
  title: eventInquiryContent.de.meta.title,
  description: eventInquiryContent.de.meta.description,
  alternates: alternates("eventInquiry", undefined, "de"),
};

export default function Page() {
  return <EventInquiryView locale="de" />;
}
