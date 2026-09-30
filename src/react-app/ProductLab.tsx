import { useEffect, useMemo, useState } from "react";
import { catalog, mice } from "../shared/catalog";
import { catalogStats } from "../shared/stats";
import { analyzeMouseCatalog, type SegmentCount } from "../shared/productInsights";
import {
  DEMO_ANALYTICS_EVENTS,
  localAnalyticsEvents,
  summarizeAnalytics,
  trackAtlasEvent,
  type AnalyticsDataMode,
  type AnalyticsSummary,
} from "../shared/analytics";
import {
  newValidationSession,
  validationCasesFor,
  type DefectPriority,
  type DefectReport,
  type DefectSeverity,
  type ValidationEnvironment,
  type ValidationExecutionRecord,
  type ValidationSession,
  type ValidationStatus,
} from "../shared/validation";
import ProductIntelligenceExtras from "./ProductIntelligenceExtras";
import AnalyticsDeepDive from "./AnalyticsDeepDive";

const SESSION_KEY = "atlas.validation.sessions.v1";
const DEFECT_KEY = "atlas.validation.defects.v1";

type Section = "overview" | "analytics" | "intelligence" | "validation" | "decisions" | "integrity";

const safeLoad = <T,>(key: string, fallback: T): T => {
  try {
    const raw = localStorage.getItem(key);
    return raw ? JSON.parse(raw) as T : fallback;
  } catch { return fallback; }
};

const safeSave = (key: string, value: unknown) => {
  try { localStorage.setItem(key, JSON.stringify(value)); } catch { /* local workspace must never break Atlas */ }
};

const productName = (id: string) => {
  const product = catalog.find(item => item.id === id);
  return product ? `${product.brand} ${product.model}` : id;
};

function SegmentBars({ title, rows }: { title: string; rows: SegmentCount[] }) {
  const max = Math.max(...rows.map(row => row.count), 1);
  return <section className="pl-card pl-segments">
    <div className="pl-card-head"><span>SEGMENT</span><h3>{title}</h3></div>
    <div className="pl-bar-list">{rows.map(row => <div className="pl-bar-row" key={row.label}>
      <div><b>{row.label}</b><span>{row.count} records · {row.sharePct}%</span></div>
      <div className="pl-bar"><i style={{ width: `${(row.count / max) * 100}%` }}/></div>
    </div>)}</div>
  </section>;
}

