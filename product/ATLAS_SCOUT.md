# Atlas Scout

## Product idea

Atlas Scout is a narrow, review-first background research and product-operations capability for Atlas.

It borrows a useful interaction pattern from modern always-on agents: assign one bounded responsibility, let the system keep checking it over time, and surface only the work or decisions that need human review. It does **not** copy another product's branding, interface, or autonomous permission model.

Scout exists because Atlas has recurring work that is naturally ongoing:

- manufacturers release revisions and new products;
- firmware/software changes can invalidate validation assumptions;
- source links become stale;
- catalog evidence ages;
- product families change positioning;
- planned validation sessions need follow-up and regression work.

## Responsibilities

### Catalog freshness

Scout can identify records whose evidence has not been checked recently, broken source URLs, products that appear to have a successor, or manufacturer specs that have changed.

Output: a **research task**, never an automatic fact replacement.

### Release / revision watch

Scout can surface likely new revisions, firmware releases, new polling-rate options, connectivity changes, and family additions.

Output: a diff candidate with old value, proposed value, source, source date, and confidence.

### Product intelligence refresh

When the catalog changes materially, Scout can queue a refresh of category distributions and flag analytical statements that may now be stale.

Output: "recompute needed" or a draft observed finding, not an automatic market recommendation.

### Validation follow-up

For devices with executed validation sessions, Scout can identify when a new firmware/software version should trigger a regression session.

Output: a proposed regression checklist linked to the previous execution. It must remain `PLANNED / NOT RUN` until a person executes it on hardware.

### Product-ops follow-up

Scout can surface overdue research corrections, untriaged feedback, release checklist items, and monitoring tasks.

Output: a prioritized review queue.

## Permission model

Scout is intentionally conservative.

It may:

- read public manufacturer/research sources;
- compare source facts with current Atlas records;
- generate proposed changes;
- create research/validation tasks;
- summarize evidence and uncertainty.

It may **not** silently:

- overwrite canonical catalog facts;
- publish community sentiment as market-wide truth;
- mark hardware tests PASS/FAIL;
- close defects as fixed;
- deploy code;
- spend money or purchase products;
- send external messages on the user's behalf.

Human review is the boundary between observation and canonical Atlas data.

## Task state

A future Scout task should use a small explicit lifecycle:

- `detected`
- `needs-research`
- `ready-for-review`
- `approved`
- `rejected`
- `applied`
- `superseded`

Every task should retain:

- task ID;
- responsibility type;
- affected product/family;
- detected date;
- source URLs;
- old value/state;
- proposed value/state;
- evidence strength;
- uncertainty/note;
- reviewer decision;
- linked commit/release when applied.

## Implementation strategy

Start without an LLM dependency:

1. Cloudflare scheduled Worker checks deterministic freshness rules and a curated source queue.
2. Scout creates review tasks from source/freshness deltas.
3. Atlas displays the queue inside the Product Lab / Product Ops area.
4. Add AI-assisted summarization only where it clearly improves evidence review, with source citations and strict output schemas.
5. Never allow model output to become canonical data without validation and review.

This keeps cost, prompt-injection exposure, and operational complexity low while still demonstrating an always-on product-operations workflow.

## Portfolio value

Scout naturally connects several Atlas disciplines:

- **Product Analyst:** detects data shifts and stale analyses.
- **Product Operations:** creates and triages recurring product work.
- **System Validation:** triggers regression planning after firmware/revision changes.
- **Software Engineering:** scheduled Workers, typed task states, provenance, review workflows, and bounded automation.

The value is the workflow and control model, not the presence of an AI agent for its own sake.
