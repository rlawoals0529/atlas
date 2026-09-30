import { useEffect, useMemo, useState } from "react";
import { mice } from "../shared/catalog";
import {
  buildValidationReport,
  newValidationSession,
  validationCasesFor,
  type DefectReport,
  type RegressionStatus,
  type ValidationEnvironment,
  type ValidationExecutionRecord,
  type ValidationSession,
  type ValidationStatus,
} from "../shared/validation";
import {
  buildValidationReportMarkdown,
  summarizeValidationSession,
  validationExecutionIntegrity,
} from "../shared/validationEvidence";
import "./validation-runner.css";

const SESSION_KEY = "atlas.validation.sessions.v1";
const DEFECT_KEY = "atlas.validation.defects.v1";

type RunFocus = "p0" | "all";

const safeLoad = <T,>(key: string, fallback: T): T => {
  try {
    const raw = localStorage.getItem(key);
    return raw ? JSON.parse(raw) as T : fallback;
  } catch {
    return fallback;
  }
};

const safeSave = (key: string, value: unknown) => {
  try {
    localStorage.setItem(key, JSON.stringify(value));
  } catch {
    // Local evidence capture must never crash the runner.
  }
};

const productLabel = (id: string) => {
  const product = mice.find(mouse => mouse.id === id);
  return product ? `${product.brand} ${product.model}` : id;
};

const dateLabel = (iso: string) => {
  try {
    return new Intl.DateTimeFormat(undefined, { dateStyle: "medium", timeStyle: "short" }).format(new Date(iso));
  } catch {
    return iso;
  }
};

const downloadText = (filename: string, text: string, type: string) => {
  const blob = new Blob([text], { type });
  const url = URL.createObjectURL(blob);
  const anchor = document.createElement("a");
  anchor.href = url;
  anchor.download = filename;
  anchor.click();
  URL.revokeObjectURL(url);
};

