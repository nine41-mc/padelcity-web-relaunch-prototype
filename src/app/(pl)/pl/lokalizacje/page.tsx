import type { Metadata } from "next";
import { LocationsView } from "@/views/locations/LocationsView";
import { locationsContent } from "@/lib/content/locations";
import { alternates } from "@/lib/i18n/routes";

export const metadata: Metadata = {
  title: locationsContent.pl.meta.title,
  description: locationsContent.pl.meta.description,
  alternates: alternates("locations", undefined, "pl"),
};

export default function Page() {
  return <LocationsView locale="pl" />;
}
