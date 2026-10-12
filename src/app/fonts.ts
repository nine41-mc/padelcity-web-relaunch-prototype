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
  src: [{ path: "./fonts/licensed/SoehneSchmal-FettKursiv.ttf", weight: "800", style: "italic" }],
});

export const goodBrush = localFont({
  variable: "--font-good-brush",
  display: "swap",
  src: [{ path: "./fonts/licensed/GoodBrush.otf", weight: "400", style: "normal" }],
});
