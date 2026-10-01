## What changed

<!-- Keep this concrete. -->

## Why

<!-- What user, data, reliability, or maintenance problem does this solve? -->

## Evidence / provenance

- [ ] No new factual product claims were added, or every new claim has a traceable source.
- [ ] Manufacturer claims, independent measurements, community observations, and Atlas-derived values remain distinguishable.
- [ ] No subjective review score was turned into an Atlas quality ranking.
- [ ] New or changed product media is attributed to its source.
- [ ] Hall-effect / TMR compatibility remains board-specific where applicable.

## Verification

Run `npm ci && npm run verify` for the full local verification path.

- [ ] `npm run data:validate`
- [ ] `npm run community:validate`
- [ ] `npm run product:validate`
- [ ] `npm run media:validate`
- [ ] `npm run switch-index:validate`
- [ ] `npm run a11y:validate`
- [ ] `npm run check`
- [ ] `npm run bundle:validate`

For UI changes:
- [ ] Checked a normal desktop width.
- [ ] Checked a narrow/mobile width.
- [ ] Long names, images, and controls stay inside their containers.
- [ ] Keyboard focus behavior still works.

## Notes

<!-- Risks, follow-up work, or intentionally out-of-scope items. -->
