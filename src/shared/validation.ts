import type { MouseProduct } from "./types";

export type ValidationArea = "Connectivity" | "Input" | "Sensor & polling" | "Power" | "Configuration" | "Compatibility" | "Reliability";
export type ValidationMethod = "functional" | "regression" | "compatibility" | "boundary" | "exploratory";
export type ValidationPriority = "P0" | "P1" | "P2";
export type ValidationStatus = "not-run" | "pass" | "fail" | "blocked";
export type RegressionStatus = "not-applicable" | "pending" | "passed" | "failed";
export type AutomationSuitability = "good-candidate" | "partial" | "manual-first";
export type DefectSeverity = "S1" | "S2" | "S3" | "S4";
export type DefectPriority = "P0" | "P1" | "P2" | "P3";
export type DefectStatus = "open" | "triaged" | "fixed" | "cannot-reproduce" | "wont-fix" | "closed";

export interface RequirementSource {
  kind: "catalog-field" | "manufacturer-source" | "independent-source" | "test-policy" | "derived-capability";
  field?: string;
  sourceIds: string[];
  note: string;
}

export interface ValidationEnvironment {
  os: string;
  osBuild?: string;
  host?: string;
  cpuSystem?: string;
  usbPath?: string;
  usbController?: string;
  connectionMode?: string;
  receiverType?: string;
  firmwareVersion?: string;
  receiverVersion?: string;
  softwareVersion?: string;
  pollingHz?: number;
  dpi?: number;
  surface?: string;
  powerState?: string;
  notes?: string;
}

export interface ValidationCase {
  id: string;
  requirement: string;
  requirementSource: RequirementSource;
  productId: string;
  area: ValidationArea;
  method: ValidationMethod;
  priority: ValidationPriority;
  title: string;
  automationSuitability: AutomationSuitability;
  automationCandidate: boolean;
  environmentRequirements: string[];
  preconditions: string[];
  steps: string[];
  expectedResult: string;
  rationale: string;
  status: "not-run";
  notes?: string;
}

export interface ValidationEvidence {
  kind: "note" | "screenshot" | "video" | "log" | "measurement";
  label: string;
  uri?: string;
  capturedAt?: string;
}

export interface ValidationExecutionRecord {
  testId: string;
  productId: string;
  environment: ValidationEnvironment;
  status: ValidationStatus;
  actualResult: string;
  reproductionFrequency?: string;
  evidence: ValidationEvidence[];
  linkedDefectId?: string;
  regressionStatus: RegressionStatus;
  executedAt?: string;
  tester?: string;
  notes?: string;
}

export interface ValidationSession {
  id: string;
  productId: string;
  createdAt: string;
  environment: ValidationEnvironment;
  plannedTestIds: string[];
  executions: ValidationExecutionRecord[];
  tester?: string;
  notes?: string;
}

export interface DefectReport {
  id: string;
  productId: string;
  title: string;
  environment: ValidationEnvironment;
  firmwareSoftwareVersion?: string;
  reproductionSteps: string[];
  expectedBehavior: string;
  actualBehavior: string;
  frequency: string;
  severity: DefectSeverity;
  priority: DefectPriority;
  evidence: ValidationEvidence[];
  suspectedLayer?: string;
  linkedTestId?: string;
  regressionTestId?: string;
  status?: DefectStatus;
  resolution?: string;
  fixBuild?: string;
  createdAt: string;
  updatedAt?: string;
}

export interface ValidationReport {
  generatedBy: "Atlas Validation Lab";
  generatedAt: string;
  integrityNote: string;
  productId: string;
  sessionId: string;
  environment: ValidationEnvironment;
  totals: { planned: number; pass: number; fail: number; blocked: number; notRun: number };
  executions: ValidationExecutionRecord[];
  defects: DefectReport[];
  limitations: string[];
}

const planned = (mouse: MouseProduct, value: Omit<ValidationCase, "productId" | "status">): ValidationCase => ({ ...value, productId: mouse.id, status: "not-run" });
const automation = (suitability: AutomationSuitability) => ({ automationSuitability: suitability, automationCandidate: suitability === "good-candidate" });
const sourceIdsFor = (mouse: MouseProduct, field: string) => mouse.evidence[field]?.sourceIds ?? [];
const catalogSource = (mouse: MouseProduct, field: string, note: string): RequirementSource => ({ kind: "catalog-field", field, sourceIds: sourceIdsFor(mouse, field), note });
const policySource = (note: string): RequirementSource => ({ kind: "test-policy", sourceIds: [], note });

