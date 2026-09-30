# Atlas analytics specification

## Purpose

Measure whether Atlas's real user journeys work without collecting unnecessary personal information or presenting demo data as production behavior.

## Event architecture

All events use the typed schema in `src/shared/analytics.ts`.

Core event groups:

- discovery: `search_performed`, `filters_changed`, `product_viewed`;
- comparison: `comparison_started`, `comparison_completed`;
- shape: `shape_lab_used`, `similarity_search_used`;
- recommendation: `recommendation_started`, `recommendation_completed`, `recommendation_result_selected`;
- downstream engagement: `outbound_product_clicked`;
- research/product lab: `product_lab_viewed`;
- validation: `validation_plan_generated`, `validation_session_started`, `validation_case_recorded`, `defect_created`;
- session: `session_started`.

## Required envelope

Every event carries:

- schema version;
- random event ID;
- event name;
- timestamp;
- random session ID;
- random first-party anonymous visitor ID;
- page/hash path;
- typed event properties;
- optional coarse product-relevant segment context.

## Privacy boundary

Do not collect:

- names or email addresses;
- IP-derived identity in client payloads;
- browser fingerprints;
- raw search text when query length/result count answers the product question;
- exact hand measurements for analytics segmentation;
- precise device/system identifiers unrelated to the product question;
- validation notes/evidence as behavioral analytics payloads.

Allowed coarse segmentation includes hand-size band, grip style and game style when the user has already supplied them for the product experience.

The anonymous visitor identifier is random first-party browser storage. It exists only to estimate repeat use. It is not intended to identify a person across sites or devices.

## Data modes

### REAL / THIS BROWSER
Events actually generated while using the current browser. This is real first-party event data, but it is not an all-users production aggregate.

### DEMO / SYNTHETIC
Deterministic fixture events used to exercise dashboards and interview/demo flows when traffic is limited. The UI must label this mode explicitly at all times.

Synthetic events must never be merged into real aggregates.

## Funnel definitions

Primary recommendation funnel:

1. `recommendation_started`
2. `recommendation_completed`
3. `recommendation_result_selected`
4. `outbound_product_clicked`

Each step is counted by unique session for conversion reporting.

Other useful metrics:

- Shape Lab adoption = sessions with `shape_lab_used` / all sessions;
- repeat visitor rate = visitors with a `session_started.visitNumber > 1` / visitors;
- product engagement = views, comparisons, result selections and outbound clicks by product;
- filter usage = count and session reach of filter fields;
- segment behavior = funnel/feature metrics by coarse hand-size/grip/game-style context.

## Instrumentation rule

Event names and property shapes are defined centrally. Feature code should call the typed tracker or a centralized bridge; do not invent one-off event strings inline.

The initial integration uses a centralized DOM bridge for the existing large consumer component so instrumentation can be added without destabilizing it. New or substantially refactored components should call the typed tracker directly. The bridge should be retired as core surfaces are modularized.

## Future production collector

An aggregated production collector should be first-party and same-origin, with:

- bounded request size and batch size;
- server-side schema validation;
- rate limiting;
- retention policy;
- no raw IP persistence;
- no demo events accepted into production tables;
- aggregate endpoints separated from raw-event access;
- explicit data-source label in the dashboard.

Until that collector is deployed, Atlas must not claim site-wide traffic or conversion metrics.
