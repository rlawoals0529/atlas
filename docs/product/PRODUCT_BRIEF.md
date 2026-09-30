# Atlas product brief

## Problem

Enthusiast gaming-peripheral decisions are difficult because product fit is contextual and evidence is fragmented. Raw dimensions, marketing specifications, community impressions, independent measurements and personal fit preferences are often mixed together without provenance.

Atlas should help a user answer: **which setup fits how I actually aim, and why should I trust that answer?**

## Target users

### Competitive / enthusiast mouse shopper
Wants shape, weight, polling, clicks, wheel, coating and surface-stack context without a simplistic universal ranking.

### Existing-device owner looking for an adjacent shape
Starts from a known mouse and wants something narrower/lower/lighter/rear-humped/etc. Shape Lab and relative search are primary workflows.

### Product/research user
Wants sourced category distributions, closest competitors, product-family positioning and transparent evidence quality.

### Hardware validation user
Wants a capability-derived test plan and a place to record real firmware/environment/execution evidence without fabricating results.

## Goals

- make fit and shape differences legible;
- keep evidence provenance visible;
- support useful cross-product/category analysis;
- measure whether the product journey is actually working;
- provide a disciplined manual hardware-validation workflow;
- remain fast and useful as a consumer product rather than becoming a portfolio-only demo.

## Non-goals

- universal “best mouse” rankings;
- pretending the Atlas catalog is total market share;
- treating anecdotal community comments as representative research;
- fabricating behavioral metrics before traffic exists;
- fabricating hardware PASS/FAIL results;
- automating subjective physical-feel testing;
- becoming a retailer or affiliate storefront.

## North-star user outcome

A user can move from their hand/grip/game context to a small, explainable set of products, understand shape/evidence tradeoffs, compare them, and make an informed next action.

## Product KPIs

The first-party event model supports:

- recommendation completion rate;
- recommendation-result selection rate;
- outbound-product engagement after recommendation;
- Shape Lab session adoption;
- comparison completion rate;
- repeat-visit rate using a random first-party identifier;
- feature use by coarse grip/game/hand-size segment where collected;
- most viewed/compared products and most-used filters.

Until an aggregated production collector is enabled, the Product Lab must label browser-local events as **REAL / THIS BROWSER** and synthetic dashboard fixtures as **DEMO / SYNTHETIC**.

## Now / Next / Later

### Now
- Product Lab navigation and design-system integration;
- typed behavioral event schema and local first-party instrumentation;
- real-vs-demo analytics dashboard;
- evidence-aware Product Intelligence distributions;
- capability-derived mouse validation cases;
- manual validation session records and defect schema;
- product/operations documentation grounded in actual Atlas decisions.

### Next
- optional Cloudflare-backed analytics collector and all-users aggregate dashboard;
- direct event instrumentation inside core feature components to replace any temporary DOM bridge;
- validation evidence attachments and richer report export;
- real test sessions for owned mice;
- product-family/competitor positioning views;
- sourced launch/lifecycle fields where reliable;
- community-insight ingestion with traceable source/date/conditions.

### Later
- measured 2D/3D geometry ingestion and cross-sections;
- longitudinal price/lifecycle data;
- automated host-visible enumeration/input smoke tools where practical;
- broader mousepad/skate validation and category intelligence;
- stronger opportunity analysis only if demand/sales/customer evidence becomes available.
