import { Hono } from "hono";
import type { Context } from "hono";
import { ANALYTICS_SCHEMA_VERSION, type AtlasAnalyticsEvent, type AtlasEventName } from "../shared/analytics";

type Statement = {
  bind: (...values: unknown[]) => Statement;
  run: () => Promise<unknown>;
  all: <T = Record<string, unknown>>() => Promise<{ results?: T[] }>;
  first: <T = Record<string, unknown>>() => Promise<T | null>;
};

type AnalyticsDatabase = {
  prepare: (query: string) => Statement;
  batch?: (statements: Statement[]) => Promise<unknown>;
};

export type AnalyticsBindings = {
  ANALYTICS_DB?: AnalyticsDatabase;
};

const EVENT_NAMES = new Set<AtlasEventName>([
  "session_started",
  "search_performed",
  "product_viewed",
  "filters_changed",
  "comparison_started",
  "comparison_completed",
  "shape_lab_used",
  "similarity_search_used",
  "recommendation_started",
  "recommendation_completed",
  "recommendation_result_selected",
  "outbound_product_clicked",
  "product_lab_viewed",
  "validation_plan_generated",
  "validation_session_started",
  "validation_case_recorded",
  "defect_created",
]);

const IDENTIFIER = /^[A-Za-z0-9._:-]{1,160}$/;
const PRODUCT_ID = /^[A-Za-z0-9._:-]{1,160}$/;
const ALLOWED_SEGMENT_KEYS = new Set(["handSizeBand", "grip", "gameStyle"]);
const MAX_BATCH = 25;
const MAX_BODY_BYTES = 64 * 1024;
const MAX_PROPERTIES_BYTES = 6 * 1024;
const MAX_SEGMENT_BYTES = 1024;

const limiter = new Map<string, { count: number; resetAt: number }>();

function limited(c: Context, bucket: string, limit: number, windowMs: number): Response | null {
  const now = Date.now();
  const ip = c.req.header("cf-connecting-ip") ?? "unknown";
  const key = `${bucket}:${ip}`;
  const current = limiter.get(key);
  const state = !current || current.resetAt <= now ? { count: 0, resetAt: now + windowMs } : current;
  state.count += 1;
  limiter.set(key, state);
  if (limiter.size > 2_000) for (const [entryKey, entry] of limiter) if (entry.resetAt <= now) limiter.delete(entryKey);
  if (state.count <= limit) return null;
  c.header("Retry-After", String(Math.max(1, Math.ceil((state.resetAt - now) / 1000))));
  return c.json({ error: "Too many analytics requests" }, 429);
}

const jsonSize = (value: unknown) => new Blob([JSON.stringify(value)]).size;
const isObject = (value: unknown): value is Record<string, unknown> => Boolean(value) && typeof value === "object" && !Array.isArray(value);

function validTimestamp(value: unknown): value is string {
  if (typeof value !== "string" || value.length > 40) return false;
  const time = Date.parse(value);
  if (!Number.isFinite(time)) return false;
  const skew = Math.abs(Date.now() - time);
  return skew <= 7 * 24 * 60 * 60 * 1000;
}

function validSegment(value: unknown): boolean {
  if (value === undefined) return true;
  if (!isObject(value) || jsonSize(value) > MAX_SEGMENT_BYTES) return false;
  for (const [key, item] of Object.entries(value)) {
    if (!ALLOWED_SEGMENT_KEYS.has(key)) return false;
    if (typeof item !== "string" || item.length > 64) return false;
  }
  return true;
}

function validProductIds(value: unknown): boolean {
  return Array.isArray(value) && value.length <= 8 && value.every(item => typeof item === "string" && PRODUCT_ID.test(item));
}

