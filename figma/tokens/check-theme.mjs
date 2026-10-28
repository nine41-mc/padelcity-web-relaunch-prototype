// Foundations check: compares the Figma token export (figma/tokens/tokens.json) with the Tailwind theme in
// src/app/globals.css – colours, radii, breakpoints, gradients, shadows and the padding scale.
// Usage: npm run tokens:check (exit code 1 on drift). See README.md in this folder.
import { readFileSync } from "node:fs";

const root = new URL("../../", import.meta.url);
const tokens = JSON.parse(readFileSync(new URL("figma/tokens/tokens.json", root), "utf8"));
const css = readFileSync(new URL("src/app/globals.css", root), "utf8");

const drift = [];
const checked = { count: 0 };
const cssVar = (name) => css.match(new RegExp(`--${name}:\\s*([^;]+);`))?.[1].trim();
const leaves = (node, path = []) =>
  node && typeof node === "object" && "$value" in node
    ? [{ path, ...node }]
    : Object.entries(node ?? {}).flatMap(([k, v]) => (k.startsWith("$") ? [] : leaves(v, [...path, k])));
const same = (label, figma, code) => {
  checked.count++;
  if (String(figma).toLowerCase() !== String(code).toLowerCase()) drift.push(`${label}: Figma ${figma} · Code ${code ?? "fehlt"}`);
};

// Colours, radii and breakpoints with a CSS variable as code syntax (var(--…)) must match @theme
const tailwindBuiltIns = new Set(["color-white", "color-black"]);
for (const t of [...leaves(tokens.base), ...leaves(tokens.numeric)]) {
  const name = t.$extensions?.["com.figma"]?.codeSyntax?.match(/^var\(--([\w-]+)\)$/)?.[1];
  if (!name || tailwindBuiltIns.has(name)) continue;
  same(`--${name}`, t.$value, cssVar(name));
}
// … and every colour in @theme exists in Figma
const theme = css.slice(css.indexOf("@theme"), css.indexOf("\n}\n", css.indexOf("@theme")));
const figmaVars = new Set(leaves(tokens.base).map((t) => t.$extensions?.["com.figma"]?.codeSyntax));
for (const [, name] of theme.matchAll(/--(color-[\w-]+):/g)) {
  checked.count++;
  if (!figmaVars.has(`var(--${name})`)) drift.push(`--${name}: im Code, fehlt in Figma (01 Base)`);
}

// Gradients: angle and stops
const rgbHex = (r, g, b) => "#" + [r, g, b].map((x) => Number(x).toString(16).padStart(2, "0")).join("");
for (const [key, t] of Object.entries(tokens.gradient)) {
  const value = cssVar(`gradient-${key}`);
  const m = value?.match(/linear-gradient\((\d+)deg,\s*(.+)\)$/);
  if (!m) {
    drift.push(`--gradient-${key}: fehlt im Code`);
    continue;
  }
  same(`--gradient-${key} Winkel`, `${t.$extensions["com.figma"].cssAngle}deg`, `${m[1]}deg`);
  const stops = m[2].split(/,\s*/).map((s) => s.match(/(#[0-9a-f]{6})\s+(\d+)%/i)).map((s) => `${s[1]} ${s[2]}%`);
  same(`--gradient-${key} Stopps`, t.$value.map((s) => `${s.color} ${Math.round(s.position * 100)}%`).join(", "), stops.join(", "));
}

// Shadows: offsets, blur, spread and colour (rgb() or color-mix() with a theme colour)
const colorOf = (s) => {
  let m = s.match(/rgb\((\d+) (\d+) (\d+) \/ ([\d.]+)\)/);
  if (m) return rgbHex(m[1], m[2], m[3]) + Math.round(Number(m[4]) * 255).toString(16).padStart(2, "0");
  m = s.match(/color-mix\(in srgb, var\(--([\w-]+)\) (\d+)%, transparent\)/);
  if (m) return cssVar(m[1]) + Math.round((Number(m[2]) / 100) * 255).toString(16).padStart(2, "0");
  return null;
};
for (const [key, t] of Object.entries(tokens.shadow)) {
  const value = cssVar(`shadow-${key}`);
  if (!value) {
    drift.push(`--shadow-${key}: fehlt im Code`);
    continue;
  }
  const layers = value.split(/,\s*(?=\d)/).map((l) => {
    const [x, y, blur, spread = "0"] = l.match(/^(-?[\d.]+(?:px)?)\s+(-?[\d.]+(?:px)?)\s+(-?[\d.]+(?:px)?)(?:\s+(-?[\d.]+(?:px)?))?/).slice(1);
    const px = (v) => (v === "0" ? "0px" : v);
    return `${px(x)} ${px(y)} ${px(blur)} ${px(spread ?? "0")} ${colorOf(l)}`;
  });
  same(`--shadow-${key}`, t.$value.map((s) => `${s.offsetX} ${s.offsetY} ${s.blur} ${s.spread} ${s.color}`).join(", "), layers.join(", "));
}

// Padding scale: Figma modes Mobile / Tablet / Desktop = base / ≥768 / ≥1200 in the @utility
for (const name of ["pad-card", "pad-panel", "pad-banner"]) {
  const modes = tokens.responsive.Layout[name].$extensions["com.figma"].modes;
  const block = css.match(new RegExp(`@utility ${name} \\{([\\s\\S]*?)\\n\\}`))?.[1] ?? "";
  const base = block.match(/^\s*padding: (\d+px);/m)?.[1];
  const md = block.match(/width >= 768px\)\s*\{\s*padding: (\d+px)/)?.[1] ?? base;
  const lg = block.match(/width >= 1200px\)\s*\{\s*padding: (\d+px)/)?.[1] ?? md;
  same(name, `${modes.Mobile} / ${modes.Tablet} / ${modes.Desktop}`, `${base} / ${md} / ${lg}`);
}

console.log(`${checked.count} Werte geprüft, ${drift.length} Abweichungen.`);
for (const d of drift) console.log(`  ✗ ${d}`);
process.exit(drift.length ? 1 : 0);
