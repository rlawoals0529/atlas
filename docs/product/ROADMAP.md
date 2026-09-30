# Atlas Now / Next / Later roadmap

This roadmap is dependency-driven. It is not a promise of dates and it does not treat portfolio coverage as a product requirement.

## Now — make the evidence systems coherent and releasable

| Workstream | Current state | Exit condition |
| --- | --- | --- |
| Product Analytics | typed schema v2, local-real/demo separation, privacy controls, funnel/engagement KPIs, optional production transport | CI green; production remains explicitly unavailable unless real storage is configured |
| Product Intelligence | distributions, brand positioning, competitor heuristic, correlation/matrix analysis, catalog constellation | all measures label their Atlas-sample denominator/derived status; accessible/responsive visualization |
| Validation | capability-derived `NOT RUN` cases, requirement provenance, manual session UI, defects, structured report builder | generated cases cannot become results without explicit execution status; integrity regression passes |
| Community evidence | typed schema + aggregation limitations + collection protocol | no mass ingestion until a small reviewable source/sample plan exists |
| Product Operations | working brief/backlog/ops/validation/changelog plus decision records and release gate | docs describe real Atlas choices and current dependencies rather than generic process |

## Next — produce real evidence

### Production behavior analytics

Dependency: dedicated analytics D1 + migration + retention/deletion policy.

Then:

- verify privacy signals against production transport;
- validate schema/version handling;
- begin site-wide funnel/feature measurements;
- set minimum sample/quality thresholds before segment interpretation;
- use observed drop-off to prioritize consumer-flow changes.

### Physical validation sessions

Dependency: an owned real mouse + recorded environment/firmware.

Then:

- execute the P0 enumeration/input/reconnect set first;
- record actual results and evidence;
- create defects only for observed failures;
- rerun linked regression cases after any real fix/firmware change;
- publish/export a report scoped to the executed environment.

### Small community evidence pilot

Dependency: a declared sampling question and source policy.

Then:

- select one product + one attribute question;
- capture a small traceable sample across more than one source type when possible;
- preserve disagreement and conditions;
- review whether the schema answers the question before increasing volume.

### Instrumentation modularization

Dependency: stable boundaries extracted from `AppV05`.

Then replace bridge-observed interactions with direct typed event calls in the relevant feature modules.

## Later — expand only when evidence quality supports it

- measured/licensed/own shape outlines rather than scraped proprietary assets;
- mousepad/skate validation sessions using proven execution/report patterns;
- selective host-visible automation helper for enumeration/input/config persistence;
- longitudinal pricing/lifecycle analysis after reliable dated data collection exists;
- richer family/revision positioning after family relationships are consistently sourced;
- report rendering beyond JSON after real validation sessions create content worth presenting.

## Explicit non-goals

- fake production KPI fixtures presented as users;
- generated PASS/FAIL hardware results;
- market-opportunity scoring from sparse catalog cells;
- universal “best mouse” rankings;
- scraping EloShapes/RTINGS proprietary shape assets;
- maximum automation percentage;
- resume bullets before the underlying evidence exists.
