import type { Metadata } from "next";
import { CompanyView } from "@/views/company/CompanyView";
import { companyContent } from "@/lib/content/company";
import { alternates } from "@/lib/i18n/routes";

export const metadata: Metadata = {
  title: companyContent.de.meta.title,
  description: companyContent.de.meta.description,
  alternates: alternates("company", undefined, "de"),
};

export default function Page() {
  return <CompanyView locale="de" />;
}
