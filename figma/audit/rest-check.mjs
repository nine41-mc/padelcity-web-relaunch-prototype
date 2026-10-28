// Figma checks for the CI, over the REST API instead of use_figma: the Code Connect targets (as verify-targets.mjs)
// and the library audit (as library-audit.js, same EXCEPTIONS – read from that file). Exit code 1 on findings.
//
//   FIGMA_ACCESS_TOKEN=… node figma/audit/rest-check.mjs
//
// Token scopes: file_content:read (components, styles); file_variables:read for the variable checks – the variables
// endpoint needs a Figma Enterprise plan, without it those checks are skipped with a note. Not covered here: the
// content-model annotation count (too many layers for one request) – that stays a use_figma run.
import { readFileSync } from "node:fs";

const FILE = "n3QOz0mQUCyzzVmxX4nKw3";
const PAGES = { foundations: "1:6", components: "1:7", icons: "13129:1060", start: "15232:5" };
const BRAND_FONTS = ["Poppins", "Söhne Schmal", "Sohne Schmal", "GOOD BRUSH"];
const EXPECTED_GRIDS = ["Grid/Desktop", "Grid/Tablet", "Grid/Mobile"];
const root = new URL("../../", import.meta.url);

// One source for the exceptions: the object literal in library-audit.js (the use_figma script cannot import)
const auditSource = readFileSync(new URL("figma/audit/library-audit.js", root), "utf8");
const EXCEPTIONS = new Function(`return ${/const EXCEPTIONS = (\{[\s\S]*?\n\});/.exec(auditSource)[1]}`)();

const token = process.env.FIGMA_ACCESS_TOKEN;
if (!token) {
  console.log("::warning::FIGMA_ACCESS_TOKEN fehlt – Figma-Prüfung übersprungen (Secret setzen, siehe figma/audit/README.md).");
  process.exit(0);
}
const api = async (path) => {
  const res = await fetch(`https://api.figma.com/v1${path}`, { headers: { "X-Figma-Token": token } });
  if (!res.ok) throw Object.assign(new Error(`${res.status} ${path}`), { status: res.status, body: await res.text() });
  return res.json();
};

const findings = [];
const notes = [];
const add = (check, item) => findings.push(`${check}: ${item}`);

// ---------------------------------------------------------------------------------------------------- Code Connect targets
const { entries } = JSON.parse(readFileSync(new URL("src/lib/codeConnect.json", root), "utf8"));
for (let i = 0; i < entries.length; i += 50) {
  const batch = entries.slice(i, i + 50);
  const res = await api(`/files/${FILE}/nodes?ids=${batch.map((e) => e.nodeId).join(",")}&depth=1`);
  for (const { nodeId, figma: name } of batch) {
    const node = res.nodes[nodeId];
    if (!node) { add("Code Connect", `${name} (${nodeId}): Node fehlt`); continue; }
    const { document: n, components } = node;
    const isVariant = n.type === "COMPONENT" && components?.[nodeId]?.componentSetId;
    if (n.type !== "COMPONENT_SET" && n.type !== "COMPONENT") add("Code Connect", `${name} (${nodeId}): keine Komponente (${n.type})`);
    else if (isVariant) add("Code Connect", `${name} (${nodeId}): ist eine Variante – url auf das Set ändern`);
    else if (n.name !== name) add("Code Connect", `${name} (${nodeId}): heißt in Figma „${n.name}“`);
  }
}

// ---------------------------------------------------------------------------------------------------- pages
const pages = (await api(`/files/${FILE}/nodes?ids=${Object.values(PAGES).join(",")}`)).nodes;
const meta = {};
for (const p of Object.values(pages)) Object.assign(meta, p.components, p.componentSets);
const walk = (n, fn, parent = null) => {
  fn(n, parent);
  for (const c of n.children ?? []) walk(c, fn, n);
};

