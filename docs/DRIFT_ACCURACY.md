# Drift accuracy pass

Canonical native project: `sensitivity-finder/` in the Atlas workspace. The website remains a converter and preview; native measurements stay local.

## Changes

| Area | Implementation | Evidence boundary |
| --- | --- | --- |
| Input speed | Active packet-arrival histogram, idle-gap and short-interval counters, nonmonotonic-clock rejection, mouse identity fingerprint; replay checks at 1000, 4000 and 8000 Hz and with bursty delivery | Windows arrival times are not sensor timestamps. The existing 2 ms estimator is retained, with a numerical tolerance at its 125 microsecond boundary. No claim of improved sensor or input latency. |
| Final confirmation | One frozen candidate versus the original in four fresh matched pairs, alternating order; exploration scores excluded | Approximate 95% paired t interval with three degrees of freedom, positive differences in every pair and a mean advantage of at least three score points. This does not correct repeated searches or establish an optimum. |
| Frame consistency | Median/p95/p99 frame intervals, maximum gap, slow-frame count and matched-pair tail comparison | CPU-observed render intervals, not display presentation or photon latency. Histogram resolution is 0.05 ms; overflow quantiles conservatively report the recorded maximum. |
| Physical calibration | Three horizontal ruler swipes, including both directions, with backtracking/off-axis/repeatability checks; optional measured game-turn distance | Neutral constant input is explicitly user confirmed. Configured DPI remains unchanged. No automatic application of measured CPI or driver writes. |
| Curve parity | Official installed 1.6.1 calculator compared with constant, Natural, Classic and LUT transforms over directions, Y ratios, speed thresholds and DPI transfers | Synthetic, read-only calculator/export checks. Real driver/sensor equivalence and in-game feel remain separate checks. |
| Across-day claims | Stronger default label requires the same candidate to pass on two distinct dates, matching input identity and setup scope, plus practical tracking/comfort clearance | Same-day repeats, replayed seeds and historical records cannot manufacture stronger evidence. Physical setup changes that are not reported or detectable remain a limitation. |

The final comparison preserves micro and flick outcomes separately. Tracking and comfort remain separate practical checks; a strong flick average cannot replace them. Invalid timing produces an unavailable estimate rather than a fabricated zero-effect interval.

Timing guards are engineering thresholds: at least 100 active arrival intervals; no nonmonotonic samples; no more than 20% short intervals; at least five seconds and 100 frame intervals; no frame gap at or above 150 ms; at most 5% slow frames. A slow frame exceeds the larger of 25 ms and three target-frame periods. Matched p99 frame intervals must stay within a 1.5 ratio. These thresholds are not externally validated sensor-quality standards.

## Calibration

Open Converters, then Measure physical sensitivity. Confirm neutral constant response (no acceleration, multiplier 1, Y/X 1), unchanged DPI and the same mouse. Measure three straight swipes of at least 5 cm, including both directions. Press Space at the ruler's start mark and again at its end mark; do not lift during a swipe. Escape, loss of focus or another moving device cancels the active swipe.

The report rejects more than 5% backtracking or off-axis counts and more than 3% CPI spread between swipes. It records configured DPI separately from effective CPI. Reports live under the native project's `calibrations/`; no profile or mouse settings are changed. An optional 90-720 degree hipfire turn check records measured game distance without assuming that ADS or accelerated movement follows the same conversion.

## Compatibility and source

Existing sessions and profiles are preserved. Historical searches keep four trials where originally planned and do not gain enhanced accuracy labels. New searches carry a separate accuracy-protocol field. A changed mouse, pad, game, FOV or FPS target invalidates new-search compatibility; actual Raw Input identity must also match between confirmation trials. Raw device names are fingerprinted locally, not published or sent to a model.

The public patch is `source-import/drift/accuracy-pass.patch`, applied relative to the native project root after the renderer-reuse pass. It contains implementation, tests and build-script updates. Native binaries, profiles, sessions, calibration reports and vendor libraries remain local.

## Verification

Use `test.ps1 -OutputDirectory <isolated-check-folder>` for the native regression and calibration-layout checks, and `accuracy-check.ps1` for the separate installed-calculator matrix. Tests and calibration screenshots use synthetic fixtures. Physical ruler swipes, real sensor timestamps, live-driver equivalence and human across-day performance are **NOT RUN** by automated verification.

Verification passed locally: the full native regression suite, 109 curve-search checks and 34 dedicated accuracy checks; calibration layout at 620 and 820 pixels; 5,664 installed-calculator comparisons; and an RTX 3080 renderer smoke check. The canonical executable was rebuilt. The public patch also passed a clean apply and file-for-file round-trip comparison. Atlas catalog validation and `npm run check` passed.

The buffered Raw Input reader remains a possible future experiment. This pass validates and reports the existing message-based measurement path; it does not invent timestamps for buffered packets.
