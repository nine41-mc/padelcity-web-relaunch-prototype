import type { Metadata } from "next";
import { SitemapView } from "@/views/sitemap/SitemapView";
import { alternates } from "@/lib/i18n/routes";

export const metadata: Metadata = {
  title: "Sitemap",
  description: "All PadelCity pages, clubs, events and magazine articles at a glance.",
  alternates: alternates("sitemap", undefined, "en"),
};

export default function Page() {
  return <SitemapView locale="en" />;
}
