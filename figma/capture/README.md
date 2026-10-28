# Page captures for Figma

`capture.cjs` puts a page of the local prototype into the Figma file (page „Prototype Manu // New Website“) as
editable layers. One call = one page in one width; each needs its own capture ID from the Figma MCP tool
`generate_figma_design` (fileKey `n3QOz0mQUCyzzVmxX4nKw3`, nodeId = the page).

```bash
NODE_PATH=<node_modules with playwright> node figma/capture/capture.cjs /app/ 1440 <captureId>
```

`preview:<file.png>` instead of a capture ID writes a full-page screenshot of what would be captured, without
sending anything to Figma.

Before capturing: dev server on port 3010 with a valid Contentful token in `.env.local` (otherwise the pages show
mock data).

Capture mode (CSS injected by the script):
- the app feature story shows one phone per feature instead of the sticky phone that swaps screens while
  scrolling – a capture would only contain the first screen (`data-story*` hooks in `FeatureStory.tsx`);
- cookie banner closed with „Nur essenzielle“, Next.js dev overlay and the highlight colour switcher hidden.
- app icons (`AppIcon`, CSS masks) are swapped for inline SVGs in their rendered colour and size – html-to-design does not
  support masks and would import grey boxes.

After capturing: the captures carry the CSS font names „soehneSchmal“ and „goodBrush“. Map them to the brand fonts with
the Figma MCP (`use_figma`): `getStyledTextSegments(["fontName"])` per text, load the other fonts of the node (skip nodes
whose system fonts, e.g. Monaco, cannot be loaded), then `setRangeFontName` on the affected ranges. Both fonts are uploaded
to the Figma organisation (since 28.10.2026); the MCP knows Söhne as „Sohne Schmal · Fett Kursiv“, the browser shows it as
„Söhne Schmal“ – same font. In the same pass, give outlined text a stroke:
html-to-design drops `-webkit-text-stroke`, so texts like the second line of a poster city name („kirchen“) arrive with no
fill and no stroke – add a 1.5 px centred stroke (white; step numbers in „In der App buchen“ white 60 %, the varsity
shadow „Dein Weg / auf den Court“ magenta 500). Clone frames for the content-model page
only after this step.

The script waits up to 240 s for the upload and then closes the browser. Long pages (/standorte, /faq) need most of
that; with a shorter wait their capture stayed „processing“ in Figma and had to be redone with a new capture ID.
Poll `generate_figma_design` with the capture ID until it reports the new node.

Do not edit code while captures run: every change makes the dev server reload the open pages, and a capture that is
interrupted that way either fails („Execution context was destroyed“, the capture ID can be reused) or arrives in Figma as
an empty white frame named „Document“ (the ID is used up – delete the frame and capture with a new ID). Deleting a source
file the dev server had already compiled breaks the affected pages until the server is restarted with a clean `.next`.
