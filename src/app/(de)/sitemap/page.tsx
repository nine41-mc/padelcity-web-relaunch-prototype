import type { Metadata } from "next";
import { SitemapView } from "@/views/sitemap/SitemapView";
import { alternates } from "@/lib/i18n/routes";

export const metadata: Metadata = {
  title: "Sitemap",
  description: "Alle Seiten, Clubs, Events und Magazin-Artikel von PadelCity auf einen Blick.",
  alternates: alternates("sitemap", undefined, "de"),
};

export default function Page() {
  return <SitemapView locale="de" />;
}
