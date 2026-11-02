import type { Metadata } from "next";
import { MagazineView } from "@/views/magazine/MagazineView";
import { magazinContent } from "@/lib/content/magazin";
import { alternates } from "@/lib/i18n/routes";
import { ogFor } from "@/lib/og";

export const metadata: Metadata = {
  title: magazinContent.en.meta.title,
  description: magazinContent.en.meta.description,
  alternates: alternates("magazine", undefined, "en"),
  openGraph: ogFor("en", "magazine"),
};

export default function Page() {
  return <MagazineView locale="en" />;
}
