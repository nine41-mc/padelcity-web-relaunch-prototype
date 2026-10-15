import type { Metadata } from "next";
import { LegalView } from "@/views/legal/LegalView";
import { legalContent } from "@/views/legal/legalContent";
import { alternates } from "@/lib/i18n/routes";

export const metadata: Metadata = {
  title: legalContent.privacy.pl.title,
  description: legalContent.privacy.pl.description,
  alternates: alternates("privacy", undefined, "pl"),
};

export default function Page() {
  return <LegalView page="privacy" locale="pl" />;
}
