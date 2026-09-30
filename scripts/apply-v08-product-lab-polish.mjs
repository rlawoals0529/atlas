import fs from "node:fs";

function replaceOnce(source, before, after, label) {
  if (!source.includes(before)) throw new Error(`Missing ${label} anchor`);
  return source.replace(before, after);
}

const labPath = "src/react-app/ProductLab.tsx";
let lab = fs.readFileSync(labPath, "utf8");

lab = replaceOnce(
  lab,
  '} from "../shared/validation";\n',
  '} from "../shared/validation";\nimport ProductIntelligenceExtras from "./ProductIntelligenceExtras";\n',
  "ProductIntelligenceExtras import",
);

lab = replaceOnce(
  lab,
  '    </section>\n\n    <div className="pl-grid-2"><SegmentBars title="Weight mix"',
  '    </section>\n\n    <ProductIntelligenceExtras/>\n\n    <div className="pl-grid-2"><SegmentBars title="Weight mix"',
  "Product Intelligence extras placement",
);

lab = replaceOnce(
  lab,
  '  const [defectDraft, setDefectDraft] = useState({ title: "", expected: "", actual: "", frequency: "", severity: "S3" as DefectSeverity, priority: "P2" as DefectPriority, linkedTestId: "" });',
  '  const [defectDraft, setDefectDraft] = useState({ title: "", expected: "", actual: "", frequency: "", severity: "S3" as DefectSeverity, priority: "P2" as DefectPriority, linkedTestId: "", reproSteps: "", suspectedLayer: "", regressionTestId: "", evidenceNote: "", evidenceUrl: "" });',
  "expanded defect draft",
);

lab = replaceOnce(
  lab,
  '  useEffect(() => { if (selectedMouse) setEnvironment(value => ({ ...value, pollingHz: selectedMouse.specs.maxPollingHz })); }, [selectedMouse]);',
  '  useEffect(() => { if (selectedMouse) setEnvironment(value => ({ ...value, pollingHz: selectedMouse.specs.maxPollingHz })); }, [selectedMouse]);\n  useEffect(() => { if (selectedMouse) trackAtlasEvent("validation_plan_generated", { productId: selectedMouse.id, caseCount: cases.length, automationCandidateCount: cases.filter(test => test.automationCandidate).length }); }, [selectedMouse?.id, cases.length]);',
  "validation plan analytics",
);

lab = replaceOnce(
  lab,
  '      reproductionSteps: [],\n      expectedBehavior: defectDraft.expected,',
  '      reproductionSteps: defectDraft.reproSteps.split("\\n").map(step => step.trim()).filter(Boolean),\n      expectedBehavior: defectDraft.expected,',
  "defect repro steps",
);

lab = replaceOnce(
  lab,
  '      evidence: [],\n      linkedTestId: defectDraft.linkedTestId || undefined,\n      createdAt: new Date().toISOString(),',
  '      evidence: defectDraft.evidenceNote || defectDraft.evidenceUrl ? [{ kind: "note", label: defectDraft.evidenceNote || "Evidence reference", uri: defectDraft.evidenceUrl || undefined }] : [],\n      suspectedLayer: defectDraft.suspectedLayer || undefined,\n      linkedTestId: defectDraft.linkedTestId || undefined,\n      regressionTestId: defectDraft.regressionTestId || undefined,\n      createdAt: new Date().toISOString(),',
  "defect evidence fields",
);

lab = replaceOnce(
  lab,
  '    setDefectDraft({ title: "", expected: "", actual: "", frequency: "", severity: "S3", priority: "P2", linkedTestId: "" });',
  '    setDefectDraft({ title: "", expected: "", actual: "", frequency: "", severity: "S3", priority: "P2", linkedTestId: "", reproSteps: "", suspectedLayer: "", regressionTestId: "", evidenceNote: "", evidenceUrl: "" });',
  "defect reset",
);

