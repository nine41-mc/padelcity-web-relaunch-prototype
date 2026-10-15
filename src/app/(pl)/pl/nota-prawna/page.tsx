import type { Metadata } from "next";
import { LegalView } from "@/views/legal/LegalView";
import { legalContent } from "@/views/legal/legalContent";
import { alternates } from "@/lib/i18n/routes";

export const metadata: Metadata = {
  title: legalContent.imprint.pl.title,
  description: legalContent.imprint.pl.description,
  alternates: alternates("imprint", undefined, "pl"),
};

export default function Page() {
  return <LegalView page="imprint" locale="pl" />;
}
