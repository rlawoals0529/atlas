# Changelog

Atlas release notes focus on user-visible product changes, research/data rules, validation behavior and meaningful engineering changes.

## Unreleased

### Data
- Expanded the canonical switch catalog with manufacturer-backed Wuque Studio WS Red, WS Yellow, WS Brown and WS Quartz records.
- Added sourced KTT Hyacinth, Macaron Orange and Macaron Pink records with official manufacturer media. Macaron Orange keeps operating force distinct from its tactile pressure-point force.
- Completed the seven-switch KTT Macaron family with Red, Yellow, Green, Blue and Purple; tactile pressure-point values remain distinct from actuation/bottom-out fields.
- Added KTT Creamy Ice Cream, Taro Ice Cream and MoonRosa with official KTT media and specialist travel/force references; Guava remains excluded while KTT's own published force text disagrees across pages.
- Current canonical catalog: 149 products, including 65 keyboard switches.

## v0.9.0 — 2026-10-01

First public portfolio release.

### Product
- 134 canonical products across mice, mousepads, skates, keyboards and switches.
- Dedicated Mousepads and Switches catalog destinations.
- Switch-specific filtering, sorting, density controls and side-by-side comparison.
- Shareable Switches filter URLs.
- Recently added switch records and catalog field-coverage reporting.
- Keyboard Lab kept focused on complete keyboards rather than standalone switch browsing.
- 466-entry attributed ThereminGoat switch-review directory kept separate from Atlas canonical specifications.
- Product Lab, Sensitivity Lab, Shape/setup tooling and guided physical Validation Lab.

### Data and evidence
- 50 canonical keyboard switches with explicit product media.
- Manufacturer-backed switch expansion covering CHERRY, Gateron, Wooting, Akko, Kailh and TTC.
- Current switch records require a manufacturer source and at least one published force point.
- Hall-effect/TMR records require board-specific compatibility notes.
- Manufacturer, independent, community and Atlas-derived evidence remain distinct.
- Source-date and public README catalog-count drift are CI-protected.

### UX and accessibility
- Comparison modal focus trapping/restoration hardened.
- Comparison loading and route transitions refined.
- Switch compact/comfortable density modes.
- Published switch force/travel summary in comparison without a composite quality score.
- Better responsive behavior for catalog cards, product media and dense controls.

### Performance and engineering
- Expanded switch catalog and switch media moved behind the lazy Switches route.
- Initial bundle remains under enforced JS/CSS budgets.
- Cloudflare Worker catalog/media APIs include lazy route switch records.
- Production deployments verify release metadata, health and media resolution.
- Active GitHub Actions moved to pinned Node-24-compatible action releases.
- npm lockfile added for reproducible transitive dependency resolution.

### Public repository
- Portfolio case study.
- Reviewer quick tour.
- Structured bug, feature and data-correction issue forms.
- Pull-request evidence/verification checklist.
- Public security reporting guidance.
- Explicit third-party media/data and source-availability boundaries.

Full release notes: [docs/releases/v0.9.0.md](docs/releases/v0.9.0.md)

[GitHub release](https://github.com/rlawoals0529/atlas/releases/tag/v0.9.0)
