import { Hono } from "hono";
import type { Context } from "hono";
import { allCatalog, keyboards, mice, mousepads, skates, switches } from "../shared/catalog";
import { recommendMice, recommendPads, recommendSkates } from "../shared/recommend";
import { evidenceHealth, familyFor, productSearchText } from "../shared/productMeta";
import { RELEASE } from "../shared/release";
import { findSimilarShapes, type SimilarityMode } from "../shared/shape";
import { catalogStats } from "../shared/stats";
import type { CatalogProduct, MouseProduct, UserProfile } from "../shared/types";
import { analyticsApp, type AnalyticsBindings } from "./analytics";

const app = new Hono<{ Bindings: AnalyticsBindings }>();
type AtlasContext = Context<{ Bindings: AnalyticsBindings }>;

const securityHeaders: Record<string, string> = {
  "Content-Security-Policy": "default-src 'none'; frame-ancestors 'none'; base-uri 'none'; form-action 'none'",
  "Cross-Origin-Resource-Policy": "same-origin",
  "Permissions-Policy": "camera=(), microphone=(), geolocation=(), payment=()",
  "Referrer-Policy": "no-referrer",
  "Strict-Transport-Security": "max-age=31536000; includeSubDomains",
  "X-Content-Type-Options": "nosniff",
  "X-Frame-Options": "DENY",
};

app.use("/api/*", async (c, next) => {
  await next();
  for (const [name, value] of Object.entries(securityHeaders)) c.header(name, value);
  c.header("Cache-Control", "no-store");
});

const buckets = new Map<string, { count: number; resetAt: number }>();
function enforceRateLimit(c: AtlasContext, bucket: string, limit: number, windowMs: number): Response | null {
  const now = Date.now();
  const ip = c.req.header("cf-connecting-ip") ?? "unknown";
  const key = `${bucket}:${ip}`;
  const current = buckets.get(key);
  const state = !current || current.resetAt <= now ? { count: 0, resetAt: now + windowMs } : current;
  state.count += 1;
  buckets.set(key, state);
  if (buckets.size > 2_000) {
    for (const [entryKey, entry] of buckets) if (entry.resetAt <= now) buckets.delete(entryKey);
  }
  if (state.count <= limit) return null;
  c.header("Retry-After", String(Math.max(1, Math.ceil((state.resetAt - now) / 1000))));
  return c.json({ error: "Too many requests" }, 429);
}

const humpPct = (mouse: MouseProduct) => mouse.geometry?.humpPositionPct ?? (
  mouse.specs.hump === "rear" ? 78 : mouse.specs.hump === "center-rear" ? 65 : mouse.specs.hump === "front" ? 35 : 50
);

function boundedNumber(value: unknown, min: number, max: number): value is number {
  return typeof value === "number" && Number.isFinite(value) && value >= min && value <= max;
}

function oneOf<T extends string>(value: unknown, values: readonly T[]): value is T {
  return typeof value === "string" && values.includes(value as T);
}

