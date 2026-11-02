import type { Metadata } from "next";
import { FaqView } from "@/views/faq/FaqView";
import { faqContent } from "@/lib/content/faq";
import { alternates } from "@/lib/i18n/routes";
import { ogFor } from "@/lib/og";

export const metadata: Metadata = {
  title: faqContent.pl.meta.title,
  description: faqContent.pl.meta.description,
  alternates: alternates("faq", undefined, "pl"),
  openGraph: ogFor("pl", "faq"),
};

export default function Page() {
  return <FaqView locale="pl" />;
}