function validProperties(name: AtlasEventName, value: unknown): boolean {
  if (!isObject(value) || jsonSize(value) > MAX_PROPERTIES_BYTES) return false;
  const p = value;
  switch (name) {
    case "session_started": return Number.isInteger(p.visitNumber) && Number(p.visitNumber) >= 1 && Number(p.visitNumber) <= 10_000;
    case "search_performed": return Number.isInteger(p.queryLength) && Number(p.queryLength) >= 0 && Number(p.queryLength) <= 120 && ["catalog", "shape", "global"].includes(String(p.surface));
    case "product_viewed": return typeof p.productId === "string" && PRODUCT_ID.test(p.productId) && ["mouse", "mousepad", "skate"].includes(String(p.productType)) && typeof p.sourceSurface === "string" && p.sourceSurface.length <= 64;
    case "filters_changed": return typeof p.surface === "string" && p.surface.length <= 64 && Array.isArray(p.filterNames) && p.filterNames.length <= 20 && p.filterNames.every(item => typeof item === "string" && item.length <= 64) && Number.isInteger(p.activeFilterCount) && Number(p.activeFilterCount) >= 0 && Number(p.activeFilterCount) <= 30;
    case "comparison_started": return validProductIds(p.productIds);
    case "comparison_completed": return validProductIds(p.productIds) && Number.isInteger(p.comparedCount) && Number(p.comparedCount) >= 0 && Number(p.comparedCount) <= 8;
    case "shape_lab_used": return ["opened", "overlay_changed", "alignment_changed", "view_changed"].includes(String(p.action));
    case "similarity_search_used": return typeof p.referenceProductId === "string" && PRODUCT_ID.test(p.referenceProductId) && ["balanced", "claw", "fingertip", "palm"].includes(String(p.mode));
    case "recommendation_started": return typeof p.entrySurface === "string" && p.entrySurface.length <= 64;
    case "recommendation_completed": return Number.isInteger(p.resultCount) && Number(p.resultCount) >= 0 && Number(p.resultCount) <= 50 && typeof p.relativeMode === "boolean";
    case "recommendation_result_selected": return typeof p.productId === "string" && PRODUCT_ID.test(p.productId) && (p.rank === undefined || (Number.isInteger(p.rank) && Number(p.rank) >= 1 && Number(p.rank) <= 50)) && (p.fitScore === undefined || (typeof p.fitScore === "number" && Number(p.fitScore) >= 0 && Number(p.fitScore) <= 100));
    case "outbound_product_clicked": return typeof p.productId === "string" && PRODUCT_ID.test(p.productId) && ["manufacturer", "source", "retailer", "other"].includes(String(p.destinationKind));
    case "product_lab_viewed": return p.section === undefined || ["overview", "analytics", "intelligence", "validation", "decisions", "integrity"].includes(String(p.section));
    case "validation_plan_generated": return typeof p.productId === "string" && PRODUCT_ID.test(p.productId) && Number.isInteger(p.caseCount) && Number(p.caseCount) >= 0 && Number(p.caseCount) <= 200 && Number.isInteger(p.automationCandidateCount) && Number(p.automationCandidateCount) >= 0 && Number(p.automationCandidateCount) <= 200;
    case "validation_session_started": return typeof p.productId === "string" && PRODUCT_ID.test(p.productId) && Number.isInteger(p.plannedCaseCount) && Number(p.plannedCaseCount) >= 0 && Number(p.plannedCaseCount) <= 200;
    case "validation_case_recorded": return typeof p.productId === "string" && PRODUCT_ID.test(p.productId) && typeof p.testId === "string" && IDENTIFIER.test(p.testId) && ["pass", "fail", "blocked", "not-run"].includes(String(p.status));
    case "defect_created": return typeof p.productId === "string" && PRODUCT_ID.test(p.productId) && ["S1", "S2", "S3", "S4"].includes(String(p.severity)) && (p.linkedTestId === undefined || (typeof p.linkedTestId === "string" && IDENTIFIER.test(p.linkedTestId)));
  }
}

function validEvent(value: unknown): value is AtlasAnalyticsEvent {
  if (!isObject(value)) return false;
  if (value.schemaVersion !== ANALYTICS_SCHEMA_VERSION) return false;
  if (typeof value.eventName !== "string" || !EVENT_NAMES.has(value.eventName as AtlasEventName)) return false;
  if (typeof value.eventId !== "string" || !IDENTIFIER.test(value.eventId)) return false;
  if (typeof value.sessionId !== "string" || !IDENTIFIER.test(value.sessionId)) return false;
  if (typeof value.anonymousVisitorId !== "string" || !IDENTIFIER.test(value.anonymousVisitorId)) return false;
  if (!validTimestamp(value.occurredAt)) return false;
  if (typeof value.pagePath !== "string" || value.pagePath.length > 240 || !value.pagePath.startsWith("/")) return false;
  if (!validSegment(value.segment)) return false;
  return validProperties(value.eventName as AtlasEventName, value.properties);
}

export const analyticsApp = new Hono<{ Bindings: AnalyticsBindings }>();

analyticsApp.get("/availability", (c) => c.json({ available: Boolean(c.env.ANALYTICS_DB), schemaVersion: ANALYTICS_SCHEMA_VERSION }));

