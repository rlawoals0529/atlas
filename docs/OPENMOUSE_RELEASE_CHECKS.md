# OpenMouse, spacing and native renderer checks

The OpenMouse companion is available in mouse details and Sensitivity Lab. It opens the upstream control panel; Atlas does not discover devices, write settings, or imply support for a catalog model.

The spacing changes separate product tags from actions, let actions wrap, keep close controls from shrinking, reserve drawer scrollbar space and allow long names and prose to wrap. Paragraph width in product summaries is limited for readability.

## Verification

- Atlas: 36 tests and the catalog, evidence, sensitivity, product, media, switch index, score, accessibility, header and metadata validators passed. Production build, Worker dry run and bundle budget passed.
- Canonical native project: `sensitivity-finder/`. The rebuilt executable and full native suite passed using isolated synthetic fixtures under its checks directory.
- Native graphics: HUD changes, lessons, resizing and disposal passed on the RTX 3080 without OpenGL errors. Both comparison fixtures had zero mismatched framebuffer bytes against the backed-up executable. Single-run timings varied; no speed or latency improvement is established.
- Visual verification remains incomplete: the browser session could not connect to the local preview. Existing desktop/catalog and narrow mousepad captures were inspected; the stored sensitivity capture was blank and is not passing evidence. Fresh desktop and narrow checks of the OpenMouse panel and product drawer are still required.

The native executable, profiles, sessions and synthetic test outputs stay local. The source patch and render harnesses are published under `source-import/drift/`.