// ---------------------------------------------------------------------------------------------------- variables
let vars = null;
try {
  vars = (await api(`/files/${FILE}/variables/local`)).meta;
} catch (e) {
  if (e.status !== 403 && e.status !== 404) throw e;
  notes.push(`Variablen nicht geprüft (HTTP ${e.status}: braucht Enterprise-Plan und Scope file_variables:read) – das Plugin-Audit (use_figma) deckt sie ab.`);
}
const byId = vars ? vars.variables : {};
const cols = vars ? vars.variableCollections : {};
const layer = (v) => cols[v.variableCollectionId].name.slice(0, 2); // "01".."05"
const isBase = (id) => byId[id] && layer(byId[id]) === "01";
if (vars) {
  const list = Object.values(byId).filter((v) => !v.remote);
  for (const v of list) {
    const values = Object.values(v.valuesByMode);
    if (v.scopes.includes("ALL_SCOPES")) add("Variable mit ALL_SCOPES", v.name);
    if (!v.codeSyntax?.WEB) add("Variable ohne WEB-Code-Syntax", v.name);
    if (layer(v) !== "01" && !v.description) add("Variable ohne Beschreibung", v.name);
    if (["02", "03"].includes(layer(v)) && values.some((x) => !(x && x.type === "VARIABLE_ALIAS"))) add("Fester Wert in Alias-Ebene", v.name);
    for (const x of values) {
      if (x && x.type === "VARIABLE_ALIAS" && !byId[x.id]) add("Kaputter Alias", v.name);
      else if (x && x.type === "VARIABLE_ALIAS" && layer(byId[x.id]) > layer(v) && layer(v) !== "05") add("Alias zeigt auf höhere Ebene", v.name);
    }
  }
  const names = list.map((v) => layer(v) + v.name);
  for (const n of new Set(names.filter((n, i) => names.indexOf(n) !== i))) add("Doppelter Variablenname", n.slice(2));
  // usage: aliases and every binding on the library pages, inside instances too
  const used = new Set();
  const mark = (bv) => {
    for (const a of Object.values(bv ?? {})) for (const x of [].concat(a)) if (x?.id) used.add(x.id);
  };
  for (const v of list) for (const x of Object.values(v.valuesByMode)) if (x?.type === "VARIABLE_ALIAS") used.add(x.id);
  for (const p of Object.values(pages)) {
    walk(p.document, (n) => {
      mark(n.boundVariables);
      for (const f of [...(n.fills ?? []), ...(n.strokes ?? [])]) mark(f.boundVariables);
      for (const o of Object.values(n.styleOverrideTable ?? {})) for (const f of o.fills ?? []) mark(f.boundVariables);
    });
  }
  // text styles bind typography variables; the REST style list does not carry them, so a text node's bound
  // variables (inherited from its style) stand in – a variable used only by an unused text style is reported
  for (const v of list) {
    if (layer(v) === "01" || used.has(v.id)) continue;
    if (EXCEPTIONS.unusedVariables.some((re) => re.test(v.name))) continue;
    add("Unbenutzte Variable", v.name);
  }
}

// ---------------------------------------------------------------------------------------------------- components
const isTop = (n, parent) => (n.type === "COMPONENT" || n.type === "COMPONENT_SET") && parent?.type !== "COMPONENT_SET";
const libraryComponents = pages[PAGES.components].document.children.filter((n) => isTop(n, null));
const allComponents = [...libraryComponents];
walk(pages[PAGES.icons].document, (n, parent) => isTop(n, parent) && allComponents.push(n));
const isDefaultName = (s) => /^(Frame|Rectangle|Group|Ellipse|Text|Vector|Line|Polygon|Star) \d+$/.test(s);
// the component's own layers: everything except what sits inside a nested instance
const ownNodes = (c) => {
  const out = [];
  const visit = (n) => {
    for (const ch of n.children ?? []) {
      out.push(ch);
      if (ch.type !== "INSTANCE") visit(ch);
    }
  };
  visit(c);
  return out;
};
// The REST API names bindings differently from the Plugin API: stroke weights sit under individualStrokeWeights,
// corner radii under rectangleCornerRadii (RECTANGLE_TOP_LEFT_CORNER_RADIUS …) – see @figma/rest-api-spec
const strokeBound = (bv) => bv.strokeWeight || Object.keys(bv.individualStrokeWeights ?? {}).length > 0;
const radiusBound = (bv) => bv.topLeftRadius || Object.keys(bv.rectangleCornerRadii ?? {}).length > 0;
const SHAPED = ["ELLIPSE", "VECTOR", "TEXT", "BOOLEAN_OPERATION", "LINE", "REGULAR_POLYGON", "STAR"];

