# Atlas architecture

Atlas is a single React/TypeScript product backed by a Cloudflare Worker and a canonical research catalog. The architecture is deliberately biased toward inspectable data, explicit provenance and small validation steps rather than opaque ranking logic.

## System map

```mermaid
flowchart LR
  A[Manufacturer / independent / community sources] --> B[data/catalog*.json shards]
  B --> C[Catalog loader + validators]
  C --> D[React consumer UI]
  C --> E[Recommendation / comparison engines]
  C --> F[Cloudflare Worker API]
  C --> G[Generated reports / SQL seed]

  D --> H[Mouse / pad / skate catalog]
  D --> I[Switches]
  D --> J[Keyboard Lab]
  D --> K[Shape / setup]
  D --> L[Sensitivity Lab]
  D --> M[Product + Validation Labs]

  F --> N[/api/catalog]
  F --> O[/api/products/:slug]
  F --> P[/api/compare]
  F --> Q[/api/recommend]
  F --> R[/api/health + stats]
  F --> S[optional D1 analytics]

  T[GitHub Actions] --> C
  T --> U[Vite / Wrangler dry-run]
  T --> V[Bundle budget]
  T --> W[Accessibility invariants]
  T --> X[Source/media checks]
  T --> Y[Cloudflare deploy]
  Y --> Z[Production health + media smoke tests]
```

## Canonical data

The source of truth is the set of `data/catalog*.json` shards. Runtime code does not define separate product truth.

The loader merges shards into typed product groups:

- mice;
- mousepads;
- skates;
- keyboards;
- switches.

Validation protects global IDs/slugs, evidence references, source definitions, physical bounds, switch requirements and public count drift.

### Why shards

A dated shard makes a research addition reviewable on its own. It is easier to inspect six new switch records, their sources and their media than to review one large regenerated catalog file.

## Evidence model

Atlas distinguishes:

1. manufacturer claims;
2. independent measurements/reviews;
3. community observations;
4. Atlas-derived values.

Those classes are not collapsed into one generic confidence score.

Examples:

- a manufacturer-published total travel value can populate a canonical switch field;
- an external review can provide context without becoming an Atlas rating;
- community evidence can preserve disagreement without being represented as population consensus;
- an Atlas interpolation or fit model is labeled as derived rather than measured.

## Frontend

The React application contains a shared catalog shell plus lazy specialist routes.

Large route-specific data and styles are split where practical. The Switches expansion is the clearest example: switch-only catalog additions and explicit media metadata are loaded with the Switches route instead of increasing the initial application payload for every visitor.

The application uses one comparison system with category-specific summaries instead of unrelated comparison implementations for each product type.

## Worker

The Cloudflare Worker imports the complete canonical catalog server-side so API results remain complete even when the browser code splits route-only data.

Primary responsibilities:

- catalog search;
- product lookup;
- comparison;
- recommendation/similarity utilities;
- health and catalog statistics;
- product-media resolution/fallback;
- optional analytics collection/aggregation when D1 is configured.

The normal catalog/product runtime does not require a database.

## Optional analytics

Behavioral analytics are deliberately optional.

Without a bound `ANALYTICS_DB`:

- Atlas still works;
- Product Lab can display browser-local real events;
- synthetic fixtures remain explicitly marked DEMO / SYNTHETIC.

With a configured D1 binding, the Worker can accept the same typed event schema and expose aggregate summaries.

## Validation Lab

Generated hardware validation cases are plans, not results.

Each generated case starts `NOT RUN`. A person must record a real execution before Atlas stores PASS / FAIL / BLOCKED. Execution records can include firmware, receiver, OS, USB path, settings, evidence notes and linked defects.

This separation is a core data-integrity rule: Atlas never fabricates physical test execution.

## CI / deploy path

A normal PR is expected to pass:

1. production dependency audit;
2. canonical catalog validation;
3. community evidence validation;
4. sensitivity-data validation;
5. Product Lab integrity checks;
6. product media validation;
7. switch-review-index validation;
8. modal accessibility invariants;
9. TypeScript/Vite build;
10. Wrangler dry-run;
11. initial bundle budget.

Main then deploys through Cloudflare Workers and verifies:

- deployed release metadata;
- live canonical catalog counts against the repository checkout;
- API security headers and JSON content type;
- current product-media resolution, including lightweight binary signature checks.

A weekly source-health workflow separately probes cited URLs and treats only confirmed 404/410 responses as hard-broken links. Authentication blocks, rate limits and transient failures are reported separately.

## Performance boundary

Atlas keeps explicit initial JS/CSS budgets in CI. Large dependency upgrades or features are not accepted by simply raising the budget when a smaller implementation is available.

This rule has already rejected a dependency-only React update that exceeded the JS budget.

## Security boundary

The public Worker currently has no user-account system and no required private application datastore.

Repository CI additionally checks for:

- tracked secret/env files;
- obvious literal credentials;
- wildcard CORS regressions;
- dependency integrity;
- unsafe HTML/browser sinks.

Cloudflare credentials live only in repository secrets used by the deploy workflow.

## Third-party material

Manufacturer imagery and external review material remain attributed to their owners/sources. Public repository visibility does not relicense those assets.

The canonical Atlas research records are inspectable, but the repository currently does not grant a general open-source license.