function AnalyticsPanel() {
  const [mode, setMode] = useState<AnalyticsDataMode>("local-real");
  const [revision, setRevision] = useState(0);
  useEffect(() => {
    const refresh = () => setRevision(value => value + 1);
    window.addEventListener("atlas:analytics", refresh);
    return () => window.removeEventListener("atlas:analytics", refresh);
  }, []);

  const events = useMemo(() => {
    void revision;
    return mode === "demo" ? DEMO_ANALYTICS_EVENTS : localAnalyticsEvents();
  }, [mode, revision]);
  const summary = useMemo<AnalyticsSummary>(() => summarizeAnalytics(events, mode), [events, mode]);

  return <div className="pl-stack">
    <section className="pl-callout">
      <div><span className={`pl-data-badge ${mode}`}>{mode === "demo" ? "DEMO / SYNTHETIC" : "REAL / THIS BROWSER"}</span><h2>Behavioral product analytics</h2><p>{mode === "demo" ? "Synthetic events exist only to exercise the dashboard. They are never presented as production usage." : "These are first-party events actually recorded in this browser. Atlas does not yet claim an all-users production aggregate."}</p></div>
      <div className="pl-toggle" role="group" aria-label="Analytics data mode"><button className={mode === "local-real" ? "active" : ""} onClick={() => setMode("local-real")}>Real local data</button><button className={mode === "demo" ? "active" : ""} onClick={() => setMode("demo")}>Demo data</button></div>
    </section>

    <section className="pl-metrics">
      <article><span>SESSIONS</span><b>{summary.sessions}</b><small>{mode === "demo" ? "synthetic" : "this browser"}</small></article>
      <article><span>EVENTS</span><b>{summary.events}</b><small>schema v1</small></article>
      <article><span>RECOMMENDATION COMPLETION</span><b>{summary.recommendationCompletionPct}%</b><small>started → completed</small></article>
      <article><span>SHAPE LAB SESSIONS</span><b>{summary.shapeLabSessionPct}%</b><small>share of sessions</small></article>
      <article><span>REPEAT VISITORS</span><b>{summary.repeatVisitorPct}%</b><small>anonymous first-party ID</small></article>
    </section>

    <div className="pl-grid-2">
      <section className="pl-card"><div className="pl-card-head"><span>FUNNEL</span><h3>Recommendation journey</h3></div><div className="pl-table">{summary.funnel.map(step => <div key={step.name}><span>{step.name}</span><b>{step.sessions}</b><em>{step.conversionFromStartPct}%</em></div>)}</div></section>
      <section className="pl-card"><div className="pl-card-head"><span>FEATURES</span><h3>What gets used</h3></div><div className="pl-table">{summary.featureUsage.map(row => <div key={row.feature}><span>{row.feature}</span><b>{row.events} events</b><em>{row.sessions} sessions</em></div>)}</div></section>
      <section className="pl-card"><div className="pl-card-head"><span>PRODUCTS</span><h3>Most viewed</h3></div><div className="pl-table">{summary.topViewedProducts.length ? summary.topViewedProducts.map(row => <div key={row.productId}><span>{productName(row.productId)}</span><b>{row.count}</b><em>views</em></div>) : <p className="pl-empty">No product-view events recorded yet.</p>}</div></section>
      <section className="pl-card"><div className="pl-card-head"><span>COMPARE</span><h3>Most compared</h3></div><div className="pl-table">{summary.topComparedProducts.length ? summary.topComparedProducts.map(row => <div key={row.productId}><span>{productName(row.productId)}</span><b>{row.count}</b><em>comparisons</em></div>) : <p className="pl-empty">No comparison-complete events recorded yet.</p>}</div></section>
    </div>

    <AnalyticsDeepDive events={events}/>

    <section className="pl-integrity-note"><b>Privacy boundary</b><p>No name, email, IP-derived identity, raw search text, exact hand measurement or fingerprint is stored by this client event model. Segmentation uses coarse product-relevant buckets. The anonymous visitor ID is random first-party storage used only for repeat-visit analysis.</p></section>
  </div>;
}

function IntelligencePanel() {
  const insights = useMemo(() => analyzeMouseCatalog(mice), []);
  const evidence = useMemo(() => catalogStats(catalog), []);
  return <div className="pl-stack">
    <section className="pl-metrics">
      <article><span>CURRENT MICE</span><b>{insights.currentCount}</b><small>Atlas sample</small></article>
      <article><span>PRICED RECORDS</span><b>{insights.pricedCount}</b><small>MSRP captured</small></article>
      <article><span>MEDIAN WEIGHT</span><b>{insights.medianWeightG == null ? "—" : `${insights.medianWeightG.toFixed(1)}g`}</b><small>current records</small></article>
      <article><span>MEDIAN MSRP</span><b>{insights.medianMsrpUsd == null ? "—" : `$${Math.round(insights.medianMsrpUsd)}`}</b><small>priced current</small></article>
      <article><span>4K+ SHARE</span><b>{insights.highPollingSharePct}%</b><small>advertised ceiling</small></article>
      <article><span>DATA HEALTH</span><b>{evidence.evidenceHealthAverage}/100</b><small>evidence average</small></article>
    </section>

    <ProductIntelligenceExtras/>

    <div className="pl-grid-2"><SegmentBars title="Weight mix" rows={insights.weightSegments}/><SegmentBars title="MSRP mix" rows={insights.priceSegments}/><SegmentBars title="Polling mix" rows={insights.pollingSegments}/><SegmentBars title="Shape mix" rows={insights.shapeSegments}/></div>

    <div className="pl-grid-2">
      <section className="pl-card"><div className="pl-card-head"><span>BRANDS</span><h3>Catalog concentration</h3></div><div className="pl-table">{insights.topBrands.map(row => <div key={row.brand}><span>{row.brand}</span><b>{row.count}</b><em>{row.sharePct}% of current sample</em></div>)}</div></section>
      <section className="pl-card"><div className="pl-card-head"><span>SPARSITY</span><h3>Shape × weight prompts</h3></div><div className="pl-table">{insights.sparseShapeWeightCells.map(row => <div key={row.label}><span>{row.label}</span><b>{row.count}</b><em>records</em></div>)}</div><p className="pl-caption">Sparse in Atlas ≠ market opportunity. Use as a research prompt only.</p></section>
    </div>

    <section className="pl-statements">{insights.statements.map(item => <article className={`pl-statement ${item.kind}`} key={item.title}><span>{item.kind.replace("-", " ").toUpperCase()}</span><h3>{item.title}</h3><p>{item.body}</p>{item.evidence && <small>{item.evidence.join(" · ")}</small>}</article>)}</section>
  </div>;
}

