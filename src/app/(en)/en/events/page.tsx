import type { Metadata } from "next";
import { EventsView } from "@/views/events/EventsView";
import { eventsContent } from "@/lib/content/events";
import { alternates } from "@/lib/i18n/routes";

export const metadata: Metadata = {
  title: eventsContent.en.meta.title,
  description: eventsContent.en.meta.description,
  alternates: alternates("events", undefined, "en"),
};

export default function Page() {
  return <EventsView locale="en" />;
}