export default function ValidationRunner() {
  const [mouseId, setMouseId] = useState(mice[0]?.id ?? "");
  const selectedMouse = mice.find(mouse => mouse.id === mouseId) ?? mice[0];
  const cases = useMemo(() => selectedMouse ? validationCasesFor(selectedMouse) : [], [selectedMouse]);
  const [tester, setTester] = useState("");
  const [environment, setEnvironment] = useState<ValidationEnvironment>({
    os: "Windows 11",
    connectionMode: "",
    firmwareVersion: "",
    receiverVersion: "",
    pollingHz: selectedMouse?.specs.maxPollingHz,
  });
  const [sessions, setSessions] = useState<ValidationSession[]>(() => safeLoad<ValidationSession[]>(SESSION_KEY, []));
  const [defects] = useState<DefectReport[]>(() => safeLoad<DefectReport[]>(DEFECT_KEY, []));
  const [activeSessionId, setActiveSessionId] = useState<string | null>(null);
  const [focus, setFocus] = useState<RunFocus>("p0");

  const activeSession = sessions.find(session => session.id === activeSessionId) ?? null;
  const activeCases = useMemo(() => {
    if (!activeSession) return [];
    const caseById = new Map(cases.map(test => [test.id, test]));
    return activeSession.executions
      .map(execution => ({ execution, test: caseById.get(execution.testId) }))
      .filter(row => row.test && (focus === "all" || row.test.priority === "P0"));
  }, [activeSession, cases, focus]);
  const quality = useMemo(() => activeSession ? summarizeValidationSession(activeSession) : null, [activeSession]);

  useEffect(() => {
    if (!selectedMouse) return;
    setEnvironment(value => ({ ...value, pollingHz: selectedMouse.specs.maxPollingHz }));
  }, [selectedMouse?.id]);

  const persistSessions = (next: ValidationSession[]) => {
    setSessions(next);
    safeSave(SESSION_KEY, next);
  };

  const startSession = () => {
    if (!selectedMouse || !environment.os.trim() || !environment.connectionMode?.trim()) return;
    const session = newValidationSession(selectedMouse.id, cases, environment, tester.trim() || undefined);
    persistSessions([session, ...sessions]);
    setActiveSessionId(session.id);
    setFocus("p0");
  };

  const resumeSession = (session: ValidationSession) => {
    setMouseId(session.productId);
    setEnvironment(session.environment);
    setTester(session.tester ?? "");
    setActiveSessionId(session.id);
    setFocus("p0");
  };

  const updateExecution = (testId: string, patch: Partial<ValidationExecutionRecord>) => {
    if (!activeSession) return;
    const next = sessions.map(session => session.id !== activeSession.id ? session : {
      ...session,
      executions: session.executions.map(execution => {
        if (execution.testId !== testId) return execution;
        const nextStatus = patch.status ?? execution.status;
        const executedAt = patch.status
          ? nextStatus === "not-run" ? undefined : execution.executedAt ?? new Date().toISOString()
          : execution.executedAt;
        return { ...execution, ...patch, executedAt };
      }),
    });
    persistSessions(next);
  };

  const exportJson = () => {
    if (!activeSession) return;
    const report = buildValidationReport(activeSession, defects);
    downloadText(
      `atlas-validation-${activeSession.productId}-${activeSession.id}.json`,
      JSON.stringify(report, null, 2),
      "application/json",
    );
  };

  const exportMarkdown = () => {
    if (!activeSession) return;
    downloadText(
      `atlas-validation-${activeSession.productId}-${activeSession.id}.md`,
      buildValidationReportMarkdown(activeSession, defects, productLabel(activeSession.productId)),
      "text/markdown",
    );
  };

  if (!selectedMouse) return null;

  const coreEnvironmentReady = Boolean(environment.os.trim() && environment.connectionMode?.trim());
  const p0Count = cases.filter(test => test.priority === "P0").length;

  return (
    <div className="vr-shell">
      <header className="vr-topbar">
        <a className="vr-brand" href="#"><span>◫</span><div><b>ATLAS</b><small>VALIDATION RUNNER</small></div></a>
        <nav><a href="#product-lab">Product Lab</a><a href="#">Consumer Atlas</a></nav>
      </header>

      <main className="vr-main">
        <section className="vr-hero">
          <div>
            <span>PHYSICAL EXECUTION · EVIDENCE · REGRESSION</span>
            <h1>Turn a generated test plan into real evidence.</h1>
            <p>This runner shares the Product Lab's local validation sessions, but guides execution one case at a time. A status alone is not considered a complete record: Atlas checks for an actual observation, timestamp and core environment context before calling the execution evidence-ready.</p>
          </div>
          <aside>
            <b>Integrity rule</b>
            <p>Nothing starts as PASS. Nothing becomes portfolio-ready just because a dropdown changed.</p>
          </aside>
        </section>

        <section className="vr-card vr-config">
          <div className="vr-card-head"><div><span>01 · PREPARE</span><h2>Declare the device and environment</h2></div><small>Required before starting: OS + connection mode</small></div>
          <div className="vr-form-grid">
            <label>Mouse<select value={mouseId} onChange={event => setMouseId(event.target.value)}>{mice.map(mouse => <option key={mouse.id} value={mouse.id}>{mouse.brand} {mouse.model}</option>)}</select></label>
            <label>Tester / initials<input value={tester} onChange={event => setTester(event.target.value)} placeholder="Optional"/></label>
            <label>OS<input value={environment.os} onChange={event => setEnvironment({ ...environment, os: event.target.value })}/></label>
            <label>OS build<input value={environment.osBuild ?? ""} onChange={event => setEnvironment({ ...environment, osBuild: event.target.value })} placeholder="e.g. Windows 11 24H2"/></label>
            <label>Host / system<input value={environment.host ?? ""} onChange={event => setEnvironment({ ...environment, host: event.target.value })} placeholder="Desktop / laptop"/></label>
            <label>Connection mode<input value={environment.connectionMode ?? ""} onChange={event => setEnvironment({ ...environment, connectionMode: event.target.value })} placeholder="2.4 GHz / wired / Bluetooth"/></label>
            <label>USB path<input value={environment.usbPath ?? ""} onChange={event => setEnvironment({ ...environment, usbPath: event.target.value })} placeholder="Rear I/O / front I/O / hub"/></label>
            <label>Receiver<input value={environment.receiverType ?? ""} onChange={event => setEnvironment({ ...environment, receiverType: event.target.value })} placeholder="Standard / high-rate"/></label>
            <label>Mouse firmware<input value={environment.firmwareVersion ?? ""} onChange={event => setEnvironment({ ...environment, firmwareVersion: event.target.value })} placeholder="If known"/></label>
            <label>Receiver firmware<input value={environment.receiverVersion ?? ""} onChange={event => setEnvironment({ ...environment, receiverVersion: event.target.value })} placeholder="If applicable"/></label>
            <label>Polling Hz<input type="number" value={environment.pollingHz ?? ""} onChange={event => setEnvironment({ ...environment, pollingHz: Number(event.target.value) || undefined })}/></label>
            <label>DPI<input type="number" value={environment.dpi ?? ""} onChange={event => setEnvironment({ ...environment, dpi: Number(event.target.value) || undefined })}/></label>
            <label>Surface<input value={environment.surface ?? ""} onChange={event => setEnvironment({ ...environment, surface: event.target.value })} placeholder="Mousepad / surface"/></label>
            <label className="wide">Environment notes<input value={environment.notes ?? ""} onChange={event => setEnvironment({ ...environment, notes: event.target.value })} placeholder="Receiver placement, controller, power state, test-specific setup"/></label>
          </div>
          <div className="vr-start-row">
            <div><b>{cases.length}</b><span>planned cases</span></div>
            <div><b>{p0Count}</b><span>P0 release-path cases</span></div>
            <button disabled={!coreEnvironmentReady} onClick={startSession}>Start physical session</button>
          </div>
          {!coreEnvironmentReady && <p className="vr-warning">Record the OS and actual connection mode before creating an execution session.</p>}
        </section>

        {sessions.length > 0 && <section className="vr-card">
          <div className="vr-card-head"><div><span>SESSION HISTORY</span><h2>Resume local evidence</h2></div><small>Stored only in this browser</small></div>
          <div className="vr-history">
            {sessions.slice(0, 8).map(session => {
              const sessionQuality = summarizeValidationSession(session);
              return <button key={session.id} onClick={() => resumeSession(session)} className={session.id === activeSessionId ? "active" : ""}>
                <div><b>{productLabel(session.productId)}</b><span>{dateLabel(session.createdAt)}</span></div>
                <div><strong>{sessionQuality.executed}/{sessionQuality.planned}</strong><span>executed</span></div>
                <div><strong>{sessionQuality.incompleteExecuted}</strong><span>incomplete</span></div>
                <i>Resume →</i>
              </button>;
            })}
          </div>
        </section>}

        {activeSession && quality && <>
          <section className="vr-card vr-session-summary">
            <div className="vr-card-head"><div><span>02 · EXECUTE</span><h2>{productLabel(activeSession.productId)}</h2></div><small>{dateLabel(activeSession.createdAt)}</small></div>
            <div className="vr-metrics">
              <article><span>EXECUTED</span><b>{quality.executed}/{quality.planned}</b></article>
              <article><span>COMPLETE RECORDS</span><b>{quality.completeExecuted}</b></article>
              <article className={quality.incompleteExecuted ? "warn" : ""}><span>INCOMPLETE RECORDS</span><b>{quality.incompleteExecuted}</b></article>
              <article><span>WITH EVIDENCE REF</span><b>{quality.withEvidence}</b></article>
              <article><span>PASS / FAIL / BLOCKED</span><b>{quality.pass} / {quality.fail} / {quality.blocked}</b></article>
            </div>
            <div className="vr-run-toolbar">
              <div role="group" aria-label="Execution focus"><button className={focus === "p0" ? "active" : ""} onClick={() => setFocus("p0")}>P0 first</button><button className={focus === "all" ? "active" : ""} onClick={() => setFocus("all")}>All cases</button></div>
              <span>{focus === "p0" ? "Start with release-blocking enumeration, input and recovery paths." : "Full capability-derived plan."}</span>
            </div>
          </section>

          <section className="vr-execution-list">
            {activeCases.map(({ execution, test }) => {
              if (!test) return null;
              const integrity = validationExecutionIntegrity(execution);
              return <article className="vr-test" key={execution.testId}>
                <div className="vr-test-head">
                  <div><span>{test.id} · {test.priority} · {test.method}</span><h3>{test.title}</h3></div>
                  <em className={`status ${execution.status}`}>{execution.status.toUpperCase()}</em>
                </div>
                <p className="vr-requirement">{test.requirement}</p>
                <div className="vr-test-grid">
                  <section><b>Preconditions</b><ol>{test.preconditions.map(item => <li key={item}>{item}</li>)}</ol></section>
                  <section><b>Execution steps</b><ol>{test.steps.map(item => <li key={item}>{item}</li>)}</ol></section>
                  <section><b>Expected result</b><p>{test.expectedResult}</p><small>{test.requirementSource.note}</small></section>
                </div>
                <div className="vr-record-grid">
                  <label>Status<select value={execution.status} onChange={event => updateExecution(execution.testId, { status: event.target.value as ValidationStatus })}><option value="not-run">NOT RUN</option><option value="pass">PASS</option><option value="fail">FAIL</option><option value="blocked">BLOCKED</option></select></label>
                  <label>Reproduction frequency<input value={execution.reproductionFrequency ?? ""} onChange={event => updateExecution(execution.testId, { reproductionFrequency: event.target.value })} placeholder="e.g. 3/10 cycles"/></label>
                  <label>Regression status<select value={execution.regressionStatus} onChange={event => updateExecution(execution.testId, { regressionStatus: event.target.value as RegressionStatus })}><option value="not-applicable">Not applicable</option><option value="pending">Pending</option><option value="passed">Passed</option><option value="failed">Failed</option></select></label>
                  <label className="wide">Actual observed result<textarea value={execution.actualResult} onChange={event => updateExecution(execution.testId, { actualResult: event.target.value })} placeholder="Describe what you physically observed. Do not copy the expected result."/></label>
                  <label className="wide">Evidence reference<input value={execution.evidence[0]?.label ?? ""} onChange={event => {
                    const value = event.target.value;
                    const capturedAt = execution.evidence[0]?.capturedAt ?? new Date().toISOString();
                    updateExecution(execution.testId, { evidence: value ? [{ kind: "note", label: value, capturedAt }] : [] });
                  }} placeholder="Screenshot filename, log, measurement note, video reference"/></label>
                  <label className="wide">Execution notes<textarea value={execution.notes ?? ""} onChange={event => updateExecution(execution.testId, { notes: event.target.value })} placeholder="Cycle count, duration, configuration change, anomaly conditions"/></label>
                </div>
                {execution.status !== "not-run" && <div className={`vr-integrity ${integrity.complete ? "complete" : "incomplete"}`}>
                  <b>{integrity.complete ? "Evidence record complete" : "Execution recorded, evidence record incomplete"}</b>
                  {integrity.complete ? <span>Minimum Atlas record checks passed. Evidence attachments are still optional unless the test method requires one.</span> : <ul>{integrity.issues.map(issue => <li key={issue}>{issue}</li>)}</ul>}
                </div>}
              </article>;
            })}
          </section>

          <section className="vr-card vr-export">
            <div className="vr-card-head"><div><span>03 · REPORT</span><h2>Export the evidence you actually recorded</h2></div><small>{defects.filter(defect => defect.productId === activeSession.productId).length} local product defect(s) available to the report builder</small></div>
            <div className="vr-export-grid">
              <div><b>JSON evidence report</b><p>Structured session, environment, executions and linked defects for machine-readable portfolio or later analysis.</p><button onClick={exportJson}>Export JSON</button></div>
              <div><b>Markdown validation report</b><p>Human-readable summary with execution integrity warnings, status totals and limitations.</p><button onClick={exportMarkdown}>Export Markdown</button></div>
              <div><b>Defect workflow</b><p>Use Product Lab to create severity/priority-separated defects tied to the same local validation data.</p><a href="#product-lab">Open Product Lab →</a></div>
            </div>
            {quality.incompleteExecuted > 0 && <p className="vr-warning">{quality.incompleteExecuted} executed case(s) still have missing observation or environment details. The Markdown export will flag them rather than presenting them as complete evidence.</p>}
          </section>
        </>}
      </main>
    </div>
  );
}
