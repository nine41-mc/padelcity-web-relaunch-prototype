import type { Metadata } from "next";
import { StyleguideView } from "@/views/styleguide/StyleguideView";

// Hidden easter egg (footer © line) – not linked anywhere else, never indexed.
export const metadata: Metadata = { title: "Styleguide", robots: { index: false, follow: false } };

export default function Page() {
  return <StyleguideView locale="de" />;
}
