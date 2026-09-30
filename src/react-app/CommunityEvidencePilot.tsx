import { useMemo, useState } from "react";
import { catalog } from "../shared/catalog";
import { communityAggregates, communityInsights, communityPilot, communityPilotProductIds } from "../shared/communityData";

const productName = (id: string) => {
  const product = catalog.find(item => item.id === id);
  return product ? `${product.brand} ${product.model}` : id;
};

const humanize = (value: string) => value.replaceAll("-", " ").replace(/\b\w/g, char => char.toUpperCase());

export default function CommunityEvidencePilot() {
  const [productId, setProductId] = useState(communityPilotProductIds[0] ?? "");
  const rows = useMemo(() => communityInsights.filter(row => row.productId === productId), [productId]);
  const aggregates = useMemo(() => communityAggregates.filter(row => row.productId === productId), [productId]);
  const sources = useMemo(() => new Set(rows.map(row => row.sourceId)).size, [rows]);
  const sourceTypes = useMemo(() => new Set(rows.map(row => row.sourceType)).size, [rows]);

  if (!productId) return null;

  return <section className="pl-card pl-community-pilot">
    <div className="pl-card-head">
      <div><span>COMMUNITY EVIDENCE PILOT</span><h3>Traceable observations, not a sentiment score</h3></div>
      <label className="pl-inline-select">Pilot product<select value={productId} onChange={event => setProductId(event.target.value)}>{communityPilotProductIds.map(id => <option key={id} value={id}>{productName(id)}</option>)}</select></label>
    </div>

    <div className="pl-community-summary">
      <article><b>{rows.length}</b><span>observations</span></article>
      <article><b>{sources}</b><span>traceable sources</span></article>
      <article><b>{aggregates.length}</b><span>attributes covered</span></article>
      <article><b>{sourceTypes}</b><span>source types</span></article>
    </div>

    <div className="pl-community-aggregate">
      {aggregates.map(row => <article key={`${row.productId}-${row.attribute}`}>
        <div><span>{humanize(row.attribute)}</span><b className={`consensus ${row.consensus}`}>{humanize(row.consensus)}</b></div>
        <p>{row.summary}</p>
        <small>{row.positive} positive · {row.mixed} mixed · {row.negative} negative · {row.neutral} neutral</small>
      </article>)}
    </div>

    <div className="pl-community-observations">
      {rows.map(row => <article key={row.id}>
        <div className="pl-community-observation-head">
          <span className={`sentiment ${row.sentiment}`}>{row.sentiment.toUpperCase()}</span>
          <b>{humanize(row.attribute)}</b>
          <em>{humanize(row.evidenceStrength)}</em>
        </div>
        <p>{row.summary}</p>
        {row.conditions && <small><strong>Conditions:</strong> {row.conditions}</small>}
        {row.disagreementNote && <small><strong>Disagreement:</strong> {row.disagreementNote}</small>}
        <a href={row.sourceUrl} target="_blank" rel="noreferrer">{row.sourceLabel} ↗</a>
      </article>)}
    </div>

    <div className="pl-community-method">
      <b>Research boundary</b>
      <p>{communityPilot.scope}</p>
      <p>{communityPilot.methodology.interpretation}</p>
      <small>Observed {communityPilot.observedAt}. {communityPilot.methodology.limitations[0]} {communityPilot.methodology.limitations[2]}</small>
    </div>
  </section>;
}
