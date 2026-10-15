import type { Metadata } from "next";
import { MagazineView } from "@/views/magazine/MagazineView";
import { magazinContent } from "@/lib/content/magazin";
import { alternates } from "@/lib/i18n/routes";

export const metadata: Metadata = {
  title: magazinContent.pl.meta.title,
  description: magazinContent.pl.meta.description,
  alternates: alternates("magazine", undefined, "pl"),
};

export default function Page() {
  return <MagazineView locale="pl" />;
}
