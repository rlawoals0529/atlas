# Input Atlas

Gaming-peripheral research database + explainable fit engine. Input Atlas starts mouse-first, then models mousepads and skates as parts of the same aiming system rather than isolated products.

## v0.5

The current build contains **38 gaming mice**, **11 mousepads**, **6 skate families**, 8 grip subtypes and 8 game/use profiles. The seed catalog is intentionally curated rather than exhaustive; provenance and useful fit data matter more than inflating the product count.

v0.5 turns the project into a product lab rather than a static spec database:

- explainable mouse, pad and skate recommendations based on hand size, grip, game style, sensitivity and surface preference;
- relative recommendation mode for moving smaller/larger, narrower/wider, lower/higher, lighter/heavier or changing palm support from a mouse you already own;
- Shape Lab with top/side overlays, real scale or normalized length, center/front/rear/sensor alignment and up to five layers;
- grip-aware shape similarity modes for Balanced, Claw, Fingertip and Palm weighting;
- 12-component shape scoring covering length, grip width, height, hump position, front height, rear flare, side taper, hump fullness, button height, pinky clearance, sensor position and shape family;
- direct target-geometry search;
- product detail inspector with full type-specific specs, family/revision context, fit/feel models and source provenance;
- evidence-health scoring that keeps manufacturer, independent, community and Atlas/editorial information visibly distinct;
- database filters for brand, shape, polling, weight, wireless status, product status, price and evidence quality;
- side-by-side mouse comparison with raw spec deltas, shape overlays and component-level geometry similarity;
- responsive dark technical UI inspired by the interaction discipline of Sidereal and FantasyStats while keeping Input Atlas visually distinct.

## Architecture

`data/catalog.json` is the canonical research source. The same data powers the React UI, Worker API, deterministic recommender and generated SQL seed so the database and recommendation engine cannot silently drift into conflicting datasets.

```text
manufacturer / independent / community research
                     ↓
              data/catalog.json
                 ↙    ↓     ↘
         React UI   fit engine   SQL seed
                     ↓
                Worker API
```

The v0.5 production runtime intentionally serves the canonical bundled catalog directly from the Worker. The existing D1 schema and generated migration are retained for the later persistence/search stage, but D1 is **not required to deploy the current site**. This avoids a fake database binding blocking production before the Worker actually needs it.

Stack:

- React 19 + TypeScript + Vite
- Hono API on Cloudflare Workers
- Cloudflare Workers Static Assets for the SPA
- deterministic, explainable recommendation + geometry engines
- prepared D1 + FTS5 schema/migrations for the future persisted catalog/search layer

## API

- `GET /api/health`
- `GET /api/catalog?type=mouse&q=claw`
- `GET /api/products/:slug`
- `GET /api/compare?ids=mouse-id-1,mouse-id-2`
- `GET /api/similar/:id?mode=claw`
- `GET /api/shape?length=122&width=59&height=39&hump=55&weight=55`
- `POST /api/recommend` with a `UserProfile`

## Local setup

1. `npm install`
2. `npm run data:validate`
3. `npm run data:seed`
4. `npm run dev`

## Cloudflare deploy

The current v0.5 Worker has no required application secret or database binding.

Local Wrangler path:

1. authenticate Wrangler to the intended Cloudflare account;
2. `npm run data:validate`
3. `npm run build`
4. `npm run deploy`

GitHub path:

1. add repository secrets `CLOUDFLARE_API_TOKEN` and `CLOUDFLARE_ACCOUNT_ID`;
2. open **Actions → Deploy Input Atlas → Run workflow**;
3. the workflow validates the catalog, checks generated seed consistency, runs the TypeScript/Vite/Worker dry-run, then deploys with Wrangler.

The deployment workflow is manual by design so missing credentials cannot break normal pushes. When D1 persistence is enabled later, create the `input-atlas` database, add its real binding ID, and apply the migrations. Until the Worker actually reads D1, the generated schema/seed remain a checked future-storage path rather than a production dependency.

## Research rules

Read `research/FIELD_MODEL.md`, `research/RESEARCH_NOTES.md`, `research/SOURCE_POLICY.md` and `research/V05_RESEARCH.md` before bulk imports.

Core rules:

- there is no single universal “best gaming mouse” score;
- manufacturer claims, independent measurements, community observations and Atlas editorial inference remain distinguishable;
- product family, manufacturer-confirmed same shell, modeled geometric similarity and grip-specific fit similarity are separate relationships;
- 8 kHz polling receives contextual weight rather than an automatic bonus;
- shape and grip are multi-axis rather than S/M/L labels;
- static glide, dynamic glide and stopping power are separate mousepad axes;
- skate feel is pad-dependent and tracks fresh vs broken-in behavior where data exists;
- 0–100 fit/feel values are comparative indices, not fabricated laboratory coefficients;
- measured latency, friction, force or other physical values require explicit methodology and provenance.

## Shape data

Current outline rendering uses **Input Atlas parametric approximations** derived from the catalog's own dimensions and geometry fields. No outline asset is copied from EloShapes, RTINGS or another site's scans. `MouseProduct.outline` already supports sourced measured point sets (`measured-svg` / `scan`) so measured geometry can replace parametric geometry later without changing the Shape Lab interface.

## Data maintenance

```bash
npm run data:validate
npm run data:seed
npm run build
```

The generator writes `migrations/0002_seed.sql` from the canonical catalog. GitHub Actions validates the catalog, regenerates the seed, checks that the generated SQL is committed and runs `npm run check` (TypeScript, Vite and Wrangler dry-run) on every pull request to `main`.
