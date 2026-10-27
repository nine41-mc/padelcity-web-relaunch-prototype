// Captures a local prototype page into the Figma file (html-to-design) – one page, one width, one capture ID.
// usage: node capture.cjs <path> <width> <captureId | preview:<file.png>>   (dev server on http://localhost:3010, see README.md)
const { chromium } = require("playwright");

// Capture mode: the page is laid out statically, as a designer needs it in Figma.
const CAPTURE_CSS = `
  /* Next.js dev overlay is not part of the design */
  nextjs-portal { display: none !important; }
  /* App feature story: the sticky phone swaps screens while scrolling – a capture only sees the first one.
     Show one phone per feature next to its text instead. */
  @media (min-width: 1024px) {
    [data-story] { display: block !important; }
    [data-story-sticky] { display: none !important; }
    [data-story] article { display: grid !important; grid-template-columns: minmax(0, 1fr) auto; align-items: center;
      min-height: 0 !important; padding-top: 80px !important; padding-bottom: 80px !important; opacity: 1 !important; }
    [data-story-inline] { display: flex !important; }
  }
`;

const [path, width, id] = process.argv.slice(2);
(async () => {
  const browser = await chromium.launch();
  const mobile = Number(width) < 768;
  const ctx = await browser.newContext({
    viewport: { width: Number(width), height: mobile ? 844 : 900 },
    isMobile: mobile,
    hasTouch: mobile,
    deviceScaleFactor: 1,
    reducedMotion: "reduce",
  });
  const p = await ctx.newPage();
  await p.goto("http://localhost:3010" + path, { waitUntil: "load", timeout: 90000 });
  await p.waitForTimeout(2500);
  // cookie banner: the privacy-friendly choice, as a visitor would
  const essential = p.getByRole("button", { name: /Nur essenzielle|Only essential|Tylko niezbędne/i });
  if (await essential.count()) await essential.first().click();
  await p.addStyleTag({ content: CAPTURE_CSS });
  // walk the page so lazy images and reveal effects load
  let h = await p.evaluate(() => document.documentElement.scrollHeight);
  for (let y = 0; y < h; y += 500) {
    await p.evaluate((y) => window.scrollTo(0, y), y);
    await p.waitForTimeout(100);
    h = await p.evaluate(() => document.documentElement.scrollHeight);
  }
  await p.evaluate(() => window.scrollTo(0, 0));
  await p.waitForTimeout(1500);
  // prototype-only highlight colour switcher (brand discussion) is not part of the design
  await p.evaluate(() => document.querySelectorAll("button.fixed.bottom-4.left-4").forEach((e) => e.remove()));
  // App icons are CSS masks (AppIcon) – html-to-design does not understand masks and turns them into grey boxes.
  // Swap each one for the inline SVG in its rendered colour and size, so Figma gets editable vectors.
  const icons = await p.evaluate(async () => {
    const svgs = {};
    let swapped = 0;
    for (const el of [...document.querySelectorAll("body *")]) {
      const s = getComputedStyle(el);
      const mask = s.maskImage && s.maskImage !== "none" ? s.maskImage : s.webkitMaskImage;
      const url = mask && mask !== "none" && (mask.match(/url\("?([^")]+\.svg)"?\)/) || [])[1];
      const r = el.getBoundingClientRect();
      if (!url || !r.width) continue;
      svgs[url] ??= await (await fetch(url)).text();
      const svg = new DOMParser().parseFromString(svgs[url], "image/svg+xml").documentElement;
      // every painted part takes the mask colour (the element's background, bg-current)
      for (const n of [svg, ...svg.querySelectorAll("*")])
        for (const a of ["fill", "stroke"]) if (n.getAttribute(a) && n.getAttribute(a) !== "none") n.setAttribute(a, "currentColor");
      svg.setAttribute("width", String(r.width));
      svg.setAttribute("height", String(r.height));
      svg.setAttribute("aria-hidden", "true");
      Object.assign(svg.style, {
        color: s.backgroundColor, opacity: s.opacity, display: s.display === "inline" ? "inline-block" : s.display, flexShrink: "0",
        margin: s.margin, verticalAlign: s.verticalAlign, position: s.position, inset: s.position === "static" ? "" : s.inset,
      });
      el.replaceWith(document.importNode(svg, true));
      swapped++;
    }
    return swapped;
  });
  console.log(path, width, "icons as svg:", icons);
  if (id.startsWith("preview:")) {
    // dry run: full-page screenshot of exactly what would be captured, nothing is sent to Figma
    await p.screenshot({ path: id.slice(8), fullPage: true });
    console.log(path, width, "preview", id.slice(8));
    return browser.close();
  }
  const script = await ctx.request.get("https://mcp.figma.com/mcp/html-to-design/capture.js");
  await p.evaluate((s) => {
    const el = document.createElement("script");
    el.textContent = s;
    document.head.appendChild(el);
  }, await script.text());
  await p.waitForTimeout(500);
  const res = await Promise.race([
    new Promise((r) => setTimeout(() => r("timeout-240s (capture usually already submitted)"), 240000)),
    p.evaluate(
      (id) => window.figma.captureForDesign({ captureId: id, endpoint: `https://mcp.figma.com/mcp/capture/${id}/submit?bindVariables=true`, selector: "body" }),
      id,
    ),
  ]);
  console.log(path, width, JSON.stringify(res).slice(0, 200));
  await browser.close();
})().catch((e) => {
  console.log("ERR", path, width, e.message.slice(0, 200));
  process.exit(1);
});
