import type { Metadata } from "next";
import { AboutView } from "@/views/about/AboutView";
import { aboutContent } from "@/lib/content/about";
import { alternates } from "@/lib/i18n/routes";
import { ogFor } from "@/lib/og";

export const metadata: Metadata = {
  title: aboutContent.pl.meta.title,
  description: aboutContent.pl.meta.description,
  alternates: alternates("about", undefined, "pl"),
  openGraph: ogFor("pl", "about"),
};

export default function Page() {
  return <AboutView locale="pl" />;
}
