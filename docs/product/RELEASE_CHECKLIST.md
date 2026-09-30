# Atlas release checklist

Use this for a meaningful Atlas release/merge. A checked item should correspond to an actual verification result, not a statement of intent.

## Consumer regression

- [ ] Default consumer route renders and remains Atlas-branded.
- [ ] Recommendation flow remains usable.
- [ ] Product database/detail behavior remains usable.
- [ ] Compare remains usable.
- [ ] Shape Finder / Shape Lab / overlays / similarity remain usable.
- [ ] Product Lab entry does not obscure primary consumer controls at supported widths.
- [ ] Keyboard focus and narrow-screen behavior are checked for newly added controls.

## Data / provenance

- [ ] `npm run data:validate` passes.
- [ ] Generated catalog health report succeeds.
- [ ] New external product facts retain source/evidence class.
- [ ] Atlas-derived metrics are labeled as derived/sample-scoped.
- [ ] Unknown optional fields are not silently converted to “false” or zero.
- [ ] Sparse segments are not labeled market opportunities without demand evidence.

## Product analytics

- [ ] Event contract and server validation agree on schema version/event names.
- [ ] Demo fixtures retain `demo-` IDs and cannot enter production transport.
- [ ] Browser-local data is labeled `REAL / THIS BROWSER`.
- [ ] Production aggregate is shown only when the production collector verifies real storage.
- [ ] Opt-out/GPC/DNT paths suppress collection and clear/discard local Atlas analytics as designed.
- [ ] No raw search text, exact hand measurement, name or email field was added.

## Validation / defects

- [ ] All generated cases initialize `NOT RUN`.
- [ ] No seeded/demo PASS/FAIL result exists in the validation generator.
- [ ] Requirement sources and environment requirements are preserved.
- [ ] PASS/FAIL/BLOCKED requires an explicit execution record.
- [ ] Severity and priority remain separate.
- [ ] Suspected layer is not presented as root cause.
- [ ] Report/export keeps NOT RUN visible and states limitations.

## Engineering / deployment

- [ ] Production dependency audit passes at the configured severity.
- [ ] Product Lab integrity regression passes.
- [ ] TypeScript build passes.
- [ ] Vite production build passes.
- [ ] Wrangler dry-run passes.
- [ ] Shared security baseline passes.
- [ ] No fake/unconfigured analytics binding was added to Wrangler.
- [ ] Release notes identify known limitations/evidence still needed.

## Merge rule

Do not merge while a required CI/security check is pending or failing. Fix the cause on the branch and re-run checks rather than documenting around a failure.