lab = replaceOnce(
  lab,
  '        <label>Polling Hz<input type="number" value={environment.pollingHz ?? ""} onChange={event => setEnvironment({ ...environment, pollingHz: Number(event.target.value) || undefined })}/></label>\n      </div>',
  '        <label>Polling Hz<input type="number" value={environment.pollingHz ?? ""} onChange={event => setEnvironment({ ...environment, pollingHz: Number(event.target.value) || undefined })}/></label>\n        <label>OS build<input value={environment.osBuild ?? ""} onChange={event => setEnvironment({ ...environment, osBuild: event.target.value })} placeholder="e.g. 24H2 build"/></label>\n        <label>Host / system<input value={environment.host ?? ""} onChange={event => setEnvironment({ ...environment, host: event.target.value })} placeholder="Test PC / laptop"/></label>\n        <label>USB path / hub<input value={environment.usbPath ?? ""} onChange={event => setEnvironment({ ...environment, usbPath: event.target.value })} placeholder="Direct rear I/O / hub / controller"/></label>\n        <label>DPI<input type="number" value={environment.dpi ?? ""} onChange={event => setEnvironment({ ...environment, dpi: Number(event.target.value) || undefined })}/></label>\n        <label>Configuration software<input value={environment.softwareVersion ?? ""} onChange={event => setEnvironment({ ...environment, softwareVersion: event.target.value })} placeholder="App/browser + version"/></label>\n        <label>Environment notes<input value={environment.notes ?? ""} onChange={event => setEnvironment({ ...environment, notes: event.target.value })} placeholder="Surface, receiver placement, anything material"/></label>\n      </div>',
  "expanded environment",
);

lab = replaceOnce(
  lab,
  '<label>Reproduction frequency<input value={execution.reproductionFrequency ?? ""} onChange={event => updateExecution(execution.testId, { reproductionFrequency: event.target.value })} placeholder="e.g. 7/10 attempts"/></label></article>;',
  '<label>Reproduction frequency<input value={execution.reproductionFrequency ?? ""} onChange={event => updateExecution(execution.testId, { reproductionFrequency: event.target.value })} placeholder="e.g. 7/10 attempts"/></label><label>Evidence note<input value={execution.evidence[0]?.label ?? ""} onChange={event => updateExecution(execution.testId, { evidence: event.target.value ? [{ kind: "note", label: event.target.value }] : [] })} placeholder="Screenshot/log/measurement reference"/></label></article>;',
  "execution evidence input",
);

lab = replaceOnce(
  lab,
  '<label>Frequency<input value={defectDraft.frequency} onChange={event => setDefectDraft({ ...defectDraft, frequency: event.target.value })} placeholder="Always / intermittent / 3 of 10"/></label></div><button className="pl-primary" onClick={createDefect}>Save defect locally</button>',
  '<label>Frequency<input value={defectDraft.frequency} onChange={event => setDefectDraft({ ...defectDraft, frequency: event.target.value })} placeholder="Always / intermittent / 3 of 10"/></label><label className="wide">Reproduction steps<textarea value={defectDraft.reproSteps} onChange={event => setDefectDraft({ ...defectDraft, reproSteps: event.target.value })} placeholder="One step per line. Record the real path to reproduce."/></label><label>Suspected layer<input value={defectDraft.suspectedLayer} onChange={event => setDefectDraft({ ...defectDraft, suspectedLayer: event.target.value })} placeholder="Only if evidence supports it"/></label><label>Regression test<select value={defectDraft.regressionTestId} onChange={event => setDefectDraft({ ...defectDraft, regressionTestId: event.target.value })}><option value="">Not assigned</option>{cases.map(test => <option key={test.id} value={test.id}>{test.id}</option>)}</select></label><label>Evidence note<input value={defectDraft.evidenceNote} onChange={event => setDefectDraft({ ...defectDraft, evidenceNote: event.target.value })} placeholder="What the evidence shows"/></label><label>Evidence reference<input value={defectDraft.evidenceUrl} onChange={event => setDefectDraft({ ...defectDraft, evidenceUrl: event.target.value })} placeholder="Optional local/external reference"/></label></div><button className="pl-primary" onClick={createDefect}>Save defect locally</button>',
  "expanded defect UI",
);

fs.writeFileSync(labPath, lab);

const appPath = "src/react-app/AppV05.tsx";
let app = fs.readFileSync(appPath, "utf8");
app = replaceOnce(app, '<footer className="v5-footer"><span>INPUT ATLAS / research build v{VERSION}</span>', '<footer className="v5-footer"><span>ATLAS / research build v{VERSION}</span>', "Atlas footer branding");
fs.writeFileSync(appPath, app);

console.log("Applied Atlas v0.8 Product Lab polish patch.");
