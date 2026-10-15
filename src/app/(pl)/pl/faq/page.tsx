import type { Metadata } from "next";
import { FaqView } from "@/views/faq/FaqView";
import { faqContent } from "@/lib/content/faq";
import { alternates } from "@/lib/i18n/routes";

export const metadata: Metadata = {
  title: faqContent.pl.meta.title,
  description: faqContent.pl.meta.description,
  alternates: alternates("faq", undefined, "pl"),
};

export default function Page() {
  return <FaqView locale="pl" />;
}
