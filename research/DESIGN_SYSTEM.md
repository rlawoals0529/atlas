# Input Atlas design system

Input Atlas should feel like a precision instrument for gaming-mouse enthusiasts, not a storefront and not a generic review blog.

## Visual direction

The UI combines three ideas:

1. **Sidereal discipline** — restrained atmospheric depth, tokenized surfaces, soft separators, visible focus states, reduced-motion support, tabular numeric data, and accents used for meaning rather than decoration.
2. **FantasyStats density** — important information remains scannable at a glance; cards and comparison rows prioritize data hierarchy over oversized artwork.
3. **Peripheral-lab workflow** — the Shape Lab is the hero tool. Geometry, overlays, filters, evidence and fit explanations should look like controls in a measurement workspace.

External references such as EloShapes and RTINGS are useful for workflow ideas (overlay comparison, dense filtering, standardized measurements), but Input Atlas should not copy their visual assets, scans, scores, or layout. Our identity is darker, quieter and more analytical.

## Principles

### One accent has one job
- Acid green: primary actions, selected state, best-fit/active measurement.
- Cyan: secondary technical information and measurement context.
- Violet: tertiary comparison series and charts.
- Orange: caution or incompatibility only.

Avoid rainbow UI outside shape-overlay layers, where multiple colors are necessary to distinguish mice.

### Soft structure, strong controls
Cards use low-contrast inset separators so content remains dominant. Interactive controls have stronger boundaries and visible focus rings. A border around every nested element creates visual noise and should be avoided.

### Data never jitters
All measurements, percentages, scores and timestamps use tabular numerals. Frequently changing values should not shift horizontally.

### Motion explains, never performs
Use short 120–180 ms transitions for hover/focus/state changes. Ambient scan motion is allowed only when subtle. Respect `prefers-reduced-motion` globally.

### Mobile is a tool, not a squeezed desktop
On narrow screens, controls stack, database cards reduce visual width, overlay legends move below the canvas, and horizontal nav remains scrollable. The Shape Lab remains usable rather than becoming a static preview.

## Core surfaces

- `--atlas-bg`: page background
- `--atlas-panel`: standard raised surface
- `--atlas-panel-hi`: active/important raised surface
- `--atlas-line`: passive separator
- `--atlas-line-strong`: interactive boundary
- `--atlas-text`: primary text
- `--atlas-muted`: explanatory text
- `--atlas-dim`: metadata
- `--atlas-acid`: primary interaction/fit accent
- `--atlas-cyan`: measurement accent
- `--atlas-violet`: comparison accent
- `--atlas-warn`: caution accent

## Shape Lab hierarchy

The Shape Lab should always answer four questions in this order:

1. **What am I comparing?** Selected mice and reference mouse.
2. **How are they aligned?** Real scale vs normalized, center/front/rear/sensor anchor.
3. **Where do they differ?** Overlay plus human-readable differences and per-dimension match bars.
4. **Does that difference matter for my grip?** Balanced / claw / fingertip / palm similarity modes.

A single similarity score is never enough by itself.

## Evidence UI

Every future detailed product page should visually distinguish:

- `M` manufacturer claim
- `I` independent measurement
- `C` community observation
- `A` Atlas-derived/editorial model

Confidence should be shown separately from source class. A high-confidence community consensus is not a laboratory measurement, and an official manufacturer number is not necessarily independently verified.

## Accessibility baseline

- visible `:focus-visible` on every interactive control
- minimum 40 px target height for controls where practical
- reduced-motion fallback
- no information communicated by color alone
- body copy uses `text-wrap: pretty`; headings use balanced wrapping
- contrast is checked before adding new palette variants
