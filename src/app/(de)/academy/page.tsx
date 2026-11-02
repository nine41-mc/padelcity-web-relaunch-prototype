import type { Metadata } from "next";
import { AcademyView } from "@/views/academy/AcademyView";
import { academyContent } from "@/lib/content/academy";
import { alternates } from "@/lib/i18n/routes";
import { ogFor } from "@/lib/og";

export const metadata: Metadata = {
  title: academyContent.de.meta.title,
  description: academyContent.de.meta.description,
  alternates: alternates("academy", undefined, "de"),
  openGraph: ogFor("de", "academy"),
};

export default function Page() {
  return <AcademyView locale="de" />;
}
