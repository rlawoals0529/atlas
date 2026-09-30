import { useMemo, useState } from "react";
import { mice } from "../shared/catalog";
import { analyzeMouseCatalog, directCompetitorsFor } from "../shared/productInsights";

const money = (value: number | null) => value == null ? "—" : `$${Math.round(value)}`;

export default function ProductIntelligenceExtras() {
  const [mouseId, setMouseId] = useState(mice[0]?.id ?? "");
  const current = useMemo(() => mice.filter(mouse => mouse.status === "current"), []);
  const selected = current.find(mouse => mouse.id === mouseId) ?? current[0];
  const insights = useMemo(() => analyzeMouseCatalog(mice), []);
  const competitors = useMemo(() => selected ? directCompetitorsFor(selected, mice, 6) : [], [selected]);

  if (!selected) return null;

  return <div className="pl-intel-extras">
    <section className="pl-card">
      <div className="pl-card-head"><div><span>POSITIONING</span><h3>Brand lineup snapshot</h3></div><small className="pl-method-label">Atlas current catalog · descriptive only</small></div>
      <div className="pl-position-table" role="table" aria-label="Brand positioning in Atlas current mouse sample">
        <div className="head" role="row"><span>Brand</span><span>Current</span><span>Median weight</span><span>Median MSRP</span><span>Wireless</span><span>4K+</span></div>
        {insights.brandPositioning.slice(0, 10).map(row => <div role="row" key={row.brand}>
          <b>{row.brand}</b><span>{row.currentCount}</span><span>{row.medianWeightG == null ? "—" : `${row.medianWeightG.toFixed(1)} g`}</span><span>{money(row.medianMsrpUsd)}</span><span>{row.wirelessSharePct}%</span><span>{row.highPollingSharePct}%</span>
        </div>)}
      </div>
      <p className="pl-caption">This describes the curated Atlas sample, not manufacturer market share or sales performance.</p>
    </section>

    <section className="pl-card">
      <div className="pl-card-head"><div><span>COMPETITION SET</span><h3>Closest product competitors</h3></div><label className="pl-inline-select">Reference mouse<select value={selected.id} onChange={event => setMouseId(event.target.value)}>{current.map(mouse => <option key={mouse.id} value={mouse.id}>{mouse.brand} {mouse.model}</option>)}</select></label></div>
      <div className="pl-competitor-list">
        {competitors.map((row, index) => <article key={row.productId}>
          <i>{String(index + 1).padStart(2, "0")}</i>
          <div><h4>{row.brand} {row.model}</h4><p>{row.rationale.join(" · ")}</p></div>
          <div className="pl-competitor-score"><b>{row.score}</b><span>ATLAS COMPETITOR FIT</span></div>
        </article>)}
      </div>
      <p className="pl-caption">The score is an Atlas-derived positioning heuristic: shape 52%, weight 18%, MSRP band 12%, polling parity 10%, wireless parity 8%. It is not sales competition, demand, or market-share evidence.</p>
    </section>
  </div>;
}
