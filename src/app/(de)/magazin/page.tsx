import type { Metadata } from "next";
import { MagazineView } from "@/views/magazine/MagazineView";
import { magazinContent } from "@/lib/content/magazin";
import { alternates } from "@/lib/i18n/routes";

export const metadata: Metadata = {
  title: magazinContent.de.meta.title,
  description: magazinContent.de.meta.description,
  alternates: alternates("magazine", undefined, "de"),
};

export default function Page() {
  return <MagazineView locale="de" />;
}
