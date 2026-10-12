import type { Metadata } from "next";
import { FaqView } from "@/views/faq/FaqView";
import { faqContent } from "@/lib/content/faq";
import { alternates } from "@/lib/i18n/routes";

export const metadata: Metadata = {
  title: faqContent.de.meta.title,
  description: faqContent.de.meta.description,
  alternates: alternates("faq", undefined, "de"),
};

export default function Page() {
  return <FaqView locale="de" />;
}
