import type { Metadata } from "next";
import { CompanyView } from "@/views/company/CompanyView";
import { companyContent } from "@/lib/content/company";
import { alternates } from "@/lib/i18n/routes";

export const metadata: Metadata = {
  title: companyContent.pl.meta.title,
  description: companyContent.pl.meta.description,
  alternates: alternates("company", undefined, "pl"),
};

export default function Page() {
  return <CompanyView locale="pl" />;
}
