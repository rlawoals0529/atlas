# Atlas prioritized backlog

This is a working product backlog, not a resume checklist. Priority follows the Atlas **User value × Evidence × Risk × Effort** framing in `OPERATIONS.md`.

## Recently delivered

These are implemented capabilities, not claimed market or hardware outcomes:

- public v0.9.1 release with package/release/health metadata contract;
- 157-product canonical catalog, including 73 sourced keyboard switches;
- browser-local saved gear, shareable shortlists and shareable product-detail links;
- dedicated Switches/Mousepads destinations and category-specific comparison;
- source-check recency in product inspectors;
- weekly source-link health and changed-switch media verification;
- production media binary-signature checks;
- Worker API contract tests, CodeQL, shared security baseline and CycloneDX SBOM;
- Node 22 + `npm ci` reproducible CI/deploy path;
- release notes/changelog/reviewer/architecture/data-dictionary documentation;
- automatic merged-branch pruning.

## Now

| Priority | Work | Why now | Exit criteria |
| --- | --- | --- | --- |
| P0 | Keep catalog/media/source health green | public research value depends on traceable current evidence | CI + source/media checks pass; broken sources are fixed or downgraded |
| P0 | Keep release/deploy contract green | public tags must correspond to what production reports | package, RELEASE.label, README, changelog, notes and /api/health agree |
| P1 | Maintain bundle headroom | current JS is close enough to its budget that dependency/UI growth needs discipline | initial JS/CSS remain below enforced raw/gzip budgets |
| P1 | Preserve accessibility on dense/shareable flows | drawers, compare and mobile catalog controls continue to grow | focus, modal, keyboard and narrow-width checks remain usable |
| P1 | Keep public security dependencies pinned | shared workflows are part of Atlas's supply chain | immutable Action/reusable-workflow refs and green security/CodeQL checks |

## Next

| Priority | Work | Why | Evidence / dependency |
| --- | --- | --- | --- |
| P1 | Configure production analytics intentionally | enables actual cross-user funnels/feature use | D1, migration, retention/deletion policy, privacy verification, real traffic |
| P1 | Execute real hardware validation sessions | turns test plans into actual QA evidence | owned devices + firmware/receiver/OS/USB environment |
| P1 | Add validation evidence attachments | makes observed PASS/FAIL auditable | storage and privacy policy |
| P2 | Replace remaining analytics bridge instrumentation | reduces architectural coupling | stable feature-module boundaries |
| P2 | Expand sourced lifecycle/family relationships | improves product context | reliable dated manufacturer/archive evidence |
| P2 | Continue small community evidence pilots | adds qualitative context without fake consensus | declared question/source/sample plan |
| P2 | Add measured/licensed outline data selectively | improves shape validity beyond parametric fallback | own/licensed measured SVG/scan data |

## Later

| Priority | Work | Why not now |
| --- | --- | --- |
| P2 | Cross-section / 3D comparison | needs trustworthy geometry, not decorative pseudo-3D |
| P2 | Mousepad/skate physical validation | reuse the device workflow after mouse execution is proven |
| P3 | Host-visible test helper | useful only after real manual execution establishes automation priorities |
| P3 | Longitudinal price analysis | needs a time-series source and collection policy |
| P3 | Market opportunity sizing | catalog density is not demand; requires customer/sales/willingness-to-pay evidence |

## Explicitly not prioritized

- universal product rankings;
- scraping proprietary EloShapes/RTINGS shape assets;
- mass Reddit/X ingestion before sampling/provenance rules are proven;
- automation percentage as a goal;
- fake hardware PASS/FAIL fixtures;
- resume claims before real executions or analytics outputs exist.
