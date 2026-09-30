# Atlas analytics specification

## Purpose

Measure whether Atlas's real user journeys work without collecting unnecessary personal information or presenting demo data as production behavior.

## Event architecture

All events use the typed, versioned schema in `src/shared/analytics.ts`. The current schema is **v2**.

Core event groups:

- discovery: `search_performed`, `filters_changed`, `product_viewed`;
- comparison: `comparison_started`, `comparison_completed`;
- shape: `shape_lab_used`, `shape_overlay_changed`, `similarity_search_used`;
- recommendation: `recommendation_started`, `recommendation_step_completed`, `recommendation_abandoned`, `recommendation_completed`, `recommendation_result_selected`;
- downstream engagement: `outbound_product_clicked`;
- research/product lab: `product_lab_viewed`;
- validation: `validation_plan_generated`, `validation_session_started`, `validation_case_recorded`, `defect_created`;
- session: `session_started`.

## Required envelope

Every recorded event carries:

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

### Privacy controls

The browser collector does not record events when any of these apply:

- Atlas local analytics opt-out is enabled;
- Global Privacy Control is enabled;
- browser Do Not Track is `1`.

When Atlas local opt-out is selected, local event/visitor storage is cleared and the production transport queue is discarded. Browser privacy signals take precedence over the local Atlas setting.

## Data modes

### REAL / THIS BROWSER

Events actually generated while using the current browser. This is real first-party event data, but it is not an all-users production aggregate.

### DEMO / SYNTHETIC

Deterministic fixture events used to exercise dashboards and interview/demo flows when traffic is limited. The UI must label this mode explicitly at all times.

Synthetic events use recognizable `demo-` IDs and must never be delivered by the production transport or merged into real aggregates.

### PRODUCTION / REAL — optional collector

Atlas includes an optional same-origin production collector under `/api/analytics`. It is disabled unless Cloudflare D1 is explicitly bound as `ANALYTICS_DB` and migration `0002_analytics.sql` is applied.

The client checks `/api/analytics/availability` before attempting production delivery. If storage is absent, Atlas keeps the consumer experience working and does not imply site-wide measurement exists.

The collector enforces:

- a fixed event-name allowlist;
- event-specific server-side property validation;
- bounded body, batch, property and segment sizes;
- timestamp and identifier validation;
- per-IP request throttling without persisting the IP as analytics identity;
- same-origin transport;
- `INSERT OR IGNORE` event-id deduplication;
- aggregate summary endpoints separate from raw storage;
- no path for deterministic demo fixtures to be intentionally sent by the client.

The current public Product Lab intentionally reports production analytics as unavailable until a real binding exists.

## KPI definitions

All current KPI calculations are descriptive session-level signals. They are not causal claims.

### Activation rate

Unique sessions with at least one core discovery action (`product_viewed`, `comparison_started`, Shape Lab/overlay/similarity use, or `recommendation_started`) / all observed sessions.

### Recommendation completion

Unique sessions with `recommendation_completed` / unique sessions with `recommendation_started`.

### Recommendation abandonment

Unique sessions with an explicit `recommendation_abandoned` event / unique sessions with `recommendation_started`.

Abandonment is intentionally conservative: Atlas records it only after the flow started, before completion, when the page is hidden. It is not a claim about user motivation.

### Compare completion

Unique sessions with `comparison_completed` / unique sessions with `comparison_started`.

### Shape Lab adoption

Sessions with `shape_lab_used`, `shape_overlay_changed` or `similarity_search_used` / all sessions.

### Products per session

Mean number of unique product IDs viewed per observed session.

### Engaged-session rate

Sessions with at least three non-session events / all sessions. The threshold is an Atlas operating definition and should be revisited once real traffic exists.

### Outbound CTR

Sessions with an outbound product click / sessions with at least one product view. This is a session-level engagement ratio, not purchase conversion.

### Repeat-session rate

Visitors with a `session_started.visitNumber > 1` / observed anonymous visitors. It is browser-local unless a real production aggregate exists.

### Funnel steps

Primary recommendation journey:

1. `recommendation_started`
2. one or more `recommendation_step_completed`
3. either `recommendation_completed` or an explicit `recommendation_abandoned`
4. `recommendation_result_selected`
5. `outbound_product_clicked`

The dashboard counts conversion by unique session and surfaces the observed step identifiers rather than inventing a fixed questionnaire structure the current UI may not have.

## Instrumentation rule

Event names and property shapes are defined centrally. Feature code should call the typed tracker or a centralized bridge; do not invent one-off event strings inline.

The current integration uses one centralized DOM bridge for the existing large consumer component so instrumentation can be added without destabilizing it. New or substantially refactored feature modules should call the typed tracker directly. The bridge is transitional and should be retired as core surfaces are modularized.

## Statistical interpretation

- Product/segment ratios are descriptive within the observed Atlas sample.
- Attribute engagement can be confounded by brand, product placement, price and user intent.
- Shape Lab cohort depth does not establish that Shape Lab caused deeper engagement.
- Small segment counts should not be used for product decisions without additional evidence.
- Synthetic fixtures exist to exercise the dashboard, not to estimate KPI values.

## Production operations

When `ANALYTICS_DB` is enabled:

1. create a dedicated Atlas analytics D1 database;
2. apply `migrations/0002_analytics.sql`;
3. bind it as `ANALYTICS_DB` rather than repurposing unrelated storage;
4. define retention/deletion policy **before** accumulating long-term data;
5. verify `/api/analytics/availability` reports `available: true`;
6. verify production events appear only after real user actions and respect privacy controls;
7. verify deterministic demo fixtures cannot reach the production table;
8. monitor request volume and edge abuse controls;
9. continue to label Atlas analytics as first-party product behavior, not market-share evidence.

Until those steps are complete, Atlas must not claim site-wide traffic or conversion metrics.
