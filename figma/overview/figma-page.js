// Builds the Figma page „🔗 Code Connect“ (file n3QOz0mQUCyzzVmxX4nKw3) from src/lib/codeConnect.json.
// Plugin-API script for the Figma MCP tool `use_figma`; it rebuilds the page completely on every run.
// Usage: node figma/overview/figma-page.mjs > /tmp/code.js, then pass that file content as `code`.
const DATA = /*DATA*/ null;

const PAGE = "🔗 Code Connect";
const AREAS = ["Basis", "Layout", "Karten", "Events", "Standorte", "Module", "Barrierefreiheit"];
const CARD_W = 400;
const THUMB_H = 200;

const vars = Object.fromEntries((await figma.variables.getLocalVariablesAsync()).map((v) => [v.name, v]));
const styles = Object.fromEntries((await figma.getLocalTextStylesAsync()).map((s) => [s.name, s]));
for (const s of ["Label/Eyebrow", "Display/Display MD", "Display/Display SM", "Body/Lead", "Title/Card", "Body/Small", "Body/Small SemiBold", "Caption/Caption 1"])
  await figma.loadFontAsync(styles[s].fontName);

const paint = (name) => figma.variables.setBoundVariableForPaint({ type: "SOLID", color: { r: 0, g: 0, b: 0 } }, "color", vars[name]);
const bindAll = (node, props, name) => props.forEach((p) => node.setBoundVariable(p, vars[name]));
const text = (chars, style, color, width) => {
  const t = figma.createText();
  t.textStyleId = styles[style].id;
  t.characters = chars;
  t.fills = [paint(color)];
  if (width) {
    t.resize(width, t.height);
    t.textAutoResize = "HEIGHT";
  }
  return t;
};
const stack = (name, dir, gap) => {
  const f = figma.createAutoLayout(dir);
  f.name = name;
  f.fills = [];
  f.itemSpacing = gap;
  return f;
};

// Page: reuse or create it right after „📖 Start hier“
let page = figma.root.children.find((p) => p.name === PAGE);
if (!page) {
  page = figma.createPage();
  page.name = PAGE;
  const start = figma.root.children.findIndex((p) => p.name.includes("Start hier"));
  figma.root.insertChild(start + 1, page);
}
await figma.setCurrentPageAsync(page);
for (const n of [...page.children]) n.remove();

const root = stack("Code Connect", "VERTICAL", 64);
root.fills = [paint("Background/color-background")];
bindAll(root, ["paddingTop", "paddingRight", "paddingBottom", "paddingLeft"], "Spacings/spacing-24");
root.resize(1440, 100);
root.primaryAxisSizingMode = "AUTO";
root.counterAxisSizingMode = "FIXED";
page.appendChild(root);

const components = DATA.entries.filter((e) => e.kind === "component");
const assets = DATA.entries.filter((e) => e.kind !== "component");
const count = (k) => DATA.entries.filter((e) => e.kind === k).length;

const intro = stack("Intro", "VERTICAL", 16);
root.appendChild(intro);
intro.layoutSizingHorizontal = "FILL";
intro.appendChild(text("LIBRARY ↔ CODE", "Label/Eyebrow", "Highlight/color-highlight"));
intro.appendChild(text("Code Connect", "Display/Display MD", "Text/color-text"));
const lead = text(
  `${count("component")} Komponenten, ${count("icon")} Icons, ${count("logo")} Logos und ${count("flag")} Länderflaggen der Library sind mit den React-Komponenten des Prototyps verknüpft. ` +
    "Dev Mode zeigt für eine ausgewählte Instanz den passenden Code. Jede Karte nennt die Code-Komponente, ihre Datei und die Figma-Eigenschaften, die im Code ankommen – " +
    "Hover, Fokus und Offen sind CSS- bzw. Laufzeit-Zustände ohne Prop. Ein Klick auf den Namen springt zur Komponente. " +
    "Diese Seite wird aus den Code-Connect-Vorlagen erzeugt (figma/overview im Prototyp); dieselbe Liste steht unter /styleguide#code-connect.",
  "Body/Lead",
  "Text/color-text-secondary",
  1248,
);
intro.appendChild(lead);

