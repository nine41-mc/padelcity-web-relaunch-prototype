import type { Metadata } from "next";
import { FranchiseView } from "@/views/franchise/FranchiseView";
import { franchiseContent } from "@/lib/content/franchise";
import { alternates } from "@/lib/i18n/routes";

export const metadata: Metadata = {
  title: franchiseContent.pl.meta.title,
  description: franchiseContent.pl.meta.description,
  alternates: alternates("franchise", undefined, "pl"),
};

export default function Page() {
  return <FranchiseView locale="pl" />;
}
