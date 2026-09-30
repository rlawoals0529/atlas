import { useMemo } from "react";
import { mice } from "../shared/catalog";
import { summarizeAnalytics, type AtlasAnalyticsEvent } from "../shared/analytics";
import { attributeOutboundEngagement, compareShapeLabSessionDepth, segmentBehavior, topFilterUsage } from "../shared/analyticsInsights";

const display = (value: string) => value.replaceAll("-", " ").replace(/\b\w/g, char => char.toUpperCase());

export default function AnalyticsDeepDive({ events }: { events: AtlasAnalyticsEvent[] }) {
  const summary = useMemo(() => summarizeAnalytics(events), [events]);
  const depth = useMemo(() => compareShapeLabSessionDepth(events), [events]);
  const segments = useMemo(() => segmentBehavior(events), [events]);
  const attributes = useMemo(() => attributeOutboundEngagement(events, mice), [events]);
  const filters = useMemo(() => topFilterUsage(events), [events]);

  return <div className="pl-analytics-deep">
    <section className="pl-card">
      <div className="pl-card-head"><div><span>CORE KPIs</span><h3>Behavioral health signals</h3></div><small className="pl-method-label">Session-level descriptive metrics</small></div>
      <div className="pl-kpi-grid">
        <article><span>Activation</span><b>{summary.activationRatePct}%</b><small>session used a core discovery action</small></article>
        <article><span>Compare completion</span><b>{summary.compareCompletionPct}%</b><small>started → 2+ products compared</small></article>
        <article><span>Products / session</span><b>{summary.productsPerSession}</b><small>unique viewed products</small></article>
        <article><span>Engaged sessions</span><b>{summary.engagedSessionPct}%</b><small>3+ non-session events</small></article>
        <article><span>Outbound CTR</span><b>{summary.outboundCtrPct}%</b><small>view sessions with outbound click</small></article>
        <article><span>Rec abandonment</span><b>{summary.recommendationAbandonmentPct}%</b><small>explicit started → abandoned</small></article>
      </div>
      {summary.recommendationSteps.length > 0 && <div className="pl-step-row"><span>Observed recommendation steps</span>{summary.recommendationSteps.slice(0, 8).map(row => <i key={row.step}>{display(row.step)} · {row.sessions}</i>)}</div>}
    </section>

    <div className="pl-grid-2">
      <section className="pl-card">
        <div className="pl-card-head"><div><span>DEPTH</span><h3>Do Shape Lab sessions go deeper?</h3></div></div>
        <div className="pl-cohort-grid">{depth.map(row => <article key={row.cohort}>
          <b>{row.cohort}</b><span>{row.sessions} sessions</span>
          <dl><div><dt>Events / session</dt><dd>{row.eventsPerSession}</dd></div><div><dt>Product views / session</dt><dd>{row.productViewsPerSession}</dd></div><div><dt>Comparison sessions</dt><dd>{row.comparisonSessionPct}%</dd></div><div><dt>Outbound sessions</dt><dd>{row.outboundSessionPct}%</dd></div></dl>
        </article>)}</div>
        <p className="pl-caption">Descriptive cohort comparison only. Shape Lab use may reflect pre-existing user intent; this does not establish that Shape Lab caused deeper engagement.</p>
      </section>

      <section className="pl-card">
        <div className="pl-card-head"><div><span>FILTERS</span><h3>Which filters get used?</h3></div></div>
        {filters.length ? <div className="pl-table">{filters.map(row => <div key={row.filter}><span>{display(row.filter)}</span><b>{row.events} events</b><em>{row.sessions} sessions</em></div>)}</div> : <p className="pl-empty">No filter-use events have been recorded in this data mode yet.</p>}
      </section>
    </div>

    <section className="pl-card">
      <div className="pl-card-head"><div><span>SEGMENTS</span><h3>How do product-relevant segments behave?</h3></div><small className="pl-method-label">Only coarse segments already used by Atlas</small></div>
      {segments.length ? <div className="pl-segment-table">
        <div className="head"><span>Segment</span><span>Value</span><span>Sessions</span><span>Rec completion</span><span>Shape Lab</span><span>Outbound</span></div>
        {segments.map(row => <div key={`${row.segment}-${row.value}`}><span>{display(row.segment)}</span><b>{display(row.value)}</b><span>{row.sessions}</span><span>{row.recommendationCompletionPct}%</span><span>{row.shapeLabSessionPct}%</span><span>{row.outboundSessionPct}%</span></div>)}
      </div> : <p className="pl-empty">No coarse segment context is present in this data mode yet. Atlas does not infer demographic or personal attributes to fill this table.</p>}
    </section>

    <section className="pl-card">
      <div className="pl-card-head"><div><span>ATTRIBUTE ENGAGEMENT</span><h3>Which product attributes coincide with outbound engagement?</h3></div><small className="pl-method-label">Viewed-session denominator · descriptive only</small></div>
      {attributes.length ? <div className="pl-attribute-grid">{(["shape", "weight", "polling", "price"] as const).map(attribute => <div key={attribute}><h4>{display(attribute)}</h4>{attributes.filter(row => row.attribute === attribute).map(row => <article key={row.value}><span>{row.value}</span><b>{row.outboundPerViewSessionPct}%</b><small>{row.outboundSessions} outbound / {row.viewSessions} view sessions</small></article>)}</div>)}</div> : <p className="pl-empty">Not enough viewed-product events exist to calculate attribute-level engagement in this data mode.</p>}
      <p className="pl-caption">These ratios can suggest follow-up questions, but product attributes are correlated with brand, price, placement and user intent. Do not interpret them as causal drivers without an experiment or stronger design.</p>
    </section>
  </div>;
}