function ValidationPanel() {
  const [mouseId, setMouseId] = useState(mice[0]?.id ?? "");
  const selectedMouse = mice.find(mouse => mouse.id === mouseId) ?? mice[0];
  const cases = useMemo(() => selectedMouse ? validationCasesFor(selectedMouse) : [], [selectedMouse]);
  const [environment, setEnvironment] = useState<ValidationEnvironment>({ os: "Windows 11", connectionMode: "", firmwareVersion: "", receiverVersion: "", pollingHz: selectedMouse?.specs.maxPollingHz });
  const [sessions, setSessions] = useState<ValidationSession[]>(() => safeLoad<ValidationSession[]>(SESSION_KEY, []));
  const [activeSessionId, setActiveSessionId] = useState<string | null>(null);
  const [defects, setDefects] = useState<DefectReport[]>(() => safeLoad<DefectReport[]>(DEFECT_KEY, []));
  const [defectDraft, setDefectDraft] = useState({ title: "", expected: "", actual: "", frequency: "", severity: "S3" as DefectSeverity, priority: "P2" as DefectPriority, linkedTestId: "", reproSteps: "", suspectedLayer: "", regressionTestId: "", evidenceNote: "", evidenceUrl: "" });
  const activeSession = sessions.find(item => item.id === activeSessionId) ?? null;

  useEffect(() => { if (selectedMouse) setEnvironment(value => ({ ...value, pollingHz: selectedMouse.specs.maxPollingHz })); }, [selectedMouse]);
  useEffect(() => { if (selectedMouse) trackAtlasEvent("validation_plan_generated", { productId: selectedMouse.id, caseCount: cases.length, automationCandidateCount: cases.filter(test => test.automationCandidate).length }); }, [selectedMouse?.id, cases.length]);

  const startSession = () => {
    if (!selectedMouse) return;
    const session = newValidationSession(selectedMouse.id, cases, environment);
    const next = [session, ...sessions];
    setSessions(next); safeSave(SESSION_KEY, next); setActiveSessionId(session.id);
    trackAtlasEvent("validation_session_started", { productId: selectedMouse.id, plannedCaseCount: cases.length });
  };

  const updateExecution = (testId: string, patch: Partial<ValidationExecutionRecord>) => {
    if (!activeSession) return;
    const next = sessions.map(session => session.id !== activeSession.id ? session : { ...session, executions: session.executions.map(execution => execution.testId === testId ? { ...execution, ...patch, executedAt: patch.status && patch.status !== "not-run" ? new Date().toISOString() : execution.executedAt } : execution) });
    setSessions(next); safeSave(SESSION_KEY, next);
    if (patch.status) trackAtlasEvent("validation_case_recorded", { productId: activeSession.productId, testId, status: patch.status });
  };

  const createDefect = () => {
    if (!selectedMouse || !defectDraft.title || !defectDraft.actual) return;
    const defect: DefectReport = {
      id: typeof crypto !== "undefined" && "randomUUID" in crypto ? crypto.randomUUID() : `defect-${Date.now()}`,
      productId: selectedMouse.id,
      title: defectDraft.title,
      environment,
      reproductionSteps: defectDraft.reproSteps.split("\n").map(step => step.trim()).filter(Boolean),
      expectedBehavior: defectDraft.expected,
      actualBehavior: defectDraft.actual,
      frequency: defectDraft.frequency,
      severity: defectDraft.severity,
      priority: defectDraft.priority,
      evidence: defectDraft.evidenceNote || defectDraft.evidenceUrl ? [{ kind: "note", label: defectDraft.evidenceNote || "Evidence reference", uri: defectDraft.evidenceUrl || undefined }] : [],
      suspectedLayer: defectDraft.suspectedLayer || undefined,
      linkedTestId: defectDraft.linkedTestId || undefined,
      regressionTestId: defectDraft.regressionTestId || undefined,
      createdAt: new Date().toISOString(),
    };
    const next = [defect, ...defects]; setDefects(next); safeSave(DEFECT_KEY, next);
    setDefectDraft({ title: "", expected: "", actual: "", frequency: "", severity: "S3", priority: "P2", linkedTestId: "", reproSteps: "", suspectedLayer: "", regressionTestId: "", evidenceNote: "", evidenceUrl: "" });
    trackAtlasEvent("defect_created", { productId: selectedMouse.id, severity: defect.severity, linkedTestId: defect.linkedTestId });
  };

  const downloadSession = () => {
    if (!activeSession) return;
    const blob = new Blob([JSON.stringify({ generatedBy: "Atlas Validation Lab", integrityNote: "Only manually recorded executions are results. Generated cases begin NOT RUN.", session: activeSession, defects: defects.filter(defect => defect.productId === activeSession.productId) }, null, 2)], { type: "application/json" });
    const url = URL.createObjectURL(blob); const anchor = document.createElement("a"); anchor.href = url; anchor.download = `atlas-validation-${activeSession.productId}-${activeSession.id}.json`; anchor.click(); URL.revokeObjectURL(url);
  };

  if (!selectedMouse) return null;
  const p0 = cases.filter(test => test.priority === "P0").length;
  const automation = cases.filter(test => test.automationCandidate).length;

  return <div className="pl-stack">
    <section className="pl-callout"><div><span className="pl-data-badge planned">PLANNED / NOT RUN</span><h2>System Test & Validation Lab</h2><p>Atlas derives coverage from product capabilities. A generated case is never a result. PASS/FAIL only appears after you manually record a physical execution.</p></div></section>

    <section className="pl-card pl-validation-config">
      <div className="pl-card-head"><span>DEVICE UNDER TEST</span><h3>Build a real execution environment</h3></div>
      <div className="pl-form-grid">
        <label>Mouse<select value={mouseId} onChange={event => setMouseId(event.target.value)}>{mice.map(mouse => <option key={mouse.id} value={mouse.id}>{mouse.brand} {mouse.model}</option>)}</select></label>
        <label>Windows / OS<input value={environment.os} onChange={event => setEnvironment({ ...environment, os: event.target.value })}/></label>
        <label>Firmware<input value={environment.firmwareVersion ?? ""} onChange={event => setEnvironment({ ...environment, firmwareVersion: event.target.value })} placeholder="Enter from real device"/></label>
        <label>Receiver firmware<input value={environment.receiverVersion ?? ""} onChange={event => setEnvironment({ ...environment, receiverVersion: event.target.value })} placeholder="If applicable"/></label>
        <label>Connection mode<input value={environment.connectionMode ?? ""} onChange={event => setEnvironment({ ...environment, connectionMode: event.target.value })} placeholder="Wired / 2.4 GHz / Bluetooth"/></label>
        <label>Polling Hz<input type="number" value={environment.pollingHz ?? ""} onChange={event => setEnvironment({ ...environment, pollingHz: Number(event.target.value) || undefined })}/></label>
        <label>OS build<input value={environment.osBuild ?? ""} onChange={event => setEnvironment({ ...environment, osBuild: event.target.value })} placeholder="e.g. 24H2 build"/></label>
        <label>Host / system<input value={environment.host ?? ""} onChange={event => setEnvironment({ ...environment, host: event.target.value })} placeholder="Test PC / laptop"/></label>
        <label>USB path / hub<input value={environment.usbPath ?? ""} onChange={event => setEnvironment({ ...environment, usbPath: event.target.value })} placeholder="Direct rear I/O / hub / controller"/></label>
        <label>DPI<input type="number" value={environment.dpi ?? ""} onChange={event => setEnvironment({ ...environment, dpi: Number(event.target.value) || undefined })}/></label>
        <label>Configuration software<input value={environment.softwareVersion ?? ""} onChange={event => setEnvironment({ ...environment, softwareVersion: event.target.value })} placeholder="App/browser + version"/></label>
        <label>Environment notes<input value={environment.notes ?? ""} onChange={event => setEnvironment({ ...environment, notes: event.target.value })} placeholder="Surface, receiver placement, anything material"/></label>
      </div>
      <div className="pl-validation-summary"><span><b>{cases.length}</b> planned cases</span><span><b>{p0}</b> P0</span><span><b>{automation}</b> automation candidates</span><button className="pl-primary" onClick={startSession}>Start manual validation session</button></div>
    </section>

    <section className="pl-card"><div className="pl-card-head"><span>COVERAGE</span><h3>Capability-derived test plan</h3></div><div className="pl-test-list">{cases.map(test => <article key={test.id}><div className="pl-test-meta"><b>{test.id}</b><span>{test.priority}</span><span>{test.method}</span><em>NOT RUN</em></div><h4>{test.title}</h4><p>{test.requirement}</p><small>{test.rationale}</small></article>)}</div></section>

    {activeSession && <section className="pl-card"><div className="pl-card-head"><span>EXECUTION</span><h3>Manual session · {productName(activeSession.productId)}</h3><button onClick={downloadSession}>Export report JSON</button></div><div className="pl-execution-list">{activeSession.executions.map(execution => {
      const test = cases.find(item => item.id === execution.testId);
      return <article key={execution.testId}><div><b>{execution.testId}</b><span>{test?.title}</span></div><label>Status<select value={execution.status} onChange={event => updateExecution(execution.testId, { status: event.target.value as ValidationStatus })}><option value="not-run">NOT RUN</option><option value="pass">PASS</option><option value="fail">FAIL</option><option value="blocked">BLOCKED</option></select></label><label>Actual result<textarea value={execution.actualResult} onChange={event => updateExecution(execution.testId, { actualResult: event.target.value })} placeholder="Record only what you physically observed."/></label><label>Reproduction frequency<input value={execution.reproductionFrequency ?? ""} onChange={event => updateExecution(execution.testId, { reproductionFrequency: event.target.value })} placeholder="e.g. 7/10 attempts"/></label><label>Evidence note<input value={execution.evidence[0]?.label ?? ""} onChange={event => updateExecution(execution.testId, { evidence: event.target.value ? [{ kind: "note", label: event.target.value }] : [] })} placeholder="Screenshot/log/measurement reference"/></label></article>;
    })}</div></section>}

    <section className="pl-card"><div className="pl-card-head"><span>DEFECTS</span><h3>Professional bug report</h3></div><div className="pl-form-grid"><label>Title<input value={defectDraft.title} onChange={event => setDefectDraft({ ...defectDraft, title: event.target.value })}/></label><label>Linked test<select value={defectDraft.linkedTestId} onChange={event => setDefectDraft({ ...defectDraft, linkedTestId: event.target.value })}><option value="">None</option>{cases.map(test => <option key={test.id} value={test.id}>{test.id}</option>)}</select></label><label>Severity<select value={defectDraft.severity} onChange={event => setDefectDraft({ ...defectDraft, severity: event.target.value as DefectSeverity })}><option>S1</option><option>S2</option><option>S3</option><option>S4</option></select></label><label>Priority<select value={defectDraft.priority} onChange={event => setDefectDraft({ ...defectDraft, priority: event.target.value as DefectPriority })}><option>P0</option><option>P1</option><option>P2</option><option>P3</option></select></label><label className="wide">Expected behavior<textarea value={defectDraft.expected} onChange={event => setDefectDraft({ ...defectDraft, expected: event.target.value })}/></label><label className="wide">Actual behavior<textarea value={defectDraft.actual} onChange={event => setDefectDraft({ ...defectDraft, actual: event.target.value })}/></label><label>Frequency<input value={defectDraft.frequency} onChange={event => setDefectDraft({ ...defectDraft, frequency: event.target.value })} placeholder="Always / intermittent / 3 of 10"/></label><label className="wide">Reproduction steps<textarea value={defectDraft.reproSteps} onChange={event => setDefectDraft({ ...defectDraft, reproSteps: event.target.value })} placeholder="One step per line. Record the real path to reproduce."/></label><label>Suspected layer<input value={defectDraft.suspectedLayer} onChange={event => setDefectDraft({ ...defectDraft, suspectedLayer: event.target.value })} placeholder="Only if evidence supports it"/></label><label>Regression test<select value={defectDraft.regressionTestId} onChange={event => setDefectDraft({ ...defectDraft, regressionTestId: event.target.value })}><option value="">Not assigned</option>{cases.map(test => <option key={test.id} value={test.id}>{test.id}</option>)}</select></label><label>Evidence note<input value={defectDraft.evidenceNote} onChange={event => setDefectDraft({ ...defectDraft, evidenceNote: event.target.value })} placeholder="What the evidence shows"/></label><label>Evidence reference<input value={defectDraft.evidenceUrl} onChange={event => setDefectDraft({ ...defectDraft, evidenceUrl: event.target.value })} placeholder="Optional local/external reference"/></label></div><button className="pl-primary" onClick={createDefect}>Save defect locally</button>{defects.length > 0 && <div className="pl-defects">{defects.slice(0, 5).map(defect => <span key={defect.id}><b>{defect.severity} · {defect.priority}</b>{defect.title}<em>{productName(defect.productId)}</em></span>)}</div>}</section>
  </div>;
}