export function validationCasesFor(mouse: MouseProduct): ValidationCase[] {
  const connectivity = mouse.specs.connectivity.join(", ") || "supported connection modes";
  const wireless = mouse.specs.connectivity.some(item => /wireless|2\.4|bluetooth/i.test(item));
  const bluetooth = mouse.specs.connectivity.some(item => /bluetooth/i.test(item));
  const hasBattery = mouse.specs.battery1kHours != null || mouse.specs.battery4kHours != null || mouse.specs.battery8kHours != null;
  const hasProfiles = (mouse.specs.onboardProfiles ?? 0) > 0;
  const multipleModes = mouse.specs.connectivity.length > 1;
  const configurationMode = mouse.specs.webDriver ? "web configuration" : mouse.specs.driverless ? "driverless configuration" : "vendor configuration software";

  const cases: ValidationCase[] = [
    planned(mouse, {
      id: "SYS-CONN-001",
      requirement: `Device supports advertised connection modes: ${connectivity}.`,
      requirementSource: catalogSource(mouse, "specs.connectivity", "Advertised connection capability from the Atlas product record; source IDs are retained when the field has explicit evidence."),
      area: "Connectivity", method: "functional", priority: "P0", title: "Enumeration and basic input in every supported mode",
      ...automation("good-candidate"),
      environmentRequirements: ["Record host/OS build", "Record connection mode", "Record receiver/cable path"],
      preconditions: ["Supported host is available", "Device has sufficient power", "Required receiver/cable is available"],
      steps: ["Connect using each advertised mode", "Confirm host enumeration", "Move pointer", "Exercise primary buttons and wheel", "Unplug/replug or disconnect/reconnect where applicable"],
      expectedResult: "The device enumerates and accepts pointer/button input in every advertised mode without undocumented manual recovery.",
      rationale: "Enumeration and basic input are release-blocking system paths and expose host/firmware integration failures.",
    }),
    planned(mouse, {
      id: "SYS-CONN-002",
      requirement: "A previously usable connection returns to an operational state after a physical disconnect/reconnect cycle.",
      requirementSource: policySource("Derived system requirement for connection recovery; execution must be limited to connection modes actually supported by the device."),
      area: "Connectivity", method: "regression", priority: "P0", title: "Repeated unplug/replug and reconnect recovery",
      ...automation("partial"),
      environmentRequirements: ["Record active connection mode", "Record USB/receiver path", "Choose a finite cycle count before execution"],
      preconditions: ["Device is functional in the selected mode", "Cycle count is recorded before execution"],
      steps: ["Confirm baseline input", "Disconnect the cable/receiver or otherwise break the active supported connection", "Reconnect", "Confirm enumeration and input", "Repeat for the declared cycle count", "Record any failure and the exact cycle"],
      expectedResult: "Every executed cycle returns to normal input without requiring undocumented re-pairing, reboot or configuration reset.",
      rationale: "Recovery defects can be intermittent; repeated cycles provide better regression coverage than a single reconnect.",
    }),
    planned(mouse, {
      id: "SYS-INPUT-001",
      requirement: "All advertised physical controls emit the intended host-visible input.",
      requirementSource: policySource("Requirements-based input coverage derived from the controls physically present on the device and documented product capabilities."),
      area: "Input", method: "functional", priority: "P0", title: "Primary, side, wheel and auxiliary input mapping",
      ...automation("good-candidate"),
      environmentRequirements: ["Record firmware", "Identify host-visible input monitor"],
      preconditions: ["Device is connected and usable", "Host-visible input monitor is available"],
      steps: ["Exercise primary buttons", "Exercise each side/auxiliary button", "Exercise wheel up/down and wheel click", "Exercise any DPI/profile control that generates a host-visible or configuration-visible state", "Record missing, duplicate or incorrectly mapped events"],
      expectedResult: "Each physical control produces only its intended input or documented state change with no missing or duplicate host events.",
      rationale: "Input mapping defects are immediately user-visible and suitable for repeatable host-event checks.",
    }),
    planned(mouse, {
      id: "SYS-INPUT-002",
      requirement: "Supported controls remain responsive under rapid and simultaneous input patterns.",
      requirementSource: policySource("Boundary coverage for real input combinations; this does not assert a switch debounce or latency specification that is not sourced."),
      area: "Input", method: "boundary", priority: "P1", title: "Rapid and simultaneous input stress",
      ...automation("partial"),
      environmentRequirements: ["Record polling rate", "Use host input event capture where practical"],
      preconditions: ["Baseline button mapping passes", "Input capture method is identified"],
      steps: ["Perform repeated rapid primary clicks", "Hold one supported button while actuating another", "Scroll while actuating primary/side buttons", "Repeat representative combinations", "Check for missing, stuck or duplicated host-visible events"],
      expectedResult: "Executed supported combinations do not produce reproducible missing, duplicate or stuck host-visible inputs.",
      rationale: "Rapid and simultaneous operation can expose firmware/input-state regressions while remaining distinguishable from subjective click feel.",
    }),
    planned(mouse, {
      id: "SYS-POLL-001",
      requirement: `Device advertises polling support through ${mouse.specs.maxPollingHz} Hz.`,
      requirementSource: catalogSource(mouse, "specs.maxPollingHz", "Advertised polling ceiling from the Atlas product record. Measured polling must be captured separately as execution evidence."),
      area: "Sensor & polling", method: "boundary", priority: "P1", title: "Polling-setting stability through advertised ceiling",
      ...automation("good-candidate"),
      environmentRequirements: ["Record host/USB path", "Record selected DPI", "Identify polling measurement method before execution"],
      preconditions: ["Configuration surface is available", "Polling measurement tool is identified before execution"],
      steps: ["Select each available polling setting", "Exercise sustained movement and clicking", "Observe host stability and measured behavior", "Reconnect and confirm the setting remains usable", "Record observed measurement separately from advertised setting"],
      expectedResult: "Supported polling settings do not cause disconnects, input stalls or configuration loss. Any measured rate is recorded as observed evidence rather than inferred from marketing.",
      rationale: "High-rate operation stresses USB, wireless and firmware paths and is a meaningful boundary test.",
    }),
    planned(mouse, {
      id: "SYS-SENSOR-001",
      requirement: `Pointer tracking using the ${mouse.specs.sensor} implementation remains usable across representative supported motion.`,
      requirementSource: catalogSource(mouse, "specs.sensor", "Sensor model/implementation identifier from the Atlas catalog; behavior must be established through real execution."),
      area: "Sensor & polling", method: "exploratory", priority: "P1", title: "Representative tracking and lift/reposition behavior",
      ...automation("manual-first"),
      environmentRequirements: ["Record DPI and polling", "Record each tested surface", "Record connection mode"],
      preconditions: ["Representative mouse surfaces are identified", "DPI and polling configuration are recorded"],
      steps: ["Perform slow tracking", "Perform fast swipes", "Perform lift/reposition movements", "Perform diagonal and repeated direction changes", "Repeat on each actually available representative surface"],
      expectedResult: "No reproducible tracking loss, unexpected acceleration, axis anomaly or cursor jump is observed under the specific tested conditions.",
      rationale: "Surface-dependent and physical tracking anomalies require real hardware and exploratory judgment.",
    }),
    planned(mouse, {
      id: "SYS-CONFIG-001",
      requirement: `DPI, polling and remap settings behave according to documented ${configurationMode} capabilities.`,
      requirementSource: { kind: "derived-capability", field: mouse.specs.webDriver ? "specs.webDriver" : mouse.specs.driverless ? "specs.driverless" : "configuration", sourceIds: [...new Set([...sourceIdsFor(mouse, "specs.webDriver"), ...sourceIdsFor(mouse, "specs.driverless"), ...sourceIdsFor(mouse, "specs.onboardProfiles")])], note: "Configuration path is derived only from capability fields present in the Atlas record; exact software behavior must be observed during execution." },
      area: "Configuration", method: "regression", priority: "P1", title: "Configuration persistence through restart and reconnect",
      ...automation("good-candidate"),
      environmentRequirements: ["Record configuration software/browser version", "Record firmware", "Record connection mode"],
      preconditions: ["Configuration surface is available", "Baseline settings are recorded"],
      steps: ["Change DPI", "Change polling", "Change an available button mapping", "Close/reopen configuration surface", "Reconnect device", "Restart host when practical", "Compare active settings with expected documented persistence behavior"],
      expectedResult: hasProfiles ? "Settings documented as on-device persist through reconnect/restart." : "Settings persist or reset exactly according to documented product behavior; undocumented persistence is not assumed.",
      rationale: "Configuration persistence crosses software, firmware and hardware boundaries and is regression-prone.",
    }),
    planned(mouse, {
      id: "SYS-COMPAT-001",
      requirement: "Device remains usable through common host/USB state transitions in environments actually tested.",
      requirementSource: policySource("Compatibility coverage is intentionally bounded to real environments the tester can identify and execute."),
      area: "Compatibility", method: "compatibility", priority: "P1", title: "Windows/USB path, restart and sleep/wake compatibility",
      ...automation("manual-first"),
      environmentRequirements: ["Record Windows version/build", "Record host/CPU system", "Record USB controller/path", "Distinguish direct USB from hub when applicable"],
      preconditions: ["Test matrix lists only hosts, Windows builds, ports/controllers/hubs actually available"],
      steps: ["Test available direct USB ports", "Test available hub/controller path", "Restart host", "Run sleep/wake cycle", "Reconnect after each state change", "Record each environment independently"],
      expectedResult: "Device returns to a usable state without stale configuration or undocumented manual remediation in each environment actually executed.",
      rationale: "Compatibility claims must come from environments actually exercised, not a generated matrix.",
    }),
    planned(mouse, {
      id: "SYS-REG-001",
      requirement: "Core input remains functional after supported configuration or firmware changes.",
      requirementSource: policySource("Regression policy: rerun a compact high-value smoke set after a real firmware/configuration change."),
      area: "Reliability", method: "regression", priority: "P1", title: "Post-change smoke and regression suite",
      ...automation("good-candidate"),
      environmentRequirements: ["Record before/after firmware or software version", "Record change applied"],
      preconditions: ["A real configuration or firmware change has been applied", "Baseline smoke case IDs are known"],
      steps: ["Confirm enumeration", "Confirm pointer movement", "Confirm primary/side inputs", "Confirm wheel", "Confirm saved DPI/polling", "Repeat wireless recovery when applicable"],
      expectedResult: "Previously working core behavior remains intact after the observed change, or any regression is captured with evidence and linked to a defect.",
      rationale: "A compact regression pack protects high-value paths without pretending every hardware behavior is automatable.",
    }),
    planned(mouse, {
      id: "SYS-REG-002",
      requirement: "Long-idle and repeated state transitions do not introduce a reproducible loss of core input during the executed interval.",
      requirementSource: policySource("Reliability coverage for repeated state transitions; duration/cycle counts are execution inputs rather than invented lab claims."),
      area: "Reliability", method: "regression", priority: "P2", title: "Long-idle and repeated state-transition soak",
      ...automation("partial"),
      environmentRequirements: ["Declare idle duration", "Declare cycle count", "Record power/connection mode"],
      preconditions: ["Baseline input is functional", "Duration and cycle count are chosen and recorded before execution"],
      steps: ["Leave device idle for the declared interval", "Wake and confirm input", "Repeat sleep/wake or reconnect for the declared cycles", "Record the first failed cycle if any", "Recheck configuration after the final cycle"],
      expectedResult: "No reproducible loss of input, stale connection state or unexpected configuration reset occurs during the actually executed interval/cycles.",
      rationale: "Reliability evidence needs declared exposure, not a vague claim of long-duration testing.",
    }),
  ];

  if (wireless) cases.push(planned(mouse, {
    id: "SYS-WL-001",
    requirement: "Wireless mode recovers after idle, sleep/wake and receiver interruption.",
    requirementSource: catalogSource(mouse, "specs.connectivity", "Wireless recovery coverage is generated only when the catalog advertises a wireless-capable mode."),
    area: "Connectivity", method: "regression", priority: "P0", title: "Wireless reconnect and receiver-interruption recovery",
    ...automation("manual-first"),
    environmentRequirements: ["Record receiver type/placement", "Record USB path", "Record firmware and receiver firmware", "Record polling"],
    preconditions: ["Wireless mode is paired and functional", "Receiver path is recorded"],
    steps: ["Allow device to enter idle", "Wake repeatedly", "Run host sleep/wake", "Disconnect/reconnect receiver", "Introduce only safe/ordinary receiver interruption such as removal/reinsertion", "Switch away from and back to wireless mode when supported", "Repeat recovery cycle multiple times"],
    expectedResult: "Wireless input resumes according to intended product behavior without re-pairing or application restart unless explicitly documented.",
    rationale: "Intermittent recovery behavior is high impact and still requires real-device observation.",
  }));

  if (multipleModes) cases.push(planned(mouse, {
    id: "SYS-CONN-003",
    requirement: `Device exposes multiple connection modes (${connectivity}) and should switch between supported modes without corrupting saved state.`,
    requirementSource: catalogSource(mouse, "specs.connectivity", "Generated only when the Atlas record lists more than one connection mode."),
    area: "Connectivity", method: "boundary", priority: "P1", title: "Repeated supported mode switching",
    ...automation("manual-first"),
    environmentRequirements: ["Record starting mode", "Record each target mode", "Record firmware/receiver version"],
    preconditions: ["Each mode independently passes basic enumeration", "Mode-switch method is documented/identified"],
    steps: ["Start in one supported mode", "Switch to another supported mode", "Confirm input and active configuration", "Return to the original mode", "Repeat for the declared cycle count", "Record any stale pairing/configuration state"],
    expectedResult: "Every executed transition returns to usable input and preserves configuration according to documented behavior.",
    rationale: "Mode switching exercises state machines that are not covered by testing each mode only once in isolation.",
  }));

  if (bluetooth) cases.push(planned(mouse, {
    id: "SYS-BT-001",
    requirement: "Bluetooth mode pairs, reconnects and switches modes as advertised.",
    requirementSource: catalogSource(mouse, "specs.connectivity", "Generated only when Bluetooth appears in the Atlas connectivity field."),
    area: "Connectivity", method: "compatibility", priority: "P1", title: "Bluetooth pair, reconnect and mode switching",
    ...automation("manual-first"),
    environmentRequirements: ["Record Bluetooth host/adapter", "Record OS build", "Record existing pairing state"],
    preconditions: ["Bluetooth-capable host is available", "Existing pairing state is recorded"],
    steps: ["Pair from clean state", "Disconnect/reconnect", "Sleep/wake host", "Switch to another connection mode", "Return to Bluetooth"],
    expectedResult: "Pairing and reconnect behavior remains stable and mode changes do not corrupt other saved settings.",
    rationale: "Bluetooth exercises a different host stack and recovery path than 2.4 GHz receivers.",
  }));

  if (hasBattery) cases.push(planned(mouse, {
    id: "SYS-PWR-001",
    requirement: "Charging, low-battery, sleep and wake states preserve usability and configuration.",
    requirementSource: { kind: "derived-capability", field: "specs.battery*Hours", sourceIds: [...new Set([...sourceIdsFor(mouse, "specs.battery1kHours"), ...sourceIdsFor(mouse, "specs.battery4kHours"), ...sourceIdsFor(mouse, "specs.battery8kHours")])], note: "Generated because the Atlas record contains at least one battery-life field; no runtime or charge-time claim is inferred from that field." },
    area: "Power", method: "boundary", priority: "P1", title: "Power-state, low-battery and charging transitions",
    ...automation("manual-first"),
    environmentRequirements: ["Record starting charge state if observable", "Record charging path", "Record wireless mode and polling"],
    preconditions: ["Charge state can be observed", "Charging method is available"],
    steps: ["Record normal battery indication", "Exercise low-battery behavior when practically reachable", "Connect charging path", "Verify charging-while-in-use behavior only if supported", "Exercise sleep/wake", "Resume wireless use after charging-state changes"],
    expectedResult: "Observed power-state transitions do not corrupt configuration or leave the device unable to resume normal input; unsupported states remain unclaimed.",
    rationale: "Battery and sleep behavior depends on real hardware state and is poorly represented by simulation alone.",
  }));

  return cases;
}

