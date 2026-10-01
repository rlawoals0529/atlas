# Atlas Worker API

Atlas exposes a small same-origin JSON API from the production Cloudflare Worker.

Base URL:

```text
https://atlas.rlawoals0529.workers.dev
```

The API is intentionally read-mostly. Product data comes from the same canonical catalog shards used by the React application.

## Common behavior

- JSON endpoints return `application/json`.
- API responses include Atlas security headers.
- Read-only API responses are currently `Cache-Control: no-store`, except proxied product media.
- Identifiers are bounded to lowercase/uppercase ASCII letters, digits and hyphens where applicable.
- Atlas does not enable wildcard CORS.
- Error responses use a small stable shape:

```json
{ "error": "Human-readable error" }
```

Some errors include an additional field such as `missing`.

## GET /api/health

Returns release and catalog-health information used by deployment verification.

Example:

```bash
curl https://atlas.rlawoals0529.workers.dev/api/health
```

The response includes:

- release/build metadata;
- canonical product counts;
- optional analytics-storage availability;
- average Atlas evidence-health score.

The evidence-health value describes catalog evidence coverage. It is not a product-quality score.

## GET /api/stats

Returns aggregate catalog statistics and release metadata.

```bash
curl https://atlas.rlawoals0529.workers.dev/api/stats
```

## GET /api/catalog

Returns canonical catalog records.

Optional query parameters:

- `type`: `mouse`, `mousepad`, `skate`, `keyboard`, or `switch`;
- `q`: case-insensitive search text, maximum 120 characters.

Examples:

```bash
curl "https://atlas.rlawoals0529.workers.dev/api/catalog?type=switch"
curl "https://atlas.rlawoals0529.workers.dev/api/catalog?q=magnetic"
```

Response:

```json
{
  "data": [],
  "count": 0
}
```

## GET /api/products/:slug

Returns one canonical product plus its Atlas evidence-health summary and known family/revision context.

```bash
curl "https://atlas.rlawoals0529.workers.dev/api/products/gateron-magnetic-jade"
```

Unknown products return `404`.

## GET /api/compare

Returns up to four canonical records for a same-type comparison.

Query:

```text
/api/compare?ids=<id-or-slug>,<id-or-slug>
```

Supported product types:

- mouse;
- mousepad;
- skate;
- keyboard;
- switch.

Rules:

- one to four identifiers;
- duplicate identifiers are deduplicated while preserving order;
- every identifier must resolve;
- all resolved products must share a product type.

A mixed-type request returns `422` rather than silently dropping products.

Example:

```bash
curl "https://atlas.rlawoals0529.workers.dev/api/compare?ids=switch-gateron-magnetic-jade,switch-wooting-lekker-l60-v2"
```

Response:

```json
{
  "type": "switch",
  "data": [],
  "count": 2
}
```

## GET /api/similar/:id

Returns mouse-shape similarity results for a canonical mouse.

Optional `mode`:

- `balanced`;
- `claw`;
- `fingertip`;
- `palm`.

The similarity model is Atlas-derived geometry, not an independent physical measurement.

## GET /api/shape

Searches the mouse catalog against a target geometry.

Optional bounded parameters:

- `length`;
- `width`;
- `height`;
- `hump`;
- `weight`.

The endpoint returns Atlas-derived geometry scores. They are not universal fit rankings.

## POST /api/recommend

Returns mouse, mousepad and skate recommendations from a complete Atlas `UserProfile`.

Requirements:

- `Content-Type: application/json`;
- body size at most 16 KiB;
- every profile field must pass the same bounds used by the product model.

The endpoint is rate limited per Worker isolate/client address. Recommendation scores are Atlas-derived model outputs, not measured product performance.

## GET /api/media/:id

Returns an attributed product image for a canonical product.

Behavior:

- resolves pinned Atlas media metadata first;
- otherwise uses an official manufacturer source when the catalog permits fallback;
- validates HTTPS targets and redirect hops;
- rejects private/link-local upstream targets;
- bounds upstream HTML and image bodies;
- caches successful media responses in the browser/edge response contract.

The response includes `X-Atlas-Media-Source` with the source hostname.

## Analytics API

Atlas also mounts optional analytics endpoints under `/api/analytics`.

They are only useful when the production Worker has a real `ANALYTICS_DB` D1 binding. Atlas remains fully functional without that binding.

See [product analytics specification](product/ANALYTICS_SPEC.md).

## Data provenance

The API does not create a second source of product truth.

Canonical records come from:

```text
data/catalog*.json
```

Manufacturer claims, independent evidence, community observations and Atlas-derived/modelled values remain distinct in the underlying data model.

See:

- [Architecture](ARCHITECTURE.md)
- [Data dictionary](DATA_DICTIONARY.md)
- [Community evidence protocol](product/COMMUNITY_EVIDENCE_PROTOCOL.md)
