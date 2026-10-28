// Token export for the Figma library "PadelCity Website Relaunch" (file n3QOz0mQUCyzzVmxX4nKw3).
// Plugin-API script: runs as-is via the Figma MCP tool `use_figma` (top-level await + return) and returns the
// variables, gradients, shadows and text styles as Design Tokens (DTCG format, https://tr.designtokens.org/format/).
// Save the returned `tokens` object as figma/tokens/tokens.json, then run `npm run tokens:check`. See README.md.

const GROUP = { "01": "base", "02": "semantic", "03": "component", "04": "numeric", "05": "responsive" };

const vars = await figma.variables.getLocalVariablesAsync();
const cols = await figma.variables.getLocalVariableCollectionsAsync();
const byId = Object.fromEntries(vars.map((v) => [v.id, v]));
const colOf = (v) => cols.find((c) => c.id === v.variableCollectionId);
const path = (v) => [GROUP[colOf(v).name.slice(0, 2)], ...v.name.split("/")];
const hex = (c) => {
  const h = "#" + [c.r, c.g, c.b].map((x) => Math.round(x * 255).toString(16).padStart(2, "0")).join("");
  return c.a !== undefined && c.a < 1 ? h + Math.round(c.a * 255).toString(16).padStart(2, "0") : h;
};
const value = (v, raw) => {
  if (raw && raw.type === "VARIABLE_ALIAS") return `{${path(byId[raw.id]).join(".")}}`;
  if (v.resolvedType === "COLOR") return hex(raw);
  if (v.resolvedType === "FLOAT") return v.name.startsWith("Breakpoint") || v.name.startsWith("Layout") || v.name.startsWith("Radius") || v.name.startsWith("Spacings") || v.name.startsWith("Border") || v.name.startsWith("Typography") ? `${raw}px` : raw;
  return raw;
};
// Descriptions come back HTML-escaped from the Plugin API (&quot; &amp;)
const plain = (s) => (s ? s.replace(/&quot;/g, '"').replace(/&lt;/g, "<").replace(/&gt;/g, ">").replace(/&amp;/g, "&") : undefined);
const type = (v) => (v.resolvedType === "COLOR" ? "color" : v.resolvedType === "FLOAT" ? "dimension" : "string");

const tokens = {};
const put = (keys, token) => {
  let o = tokens;
  for (const k of keys.slice(0, -1)) o = o[k] ??= {};
  o[keys.at(-1)] = token;
};

for (const v of vars) {
  const col = colOf(v);
  const [first, ...rest] = col.modes;
  const token = { $type: type(v), $value: value(v, v.valuesByMode[first.modeId]) };
  if (v.description) token.$description = plain(v.description);
  // Scopes stay in Figma (they only steer the property pickers); the return value is limited to 48 kB
  const ext = { codeSyntax: v.codeSyntax.WEB || undefined };
  // Responsive tokens: first mode (Desktop) is $value, the others go into the extension
  if (rest.length) ext.modes = Object.fromEntries(col.modes.map((m) => [m.name, value(v, v.valuesByMode[m.modeId])]));
  token.$extensions = { "com.figma": ext };
  put(path(v), token);
}

for (const s of await figma.getLocalPaintStylesAsync()) {
  const p = s.paints[0];
  if (!p || !p.type.startsWith("GRADIENT")) continue;
  // gradientTransform maps the layer onto gradient space; its inverse turns the gradient axis (1, 0) into the layer
  // direction (d, -c) – as a CSS angle (0deg = up, clockwise, y down) that is atan2(d, c)
  const [[a, b], [c, d]] = p.gradientTransform;
  const angle = Math.round(((Math.atan2(d, c) * 180) / Math.PI + 360) % 360);
  put(["gradient", ...s.name.replace(/^Gradient\//, "").toLowerCase().split("/")], {
    $type: "gradient",
    $value: p.gradientStops.map((g) => ({ color: hex(g.color), position: +g.position.toFixed(3) })),
    $description: plain(s.description),
    $extensions: { "com.figma": { cssAngle: angle, matrix: [a, b, c, d].map((x) => +x.toFixed(4)) } },
  });
}

for (const s of await figma.getLocalEffectStylesAsync()) {
  put(["shadow", ...s.name.replace(/^Shadow\//, "").toLowerCase().split("/")], {
    $type: "shadow",
    $value: s.effects
      .filter((e) => e.type === "DROP_SHADOW")
      .map((e) => ({ color: hex(e.color), offsetX: `${e.offset.x}px`, offsetY: `${e.offset.y}px`, blur: `${e.radius}px`, spread: `${e.spread ?? 0}px` })),
    $description: plain(s.description),
  });
}

for (const s of await figma.getLocalTextStylesAsync()) {
  put(["typography", ...s.name.split("/")], {
    $type: "typography",
    $value: {
      fontFamily: s.fontName.family === "Sohne Schmal" ? "Söhne Schmal" : s.fontName.family,
      fontStyle: s.fontName.style,
      fontSize: `${s.fontSize}px`,
      lineHeight: s.lineHeight.unit === "AUTO" ? "normal" : s.lineHeight.unit === "PERCENT" ? +(s.lineHeight.value / 100).toFixed(3) : `${s.lineHeight.value}px`,
      letterSpacing: s.letterSpacing.unit === "PERCENT" ? `${+(s.letterSpacing.value / 100).toFixed(3)}em` : `${s.letterSpacing.value}px`,
      textTransform: s.textCase === "UPPER" ? "uppercase" : "none",
    },
    $description: plain(s.description),
  });
}

return { tokens };
