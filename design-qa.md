# Midnight Glass design QA

final result: blocked

## Visual truth and review scope

The user supplied two 945 × 2048 screenshots: a video-editor landing page with
Midnight Black `#02070A`, Electric Blue `#0297DE`, and Cantaloupe Orange `#FC734D`,
and a glass dashboard over a room photograph. The user approved an adaptation
for Atlas: dark catalog cards, glass navigation and utility surfaces, Manrope
headings, Inter body text, a compact catalog-first layout, and responsive filters.
The room photograph and video-editor content are intentionally excluded.

Source visual truth: the two image attachments in the task conversation,
`image(20261031-002721).png` and `image(20261031-002719).png`.

Implementation capture: `qa-evidence/atlas-desktop.png` (local review evidence,
not committed). Main catalog at 1440 × 960 CSS pixels; device scale approximately
1.1. Browser screenshot pixels include the browser provider's capture scaling;
CSS dimensions were read from the rendered page rather than inferred from the
displayed thumbnail. Additional browser checks covered 390 CSS-pixel mobile,
320 CSS-pixel narrow layout, and the default desktop viewport.

## Blocking comparison gap

The supplied images are visible in the conversation, but both attempts to
materialize their original bytes through the supported Library helper failed.
Consequently a combined source/build comparison board and a normalized focused
comparison could not be produced. This report does not claim pixel fidelity or
a completed formal visual-comparison gate. The PR must remain a draft until
that gate is resolved. Build and functional checks are independently complete.

## Browser review and iteration history

- Found white backgrounds behind comparison cells and badges. Added theme
  rules for sections, cells, difference highlights, and remove controls;
  re-opened the comparison and verified readable dark cells.
- Found white switch-directory quick filters and controls. Applied dark surface,
  selected-state, and text rules; checked the directory on mobile.
- Found light Shape Lab layer rows, editor controls, and canvas. The final theme
  now covers these surfaces. Changed default outlines to brighter, distinct
  colors. Rechecked the workbench and its top/side toggle; no white interface
  surfaces remained in the inspected Shape Lab DOM.
- Restored the editor's three-button line-style layout after retiring the old
  polish stylesheet. Controls remained within their panels.
- Reduced specialist-page headline sizes and shortened the sensitivity and
  keyboard introductions while retaining evidence boundaries.
- Fixed route scroll restoration after navigation and kept the switch-directory
  jump within its catalog route.
- Removed two superseded theme imports after the initial CSS budget failure.
  The existing bundle limits passed without increasing their thresholds.

## Fidelity surfaces assessed

- Typography: browser confirmed self-hosted Inter Variable and Manrope Variable
  loaded. Headings, body, numeric alignment, wrapped product names, and control
  labels were inspected. No external Google Fonts stylesheet remains.
- Layout: compact intro, floating navigation, desktop sidebar, mobile filter
  sheet, image wells, comparison tray, and details drawer were inspected.
- Tokens: midnight surfaces, readable blue selection/focus, orange Compare,
  subdued borders, and opaque blur fallbacks are implemented.
- Assets: existing manufacturer images and attribution remain. Product image
  failure uses the existing Atlas mark plus an explicit unavailable label.
- Copy: introductions and actions are concise. Modeled mousepad metrics are
  labeled. Missing grip width displays “Not listed” rather than “— mm”.

## Primary interactions tested

- Search for LAMZU narrowed the catalog to two products.
- Added those two products to comparison; opened the dialog; differences-only
  reduced the rows to 13 differing fields; dismissed the dialog.
- At mobile width, selected maximum weight 45 g in the filter sheet; the result
  count changed from two to one. Returning to results restored focus to Filters
  and released the body scroll lock.
- Saved INCA, opened its details, checked specifications/sources, and closed it.
  Catalog search and weight filters remained applied.
- Entered a query with no results and recovered with Clear filters.
- Visited keyboards, switches, mousepads, sensitivity, research, and setup;
  checked Shape Lab side view. Sensitivity 2 at 800 DPI in CS2 produced 0.6286
  for VALORANT at 800 DPI, consistent with the existing formula.
- DOM overflow checks passed at 1440 and 320 CSS-pixel widths. A test requesting
  320 physical pixels initially yielded 291 CSS pixels at the host's scale;
  corrected the capture dimensions before assessing the supported 320 CSS-pixel
  breakpoint.
- Browser error-log inspection returned no errors on the inspected catalog tab.
- Follow-up catalog check: the main page now reports all 157 canonical products
  and 73 switches after its deferred chunk loads. Searching “Smoothie” found the
  added Gateron record; saving it and refreshing preserved its saved state.

## Automated validation

`npm run verify` passed: 27 tests, SBOM, release contract, catalog/community/
sensitivity/product/media/switch-index/accessibility/header/public metadata
validators, TypeScript, production build, Worker dry run, and initial bundle
budget. The final post-polish `npm run verify` also exited successfully.

## Remaining work

- Resolve the original-reference transfer failure and produce a combined
  source/build comparison, acknowledging this is an approved adaptation.
- Capture and compare the same final states again; only then mark this gate
  passed and release the draft PR for merge/deployment.
