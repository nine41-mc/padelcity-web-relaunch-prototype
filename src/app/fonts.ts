import localFont from "next/font/local";

// Poppins (OFL) is committed. Söhne Schmal (Klim) + Good Brush are licensed: they live in the private
// repo nine41-mc/padelcity-brand-fonts and are copied to ./fonts/licensed/ (gitignored) – locally by hand, in CI via deploy key.
// Web licences confirmed by PadelCity (Oct 2026) – embedding on the site is fine, redistributing the files is not.
export const poppins = localFont({
  variable: "--font-poppins",
  display: "swap",
  src: [
    { path: "./fonts/Poppins-Regular.ttf", weight: "400", style: "normal" },
    { path: "./fonts/Poppins-Medium.ttf", weight: "500", style: "normal" },
    { path: "./fonts/Poppins-SemiBold.ttf", weight: "600", style: "normal" },
    { path: "./fonts/Poppins-Bold.ttf", weight: "700", style: "normal" },
  ],
});

export const soehneSchmal = localFont({
  variable: "--font-soehne-schmal",
  display: "swap",
  // next/font's auto fallback (Arial, size-adjust 69%) is ~24% wider than the condensed caps → headlines
  // re-wrap when the font swaps in (CLS up to 0.25). Use a fallback tuned on uppercase italic widths instead
  // (@font-face "soehneSchmal Tuned Fallback" in globals.css).
  adjustFontFallback: false,
  fallback: ["soehneSchmal Tuned Fallback", "Arial Narrow", "sans-serif"],
  src: [{ path: "./fonts/licensed/SoehneSchmal-FettKursiv.ttf", weight: "800", style: "italic" }],
});

export const goodBrush = localFont({
  variable: "--font-good-brush",
  display: "swap",
  src: [{ path: "./fonts/licensed/GoodBrush.otf", weight: "400", style: "normal" }],
});
