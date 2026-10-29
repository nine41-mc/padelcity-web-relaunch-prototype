import "./globals.css";
import { SiteShell } from "@/components/layout/SiteShell";
import { NotFoundContent } from "@/components/brand/NotFoundContent";

// One 404 document for both locales (static export → 404.html). It stays a full document via SiteShell;
// the content switches to English on the client for /en/... URLs (the header localises itself from the URL,
// skip link + footer are swapped before paint by SiteShell's `bilingual` mode).
export const metadata = {
  title: "404 – Ball im Aus / Ball out / Piłka w aucie | PadelCity",
  description: "Diese Seite gibt es nicht (mehr) – zurück zur Startseite oder eine Runde Padel-Pong. This page doesn't exist.",
  robots: { index: false },
};

export default function GlobalNotFound() {
  return (
    <SiteShell locale="de" bilingual>
      <NotFoundContent />
    </SiteShell>
  );
}
