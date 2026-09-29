# Recommendation scoring principles

Input Atlas does not store a universal mouse score. Ranking is computed from a user profile at request time.

## Mouse fit
The model combines:
- dimensional hand fit;
- grip-subtype affinity;
- aim style;
- game/use profile;
- requested weight and shape;
- 1-2-2 vs 1-3-1 clearance;
- dry/sweaty coating behavior;
- button density, click feel and wheel behavior;
- budget;
- contextual value of >1 kHz polling;
- optional relative movement away from a mouse the user already owns.

Weights change by use case. FPS profiles prioritize shape/grip/hand fit and mass. MMO profiles sharply increase button-density/wheel importance and de-emphasize mass/polling. General/action profiles sit between them.

Polling rate is intentionally low-weight. 4/8 kHz capability is contextualized by display refresh, DPI and a coarse CPU tier so a spec-sheet maximum cannot dominate a recommendation.

## Surface fit
Mousepad scoring separates initial/static speed, sustained/dynamic speed and stopping power. It also includes texture tolerance, pressure behavior, humidity, sleeve compatibility, X/Y consistency and worn-zone stability.

The requested speed target is nudged by game profile: tactical FPS trends slower/more controlled; tracking/arena profiles trend faster. This is only a prior, not a hard rule.

## Skate fit
Skates are ranked *against the selected pad*, not globally. Compatibility is checked first. Broken-in speed is preferred over fresh speed when available, and glass-pad ranking increases the value of durability. Glass-on-glass is explicitly discouraged.

## Sanity profiles used during v0.2 development
The model was runtime-smoked against representative profiles:
- tactical FPS + relaxed claw -> competitive claw/general esports shapes rise;
- tracking FPS + fingertip + ultralight -> very light low-inertia shapes rise;
- MMO + palm + many buttons -> Naga/Kone/G502/Scimitar-style mice rise;
- action/general + free-spin + feature-rich -> Basilisk/G502/Kone-style mice rise.

These are sanity checks, not ground-truth winners. As the evidence corpus grows, fit vectors should be calibrated against independent geometry/measurement data and aggregated owner reports.
