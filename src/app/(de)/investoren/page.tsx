import type { Metadata } from "next";
import { InvestorsView } from "@/views/investors/InvestorsView";
import { investorsContent } from "@/lib/content/investors";
import { alternates } from "@/lib/i18n/routes";

export const metadata: Metadata = {
  title: investorsContent.de.meta.title,
  description: investorsContent.de.meta.description,
  alternates: alternates("investors", undefined, "de"),
};

export default function Page() {
  return <InvestorsView locale="de" />;
}
