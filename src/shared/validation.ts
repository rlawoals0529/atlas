import type { MouseProduct } from "./types";

export type ValidationArea = "Connectivity" | "Input" | "Sensor & polling" | "Power" | "Configuration" | "Compatibility" | "Reliability";
export type ValidationMethod = "functional" | "regression" | "compatibility" | "boundary" | "exploratory";
export type ValidationPriority = "P0" | "P1" | "P2";
export type ValidationStatus = "not-run" | "pass" | "fail" | "blocked";
export type RegressionStatus = "not-applicable" | "pending" | "passed" | "failed";
export type DefectSeverity = "S1" | "S2" | "S3" | "S4";
export type DefectPriority = "P0" | "P1" | "P2" | "P3";

export interface ValidationEnvironment {
  os: string;
  osBuild?: string;
  host?: string;
  usbPath?: string;
  connectionMode?: string;
  firmwareVersion?: string;
  receiverVersion?: string;
  softwareVersion?: string;
  pollingHz?: number;
  dpi?: number;
  notes?: string;
}

export interface ValidationCase {
  id: string;
  requirement: string;
  area: ValidationArea;
  method: ValidationMethod;
  priority: ValidationPriority;
  title: string;
  preconditions: string[];
  steps: string[];
  expectedResult: string;
  automationCandidate: boolean;
  rationale: string;
  status: "not-run";
}

export interface ValidationEvidence {
  kind: "note" | "screenshot" | "video" | "log" | "measurement";
  label: string;
  uri?: string;
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
}

export interface ValidationSession {
  id: string;
  productId: string;
  createdAt: string;
  environment: ValidationEnvironment;
  plannedTestIds: string[];
  executions: ValidationExecutionRecord[];
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
  createdAt: string;
}

const planned = (value: Omit<ValidationCase, "status">): ValidationCase => ({ ...value, status: "not-run" });