function DecisionsPanel() {
  const decisions = [
    ["Evidence before ranking", "Atlas does not present a universal best-mouse leaderboard; fit, evidence class and uncertainty remain visible."],
    ["Geometry is provenance-aware", "Parametric outlines are labeled as modeled geometry and are not represented as scans or independently measured profiles."],
    ["Synthetic analytics stay synthetic", "The dashboard requires an explicit data-mode label so demo events cannot be confused with real usage."],
    ["Generated tests are plans", "Capability-derived validation begins NOT RUN and cannot become PASS/FAIL without a manual execution record."],
    ["Automation is selective", "Host-visible enumeration/events/persistence are candidates; physical feel, wireless intermittency and surface behavior remain manual-first."],
  ];
  return <div className="pl-stack"><section className="pl-card"><div className="pl-card-head"><span>DECISION LOG</span><h3>What changed because of evidence and integrity constraints</h3></div><div className="pl-decision-list">{decisions.map(([title, body], index) => <article key={title}><i>{String(index + 1).padStart(2, "0")}</i><div><h4>{title}</h4><p>{body}</p></div></article>)}</div></section><section className="pl-integrity-note"><b>Product operations signal</b><p>The repo also carries the working product brief, KPI/event specification, Now/Next/Later roadmap, release criteria, feedback triage and postmortem template. They are intended to document real Atlas decisions rather than simulate a large company process.</p></section></div>;
}

