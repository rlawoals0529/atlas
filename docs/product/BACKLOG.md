# Atlas prioritized backlog

This is a working backlog for the product, not a resume checklist. Priorities use the Atlas **User value × Evidence × Risk × Effort** framework from `OPERATIONS.md`.

## Now

| Priority | Work | Why now | Evidence / trigger | Exit criteria |
| --- | --- | --- | --- | --- |
| P0 | Keep v0.8 Product Lab build/deploy green | A portfolio feature is worthless if it destabilizes the consumer product | CI, Wrangler dry-run and security baseline | all required checks pass on `main` |
| P1 | Product Analytics event architecture + honest dashboard modes | Needed to understand actual user journeys and demonstrate analytics work truthfully | current lack of production behavior data | typed events; local-real/demo visually distinct; optional production collector validated |
| P1 | Manual mouse validation sessions | Converts generated plans into a system capable of producing real evidence | user owns multiple devices and intends to execute tests | environment + NOT RUN/PASS/FAIL/BLOCKED + actual result + evidence + defects + export |
| P1 | Product Intelligence / closest competitors | Extends the sourced catalog into decision-support rather than a list of products | existing catalog already has geometry, price, polling and fit attributes | transparent distributions + direct-competitor model + limitations visible |
| P1 | Atlas-only naming cleanup | Mixed names weaken product coherence | consumer app/footer still had historical Input Atlas copy | public UI, manifest and docs consistently say Atlas |

## Next

| Priority | Work | Why | Evidence still needed / dependency |
| --- | --- | --- | --- |
| P1 | Connect `ANALYTICS_DB` and production aggregate view | Enables all-user funnels and feature usage | real Cloudflare D1 binding, retention policy, production traffic |
| P1 | Execute validation sessions on owned mice | Produces real System Test / Validation evidence | physical devices, firmware/receiver versions, Windows test environment |
| P1 | Validation evidence attachments/metadata | PASS/FAIL should be auditable | decide storage/privacy policy; R2 or local export path |
| P2 | Replace DOM analytics bridge with direct feature instrumentation | Cleaner long-term architecture | refactor large `AppV05` into stable feature modules |
| P2 | Community-insight ingestion | Adds qualitative customer evidence | define initial source set and sampling approach; avoid convenience-sample overclaiming |
| P2 | Product-family positioning views | Useful for portfolio/category analysis | reliable current-family records and pricing |
| P2 | Launch/lifecycle fields | Enables release cadence and lifecycle analysis | reliable dated manufacturer/archive sources |
| P2 | Measured outline ingestion | Improves geometry validity beyond parametric silhouettes | licensed/own measured SVG/scan data |

## Later

| Priority | Work | Why not now |
| --- | --- | --- |
| P2 | Cross-section / 3D comparison | Valuable but needs trustworthy geometry rather than decorative pseudo-3D |
| P2 | Mousepad/skate validation sessions | Reuse mouse validation architecture after device workflow is proven |
| P3 | Host-visible test helper | Useful selective automation, but real manual execution workflow must exist first |
| P3 | Longitudinal price analysis | Needs a time-series data source and collection policy |
| P3 | Market opportunity scoring | Sparse catalog cells are not demand; requires sales/customer/willingness-to-pay evidence |

## Explicitly not prioritized

- universal product rankings;
- scraping proprietary shape assets;
- mass Reddit ingestion before the evidence schema and sampling policy are proven;
- automation percentage as a goal;
- fake hardware PASS/FAIL fixtures;
- resume bullets before real executions/analytics outputs exist.
