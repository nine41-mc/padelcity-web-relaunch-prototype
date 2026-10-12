import type { Metadata } from "next";
import { PartnersView } from "@/views/partners/PartnersView";
import { sponsoringContent } from "@/lib/content/sponsoring";
import { alternates } from "@/lib/i18n/routes";

export const metadata: Metadata = {
  title: sponsoringContent.de.meta.title,
  description: sponsoringContent.de.meta.description,
  alternates: alternates("partners", undefined, "de"),
};

export default function Page() {
  return <PartnersView locale="de" />;
}
