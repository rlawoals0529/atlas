# Reviewer guide

This guide is for someone evaluating Atlas without wanting to read the repository front to back.

## Five-minute product tour

1. Open the live site: https://atlas.rlawoals0529.workers.dev/
2. Open **Keyboards** and confirm the catalog contains complete boards only; use **Keyboard Lab** for deeper board analysis.
3. Open **Switches** and filter by technology / feel, then compare two switches and inspect published force/travel plus source evidence.
4. Open **Shape / pointing setup** and inspect mouse geometry/comparison.
5. Open **Validation Lab** and confirm generated cases begin `NOT RUN`.
6. Open **Product Lab** to see how the same canonical catalog supports product analysis and QA planning.

## Five-minute repository tour

Start here:

- `README.md` — current product scope and constraints.
- `docs/PORTFOLIO_CASE_STUDY.md` — product/engineering decisions.
- `docs/ARCHITECTURE.md` — runtime/data/CI architecture.
- `CONTRIBUTING.md` — evidence and correction rules.
- `data/catalog*.json` — canonical sourced product records.
- `scripts/validate-data.mjs` — catalog/provenance invariants.
- `.github/workflows/ci.yml` — full PR validation gate.
- `.github/workflows/deploy.yml` — Cloudflare deployment and production checks.
- `docs/product/VALIDATION_PROTOCOL.md` — physical test evidence rules.

## Things worth checking

### Evidence integrity

Pick any current switch record and trace:

```text
catalog product
  -> source ID
  -> source URL
  -> evidence block
  -> UI presentation
```

The useful behavior is not that Atlas always has a number. It is that missing/weak evidence stays visible rather than being filled with an invented value.

### Frontend performance

The switch catalog grew substantially, but switch-only data/media moved behind the lazy Switches route rather than all being added to the initial bundle.

The bundle budget is enforced by CI.

### QA / validation

Generated capability-based tests are separated from executed results.

A planned case is not a pass. The UI and data model require explicit execution evidence before a real result exists.

### Accessibility

Comparison dialogs and dense controls have CI invariants for keyboard/focus behavior in addition to ordinary visual styling.

### Production verification

After main CI succeeds, the deploy workflow:

1. rebuilds/validates;
2. deploys through Wrangler;
3. verifies the live release/health endpoint;
4. probes current product media.

## What Atlas does not claim

Atlas should not be evaluated as a complete market database or hardware lab.

It intentionally does not claim:

- representative market coverage;
- measured performance where only a manufacturer claim exists;
- sales/demand/market share from catalog composition;
- universal magnetic-switch compatibility;
- a universal best-product score;
- test results for hardware that was never physically executed.

Those boundaries are part of the implementation, not disclaimer text added after the fact.