function validProfile(value: unknown): value is UserProfile {
  if (!value || typeof value !== "object" || Array.isArray(value)) return false;
  const p = value as Record<string, unknown>;
  const relative = p.relative;
  if (!relative || typeof relative !== "object" || Array.isArray(relative)) return false;
  const r = relative as Record<string, unknown>;
  const delta = (key: string) => boundedNumber(r[key], -2, 2) && Number.isInteger(r[key]);

  return boundedNumber(p.handLengthCm, 12, 28)
    && boundedNumber(p.handWidthCm, 5, 16)
    && oneOf(p.grip, ["palm", "relaxed-claw", "aggressive-claw", "pincer-claw", "knuckle-claw", "fingertip", "extended-fingertip", "palm-claw-hybrid"] as const)
    && oneOf(p.fingerLayout, ["1-2-2", "1-3-1-wheel", "1-3-1-m2"] as const)
    && oneOf(p.aimStyle, ["finger", "wrist", "hybrid", "arm"] as const)
    && oneOf(p.gameStyle, ["tactical-fps", "tracking-fps", "arena-fps", "battle-royale", "moba-rts", "mmo", "action", "mixed"] as const)
    && boundedNumber(p.cm360, 1, 300)
    && boundedNumber(p.dpi, 50, 100_000)
    && boundedNumber(p.displayHz, 30, 1_000)
    && oneOf(p.cpuTier, ["entry", "mid", "high"] as const)
    && oneOf(p.weightPreference, ["ultralight", "light", "medium", "heavy", "any"] as const)
    && oneOf(p.shapePreference, ["symmetrical", "ergonomic", "any"] as const)
    && oneOf(p.clickPreference, ["light", "medium", "firm", "any"] as const)
    && oneOf(p.wheelPreference, ["light", "defined", "free-spin", "any"] as const)
    && oneOf(p.extraButtons, ["minimal", "some", "many"] as const)
    && boundedNumber(p.padSpeed, 0, 100)
    && boundedNumber(p.textureTolerance, 0, 100)
    && oneOf(p.pressureHabit, ["light", "variable", "heavy"] as const)
    && oneOf(p.climate, ["dry", "normal", "humid"] as const)
    && oneOf(p.handMoisture, ["dry", "normal", "sweaty"] as const)
    && typeof p.sleeve === "boolean"
    && boundedNumber(p.budgetUsd, 0, 10_000)
    && (r.currentMouseId === undefined || (typeof r.currentMouseId === "string" && r.currentMouseId.length <= 120))
    && delta("sizeDelta") && delta("widthDelta") && delta("humpDelta") && delta("weightDelta") && delta("palmSupportDelta");
}

function queryNumber(c: AtlasContext, key: string, fallback: number, min: number, max: number): number | null {
  const raw = c.req.query(key);
  if (raw === undefined || raw === "") return fallback;
  const value = Number(raw);
  return Number.isFinite(value) && value >= min && value <= max ? value : null;
}

app.route("/api/analytics", analyticsApp);

app.get("/api/health", (c) => c.json({
  ok: true,
  build: RELEASE.label,
  productUi: RELEASE.productUi,
  dataLayer: RELEASE.dataLayer,
  researchCutoff: RELEASE.researchCutoff,
  products: allCatalog.length,
  mice: mice.length,
  pads: mousepads.length,
  skates: skates.length,
  keyboards: keyboards.length,
  switches: switches.length,
  analyticsStorage: Boolean(c.env.ANALYTICS_DB),
  averageEvidenceHealth: Math.round(allCatalog.reduce((sum, product) => sum + evidenceHealth(product).score, 0) / Math.max(1, allCatalog.length)),
}));

app.get("/api/stats", (c) => c.json({
  release: RELEASE,
  catalog: catalogStats(allCatalog),
  types: { mice: mice.length, mousepads: mousepads.length, skates: skates.length, keyboards: keyboards.length, switches: switches.length },
  capabilities: { productionAnalytics: Boolean(c.env.ANALYTICS_DB) },
}));

app.get("/api/catalog", (c) => {
  const type = c.req.query("type");
  if (type && !["mouse", "mousepad", "skate", "keyboard", "switch"].includes(type)) return c.json({ error: "Invalid product type" }, 400);
  const rawQuery = c.req.query("q") ?? "";
  if (rawQuery.length > 120) return c.json({ error: "Search query is too long" }, 400);
  const q = rawQuery.trim().toLowerCase();
  const base: CatalogProduct[] = type === "mouse" ? mice : type === "mousepad" ? mousepads : type === "skate" ? skates : type === "keyboard" ? keyboards : type === "switch" ? switches : allCatalog;
  const data = q ? base.filter((product) => productSearchText(product).includes(q)) : base;
  return c.json({ data, count: data.length });
});

app.get("/api/products/:slug", (c) => {
  const slug = c.req.param("slug");
  if (slug.length > 120 || !/^[a-z0-9-]+$/i.test(slug)) return c.json({ error: "Invalid product identifier" }, 400);
  const product = allCatalog.find((item) => item.slug === slug);
  if (!product) return c.json({ error: "Not found" }, 404);
  const family = familyFor(product.id);
  return c.json({
    product,
    evidenceHealth: evidenceHealth(product),
    family: family ? {
      ...family,
      members: family.memberIds.map(id => allCatalog.find(item => item.id === id)).filter(Boolean),
    } : null,
  });
});

