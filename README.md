# Input Atlas

Gaming-mouse-first research database + explainable fit engine, with mousepads and skates modeled as part of the same aiming system.

## What v0.3 contains
- **38 gaming mice** spanning ultralight FPS, symmetrical/esports, ergonomic FPS, all-purpose multi-button and MMO designs.
- **11 mousepads** spanning control cloth, balanced cloth/hybrid, speed cloth and glass.
- **6 skate families** spanning pure PTFE, hardened PTFE and UHMW-PE, with fresh/broken-in/wear behavior.
- **8 game/use profiles:** tactical FPS, tracking FPS, arena FPS, battle royale, MOBA/RTS, MMO, action/general and mixed gaming.
- **8 grip subtypes:** palm, relaxed/aggressive/pincer/knuckle claw, fingertip, extended fingertip and palm-claw hybrid.
- Relative recommendation mode: choose the mouse you already own and ask for smaller/larger, narrower/wider, lower/higher hump, lighter/heavier and less/more palm support.
- 5-axis shape finder and side-by-side comparison UI.

The seed catalog is intentionally representative rather than exhaustive. Editorial fit/feel vectors are provisional until independent/community evidence is aggregated at larger scale.

## Architecture
`data/catalog.json` is the canonical research source. The same data powers the React UI, Worker API, deterministic recommender and generated D1 seed. This prevents the database site and recommendation site from becoming two conflicting datasets.

```text
manufacturer / independent / community research
                     ↓
              data/catalog.json
                 ↙    ↓     ↘
         React UI   fit engine   D1 seed
                     ↓
                Worker API
```

Stack:
- React 19 + TypeScript + Vite
- Hono API on Cloudflare Workers
- Cloudflare Workers Static Assets for the SPA
- Cloudflare D1 + FTS5 schema for production search/catalog storage
- Deterministic, explainable recommendation engine; no LLM is required for ranking

## API
- `GET /api/health`
- `GET /api/catalog?type=mouse&q=claw`
- `GET /api/products/:slug`
- `GET /api/compare?ids=mouse-id-1,mouse-id-2`
- `GET /api/shape?length=122&width=59&height=39&hump=55&weight=55`
- `POST /api/recommend` with a `UserProfile`

## First-time setup
1. `npm install`
2. `npx wrangler d1 create input-atlas`
3. Put the returned database UUID into `wrangler.jsonc`, replacing `REPLACE_AFTER_WRANGLER_D1_CREATE`.
4. `npm run data:validate`
5. `npm run data:seed`
6. `npx wrangler d1 migrations apply input-atlas --local`
7. `npm run dev`

Wrangler requires a real D1 `database_id` in the binding configuration. Create the database once before the first local Worker/Vite run; subsequent local development uses Wrangler's local D1 storage unless you explicitly opt into remote development.

## First Cloudflare deploy
After first-time setup:
1. `npm run data:validate`
2. `npm run data:seed`
3. `npx wrangler d1 migrations apply input-atlas --remote`
4. `npm run deploy`

## Research rules
Read `research/FIELD_MODEL.md`, `research/RESEARCH_NOTES.md`, and `research/SOURCE_POLICY.md` before bulk imports. Manufacturer claims, independent measurements, community observations and Atlas editorial inference must remain distinguishable.

Important design decisions:
- no single universal “best gaming mouse” score;
- 8 kHz polling receives only contextual/small weight rather than an automatic bonus;
- shape and grip are multi-axis rather than S/M/L labels;
- static glide, dynamic glide and stopping power are separate pad axes;
- skate feel is pad-dependent and includes fresh vs broken-in behavior;
- gaming categories change the ranking weights (e.g. button density matters far more for MMO than tactical FPS).

## Data maintenance
Run:

```bash
npm run data:validate
npm run data:seed
```

The generator writes `migrations/0002_seed.sql` from the same canonical catalog.


## Shape Lab (v0.3)

The new Shape Lab makes visual shape discovery a first-class workflow:

- overlay up to five gaming mice at once
- top or side view
- real-scale or normalized-length comparison
- align by geometric center, front edge, rear edge, or sensor position
- adjustable layer opacity
- find-similar search using an 8-axis geometry vector
- human-readable difference explanations
- one-click load of similar pairs into the overlay

The initial outlines are **Input Atlas parametric approximations** derived from the catalog's own dimensions and geometry fields. They are not copied from EloShapes, RTINGS, or another site's scan assets. `MouseProduct.outline` can store sourced measured point sets later (`measured-svg` / `scan`) while preserving source provenance.
