import type { Metadata } from "next";
import { StyleguideView } from "@/views/styleguide/StyleguideView";

// Hidden easter egg (footer © line). The styleguide itself is written in German.
export const metadata: Metadata = { title: "Styleguide", robots: { index: false, follow: false } };

export default function Page() {
  return <StyleguideView locale="en" />;
}
