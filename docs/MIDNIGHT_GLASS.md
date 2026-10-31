# Midnight Glass

Atlas's approved visual direction combines the supplied midnight/blue/orange
palette with floating glass navigation and opaque product cards.

## Design system

- Midnight background: `#02070A`.
- Electric blue action fill: `#0297DE`; readable blue text: `#69C9F5`.
- Compare action: cantaloupe orange `#FC734D` with dark text.
- Card surfaces: `#10191F`; raised surfaces: `#152129`.
- Primary text: `#F1F5F8`; secondary text: `#A6B5C1`.
- Headings: Manrope Variable. Controls and body: Inter Variable.
- Fonts are self-hosted through pinned Fontsource packages under OFL-1.1.
  Only normal Latin variable files are bundled, approximately 71 KiB total.

`atlas-midnight.css` owns these tokens and presentation rules. The first
`atlas-midnight` cascade layer makes its important declarations authoritative
over unlayered legacy styles and deferred `atlas-route-base` styles. The old
unified-theme and polish stylesheets are no longer imported. Remaining legacy
styles retain structural rules; palette aliases support specialist charts
without changing their evidence semantics.

Glass is limited to navigation, the catalog toolbar, and comparison tray.
Opaque fallbacks remain usable without backdrop-filter. Neutral image wells
preserve legibility of existing manufacturer photography, including assets
that contain a white background. Manufacturer images and credit links remain
unchanged.

## Catalog behavior

The main catalog loads the remaining switch shards in a deferred chunk. Counts,
search, shared links, and saved lists then cover the same complete records as the
dedicated Switches page. Saved IDs are not pruned before that chunk finishes;
failed loading has an explicit retry action. The external review directory stays
separate from canonical product records.

The compact introduction leads into category navigation, search, brand/sort,
and a desktop filter sidebar. Below 980 CSS pixels the same category controls
open in a modal filter sheet with Escape dismissal, focus trapping/restoration,
scroll locking, Reset, and a live result-count action. Filters apply immediately;
the result-count action returns to the catalog.

Product names wrap, specification numbers use tabular numerals, and comparison
and save buttons have product-specific accessible names. Product details retain
catalog state when dismissed. Category navigation returns the new route to the
top after the React transition commits. The switch-directory jump remains on
the switches route.

Comparison retains its differences-only control, source labels, and horizontal
scrolling on narrow screens. Desktop sticky product headers use the measured
header height; narrow screens use a non-sticky product header and a scroll hint.

## Development

Use `npm run dev` for the full Cloudflare development runtime.
If local workerd predates the repository's compatibility date, use
`npm run dev:ui -- --port 4173 --strictPort`. This UI-only Vite configuration
proxies only public `/api/media/` requests to the existing Atlas deployment.
It does not proxy analytics or change production's compatibility settings.

Run `npm run verify` for the existing release, data, media, accessibility,
security-header, build, and bundle checks. SBOM generation now launches the npm
CLI through Node when run as an npm script, avoiding Windows `.cmd` spawn errors.
Its package-name check accepts npm's directory-case variation on Windows.

## Boundaries

This change does not expand the catalog, alter product specifications, or change
source/evidence classifications. The original references are style inspiration;
Atlas uses the approved catalog layout rather than recreating the video editor
or the room-photo dashboard shown in those references.
# Field desk and reviewer workbench

The discovery desk adds a source-image product panel with manual Previous/Next controls. Opening a product uses the existing details drawer. It follows the current catalog filters; it does not imply a recommendation. Gallery/Compact controls now work across catalog categories. Product navigation retains keyboard focus and announces the changing record. Motion is limited to short entrance and hover transitions, with reduced-motion overrides.

Switches also includes ThereminGoat's Overall, Hard and Soft score sheets in a separate workbench. Each source scale remains intact (100/70/30), with timeless and published time-weighted columns kept separate. The import preserves 474 total-ranking rows per sheet at upstream commit `324e870272e83a96ff3f8e13b15b9f4671166674`. Source ranks are labeled as such; rescores remain dated rows. Original CSVs, a repeatable importer and validation tests are included. Scores do not enter Atlas's evidence coverage heuristic or manufacturer specifications.

The desk and score data are deferred modules; initial bundle budgets are unchanged. The score workbench loads on the Switches route. See `data/sources/theremingoat/README.md` for provenance and snapshot caveats. The older review-link directory has a separate September snapshot.

