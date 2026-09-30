# Atlas community evidence pilot — 2026 Q3

## Purpose

This is the first real qualitative-evidence pilot using the schema in `COMMUNITY_EVIDENCE_PROTOCOL.md`.

It answers a narrow product question: **can Atlas capture enthusiast observations in a way that is useful for fit/product decisions without silently turning forum anecdotes into population sentiment or reliability statistics?**

The pilot covers three current mice already in the Atlas catalog:

- Razer Viper V3 Pro;
- Logitech G Pro X Superlight 2;
- Endgame Gear OP1w 4K v2.

The canonical structured rows live in `data/community-insights.2026q3.json` and are rendered in Product Intelligence.

## Sampling

This is purposive, not representative sampling.

Sources were chosen when they met all of these conditions:

1. product-specific rather than generic brand discussion;
2. enough context to identify the attribute being discussed;
3. a stable source URL and date;
4. conditions/disagreement could be preserved rather than reduced to a score;
5. independent review evidence was added where useful and available.

Atlas did **not** scrape comment totals into a sentiment percentage. A thread with several comments is still a convenience sample with selection effects.

## What the pilot found

### Razer Viper V3 Pro

**Shape:** Directionally positive across both an independent review and enthusiast discussion. The useful detail is not merely “good shape”: relaxed-claw users describe increased hump/palm support relative to older Viper shells, while aggressive-claw/fingertip users can still experience the length/front height differently.

**Coating:** The black-versus-white discussion is a strong example of why Atlas needs conditions and disagreement. White is repeatedly described as grippier, but some users prefer black because the white finish can feel too locked-in for fingertip micro-adjustments. A single scalar “coating quality” score would erase the actual product decision.

**Sensor/reliability:** An early lift-off tracking thread documented a real historical problem for that owner and commenters, then later updates reported firmware improvement/fix. RTINGS' current testing reports excellent sensor performance. Atlas therefore records a historical implementation signal with chronology, not a current universal defect claim.

### Logitech G Pro X Superlight 2

**Shape:** This is the most consistent signal in the small sample. Independent and community sources repeatedly describe the shape as safe/accommodating even when commenters prefer another mouse overall.

**Clicks:** The optical-switch change has a tradeoff: strong latency/durability characteristics, but click feel can start stiffer and change with wear. That belongs in a fit/feel decision, not a simple positive/negative label.

**Scroll wheel:** One detailed owner report describes unintended wheel activation, while other owners in the same discussion explicitly report no such problem. This is investigation evidence, not an incidence rate.

**Coating:** Multiple separate owner discussions report peeling, yellowing or glossing, but other long-term owners report intact coatings. The correct Atlas conclusion is “repeated wear signal with unknown incidence and meaningful condition/batch effects,” not “the coating always fails.”

### Endgame Gear OP1w 4K v2

**Grip/shape:** Early enthusiast evidence is positive for narrow fingertip/claw use, with one 19×11 cm fingertip user praising width while finding length slightly longer than ideal.

**Clicks/coating:** The same owner strongly praised button quality and coating but also preferred lighter actuation and still used grip tape for sweaty hands. The observation is useful precisely because it preserves both praise and constraints.

**Weight/balance:** A separate buying discussion raises wireless weight/balance as a tradeoff for weight-sensitive users, with disagreement about whether it matters in practice. Evidence remains too sparse to generalize.

## Product decisions supported now

The pilot is strong enough to justify:

- displaying traceable qualitative evidence by attribute;
- preserving grip/hand-condition/color/firmware context;
- showing disagreement instead of averaging it away;
- using repeated observations as research prompts;
- prioritizing future source collection around unresolved attributes.

It is **not** strong enough to justify:

- population sentiment percentages;
- reliability/failure-rate claims;
- universal rankings;
- changing fit scores automatically from raw comment counts;
- market-demand conclusions.

## Follow-up

The next qualitative-research increment should be driven by a product question, not by volume. Good candidates are:

1. collect a second independent source for OP1w 4K v2 shape/click implementation;
2. compare community grip descriptions against Atlas's existing editorial fit vectors;
3. add a correction/review queue when community evidence materially conflicts with a current Atlas fit assumption;
4. only expand beyond three products after the pilot UI and validation rules prove useful.