export function validationCasesFor(mouse: MouseProduct): ValidationCase[] {
  const connectivity = mouse.specs.connectivity.join(", ") || "supported connection modes";
  const wireless = mouse.specs.connectivity.some(item => /wireless|2\.4|bluetooth/i.test(item));
  const bluetooth = mouse.specs.connectivity.some(item => /bluetooth/i.test(item));
  const hasBattery = mouse.specs.battery1kHours != null || mouse.specs.battery4kHours != null || mouse.specs.battery8kHours != null;
  const hasProfiles = (mouse.specs.onboardProfiles ?? 0) > 0;
  const configurationMode = mouse.specs.webDriver ? "web configuration" : mouse.specs.driverless ? "driverless configuration" : "vendor configuration software";
  const cases: ValidationCase[] = [
    planned({
      id: "SYS-CONN-001",
      requirement: `Device supports advertised connection modes: ${connectivity}.`,
      area: "Connectivity", method: "functional", priority: "P0",
      title: "Enumeration and basic input in every supported mode",
      preconditions: ["Supported host is available", "Device has sufficient power", "Required receiver/cable is available"],
      steps: ["Connect using each advertised mode", "Confirm host enumeration", "Move pointer", "Exercise primary buttons and wheel", "Repeat after unplug/replug where applicable"],
      expectedResult: "The device enumerates and accepts pointer/button input in every advertised mode without manual recovery.",
      automationCandidate: true,
      rationale: "Enumeration and basic input are release-blocking system paths.",
    }),
    planned({
      id: "SYS-INPUT-001",
      requirement: "All advertised physical controls emit the intended host-visible input.",
      area: "Input", method: "functional", priority: "P0",
      title: "Primary, side, wheel and auxiliary input mapping",
      preconditions: ["Device is connected and usable", "Host-visible input monitor is available"],
      steps: ["Exercise primary buttons", "Exercise each side/auxiliary button", "Exercise wheel up/down and wheel click", "Exercise rapid and simultaneous inputs", "Record missing, duplicate or incorrectly mapped events"],
      expectedResult: "Each physical control emits only the intended input with no missing or duplicate host events.",
      automationCandidate: true,
      rationale: "Input mapping defects are immediately user-visible and suitable for repeatable host-event checks.",
    }),
    planned({
      id: "SYS-POLL-001",
      requirement: `Device advertises polling support through ${mouse.specs.maxPollingHz} Hz.`,
      area: "Sensor & polling", method: "boundary", priority: "P1",
      title: "Polling-setting stability through advertised ceiling",
      preconditions: ["Configuration surface is available", "Polling measurement tool is identified before execution"],
      steps: ["Select each available polling setting", "Exercise sustained movement and clicking", "Observe host stability and measured behavior", "Reconnect and confirm the setting remains usable"],
      expectedResult: "Supported polling settings do not cause disconnects, input stalls or configuration loss. Any measured rate is recorded as observed evidence rather than inferred from marketing.",
      automationCandidate: true,
      rationale: "High-rate operation stresses USB, wireless and firmware paths and is a meaningful boundary test.",
    }),
    planned({
      id: "SYS-SENSOR-001",
      requirement: `Pointer tracking using the ${mouse.specs.sensor} implementation remains usable across representative motion.`,
      area: "Sensor & polling", method: "exploratory", priority: "P1",
      title: "Representative tracking and lift/reposition behavior",
      preconditions: ["Representative mouse surfaces are identified", "DPI and polling configuration are recorded"],
      steps: ["Perform slow tracking", "Perform fast swipes", "Perform lift/reposition movements", "Perform diagonal and repeated direction changes", "Repeat on available representative surfaces"],
      expectedResult: "No reproducible tracking loss, unexpected acceleration, axis anomaly or cursor jump is observed under supported use.",
      automationCandidate: false,
      rationale: "Surface-dependent and physical tracking anomalies require real hardware and exploratory judgment.",
    }),
    planned({
      id: "SYS-CONFIG-001",
      requirement: `DPI, polling and remap settings behave according to documented ${configurationMode} capabilities.`,
      area: "Configuration", method: "regression", priority: "P1",
      title: "Configuration persistence through restart and reconnect",
      preconditions: ["Configuration surface is available", "Baseline settings are recorded"],
      steps: ["Change DPI", "Change polling", "Change an available button mapping", "Close/reopen configuration surface", "Reconnect device", "Restart host when practical", "Compare active settings with expected persistence behavior"],
      expectedResult: hasProfiles ? "Settings documented as on-device persist through reconnect/restart." : "Settings persist or reset exactly according to documented product behavior.",
      automationCandidate: true,
      rationale: "Configuration persistence crosses software, firmware and hardware boundaries and is regression-prone.",
    }),
    planned({
      id: "SYS-COMPAT-001",
      requirement: "Device remains usable through common host/USB state transitions in environments actually tested.",
      area: "Compatibility", method: "compatibility", priority: "P1",
      title: "USB path, restart and sleep/wake compatibility",
      preconditions: ["Test matrix lists only hosts, Windows builds, ports/controllers/hubs actually available"],
      steps: ["Test available direct USB ports", "Test available hub/controller path", "Restart host", "Run sleep/wake cycle", "Reconnect after each state change"],
      expectedResult: "Device returns to a usable state without stale configuration or undocumented manual remediation.",
      automationCandidate: false,
      rationale: "Compatibility claims must come from environments actually exercised, not a generated matrix.",
    }),
    planned({
      id: "SYS-REG-001",
      requirement: "Core input remains functional after supported configuration or firmware changes.",
      area: "Reliability", method: "regression", priority: "P1",
      title: "Post-change smoke and regression suite",
      preconditions: ["A configuration or firmware change has been applied", "Baseline smoke case IDs are known"],
      steps: ["Confirm enumeration", "Confirm pointer movement", "Confirm primary/side inputs", "Confirm wheel", "Confirm saved DPI/polling", "Repeat wireless recovery when applicable"],
      expectedResult: "Previously working core behavior remains intact after the change.",
      automationCandidate: true,
      rationale: "A compact regression pack protects high-value paths without pretending every hardware behavior is automatable.",
    }),
  ];

  if (wireless) cases.push(planned({
    id: "SYS-WL-001",
    requirement: "Wireless mode recovers after idle, sleep/wake and receiver interruption.",
    area: "Connectivity", method: "regression", priority: "P0",
    title: "Wireless reconnect and recovery",
    preconditions: ["Wireless mode is paired and functional", "Receiver path is recorded"],
    steps: ["Allow device to enter idle", "Wake repeatedly", "Run host sleep/wake", "Disconnect/reconnect receiver", "Switch away from and back to wireless mode when supported", "Repeat recovery cycle multiple times"],
    expectedResult: "Wireless input resumes according to intended product behavior without re-pairing or application restart unless explicitly documented.",
    automationCandidate: false,
    rationale: "Intermittent recovery behavior is high impact and still requires real-device observation.",
  }));

  if (bluetooth) cases.push(planned({
    id: "SYS-BT-001",
    requirement: "Bluetooth mode pairs, reconnects and switches modes as advertised.",
    area: "Connectivity", method: "compatibility", priority: "P1",
    title: "Bluetooth pair, reconnect and mode switching",
    preconditions: ["Bluetooth-capable host is available", "Existing pairing state is recorded"],
    steps: ["Pair from clean state", "Disconnect/reconnect", "Sleep/wake host", "Switch to another connection mode", "Return to Bluetooth"],
    expectedResult: "Pairing and reconnect behavior remains stable and mode changes do not corrupt other saved settings.",
    automationCandidate: false,
    rationale: "Bluetooth exercises a different host stack and recovery path than 2.4 GHz receivers.",
  }));

  if (hasBattery) cases.push(planned({
    id: "SYS-PWR-001",
    requirement: "Charging, low-battery, sleep and wake states preserve usability and configuration.",
    area: "Power", method: "boundary", priority: "P1",
    title: "Power-state and charging transitions",
    preconditions: ["Charge state can be observed", "Charging method is available"],
    steps: ["Record normal battery indication", "Exercise low-battery behavior when practical", "Connect charging path", "Exercise sleep/wake", "Resume wireless use after charging-state changes"],
    expectedResult: "Power-state transitions do not corrupt configuration or leave the device unable to resume normal input.",
    automationCandidate: false,
    rationale: "Battery and sleep behavior depends on real hardware state and is poorly represented by simulation alone.",
  }));

  return cases;
}

export function newValidationSession(productId: string, cases: ValidationCase[], environment: ValidationEnvironment): ValidationSession {
  return {
    id: typeof crypto !== "undefined" && "randomUUID" in crypto ? crypto.randomUUID() : `validation-${Date.now()}`,
    productId,
    createdAt: new Date().toISOString(),
    environment,
    plannedTestIds: cases.map(test => test.id),
    executions: cases.map(test => ({
      testId: test.id,
      productId,
      environment: { ...environment },
      status: "not-run",
      actualResult: "",
      evidence: [],
      regressionStatus: "not-applicable",
    })),
  };
}
