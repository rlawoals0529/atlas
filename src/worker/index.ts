import { Hono } from "hono";
import { catalog, mice, mousepads, skates } from "../shared/catalog";
import { recommendMice, recommendPads, recommendSkates } from "../shared/recommend";
import type { MouseProduct, UserProfile } from "../shared/types";

type Bindings = { DB: unknown };
const app = new Hono<{ Bindings: Bindings }>();

const humpPct = (mouse: MouseProduct) => mouse.geometry?.humpPositionPct ?? (
  mouse.specs.hump === "rear" ? 78 : mouse.specs.hump === "center-rear" ? 65 : mouse.specs.hump === "front" ? 35 : 50
);

app.get("/api/health", (c) => c.json({ ok: true, products: catalog.length, mice: mice.length, pads: mousepads.length, skates: skates.length, build: "v0.2" }));
app.get("/api/catalog", (c) => {
  const type = c.req.query("type");
  const q = (c.req.query("q") ?? "").trim().toLowerCase();
  const base = type === "mouse" ? mice : type === "mousepad" ? mousepads : type === "skate" ? skates : catalog;
  const data = q ? base.filter((p) => `${p.brand} ${p.model} ${p.summary} ${(p.tags ?? []).join(" ")}`.toLowerCase().includes(q)) : base;
  return c.json({ data, count: data.length });
});
app.get("/api/products/:slug", (c) => {
  const product = catalog.find((p) => p.slug === c.req.param("slug"));
  return product ? c.json(product) : c.json({ error: "Not found" }, 404);
});
app.get("/api/compare", (c) => {
  const ids = (c.req.query("ids") ?? "").split(",").filter(Boolean).slice(0, 4);
  const data = ids.map(id => mice.find(m => m.id === id || m.slug === id)).filter(Boolean);
  return c.json({ data, count: data.length });
});
app.get("/api/shape", (c) => {
  const length = Number(c.req.query("length") ?? 122);
  const width = Number(c.req.query("width") ?? 59);
  const height = Number(c.req.query("height") ?? 39);
  const hump = Number(c.req.query("hump") ?? 55);
  const weight = Number(c.req.query("weight") ?? 55);
  const data = mice.map(mouse => {
    const gripWidth = mouse.specs.gripWidthMm ?? mouse.specs.widthMm;
    const distance = Math.sqrt(
      ((mouse.specs.lengthMm-length)/8)**2 +
      ((gripWidth-width)/5)**2 +
      ((mouse.specs.heightMm-height)/4)**2 +
      ((humpPct(mouse)-hump)/15)**2 +
      ((mouse.specs.weightG-weight)/15)**2
    );
    return { product: mouse, geometryScore: Math.round(Math.max(0, 100-distance*18)) };
  }).sort((a,b)=>b.geometryScore-a.geometryScore);
  return c.json({ data: data.slice(0, 20), count: data.length });
});
app.post("/api/recommend", async (c) => {
  const profile = await c.req.json() as UserProfile;
  const padResults = recommendPads(profile);
  const topPad = padResults[0]?.product;
  return c.json({
    mice: recommendMice(profile).slice(0, 10),
    pads: padResults.slice(0, 10),
    skates: topPad ? recommendSkates(topPad, profile).slice(0, 10) : [],
  });
});

export default app;
