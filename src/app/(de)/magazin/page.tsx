import type { Metadata } from "next";
import { MagazineView } from "@/views/magazine/MagazineView";
import { magazinContent } from "@/lib/content/magazin";
import { alternates } from "@/lib/i18n/routes";
import { ogFor } from "@/lib/og";

export const metadata: Metadata = {
  title: magazinContent.de.meta.title,
  description: magazinContent.de.meta.description,
  alternates: alternates("magazine", undefined, "de"),
  openGraph: ogFor("de", "magazine"),
};

export default function Page() {
  return <MagazineView locale="de" />;
}
