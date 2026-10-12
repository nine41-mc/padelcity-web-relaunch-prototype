import type { Metadata } from "next";
import { LegalView } from "@/views/legal/LegalView";
import { legalContent } from "@/views/legal/legalContent";
import { alternates } from "@/lib/i18n/routes";

export const metadata: Metadata = {
  title: legalContent.privacy.en.title,
  description: legalContent.privacy.en.description,
  alternates: alternates("privacy", undefined, "en"),
};

export default function Page() {
  return <LegalView page="privacy" locale="en" />;
}
