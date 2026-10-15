import "../../globals.css";
import { SiteShell, siteMetadata, siteViewport } from "@/components/layout/SiteShell";

export const metadata = siteMetadata("pl");
export const viewport = siteViewport;

export default function PlLayout({ children }: { children: React.ReactNode }) {
  return <SiteShell locale="pl">{children}</SiteShell>;
}
