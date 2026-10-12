import type { Metadata } from "next";
import { AboutView } from "@/views/about/AboutView";
import { aboutContent } from "@/lib/content/about";
import { alternates } from "@/lib/i18n/routes";

export const metadata: Metadata = {
  title: aboutContent.en.meta.title,
  description: aboutContent.en.meta.description,
  alternates: alternates("about", undefined, "en"),
};

export default function Page() {
  return <AboutView locale="en" />;
}
