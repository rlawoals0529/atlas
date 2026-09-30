# Atlas prioritized backlog

This is a working backlog for the product, not a resume checklist. Priorities use the Atlas **User value × Evidence × Risk × Effort** framework from `OPERATIONS.md`.

## Delivered on the current Product Lab integration branch

These are implemented capabilities, not production outcomes:

- typed analytics schema v2 with recommendation-step/abandonment and overlay events;
- browser-local real data vs deterministic demo separation;
- local opt-out + GPC/DNT collection controls;
- activation/completion/abandonment/compare/depth/outbound KPI calculations;
- optional validated production collector that remains disabled without real storage;
- Product Intelligence distributions, matrices, brand positioning, direct-competitor heuristic and catalog constellation;
- requirement-sourced validation plans that initialize `NOT RUN`;
- real manual-session/defect UI from the v0.8 Product Lab work;
- richer environment/reliability/automation-suitability model and structured report builder;
- community evidence schema/protocol before ingestion;
- decision records, release gate and research-correction workflow.

## Now

| Priority | Work | Why now | Evidence / trigger | Exit criteria |
| --- | --- | --- | --- | --- |
| P0 | Keep Product Lab integration build/deploy green | New evidence systems must not destabilize the consumer product | CI, Wrangler dry-run and security baseline | all required checks pass on the integration PR |
| P1 | Finish integration/review against concurrent Atlas branches | PRs #10/#11/#12 contain overlapping history and should not create duplicate architecture | current open PR state | strongest implementation retained; redundant prototype paths not merged |
| P1 | Verify Product Lab responsive/accessibility behavior | New charts/forms increase density | current new constellation/privacy controls | keyboard focus, reduced motion and narrow widths remain usable |
| P1 | Keep analytics/validation integrity regression aligned with schema v2 | These are portfolio-sensitive claims where regressions could mislabel evidence | analytics/validation source changes | CI asserts privacy/demo/NOT RUN/provenance invariants |

## Next

| Priority | Work | Why | Evidence still needed / dependency |
| --- | --- | --- | --- |
| P1 | Connect `ANALYTICS_DB` and production aggregate view | Enables actual all-user funnels/feature usage | dedicated Cloudflare D1, migration, retention/deletion policy, production traffic |
| P1 | Execute validation sessions on owned mice | Produces real System Test / Validation evidence | physical devices, firmware/receiver versions, Windows test environment |
| P1 | Validation evidence attachments/metadata | PASS/FAIL should be auditable | decide storage/privacy policy; R2/local-export path |
| P2 | Replace DOM analytics bridge with direct feature instrumentation | Cleaner long-term architecture | refactor large `AppV05` into stable feature modules |
| P2 | Small community-insight pilot | Adds qualitative evidence without premature scale | define one question, source set and sampling approach |
| P2 | Product-family positioning | Useful category analysis | consistently sourced family/revision relationships |
| P2 | Launch/lifecycle dates | Enables release cadence analysis | reliable dated manufacturer/archive sources |
| P2 | Measured outline ingestion | Improves geometry validity beyond parametric silhouettes | licensed/own measured SVG/scan data |

## Later

| Priority | Work | Why not now |
| --- | --- | --- |
| P2 | Cross-section / 3D comparison | Needs trustworthy geometry rather than decorative pseudo-3D |
| P2 | Mousepad/skate validation sessions | Reuse mouse validation architecture after device workflow is proven |
| P3 | Host-visible test helper | Useful selective automation, but real manual execution evidence should establish priorities first |
| P3 | Longitudinal price analysis | Needs a time-series data source and collection policy |
| P3 | Market opportunity sizing | Sparse catalog cells are not demand; requires sales/customer/willingness-to-pay evidence |

## Explicitly not prioritized

- universal product rankings;
- scraping proprietary EloShapes/RTINGS shape assets;
- mass Reddit ingestion before the evidence schema and sampling policy are proven;
- automation percentage as a goal;
- fake hardware PASS/FAIL fixtures;
- resume bullets before real executions/analytics outputs exist.
