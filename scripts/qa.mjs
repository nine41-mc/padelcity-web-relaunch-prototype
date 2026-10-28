// Page QA for the static export: crawls every internal link, then checks each page in phone and desktop width.
//
//   npm run build && npm run qa                 all pages, 390 and 1440 px
//   npm run qa -- --only /,/events/             only these paths
//   npm run qa -- --widths 768                  other widths
//   npm run qa -- --base https://…              a deployed site instead of out/ (no password-protected builds)
//
// Checks: HTTP status of every internal link, pages missing from the sitemaps, console errors and uncaught page
// errors, failed same-origin requests, horizontal overflow, broken images, axe (WCAG 2.2 AA).
// Report: .qa/report.json · exit code 1 when anything is found. See QA.md.
import { createServer } from "node:http";
import { existsSync, mkdirSync, readFileSync, statSync, writeFileSync } from "node:fs";
import { extname, join } from "node:path";
import { chromium } from "playwright";
import { AxeBuilder } from "@axe-core/playwright";

const arg = (name, fallback) => {
  const i = process.argv.indexOf(`--${name}`);
  return i > -1 ? process.argv[i + 1] : fallback;
};
const widths = arg("widths", "390,1440").split(",").map(Number);
const only = arg("only", "")?.split(",").filter(Boolean);
const outDir = arg("dir", "out");
const PARALLEL = 4;
// Pages that are deliberately not in the sitemaps
const NOT_IN_SITEMAP = [
  "/coming-soon/", // placeholder target of app and web-app links until they are live (src/lib/site.ts)
];
const SITEMAPS = ["/sitemap/", "/en/sitemap/", "/pl/mapa-strony/"];
const START = ["/", "/en/", "/pl/", ...SITEMAPS];

// ---------------------------------------------------------------------------------------------- static server
const TYPES = { ".html": "text/html", ".js": "text/javascript", ".css": "text/css", ".json": "application/json", ".svg": "image/svg+xml", ".png": "image/png", ".jpg": "image/jpeg", ".jpeg": "image/jpeg", ".webp": "image/webp", ".avif": "image/avif", ".ico": "image/x-icon", ".woff2": "font/woff2", ".woff": "font/woff", ".mp4": "video/mp4", ".txt": "text/plain", ".xml": "application/xml" };
const serve = () =>
  new Promise((resolve) => {
    if (!existsSync(join(outDir, "index.html"))) {
      console.error(`${outDir}/index.html fehlt – erst „npm run build“ ausführen.`);
      process.exit(2);
    }
    const server = createServer((req, res) => {
      let path = decodeURIComponent(new URL(req.url, "http://x").pathname);
      let file = join(outDir, path);
      if (existsSync(file) && statSync(file).isDirectory()) file = join(file, "index.html");
      if (!existsSync(file)) {
        res.writeHead(404, { "content-type": "text/html" });
        return res.end(existsSync(join(outDir, "404.html")) ? readFileSync(join(outDir, "404.html")) : "");
      }
      res.writeHead(200, { "content-type": TYPES[extname(file)] ?? "application/octet-stream" });
      res.end(readFileSync(file));
    });
    server.listen(0, () => resolve({ server, base: `http://localhost:${server.address().port}` }));
  });

const external = arg("base");
const { server, base } = external ? { server: null, base: external.replace(/\/$/, "") } : await serve();

