import type { Metadata } from "next";
import { AppView } from "@/views/app/AppView";
import { appContent } from "@/lib/content/app";
import { alternates } from "@/lib/i18n/routes";
import { ogFor } from "@/lib/og";

export const metadata: Metadata = {
  title: appContent.pl.meta.title,
  description: appContent.pl.meta.description,
  alternates: alternates("app", undefined, "pl"),
  openGraph: ogFor("pl", "app"),
  other: { "apple-itunes-app": "app-id=6451471569" },
};

export default function Page() {
  return <AppView locale="pl" />;
}
