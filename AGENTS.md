# Working on Atlas

Keep changes small enough to review and verify. Atlas is a product-data project first, so provenance, UI clarity and deploy reliability matter more than making a change look impressive.

## Writing voice

When editing README text, docs or UI copy:

- read the surrounding copy first and keep its level of formality;
- prefer plain, specific wording over polished filler;
- cut repeated setup, obvious transitions and generic claims;
- vary sentence shape only when it improves the read; do not manufacture quirks;
- keep contractions and fragments when they sound natural in the existing voice;
- do not invent statistics, user outcomes, community consensus or hardware findings;
- keep caveats that change how a measurement or claim should be interpreted;
- avoid stock phrases such as "seamless", "robust", "comprehensive", "unlock", "empower", "leveraging", "designed to" and "in order to" unless they are genuinely the clearest wording.

The goal is not to "humanize" text after the fact. Write it like a person who knows the project and has a reason for every sentence.

## UI fit

Before shipping a dense control surface, check that:

- controls stay inside their card at common desktop and mobile widths;
- flex/grid children use `min-width: 0` where text can shrink;
- long model names truncate instead of pushing buttons out;
- fixed-size thumbnails center the image with `object-fit: contain` and `object-position: center`;
- scrollable result lists reserve scrollbar space so rows do not shift or clip;
- controls can wrap cleanly instead of overflowing;
- keyboard focus and reduced-motion behavior still work.

Shape Lab is especially sensitive to these rules because each layer mixes thumbnails, swatches, selects, sliders and z-order controls in a narrow panel.

## Evidence boundaries

Manufacturer claims, independent measurements, community observations and Atlas-derived fields must remain distinguishable. Never turn an estimated or normalized value into a measured one by changing the wording.

Generated validation cases begin `NOT RUN`. Synthetic analytics stay labeled synthetic. Community observations are examples, not market-wide sentiment.

## Verification

For code changes, run the relevant data validators plus `npm run check`. For UI changes, also inspect the affected route at a narrow width and a normal desktop width. A green TypeScript build does not prove that controls fit.
