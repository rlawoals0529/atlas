# Atlas product operating system

This folder documents how Atlas is actually being built and operated. It is not a generic portfolio-document pack.

## Documents

- `PRODUCT_BRIEF.md` — users, problem, goals, non-goals, KPIs and Now/Next/Later roadmap.
- `BACKLOG.md` — evidence-driven current priorities, dependencies and exit criteria.
- `ANALYTICS_SPEC.md` — first-party event schema, privacy boundary, funnel definitions, demo-data policy and optional production collector.
- `OPERATIONS.md` — prioritization, release criteria, feedback/issue triage, data correction and post-release monitoring.
- `VALIDATION_PROTOCOL.md` — hardware/system validation workflow, execution evidence, defect reporting and selective automation.
- `CHANGELOG.md` — consumer, research, analytics, validation and infrastructure release history/limitations.
- `POSTMORTEM_TEMPLATE.md` — lightweight incident/post-release learning template.

## Current product decisions these docs reflect

1. Atlas is an evidence-aware fit/comparison product, not a universal ranking site.
2. Shape similarity is grip-aware and exposes component differences instead of hiding everything behind one score.
3. Source class and confidence stay separate.
4. Product Intelligence describes the curated Atlas sample unless broader evidence is explicitly added.
5. Behavioral analytics distinguishes actual first-party events from synthetic dashboard demo events.
6. Site-wide production analytics exists only when a real `ANALYTICS_DB` binding is configured; otherwise the dashboard says that data is browser-local.
7. Capability-derived hardware tests begin `NOT RUN`. PASS/FAIL requires a real physical execution record.
8. Severity and backlog/test priority remain separate concepts.
9. Automation is used where host-visible behavior is repeatable; physical feel and intermittent hardware behavior remain manual-first.
10. Portfolio value is a byproduct of building a useful, well-operated product; it is not sufficient justification for a feature.
