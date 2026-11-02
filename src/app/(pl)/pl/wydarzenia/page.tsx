import type { Metadata } from "next";
import { EventsView } from "@/views/events/EventsView";
import { eventsContent } from "@/lib/content/events";
import { alternates } from "@/lib/i18n/routes";
import { ogFor } from "@/lib/og";

export const metadata: Metadata = {
  title: eventsContent.pl.meta.title,
  description: eventsContent.pl.meta.description,
  alternates: alternates("events", undefined, "pl"),
  openGraph: ogFor("pl", "events"),
};

export default function Page() {
  return <EventsView locale="pl" />;
}
