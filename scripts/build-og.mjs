// Share previews: one 1200 × 630 card per page type and locale (public/og/<locale>/<key>.jpg), from the static export.
//
//   npm run build && npm run og      then commit public/og (run again after a hero photo or headline changes)
//
// Each card: the page's hero photo (src/lib/og.ts), its h1 as rendered in out/, the logo and the brand line.
// The brand fonts come from src/app/fonts – the card is a picture of the text, the font files never leave the repo.
import { createServer } from "node:http";
import { existsSync, mkdirSync, readFileSync, statSync } from "node:fs";
import { extname, join } from "node:path";
import { execFileSync } from "node:child_process";
import { chromium } from "playwright";

const OUT = "out";
const TYPES = { ".html": "text/html", ".js": "text/javascript", ".css": "text/css", ".svg": "image/svg+xml", ".png": "image/png", ".jpg": "image/jpeg", ".webp": "image/webp", ".ttf": "font/ttf", ".woff2": "font/woff2" };
if (!existsSync(join(OUT, "index.html"))) {
  console.error("out/index.html fehlt – erst „npm run build“ ausführen.");
  process.exit(2);
}
// og.ts and routes.ts are TypeScript – bundle them once for node
const bundle = join("scripts", ".og-config.mjs");
execFileSync("npx", ["-y", "esbuild", "src/lib/og-config.entry.ts", "--bundle", "--format=esm", "--platform=node", "--log-level=error", `--outfile=${bundle}`]);
const { ogCards, href, locales } = await import(`../${bundle}`);
execFileSync("rm", [bundle]);

// /__fonts/* from src/app/fonts, everything else from out/
const server = createServer((req, res) => {
  const path = decodeURIComponent(new URL(req.url, "http://x").pathname);
  let file = path.startsWith("/__fonts/") ? join("src/app/fonts", path.slice(9)) : join(OUT, path);
  if (existsSync(file) && statSync(file).isDirectory()) file = join(file, "index.html");
  if (!existsSync(file)) return res.writeHead(404).end();
  res.writeHead(200, { "content-type": TYPES[extname(file)] ?? "application/octet-stream" });
  res.end(readFileSync(file));
});
await new Promise((r) => server.listen(0, r));
const base = `http://localhost:${server.address().port}`;

const esc = (s) => s.replace(/[&<>]/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;" })[c]);
const card = (image, title) => `<!doctype html><html><head><meta charset="utf-8"><style>
  @font-face { font-family: Soehne; src: url(${base}/__fonts/licensed/SoehneSchmal-FettKursiv.ttf); font-weight: 800; font-style: italic; }
  @font-face { font-family: Poppins; src: url(${base}/__fonts/Poppins-SemiBold.ttf); font-weight: 600; }
  * { margin: 0; box-sizing: border-box; }
  body { width: 1200px; height: 630px; overflow: hidden; background: #0b0b0f; }
  .card { position: relative; width: 1200px; height: 630px; color: #fff; font-family: Poppins, sans-serif; }
  .card img.photo { position: absolute; inset: 0; width: 100%; height: 100%; object-fit: cover; }
  .card::before { content: ""; position: absolute; inset: 0; z-index: 1; background: linear-gradient(90deg, rgba(11,11,15,.92) 0%, rgba(11,11,15,.75) 45%, rgba(11,11,15,.15) 100%); }
  .inner { position: absolute; z-index: 2; inset: 64px 72px 80px; display: flex; flex-direction: column; justify-content: space-between; }
  .logo { height: 44px; width: auto; align-self: flex-start; }
  h1 { font-family: Soehne, "Arial Narrow", sans-serif; font-weight: 800; font-style: italic; text-transform: uppercase; font-size: 92px; line-height: .92; max-width: 860px; letter-spacing: -.005em; }
  .url { font-weight: 600; font-size: 22px; letter-spacing: .12em; text-transform: uppercase; opacity: .85; }
  .bar { position: absolute; z-index: 2; left: 0; right: 0; bottom: 0; height: 14px; background: linear-gradient(90deg, #8412b5, #e005c3); }
</style></head><body><div class="card"><img class="photo" src="${base}${image}" alt="">
<div class="inner"><img class="logo" src="${base}/brand/logo.svg" alt=""><div><h1>${esc(title)}</h1><p class="url" style="margin-top:28px">padelcity.de</p></div></div>
<div class="bar"></div></div></body></html>`;

const browser = await chromium.launch();
const page = await browser.newPage({ viewport: { width: 1200, height: 630 }, deviceScaleFactor: 1 });
let n = 0;
for (const locale of locales) {
  mkdirSync(join("public/og", locale), { recursive: true });
  for (const [key, { image }] of Object.entries(ogCards)) {
    const html = readFileSync(join(OUT, href(locale, key), "index.html"), "utf8");
    const h1 = html.match(/<h1[^>]*>([\s\S]*?)<\/h1>/);
    if (!h1) throw new Error(`kein h1 auf ${href(locale, key)}`);
    // text of the h1 without tags, entities decoded; line breaks become spaces
    const title = h1[1].replace(/<br\s*\/?>/g, " ").replace(/<[^>]+>/g, "").replace(/&amp;/g, "&").replace(/&#x27;|&#39;/g, "'").replace(/&quot;/g, '"').replace(/&nbsp;| /g, " ").replace(/\s+/g, " ").trim();
    await page.setContent(card(image, title), { waitUntil: "networkidle" });
    await page.evaluate(() => document.fonts.ready);
    // headline shrinks until it fits in three lines
    await page.evaluate(() => { const h = document.querySelector("h1"); let s = 92; while (h.getBoundingClientRect().height > 3 * s * 0.92 + 2 && s > 56) { s -= 4; h.style.fontSize = s + "px"; } });
    await page.screenshot({ path: join("public/og", locale, `${key}.jpg`), type: "jpeg", quality: 78 });
    console.log(locale, key, "–", title);
    n++;
  }
}
await browser.close();
server.close();
console.log(n, "Karten in public/og");
