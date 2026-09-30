# Atlas product decision records

These records capture decisions that materially changed the implementation. They are intentionally lightweight: one decision, the evidence/constraint behind it, the chosen path and what would cause reconsideration.

## ADR-001 — Integrate the Product Lab into current Atlas architecture

**Status:** accepted

**Context:** Draft PR #10 (`career/product-validation`) proved useful Product Intelligence and validation concepts but intentionally isolated them behind a `#lab` experiment. PR #11 built those ideas into the newer evidence-aware Atlas architecture.

**Decision:** Treat PR #10 as a prototype/reference, not a merge target. Build on the current consumer/research architecture and expose the Product Lab as a native Atlas surface.

**Why:** Avoid parallel routers/models, keep the consumer experience coherent and preserve newer provenance/security work.

**Reconsider if:** the Product Lab ever needs a separately deployed authenticated internal surface with materially different data/access requirements.

## ADR-002 — Keep one typed analytics contract and a transitional centralized bridge

**Status:** accepted

**Context:** `AppV05` is large. Scattering string analytics calls through it would make the instrumentation hard to audit and easy to break.

**Decision:** Define event names/properties in `src/shared/analytics.ts`; use a centralized DOM bridge for the existing large component; migrate to direct typed calls as feature modules are extracted.

**Why:** Gives Atlas analyzable events now without forcing an unrelated large refactor.

**Reconsider if:** the bridge begins misclassifying interactions or stable feature modules make direct instrumentation cheaper and safer.

## ADR-003 — Analytics collection is privacy-minimal and user/browser controllable

**Status:** accepted

**Context:** Product analytics needs session/funnel context but not identity. A parallel analytics PR (#12) demonstrated useful GPC/DNT/local opt-out patterns.

**Decision:** Adopt local opt-out plus Global Privacy Control and Do Not Track handling; do not collect names, email, raw search text, exact hand measurements or cross-site identifiers; clear local analytics state on Atlas opt-out.

**Why:** The product question can be answered with coarse product behavior and random first-party IDs.

**Reconsider if:** a future metric demonstrably requires a new field; that change must be documented before collection and should prefer aggregation/coarse values.

## ADR-004 — Production analytics remains optional until storage and retention are real

**Status:** accepted

**Context:** Atlas has no evidence that a production D1 binding/retention policy is currently configured.

**Decision:** Keep `ANALYTICS_DB` optional. The UI says `PRODUCTION / NOT CONFIGURED` or `UNAVAILABLE` rather than substituting browser/demo data.

**Why:** Prevents fake site-wide analytics and avoids deploying storage policy by implication.

**Reconsider if:** a dedicated D1 database is created, migration applied and retention/deletion policy documented.

## ADR-005 — Use point fields as Atlas-native information visualization

**Status:** accepted

**Context:** The requested “OpenAI dots” reference was researched against OpenAI's current Dots product and brand guidance. Copying OpenAI branding or decorative particle motion would not serve Atlas.

**Decision:** Use a catalog constellation where each dot maps to a real mouse record and visual encodings map to sourced/declared fields. Pair it with denominators, matrices and written limitations.

**Why:** It extends Atlas's technical visual identity while making dense product positioning inspectable.

**Reconsider if:** the visualization stops answering a real category question or becomes less accessible/readable than a table.

## ADR-006 — Generated hardware coverage is never an execution result

**Status:** accepted

**Context:** Catalog capabilities can generate useful test design, but Atlas cannot physically execute hardware.

**Decision:** Every generated case is `NOT RUN`. PASS/FAIL/BLOCKED exists only in a manual session record with environment and observed result. Reliability claims require actual duration/cycle exposure.

**Why:** Prevents fabricated validation evidence while still making requirements-based test planning useful.

**Reconsider if:** a future hardware test helper can produce auditable machine evidence; even then, automation output must be stored as execution evidence rather than changing the meaning of a generated plan.

## ADR-007 — Community evidence schema precedes ingestion

**Status:** accepted

**Context:** Enthusiast discussion is useful but strongly self-selected and easy to overgeneralize.

**Decision:** Preserve product/attribute/source/date/conditions/evidence strength/sample size/disagreement before scaling collection. Do not publish a “community sentiment percentage” from convenience samples.

**Why:** Research integrity is more valuable than volume.

**Reconsider if:** Atlas obtains a genuinely structured/representative research source with a defined sampling frame.
