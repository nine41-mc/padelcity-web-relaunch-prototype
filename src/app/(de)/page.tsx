import type { Metadata } from "next";
import { HomeView } from "@/views/home/HomeView";
import { homeContent } from "@/lib/content/home";
import { alternates } from "@/lib/i18n/routes";

export const metadata: Metadata = {
  description: homeContent.de.meta.description,
  alternates: alternates("home", undefined, "de"),
};

export default function Page() {
  return <HomeView locale="de" />;
}
