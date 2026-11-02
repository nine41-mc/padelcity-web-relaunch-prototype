import type { Metadata } from "next";
import { FaqView } from "@/views/faq/FaqView";
import { faqContent } from "@/lib/content/faq";
import { alternates } from "@/lib/i18n/routes";
import { ogFor } from "@/lib/og";

export const metadata: Metadata = {
  title: faqContent.en.meta.title,
  description: faqContent.en.meta.description,
  alternates: alternates("faq", undefined, "en"),
  openGraph: ogFor("en", "faq"),
};

export default function Page() {
  return <FaqView locale="en" />;
}
