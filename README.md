# Atlas

Evidence-aware gaming-peripheral research, fit, comparison and validation workspace. Atlas started mouse-first and now treats mice, mousepads, skates, gaming keyboards, switches and sensitivity calibration as parts of the same input ecosystem rather than isolated spec sheets.

Atlas is intentionally two things at once without splitting into unrelated portfolio demos:

1. a consumer-facing enthusiast product for finding, comparing and calibrating gaming peripherals;
2. a Product Lab that uses the same catalog, fit model and evidence system for product analytics, category intelligence, product operations and real hardware/system validation.

## Current build — v0.9

The current canonical catalog contains **66 products**: **39 gaming mice**, **16 mousepads**, **6 skate families**, **3 gaming keyboards** and **2 keyboard switches**, plus 8 grip subtypes and 8 game/use profiles. It is curated rather than exhaustive: provenance, fit usefulness and maintainability matter more than inflating the product count.

The established pointing-gear consumer shell remains product UI **v0.8**. Atlas **v0.9** adds new routed enthusiast utilities and a broader data layer without silently changing the existing mouse/pad/skate recommendation model.

The consumer product includes:

- explainable mouse, pad and skate recommendations based on hand size, grip subtype, game style, sensitivity and surface preference;
- relative recommendation mode for moving smaller/larger, narrower/wider, lower/higher, lighter/heavier or changing palm support from a mouse you already own;
- Shape Lab with top/side overlays, real scale or normalized length, center/front/rear/sensor alignment and up to five layers;
- Balanced, Claw, Fingertip and Palm shape-similarity modes using multi-axis geometry;
- direct target-geometry search;
- product detail inspector with type-specific specs, family/revision context, fit/feel models and source provenance;
- evidence-health scoring that keeps manufacturer, independent, community and Atlas/editorial information visibly distinct;
- database filters for brand, shape, polling, weight, wireless status, product status, price and evidence quality;
- side-by-side mouse comparison with raw deltas, shape overlays and component-level geometry similarity;
- **Keyboard Lab** at `#keyboard-lab` for source-backed gaming-keyboard and switch research;
- **Sensitivity Lab** at `#sensitivity` for DPI/eDPI and base-hipfire cm/360 conversion with source-specific yaw confidence;
- responsive precision-lab UI with the information discipline of Sidereal/FantasyStats while remaining visually distinct;
- installable web-app metadata and a documented research/correction workflow.

## Keyboard Lab

Open **Keyboard Lab** from the Atlas utility dock or `#keyboard-lab`.

The first keyboard/switch catalog pass focuses on fields that can be sourced cleanly:

- form factor, layout and switch technology;
- polling ceiling and adjustable actuation range;
- Rapid Trigger, SOCD-style input behavior and analog input where documented;
- connectivity, case/plate/keycap/mount details and configuration software;
- switch technology, feel, published force points, travel, lubrication, lifespan and magnetic-flux conditions where published;
- source provenance and explicit Hall-effect compatibility caveats.

Atlas does **not** treat minimum actuation distance as latency, advertised polling support as proof of an effective update rate, or subjective switch-review scores as a universal quality ranking. ThereminGoat scorecards and long-form reviews are used as traceable expert evidence rather than copied wholesale into an Atlas leaderboard.

See `research/V10_SURFACE_KEYBOARD_RESEARCH.md`.

## Sensitivity Lab

Open **Sensitivity Lab** from the Atlas utility dock or `#sensitivity`.

The current converter matches **base horizontal physical turn distance**:

```text
targetSensitivity = sourceSensitivity × sourceDPI × sourceYaw ÷ targetDPI ÷ targetYaw
cm/360 = 360 × 2.54 ÷ (DPI × sensitivity × yaw)
```

Initial presets cover Counter-Strike 2, VALORANT and Apex Legends with per-preset source links and confidence labels. ADS, scopes, per-optic multipliers, FOV/perceptual matching, controller curves and aim assist are deliberately outside the first version rather than being approximated as equivalent.

See `research/SENSITIVITY_CONVERSION.md`.

## Product Lab

Open **Product lab** from the Atlas navigation or `#product-lab`.

### Product Analytics

Atlas has a typed first-party behavioral event schema for meaningful product actions rather than scattered arbitrary analytics strings. The Product Lab reports recommendation funnels, feature use, product views/comparisons and repeat visits.

The dashboard has explicit data modes:

- **REAL / THIS BROWSER** — events actually generated in the current browser;
- **DEMO / SYNTHETIC** — deterministic fixtures used to demonstrate/dashboard-test flows when traffic is limited.

Synthetic events are never presented as production usage.

An optional same-origin production collector exists under `/api/analytics`. It is disabled unless a real Cloudflare D1 database is bound as `ANALYTICS_DB`; Atlas remains fully deployable without it. The production collector validates event types/properties server-side, bounds batches/body sizes, rate-limits writes and stores no raw IP identity.

