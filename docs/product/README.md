# Atlas product operating system

This folder documents how Atlas is actually being built and operated. It is not a generic portfolio-document pack.

## Documents

- `PRODUCT_BRIEF.md` — users, problem, goals, non-goals, KPIs and roadmap.
- `ANALYTICS_SPEC.md` — first-party event schema, privacy boundary, funnel definitions and demo-data policy.
- `OPERATIONS.md` — prioritization, backlog rules, release criteria, feedback/issue triage and post-release monitoring.
- `VALIDATION_PROTOCOL.md` — hardware/system validation workflow, execution evidence, defect reporting and selective automation.
- `POSTMORTEM_TEMPLATE.md` — lightweight incident/post-release learning template.

## Current product decisions these docs reflect

1. Atlas is an evidence-aware fit/comparison product, not a universal ranking site.
2. Shape similarity is grip-aware and exposes component differences instead of hiding everything behind one score.
3. Source class and confidence stay separate.
4. Product Intelligence describes the curated Atlas sample unless broader evidence is explicitly added.
5. Behavioral analytics distinguishes actual first-party events from synthetic dashboard demo events.
6. Capability-derived hardware tests begin `NOT RUN`. PASS/FAIL requires a real physical execution record.
7. Automation is used where host-visible behavior is repeatable; physical feel and intermittent hardware behavior remain manual-first.
