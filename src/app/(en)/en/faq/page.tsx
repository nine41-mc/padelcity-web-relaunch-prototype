import type { Metadata } from "next";
import { FaqView } from "@/views/faq/FaqView";
import { faqContent } from "@/lib/content/faq";
import { alternates } from "@/lib/i18n/routes";

export const metadata: Metadata = {
  title: faqContent.en.meta.title,
  description: faqContent.en.meta.description,
  alternates: alternates("faq", undefined, "en"),
};

export default function Page() {
  return <FaqView locale="en" />;
}
