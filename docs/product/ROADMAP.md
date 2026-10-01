# Atlas Now / Next / Later roadmap

This roadmap is dependency-driven. It describes evidence needed for the next product step rather than promising dates.

## Now — keep the public product trustworthy

| Workstream | Current state | Exit condition |
| --- | --- | --- |
| Consumer catalog | 157 canonical products with saved/shareable gear, comparison and specialist routes | catalog/media/source checks stay green; no unsourced expansion |
| Product Analytics | typed schema, browser-local real/demo separation and optional Worker collector | production claims remain disabled until real storage is intentionally configured |
| Product Intelligence | sourced catalog distributions, competitor/positioning heuristics and evidence coverage | every derived metric stays labeled as Atlas-sample/heuristic rather than market demand |
| Validation | capability-derived NOT RUN plans, manual session/defect schema and exports | no PASS/FAIL appears without explicit real execution evidence |
| Public engineering | Node 22, npm lockfile, Worker contract tests, CodeQL, SBOM, release contract and verified deploys | every release maps package/repo/health metadata to the exact deployed commit |
| Research operations | source health, source-check dates, media validation and correction templates | stale/broken evidence is corrected or explicitly downgraded rather than silently retained |

## Next — produce evidence Atlas does not have yet

### Production behavior analytics

Dependency: a dedicated analytics D1 database, migration, retention/deletion policy and privacy review.

Then:
- verify privacy signals against production transport;
- validate schema/version handling and failure behavior;
- begin site-wide funnel/feature measurements;
- establish minimum sample/quality thresholds before segment interpretation;
- prioritize consumer changes from observed behavior rather than synthetic fixtures.

### Physical validation sessions

Dependency: owned hardware plus a recorded firmware/receiver/OS/USB test environment.

Then:
- execute P0 enumeration/input/reconnect cases first;
- record actual PASS/FAIL/BLOCKED results and evidence;
- create defects only for observed failures;
- rerun linked regression cases after any real fix or firmware change;
- publish/export reports scoped to the exact tested environment.

### Direct instrumentation cleanup

Dependency: stable feature boundaries in the consumer UI.

Then:
- move remaining bridge-observed interactions to typed feature-level events;
- keep analytics opt-out/GPC/DNT behavior unchanged;
- verify event naming/property limits with existing integrity checks.

### Sourced lifecycle and family context

Dependency: reliable dated manufacturer/archive evidence.

Then:
- expand release/lifecycle fields selectively;
- improve family/revision views where relationships are explicit;
- avoid treating product age or family size as demand.

### Community evidence pilots

Dependency: a declared question and source/sampling plan.

Then:
- collect a small traceable sample across more than one source type where possible;
- retain disagreement and conditions;
- evaluate whether the schema answers the question before increasing volume.

## Later — expand only when evidence quality supports it

- measured/licensed/own shape outlines and cross-sections rather than scraped proprietary assets;
- mousepad/skate physical validation using proven execution/report patterns;
- selective host-visible automation helpers for enumeration/input/config persistence;
- longitudinal pricing analysis after a repeatable dated data source exists;
- demand/opportunity analysis only with actual customer, sales or willingness-to-pay evidence.

## Explicit non-goals

- fake production KPI fixtures presented as users;
- generated PASS/FAIL hardware results;
- market-opportunity scoring from sparse catalog cells;
- universal “best” product rankings;
- scraping proprietary EloShapes/RTINGS geometry assets;
- automation percentage as a goal;
- resume claims that exceed the underlying evidence.
