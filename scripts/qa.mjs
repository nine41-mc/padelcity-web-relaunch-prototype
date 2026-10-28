// Page QA for the static export: crawls every internal link, then checks each page in phone, tablet and desktop width.
//
//   npm run build && npm run qa                 all pages, 390, 768 and 1440 px, Chromium
//   npm run qa -- --browsers all                also WebKit (Safari) and Firefox – or e.g. --browsers webkit
//   npm run qa -- --only /,/events/             only these paths
//   npm run qa -- --widths 768                  other widths
//   npm run qa -- --parallel 2                  fewer pages at once (small CI runners)
//   npm run qa -- --seo-only                    links, sitemap, redirects and SEO only – no browser (seconds)
//   npm run qa -- --base https://…              a deployed site instead of out/ (no password-protected builds)
//
// Checks: HTTP status of every internal link, pages missing from the sitemaps, console errors and uncaught page
// errors, failed same-origin requests, horizontal overflow, broken images, axe (WCAG 2.2 AA); then the interactive
// parts (menus, overlays, filter, search, language switch, accordion, share) – see INTERACTIONS. Every target in
// seo/redirects-draft.csv must be a page of the export (see REDIRECTS).
// Report: .qa/report.json · exit code 1 when anything is found. See QA.md.
import { createServer } from "node:http";
import { existsSync, mkdirSync, readFileSync, statSync, writeFileSync } from "node:fs";
import { extname, join } from "node:path";
import { chromium, firefox, webkit } from "playwright";
import { AxeBuilder } from "@axe-core/playwright";

