import type { Metadata } from "next";
import { AppView } from "@/views/app/AppView";
import { appContent } from "@/lib/content/app";
import { alternates } from "@/lib/i18n/routes";

export const metadata: Metadata = {
  title: appContent.de.meta.title,
  description: appContent.de.meta.description,
  alternates: alternates("app", undefined, "de"),
  other: { "apple-itunes-app": "app-id=6451471569" },
};

export default function Page() {
  return <AppView locale="de" />;
}
