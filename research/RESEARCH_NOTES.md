# Research notes — first enthusiast pass

This project is deliberately not a "spec sheet with an overall score." Peripheral fit is interaction-heavy, and enthusiast discussions often care about variables that mainstream catalogs omit.

## Mouse findings that changed the schema
- **Shape needs multiple coordinates.** Overall L/W/H is insufficient. Grip width, front/rear flare, hump peak position, side curvature, front-button height, and usable ring/pinky ledges can change the fit substantially.
- **Grip labels need subtypes.** Relaxed claw, aggressive claw, pincer claw, knuckle claw, palm, and fingertip are separate fit vectors rather than one generic "claw" field.
- **Finger layout matters.** 1-3-1 users can care about top-shell width around the wheel, right-button room, and side clearance differently from 1-2-2 users.
- **Mass is not the whole inertia story.** Center of gravity, lift balance, sensor position, and skate contact geometry change perceived handling.
- **Click implementation beats switch-name marketing.** Shell geometry, tensioning, pre-travel, post-travel, lateral wobble, actuation force and debounce behavior need to sit alongside switch model.
- **Encoder/wheel implementation deserves first-class fields.** Step definition, wheel resistance, wheel-click force, encoder model/height, tilt/free-spin features and long-term reliability are distinct.
- **Coating is contextual.** Dry-hand grip, sweaty-hand grip, surface wear, discoloration and finish revision can disagree.
- **High polling is conditional.** Stable measured rate, CPI, CPU load, game behavior and display refresh contextualize 2/4/8 kHz support.

## Mousepad findings that changed the schema
- **Static and dynamic friction are separate axes.** "Fast" does not tell a user how micro-adjustments, sustained tracking and stopping will feel.
- **Stopping power is not just the inverse of speed.** Pressure-sensitive foam and surface/skate interaction can produce low starting friction with meaningful braking.
- **Base firmness is functional.** XSOFT/Soft/Mid/Firm affects pressure response and therefore consistency versus user-controlled stopping.
- **Environment matters.** Humidity, sweat, temperature, dust/static and sleeve/skin interaction can meaningfully alter experience.
- **X/Y consistency matters.** Directional weave or finish can create different horizontal/vertical glide.
- **Break-in and wear need time-series fields.** A pad can change after hours/months and may partially recover after cleaning.

## Skate findings that changed the schema
- **Pad × skate is one system.** A skate cannot receive a universal speed rank independent of surface.
- **Material is not enough.** Dot diameter/count, full-size geometry, edge radius, thickness, cushion layer and contact area matter.
- **Glass-pad lifecycle is unusually important.** Fresh glide, flat-spot formation, scratch/noise development and replacement interval should be captured separately.
- **Durability can trade against glide.** Community reports around pure PTFE, hardened PTFE and UHMW-PE on glass frequently disagree because pressure, mouse weight, pad texture and maintenance differ; evidence must preserve those conditions.

## Scoring principle
The recommender should expose a fit score plus the components that produced it. Hard incompatibilities are filters. Preferences are weighted matches. Measurements stay raw. Community impressions are aggregated and labeled. No single opaque "best mouse" score is stored in the database.

## 2026-09-28 — Shape comparison / similar-search pass

Current enthusiast comparison tools confirm that shape overlay and “find similar” are core discovery workflows, but community feedback also exposes limits of simple top/side silhouettes. Two mice can share a similar plan-view outline while feeling different because of upper-side flare, undercut, cross-section, rear fullness, and where the hand actually contacts the shell.

Input Atlas v0.3 therefore treats shape comparison in layers:

1. **Real-scale 2D overlay** — top and side views, up to five mice.
2. **Alignment modes** — geometric center, front, rear, or sensor position.
3. **Normalized mode** — equalizes overall length to isolate proportional shape differences.
4. **Geometry similarity** — length, grip width, height, hump position, front height, rear flare, side taper, hump fullness.
5. **Difference explanations** — e.g. “1.8 mm narrower at grip” or “hump 9% farther rearward,” instead of a mystery similarity score.
6. **Future measured geometry** — product schema accepts explicit sourced top/side point sets; parametric outlines are clearly marked approximate until replaced.
7. **Future 3D/cross-section layer** — measured or licensed scans can be added without changing the search/recommendation contract.

Do not scrape or reuse another comparison site's proprietary outline/scan assets. Build Atlas geometry from manufacturer CAD explicitly licensed for use, our own scans/measurements, or other sources whose reuse rights are clear.
