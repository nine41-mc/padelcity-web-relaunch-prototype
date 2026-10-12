import type { Metadata, Viewport } from "next";
import { goodBrush, poppins, soehneSchmal } from "@/app/fonts";
import type { Locale } from "@/lib/i18n/config";
import { localeTags } from "@/lib/i18n/config";
import { getDictionary } from "@/lib/i18n/dictionaries";
import { Header } from "./Header";
import { Footer } from "./Footer";

export const siteViewport: Viewport = { themeColor: "#0b0b0f" };

export function siteMetadata(locale: Locale): Metadata {
  const description =
    locale === "de"
      ? "PadelCity ist Deutschlands führender Padel-Betreiber: 30+ Clubs, Academy, Events und eine Community, die Padel zum Breitensport macht. Courts buchst du in der PadelCity App."
      : "PadelCity is Germany's leading padel operator: 30+ clubs, academy, events and a community making padel a sport for everyone. Book your court in the PadelCity app.";
  return {
    metadataBase: new URL("https://www.padelcity.de"),
    title: { default: "PadelCity – Let's play Padel!", template: "%s | PadelCity" },
    description,
    openGraph: { type: "website", locale: localeTags[locale].og, siteName: "PadelCity" },
    robots: { index: false, follow: false }, // prototype
  };
}

/** Root document for one locale (DE and EN each have their own root layout). */
export function SiteShell({ locale, children }: { locale: Locale; children: React.ReactNode }) {
  const t = getDictionary(locale);
  return (
    <html lang={localeTags[locale].lang} className={`${poppins.variable} ${soehneSchmal.variable} ${goodBrush.variable}`}>
      <body className="antialiased">
        <a
          href="#main"
          className="sr-only focus:not-sr-only focus:fixed focus:left-4 focus:top-4 focus:z-[60] focus:rounded-full focus:bg-neon-500 focus:px-4 focus:py-2 focus:text-ink-800"
        >
          {t.header.skip}
        </a>
        <Header />
        <main id="main">{children}</main>
        <Footer locale={locale} />
      </body>
    </html>
  );
}
