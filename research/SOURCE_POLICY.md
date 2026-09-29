# Input Atlas source policy

## Evidence classes
1. **Manufacturer** — best for official dimensions, materials, supported polling rates, included dongles/accessories, firmware features, compatibility statements, MSRP.
2. **Independent measurement** — best for actual mass, click force/travel, click latency, sensor latency, CPI deviation, polling stability, 3D geometry and controlled pad tests.
3. **Community evidence** — best for long-term coating behavior, humidity response, break-in, QC patterns, grip-specific fit, sleeve drag, uncommon mouse/pad/skate combinations.
4. **Editorial/derived** — Input Atlas transformations such as fit vectors or normalized speed indices. These must always be labeled as derived.

## Rules
- Never overwrite a raw measurement with a normalized score.
- Keep manufacturer-claimed and independently-measured values side by side when they differ.
- Subjective claims need multiple independent observations before confidence can become `high`.
- A product revision gets a separate variant/revision record when switches, encoder, coating, firmware behavior, skate geometry, shell tooling or sensor implementation materially changes.
- Community anecdotes are evidence, not ground truth. Record sample size and disagreement once aggregation is implemented.
- Every imported source stores `checked_at`; stale commercial specs should be rechecked periodically.

## Current research anchors
- RTINGS: click latency, sensor latency, CPI, shape/grip-width, actuation force/travel methodologies.
- TechPowerUp/pzogel: high-polling behavior, motion delay, CPI/polling interactions and firmware implementation detail.
- EloShapes: broad shape/spec comparison and useful shape vocabulary (front flare, hump placement, side curvature).
- r/MouseReview: grip subtypes, 1-2-2 vs 1-3-1, coating/QC, weight balance, sensor position, switch/encoder feel.
- r/MousepadReview: static/dynamic friction, X/Y behavior, humidity, base softness, break-in and skate interactions.
- Manufacturer product/support pages: first-party facts and compatibility restrictions.
