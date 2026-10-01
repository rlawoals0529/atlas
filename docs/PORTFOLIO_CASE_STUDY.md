# Atlas portfolio case study

## What Atlas is

Atlas is an enthusiast hardware research and comparison product for gaming mice, mousepads, skates, keyboards and switches. It combines a sourced product catalog with comparison tools, setup guidance, validation workflows and product-operations artifacts.

The current public build contains 153 canonical products, including 69 keyboard switches, with a separate attributed directory of 466 ThereminGoat switch review records.

Live product: https://atlas.rlawoals0529.workers.dev/

## Problem

Peripheral shopping is unusually sensitive to details that generic product grids flatten:

- mouse shape is multi-dimensional rather than S/M/L;
- mousepad speed and stopping are separate axes;
- skate behavior depends on the surface beneath it;
- Hall-effect switch compatibility is board-specific;
- manufacturer specifications, independent measurements and subjective reviews should not be mixed into one confidence-free score.

The product problem was therefore not "rank everything." It was to make heterogeneous evidence easier to compare without pretending unlike evidence is equivalent.

## Product decisions

### Keep evidence classes visible

Atlas stores manufacturer, independent, community and Atlas-derived evidence separately. A manufacturer claim can support a canonical specification, while an independent review can add context without silently becoming the same kind of fact.

External switch reviews remain attributed to their source. Atlas does not republish ThereminGoat's composite score columns as an Atlas leaderboard.

### Prefer dimensions over universal scores

The product uses separate dimensions where the underlying trade-off matters:

- mouse geometry rather than a single fit score;
- static/dynamic glide and stopping rather than one mousepad-speed number;
- initial/actuation/bottom-out force plus travel rather than a "best switch" rating;
- evidence coverage as a data-quality heuristic rather than a product-quality score.

### Treat compatibility as implementation-specific

Magnetic keyboard switches are not labeled universally compatible. Atlas records board-specific caveats because polarity, flux range, sensor implementation, PCB geometry and firmware calibration can all affect real compatibility.

### Keep generated validation separate from real test results

Product Lab can generate validation plans from sourced capabilities. Generated cases always begin NOT RUN and only become PASS/FAIL/BLOCKED after a person records an actual physical execution.

## Engineering decisions

### Canonical JSON shards

Product research lives in dated JSON shards rather than being hidden inside components. Runtime and maintenance scripts merge those shards and validate:

- globally unique IDs/slugs;
- source/evidence references;
- type-specific physical bounds;
- required switch sourcing/media fields;
- Hall-effect/TMR compatibility notes.

### Route-level code and data splitting

As the switch catalog grew, loading all switch records and image metadata on every page pushed the initial JavaScript bundle toward its budget.

Instead of raising the budget, Atlas moved expanded switch data and switch-media metadata into the lazy Switches route. The Worker still imports the full catalog server-side so API/media endpoints resolve those records correctly.

After the switch expansion, the measured initial bundle remained about:

- 446.45 KiB raw / 111.92 KiB gzip JavaScript;
- 102.46 KiB raw / 19.16 KiB gzip CSS.

Both remain under the repository's enforced budgets.

### Cloudflare Worker API

The React application and API share the same catalog model. The Worker exposes health, statistics, catalog search, product records, comparison, recommendation and optional analytics endpoints.

Deployment CI performs a Wrangler dry-run before merge and production deploys perform release/health and media verification.

### Accessibility as a regression target

Atlas includes CI checks for modal keyboard behavior, focus trapping/restoration, accessible names, pressed/expanded states and comparison controls. Dense catalog surfaces are also designed around keyboard access and mobile overflow constraints.

## Switches expansion

The switch work is a useful example of the project's research/engineering loop.

The first canonical switch catalog was small. It was expanded in manufacturer-backed batches rather than by scraping an unsourced master list:

- CHERRY
- Gateron
- Wooting
- Akko
- Kailh
- TTC
- Wuque Studio
- KTT

Every current switch requires:

- a manufacturer source;
- at least one published force point;
- an explicit product image;
- valid travel data;
- a compatibility note for Hall-effect/TMR records.

The Switches route now includes manufacturer/technology/feel filtering, actuation/travel sorting, density controls, side-by-side comparison, recent Atlas additions, field-coverage reporting and an attributed external review directory.

## Quality / security workflow

Pull requests run:

- production dependency audit;
- canonical catalog validation;
- community evidence validation;
- sensitivity-data validation;
- Product Lab integrity checks;
- product media validation;
- external switch-index validation;
- modal accessibility checks;
- TypeScript/Vite build;
- Cloudflare Worker dry-run;
- initial bundle-budget validation.

A separate reusable security workflow checks tracked secret files, env-file hygiene, obvious literal credentials, wildcard CORS, dependency integrity and unsafe browser HTML sinks.

## What the project demonstrates

Atlas is intentionally broader than a component showcase. It demonstrates:

- product thinking around an enthusiast/user-research problem;
- evidence and provenance modeling;
- React/TypeScript product implementation;
- Cloudflare Workers/API deployment;
- CI and security regression checks;
- performance/code-splitting decisions based on measured bundle output;
- accessibility and responsive-layout hardening;
- system-test planning without fabricating execution results;
- product-operations artifacts grounded in real project decisions.

## Current boundaries

Atlas is still a curated research product, not a complete market database.

It does not claim:

- representative market coverage;
- measured performance where only manufacturer claims exist;
- product demand or market share from catalog composition;
- universal switch compatibility;
- universal "best" product scores;
- physical hardware validation results that were never executed.

Those limits are kept explicit because they are part of the product's reliability model, not missing polish.