See `docs/product/ANALYTICS_SPEC.md`.

### Product Intelligence

The Product Lab uses Atlas's sourced mouse catalog for descriptive category analysis including:

- weight, MSRP, shape and polling distributions;
- wireless and high-polling share in the current curated sample;
- brand lineup positioning;
- sparse shape × weight cells as **research prompts**, not automatic opportunities;
- direct competitor sets derived from shape, weight, price, polling and connectivity parity;
- observed findings kept separate from hypotheses and evidence still needed.

Atlas-derived positioning scores are not sales/demand/market-share measurements.

### System Test / Validation

Atlas can derive a professional mouse validation plan from documented product capabilities across:

- connectivity/enumeration/reconnect;
- physical inputs;
- sensor and polling boundaries;
- configuration persistence;
- Windows/USB compatibility;
- power/sleep/wake where applicable;
- post-change regression/smoke coverage.

**Generated cases always begin `NOT RUN`.** They only become PASS/FAIL/BLOCKED after a person physically executes the test against a real device and records the environment and actual result.

The Validation Lab stores browser-local manual sessions with firmware/receiver/OS/USB/settings context, actual results, reproduction frequency, evidence notes and linked defects. Defects keep severity and priority separate and can record reproduction steps, suspected layer, evidence references and a regression-test link. Sessions can be exported as JSON or human-readable Markdown evidence.

See `docs/product/VALIDATION_PROTOCOL.md`.

### Product Operations

`docs/product/` contains operating artifacts grounded in actual Atlas decisions:

- product brief, target users, goals/non-goals and KPIs;
- analytics/event specification and privacy boundaries;
- evidence-driven Now/Next/Later roadmap;
- prioritized working backlog;
- release criteria/checklist;
- feedback/issue/data-correction workflow;
- hardware validation protocol;
- product changelog;
- lightweight incident/postmortem template.

These docs are intentionally kept proportional to the project rather than simulating a large company's process.

## Canonical data architecture

Catalog JSON is the source of truth. The original dataset remains `data/catalog.json`; dated research additions live in reviewable shards such as `data/catalog.2026q3.json` and `data/catalog.2026q3-keyboards.json`.

```text
manufacturer / independent / community research
                     ↓
       data/catalog*.json shards
                 ↙    ↓     ↘
         React UI   fit engine   generated SQL
             ↓         ↓
        Product Lab  Worker API
```

Both runtime and maintenance scripts merge the shards. `npm run data:validate` enforces global IDs/slugs, source-definition consistency, valid evidence references, physical dimensions, switch/keyboard bounds and 0–100 model bounds across the combined catalog.

`npm run data:report` generates `generated/data-report.json` with product counts, source-class coverage, evidence-confidence totals and source-check date window. `npm run data:seed` produces `generated/catalog-seed.sql` on demand. Both artifacts are ignored by git; JSON research remains canonical.

The generic Worker catalog API spans all five product groups. The existing recommendation, shape-similarity and mouse-comparison engines remain intentionally scoped to pointing gear.

## Optional analytics storage

The consumer/catalog runtime does **not** require D1.

For site-wide behavioral analytics, Atlas includes optional migration `migrations/0002_analytics.sql`. If a dedicated D1 database is created and bound as `ANALYTICS_DB`, the client can send the same typed event schema to the Worker and the Worker can expose aggregate production summaries. Until that binding exists, the Product Lab remains explicit that analytics are browser-local or synthetic demo data.

The catalog schema now permits keyboard/switch records for fresh databases and includes `migrations/0003_keyboard_product_types.sql` for existing catalog databases.

## Current research additions

The 2026 Q3 pointing-device shard adds the **Razer Viper V3 Pro SE** and all five **Razer Gigantus V2 Pro** speed grades.

For the Viper line, manufacturer documentation confirms the Viper V3 Pro SE, V3 Pro and V4 Pro share the exact mouse shape. Atlas preserves that same-shell relationship separately from differences in weight, sensor/switch generation, polling hardware and battery behavior.

For the Gigantus V2 Pro, Razer defines Max Control, Control, Balance, Speed and Max Speed. The official ordering and common physical platform are retained. Atlas 0–100 surface values are explicitly low-confidence normalized interpolation, **not measured friction coefficients**. See `research/V06_DATA.md` for the mapping and limitations.

Atlas includes traceable qualitative community-evidence pilots for selected mice and the WALLHACK SP-004. Individual observations preserve source, date, conditions, disagreement and evidence strength; the pilots are not treated as representative market sentiment, friction measurement or reliability-rate data. Public X/Twitter observations are only retained when directly attributable and product-specific; incomplete X indexing is documented as a research limitation.

The v0.9 keyboard shard begins with **Wooting 80HE+**, **Razer Huntsman V3 Pro Tenkeyless 8KHz**, **Keychron Q1 HE 8K**, **Gateron Magnetic Jade Emerald** and **CHERRY MX2A Red**. Manufacturer specifications and independent/reviewer observations remain separate evidence classes.

