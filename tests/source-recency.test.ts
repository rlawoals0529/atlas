import test from "node:test";
import assert from "node:assert/strict";
import type { CatalogProduct } from "../src/shared/types";
import { compareSourceCheck, latestSourceCheck, matchesSourceRecency, sourceCheckAgeDays } from "../src/shared/sourceRecency";

const product = (dates: string[]): CatalogProduct => ({
  id: "switch-test",
  slug: "switch-test",
  type: "switch",
  brand: "Test",
  model: "Switch",
  status: "current",
  summary: "Test switch",
  sources: dates.map((checkedAt, index) => ({
    id: `source-${index}`,
    label: `Source ${index}`,
    url: "https://example.com",
    kind: "manufacturer" as const,
    checkedAt,
  })),
  specs: {
    technology: "mechanical",
    feel: "linear",
    totalTravelMm: 4,
  },
  evidence: {},
} as CatalogProduct);

const now = new Date("2026-10-01T12:00:00Z");

test("source recency uses the latest checkedAt date", () => {
  const item = product(["2026-07-01", "2026-09-20", "2026-08-15"]);
  assert.equal(latestSourceCheck(item), "2026-09-20");
  assert.equal(sourceCheckAgeDays(item, now), 11);
});

test("source recency windows are maintenance signals with explicit day bounds", () => {
  assert.equal(matchesSourceRecency(product(["2026-09-15"]), "30d", now), true);
  assert.equal(matchesSourceRecency(product(["2026-08-15"]), "30d", now), false);
  assert.equal(matchesSourceRecency(product(["2026-08-15"]), "90d", now), true);
  assert.equal(matchesSourceRecency(product(["2026-06-01"]), "older-90d", now), true);
});

test("source recency sorting keeps records without dates last", () => {
  const newest = product(["2026-09-20"]);
  const older = product(["2026-07-20"]);
  const missing = product([]);
  assert.ok(compareSourceCheck(newest, older, "newest") < 0);
  assert.ok(compareSourceCheck(older, newest, "oldest") < 0);
  assert.ok(compareSourceCheck(missing, newest, "newest") > 0);
});
