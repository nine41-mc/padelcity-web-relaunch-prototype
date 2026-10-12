import "./globals.css";
import { SiteShell } from "@/components/layout/SiteShell";
import { NotFoundContent } from "@/components/brand/NotFoundContent";

// One 404 document for both locales (static export → 404.html). It stays a full document via SiteShell;
// the content switches to English on the client for /en/... URLs (the header localises itself from the URL).
export const metadata = { title: "404 – Ball im Aus / Ball out | PadelCity", robots: { index: false } };

export default function GlobalNotFound() {
  return (
    <SiteShell locale="de">
      <NotFoundContent />
    </SiteShell>
  );
}
