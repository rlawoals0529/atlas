# Atlas

[![Atlas CI](https://github.com/rlawoals0529/atlas/actions/workflows/ci.yml/badge.svg)](https://github.com/rlawoals0529/atlas/actions/workflows/ci.yml)
[![Security baseline](https://github.com/rlawoals0529/atlas/actions/workflows/security-baseline.yml/badge.svg)](https://github.com/rlawoals0529/atlas/actions/workflows/security-baseline.yml)

**Live:** https://atlas.rlawoals0529.workers.dev/ · **Case study:** [docs/PORTFOLIO_CASE_STUDY.md](docs/PORTFOLIO_CASE_STUDY.md)

## Quick tour

For a fast review of the project:

- **Switches:** https://atlas.rlawoals0529.workers.dev/#switches — sourced switch catalog, explicit product media, filtering, comparison, compatibility caveats and attributed external reviews.
- **Keyboard Lab:** https://atlas.rlawoals0529.workers.dev/#keyboard-lab — complete-board research for form factor, switch technology, polling, actuation and configuration.
- **Shape Lab / pointing setup:** https://atlas.rlawoals0529.workers.dev/#pointing — mouse geometry comparison and setup guidance.
- **Sensitivity Lab:** https://atlas.rlawoals0529.workers.dev/#sensitivity — sourced base-hipfire sensitivity conversion.
- **Validation Lab:** https://atlas.rlawoals0529.workers.dev/#validation-run — guided hardware test execution with NOT RUN / PASS / FAIL / BLOCKED evidence handling.
- **Product Lab:** https://atlas.rlawoals0529.workers.dev/#product-lab — catalog analysis, evidence coverage, validation planning and product-operations work.

Reviewer docs: [portfolio case study](docs/PORTFOLIO_CASE_STUDY.md) · [validation protocol](docs/product/VALIDATION_PROTOCOL.md) · [community evidence protocol](docs/product/COMMUNITY_EVIDENCE_PROTOCOL.md) · [contributing](CONTRIBUTING.md)

Atlas started as a mouse recommender, then grew into the rest of the setup. A pad changes how the mouse moves. Skates change the pad. Keyboards and switches have their own compatibility and tuning problems. Sensitivity ties the pointing side together.

Today Atlas is an enthusiast catalog with comparison and setup tools. Product Lab sits on the same data and handles the less glamorous work behind it: category analysis, validation plans, evidence tracking and product-operations notes. It is one project with one catalog, not a collection of disconnected demos.

## Current build — v0.9

The canonical catalog currently has **134 products**: **43 gaming mice**, **20 mousepads**, **9 skate families**, **12 gaming keyboards** and **50 keyboard switches**, plus 8 grip subtypes and 8 game/use profiles. There is no target product count. A smaller sourced catalog is more useful than a larger one padded with guesses.

The pointing-gear recommendation model is still product UI **v0.8**; Atlas **v0.9** widened the catalog and added the specialist tools around it. That version split is deliberate: adding keyboards or a new research view does not silently change an existing mouse recommendation.

The consumer product includes:

- explainable mouse, pad and skate recommendations based on hand size, grip subtype, game style, sensitivity and surface preference;
- relative recommendation mode for moving smaller/larger, narrower/wider, lower/higher, lighter/heavier or changing palm support from a mouse you already own;
- Shape Lab with top/side overlays, real scale or normalized length, center/front/rear/sensor alignment, per-layer styling, dimensions, product images, up to five mice and shareable comparison URLs;
- Balanced, Claw, Fingertip and Palm shape-similarity modes using multi-axis geometry;
- direct target-geometry search;
- product detail inspector with type-specific specs, family/revision context, fit/feel models and source provenance;
- evidence-health scoring that keeps manufacturer, independent, community and Atlas/editorial information visibly distinct;
- database filters for brand, shape, polling, weight, wireless status, product status, price and evidence quality;
- a dedicated **Mousepads** catalog at `#mousepads` with surface, firmness and stitched-edge filters plus glide/stopping sorting;
- mousepad comparison with a glide × stopping map, footprint/build view and normalized feel profiles before the full spec table;
- side-by-side mouse comparison with raw deltas, shape overlays and component-level geometry similarity;
- an **Atlas Switches** catalog at `#switches` with manufacturer-sourced records, explicit switch media, switch-specific filters/comparison and a separately attributed directory of 466 ThereminGoat scorecards/review records rather than copied Atlas rankings;
- **Keyboard Lab** at `#keyboard-lab` for complete-board research, actuation/platform comparison and sourced keyboard specifications;
- **Sensitivity Lab** at `#sensitivity` for DPI/eDPI and base-hipfire cm/360 conversion with source-specific yaw confidence;
- a light, product-first interface shared across the catalog and specialist tools;
- explicit manufacturer product imagery for every current switch record, plus pinned/fallback manufacturer media for the rest of the input-hardware catalog;
- installable web-app metadata and a documented research/correction workflow.

## Keyboard Lab

Open **Keyboard Lab** from the main Atlas navigation or `#keyboard-lab`.

Keyboard Lab is intentionally board-only. It focuses on fields that can be sourced cleanly:

- form factor, layout and switch technology;
- polling ceiling and adjustable actuation range;
- Rapid Trigger, SOCD-style input behavior and analog input where documented;
- connectivity, case/plate/keycap/mount details and configuration software;
- source provenance and explicit boundaries between advertised support and measured behavior.

Atlas does **not** treat minimum actuation distance as latency or advertised polling support as proof of an effective update rate.

Switch-level research lives in the dedicated **Switches** route at `#switches`, where published force/travel fields, product media, board-compatibility notes and the attributed ThereminGoat review directory stay separate from complete-keyboard records.

See `research/V10_SURFACE_KEYBOARD_RESEARCH.md`.

## Sensitivity Lab

Open **Sensitivity Lab** from the main Atlas navigation or `#sensitivity`.

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

Those files exist because Atlas actually uses them. They are not there to make the repository look like a larger company's process.

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

The keyboard/switch catalog has grown beyond the original v0.9 pilot and now contains **12 keyboards** and **50 switches**. The same boundary still applies: manufacturer specifications, independent measurements/reviews and Atlas-derived fields remain separate evidence classes. Magnetic-switch compatibility is stored with board-specific caveats rather than collapsed into a universal “HE compatible” label.

Product media follows the same rule. Current switch records require an explicit pinned product image; other unresolved input-hardware records can fall back to an official manufacturer page through the Worker. CI checks those paths, and production deploys smoke-test media resolution instead of assuming a page URL will keep working.

## Third-party data and media

Atlas does not claim ownership of manufacturer imagery, external review material or linked source documents. Product images stay attributed to their manufacturer/source, and the ThereminGoat directory remains an attributed external-review index rather than an Atlas-owned ratings dataset.

The repository's catalog records are Atlas research artifacts built from cited sources. Publishing the repository does not relicense third-party images, reviews, trademarks or source material.

## Source availability

Atlas is public so the implementation, research model and project history can be reviewed. The repository does not currently grant an open-source license. Third-party trademarks, product media, review material and linked source content remain subject to their respective owners' rights.

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

1. `npm ci`
2. `npm run data:validate`
3. `npm run community:validate`
4. `npm run sensitivity:validate`
5. `npm run a11y:validate`
6. `npm run data:report`
7. `npm run data:seed`
8. `npm run dev`

## Validation

```bash
npm run data:validate
npm run community:validate
npm run sensitivity:validate
npm run product:validate
npm run switch-index:validate
npm run a11y:validate
npm run data:report
npm run data:seed
npm run check
```

CI installs exactly from `package-lock.json` with `npm ci`, validates the catalog shards, qualitative evidence pilots, sensitivity rules, switch-review mappings and modal keyboard-accessibility invariants. It also generates the derived artifacts, audits production dependencies, and runs TypeScript, Vite and a Wrangler deployment dry-run. The security workflow checks tracked secret files, env hygiene, wildcard CORS, dependency integrity and unsafe HTML sinks.

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

Shape Lab uses the best outline Atlas can support for each view: an explicit measured/vector or scan outline when one is present, a sourced traced reference when appropriate, and the catalog's parametric geometry as the fallback. The UI says which one you are looking at. A measured top outline does not make a generated side profile “measured.”

No outline coordinates are copied from EloShapes, RTINGS or another site's proprietary shape database. `MouseProduct.outline` keeps sourced point sets and their source IDs separate from the parametric fallback so better geometry can replace an estimate without changing the comparison workflow.
