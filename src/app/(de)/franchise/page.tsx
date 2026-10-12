import type { Metadata } from "next";
import { FranchiseView } from "@/views/franchise/FranchiseView";
import { franchiseContent } from "@/lib/content/franchise";
import { alternates } from "@/lib/i18n/routes";

export const metadata: Metadata = {
  title: franchiseContent.de.meta.title,
  description: franchiseContent.de.meta.description,
  alternates: alternates("franchise", undefined, "de"),
};

export default function Page() {
  return <FranchiseView locale="de" />;
}