analyticsApp.post("/events", async (c) => {
  const rate = limited(c, "analytics-write", 120, 60_000);
  if (rate) return rate;
  const db = c.env.ANALYTICS_DB;
  if (!db) return c.json({ available: false, error: "Production analytics storage is not configured" }, 503);
  if (!(c.req.header("content-type") ?? "").toLowerCase().startsWith("application/json")) return c.json({ error: "Content-Type must be application/json" }, 415);

  const raw = await c.req.text();
  if (new Blob([raw]).size > MAX_BODY_BYTES) return c.json({ error: "Analytics batch is too large" }, 413);

  let payload: unknown;
  try { payload = JSON.parse(raw); } catch { return c.json({ error: "Invalid JSON" }, 400); }
  const events = Array.isArray(payload) ? payload : [payload];
  if (!events.length || events.length > MAX_BATCH || !events.every(validEvent)) return c.json({ error: "Invalid analytics event batch" }, 422);

  const statements = (events as AtlasAnalyticsEvent[]).map(event => db.prepare(`
    INSERT OR IGNORE INTO analytics_events
      (event_id, schema_version, event_name, occurred_at, session_id, visitor_id, page_path, segment_json, properties_json)
    VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)
  `).bind(
    event.eventId,
    event.schemaVersion,
    event.eventName,
    event.occurredAt,
    event.sessionId,
    event.anonymousVisitorId,
    event.pagePath,
    event.segment ? JSON.stringify(event.segment) : null,
    JSON.stringify(event.properties),
  ));

  if (db.batch) await db.batch(statements);
  else for (const statement of statements) await statement.run();
  return c.json({ accepted: events.length }, 202);
});

analyticsApp.get("/summary", async (c) => {
  const rate = limited(c, "analytics-summary", 60, 60_000);
  if (rate) return rate;
  const db = c.env.ANALYTICS_DB;
  if (!db) return c.json({ available: false, error: "Production analytics storage is not configured" }, 503);
  const rawDays = Number(c.req.query("days") ?? 30);
  const days = Number.isFinite(rawDays) ? Math.max(1, Math.min(90, Math.floor(rawDays))) : 30;
  const windowStart = new Date(Date.now() - days * 24 * 60 * 60 * 1000).toISOString();

  const totals = await db.prepare(`
    SELECT COUNT(*) AS events,
           COUNT(DISTINCT session_id) AS sessions,
           COUNT(DISTINCT visitor_id) AS visitors
    FROM analytics_events WHERE occurred_at >= ?
  `).bind(windowStart).first<{ events: number; sessions: number; visitors: number }>();

  const byName = await db.prepare(`
    SELECT event_name AS eventName,
           COUNT(*) AS events,
           COUNT(DISTINCT session_id) AS sessions
    FROM analytics_events
    WHERE occurred_at >= ?
    GROUP BY event_name
    ORDER BY events DESC, event_name ASC
  `).bind(windowStart).all<{ eventName: string; events: number; sessions: number }>();

  const productViews = await db.prepare(`
    SELECT json_extract(properties_json, '$.productId') AS productId, COUNT(*) AS count
    FROM analytics_events
    WHERE occurred_at >= ? AND event_name = 'product_viewed'
      AND json_extract(properties_json, '$.productId') IS NOT NULL
    GROUP BY productId ORDER BY count DESC LIMIT 10
  `).bind(windowStart).all<{ productId: string; count: number }>();

  const filterUsage = await db.prepare(`
    SELECT json_extract(value, '$') AS filterName, COUNT(*) AS count
    FROM analytics_events, json_each(analytics_events.properties_json, '$.filterNames')
    WHERE occurred_at >= ? AND event_name = 'filters_changed'
    GROUP BY filterName ORDER BY count DESC LIMIT 12
  `).bind(windowStart).all<{ filterName: string; count: number }>();

  return c.json({
    available: true,
    mode: "production-real",
    days,
    generatedAt: new Date().toISOString(),
    totals: totals ?? { events: 0, sessions: 0, visitors: 0 },
    eventUsage: byName.results ?? [],
    topViewedProducts: productViews.results ?? [],
    filterUsage: filterUsage.results ?? [],
    limitations: [
      "These are first-party Atlas events, not market-share data.",
      "Anonymous visitor IDs are random browser identifiers and do not resolve a real person.",
      "Demo/synthetic events are rejected from this production table by using a separate fixture path in the client.",
    ],
  });
});
