import { useEffect, useState } from "react";

type ProductionSummary = {
  available: true;
  mode: "production-real";
  days: number;
  generatedAt: string;
  totals: { events: number; sessions: number; visitors: number };
  eventUsage: Array<{ eventName: string; events: number; sessions: number }>;
  topViewedProducts: Array<{ productId: string; count: number }>;
  filterUsage: Array<{ filterName: string; count: number }>;
  limitations: string[];
};

type State =
  | { kind: "loading" }
  | { kind: "unavailable" }
  | { kind: "error" }
  | { kind: "ready"; data: ProductionSummary };

const label = (name: string) => name.replaceAll("_", " ").replace(/\b\w/g, char => char.toUpperCase());

export default function ProductionAnalyticsStatus() {
  const [state, setState] = useState<State>({ kind: "loading" });

  useEffect(() => {
    let cancelled = false;
    const load = async () => {
      try {
        const availability = await fetch("/api/analytics/availability", { headers: { Accept: "application/json" }, credentials: "same-origin" });
        if (!availability.ok) throw new Error("availability failed");
        const status = await availability.json() as { available?: boolean };
        if (!status.available) {
          if (!cancelled) setState({ kind: "unavailable" });
          return;
        }
        const response = await fetch("/api/analytics/summary?days=30", { headers: { Accept: "application/json" }, credentials: "same-origin" });
        if (!response.ok) throw new Error("summary failed");
        const data = await response.json() as ProductionSummary;
        if (!cancelled) setState({ kind: "ready", data });
      } catch {
        if (!cancelled) setState({ kind: "error" });
      }
    };
    void load();
    return () => { cancelled = true; };
  }, []);

  if (state.kind === "loading") return <section className="pl-production-status"><span className="pl-data-badge">PRODUCTION</span><p>Checking whether a real production analytics store is configured…</p></section>;
  if (state.kind === "unavailable") return <section className="pl-production-status unavailable"><span className="pl-data-badge">PRODUCTION / NOT CONFIGURED</span><div><b>No site-wide aggregate is being claimed.</b><p>Atlas is currently using real browser-local events plus the explicitly synthetic demo fixture. Bind a real `ANALYTICS_DB` before production metrics become available.</p></div></section>;
  if (state.kind === "error") return <section className="pl-production-status unavailable"><span className="pl-data-badge">PRODUCTION / UNAVAILABLE</span><div><b>The production aggregate could not be verified.</b><p>Atlas will not substitute local or demo numbers for a failed production source.</p></div></section>;

  const data = state.data;
  return <section className="pl-production-status ready">
    <div className="pl-production-head"><span className="pl-data-badge local-real">PRODUCTION / REAL</span><div><h3>Last {data.days} days</h3><p>First-party Atlas events stored by the configured production collector.</p></div></div>
    <div className="pl-production-metrics"><article><b>{data.totals.sessions}</b><span>sessions</span></article><article><b>{data.totals.visitors}</b><span>anonymous visitors</span></article><article><b>{data.totals.events}</b><span>events</span></article></div>
    <div className="pl-grid-2">
      <div><h4>Event reach</h4><div className="pl-table">{data.eventUsage.slice(0, 8).map(row => <div key={row.eventName}><span>{label(row.eventName)}</span><b>{row.events}</b><em>{row.sessions} sessions</em></div>)}</div></div>
      <div><h4>Top viewed products</h4><div className="pl-table">{data.topViewedProducts.length ? data.topViewedProducts.map(row => <div key={row.productId}><span>{row.productId}</span><b>{row.count}</b><em>views</em></div>) : <p className="pl-empty">No product views in this window.</p>}</div></div>
    </div>
    <p className="pl-caption">{data.limitations.join(" ")}</p>
  </section>;
}
