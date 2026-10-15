import type { Metadata } from "next";
import { ContentModelView } from "@/views/contentModel/ContentModelView";

// Internal overview for the relaunch team (written in German, like the styleguide) – linked in the footer, not indexed.
export const metadata: Metadata = { title: "Content-Modell", robots: { index: false, follow: false } };

export default function Page() {
  return <ContentModelView locale="en" />;
}
