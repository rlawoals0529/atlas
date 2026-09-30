import { useMemo, useState } from "react";
import { catalog, mice } from "../shared/catalog";
import { analyzeMouseCatalog, type SegmentCount } from "../shared/productInsights";
import { catalogStats } from "../shared/stats";
import { validationCasesFor } from "../shared/validation";

function SegmentBars({ title, rows }: { title: string; rows: SegmentCount[] }) {
  const max = Math.max(...rows.map(row => row.count), 1);
  return <section className="pv-panel pv-segments">
    <div className="pv-section-head"><span>SEGMENT</span><h2>{title}</h2></div>
    <div className="pv-bar-list">{rows.map(row => <div className="pv-bar-row" key={row.label}>
      <div><b>{row.label}</b><span>{row.count} products · {row.sharePct}%</span></div>
      <div className="pv-bar"><i style={{ width: `${(row.count / max) * 100}%` }}/></div>
    </div>)}</div>
  </section>;
}

function ProductLab() {
  const insights = useMemo(() => analyzeMouseCatalog(mice), []);
  const evidence = useMemo(() => catalogStats(catalog), []);
  const [mouseId, setMouseId] = useState(mice[0]?.id ?? "");
  const selectedMouse = mice.find(mouse => mouse.id === mouseId) ?? mice[0];
  const cases = useMemo(() => selectedMouse ? validationCasesFor(selectedMouse) : [], [selectedMouse]);
  const p0 = cases.filter(item => item.priority === "P0").length;
  const automation = cases.filter(item => item.automationCandidate).length;

  return <div className="pv-shell">
    <header className="pv-topbar">
      <div><span className="pv-logo">IA</span><div><b>INPUT ATLAS</b><small>RESEARCH LAB</small></div></div>
      <nav><a href="#lab-product-intelligence">Product intelligence</a><a href="#lab-validation">System validation</a><a href="#">Back to Atlas</a></nav>
    </header>

    <main className="pv-main">
      <section className="pv-hero">
        <div><span className="pv-kicker">PRODUCT ANALYTICS × SYSTEM TEST</span><h1>Turn enthusiast data into <em>decisions and test plans.</em></h1><p>This lab treats the Atlas catalog as a product-analysis dataset and converts mouse specifications into a structured system-validation protocol. It deliberately separates observed data, hypotheses and planned tests so the portfolio does not fabricate market share or test results.</p></div>
        <div className="pv-hero-card">
          <span>PORTFOLIO SIGNAL</span>
          <b>Research → analysis → decision framing</b>
          <b>Requirements → risk → validation coverage</b>
          <b>Evidence quality → explicit limitations</b>
        </div>
      </section>

      <section className="pv-metrics" id="lab-product-intelligence">
        <article><span>CURRENT MICE</span><b>{insights.currentCount}</b><small>Atlas catalog</small></article>
        <article><span>MEDIAN WEIGHT</span><b>{insights.medianWeightG == null ? "—" : `${insights.medianWeightG.toFixed(1)} g`}</b><small>current records</small></article>
        <article><span>MEDIAN MSRP</span><b>{insights.medianMsrpUsd == null ? "—" : `$${Math.round(insights.medianMsrpUsd)}`}</b><small>priced current records</small></article>
        <article><span>4K+ POLLING</span><b>{insights.highPollingSharePct}%</b><small>current records</small></article>
        <article><span>WIRELESS</span><b>{insights.wirelessSharePct}%</b><small>current records</small></article>
        <article><span>DATA HEALTH</span><b>{evidence.evidenceHealthAverage}/100</b><small>catalog evidence average</small></article>
      </section>

      <section className="pv-intro">
        <div><span className="pv-kicker">01 / PRODUCT INTELLIGENCE</span><h2>Describe the category before recommending what to build.</h2></div>
        <p>These distributions describe the curated Atlas dataset, not total market share. Sparse cells are research hypotheses that should be validated with sales, customer and competitor data before they are called market opportunities.</p>
      </section>

      <div className="pv-grid-2">
        <SegmentBars title="Weight mix" rows={insights.weightSegments}/>
        <SegmentBars title="MSRP mix" rows={insights.priceSegments}/>
        <SegmentBars title="Polling mix" rows={insights.pollingSegments}/>
        <SegmentBars title="Shape mix" rows={insights.shapeSegments}/>
      </div>

      <section className="pv-grid-2 pv-analysis-row">
        <article className="pv-panel pv-memo">
          <div className="pv-section-head"><span>ANALYST</span><h2>Questions this dataset can support</h2></div>
          <ul>
            <li><b>Pricing:</b> do higher-polling products carry a meaningful MSRP premium in the catalog?</li>
            <li><b>Portfolio:</b> which shape and weight combinations are densely represented versus sparse?</li>
            <li><b>Positioning:</b> how do brands cluster around weight, price and performance specifications?</li>
            <li><b>Research gap:</b> which product decisions require customer sentiment or sales data that specifications cannot answer?</li>
          </ul>
        </article>
        <article className="pv-panel pv-memo">
          <div className="pv-section-head"><span>FINDINGS</span><h2>Current decision framing</h2></div>
          <div className="pv-finding"><span>4K+ price relationship</span><b>{insights.highPollingPriceDeltaUsd == null ? "Insufficient priced groups" : `${insights.highPollingPriceDeltaUsd >= 0 ? "+" : ""}$${insights.highPollingPriceDeltaUsd} average MSRP`}</b><p>This is an association inside the Atlas sample, not evidence that polling rate causes price.</p></div>
          <div className="pv-finding"><span>Sparse shape × weight cells</span><b>{insights.sparseShapeWeightCells.map(cell => `${cell.label} (${cell.count})`).join(" · ")}</b><p>Treat these as candidates for deeper competitive and customer research, not automatic product gaps.</p></div>
        </article>
      </section>

      <section className="pv-panel pv-brand-table">
        <div className="pv-section-head"><span>COVERAGE</span><h2>Most represented brands in the current catalog</h2></div>
        <div>{insights.topBrands.map((row, index) => <span key={row.brand}><i>{String(index + 1).padStart(2, "0")}</i><b>{row.brand}</b><em>{row.count} current mice</em></span>)}</div>
      </section>

      <section className="pv-intro" id="lab-validation">
        <div><span className="pv-kicker">02 / SYSTEM TEST & VALIDATION</span><h2>Translate product claims into release-oriented test coverage.</h2></div>
        <p>The cases below are a reusable validation plan generated from catalog specifications. They are intentionally marked planned: Atlas does not claim a test passed until it has actually been executed on hardware with an identified environment and evidence.</p>
      </section>

      {selectedMouse && <>
        <section className="pv-panel pv-validation-head">
          <label>Device under test<select value={selectedMouse.id} onChange={event => setMouseId(event.target.value)}>{mice.map(mouse => <option value={mouse.id} key={mouse.id}>{mouse.brand} {mouse.model}</option>)}</select></label>
          <div><span>TEST CASES<b>{cases.length}</b></span><span>RELEASE BLOCKING<b>{p0}</b></span><span>AUTOMATION CANDIDATES<b>{automation}</b></span><span>MAX POLLING<b>{selectedMouse.specs.maxPollingHz >= 1000 ? `${selectedMouse.specs.maxPollingHz / 1000}K` : selectedMouse.specs.maxPollingHz}</b></span></div>
        </section>

        <section className="pv-test-table pv-panel">
          <div className="pv-test-header"><span>ID / PRIORITY</span><span>AREA / METHOD</span><span>TEST & PROCEDURE</span><span>EXPECTED / RATIONALE</span></div>
          {cases.map(test => <article className="pv-test-row" key={test.id}>
            <div><b>{test.id}</b><span className={`pv-priority ${test.priority.toLowerCase()}`}>{test.priority}</span><small>PLANNED</small></div>
            <div><b>{test.area}</b><span>{test.method}</span><small>{test.automationCandidate ? "automation candidate" : "manual / exploratory"}</small></div>
            <div><b>{test.title}</b><p>{test.procedure}</p></div>
            <div><b>Expected</b><p>{test.expected}</p><small>{test.rationale}</small></div>
          </article>)}
        </section>
      </>}

      <section className="pv-grid-3 pv-practice">
        <article className="pv-panel"><span>TEST DESIGN</span><h3>Risk first</h3><p>P0 cases protect enumeration, input and wireless recovery. Lower-priority coverage expands into configuration, compatibility, power and exploratory sensor behavior.</p></article>
        <article className="pv-panel"><span>TRACEABILITY</span><h3>Claims become checks</h3><p>Polling ceiling, connection modes, onboard profiles and power capabilities change the generated protocol instead of living only as marketing specifications.</p></article>
        <article className="pv-panel"><span>QUALITY</span><h3>No fabricated passes</h3><p>A professional test portfolio should distinguish a designed case from an executed result and attach environment, reproduction frequency and evidence when failures are found.</p></article>
      </section>
    </main>

    <footer className="pv-footer"><span>INPUT ATLAS / RESEARCH LAB</span><span>PRODUCT INTELLIGENCE + SYSTEM VALIDATION</span><a href="#">RETURN TO MAIN EXPERIENCE</a></footer>
  </div>;
}

export default ProductLab;
