// Prints a use_figma script that checks every Code Connect target in Figma before `npm run figma:publish`:
// the node exists, is a top-level component or component set (not a variant) and carries the expected name.
// Usage: node figma/overview/verify-targets.mjs > /tmp/verify.js, pass the file content as `code` to use_figma.
// An empty `problems` list means figma:publish will accept all templates.
import { readFileSync } from "node:fs";

const root = new URL("../../", import.meta.url);
const { entries } = JSON.parse(readFileSync(new URL("src/lib/codeConnect.json", root), "utf8"));
const targets = entries.map(({ nodeId, figma }) => [nodeId, figma]);

process.stdout.write(`const TARGETS = ${JSON.stringify(targets)};
const problems = [];
for (const [id, name] of TARGETS) {
  const n = await figma.getNodeByIdAsync(id);
  if (!n) { problems.push(\`\${name} (\${id}): Node fehlt\`); continue; }
  const topLevel = n.type === "COMPONENT_SET" || (n.type === "COMPONENT" && n.parent.type !== "COMPONENT_SET");
  if (!topLevel) problems.push(\`\${name} (\${id}): \${n.type === "COMPONENT" ? "ist eine Variante – url auf das Set ändern" : "keine Komponente (" + n.type + ")"}\`);
  else if (n.name !== name) problems.push(\`\${name} (\${id}): heißt in Figma „\${n.name}“\`);
}
return { checked: TARGETS.length, problems };
`);
