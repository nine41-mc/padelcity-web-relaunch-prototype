import type { Metadata } from "next";
import { AboutView } from "@/views/about/AboutView";
import { aboutContent } from "@/lib/content/about";
import { alternates } from "@/lib/i18n/routes";

export const metadata: Metadata = {
  title: aboutContent.de.meta.title,
  description: aboutContent.de.meta.description,
  alternates: alternates("about", undefined, "de"),
};

export default function Page() {
  return <AboutView locale="de" />;
}