const created = [];
for (const area of AREAS) {
  const rows = components.filter((e) => e.area === area);
  if (!rows.length) continue;
  const section = stack(area, "VERTICAL", 24);
  root.appendChild(section);
  section.layoutSizingHorizontal = "FILL";
  section.appendChild(text(area.toUpperCase(), "Display/Display SM", "Text/color-text"));
  const grid = stack("Karten", "HORIZONTAL", 24);
  grid.layoutWrap = "WRAP";
  grid.counterAxisSpacing = 24;
  section.appendChild(grid);
  grid.layoutSizingHorizontal = "FILL";

  for (const e of rows) {
    const node = await figma.getNodeByIdAsync(e.nodeId);
    const card = stack(e.figma, "VERTICAL", 16);
    card.fills = [paint("Card/color-background")];
    card.strokes = [paint("Card/color-border")];
    bindAll(card, ["strokeTopWeight", "strokeRightWeight", "strokeBottomWeight", "strokeLeftWeight"], "Border/border-width");
    bindAll(card, ["topLeftRadius", "topRightRadius", "bottomLeftRadius", "bottomRightRadius"], "Radius/radius-xl");
    bindAll(card, ["paddingTop", "paddingRight", "paddingBottom", "paddingLeft"], "Spacings/spacing-6");
    card.resize(CARD_W, 100);
    card.primaryAxisSizingMode = "AUTO";
    card.counterAxisSizingMode = "FIXED";
    grid.appendChild(card);

    // Preview: an instance of the component (default variant), scaled to fit
    const thumb = figma.createFrame();
    thumb.name = "Vorschau";
    thumb.fills = [paint("Background/color-background")];
    bindAll(thumb, ["topLeftRadius", "topRightRadius", "bottomLeftRadius", "bottomRightRadius"], "Radius/radius-lg");
    thumb.clipsContent = true;
    card.appendChild(thumb);
    thumb.resize(CARD_W - 48, THUMB_H);
    thumb.layoutSizingHorizontal = "FILL";
    const main = node.type === "COMPONENT_SET" ? node.defaultVariant : node;
    const inst = main.createInstance();
    thumb.appendChild(inst);
    // rescale() rewrites the font sizes of the instance, so its fonts must be loaded
    for (const t of inst.findAllWithCriteria({ types: ["TEXT"] }))
      for (const f of t.getRangeAllFontNames(0, t.characters.length)) await figma.loadFontAsync(f);
    const pad = 16;
    const scale = Math.min(1, (thumb.width - 2 * pad) / inst.width, (THUMB_H - 2 * pad) / inst.height);
    if (scale < 1) inst.rescale(scale);
    inst.x = Math.round((thumb.width - inst.width) / 2);
    inst.y = Math.round((THUMB_H - inst.height) / 2);

    const name = text(e.figma, "Title/Card", "Text/color-text", CARD_W - 48);
    name.setRangeHyperlink(0, e.figma.length, { type: "NODE", value: e.nodeId });
    card.appendChild(name);
    card.appendChild(text(`<${e.code} />`, "Body/Small SemiBold", "Text/color-text", CARD_W - 48));
    card.appendChild(text(e.source.replace("src/components/", ""), "Caption/Caption 1", "Text/color-text-secondary", CARD_W - 48));
    const props = e.props.length ? e.props.map((p) => `${p.name} (${p.kind})`).join(" · ") : "Keine Figma-Eigenschaften – Inhalte kommen aus den Daten.";
    card.appendChild(text(props, "Body/Small", "Text/color-text-secondary", CARD_W - 48));
    created.push(card.id);
  }
}

// Icons, logos, flags: naming rule instead of 94 cards
const assetsBox = stack("Icons, Logos, Flaggen", "VERTICAL", 16);
root.appendChild(assetsBox);
assetsBox.layoutSizingHorizontal = "FILL";
assetsBox.appendChild(text("ICONS, LOGOS, FLAGGEN", "Display/Display SM", "Text/color-text"));
const rule = [
  `icon/app/<name> → <AppIcon name="<name>" /> (${assets.filter((e) => e.figma.startsWith("icon/app/")).length} App-Icons)`,
  `icon/ui/<name> → lucide-react, z. B. icon/ui/map-pin → <MapPin /> (${assets.filter((e) => e.figma.startsWith("icon/ui/")).length} UI-Icons)`,
  `logo/<name> → <Logo /> bzw. die Datei unter /brand (${count("logo")} Logos)`,
  `flag/country_<XX> → <CountryFlag country="XX" /> (${count("flag")} Flaggen)`,
].join("\n");
assetsBox.appendChild(text(rule, "Body/Lead", "Text/color-text-secondary", 1248));

root.x = 0;
root.y = 0;
return { page: page.id, root: root.id, cards: created.length };
