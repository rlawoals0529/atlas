# Input Atlas

Gaming-peripheral research database + explainable fit engine. Input Atlas starts mouse-first, then models mousepads and skates as parts of the same aiming system rather than isolated products.

## Current build

The current catalog contains **39 gaming mice**, **16 mousepads**, **6 skate families**, 8 grip subtypes and 8 game/use profiles. It is intentionally curated rather than exhaustive: provenance, fit usefulness and maintainability matter more than inflating the product count.

The product experience includes:

- explainable mouse, pad and skate recommendations based on hand size, grip subtype, game style, sensitivity and surface preference;
- relative recommendation mode for moving smaller/larger, narrower/wider, lower/higher, lighter/heavier or changing palm support from a mouse you already own;
- Shape Lab with top/side overlays, real scale or normalized length, center/front/rear/sensor alignment and up to five layers;
- Balanced, Claw, Fingertip and Palm shape-similarity modes using 12 geometry components;
- direct target-geometry search;
- product detail inspector with type-specific specs, family/revision context, fit/feel models and source provenance;
- evidence-health scoring that keeps manufacturer, independent, community and Atlas/editorial information visibly distinct;
- database filters for brand, shape, polling, weight, wireless status, product status, price and evidence quality;
- side-by-side mouse comparison with raw deltas, shape overlays and component-level geometry similarity;
- responsive dark technical UI influenced by the interaction discipline of Sidereal and FantasyStats while remaining visually distinct;
- installable web-app metadata, structured WebApplication metadata and an explicit research/correction workflow.

## Canonical data architecture

Catalog JSON is the source of truth. The original dataset remains `data/catalog.json`; dated research additions live in reviewable shards such as `data/catalog.2026q3.json`.

```text
manufacturer / independent / community research
                     ↓
       data/catalog*.json shards
                 ↙    ↓     ↘
         React UI   fit engine   generated SQL
                     ↓
                Worker API
```

Both the runtime and maintenance scripts merge the shards. `npm run data:validate` enforces global IDs/slugs, source-definition consistency, valid evidence references, physical dimensions and 0–100 model bounds across the combined catalog.

`npm run data:report` generates `generated/data-report.json` with product counts, source-class coverage, evidence-confidence totals and the source-check date window. `npm run data:seed` produces `generated/catalog-seed.sql` on demand. Both artifacts are ignored by git; JSON research remains canonical and `migrations/0001_init.sql` remains the D1 schema migration.

## Current research additions

The 2026 Q3 shard adds the **Razer Viper V3 Pro SE** and all five **Razer Gigantus V2 Pro** speed grades.

For the Viper line, manufacturer documentation confirms the Viper V3 Pro SE, V3 Pro and V4 Pro share the exact mouse shape. Atlas preserves that same-shell relationship separately from differences in weight, sensor/switch generation, polling hardware and battery behavior.

For the Gigantus V2 Pro, Razer defines Max Control, Control, Balance, Speed and Max Speed. The official ordering and common physical platform are retained. Atlas 0–100 surface values are explicitly low-confidence normalized interpolation, **not measured friction coefficients**. See `research/V06_DATA.md` for the mapping and limitations.

## Runtime stack

- React 19 + TypeScript + Vite
- Hono API on Cloudflare Workers
- Cloudflare Workers Static Assets for the SPA
- deterministic, explainable recommendation + geometry engines
- prepared D1 + FTS5 schema for a later persisted catalog/search stage

The current production runtime serves the bundled canonical catalog directly from the Worker, so D1 is not required to deploy the site.

## API

- `GET /api/health`
- `GET /api/stats`
- `GET /api/catalog?type=mouse&q=claw`
- `GET /api/products/:slug`
- `GET /api/compare?ids=mouse-id-1,mouse-id-2`
- `GET /api/similar/:id?mode=claw`
- `GET /api/shape?length=122&width=59&height=39&hump=55&weight=55`
- `POST /api/recommend` with a `UserProfile`

`/api/stats` reports the current release metadata, type counts, source-class coverage, evidence-confidence mix and source-check window.

## Local setup

1. `npm install`
2. `npm run data:validate`
3. `npm run data:report`
4. `npm run data:seed`
5. `npm run dev`

## Validation

```bash
npm run data:validate
npm run data:report
npm run data:seed
npm run check
```

CI validates every catalog shard, generates both derived artifacts, verifies they are non-empty, then runs TypeScript, Vite and a Wrangler deployment dry-run.

## Cloudflare deploy

The current Worker has no required application secret or database binding. Locally, authenticate Wrangler and run `npm run deploy` after validation/build.

For GitHub deployment, add repository secrets `CLOUDFLARE_API_TOKEN` and `CLOUDFLARE_ACCOUNT_ID`, then run **Actions → Deploy Input Atlas**. The manual workflow validates the catalog, generates the data-health and SQL artifacts, runs the Worker dry-run, checks credentials and deploys with Wrangler.

## Research rules

Read `CONTRIBUTING.md`, `research/FIELD_MODEL.md`, `research/RESEARCH_NOTES.md`, `research/SOURCE_POLICY.md`, `research/V05_RESEARCH.md` and `research/V06_DATA.md` before bulk imports.

Core rules:

- there is no universal “best gaming mouse” score;
- manufacturer claims, independent measurements, community observations and Atlas inference remain distinguishable;
- product family, manufacturer-confirmed same shell, modeled geometry similarity and grip-specific fit similarity are separate relationships;
- polling ceiling receives contextual weight rather than an automatic bonus;
- shape and grip are multi-axis rather than S/M/L labels;
- static glide, dynamic glide and stopping power are separate mousepad axes;
- skate feel is pad-dependent and tracks fresh vs broken-in behavior where data exists;
- 0–100 fit/feel values are comparative indices, not fabricated lab coefficients;
- measured latency, friction, force or other physical values require explicit methodology and provenance.

## Shape data

Current outline rendering uses **Input Atlas parametric approximations** derived from the catalog's own dimensions and geometry fields. No outline asset is copied from EloShapes, RTINGS or another site's scans. `MouseProduct.outline` supports sourced measured point sets (`measured-svg` / `scan`) so measured geometry can replace parametric geometry later without changing the Shape Lab interface.
