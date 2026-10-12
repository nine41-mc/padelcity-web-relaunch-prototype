import type { Metadata } from "next";
import { LegalView } from "@/views/legal/LegalView";
import { legalContent } from "@/views/legal/legalContent";
import { alternates } from "@/lib/i18n/routes";

export const metadata: Metadata = {
  title: legalContent.imprint.en.title,
  description: legalContent.imprint.en.description,
  alternates: alternates("imprint", undefined, "en"),
};

export default function Page() {
  return <LegalView page="imprint" locale="en" />;
}
