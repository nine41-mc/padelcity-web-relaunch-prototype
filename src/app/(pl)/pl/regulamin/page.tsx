import type { Metadata } from "next";
import { LegalView } from "@/views/legal/LegalView";
import { legalContent } from "@/views/legal/legalContent";
import { alternates } from "@/lib/i18n/routes";

export const metadata: Metadata = {
  title: legalContent.terms.pl.title,
  description: legalContent.terms.pl.description,
  alternates: alternates("terms", undefined, "pl"),
};

export default function Page() {
  return <LegalView page="terms" locale="pl" />;
}
