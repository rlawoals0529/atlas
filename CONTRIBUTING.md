# Contributing to Atlas

Atlas treats product research as evidence, not filler. Small, reviewable corrections are better than large imports that are hard to trace.

Use the GitHub issue templates for bugs, feature requests and data corrections. Data corrections should include the Atlas product ID when known, the field being changed, a traceable source, and any revision/methodology context needed to interpret the value.

## Product data

Add new research to a dated `data/catalog.<period>.json` shard instead of rewriting the original seed catalog. Every product must have globally unique `id` and `slug` values, at least one source, and evidence entries whose `sourceIds` resolve to sources on that product.

Run:

```bash
npm run data:validate
npm run data:report
npm run data:seed
npm run check
```

## Source priority

1. Manufacturer pages/manuals for dimensions, listed hardware, compatibility and stated features.
2. Independent controlled measurements for latency, dimensions, force, friction or other measured behavior.
3. Community observations for long-term wear, uncommon combinations and failure modes.
4. Atlas editorial inference only when a useful model needs a normalized value that is not directly measured.

Never present an editorial 0–100 value as a lab coefficient. Add a note explaining the inference and keep confidence appropriately conservative.

## Same family is not same shape

Do not infer shell equivalence from branding. Product-family relationships, manufacturer-confirmed same-shell relationships, modeled geometric similarity, measured outline similarity and grip-specific fit similarity are different concepts.

## Mousepads and skates

Keep static/initial movement, dynamic glide and stopping separate. Skate feel is surface-dependent; compatibility with glass, cloth, hybrid and plastic surfaces must be explicit when known. Fresh and broken-in behavior should remain separate when evidence supports it.

## Corrections

A correction should include the product ID, field(s) being changed, source URL, date checked, whether the value is manufacturer-claimed or independently measured, and any methodology needed to interpret it. If two credible sources disagree, preserve the disagreement in the evidence note rather than silently picking the more convenient number.


## Writing and UI copy

Match the voice that is already there before rewriting anything. Keep copy plain, specific and a little conversational where that fits the screen. Do not add generic enthusiasm, polished filler or claims that the data cannot support.

A good edit should usually do one of three things: make the meaning clearer, remove repetition, or replace vague wording with something concrete. Preserve useful caveats and technical terms. Avoid rewriting a sentence just to make it sound more formal.

For agent-assisted work, `AGENTS.md` contains the short version of these rules plus the UI-fit checks that should be run before shipping.
