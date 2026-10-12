import type { Metadata } from "next";
import { FranchiseView } from "@/views/franchise/FranchiseView";
import { franchiseContent } from "@/lib/content/franchise";
import { alternates } from "@/lib/i18n/routes";

export const metadata: Metadata = {
  title: franchiseContent.en.meta.title,
  description: franchiseContent.en.meta.description,
  alternates: alternates("franchise", undefined, "en"),
};

export default function Page() {
  return <FranchiseView locale="en" />;
}
