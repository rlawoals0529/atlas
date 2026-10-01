# Atlas provisional fit model

Atlas stores a small set of editorial fit fields for pointing devices so the setup finder can explain shape and use-case trade-offs. These values are **not physical measurements, compatibility guarantees, popularity scores, or universal product-quality ratings**.

## What the model uses

Canonical mouse records can contain sourced physical fields such as:

- length, width, height and approximate grip width;
- overall shape and hump position;
- front/rear flare and side curvature;
- mass, polling ceiling and hardware configuration.

Atlas may then attach provisional editorial fields such as:

- hand-length and hand-width ranges;
- grip-style suitability;
- wrist / arm / finger / hybrid aim-style suitability;
- broad game/use-style suitability;
- coating, click, wheel, lift-security and palm-support impressions;
- normalized geometry descriptors used by Shape Lab.

These editorial values exist to make comparison and recommendation behavior inspectable. They are deliberately stored separately from manufacturer specifications and independent measurements.

## Interpretation

Most editorial fit/suitability values use a 0–100 normalized scale.

A higher number means **Atlas currently models the combination as more compatible with that specific use dimension**. It does not mean:

- the product is objectively better;
- a user outside the suggested hand range cannot use it;
- the product has been physically validated by Atlas;
- a 90 is a measured quantity that can be compared to laboratory units;
- community preference or market demand has been measured.

Hand-size ranges are guidance ranges, not hard limits.

## Shape reasoning

The model generally favors relationships such as:

- narrower grip widths and lower mass for finger-heavy control;
- rear humps and stronger rear flare for claw support;
- fuller center/rear volume for more palm contact;
- side taper and front flare as constraints on finger placement and lift security.

These are directional heuristics. Exact comfort depends on anatomy, grip pressure, posture, sensitivity, pad/skate pairing and individual technique.

## Evidence boundary

A product can have high-confidence manufacturer specifications and still have only medium- or low-confidence editorial fit guidance.

When a record cites this document through an editorial source ID, that citation means the value follows this Atlas methodology. It does **not** turn the editorial value into a manufacturer claim or independent measurement.

Where independent measurements, owner-report aggregation or physical Atlas validation become available, those should be stored as their own evidence classes and can supersede provisional editorial assumptions.

## Maintenance rules

When changing the fit model:

1. Do not derive a fit score from product price, brand reputation, review score or sales/popularity.
2. Do not copy subjective reviewer rankings into Atlas numeric fit fields.
3. Keep manufacturer specifications and editorial fit values separately attributed.
4. Explain meaningful heuristic changes in the product changelog.
5. Do not label generated recommendations as physical validation.
6. Prefer leaving a field uncertain or absent over manufacturing precision that the evidence does not support.