## Runtime stack

- React 19 + TypeScript + Vite
- Hono API on Cloudflare Workers
- Cloudflare Workers Static Assets for the SPA
- deterministic, explainable recommendation + geometry engines
- JSON catalog shards as canonical product research
- optional D1 storage for production behavioral analytics

## API

Core product endpoints:

- `GET /api/health`
- `GET /api/stats`
- `GET /api/catalog?type=mouse&q=claw`
- `GET /api/catalog?type=keyboard&q=hall-effect`
- `GET /api/catalog?type=switch&q=tactile`
- `GET /api/products/:slug`
- `GET /api/compare?ids=mouse-id-1,mouse-id-2`
- `GET /api/similar/:id?mode=claw`
- `GET /api/shape?length=122&width=59&height=39&hump=55&weight=55`
- `POST /api/recommend` with a `UserProfile`

Optional production analytics endpoints:

- `GET /api/analytics/availability`
- `POST /api/analytics/events`
- `GET /api/analytics/summary?days=30`

`/api/stats` reports release metadata, catalog/source/evidence coverage and whether production analytics storage is configured.

## Local setup

1. `npm install`
2. `npm run data:validate`
3. `npm run community:validate`
4. `npm run sensitivity:validate`
5. `npm run data:report`
6. `npm run data:seed`
7. `npm run dev`

## Validation

```bash
npm run data:validate
npm run community:validate
npm run sensitivity:validate
npm run product:validate
npm run data:report
npm run data:seed
npm run check
```

CI validates every catalog shard, all qualitative evidence pilots and sensitivity-conversion invariants, generates derived artifacts, audits production npm dependencies, then runs TypeScript, Vite and a Wrangler deployment dry-run. The shared account security baseline also checks tracked secret files, env hygiene, wildcard CORS, dependency integrity and unsafe HTML sinks.

## Cloudflare deploy

Atlas is configured as a Cloudflare Worker with static SPA assets. A successful deployment produces a public `*.workers.dev` URL that can be used to test the same Worker/API/UI bundle that runs in production.

For GitHub deployment, add repository secrets `CLOUDFLARE_API_TOKEN` and `CLOUDFLARE_ACCOUNT_ID`. After those credentials exist, **Deploy Atlas** runs automatically after a successful **Atlas CI** run on `main`; it can also be started manually from GitHub Actions. The workflow validates Atlas again, deploys with Wrangler, extracts the resulting `workers.dev` URL, health-checks `/api/health`, and prints the live site plus Keyboard Lab, Sensitivity Lab and Product Lab links in the Actions job summary.

If the Cloudflare secrets have not been configured yet, the deployment workflow exits successfully without deploying and explains the missing one-time setup in its job summary instead of turning ordinary development commits red.

The current consumer Worker has no required application secret or database binding. Production behavioral analytics is a separate optional step: create a D1 database, apply `migrations/0002_analytics.sql`, bind it as `ANALYTICS_DB`, establish a retention policy and verify `/api/analytics/availability` before treating dashboard aggregates as production usage.

## Research rules

Read `CONTRIBUTING.md`, `research/FIELD_MODEL.md`, `research/RESEARCH_NOTES.md`, `research/SOURCE_POLICY.md`, `research/V05_RESEARCH.md`, `research/V06_DATA.md`, `research/V10_SURFACE_KEYBOARD_RESEARCH.md`, `research/SENSITIVITY_CONVERSION.md` and `docs/product/README.md` before bulk imports or major product changes.

Core rules:

- there is no universal “best gaming mouse” or “best keyboard switch” score;
- manufacturer claims, independent measurements, community observations and Atlas inference remain distinguishable;
- product family, manufacturer-confirmed same shell, modeled geometry similarity and grip-specific fit similarity are separate relationships;
- polling ceiling receives contextual weight rather than an automatic bonus;
- minimum actuation distance is not latency;
- Hall-effect switch compatibility is implementation-specific rather than universal MX-shape compatibility;
- shape and grip are multi-axis rather than S/M/L labels;
- static glide, dynamic glide and stopping power are separate mousepad axes;
- skate feel is pad-dependent and tracks fresh vs broken-in behavior where data exists;
- 0–100 fit/feel values are comparative indices, not fabricated lab coefficients;
- measured latency, friction, force or other physical values require explicit methodology and provenance;
- sensitivity conversion matches base physical turn distance only unless a separate scoped/FOV methodology is explicitly sourced;
- synthetic analytics remain visibly synthetic;
- community observations retain source/date/conditions/evidence strength;
- generated hardware tests are plans, not results.

## Shape data

Current outline rendering uses **Atlas parametric approximations** derived from the catalog's own dimensions and geometry fields. No outline asset is copied from EloShapes, RTINGS or another site's scans. `MouseProduct.outline` supports sourced measured point sets (`measured-svg` / `scan`) so measured geometry can replace parametric geometry later without changing the Shape Lab interface.
