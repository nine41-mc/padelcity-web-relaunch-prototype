import type { Metadata } from "next";
import { LocationsView } from "@/views/locations/LocationsView";
import { locationsContent } from "@/lib/content/locations";
import { alternates } from "@/lib/i18n/routes";

export const metadata: Metadata = {
  title: locationsContent.en.meta.title,
  description: locationsContent.en.meta.description,
  alternates: alternates("locations", undefined, "en"),
};

export default function Page() {
  return <LocationsView locale="en" />;
}
