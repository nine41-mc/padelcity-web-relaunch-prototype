// Quality audit for the Figma library "PadelCity Website Relaunch" (file n3QOz0mQUCyzzVmxX4nKw3).
// Plugin-API script: runs as-is via the Figma MCP tool `use_figma` (top-level await + return).
// Every run checks the same things; known, intended exceptions live in EXCEPTIONS below.
// An empty `findings` list means the library is clean. See README.md in this folder.

const EXCEPTIONS = {
  // Brand artwork with fixed colours, as in the code
  artworkComponents: ["Store Badge", "Voucher Card", "Club Map"],
  // Illustrations whose labels are decorative (grey neighbour-country names on the map, white 40 % as in code)
  contrastSkipComponents: ["Club Map"],
  // Documentation-only variables: there is no Figma property to bind them to
  unusedVariables: [/^Breakpoint\//],
  // Text that mixes two weights on purpose and therefore has no single text style
  textWithoutStyle: ["Testimonial Card › Quote"],
  // Shapes whose radius comes from `border-radius: 50%` in code, not from a token
  rawRadius: ["Map Pin › Body"],
  // Disabled controls are exempt from WCAG contrast
  contrastSkipVariant: /State=Disabled/,
  // Frames that stand for a photo (placeholder fill in the library) – like IMAGE fills, contrast depends on the photo
  photoFrames: ["photo"],
  // Display values in Gradient/Brand (text-brand-gradient, as in code): the purple start #8412B5 only reaches ~2.3:1
  // on ink – brand decision, open accessibility point for the design team
  gradientTextStyle: "S:b8f68bdafedc6ca4ff257476104254f9642d68f7,",
};
const PAGES = { foundations: "1:6", components: "1:7", icons: "13129:1060", start: "15232:5", contentModel: "15234:28" };
// Counting the content-model annotations loads ~20,000 layers and exceeds the use_figma time limit together with
// the rest – set to true and run on its own (the other checks are skipped then).
const COUNT_CONTENT_MODEL_ANNOTATIONS = false;
const EXPECTED_ANNOTATIONS = 176;
// "Sohne Schmal": since 28.10.2026 the Figma MCP (cloud) reports Söhne Schmal without the umlaut – the file itself
// still uses "Söhne Schmal" (checked in the browser with local fonts), so both names count as the brand font.
const BRAND_FONTS = ["Poppins", "Söhne Schmal", "Sohne Schmal", "GOOD BRUSH"];
const EXPECTED_GRIDS = ["Grid/Desktop", "Grid/Tablet", "Grid/Mobile"];

const findings = [];
const add = (check, item) => findings.push(`${check}: ${item}`);

if (COUNT_CONTENT_MODEL_ANNOTATIONS) {
  const page = await figma.getNodeByIdAsync(PAGES.contentModel);
  await page.loadAsync();
  let annotations = 0;
  for (const n of page.findAll((n) => n.annotations && n.annotations.length > 0)) annotations += n.annotations.length;
  if (annotations !== EXPECTED_ANNOTATIONS) add("Annotations auf der Content-Modell-Seite", `${annotations} statt ${EXPECTED_ANNOTATIONS}`);
  return { findings, stats: { contentModelAnnotations: annotations } };
}

// ---------------------------------------------------------------------------------------------------- variables
const vars = await figma.variables.getLocalVariablesAsync();
const cols = await figma.variables.getLocalVariableCollectionsAsync();
const byId = Object.fromEntries(vars.map((v) => [v.id, v]));
const layer = (v) => cols.find((c) => c.id === v.variableCollectionId).name.slice(0, 2); // "01".."05"
const isBase = (id) => byId[id] && layer(byId[id]) === "01";

for (const v of vars) {
  const values = Object.values(v.valuesByMode);
  if (v.scopes.includes("ALL_SCOPES")) add("Variable mit ALL_SCOPES", v.name);
  if (!v.codeSyntax.WEB) add("Variable ohne WEB-Code-Syntax", v.name);
  if (layer(v) !== "01" && !v.description) add("Variable ohne Beschreibung", v.name);
  if (["02", "03"].includes(layer(v)) && values.some((x) => !(x && x.type === "VARIABLE_ALIAS"))) add("Fester Wert in Alias-Ebene", v.name);
  for (const x of values) {
    if (x && x.type === "VARIABLE_ALIAS" && !byId[x.id]) add("Kaputter Alias", v.name);
    else if (x && x.type === "VARIABLE_ALIAS" && layer(byId[x.id]) > layer(v) && layer(v) !== "05") add("Alias zeigt auf höhere Ebene", v.name);
  }
}
const names = vars.map((v) => layer(v) + v.name);
for (const n of new Set(names.filter((n, i) => names.indexOf(n) !== i))) add("Doppelter Variablenname", n.slice(2));

// usage: aliases, text styles and every binding on library pages – including nodes inside instances
const used = new Set();
const markNode = (n) => {
  for (const k in n.boundVariables || {}) for (const a of [].concat(n.boundVariables[k])) if (a) used.add(a.id);
  for (const prop of ["fills", "strokes"]) {
    if (!(prop in n) || !Array.isArray(n[prop])) continue;
    for (const f of n[prop]) if (f.boundVariables && f.boundVariables.color) used.add(f.boundVariables.color.id);
  }
};
for (const v of vars) for (const x of Object.values(v.valuesByMode)) if (x && x.type === "VARIABLE_ALIAS") used.add(x.id);
for (const s of await figma.getLocalTextStylesAsync()) for (const a of Object.values(s.boundVariables || {})) used.add(a.id);
// setCurrentPageAsync (not just loadAsync): on a cold start the layers inside instances are otherwise not fully
// loaded yet, and tokens bound only there (icon colours) show up as unused
for (const key of ["foundations", "components", "icons", "start"]) {
  const page = await figma.getNodeByIdAsync(PAGES[key]);
  await figma.setCurrentPageAsync(page);
  for (const n of page.findAll(() => true)) markNode(n);
}
for (const v of vars) {
  if (layer(v) === "01" || used.has(v.id)) continue;
  if (EXCEPTIONS.unusedVariables.some((re) => re.test(v.name))) continue;
  add("Unbenutzte Variable", v.name);
}

// ---------------------------------------------------------------------------------------------------- components
const componentsPage = await figma.getNodeByIdAsync(PAGES.components);
const iconsPage = await figma.getNodeByIdAsync(PAGES.icons);
await componentsPage.loadAsync();
await iconsPage.loadAsync();
const topLevel = (n) => (n.type === "COMPONENT" || n.type === "COMPONENT_SET") && n.parent.type !== "COMPONENT_SET";
const libraryComponents = componentsPage.children.filter(topLevel);
const allComponents = [...libraryComponents, ...iconsPage.findAll(topLevel)];
const isDefaultName = (s) => /^(Frame|Rectangle|Group|Ellipse|Text|Vector|Line|Polygon|Star) \d+$/.test(s);
const ownNodes = (c) =>
  c.findAll((n) => {
    for (let q = n.parent; q && q !== c; q = q.parent) if (q.type === "INSTANCE") return false;
    return true;
  });
const sides = ["strokeWeight", "strokeTopWeight", "strokeRightWeight", "strokeBottomWeight", "strokeLeftWeight"];

for (const c of allComponents) {
  const inLibrary = libraryComponents.includes(c);
  const artwork = EXCEPTIONS.artworkComponents.includes(c.name);
  if (inLibrary && !c.description) add("Komponente ohne Beschreibung", c.name);
  if (c.type === "COMPONENT_SET") {
    const props = Object.keys(c.componentPropertyDefinitions).map((k) => k.split("#")[0]);
    if (new Set(props).size !== props.length) add("Doppelter Property-Name", c.name);
  }
  // the set's own frame is presentation only (padding/radius on the canvas) – only its colours are checked
  const variants = c.type === "COMPONENT_SET" ? c.children : [c];
  for (const n of [c, ...variants, ...ownNodes(c)]) {
    const where = `${c.name} › ${n.name}`;
    const isSetFrame = n === c && c.type === "COMPONENT_SET";
    if (isDefaultName(n.name)) add("Standard-Layername", where);
    if (n.type === "INSTANCE") continue;
    const bv = n.boundVariables || {};
    for (const k in bv) for (const a of [].concat(bv[k])) if (a && isBase(a.id)) add("Direkt an Base-Variable gebunden", `${where} (${k})`);
    for (const prop of ["fills", "strokes"]) {
      if (!(prop in n) || !Array.isArray(n[prop])) continue;
      for (const f of n[prop]) {
        const id = f.boundVariables && f.boundVariables.color && f.boundVariables.color.id;
        if (id && isBase(id)) add("Direkt an Base-Variable gebunden", `${where} (${prop})`);
        const styled = prop === "fills" && n.fillStyleId;
        if (!artwork && inLibrary && f.type === "SOLID" && f.visible !== false && !id && !styled) add("Feste Farbe", `${where} (${prop})`);
      }
    }
    if (!inLibrary || artwork || isSetFrame) continue;
    if ("strokes" in n && n.strokes.length && n.type !== "VECTOR" && !sides.some((s) => bv[s])) add("Strichstärke nicht gebunden", where);
    const shaped = ["ELLIPSE", "VECTOR", "TEXT", "BOOLEAN_OPERATION", "LINE", "POLYGON", "STAR"].includes(n.type);
    if ("topLeftRadius" in n && !shaped && n.cornerRadius !== 0 && !bv.topLeftRadius && !EXCEPTIONS.rawRadius.includes(where)) add("Radius nicht gebunden", where);
    if (n.layoutMode && n.layoutMode !== "NONE") {
      for (const k of ["paddingLeft", "paddingRight", "paddingTop", "paddingBottom", "itemSpacing"]) {
        if (k === "itemSpacing" && n.primaryAxisAlignItems === "SPACE_BETWEEN") continue;
        if (n[k] > 0 && !bv[k]) add("Abstand nicht gebunden", `${where} (${k})`);
      }
    }
    if (n.type === "TEXT") {
      if (!n.textStyleId && !EXCEPTIONS.textWithoutStyle.includes(where)) add("Text ohne Text-Style", where);
      const fonts = n.fontName === figma.mixed ? n.getRangeAllFontNames(0, n.characters.length) : [n.fontName];
      for (const f of fonts) if (!BRAND_FONTS.includes(f.family)) add("Fremde Schrift", `${where} (${f.family})`);
    }
  }
}

// ---------------------------------------------------------------------------------------------------- contrast (WCAG 2.2 AA)
const lum = (c) => {
  const f = (x) => (x <= 0.03928 ? x / 12.92 : Math.pow((x + 0.055) / 1.055, 2.4));
  return 0.2126 * f(c.r) + 0.7152 * f(c.g) + 0.0722 * f(c.b);
};
const ratio = (a, b) => {
  const [hi, lo] = [lum(a), lum(b)].sort((x, y) => y - x);
  return (hi + 0.05) / (lo + 0.05);
};
const blend = (fg, a, bg) => ({ r: fg.r * a + bg.r * (1 - a), g: fg.g * a + bg.g * (1 - a), b: fg.b * a + bg.b * (1 - a) });
const CANVAS = { r: 11 / 255, g: 11 / 255, b: 15 / 255 }; // ink-800, the page behind the components
const backgrounds = (text, root) => {
  const chain = [];
  for (let n = text.parent; n; n = n.parent) {
    chain.unshift(n);
    if (n === root) break;
  }
  let bgs = [CANVAS];
  for (const a of chain) {
    if (EXCEPTIONS.photoFrames.includes(a.name)) return null;
    if (!("fills" in a) || a.fills === figma.mixed) continue;
    for (const f of a.fills.filter((f) => f.visible !== false)) {
      const op = (f.opacity ?? 1) * (a.opacity ?? 1);
      if (f.type === "SOLID") bgs = bgs.map((b) => blend(f.color, op, b));
      else if (f.type.startsWith("GRADIENT")) bgs = bgs.flatMap((b) => f.gradientStops.map((s) => blend(s.color, s.color.a * op, b)));
      else if (f.type === "IMAGE") return null; // depends on the photo – not checkable
    }
  }
  return bgs;
};
for (const c of libraryComponents) {
  if (EXCEPTIONS.contrastSkipComponents.includes(c.name)) continue;
  for (const v of c.type === "COMPONENT_SET" ? c.children : [c]) {
    if (EXCEPTIONS.contrastSkipVariant.test(v.name)) continue;
    for (const t of v.findAll((n) => n.type === "TEXT" && n.visible && n.characters.trim() && n.fillStyleId !== EXCEPTIONS.gradientTextStyle)) {
      const bgs = backgrounds(t, v);
      if (!bgs) continue;
      let op = 1;
      for (let q = t; q && q !== v; q = q.parent) op *= q.opacity ?? 1;
      for (const seg of t.getStyledTextSegments(["fills", "fontSize", "fontWeight"])) {
        const f = seg.fills.find((f) => f.visible !== false);
        if (!f || !seg.characters.trim()) continue;
        const stops = f.type === "SOLID" ? [{ color: f.color, a: f.opacity ?? 1 }] : (f.gradientStops || []).map((s) => ({ color: s.color, a: s.color.a * (f.opacity ?? 1) }));
        const worst = Math.min(...bgs.flatMap((b) => stops.map((s) => ratio(blend(s.color, s.a * op, b), b))));
        const need = seg.fontSize >= 24 || (seg.fontSize >= 18.66 && seg.fontWeight >= 700) ? 3 : 4.5;
        if (worst < need) add("Kontrast zu niedrig", `${c.name} › ${v.name} „${seg.characters.trim().slice(0, 30)}“ ${worst.toFixed(2)}:1 (min ${need}:1)`);
      }
    }
  }
}

// ---------------------------------------------------------------------------------------------------- styles & pages
for (const s of await figma.getLocalTextStylesAsync()) if (!s.description) add("Text-Style ohne Beschreibung", s.name);
for (const s of await figma.getLocalEffectStylesAsync()) if (!s.description) add("Effekt-Style ohne Beschreibung", s.name);
const grids = (await figma.getLocalGridStylesAsync()).map((g) => g.name);
for (const g of EXPECTED_GRIDS) if (!grids.includes(g)) add("Grid-Style fehlt", g);

return {
  findings,
  stats: {
    variables: vars.length,
    libraryComponents: libraryComponents.length,
    allComponents: allComponents.length,
    textStyles: (await figma.getLocalTextStylesAsync()).length,
    gridStyles: grids.length,
  },
};
