import type { Metadata } from "next";
import { AboutView } from "@/views/about/AboutView";
import { aboutContent } from "@/lib/content/about";
import { alternates } from "@/lib/i18n/routes";

export const metadata: Metadata = {
  title: aboutContent.pl.meta.title,
  description: aboutContent.pl.meta.description,
  alternates: alternates("about", undefined, "pl"),
};

export default function Page() {
  return <AboutView locale="pl" />;
}
