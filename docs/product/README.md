# Atlas product operating system

This folder documents how Atlas is actually being built and operated. It is not a generic portfolio-document pack.

## Documents

- `PRODUCT_BRIEF.md` — users, problem, goals, non-goals and success questions.
- `ROADMAP.md` — dependency-aware Now / Next / Later roadmap tied to current Atlas systems.
- `BACKLOG.md` — evidence-driven current priorities, dependencies and exit criteria.
- `ANALYTICS_SPEC.md` — first-party event schema, privacy boundary, KPI/funnel definitions, demo-data policy and optional production collector.
- `OPERATIONS.md` — prioritization, issue/feedback triage, release criteria and post-release monitoring.
- `DECISIONS.md` — lightweight records for architecture/research decisions that materially changed Atlas.
- `VALIDATION_PROTOCOL.md` — hardware/system validation workflow, requirement provenance, execution evidence, defect reporting and selective automation.
- `COMMUNITY_EVIDENCE_PROTOCOL.md` — evidence schema, sampling/consensus limitations and ingestion rules before community research scales.
- `COMMUNITY_PILOT_2026Q3.md` — first real qualitative-evidence pilot across three current mice, including findings, disagreements and limits.
- `RESEARCH_CORRECTION_WORKFLOW.md` — canonical data/evidence correction process.
- `RELEASE_CHECKLIST.md` — concrete release gates for consumer, evidence, analytics, validation, engineering and security.
- `CHANGELOG.md` — consumer, research, analytics, validation and infrastructure release history/limitations.
- `POSTMORTEM_TEMPLATE.md` — lightweight incident/post-release learning template.

## Current product decisions these docs reflect

1. Atlas is an evidence-aware fit/comparison product, not a universal ranking site.
2. Shape similarity is grip-aware and exposes component differences instead of hiding everything behind one score.
3. Source class and confidence stay separate.
4. Product Intelligence describes the curated Atlas sample unless broader evidence is explicitly added.
5. Behavioral analytics distinguishes actual first-party events from synthetic dashboard demo events and respects local opt-out/GPC/DNT.
6. Site-wide production analytics exists only when a real `ANALYTICS_DB` binding is configured; otherwise the dashboard does not claim site-wide metrics.
7. Capability-derived hardware tests begin `NOT RUN`. PASS/FAIL requires a real physical execution record.
8. Severity and backlog/test priority remain separate concepts.
9. Automation is used where host-visible behavior is repeatable; physical feel and intermittent hardware behavior remain manual-first.
10. Community observations remain traceable evidence, not population sentiment; the 2026 Q3 pilot demonstrates this with real sources and disagreement handling.
11. Portfolio value is a byproduct of building a useful, well-operated product; it is not sufficient justification for a feature.
