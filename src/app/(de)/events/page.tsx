import type { Metadata } from "next";
import { EventsView } from "@/views/events/EventsView";
import { eventsContent } from "@/lib/content/events";
import { alternates } from "@/lib/i18n/routes";

export const metadata: Metadata = {
  title: eventsContent.de.meta.title,
  description: eventsContent.de.meta.description,
  alternates: alternates("events", undefined, "de"),
};

export default function Page() {
  return <EventsView locale="de" />;
}
