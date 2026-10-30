# Figma library audit

`library-audit.js` checks the Figma library „PadelCity Website Relaunch“ (file `n3QOz0mQUCyzzVmxX4nKw3`) the same way
on every run. An empty `findings` list means the library is clean; anything else names the check and the layer.

## Running it

The script is written for the Figma MCP tool `use_figma` (Plugin API, top-level `await` and `return`): pass the file
content as `code` with the file key above. Two runs:

1. As committed (`COUNT_CONTENT_MODEL_ANNOTATIONS = false`): variables, components, contrast, styles.
2. With `COUNT_CONTENT_MODEL_ANNOTATIONS = true`: only the annotation count on the „🧩 Content-Modell“ page. It loads
   ~20,000 layers and exceeds the tool's time limit when combined with run 1.

Run it after every library change and before every publish. Page IDs are at the top of the script; update them if
pages are recreated.

## In the CI

`rest-check.mjs` runs the same checks over the Figma REST API, plus the Code Connect targets of `verify-targets.mjs`
(`.github/workflows/figma.yml`: every night, on every push and by hand). It reads `EXCEPTIONS` from
`library-audit.js` – add exceptions there only. A red run does not block the deploy; GitHub mails the result.

- Secret: `FIGMA_ACCESS_TOKEN` (repository secret, scope `file_content:read`; `file_variables:read` for the variable
  checks). Set it from the keychain without showing it:
  `gh secret set FIGMA_ACCESS_TOKEN --repo nine41-mc/padelcity-web-relaunch-prototype --body "$(security find-generic-password -s figma-comments-pat -w)"`
- The variables endpoint needs a Figma Enterprise plan. Without it the variable checks are skipped with a notice;
  run `library-audit.js` via `use_figma` for them after variable changes.
- Not in the CI: the content-model annotation count (run 2 above).
- Locally: `FIGMA_ACCESS_TOKEN=… npm run figma:audit`.

## What it checks

| Area | Checks |
|---|---|
| Variables | no `ALL_SCOPES`, WEB code syntax set, description (all layers except 01 Base), no fixed values in 02/03, no broken aliases, no alias to a higher layer, no duplicate names, no unused variables |
| Components | description, no duplicate property names, every variant uses every non-variant property (Boolean, text, instance swap), no default layer names, no binding to 01 Base (paints and node properties, including the component root and the variant-set frame), no fixed colours, stroke weights / radii / padding / gaps (incl. row gaps of wrapping layouts) bound, text with a text style, brand fonts only |
| Contrast | every text segment in every variant against its real background (opacity and gradient stops included), WCAG 2.2 AA: 4.5:1, 3:1 for large text. Not checked: text on photos (IMAGE fills and frames named `photo`). Gradient text uses Gradient/Brand-Text, every stop is checked |
| Styles | descriptions on text and effect styles, grid styles Desktop/Tablet/Mobile present |
| Content model | 183 annotations on the content-model page (separate run; see `figma/content-model/README.md`) |

Variable usage is collected from aliases, text styles and every layer on the Foundations, Components, Icons and
„Start hier“ pages, including layers inside instances. The script opens each page with `setCurrentPageAsync` first:
with a plain `loadAsync`, layers inside instances are not fully loaded on a cold start, and tokens bound only there
(icon colours) were reported as unused.

## Intended exceptions

Listed in `EXCEPTIONS` in the script. Add new ones there – with a reason – instead of ignoring findings.

| Exception | Reason |
|---|---|
| Store Badge, Voucher Card, Collegiate Badge: fixed colours | brand artwork, hard-coded in the code as well |
| Club Map: fixed colours, no text styles, contrast not checked | map illustration from the code (SVG); the grey country names are decorative |
| `Breakpoint/*` unused | documentation only – Figma has no property to bind them to |
| Testimonial Card › Quote without text style | mixes two weights on purpose |
| Map Pin › Body radius not bound | teardrop shape from `border-radius: 50%`, not a token |
| Disabled button variants skipped in the contrast check | WCAG exempts inactive controls |
| Icon property unused in `Arrow=false` buttons and `Has Icon=false` filter chips | these variants have no icon layer |
| Padding/radius of variant-set frames | canvas presentation only, not part of instances (their colours are still checked) |

Not covered: text on photos (contrast depends on the image), the Status Quo and prototype captures (flat
references), and the Elephant pages.
