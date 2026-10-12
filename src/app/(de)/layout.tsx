import "../globals.css";
import { SiteShell, siteMetadata, siteViewport } from "@/components/layout/SiteShell";

export const metadata = siteMetadata("de");
export const viewport = siteViewport;

export default function DeLayout({ children }: { children: React.ReactNode }) {
  return <SiteShell locale="de">{children}</SiteShell>;
}