app.get("/api/compare", (c) => {
  const rawIds = c.req.query("ids") ?? "";
  if (rawIds.length > 500) return c.json({ error: "Comparison request is too large" }, 400);
  const ids = rawIds.split(",").map(id => id.trim()).filter(id => /^[a-z0-9-]{1,120}$/i.test(id)).slice(0, 4);
  const data = ids.map(id => mice.find(mouse => mouse.id === id || mouse.slug === id)).filter(Boolean);
  return c.json({ data, count: data.length });
});

app.get("/api/similar/:id", (c) => {
  const id = c.req.param("id");
  if (id.length > 120 || !/^[a-z0-9-]+$/i.test(id)) return c.json({ error: "Invalid product identifier" }, 400);
  const base = mice.find(mouse => mouse.id === id || mouse.slug === id);
  if (!base) return c.json({ error: "Not found" }, 404);
  const requested = c.req.query("mode") as SimilarityMode | undefined;
  const mode: SimilarityMode = requested && ["balanced", "claw", "fingertip", "palm"].includes(requested) ? requested : "balanced";
  const data = findSimilarShapes(base, mice, mode).slice(0, 20);
  return c.json({ base, mode, data, count: data.length });
});

app.get("/api/shape", (c) => {
  const length = queryNumber(c, "length", 122, 90, 160);
  const width = queryNumber(c, "width", 59, 35, 100);
  const height = queryNumber(c, "height", 39, 20, 70);
  const hump = queryNumber(c, "hump", 55, 0, 100);
  const weight = queryNumber(c, "weight", 55, 10, 250);
  if ([length, width, height, hump, weight].some(value => value === null)) return c.json({ error: "Invalid geometry parameters" }, 400);

  const data = mice.map(mouse => {
    const gripWidth = mouse.specs.gripWidthMm ?? mouse.specs.widthMm;
    const distance = Math.sqrt(
      ((mouse.specs.lengthMm - length!) / 8) ** 2 +
      ((gripWidth - width!) / 5) ** 2 +
      ((mouse.specs.heightMm - height!) / 4) ** 2 +
      ((humpPct(mouse) - hump!) / 15) ** 2 +
      ((mouse.specs.weightG - weight!) / 15) ** 2
    );
    return { product: mouse, geometryScore: Math.round(Math.max(0, 100 - distance * 18)) };
  }).sort((a, b) => b.geometryScore - a.geometryScore);
  return c.json({ data: data.slice(0, 20), count: data.length });
});

app.post("/api/recommend", async (c) => {
  const limited = enforceRateLimit(c, "recommend", 60, 60_000);
  if (limited) return limited;

  const contentType = c.req.header("content-type") ?? "";
  if (!contentType.toLowerCase().startsWith("application/json")) return c.json({ error: "Content-Type must be application/json" }, 415);

  const raw = await c.req.text();
  if (new Blob([raw]).size > 16 * 1024) return c.json({ error: "Request body is too large" }, 413);

  let profile: unknown;
  try {
    profile = JSON.parse(raw);
  } catch {
    return c.json({ error: "Invalid JSON" }, 400);
  }
  if (!validProfile(profile)) return c.json({ error: "Invalid recommendation profile" }, 422);

  const padResults = recommendPads(profile);
  const topPad = padResults[0]?.product;
  return c.json({
    mice: recommendMice(profile).slice(0, 10),
    pads: padResults.slice(0, 10),
    skates: topPad ? recommendSkates(topPad, profile).slice(0, 10) : [],
  });
});

app.onError((error, c) => {
  console.error("Atlas Worker error", { name: error.name, message: error.message });
  return c.json({ error: "Internal server error" }, 500);
});

app.notFound((c) => c.json({ error: "Not found" }, 404));

export default app;
