# Atlas product changelog

## v0.8 — Product Lab (unreleased)

### Consumer experience
- standardizes the public product name as **Atlas**;
- adds a discoverable Product Lab entry in the consumer navigation plus a compact floating shortcut;
- adds Product Analytics, Product Intelligence, Product Decisions, Validation and Research Integrity views;
- keeps the visual language aligned with the existing Atlas precision-lab design system.

### Analytics / measurement
- adds a strongly typed first-party event schema for search, product views, filtering, comparisons, Shape Lab, similarity, recommendation funnel, outbound engagement, Product Lab and validation actions;
- stores privacy-limited local events for immediate real-browser analysis;
- provides a clearly labeled synthetic demo dataset for dashboard evaluation;
- adds recommendation funnel, feature-use, product-view, comparison, filter-use and repeat-visit summaries;
- adds descriptive Shape Lab-vs-other session-depth comparison, coarse product-relevant segment analysis and attribute-level outbound engagement ratios with causal caveats;
- adds an optional same-origin production collector with event-specific server validation, bounded batches/body sizes, write throttling, deduplication and aggregate summaries;
- keeps production storage disabled unless a real D1 database is bound as `ANALYTICS_DB`;
- surfaces production analytics status explicitly and refuses to substitute browser/demo data if a production source is missing or unavailable;
- centralizes instrumentation for the existing large consumer component while future modules migrate to direct typed calls.

### Product intelligence
- adds current-sample weight, MSRP, polling, shape, wireless and brand distributions;
- adds brand lineup positioning summaries;
- adds Atlas-derived direct competitor sets combining shape, weight, MSRP, polling and wireless parity;
- separates observed findings, hypotheses and evidence still needed;
- treats sparse segments as research prompts rather than automatic market opportunities;
- labels positioning/competitor scores as Atlas heuristics rather than demand, sales or market-share evidence.

### Community / customer insight foundation
- adds a structured schema for product attribute, sentiment, traceable source, date, conditions, evidence strength, sample size and disagreement;
- intentionally does not mass-ingest community sentiment before sampling/provenance rules are established.

### Validation
- expands capability-derived mouse tests across connectivity, inputs, polling/sensor, configuration, compatibility, power and regression;
- all generated tests initialize as `NOT RUN`;
- adds real manual execution sessions with firmware, receiver, OS/build, host, USB path, connection, DPI/polling, configuration software and environment context;
- adds PASS/FAIL/BLOCKED recording, actual result, reproduction frequency and evidence notes;
- adds professional defect records with severity, separate priority, reproduction steps, expected/actual behavior, suspected layer, evidence reference, linked test and regression-test linkage;
- exports manual validation session data as JSON with an integrity note that generated cases are not results.

### Product operations
- adds product brief, KPI/event specification, roadmap, evidence-driven prioritized backlog, release gates, feedback/data-correction workflow, validation protocol, changelog and postmortem template;
- keeps portfolio value subordinate to real user/evidence value in the prioritization framework.

### Quality / infrastructure
- adds a Product Lab integrity regression script that fails CI if Atlas branding regresses, generated tests default to PASS/FAIL, demo analytics can reach production transport, evidence caveats disappear or a fake analytics D1 binding is introduced;
- fixes Atlas CI/deploy workflows to use the repository's actual install path rather than assuming a nonexistent lockfile;
- pins first-party workflow actions to immutable commit SHAs;
- gates deployment on catalog validation, Product Lab integrity validation, dependency audit, generated-artifact checks, TypeScript/Vite build and Wrangler dry-run.

### Known limitations / next evidence
- browser-local analytics are real for that browser but are not site-wide production aggregates;
- production aggregates remain unavailable until a real D1 binding/migration/retention policy is configured;
- no community sentiment has been mass-ingested yet;
- no hardware PASS/FAIL results are claimed until real devices are tested;
- launch/lifecycle and market-demand analysis remain limited to fields with reliable sources;
- the consumer app's centralized DOM analytics bridge is transitional and should be replaced with direct typed instrumentation as `AppV05` is modularized.

## v0.7 — Release quality and data health
- centralized release/research-cutoff metadata;
- added `/api/stats` and generated catalog data-health reporting;
- strengthened validation/deploy checks and research correction standards;
- added installable web-app metadata.

## v0.6 — Catalog maintenance and current research
- introduced catalog shards;
- kept JSON as canonical source while generating SQL on demand;
- expanded current Razer records and product-family relationships;
- explicitly labeled Atlas-derived feel interpolation.

## v0.5 — Evidence-first product lab foundation
- redesigned evidence/provenance UI;
- expanded product family/revision context;
- exposed grip-aware similarity modes and component geometry scores;
- strengthened database filtering, compare workflows and Worker APIs;
- removed unused D1 deployment blocker and added guarded deployment workflow.

## v0.4 — Shape Lab and visual system
- added the precision-lab visual direction;
- added grip-aware shape similarity and per-dimension match components;
- improved overlay controls and accessibility behavior.
