import type { Metadata, Viewport } from "next";
import { goodBrush, poppins, soehneSchmal } from "@/app/fonts";
import type { Locale } from "@/lib/i18n/config";
import { localeTags } from "@/lib/i18n/config";
import { getDictionary } from "@/lib/i18n/dictionaries";
import { Header } from "./Header";
import { Footer } from "./Footer";
import { basePath } from "@/lib/asset";

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

const skipCls =
  "sr-only focus:not-sr-only focus:fixed focus:left-4 focus:top-4 focus:z-[60] focus:rounded-full focus:bg-neon-500 focus:px-4 focus:py-2 focus:text-ink-800";

/**
 * The single 404 document (static export: one 404.html for every URL) detects /en/... before paint:
 * sets <html lang="en" data-locale="en">, which swaps skip link + footer to English via the variants below.
 */
const detectLocaleScript = `(function(){var p=location.pathname.slice(${JSON.stringify(basePath)}.length);if(p==="/en"||p.indexOf("/en/")===0){var h=document.documentElement;h.lang="en";h.setAttribute("data-locale","en");}})();`;
const onlyDe = "[html[data-locale=en]_&]:hidden";
const onlyEn = "hidden [html[data-locale=en]_&]:block";

/** Root document for one locale (DE and EN each have their own root layout). `bilingual`: 404 document for both locales. */
export function SiteShell({ locale, children, bilingual = false }: { locale: Locale; children: React.ReactNode; bilingual?: boolean }) {
  const t = getDictionary(locale);
  return (
    <html
      lang={localeTags[locale].lang}
      className={`${poppins.variable} ${soehneSchmal.variable} ${goodBrush.variable}`}
      suppressHydrationWarning={bilingual}
    >
      <body className="antialiased">
        {bilingual ? (
          <>
            <script dangerouslySetInnerHTML={{ __html: detectLocaleScript }} />
            <a href="#main" className={`${skipCls} ${onlyDe}`}>
              {getDictionary("de").header.skip}
            </a>
            <a href="#main" lang="en" className={`${skipCls} ${onlyEn}`}>
              {getDictionary("en").header.skip}
            </a>
          </>
        ) : (
          <a href="#main" className={skipCls}>
            {t.header.skip}
          </a>
        )}
        <Header />
        {/* overflow-x-clip: rotated tickers/bleeds never create a horizontal scrollbar (clip keeps position:sticky working) */}
        <main id="main" className="overflow-x-clip">
          {children}
        </main>
        {bilingual ? (
          <>
            <div className={onlyDe}>
              <Footer locale="de" />
            </div>
            <div className={onlyEn}>
              <Footer locale="en" />
            </div>
          </>
        ) : (
          <Footer locale={locale} />
        )}
      </body>
    </html>
  );
}
