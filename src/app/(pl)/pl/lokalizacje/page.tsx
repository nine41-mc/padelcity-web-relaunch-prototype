import type { Metadata } from "next";
import { LocationsView } from "@/views/locations/LocationsView";
import { locationsContent } from "@/lib/content/locations";
import { alternates } from "@/lib/i18n/routes";
import { ogFor } from "@/lib/og";

export const metadata: Metadata = {
  title: locationsContent.pl.meta.title,
  description: locationsContent.pl.meta.description,
  alternates: alternates("locations", undefined, "pl"),
  openGraph: ogFor("pl", "locations"),
};

export default function Page() {
  return <LocationsView locale="pl" />;
}