export function newValidationSession(productId: string, cases: ValidationCase[], environment: ValidationEnvironment, tester?: string): ValidationSession {
  return {
    id: typeof crypto !== "undefined" && "randomUUID" in crypto ? crypto.randomUUID() : `validation-${Date.now()}`,
    productId,
    createdAt: new Date().toISOString(),
    environment,
    tester,
    plannedTestIds: cases.map(test => test.id),
    executions: cases.map(test => ({
      testId: test.id,
      productId,
      environment: { ...environment },
      status: "not-run",
      actualResult: "",
      evidence: [],
      regressionStatus: "not-applicable",
      tester,
    })),
  };
}

export function buildValidationReport(session: ValidationSession, defects: DefectReport[]): ValidationReport {
  const totals = session.executions.reduce((acc, execution) => {
    if (execution.status === "pass") acc.pass += 1;
    else if (execution.status === "fail") acc.fail += 1;
    else if (execution.status === "blocked") acc.blocked += 1;
    else acc.notRun += 1;
    return acc;
  }, { planned: session.plannedTestIds.length, pass: 0, fail: 0, blocked: 0, notRun: 0 });

  return {
    generatedBy: "Atlas Validation Lab",
    generatedAt: new Date().toISOString(),
    integrityNote: "Generated coverage is a plan, not a result. PASS/FAIL/BLOCKED counts come only from statuses manually recorded in this validation session.",
    productId: session.productId,
    sessionId: session.id,
    environment: session.environment,
    totals,
    executions: session.executions,
    defects: defects.filter(defect => defect.productId === session.productId && (!defect.linkedTestId || session.plannedTestIds.includes(defect.linkedTestId))),
    limitations: [
      "This report describes only the environment, duration, cycles and evidence recorded in this session.",
      "A NOT RUN case has no execution evidence and must not be interpreted as passing coverage.",
      "A suspected defect layer is a hypothesis unless independent evidence establishes root cause.",
    ],
  };
}
