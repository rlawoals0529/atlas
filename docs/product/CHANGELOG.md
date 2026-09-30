# Atlas product changelog

## v0.8 — Product Lab (unreleased)

### Consumer experience
- adds a discoverable Atlas Product Lab entry from the consumer app;
- adds Product Analytics, Product Intelligence, Product Decisions, Validation and Research Integrity views;
- keeps the visual language aligned with the existing Atlas precision-lab design system.

### Analytics / measurement
- adds a strongly typed first-party event schema;
- stores privacy-limited local events for immediate real-browser analysis;
- provides a clearly labeled synthetic demo dataset for dashboard evaluation;
- adds recommendation funnel, feature-use, product-view, comparison and repeat-visit summaries;
- centralizes instrumentation for the existing large consumer component while future modules migrate to direct typed calls.

### Product intelligence
- adds current-sample weight, MSRP, polling, shape, wireless and brand distributions;
- separates observed findings, hypotheses and evidence still needed;
- treats sparse segments as research prompts rather than automatic market opportunities.

### Validation
- expands capability-derived mouse tests across connectivity, inputs, polling/sensor, configuration, compatibility, power and regression;
- all generated tests initialize as `NOT RUN`;
- adds real manual execution sessions with firmware/receiver/OS/connection/polling context;
- adds PASS/FAIL/BLOCKED recording, reproduction frequency, defect records and JSON report export.

### Product operations
- adds product brief, KPI/event specification, roadmap, backlog/priority rules, release gates, feedback/data-correction workflow, validation protocol and postmortem template.

### Known limitations / next evidence
- browser-local analytics are real for that browser but are not site-wide production aggregates;
- no community sentiment has been mass-ingested yet;
- no hardware PASS/FAIL results are claimed until real devices are tested;
- launch/lifecycle and market-demand analysis remain limited to fields with reliable sources.

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
