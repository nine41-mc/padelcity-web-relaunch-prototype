import "../../globals.css";
import { SiteShell, siteMetadata, siteViewport } from "@/components/layout/SiteShell";

export const metadata = siteMetadata("en");
export const viewport = siteViewport;

export default function EnLayout({ children }: { children: React.ReactNode }) {
  return <SiteShell locale="en">{children}</SiteShell>;
}
