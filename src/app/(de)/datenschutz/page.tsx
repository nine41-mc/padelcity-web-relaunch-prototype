import type { Metadata } from "next";
import { LegalView } from "@/views/legal/LegalView";
import { legalContent } from "@/views/legal/legalContent";
import { alternates } from "@/lib/i18n/routes";

export const metadata: Metadata = {
  title: legalContent.privacy.de.title,
  description: legalContent.privacy.de.description,
  alternates: alternates("privacy", undefined, "de"),
};

export default function Page() {
  return <LegalView page="privacy" locale="de" />;
}
