import type { Metadata, Viewport } from "next";
import { A11yPanel } from "@/components/a11y/A11yPanel";
import { a11yPrePaintScript } from "@/lib/a11y-prepaint";
import { themePrePaintScript } from "@/lib/theme";
import { goodBrush, poppins, soehneSchmal } from "@/app/fonts";
import type { Locale } from "@/lib/i18n/config";
import { localeTags } from "@/lib/i18n/config";
import { getDictionary } from "@/lib/i18n/dictionaries";
import { Header } from "./Header";
import { Footer } from "./Footer";
import { basePath } from "@/lib/asset";

export const siteViewport: Viewport = { themeColor: "#0b0b0f" };

export function siteMetadata(locale: Locale): Metadata {
  const descriptions: Record<Locale, string> = {
    de: "PadelCity ist Deutschlands führender Padel-Betreiber: 30+ Clubs, Academy, Events und eine Community, die Padel zum Breitensport macht. Courts buchst du in der PadelCity App.",
    en: "PadelCity is Germany's leading padel operator: 30+ clubs, academy, events and a community making padel a sport for everyone. Book your court in the PadelCity app.",
    pl: "PadelCity to wiodący operator padla w Niemczech: 30+ klubów, akademia, eventy i społeczność, która sprawia, że padel staje się sportem dla wszystkich. Korty zarezerwujesz w aplikacji PadelCity.",
  };
  const description = descriptions[locale];
  return {
    metadataBase: new URL("https://www.padelcity.de"),
    title: { default: "PadelCity – Let's play Padel!", template: "%s | PadelCity" },
    description,
    openGraph: { type: "website", locale: localeTags[locale].og, siteName: "PadelCity" },
    robots: { index: false, follow: false }, // prototype
  };
}

const skipCls =
  "sr-only focus:not-sr-only focus:fixed focus:left-4 focus:top-4 focus:z-[60] focus:rounded-full focus:bg-optic-500 focus:px-4 focus:py-2 focus:text-on-optic";

/**
 * The single 404 document (static export: one 404.html for every URL) detects /en/... and /pl/... before paint:
 * sets <html lang="en|pl" data-locale="en|pl">, which swaps skip link + footer via the variants below.
 */
const detectLocaleScript = `(function(){var p=location.pathname.slice(${JSON.stringify(basePath)}.length);var l=["en","pl"];for(var i=0;i<l.length;i++){if(p==="/"+l[i]||p.indexOf("/"+l[i]+"/")===0){var h=document.documentElement;h.lang=l[i];h.setAttribute("data-locale",l[i]);break;}}})();`;
const onlyDe = "[html[data-locale=en]_&]:hidden [html[data-locale=pl]_&]:hidden";
const onlyEn = "hidden [html[data-locale=en]_&]:block";
const onlyPl = "hidden [html[data-locale=pl]_&]:block";

/** Root document for one locale (DE, EN and PL each have their own root layout). `bilingual`: 404 document for all locales. */
export function SiteShell({ locale, children, bilingual = false }: { locale: Locale; children: React.ReactNode; bilingual?: boolean }) {
  const t = getDictionary(locale);
  return (
    <html
      lang={localeTags[locale].lang}
      className={`${poppins.variable} ${soehneSchmal.variable} ${goodBrush.variable}`}
      // the pre-paint scripts set lang/data-a11y-*/data-theme on <html> before React hydrates
      suppressHydrationWarning
    >
      <body className="antialiased">
        {/* display preferences of the accessibility panel (data-a11y-* on <html>), applied before paint */}
        <script dangerouslySetInnerHTML={{ __html: a11yPrePaintScript }} />
        {/* light / dark (data-theme on <html>): stored choice, else the system setting – before paint */}
        <script dangerouslySetInnerHTML={{ __html: themePrePaintScript }} />
        {/* without JS the fade-in never runs – show Reveal content (see globals.css) */}
        <noscript>
          <style>{"[data-reveal]{opacity:1!important;transform:none!important}"}</style>
        </noscript>
        {bilingual ? (
          <>
            <script dangerouslySetInnerHTML={{ __html: detectLocaleScript }} />
            <a href="#main" className={`${skipCls} ${onlyDe}`}>
              {getDictionary("de").header.skip}
            </a>
            <a href="#main" lang="en" className={`${skipCls} ${onlyEn}`}>
              {getDictionary("en").header.skip}
            </a>
            <a href="#main" lang="pl" className={`${skipCls} ${onlyPl}`}>
              {getDictionary("pl").header.skip}
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
            <div className={onlyPl} lang="pl">
              <Footer locale="pl" />
            </div>
          </>
        ) : (
          <Footer locale={locale} />
        )}
        <A11yPanel />
      </body>
    </html>
  );
}
