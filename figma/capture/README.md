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

The script waits up to 240 s for the upload and then closes the browser. Long pages (/standorte, /faq) need most of
that; with a shorter wait their capture stayed „processing“ in Figma and had to be redone with a new capture ID.
Poll `generate_figma_design` with the capture ID until it reports the new node.