const arg = (name, fallback) => {
  const i = process.argv.indexOf(`--${name}`);
  return i > -1 ? process.argv[i + 1] : fallback;
};
const widths = arg("widths", "390,768,1440").split(",").map(Number);
const ENGINES = { chromium, webkit, firefox };
const browserArg = arg("browsers", "chromium");
const engines = browserArg === "all" ? Object.keys(ENGINES) : browserArg.split(",");
for (const name of engines) {
  if (ENGINES[name]) continue;
  console.error(`Unbekannter Browser „${name}“ – chromium, webkit, firefox oder all.`);
  process.exit(2);
}
const only = arg("only", "")?.split(",").filter(Boolean);
const outDir = arg("dir", "out");
const PARALLEL = Number(arg("parallel", "4")); // pages checked at once per width – lower on small runners
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
// Notes are reported but do not fail the run (content to tune, e.g. snippet lengths)
const notes = [];
const note = (check, where, detail) => notes.push({ check, where, detail });
const norm = (href) => {
  const u = new URL(href, base);
  if (u.origin !== base) return null;
  let p = u.pathname;
  if (/\.[a-z0-9]+$/i.test(p)) return null;
  if (!p.endsWith("/")) p += "/";
  return p;
};
const status = new Map();
const htmlOf = new Map();
const linkedFrom = new Map();
const queue = [...START];
while (queue.length) {
  const path = queue.shift();
  if (status.has(path)) continue;
  const res = await fetch(base + path, { redirect: "manual" }).catch(() => null);
  status.set(path, res ? res.status : 0);
  if (!res || res.status !== 200) continue;
  const html = await res.text();
  htmlOf.set(path, html);
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

// ---------------------------------------------------------------------------------------------- redirects
// seo/redirects-draft.csv (alte_url;neue_url;status;hinweis): every old URL once, a target for every row that is not
// „offen“, and every target is a page of the export.
const REDIRECTS = "seo/redirects-draft.csv";
const STATES = ["eindeutig", "prüfen", "offen"];
if (existsSync(REDIRECTS)) {
  const [head, ...rows] = readFileSync(REDIRECTS, "utf8").trim().split("\n");
  if (head !== "alte_url;neue_url;status;hinweis") add("Weiterleitungen: Kopfzeile", REDIRECTS, head);
  const seen = new Set();
  for (const [i, row] of rows.entries()) {
    const where = `${REDIRECTS}:${i + 2}`;
    const [from, to, state, ...rest] = row.split(";");
    if (rest.length !== 1) add("Weiterleitungen: Spaltenzahl", where, row.slice(0, 120));
    if (!/^\/.*\/$/.test(from ?? "")) add("Weiterleitungen: alte URL", where, `„${from}“ muss mit / beginnen und enden`);
    if (seen.has(from)) add("Weiterleitungen: alte URL doppelt", where, from);
    seen.add(from);
    if (!STATES.includes(state)) add("Weiterleitungen: Status", where, `„${state}“ – erlaubt: ${STATES.join(", ")}`);
    if (!to) {
      if (state !== "offen") add("Weiterleitungen: Ziel fehlt", where, `${from} (${state})`);
      continue;
    }
    const [path] = to.split("#"); // a fragment may point at a module (/#newsletter)
    const target = norm(path);
    if (!target || target !== path) { add("Weiterleitungen: Ziel", where, `„${to}“ ist kein Seitenpfad mit / am Ende`); continue; }
    if (!status.has(target)) status.set(target, (await fetch(base + target, { redirect: "manual" }).catch(() => null))?.status ?? 0);
    if (status.get(target) !== 200) add("Weiterleitungen: Ziel nicht erreichbar", where, `${from} → ${to} (HTTP ${status.get(target)})`);
    const id = to.split("#")[1];
    if (id && status.get(target) === 200 && !(await (await fetch(base + target)).text()).includes(`id="${id}"`)) add("Weiterleitungen: Anker fehlt", where, `${to} – kein Element mit id="${id}"`);
  }
}

// ---------------------------------------------------------------------------------------------- SEO
// Per page from the served HTML: title, description, one h1, canonical, hreflang (targets exist and link back),
// <html lang>, and the JSON-LD blocks (valid JSON, required fields per type, our URLs absolute and existing).
// Canonical and hreflang point at the production domain – they are checked by path against this export.
const SITE = "https://www.padelcity.de";
const INTERNAL = /^\/(?:(?:en|pl)\/)?(styleguide|content-modell|content-model|model-tresci|coming-soon|404)\//; // noindex helpers
const decode = (s) => s.replace(/&amp;/g, "&").replace(/&#x27;|&#39;/g, "'").replace(/&quot;/g, '"').replace(/&lt;/g, "<").replace(/&gt;/g, ">");
const attrs = (tag) => Object.fromEntries([...tag.matchAll(/([\w:-]+)="([^"]*)"/g)].map(([, k, v]) => [k.toLowerCase(), decode(v)]));
const tags = (html, name) => [...html.matchAll(new RegExp(`<${name}\\b[^>]*>`, "gi"))].map(([t]) => attrs(t));
const sitePath = (url) => (url && url.startsWith(SITE) ? new URL(url).pathname : null);
const exists = async (path) => {
  if (!status.has(path)) status.set(path, (await fetch(base + path, { redirect: "manual" }).catch(() => null))?.status ?? 0);
  return status.get(path) === 200;
};
const seen = { title: new Map(), description: new Map() };
const alternatesOf = new Map();
for (const path of pages) {
  const html = htmlOf.get(path);
  const internal = INTERNAL.test(path);
  const lang = /<html[^>]*\slang="([^"]+)"/.exec(html)?.[1];
  const title = decode(/<title>([^<]*)<\/title>/.exec(html)?.[1] ?? "").trim();
  const description = tags(html, "meta").find((m) => m.name === "description")?.content?.trim() ?? "";
  if (!title) add("SEO: Titel fehlt", path, "");
  if (!description) add("SEO: Beschreibung fehlt", path, "");
  if (!internal) {
    for (const [key, value] of [["title", title], ["description", description]]) {
      if (!value) continue;
      const k = `${lang}|${value}`;
      if (seen[key].has(k)) add(`SEO: ${key === "title" ? "Titel" : "Beschreibung"} doppelt`, path, `wie ${seen[key].get(k)}`);
      else seen[key].set(k, path);
    }
    if (description && (description.length < 50 || description.length > 160)) note("SEO: Beschreibung kürzer als 50 oder länger als 160 Zeichen", path, `${description.length} Zeichen`);
    if (/\n|•/.test(description)) add("SEO: Beschreibung mit Zeilenumbruch oder Aufzählung", path, description.slice(0, 80));
    if (title.length > 65) note("SEO: Titel länger als 65 Zeichen", path, `${title.length} Zeichen`);
  }
  const h1 = (html.match(/<h1[\s>]/g) ?? []).length;
  if (h1 !== 1 && !path.startsWith("/404")) add("SEO: nicht genau eine h1", path, `${h1}×`);
  if (internal) continue; // noindex helpers: no canonical, hreflang or structured data
  const links = tags(html, "link");
  const canonical = links.filter((l) => l.rel === "canonical");
  if (canonical.length !== 1) add("SEO: Canonical fehlt oder mehrfach", path, `${canonical.length}×`);
  else if (sitePath(canonical[0].href) !== path && !path.startsWith("/404")) add("SEO: Canonical zeigt nicht auf die Seite", path, canonical[0].href);
  const alternates = Object.fromEntries(links.filter((l) => l.rel === "alternate" && l.hreflang).map((l) => [l.hreflang, l.href]));
  alternatesOf.set(path, alternates);
  if (path.startsWith("/404")) continue;
  if (!Object.keys(alternates).length) add("SEO: hreflang fehlt", path, "");
  else {
    if (sitePath(alternates[lang]) !== path) add("SEO: hreflang der eigenen Sprache zeigt nicht auf die Seite", path, `${lang} → ${alternates[lang] ?? "fehlt"}`);
    if (!alternates["x-default"]) add("SEO: hreflang x-default fehlt", path, "");
    for (const [code, url] of Object.entries(alternates)) {
      const target = sitePath(url);
      if (!target || !(await exists(target))) add("SEO: hreflang-Ziel nicht erreichbar", path, `${code} → ${url}`);
    }
  }
  // JSON-LD
  for (const [, raw] of html.matchAll(/<script type="application\/ld\+json"[^>]*>([\s\S]*?)<\/script>/g)) {
    let data;
    try {
      data = JSON.parse(raw);
    } catch (e) {
      add("JSON-LD: kein gültiges JSON", path, e.message.slice(0, 100));
      continue;
    }
    for (const item of [].concat(data["@graph"] ?? data)) await checkJsonLd(item, path);
  }
}
// hreflang must be mutual: every alternate lists this page under its own language
for (const [path, alternates] of alternatesOf) {
  for (const [code, url] of Object.entries(alternates)) {
    const target = sitePath(url);
    if (code === "x-default" || !target || target === path || !alternatesOf.has(target)) continue;
    const back = alternatesOf.get(target);
    if (!Object.values(back).some((u) => sitePath(u) === path)) add("SEO: hreflang ohne Rückverweis", path, `${code} → ${target} verweist nicht zurück`);
  }
}

async function checkJsonLd(item, path) {
  const type = item["@type"];
  const where = `${path} (${type ?? "?"})`;
  if (item["@context"] !== "https://schema.org") add("JSON-LD: @context fehlt", where, String(item["@context"]));
  if (!type) return add("JSON-LD: @type fehlt", where, "");
  const missing = (obj, keys) => keys.filter((k) => k.split(".").reduce((o, part) => o?.[part], obj) == null || k.split(".").reduce((o, part) => o?.[part], obj) === "");
  const REQUIRED = {
    SportsEvent: ["name", "startDate", "location.name", "location.address.addressLocality", "location.address.addressCountry"],
    SportsActivityLocation: ["name", "url", "address.streetAddress", "address.postalCode", "address.addressLocality", "address.addressCountry", "geo.latitude", "geo.longitude"],
    Article: ["headline", "datePublished", "author.name", "image", "mainEntityOfPage"],
    FAQPage: ["mainEntity"],
    Organization: ["name", "url", "logo"],
    MobileApplication: ["name", "operatingSystem", "applicationCategory"],
  };
  if (!REQUIRED[type]) return add("JSON-LD: unbekannter Typ – Pflichtfelder in scripts/qa.mjs ergänzen", where, type);
  for (const key of missing(item, REQUIRED[type])) add("JSON-LD: Pflichtfeld fehlt", where, key);
  if (type === "SportsEvent") {
    for (const key of ["startDate", "endDate"]) if (item[key] && !/^\d{4}-\d\d-\d\dT\d\d:\d\d(:\d\d)?(Z|[+-]\d\d:\d\d)$/.test(item[key])) add("JSON-LD: Datum ohne Zeitzone", where, `${key} ${item[key]}`);
    if (item.endDate && Date.parse(item.endDate) < Date.parse(item.startDate)) add("JSON-LD: Ende vor Beginn", where, `${item.startDate} → ${item.endDate}`);
  }
  if (type === "FAQPage") for (const [i, q] of (item.mainEntity ?? []).entries()) for (const key of missing(q, ["name", "acceptedAnswer.text"])) add("JSON-LD: Pflichtfeld fehlt", where, `mainEntity[${i}].${key}`);
  if (type === "Article" && item.headline?.length > 110) add("JSON-LD: headline länger als 110 Zeichen", where, `${item.headline.length}`);
  // Every string: no stray whitespace; every URL absolute; our page URLs end with / and exist
  const walk = async (value, key) => {
    if (Array.isArray(value)) for (const v of value) await walk(v, key);
    else if (value && typeof value === "object") for (const [k, v] of Object.entries(value)) await walk(v, k);
    else if (typeof value === "string") {
      if (value !== value.trim()) add("JSON-LD: Leerzeichen am Rand", where, `${key}: „${value.slice(0, 40)}“`);
      if (/^(url|mainEntityOfPage|image|logo|sameAs|installUrl)$/.test(key) && !/^https:\/\//.test(value)) add("JSON-LD: URL nicht absolut", where, `${key}: ${value}`);
      const own = sitePath(value);
      if (own && /^(url|mainEntityOfPage)$/.test(key) && !/\.[a-z0-9]+$/i.test(own)) {
        if (!own.endsWith("/")) add("JSON-LD: Seiten-URL ohne / am Ende", where, `${key}: ${value}`);
        else if (!(await exists(own))) add("JSON-LD: Seiten-URL nicht erreichbar", where, `${key}: ${value}`);
      }
    }
  };
  await walk(item, "");
}

// ---------------------------------------------------------------------------------------------- page checks
const routes = only.length ? only : pages;
const seoOnly = process.argv.includes("--seo-only");
// Firefox has no mobile emulation and no clipboard permissions in Playwright
const contextFor = (engine, width, extra = {}) => {
  const mobile = width < 768 && engine !== "firefox";
  const permissions = engine === "chromium" ? { permissions: ["clipboard-read", "clipboard-write"] } : {};
  return { viewport: { width, height: 900 }, isMobile: mobile, hasTouch: mobile, reducedMotion: "reduce", ...permissions, ...extra };
};
const label = (engine) => (engines.length > 1 ? ` ${engine}` : "");
// For contrast findings: what axe measured (text and background colour, ratio) – tells a real issue from a
// rendering difference between environments
const measured = (v) => {
  const d = v.id === "color-contrast" ? v.nodes[0].any?.[0]?.data : null;
  return d ? ` (${d.fgColor} auf ${d.bgColor}, ${d.contrastRatio}:1, nötig ${d.expectedContrastRatio})` : "";
};
const check = async (ctx, path, width, engine) => {
  const page = await ctx.newPage();
  const where = `${path} @${width}${label(engine)}`;
  page.on("console", (m) => m.type() === "error" && add("Konsolenfehler", where, m.text().slice(0, 200)));
  page.on("pageerror", (e) => add("Seitenfehler", where, e.message.slice(0, 200)));
  page.on("response", (r) => r.status() >= 400 && r.url().startsWith(base) && add("Fehlgeschlagene Anfrage", where, `${r.status()} ${r.url().slice(base.length)}`));
  try {
    await page.goto(base + path, { waitUntil: "load", timeout: 60000 });
  } catch (e) {
    add("Seite lädt nicht", where, e.message.slice(0, 120));
    return page.close();
  }
  // Scroll once through the page so lazy content renders
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
  for (const v of axe.violations) add(`axe: ${v.id}`, where, `${v.nodes.length}× – ${v.nodes[0].target.join(" ").slice(0, 120)}${measured(v)}`);
  await page.close();
};
const checkPages = async (browser, engine) => {
  for (const width of widths) {
    const ctx = await browser.newContext(contextFor(engine, width));
    const todo = [...routes];
    let done = 0;
    await Promise.all(
      Array.from({ length: PARALLEL }, async () => {
        for (let path = todo.shift(); path; path = todo.shift()) {
          await check(ctx, path, width, engine);
          if (++done % 25 === 0) console.log(`${engine} ${width} px: ${done}/${routes.length}`);
        }
      }),
    );
    await ctx.close();
  }
};
// ---------------------------------------------------------------------------------------------- interactions
// Overlays, menus and controls: each opens without errors, fits the viewport, has a close button, closes with Esc
// and passes axe while open. Skipped with --only (a quick run) or --no-interactions.
const dialogSel = "dialog[open], [role=dialog]:not([hidden]), [aria-modal=true]";
const opensDialog = (open) => async (page, where) => {
  await open(page);
  const dialog = page.locator(dialogSel).first();
  await dialog.waitFor({ state: "visible", timeout: 5000 });
  await page.waitForTimeout(700); // let the slide-in finish before measuring
  const box = await dialog.boundingBox();
  const vw = page.viewportSize().width;
  if (box.x < -1 || box.x + box.width > vw + 1) add("Interaktion: Overlay passt nicht in die Breite", where, `${Math.round(box.x)}–${Math.round(box.x + box.width)} px`);
  if (!(await dialog.getByRole("button", { name: /schließen|close|zamknij/i }).count())) add("Interaktion: Overlay ohne Schließen-Button", where, "");
  const axe = await new AxeBuilder({ page }).withTags(["wcag2a", "wcag2aa", "wcag21a", "wcag21aa", "wcag22aa"]).analyze();
  for (const v of axe.violations) add(`Interaktion: axe ${v.id}`, where, `${v.nodes.length}× – ${v.nodes[0].target.join(" ").slice(0, 120)}`);
  await page.keyboard.press("Escape");
  await page.waitForTimeout(400);
  if (await page.locator(dialogSel).first().isVisible().catch(() => false)) add("Interaktion: Esc schließt nicht", where, "");
};
const expects = (act, check, message) => async (page, where) => {
  await act(page);
  await page.waitForTimeout(600);
  if (!(await check(page))) add(`Interaktion: ${message}`, where, page.url().slice(base.length));
};
const button = (page, name) => page.getByRole("button", { name }).first();
const INTERACTIONS = [
  // The mobile menu is a disclosure (aria-expanded, page inert), not a dialog
  [390, "/", "Mobilmenü", async (page, where) => {
    const toggle = page.locator("button[aria-controls=mobile-menu]");
    await toggle.click();
    const menu = page.locator("#mobile-menu");
    await menu.waitFor({ state: "visible", timeout: 5000 });
    await page.waitForTimeout(400);
    if ((await toggle.getAttribute("aria-expanded")) !== "true") add("Interaktion: Menü-Button ohne aria-expanded", where, "");
    const axe = await new AxeBuilder({ page }).withTags(["wcag2a", "wcag2aa", "wcag21a", "wcag21aa", "wcag22aa"]).analyze();
    for (const v of axe.violations) add(`Interaktion: axe ${v.id}`, where, `${v.nodes.length}× – ${v.nodes[0].target.join(" ").slice(0, 120)}`);
    await page.keyboard.press("Escape");
    await page.waitForTimeout(500);
    if (await menu.isVisible().catch(() => false)) add("Interaktion: Esc schließt nicht", where, "");
    if (!(await toggle.evaluate((el) => el === document.activeElement))) add("Interaktion: Fokus nicht zurück am Menü-Button", where, "");
  }],
  [390, "/", "WhatsApp-Gruppen", opensDialog((p) => button(p, /WhatsApp/i).click())],
  [1440, "/", "Barrierefreiheit-Panel", opensDialog((p) => button(p, /Barrierefreiheit: Darstellung anpassen/).click())],
  [1440, "/", "Sprachwechsel", expects((p) => p.getByRole("link", { name: /^en\b/i }).first().click(), (p) => p.url().endsWith("/en/"), "Sprachwechsel führt nicht nach /en/")],
  [1440, "/", "Club-Suche", expects(async (p) => { await p.getByRole("searchbox").or(p.getByLabel(/Stadt oder Club/)).first().fill("Berlin"); await p.keyboard.press("Enter"); }, (p) => /\/standorte\/\?q=Berlin/.test(p.url()), "Suche führt nicht zu /standorte/?q=Berlin")],
  [390, "/standorte/", "Filter", opensDialog((p) => button(p, /Filter/i).click())],
  [1440, "/standorte/regensburg/", "Club-Info", opensDialog((p) => button(p, /^Info$/).click())],
  [390, "/standorte/regensburg/", "Galerie", opensDialog((p) => button(p, /vergrößern/).click())],
  [1440, "/standorte/regensburg/", "Öffnungszeiten", expects((p) => p.locator("button[aria-expanded=false]").filter({ hasText: /Geöffnet|Geschlossen/ }).first().click(), (p) => p.locator("button[aria-expanded=true]").filter({ hasText: /Geöffnet|Geschlossen/ }).count(), "Öffnungszeiten klappen nicht auf")],
  [1440, "/academy/", "Coach-Dialog", opensDialog((p) => button(p, /Kontakt & Preise von/).click())],
  [1440, "/faq/", "FAQ-Akkordeon", expects((p) => p.locator("main details:not([open]) > summary").first().click(), (p) => p.locator("main details[open]").count(), "FAQ klappt nicht auf")],
  // With a share sheet (Safari/WebKit) the button hands the URL to navigator.share, otherwise it copies and confirms
  [1440, "/events/afterwork-americano-berlin/", "Teilen", expects(
    async (p) => {
      await p.evaluate(() => { if (navigator.share) navigator.share = async (data) => { window.__shared = data; }; });
      await button(p, /Teilen/).click();
    },
    async (p) => (await p.evaluate(() => window.__shared?.url === location.href.split("#")[0])) || (await p.getByText(/kopiert|copied|skopiowano/i).count()),
    "Teilen öffnet weder das Teilen-Menü noch bestätigt es das Kopieren",
  )],
];
const checkInteractions = async (browser, engine) => {
  for (const [width, path, name, run] of INTERACTIONS) {
    const ctx = await browser.newContext(contextFor(engine, width, { viewport: { width, height: 844 } }));
    const page = await ctx.newPage();
    const where = `${name} (${path} @${width}${label(engine)})`;
    page.on("pageerror", (e) => add("Interaktion: Seitenfehler", where, e.message.slice(0, 200)));
    page.on("console", (m) => m.type() === "error" && add("Interaktion: Konsolenfehler", where, m.text().slice(0, 200)));
    try {
      await page.goto(base + path, { waitUntil: "load", timeout: 60000 });
      await page.waitForTimeout(500);
      await run(page, where);
    } catch (e) {
      add("Interaktion: Ablauf fehlgeschlagen", where, e.message.split("\n")[0].slice(0, 160));
    }
    await ctx.close();
  }
  console.log(`${engine}: ${INTERACTIONS.length} Interaktionen geprüft.`);
};

for (const engine of seoOnly ? [] : engines) {
  const browser = await ENGINES[engine].launch();
  await checkPages(browser, engine);
  if (!only.length && !process.argv.includes("--no-interactions")) await checkInteractions(browser, engine);
  await browser.close();
}
server?.close();

// ---------------------------------------------------------------------------------------------- report
mkdirSync(".qa", { recursive: true });
writeFileSync(".qa/report.json", JSON.stringify({ base, browsers: engines, widths, pages: routes.length, findings, notes }, null, 2));
const byCheck = Object.groupBy(findings, (f) => f.check);
console.log(seoOnly
  ? `\n${pages.length} Seiten geprüft (Links, Sitemap, Weiterleitungen, SEO – ohne Browser), ${findings.length} Funde.`
  : `\n${routes.length} Seiten × ${widths.length} Breiten × ${engines.length} Browser geprüft, ${pages.length} Seiten verlinkt, ${findings.length} Funde.`);
for (const [checkName, list] of Object.entries(byCheck)) {
  console.log(`\n✗ ${checkName} (${list.length})`);
  for (const f of list.slice(0, 8)) console.log(`  ${f.where}  ${f.detail}`);
  if (list.length > 8) console.log(`  … ${list.length - 8} weitere in .qa/report.json`);
}
const notesByCheck = Object.groupBy(notes, (f) => f.check);
for (const [checkName, list] of Object.entries(notesByCheck)) {
  console.log(`\nℹ Hinweis: ${checkName} (${list.length})`);
  for (const f of list.slice(0, 5)) console.log(`  ${f.where}  ${f.detail}`);
  if (list.length > 5) console.log(`  … ${list.length - 5} weitere in .qa/report.json`);
}
process.exit(findings.length ? 1 : 0);
