# Input Atlas v0.6 data notes

Checked: 2026-09-29

## Why catalog shards exist

`data/catalog.json` remains the original curated seed. New research can now be added in dated files such as `data/catalog.2026q3.json`. The validator and SQL generator merge every `data/catalog*.json` shard and still enforce global product IDs, slugs, source definitions, evidence references and score bounds.

This keeps research diffs small enough to review and prevents the original catalog from becoming one monolithic file that every update rewrites.

## Razer Viper V3 Pro SE

Razer's current Viper comparison says the Viper V3 Pro SE, Viper V3 Pro and Viper V4 Pro share the exact mouse shape. Razer also states that the V3 Pro SE shares the V3 Pro's weight, Focus Pro 35K Gen-2 sensor and Gen-3 optical switches. Its included wireless dongle starts at 1000 Hz, while the optional HyperPolling Wireless Dongle enables up to 8000 Hz.

Sources:
- https://www.razer.com/gaming-mice/razer-viper-v3-pro-se
- https://www.razer.com/blog/razer-viper-line-which-one-is-right-for-you

Atlas handling:
- geometry is copied from the existing Viper V3 Pro model because the manufacturer explicitly confirms the same shell;
- the existing V3 Pro fit vector is reused only as an editorial fit model, not as a new measurement;
- 8000 Hz is stored as maximum supported polling, while the summary/tags retain the important fact that the included configuration is 1000 Hz.

## Razer Gigantus V2 Pro

Razer's March 2026 support documentation defines five speed ratings: Max Control, Control, Balance, Speed and Max Speed. It specifies cloth construction, a soft mouse-mat platform, low-profile stitched edges, proprietary GlideCore Foam and an approximately 500 × 480 × 4 mm Large surface.

Razer's launch guide further describes the intended ordering:
- Max Control / Control: stronger stopping and precision;
- Balance: central speed-control mix;
- Speed / Max Speed: lower-resistance glide;
- GlideCore Foam behavior ranges from soft for stronger stopping, through medium for balance, to hard for faster and more stable swipes.

Sources:
- https://mysupport.razer.com/app/answers/detail/a_id/20789/
- https://www.razer.com/blog/the-next-evolution-of-the-razer-gigantus-meet-the-razer-gigantus-v2-pro

### Atlas interpolation policy

The five products preserve Razer's manufacturer-defined ordering and common physical platform. The 0–100 `staticSpeed`, `dynamicSpeed`, `stoppingPower`, texture, pressure, humidity, sleeve, X/Y, wear and cleaning fields are **not measured coefficients**. They are deliberately marked low-confidence Atlas interpolation so the recommendation engine can reason over the official categories before independent friction/lifecycle measurements are available.

The firmness labels assigned to adjacent grades are also an Atlas mapping from Razer's broad soft/medium/hard explanation, not a claim that Razer publishes one exact foam-hardness label for each of the five SKUs.

## Generated SQL policy

Catalog JSON is canonical. `npm run data:seed` now produces `generated/catalog-seed.sql` on demand. The generated SQL is ignored by git and validated in CI, while `migrations/0001_init.sql` remains the schema migration. This avoids committing a very large derived file every time product research changes.
