# Atlas Product Analytics

## Purpose

Atlas uses first-party product analytics to understand whether the product is helping people move from exploration to an evidence-backed peripheral decision. The analytics system is part of the product architecture, not a marketing tracker.

The primary questions are:

- Which Atlas features are actually used?
- Which products and product pairs attract attention?
- Which controls matter in the fit flow?
- Where do sessions stop before reaching recommendations?
- Do Shape Lab users engage with more products or comparisons?
- Do broad grip, game-style, and hand-size segments behave differently?
- Which product attributes are associated with deeper engagement?

## Collection architecture

Browser interactions are normalized into the typed `AtlasAnalyticsEvent` contract in `src/shared/analytics.ts`, sent only to Atlas's own `/api/events` endpoint, validated again on the Worker, and written to the `atlas_product_analytics` Workers Analytics Engine dataset.

The browser never receives a Cloudflare analytics credential and does not call a third-party analytics vendor directly.

## Event dictionary

| Event | Meaning |
| --- | --- |
| `session_started` | First Atlas load in a browser session. |
| `feature_viewed` | A primary product area is opened. |
| `search_performed` | A catalog search is submitted/changed meaningfully. |
| `filters_used` | A fit or catalog control is changed. |
| `product_viewed` | A product detail surface is opened. |
| `comparison_started` | A comparison has its first product. |
| `comparison_completed` | A comparison reaches the minimum complete comparison set. |
| `shape_lab_used` | A Shape Lab control/canvas interaction occurs. |
| `similarity_search_used` | A similar-shape result is selected. |
| `recommendation_flow_started` | A session begins changing Fit Engine inputs. |
| `recommendation_flow_completed` | The first changed profile produces a visible recommendation set. |
| `recommendation_result_selected` | A recommendation result is opened. |
| `outbound_product_clicked` | A future retailer/manufacturer product destination is opened. |

Not every event is instrumented in the first foundation commit. The schema is intentionally defined before all call sites so later instrumentation uses the same vocabulary.

## Privacy rules

Atlas does **not** intentionally store:

- names, email addresses, account identifiers, or login data;
- IP addresses as analytics dimensions;
- raw free-text search/profile input;
- exact hand measurements;
- exact DPI, sensitivity, or other unnecessary profile measurements;
- full user-agent strings.

Atlas uses a random first-party visitor ID and a random session ID for aggregate repeat/session analysis. Recommendation segmentation should use broad buckets such as small/medium/large hand size rather than exact measurements.

The client respects Global Privacy Control and Do Not Track and also exposes a local opt-out mechanism. Analytics collection should remain non-essential to core product functionality.

## Production vs demo data

The Product Analytics dashboard must show its data mode prominently:

- **PRODUCTION** means rows queried from the live `atlas_product_analytics` dataset.
- **DEMO / SAMPLE** means a checked-in synthetic fixture used to demonstrate dashboard behavior before meaningful traffic exists.

Synthetic rows must never be mixed into production aggregates and must never be described as actual Atlas usage.

## Core KPIs

Initial product KPIs:

1. **Recommendation reach rate** — sessions with `recommendation_flow_completed` / sessions with `recommendation_flow_started`.
2. **Recommendation selection rate** — sessions selecting a recommendation / sessions completing the flow.
3. **Feature adoption** — sessions using Shape Lab, Compare, Database, and Fit Engine.
4. **Product exploration depth** — median product views per engaged session.
5. **Comparison depth** — completed comparisons per session and most compared products/pairs.
6. **Shape Lab depth** — similar-shape selections and product views among Shape Lab sessions.
7. **Return-session rate** — anonymous visitors observed across more than one session, reported only in aggregate.

These are product-behavior metrics, not proof of customer satisfaction or purchase intent.

## Data quality rules

- Version the event schema.
- Reject unknown event names and malformed dimensions server-side.
- Keep string dimensions bounded.
- Keep event properties allowlisted and small.
- Do not silently rename events; introduce a schema version or explicit migration.
- Treat missing events as instrumentation gaps before treating them as user behavior.
- Record release/version metadata in a later iteration so metric changes can be tied to product changes.

## Next implementation steps

1. Finish explicit search, database-filter, compare, and outbound-click instrumentation.
2. Add broad grip/game/hand-size segment snapshots to recommendation-completion events.
3. Add an authenticated aggregate-read endpoint for the internal dashboard.
4. Build a dashboard that can switch between clearly labeled production and demo fixtures.
5. Add release/version dimensions so Product Decisions can connect behavior changes to shipped changes.
