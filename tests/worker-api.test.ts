import test from "node:test";
import assert from "node:assert/strict";
import app from "../src/worker/index";

const request = (path: string, init?: RequestInit) => app.request(path, init, {});

test("health exposes the live contract and security headers", async () => {
  const response = await request("/api/health");
  assert.equal(response.status, 200);
  assert.match(response.headers.get("content-type") ?? "", /^application\/json/i);
  assert.equal(response.headers.get("cache-control"), "no-store");
  assert.equal(response.headers.get("x-frame-options"), "DENY");
  assert.equal(response.headers.get("x-content-type-options"), "nosniff");
  assert.equal(response.headers.get("cross-origin-resource-policy"), "same-origin");
  assert.equal(response.headers.get("access-control-allow-origin"), null);

  const body = await response.json() as Record<string, unknown>;
  assert.equal(body.ok, true);
  assert.equal(typeof body.build, "string");
  assert.equal(typeof body.products, "number");
  assert.equal(typeof body.switches, "number");
  assert.ok((body.products as number) > 0);
  assert.ok((body.switches as number) > 0);
});

test("catalog rejects unsupported product types", async () => {
  const response = await request("/api/catalog?type=banana");
  assert.equal(response.status, 400);
  assert.deepEqual(await response.json(), { error: "Invalid product type" });
});

test("catalog bounds search length", async () => {
  const query = "x".repeat(121);
  const response = await request(`/api/catalog?q=${query}`);
  assert.equal(response.status, 400);
  assert.deepEqual(await response.json(), { error: "Search query is too long" });
});

test("switch catalog returns only switches", async () => {
  const response = await request("/api/catalog?type=switch");
  assert.equal(response.status, 200);
  const body = await response.json() as { data: Array<{ type: string }>; count: number };
  assert.equal(body.count, body.data.length);
  assert.ok(body.count > 0);
  assert.ok(body.data.every(product => product.type === "switch"));
});

test("unknown products return a stable 404 contract", async () => {
  const response = await request("/api/products/not-a-real-atlas-product");
  assert.equal(response.status, 404);
  assert.deepEqual(await response.json(), { error: "Not found" });
});

test("recommendation endpoint enforces JSON content type", async () => {
  const response = await request("/api/recommend", {
    method: "POST",
    body: "{}",
  });
  assert.equal(response.status, 415);
  assert.deepEqual(await response.json(), { error: "Content-Type must be application/json" });
});

test("recommendation endpoint distinguishes invalid JSON from invalid profiles", async () => {
  const malformed = await request("/api/recommend", {
    method: "POST",
    headers: { "content-type": "application/json" },
    body: "{",
  });
  assert.equal(malformed.status, 400);
  assert.deepEqual(await malformed.json(), { error: "Invalid JSON" });

  const invalidProfile = await request("/api/recommend", {
    method: "POST",
    headers: { "content-type": "application/json" },
    body: "{}",
  });
  assert.equal(invalidProfile.status, 422);
  assert.deepEqual(await invalidProfile.json(), { error: "Invalid recommendation profile" });
});


test("product and media identifiers are bounded before lookup/fetch", async () => {
  const invalidProduct = await request("/api/products/not_valid!");
  assert.equal(invalidProduct.status, 400);
  assert.deepEqual(await invalidProduct.json(), { error: "Invalid product identifier" });

  const invalidMedia = await request("/api/media/not_valid!");
  assert.equal(invalidMedia.status, 400);
  assert.deepEqual(await invalidMedia.json(), { error: "Invalid product identifier" });
});

test("shape search rejects out-of-range physical parameters", async () => {
  const response = await request("/api/shape?length=1000");
  assert.equal(response.status, 400);
  assert.deepEqual(await response.json(), { error: "Invalid geometry parameters" });
});

test("recommendation endpoint rejects oversized bodies before parsing", async () => {
  const response = await request("/api/recommend", {
    method: "POST",
    headers: { "content-type": "application/json" },
    body: JSON.stringify({ padding: "x".repeat(17 * 1024) }),
  });
  assert.equal(response.status, 413);
  assert.deepEqual(await response.json(), { error: "Request body is too large" });
});

test("stats reports the same total implied by type counts", async () => {
  const response = await request("/api/stats");
  assert.equal(response.status, 200);
  const body = await response.json() as {
    types: { mice: number; mousepads: number; skates: number; keyboards: number; switches: number };
    catalog: { products?: number; total?: number };
  };
  const implied = Object.values(body.types).reduce((sum, value) => sum + value, 0);
  assert.ok(implied > 0);
  const reported = body.catalog.products ?? body.catalog.total;
  if (typeof reported === "number") assert.equal(reported, implied);
});
