import type { Metadata } from "next";
import { InvestorsView } from "@/views/investors/InvestorsView";
import { investorsContent } from "@/lib/content/investors";
import { alternates } from "@/lib/i18n/routes";
import { ogFor } from "@/lib/og";

export const metadata: Metadata = {
  title: investorsContent.en.meta.title,
  description: investorsContent.en.meta.description,
  alternates: alternates("investors", undefined, "en"),
  openGraph: ogFor("en", "investors"),
};

export default function Page() {
  return <InvestorsView locale="en" />;
}
