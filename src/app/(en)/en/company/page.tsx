import type { Metadata } from "next";
import { CompanyView } from "@/views/company/CompanyView";
import { companyContent } from "@/lib/content/company";
import { alternates } from "@/lib/i18n/routes";

export const metadata: Metadata = {
  title: companyContent.en.meta.title,
  description: companyContent.en.meta.description,
  alternates: alternates("company", undefined, "en"),
};

export default function Page() {
  return <CompanyView locale="en" />;
}
