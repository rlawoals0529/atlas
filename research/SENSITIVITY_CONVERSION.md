# Atlas sensitivity conversion methodology

Research cutoff: **2026-09-30**

Atlas Sensitivity Lab is a physical-turn-distance tool. It matches **base horizontal cm/360** across games using DPI, in-game sensitivity and a game yaw constant.

## Formula

For a source and target game:

```text
targetSensitivity =
  sourceSensitivity × sourceDPI × sourceYaw
  ÷ targetDPI ÷ targetYaw
```

Physical distance:

```text
cm/360 = 360 × 2.54 ÷ (DPI × sensitivity × yaw)
```

The conversion invariant is that source and target `cm/360` are equal before display rounding.

## What yaw means here

`yaw` is the horizontal degrees of camera rotation per mouse count at sensitivity 1. It is not a performance rating, DPI multiplier or FOV value.

## Preset provenance

The canonical preset list lives in `data/sensitivity-games.json`, where each value carries source URLs, confidence and a note.

### Counter-Strike 2 — 0.022

High-confidence preset based on the Quake/Source 0.022 convention documented in KovaaK's Sensitivity Matcher and CS2 config tooling that uses `m_yaw 0.022`.

Sources:

- https://github.com/KovaaK/SensitivityMatcher/blob/master/ReleaseAssets/bin/SensitivityMatcher.au3
- https://github.com/FNScence/CSAFAP-config-package

### VALORANT — 0.07

Medium-confidence preset. The 0.07 base value is consistently used by open-source sensitivity-conversion references, but Atlas did not find a Riot-published engine implementation constant during this pass.

Sources:

- https://github.com/arturrzufik/valorant-cs2-sens-converter
- https://github.com/veronicalynn0528/fps-sensitivity-formulas

### Apex Legends — 0.022

Medium-confidence preset. Community technical references commonly match Apex base mouse sensitivity to the Source/Quake 0.022 convention. EA's public accessibility documentation explains the sensitivity setting but does not publish the yaw constant.

Sources:

- https://forums.ea.com/discussions/apex-legends-general-discussion-en/what-dpi-you-guys-are-running-in-this-game/5289142
- https://github.com/KovaaK/SensitivityMatcher/blob/master/ReleaseAssets/bin/SensitivityMatcher.au3

## Deliberate exclusions

The first Sensitivity Lab release does not claim direct equivalence for:

- ADS sensitivity;
- scoped sensitivity;
- per-optic multipliers;
- monitor-distance matching;
- FOV-dependent perceived speed;
- controller sensitivity / response curves / aim assist;
- acceleration or non-raw-input behavior;
- game modes that change yaw/pitch behavior.

Matching cm/360 is a physical-distance match, not proof that two games will feel perceptually identical.

## Validation

`scripts/validate-sensitivity.mjs` checks source presence, value bounds and a deterministic CS2 → VALORANT reference conversion. It also asserts that the unrounded conversion preserves cm/360.

When a game's input implementation changes, update the source entry and confidence before changing the preset. Do not silently patch a conversion ratio because a community post says a game “feels off.”
