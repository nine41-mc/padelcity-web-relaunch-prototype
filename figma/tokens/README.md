# Design tokens

`tokens.json` holds the foundations of the Figma library „PadelCity Website Relaunch“ (file `n3QOz0mQUCyzzVmxX4nKw3`)
in the [Design Tokens format (DTCG)](https://tr.designtokens.org/format/), ready for Style Dictionary or a hand-written
Tailwind theme in the production build.

| Group | Content |
|---|---|
| `base` | 01 Base Tokens – colour primitives (purple, magenta, ink, optic, city, status, alpha steps) |
| `semantic` | 02 Semantic Tokens – roles (background, text, border, highlight, status), aliases to `base` |
| `component` | 03 Component Tokens – button, chip, eyebrow, card, input, ticker, map pin; aliases to `semantic`/`base` |
| `numeric` | 04 Numeric Tokens – radii, spacing (Tailwind scale), breakpoints, border widths |
| `responsive` | 05 Responsive – type sizes and layout values; `$value` = Desktop, all modes in `$extensions["com.figma"].modes` |
| `gradient`, `shadow`, `typography` | Paint, effect and text styles |

Aliases keep their reference (`{base.purple.purple-500}`); `$extensions["com.figma"].codeSyntax` is the Tailwind
class or CSS variable the prototype uses for the token.

## Updating

1. Run `export-tokens.js` via the Figma MCP tool `use_figma` (pass the file content as `code`, file key above).
2. Save the returned `tokens` object as `tokens.json` (keep the top-level `$description`).
3. `npm run tokens:check` – compares colours, radii, breakpoints, gradients, shadows and the padding scale with
   `src/app/globals.css` and exits with 1 on drift. Fix the side that is wrong, never both blindly.
