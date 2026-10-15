import type { Metadata } from "next";
import { AcademyView } from "@/views/academy/AcademyView";
import { academyContent } from "@/lib/content/academy";
import { alternates } from "@/lib/i18n/routes";

export const metadata: Metadata = {
  title: academyContent.pl.meta.title,
  description: academyContent.pl.meta.description,
  alternates: alternates("academy", undefined, "pl"),
};

export default function Page() {
  return <AcademyView locale="pl" />;
}
