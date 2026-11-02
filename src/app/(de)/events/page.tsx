import type { Metadata } from "next";
import { EventsView } from "@/views/events/EventsView";
import { eventsContent } from "@/lib/content/events";
import { alternates } from "@/lib/i18n/routes";
import { ogFor } from "@/lib/og";

export const metadata: Metadata = {
  title: eventsContent.de.meta.title,
  description: eventsContent.de.meta.description,
  alternates: alternates("events", undefined, "de"),
  openGraph: ogFor("de", "events"),
};

export default function Page() {
  return <EventsView locale="de" />;
}
