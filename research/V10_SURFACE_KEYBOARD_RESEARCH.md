# Atlas v0.9 research — surfaces, X/Twitter, keyboards and switches

Research cutoff: **2026-09-30**

This pass expands Atlas without turning reviewer opinion into fabricated measurement. Canonical product fields still require explicit provenance, and qualitative reviewer/community observations remain separate from manufacturer specs and Atlas-derived models.

## Glasspad / mousepad research

### WALLHACK SP-004

Sources reviewed:

- ProSettings review: https://prosettings.net/reviews/wallhack-sp-004/
- r/MousepadReview long-term owner report: https://www.reddit.com/r/MousepadReview/comments/1pgrrey/sp004_verdict_250_hours_playtime/
- EloShapes X post on the SP-004 Drift Sora variant: https://x.com/EloShapes/status/1894069015670059324

Important evidence behavior:

- ProSettings' reviewer characterized the SP-004 as an extremely smooth/fast glass surface on their test setup, but also explicitly documented that other reviewers discussing the product on X/Twitter reported unusually different relative-speed impressions compared with the SkyPAD 3.0.
- That disagreement is more useful to Atlas than a forced consensus. The review itself identifies person-to-person conditions and humidity as plausible contributors.
- The review also emphasizes that glass surfaces expose imperfect skates and debris much more clearly than cloth, and that skin/sweat contact can materially change the experience.
- The long-term owner report adds setup-specific evidence around dust sensitivity, cleaning frequency, skate combinations and tracking preference. Its title/body contain different playtime figures, so Atlas does not turn that into one precise verified durability duration.
- EloShapes' X post describes the limited Drift Sora variant as slightly more controlled than the regular SP-004. Atlas treats this as variant context rather than silently applying that characteristic to the regular SP-004.

### X/Twitter discovery policy

Public X indexing is incomplete. Atlas may use an X post when it is directly retrievable, attributable and product-specific, but it must not infer that a reviewer never discussed a product merely because search did not return a post.

A broader X search also surfaced current peripheral-review accounts and product observations, including a detailed Lamzu Maya mousepad impression from @s1ckox. That pad is not currently in the canonical Atlas catalog, so the observation is a research lead rather than a catalog fact.

## Keyboard category model

Keyboard records are split from switch records because the same switch technology can behave differently across PCB sensing, firmware, calibration, plate/case construction and software.

Keyboard fields added in this pass include:

- form factor / layout;
- switch technology and stock switch;
- polling ceiling;
- adjustable actuation range and step size where published;
- Rapid Trigger / SOCD-style input handling / analog input;
- hot-swap status;
- connectivity;
- case / plate / keycap / mount information;
- web/desktop configuration surfaces;
- dimensions and weight where verified.

Switch fields include:

- technology and feel type;
- published force points with original units preserved (`gf` or `cN`);
- pre-travel / total travel;
- lubrication / rated lifetime where published;
- magnetic flux values and PCB-thickness conditions where published;
- explicit compatibility caveats.

## Starter keyboard sources

### Wooting 80HE+

Source: https://wooting.io/wooting-80he-plus

Verified manufacturer information includes 80% layout, Lekker Tikken Medium switches, FR4 plate, doubleshot PBT keycaps, silicone gasket mounting, Wootility web/desktop configuration, 0.1–4.0 mm adjustable actuation in 0.1 mm increments, analog input, SOCD behavior and true 8 kHz polling.

Wooting markets 0.125 ms input speed. Atlas preserves that as a manufacturer claim and does **not** store it as an independent end-to-end latency measurement.

### Razer Huntsman V3 Pro Tenkeyless 8KHz

Sources:

- Razer support/specification: https://mysupport.razer.com/app/answers/detail/a_id/19797/~/razer-huntsman-v3-pro-tenkeyless-8-khz-%7C-rz03-0552-support-%26-faqs
- RTINGS independent review: https://www.rtings.com/keyboard/reviews/razer/huntsman-v3-pro-8khz-wired

Razer publishes 8 kHz polling, Gen-2 analog optical switches, Rapid Trigger, Snap Tap, 0.1–4.0 mm actuation, analog input, a 5052 aluminum-alloy top case, dimensions and weight. RTINGS independently reports that the switches are not hot-swappable and separates the advertised polling ceiling from its measured effective update behavior.

Atlas therefore stores polling specification and independent performance evidence separately.

### Keychron Q1 HE 8K

Sources:

- https://www.keychron.com/products/keychron-q1-he-8k-magnetic-switch-keyboard
- https://www.keychron.com/pages/how-to-use-he-mode-on-keychron-launcher

Keychron publishes a wired 8 kHz implementation, 0.1–3.35 mm adjustable actuation with 0.01 mm sensitivity, Rapid Trigger, analog gamepad input, LKP/Snap Click behavior, aluminum case/plate, OSA doubleshot PBT caps, dimensions and weight.

The product page's magnetic hot-swap language is implementation-specific and should not be generalized into “any HE switch fits.”

## Switch research and ThereminGoat

ThereminGoat repository: https://github.com/ThereminGoat/switch-scores

The repository is a maintained collection of scorecards and composite CSV/XLSX sheets, and the README explains that the cards are subjective review scorecards attached to long-form or standalone switch reviews. The repository currently exposes no detected software/content license through GitHub metadata.

Atlas policy for this source:

- link to the scorecard/review source;
- store bounded review observations in evidence notes when useful;
- do not copy the full score database into Atlas;
- do not present composite score ordering as an objective universal ranking;
- keep manufacturer force/travel/material specifications separate from reviewer feel judgments.

### Gateron Magnetic Jade Emerald

Sources:

- https://www.gateron.com/products/gateron-magnetic-jade-emerald-switch-set
- https://www.theremingoat.com/blog/gateron-magnetic-jade-emerald-switch-review

Gateron publishes 55±10 gf operating force, 3.5±0.1 mm total travel, 120±8 GS initial magnetic flux and 700±30 GS bottom-out flux at 1.2 mm PCB thickness, factory lubrication and >150M actuation lifetime.

ThereminGoat's review is retained as preference/feel evidence rather than converted into Atlas's own objective score.

### CHERRY MX2A Red

Source: https://www.cherry.de/en-us/product/mx2a-red

CHERRY publishes 30 cN initial force, 45 cN actuation force, 100 cN final force, 2.0 mm pre-travel, 4.0 mm total travel, factory lubrication and >100M keystrokes. Atlas preserves `cN`; it does not silently rename these figures to gram-force.

## Boundaries for the next pass

- Do not ingest large switch score tables until reuse/licensing expectations are explicit.
- Do not add keyboard latency numbers without independent methodology/provenance.
- Do not treat minimum actuation distance as latency.
- Do not treat 8 kHz polling support as proof of an 8 kHz effective input update rate.
- Expand glasspad coverage only when product-specific reviewer/owner conditions can be retained.
- Keep X/Twitter evidence opt-in and traceable rather than scraping broad sentiment.
