# Input Atlas v0.5 research notes

Checked: 2026-09-28 / 2026-09-29 UTC transition

This file records current-product facts used to guide revision/family modeling. It is deliberately separate from Atlas editorial fit vectors.

## Razer Viper V3 Pro → Viper V4 Pro

Razer's September 15, 2026 Viper-line comparison explicitly states that Viper V4 Pro, Viper V3 Pro and Viper V3 Pro SE share the exact mouse shape. Razer describes the important generation differences as weight, sensor and switch generation, polling implementation, wireless hardware and battery life.

Source:
- https://www.razer.com/blog/razer-viper-line-which-one-is-right-for-you

Razer's May 15, 2026 V4/V3 comparison likewise describes the V4 as retaining the V3 Pro shape while changing the surrounding performance platform. It lists V4 Pro at 49 g black / 50 g white versus V3 Pro 54 g black / 55 g white, Focus Pro 50K Gen-3 versus 35K Gen-2, and 180 h versus 95 h at 1 kHz.

Source:
- https://www.razer.com/blog/razer-viper-v4-pro-same-trusted-shape-sharper-performance

Atlas implication: this pair can eventually carry an explicit `same-shell` relationship rather than merely a loose product-family relationship. Fit should not be re-scored as a totally unrelated shape when comparing these generations.

## Logitech PRO X SUPERLIGHT 2c

Logitech's current product page lists the compact 2c at 51 g, with HERO 2, LIGHTSPEED, LIGHTFORCE switches and up to 95 h battery life.

Source:
- https://www.logitechg.com/en-us/shop/p/pro-x-superlight-2c

Atlas implication: keep the 2c inside the broader PRO X product-line context, but do not label it shape-equivalent to the full-size Superlight without direct shell evidence.

## Pulsar X2H CrazyLight Medium

Pulsar currently lists the X2H CrazyLight Medium at 120.4 × 65 × 39 mm and 43 g ±1 g with dot skates, with XS-1 sensor and up to 8 kHz polling. Pulsar explicitly positions the shell for claw / relaxed-claw use and provides both Bibimbap web configuration and PC software.

Sources:
- https://www.pulsar.gg/products/x2h-crazylight-medium-gaming-mouse
- https://www.pulsar.gg/pages/download

The download page showed v0.131 software dated 2026-06-15 and web/PC configuration support when checked.

Atlas implication: web-driver state can be considered manufacturer-supported, while grip suitability still remains a mix of stated intent and Atlas fit modeling.

## Razer Gigantus V2 Pro

Razer's March 2026 support page describes one 500 × 480 × 4 mm soft cloth platform offered in five Speed Ratings: Max Control, Control, Balance, Speed and Max Speed. Razer identifies proprietary GlideCore Foam as the base platform.

Source:
- https://mysupport.razer.com/app/answers/detail/a_id/20789/

Atlas implication: this is a useful future test case for a product family whose revision axis is surface speed rather than shell dimensions. Each speed grade should be a distinct surface record but retain one family relationship.

## Modeling rule reinforced by this pass

`family` does not mean `same shape` and `same shape` does not mean `same experience`. Input Atlas should preserve at least these separate relationships:

1. Related product line / platform.
2. Manufacturer-confirmed same shell or surface construction.
3. Atlas-modeled geometric similarity.
4. Measured outline similarity (future measured SVG/scan path).
5. Fit similarity for a specific grip mode.

The UI must not collapse these into one generic similarity number.
