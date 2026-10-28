// Prints figma-page.js with the Code Connect overview data filled in – the result is the `code` for use_figma.
// Usage: node figma/overview/figma-page.mjs > /tmp/code-connect-page.js
import { readFileSync } from "node:fs";

const root = new URL("../../", import.meta.url);
const data = JSON.parse(readFileSync(new URL("src/lib/codeConnect.json", root), "utf8"));
// Only what the page needs (keeps the script well below the use_figma size limit)
const slim = {
  entries: data.entries.map(({ kind, code, figma, nodeId, source, area, props }) =>
    kind === "component" ? { kind, code, figma, nodeId, source, area, props } : { kind, figma },
  ),
};
const script = readFileSync(new URL("figma/overview/figma-page.js", root), "utf8");
process.stdout.write(script.replace("/*DATA*/ null", JSON.stringify(slim)));
