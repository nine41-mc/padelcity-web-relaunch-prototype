import type { Metadata } from "next";
import { AcademyView } from "@/views/academy/AcademyView";
import { academyContent } from "@/lib/content/academy";
import { alternates } from "@/lib/i18n/routes";
import { ogFor } from "@/lib/og";

export const metadata: Metadata = {
  title: academyContent.en.meta.title,
  description: academyContent.en.meta.description,
  alternates: alternates("academy", undefined, "en"),
  openGraph: ogFor("en", "academy"),
};

export default function Page() {
  return <AcademyView locale="en" />;
}