for (const c of allComponents) {
  const inLibrary = libraryComponents.includes(c);
  const artwork = EXCEPTIONS.artworkComponents.includes(c.name);
  if (inLibrary && !meta[c.id]?.description) add("Komponente ohne Beschreibung", c.name);
  if (c.type === "COMPONENT_SET") {
    const props = Object.keys(c.componentPropertyDefinitions ?? {}).map((k) => k.split("#")[0]);
    if (new Set(props).size !== props.length) add("Doppelter Property-Name", c.name);
  }
  const variants = c.type === "COMPONENT_SET" ? c.children : [];
  for (const n of [c, ...variants, ...ownNodes(c).filter((n) => !variants.includes(n))]) {
    const where = `${c.name} › ${n.name}`;
    const isSetFrame = n === c && c.type === "COMPONENT_SET";
    if (isDefaultName(n.name)) add("Standard-Layername", where);
    if (n.type === "INSTANCE") continue;
    const bv = n.boundVariables ?? {};
    if (vars) for (const k in bv) for (const a of [].concat(bv[k])) if (a && isBase(a.id)) add("Direkt an Base-Variable gebunden", `${where} (${k})`);
    for (const prop of ["fills", "strokes"]) {
      for (const f of n[prop] ?? []) {
        const id = f.boundVariables?.color?.id;
        if (vars && id && isBase(id)) add("Direkt an Base-Variable gebunden", `${where} (${prop})`);
        const styled = prop === "fills" && n.styles?.fill;
        if (!artwork && inLibrary && f.type === "SOLID" && f.visible !== false && !id && !styled) add("Feste Farbe", `${where} (${prop})`);
      }
    }
    if (!inLibrary || artwork || isSetFrame) continue;
    if (n.strokes?.length && n.type !== "VECTOR" && !strokeBound(bv)) add("Strichstärke nicht gebunden", where);
    const radius = n.cornerRadius || n.rectangleCornerRadii?.some((r) => r > 0);
    if (!SHAPED.includes(n.type) && radius && !radiusBound(bv) && !EXCEPTIONS.rawRadius.includes(where)) add("Radius nicht gebunden", where);
    if (n.layoutMode && n.layoutMode !== "NONE") {
      for (const k of ["paddingLeft", "paddingRight", "paddingTop", "paddingBottom", "itemSpacing", "counterAxisSpacing"]) {
        if (k === "itemSpacing" && n.primaryAxisAlignItems === "SPACE_BETWEEN") continue;
        if (k === "counterAxisSpacing" && n.layoutWrap !== "WRAP") continue;
        if (n[k] > 0 && !bv[k]) add("Abstand nicht gebunden", `${where} (${k})`);
      }
    }
    if (n.type === "TEXT") {
      if (!n.styles?.text && !EXCEPTIONS.textWithoutStyle.includes(where)) add("Text ohne Text-Style", where);
      const fonts = [n.style?.fontFamily, ...Object.values(n.styleOverrideTable ?? {}).map((o) => o.fontFamily)].filter(Boolean);
      for (const f of new Set(fonts)) if (!BRAND_FONTS.includes(f)) add("Fremde Schrift", `${where} (${f})`);
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
const stopsOf = (f) =>
  f.type === "SOLID" ? [{ color: f.color, a: (f.color.a ?? 1) * (f.opacity ?? 1) }] : (f.gradientStops ?? []).map((s) => ({ color: s.color, a: (s.color.a ?? 1) * (f.opacity ?? 1) }));
for (const c of libraryComponents) {
  if (EXCEPTIONS.contrastSkipComponents.includes(c.name)) continue;
  for (const v of c.type === "COMPONENT_SET" ? c.children : [c]) {
    if (EXCEPTIONS.contrastSkipVariant.test(v.name)) continue;
    const visit = (n, chain) => {
      if (n.visible === false) return;
      const next = [...chain, n];
      if (n.type === "TEXT" && n.characters?.trim()) check(n, chain);
      for (const ch of n.children ?? []) visit(ch, next);
    };
    const check = (t, chain) => {
      let bgs = [CANVAS];
      for (const a of chain) {
        if (EXCEPTIONS.photoFrames.includes(a.name)) return;
        for (const f of (a.fills ?? []).filter((f) => f.visible !== false)) {
          const op = (f.opacity ?? 1) * (a.opacity ?? 1);
          if (f.type === "SOLID") bgs = bgs.map((b) => blend(f.color, (f.color.a ?? 1) * op, b));
          else if (f.type.startsWith("GRADIENT")) bgs = bgs.flatMap((b) => f.gradientStops.map((s) => blend(s.color, (s.color.a ?? 1) * op, b)));
          else if (f.type === "IMAGE") return; // depends on the photo – not checkable
        }
      }
      const op = [...chain.slice(chain.indexOf(v) + 1), t].reduce((o, q) => o * (q.opacity ?? 1), 1);
      // base style plus every character override (REST: styleOverrideTable)
      const segments = [{ fills: t.fills, fontSize: t.style?.fontSize, fontWeight: t.style?.fontWeight }];
      for (const o of Object.values(t.styleOverrideTable ?? {})) {
        segments.push({ fills: o.fills ?? t.fills, fontSize: o.fontSize ?? t.style?.fontSize, fontWeight: o.fontWeight ?? t.style?.fontWeight });
      }
      for (const seg of segments) {
        const f = (seg.fills ?? []).find((f) => f.visible !== false);
        if (!f) continue;
        const worst = Math.min(...bgs.flatMap((b) => stopsOf(f).map((s) => ratio(blend(s.color, s.a * op, b), b))));
        const need = seg.fontSize >= 24 || (seg.fontSize >= 18.66 && seg.fontWeight >= 700) ? 3 : 4.5;
        if (worst < need) add("Kontrast zu niedrig", `${c.name} › ${v.name} „${t.characters.trim().slice(0, 30)}“ ${worst.toFixed(2)}:1 (min ${need}:1)`);
      }
    };
    // the variant's ancestors up to the page are not part of the instance – start the chain at the variant
    visit(v, []);
  }
}

// ---------------------------------------------------------------------------------------------------- styles
const styles = (await api(`/files/${FILE}/styles`)).meta.styles;
for (const s of styles) if ((s.style_type === "TEXT" || s.style_type === "EFFECT") && !s.description) add(`${s.style_type === "TEXT" ? "Text" : "Effekt"}-Style ohne Beschreibung`, s.name);
const grids = styles.filter((s) => s.style_type === "GRID").map((s) => s.name);
for (const g of EXPECTED_GRIDS) if (!grids.includes(g)) add("Grid-Style fehlt", g);

// ---------------------------------------------------------------------------------------------------- report
console.log(`Figma: ${entries.length} Code-Connect-Ziele, ${libraryComponents.length} Library-Komponenten, ${allComponents.length} Komponenten${vars ? `, ${Object.keys(byId).length} Variablen` : ""} geprüft – ${findings.length} Funde.`);
for (const n of notes) console.log(`::notice::${n}`);
for (const f of findings) console.log(`  ✗ ${f}`);
process.exit(findings.length ? 1 : 0);
