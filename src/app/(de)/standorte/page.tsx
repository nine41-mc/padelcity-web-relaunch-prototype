import type { Metadata } from "next";
import { LocationsView } from "@/views/locations/LocationsView";
import { locationsContent } from "@/lib/content/locations";
import { alternates } from "@/lib/i18n/routes";
import { ogFor } from "@/lib/og";

export const metadata: Metadata = {
  title: locationsContent.de.meta.title,
  description: locationsContent.de.meta.description,
  alternates: alternates("locations", undefined, "de"),
  openGraph: ogFor("de", "locations"),
};

export default function Page() {
  return <LocationsView locale="de" />;
}
