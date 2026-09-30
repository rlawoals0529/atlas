import type { MouseProduct } from "./types";

export type ValidationArea = "Connectivity" | "Input" | "Sensor & polling" | "Power" | "Configuration" | "Compatibility" | "Reliability";
export type ValidationMethod = "functional" | "regression" | "compatibility" | "boundary" | "exploratory";
export type ValidationPriority = "P0" | "P1" | "P2";

export interface ValidationCase {
  id: string;
  area: ValidationArea;
  method: ValidationMethod;
  priority: ValidationPriority;
  title: string;
  procedure: string;
  expected: string;
  automationCandidate: boolean;
  rationale: string;
}

export function validationCasesFor(mouse: MouseProduct): ValidationCase[] {
  const connectivity = mouse.specs.connectivity.join(", ") || "supported connection modes";
  const wireless = mouse.specs.connectivity.some(item => /wireless|2\.4|bluetooth/i.test(item));
  const hasBattery = mouse.specs.battery1kHours != null || mouse.specs.battery4kHours != null || mouse.specs.battery8kHours != null;
  const hasProfiles = (mouse.specs.onboardProfiles ?? 0) > 0;
  const configurationMode = mouse.specs.webDriver ? "web configuration" : mouse.specs.driverless ? "driverless configuration" : "vendor configuration software";

  const cases: ValidationCase[] = [
    {
      id: "SYS-CONN-001",
      area: "Connectivity",
      method: "functional",
      priority: "P0",
      title: "Enumerates and accepts input after connection",
      procedure: `Connect the device using each supported mode (${connectivity}). Confirm OS enumeration, cursor movement and primary-button input.`,
      expected: "Device enumerates without manual recovery and accepts pointer/button input in every advertised mode.",
      automationCandidate: true,
      rationale: "Basic connectivity is a release-blocking path for any pointing device.",
    },
    {
      id: "SYS-INPUT-001",
      area: "Input",
      method: "functional",
      priority: "P0",
      title: "Buttons and wheel map to expected inputs",
      procedure: `Exercise primary clicks, wheel directions and all ${mouse.specs.programmableButtons ?? "advertised"} programmable inputs across normal and rapid use.`,
      expected: "Each physical control emits only the intended input with no missing or duplicate events.",
      automationCandidate: true,
      rationale: "Input mapping defects are immediately user-visible and can invalidate competitive use.",
    },
    {
      id: "SYS-POLL-001",
      area: "Sensor & polling",
      method: "boundary",
      priority: "P1",
      title: "Polling settings remain stable through the advertised ceiling",
      procedure: `Exercise available polling settings through the advertised ${mouse.specs.maxPollingHz} Hz ceiling under sustained movement and clicking. Record observed stability rather than assuming the marketing ceiling is continuously achieved.`,
      expected: "No disconnects, input stalls or configuration loss occur at supported polling settings.",
      automationCandidate: true,
      rationale: "High-rate operation stresses the USB/wireless/firmware path and is central to enthusiast positioning.",
    },
    {
      id: "SYS-SENSOR-001",
      area: "Sensor & polling",
      method: "exploratory",
      priority: "P1",
      title: "Sensor behavior remains consistent across representative motion",
      procedure: `Test slow tracking, fast swipes, lift/reposition behavior and diagonal movement using the ${mouse.specs.sensor} sensor across representative surfaces.`,
      expected: "No reproducible tracking loss, unexpected acceleration, axis anomaly or cursor jump is observed under supported use.",
      automationCandidate: false,
      rationale: "A mixed scripted/exploratory pass is better suited to detecting user-visible sensor anomalies than a single synthetic metric.",
    },
    {
      id: "SYS-COMPAT-001",
      area: "Compatibility",
      method: "compatibility",
      priority: "P1",
      title: "Recovers after USB port and host-state changes",
      procedure: "Exercise unplug/replug, alternate USB ports, restart, sleep/wake and application relaunch paths on available test hosts.",
      expected: "Device returns to a usable state without stale configuration or manual remediation beyond normal reconnection.",
      automationCandidate: false,
      rationale: "Host-state transitions catch integration defects that steady-state testing misses.",
    },
    {
      id: "SYS-CONFIG-001",
      area: "Configuration",
      method: "regression",
      priority: "P1",
      title: "Configuration changes persist as designed",
      procedure: `Change DPI, polling and button settings using ${configurationMode}; restart the configuration surface and reconnect the mouse.`,
      expected: hasProfiles ? "Settings expected to live on-device persist through reconnect and restart." : "Settings persist or reset exactly according to documented product behavior.",
      automationCandidate: true,
      rationale: "Configuration persistence is a frequent source of regressions across software, firmware and device boundaries.",
    },
    {
      id: "SYS-REG-001",
      area: "Reliability",
      method: "regression",
      priority: "P1",
      title: "Core smoke suite passes after configuration changes",
      procedure: "After changing DPI, polling, mappings and connection mode, rerun connection, pointer, click and wheel smoke tests.",
      expected: "Previously working core behavior remains intact after supported configuration changes.",
      automationCandidate: true,
      rationale: "A compact regression suite protects the highest-value user paths after firmware or software changes.",
    },
  ];

  if (wireless) {
    cases.push({
      id: "SYS-WL-001",
      area: "Connectivity",
      method: "regression",
      priority: "P0",
      title: "Wireless reconnect after idle and receiver interruption",
      procedure: "Allow the device to enter an idle state, wake it repeatedly, then interrupt and restore the receiver connection while observing recovery behavior.",
      expected: "Wireless input resumes within the product's intended behavior without requiring a full re-pair or application restart.",
      automationCandidate: false,
      rationale: "Reconnect failures are high-impact because they make an otherwise functional wireless product feel unreliable.",
    });
  }

  if (hasBattery) {
    cases.push({
      id: "SYS-PWR-001",
      area: "Power",
      method: "boundary",
      priority: "P1",
      title: "Low-power, charge and sleep states preserve usability",
      procedure: "Exercise normal charge, low-battery indication, sleep, wake and reconnect paths using the available hardware and documented charging method.",
      expected: "Power-state transitions do not corrupt configuration or leave the device unable to resume normal input.",
      automationCandidate: false,
      rationale: "Power-state defects commonly cross firmware, wireless and host-software boundaries.",
    });
  }

  return cases;
}
