# Content model in Figma

The Figma page „🧩 Content-Modell“ (file `n3QOz0mQUCyzzVmxX4nKw3`, page `15234:28`) holds copies of the 19 desktop
captures with annotations generated from `src/lib/content/contentModel.ts`. Do not edit the annotations by hand –
regenerate them whenever the content model changes:

1. `node figma/content-model/build-annotations.mjs` → writes `annotations.json` (one annotation per module and data
   source; labels exactly as on /content-modell; the page frame lists modules that are not visible in the design).
2. Apply it with the Figma MCP tool `use_figma`: clear the annotations on the page, then set them per node, grouped by
   node id, with the category named in `c` (categories „Neuer Contentful-Space“, „API · vorhanden“, „API · erweitern“,
   „Externer Dienst“, „Unklar“, „Seite“).
3. Update `EXPECTED_ANNOTATIONS` in `figma/audit/library-audit.js` and run the audit's content-model check.

`M` in the script maps capture sections (prototype page) to their copies on the content-model page, `A` assigns
modules to sections. New sections or modules need an entry there; the script throws if a module or a copy is missing.
