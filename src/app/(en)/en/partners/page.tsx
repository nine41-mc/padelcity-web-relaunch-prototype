import type { Metadata } from "next";
import { PartnersView } from "@/views/partners/PartnersView";
import { sponsoringContent } from "@/lib/content/sponsoring";
import { alternates } from "@/lib/i18n/routes";
import { ogFor } from "@/lib/og";

export const metadata: Metadata = {
  title: sponsoringContent.en.meta.title,
  description: sponsoringContent.en.meta.description,
  alternates: alternates("partners", undefined, "en"),
  openGraph: ogFor("en", "partners"),
};

export default function Page() {
  return <PartnersView locale="en" />;
}
