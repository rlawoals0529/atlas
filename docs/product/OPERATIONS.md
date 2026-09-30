# Atlas product operations

## Prioritization framework

Atlas uses a lightweight **User value × Evidence × Risk × Effort** framework.

For a proposed change, ask:

1. **User value** — does it improve fit discovery, evidence clarity, comparison, validation, or a measured drop-off?
2. **Evidence** — is the problem visible in sourced product data, actual behavior analytics, user feedback, or a reproducible defect?
3. **Risk** — can the change mislead users, regress the recommender/shape model, weaken provenance, or damage deploy reliability?
4. **Effort** — can the smallest coherent version be shipped and measured without creating parallel architecture?

High-value / high-evidence / manageable-risk work comes first. Portfolio value alone is not sufficient reason to build a feature.

## Backlog taxonomy

Use one primary category:

- `consumer-fit`
- `shape-geometry`
- `catalog-research`
- `product-analytics`
- `product-intelligence`
- `validation`
- `community-insight`
- `evidence-provenance`
- `accessibility`
- `performance`
- `security`
- `deployment`

And one work type:

- feature
- defect
- research
- data correction
- technical debt
- experiment

## Issue priority

- **P0** — blocks deployment, corrupts data/results, exposes sensitive information, or breaks a core fit/input path.
- **P1** — materially harms a major user workflow or evidence integrity.
- **P2** — meaningful improvement with workaround or limited scope.
- **P3** — polish, low-frequency edge case or exploratory improvement.

Do not confuse issue priority with hardware defect severity; validation defects maintain a separate severity field.

## Feedback triage

For product/community feedback, capture:

- product/feature;
- problem statement in the user's language;
- source and date;
- affected workflow;
- reproducibility or frequency if known;
- evidence class: single anecdote / repeated observation / quantitative behavior / source-backed fact;
- proposed next evidence, not just proposed solution.

A single community comment can justify investigation; it cannot silently become a product fact.

## Data/research correction workflow

1. Identify the field and current source/evidence record.
2. Determine whether the issue is factual error, revision mismatch, stale source, Atlas-derived-model problem or community disagreement.
3. Add/replace source evidence without deleting useful provenance history.
4. Keep raw facts separate from normalized/editorial fields.
5. Run catalog validation and data-health generation.
6. Note meaningful corrections in release notes/research notes.

## Release checklist

Before merging a release:

- catalog validation passes;
- TypeScript/Vite build passes;
- Wrangler dry-run passes;
- security baseline passes;
- new derived metrics are labeled as derived;
- synthetic/demo data is visibly labeled;
- no generated hardware test is represented as executed;
- keyboard/focus behavior remains usable;
- narrow-screen layout remains functional;
- source/evidence changes include provenance;
- release notes describe user-visible and evidence-model changes.

## QA / release criteria

A release is blocked by:

- broken recommendation/Shape Lab/database navigation;
- invalid catalog records or duplicate IDs/sources;
- uncaught runtime errors on the default path;
- inaccessible controls introduced by the change;
- production build/deploy failure;
- a new metric or score that can be mistaken for measured fact;
- analytics UI that mixes demo and real data;
- validation UI that initializes generated tests as PASS/FAIL.

## Post-release monitoring

After a meaningful release, review:

- deployment/Worker errors;
- `/api/health` and `/api/stats`;
- recommendation completion and result selection when production analytics exists;
- Shape Lab/compare adoption;
- unexpected funnel drop changes;
- data-health/source coverage;
- new user/community feedback;
- validation regressions for any hardware test cases actually executed.

## Change log convention

A release note should separate:

- consumer experience;
- data/research changes;
- analytics/measurement changes;
- validation changes;
- infrastructure/security changes;
- known limitations / evidence still needed.
