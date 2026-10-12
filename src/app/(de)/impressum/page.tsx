import type { Metadata } from "next";
import { LegalView } from "@/views/legal/LegalView";
import { legalContent } from "@/views/legal/legalContent";
import { alternates } from "@/lib/i18n/routes";

export const metadata: Metadata = {
  title: legalContent.imprint.de.title,
  description: legalContent.imprint.de.description,
  alternates: alternates("imprint", undefined, "de"),
};

export default function Page() {
  return <LegalView page="imprint" locale="de" />;
}
