import type { Metadata } from "next";
import { LocationsView } from "@/views/locations/LocationsView";
import { locationsContent } from "@/lib/content/locations";
import { alternates } from "@/lib/i18n/routes";

export const metadata: Metadata = {
  title: locationsContent.de.meta.title,
  description: locationsContent.de.meta.description,
  alternates: alternates("locations", undefined, "de"),
};

export default function Page() {
  return <LocationsView locale="de" />;
}
