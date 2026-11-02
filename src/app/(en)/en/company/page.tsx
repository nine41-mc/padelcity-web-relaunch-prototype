import type { Metadata } from "next";
import { CompanyView } from "@/views/company/CompanyView";
import { companyContent } from "@/lib/content/company";
import { alternates } from "@/lib/i18n/routes";
import { ogFor } from "@/lib/og";

export const metadata: Metadata = {
  title: companyContent.en.meta.title,
  description: companyContent.en.meta.description,
  alternates: alternates("company", undefined, "en"),
  openGraph: ogFor("en", "company"),
};

export default function Page() {
  return <CompanyView locale="en" />;
}
