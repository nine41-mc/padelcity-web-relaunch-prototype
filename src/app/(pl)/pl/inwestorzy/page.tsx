import type { Metadata } from "next";
import { InvestorsView } from "@/views/investors/InvestorsView";
import { investorsContent } from "@/lib/content/investors";
import { alternates } from "@/lib/i18n/routes";

export const metadata: Metadata = {
  title: investorsContent.pl.meta.title,
  description: investorsContent.pl.meta.description,
  alternates: alternates("investors", undefined, "pl"),
};

export default function Page() {
  return <InvestorsView locale="pl" />;
}