function IntegrityPanel() {
  return <div className="pl-stack"><section className="pl-integrity-grid"><article><span>KNOWN</span><h3>Source-backed product facts</h3><p>Manufacturer specifications, independently measured values and dated sources retain their source class.</p></article><article><span>DERIVED</span><h3>Atlas models</h3><p>Fit scores, geometry similarity, normalized surface feel and category segments are visibly Atlas-derived rather than physical measurements.</p></article><article><span>ANECDOTAL</span><h3>Community evidence</h3><p>Future sentiment records must keep product attribute, sentiment, source, date, conditions and evidence strength instead of becoming silent facts.</p></article><article><span>UNKNOWN</span><h3>Evidence still needed</h3><p>Market share, demand, reliability and hardware PASS/FAIL claims remain unknown until supported by the appropriate traffic, customer, sales or physical test evidence.</p></article></section></div>;
}

export default function ProductLab() {
  const [section, setSection] = useState<Section>("overview");
  useEffect(() => { trackAtlasEvent("product_lab_viewed", { section }); }, [section]);
  const insights = useMemo(() => analyzeMouseCatalog(mice), []);
  const evidence = useMemo(() => catalogStats(catalog), []);

  return <div className="pl-shell">
    <header className="pl-topbar"><a className="pl-brand" href="#"><span>◫</span><div><b>ATLAS</b><small>PRODUCT LAB</small></div></a><nav>{(["overview", "analytics", "intelligence", "validation", "decisions", "integrity"] as Section[]).map(item => <button key={item} className={section === item ? "active" : ""} onClick={() => setSection(item)}>{item}</button>)}</nav><a className="pl-back" href="#">Consumer Atlas ↗</a></header>
    <main className="pl-main">
      <section className="pl-hero"><div><span className="pl-kicker">RESEARCH · ANALYTICS · OPERATIONS · VALIDATION</span><h1>One enthusiast product, operated like a real product.</h1><p>Atlas uses its own sourced catalog, behavioral instrumentation and capability model to support product decisions and hardware validation without pretending synthetic usage, anecdotal sentiment or unexecuted tests are real evidence.</p></div><div className="pl-hero-status"><span>CATALOG</span><b>{insights.currentCount} current mice</b><span>EVIDENCE</span><b>{evidence.evidenceHealthAverage}/100 health</b><span>VALIDATION</span><b>planned ≠ passed</b></div></section>

      {section === "overview" && <div className="pl-stack"><section className="pl-path-grid"><button onClick={() => setSection("analytics")}><span>01</span><h2>Product Analytics</h2><p>Funnels, feature use, product engagement and privacy-aware segmentation.</p></button><button onClick={() => setSection("intelligence")}><span>02</span><h2>Product Intelligence</h2><p>Weight, price, polling, shape and brand positioning from the sourced catalog.</p></button><button onClick={() => setSection("decisions")}><span>03</span><h2>Product Decisions</h2><p>Decision rules, operating artifacts and evidence boundaries.</p></button><button onClick={() => setSection("validation")}><span>04</span><h2>Validation Lab</h2><p>Requirements-derived cases, manual execution records and linked defects.</p></button></section><section className="pl-integrity-note"><b>Research integrity is a product feature.</b><p>Observed finding, hypothesis, evidence still needed and recommendation remain separate states. A sparse cell is not automatically an opportunity; a generated test is not automatically a PASS.</p></section></div>}
      {section === "analytics" && <AnalyticsPanel/>}
      {section === "intelligence" && <IntelligencePanel/>}
      {section === "validation" && <ValidationPanel/>}
      {section === "decisions" && <DecisionsPanel/>}
      {section === "integrity" && <IntegrityPanel/>}
    </main>
  </div>;
}