// ---------------------------------------------------------------------------------------------- crawl
const findings = [];
const add = (check, where, detail) => findings.push({ check, where, detail });
const norm = (href) => {
  const u = new URL(href, base);
  if (u.origin !== base) return null;
  let p = u.pathname;
  if (/\.[a-z0-9]+$/i.test(p)) return null;
  if (!p.endsWith("/")) p += "/";
  return p;
};
const status = new Map();
const linkedFrom = new Map();
const queue = [...START];
while (queue.length) {
  const path = queue.shift();
  if (status.has(path)) continue;
  const res = await fetch(base + path, { redirect: "manual" }).catch(() => null);
  status.set(path, res ? res.status : 0);
  if (!res || res.status !== 200) continue;
  const html = await res.text();
  for (const [, href] of html.matchAll(/href="([^"#?]*)/g)) {
    const p = norm(href);
    if (!p) continue;
    if (!linkedFrom.has(p)) linkedFrom.set(p, path);
    if (!status.has(p)) queue.push(p);
  }
}
for (const [path, code] of status) if (code !== 200) add("Link-Ziel nicht erreichbar", path, `HTTP ${code}, verlinkt von ${linkedFrom.get(path)}`);
const pages = [...status].filter(([, code]) => code === 200).map(([path]) => path);
for (const sitemap of SITEMAPS) {
  const html = await (await fetch(base + sitemap)).text();
  const listed = new Set([...html.matchAll(/href="([^"#?]*)/g)].map(([, h]) => norm(h)).filter(Boolean));
  const prefix = sitemap.startsWith("/en/") ? "/en/" : sitemap.startsWith("/pl/") ? "/pl/" : null;
  const own = pages.filter((p) => (prefix ? p.startsWith(prefix) : !p.startsWith("/en/") && !p.startsWith("/pl/")));
  for (const p of own) if (!listed.has(p) && !NOT_IN_SITEMAP.includes(p)) add("Fehlt in der Sitemap", p, sitemap);
}

// ---------------------------------------------------------------------------------------------- page checks
const routes = only.length ? only : pages;
const browser = await chromium.launch();
const check = async (ctx, path, width) => {
  const page = await ctx.newPage();
  const where = `${path} @${width}`;
  page.on("console", (m) => m.type() === "error" && add("Konsolenfehler", where, m.text().slice(0, 200)));
  page.on("pageerror", (e) => add("Seitenfehler", where, e.message.slice(0, 200)));
  page.on("response", (r) => r.status() >= 400 && r.url().startsWith(base) && add("Fehlgeschlagene Anfrage", where, `${r.status()} ${r.url().slice(base.length)}`));
  try {
    await page.goto(base + path, { waitUntil: "load", timeout: 60000 });
  } catch (e) {
    add("Seite lädt nicht", where, e.message.slice(0, 120));
    return page.close();
  }
  // Cookie banner: essential only, then scroll once through the page so lazy content renders
  const essential = page.getByRole("button", { name: /Nur essenzielle|Only essential|Tylko niezbędne/i });
  if (await essential.count()) await essential.first().click().catch(() => {});
  let height = await page.evaluate(() => document.documentElement.scrollHeight);
  for (let y = 0; y < height; y += 800) {
    await page.evaluate((top) => window.scrollTo(0, top), y);
    await page.waitForTimeout(40);
    height = await page.evaluate(() => document.documentElement.scrollHeight);
  }
  await page.evaluate(() => window.scrollTo(0, 0));
  await page.waitForTimeout(300);
  const dom = await page.evaluate(() => ({
    overflow: document.documentElement.scrollWidth - document.documentElement.clientWidth,
    broken: [...document.images].filter((i) => i.complete && i.naturalWidth === 0 && i.getAttribute("src")).map((i) => i.getAttribute("src")),
  }));
  if (dom.overflow > 0) add("Horizontales Scrollen", where, `${dom.overflow} px`);
  for (const src of dom.broken) add("Bild lädt nicht", where, src.slice(0, 120));
  const axe = await new AxeBuilder({ page }).withTags(["wcag2a", "wcag2aa", "wcag21a", "wcag21aa", "wcag22aa"]).analyze();
  for (const v of axe.violations) add(`axe: ${v.id}`, where, `${v.nodes.length}× – ${v.nodes[0].target.join(" ").slice(0, 120)}`);
  await page.close();
};
for (const width of widths) {
  const mobile = width < 768;
  const ctx = await browser.newContext({ viewport: { width, height: 900 }, isMobile: mobile, hasTouch: mobile, reducedMotion: "reduce" });
  const todo = [...routes];
  let done = 0;
  await Promise.all(
    Array.from({ length: PARALLEL }, async () => {
      for (let path = todo.shift(); path; path = todo.shift()) {
        await check(ctx, path, width);
        if (++done % 25 === 0) console.log(`${width} px: ${done}/${routes.length}`);
      }
    }),
  );
  await ctx.close();
}
await browser.close();
server?.close();

// ---------------------------------------------------------------------------------------------- report
mkdirSync(".qa", { recursive: true });
writeFileSync(".qa/report.json", JSON.stringify({ base, widths, pages: routes.length, findings }, null, 2));
const byCheck = Object.groupBy(findings, (f) => f.check);
console.log(`\n${routes.length} Seiten × ${widths.length} Breiten geprüft, ${pages.length} Seiten verlinkt, ${findings.length} Funde.`);
for (const [checkName, list] of Object.entries(byCheck)) {
  console.log(`\n✗ ${checkName} (${list.length})`);
  for (const f of list.slice(0, 8)) console.log(`  ${f.where}  ${f.detail}`);
  if (list.length > 8) console.log(`  … ${list.length - 8} weitere in .qa/report.json`);
}
process.exit(findings.length ? 1 : 0);
