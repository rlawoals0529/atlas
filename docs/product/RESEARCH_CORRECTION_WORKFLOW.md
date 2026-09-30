# Atlas research correction workflow

This workflow exists because a product database is expected to become stale or contain revision/source ambiguity. Corrections should improve the evidence trail rather than silently overwrite it.

## 1. Classify the correction

Choose the primary issue:

- factual specification error;
- product/revision mismatch;
- stale lifecycle/pricing record;
- source disagreement;
- Atlas normalization/derived-model error;
- missing provenance;
- community observation incorrectly promoted to fact.

## 2. Locate the canonical field and provenance

Identify:

- product ID and exact field;
- current raw/normalized value;
- attached `EvidenceNote` and source IDs;
- source dates/classes;
- any family/revision relationship that changes interpretation.

Do not fix a visible UI value in isolation if the canonical catalog/evidence record is wrong.

## 3. Evaluate the evidence

Prefer the most direct appropriate evidence for the claim:

1. manufacturer source for manufacturer-stated specifications/lifecycle;
2. independent measurement for physical/performance measurements;
3. multiple traceable community observations for experience questions, still labeled as community evidence;
4. Atlas derivation only for values computed transparently from sourced inputs.

When credible sources disagree, preserve the disagreement and avoid inventing a reconciled value without a defensible rule.

## 4. Make the smallest canonical change

- update the correct catalog shard/source record;
- retain useful source history rather than erasing it;
- update confidence/note if evidence quality changes;
- keep manufacturer-stated and independently measured values separate;
- update derived outputs only through their shared calculation code.

## 5. Validate downstream impact

Run:

- catalog validation;
- data-health report generation;
- Product Lab integrity regression when analytics/intelligence/validation semantics are affected;
- TypeScript/Vite/Worker checks.

Inspect affected recommendation, Shape Lab, Product Intelligence and source/provenance surfaces when relevant.

## 6. Record material corrections

For a correction that changes user-visible interpretation, add a concise changelog/research note containing:

- what changed;
- which product/field was affected;
- why the old value was insufficient;
- source class used for the correction;
- any remaining uncertainty.

## 7. Do not convert correction evidence into a stronger claim

Examples:

- a new manufacturer page can correct advertised weight; it does not establish measured unit-to-unit variation;
- one owner report can reveal a QC hypothesis; it does not establish a defect rate;
- a sparse Atlas segment can reveal a curation gap; it does not establish unmet market demand.
