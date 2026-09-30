import { buildValidationReport, type DefectReport, type ValidationExecutionRecord, type ValidationSession } from "./validation";

export interface ValidationExecutionIntegrity {
  complete: boolean;
  issues: string[];
  evidenceAttached: boolean;
}

export interface ValidationSessionQuality {
  planned: number;
  executed: number;
  completeExecuted: number;
  incompleteExecuted: number;
  withEvidence: number;
  pass: number;
  fail: number;
  blocked: number;
  notRun: number;
}

const clean = (value?: string) => value?.trim() ?? "";

export function validationExecutionIntegrity(execution: ValidationExecutionRecord): ValidationExecutionIntegrity {
  if (execution.status === "not-run") {
    return { complete: false, issues: ["Case has not been executed."], evidenceAttached: execution.evidence.length > 0 };
  }

  const issues: string[] = [];
  if (!clean(execution.actualResult)) issues.push("Actual observed result is missing.");
  if (!execution.executedAt) issues.push("Execution timestamp is missing.");
  if (!clean(execution.environment.os)) issues.push("OS / host environment is missing.");
  if (!clean(execution.environment.connectionMode)) issues.push("Connection mode is missing.");
  if (execution.status === "fail" && !clean(execution.reproductionFrequency)) issues.push("Failure reproduction frequency is missing.");
  if ((execution.regressionStatus === "passed" || execution.regressionStatus === "failed") && !clean(execution.notes)) {
    issues.push("Regression outcome needs execution notes describing what changed or was rechecked.");
  }

  return { complete: issues.length === 0, issues, evidenceAttached: execution.evidence.length > 0 };
}

export function summarizeValidationSession(session: ValidationSession): ValidationSessionQuality {
  const summary: ValidationSessionQuality = {
    planned: session.executions.length,
    executed: 0,
    completeExecuted: 0,
    incompleteExecuted: 0,
    withEvidence: 0,
    pass: 0,
    fail: 0,
    blocked: 0,
    notRun: 0,
  };

  for (const execution of session.executions) {
    if (execution.status === "not-run") {
      summary.notRun += 1;
      continue;
    }
    summary.executed += 1;
    if (execution.status === "pass") summary.pass += 1;
    else if (execution.status === "fail") summary.fail += 1;
    else if (execution.status === "blocked") summary.blocked += 1;

    const integrity = validationExecutionIntegrity(execution);
    if (integrity.complete) summary.completeExecuted += 1;
    else summary.incompleteExecuted += 1;
    if (integrity.evidenceAttached) summary.withEvidence += 1;
  }

  return summary;
}

const cell = (value: unknown) => String(value ?? "").replaceAll("|", "\\|").replaceAll("\n", " ").trim();
const envLine = (label: string, value: unknown) => value == null || value === "" ? null : `- **${label}:** ${String(value)}`;

export function buildValidationReportMarkdown(
  session: ValidationSession,
  defects: DefectReport[],
  productLabel: string,
): string {
  const report = buildValidationReport(session, defects);
  const quality = summarizeValidationSession(session);
  const environment = [
    envLine("OS", report.environment.os),
    envLine("OS build", report.environment.osBuild),
    envLine("Host", report.environment.host),
    envLine("CPU / platform", report.environment.cpuSystem),
    envLine("USB path", report.environment.usbPath),
    envLine("USB controller", report.environment.usbController),
    envLine("Connection mode", report.environment.connectionMode),
    envLine("Receiver", report.environment.receiverType),
    envLine("Firmware", report.environment.firmwareVersion),
    envLine("Receiver firmware", report.environment.receiverVersion),
    envLine("Software", report.environment.softwareVersion),
    envLine("Polling", report.environment.pollingHz ? `${report.environment.pollingHz} Hz` : undefined),
    envLine("DPI", report.environment.dpi),
    envLine("Surface", report.environment.surface),
    envLine("Power state", report.environment.powerState),
    envLine("Notes", report.environment.notes),
  ].filter((line): line is string => Boolean(line));

  const executionRows = report.executions.map(execution => {
    const integrity = validationExecutionIntegrity(execution);
    const integrityLabel = execution.status === "not-run" ? "NOT RUN" : integrity.complete ? "COMPLETE" : `INCOMPLETE: ${integrity.issues.join(" ")}`;
    return `| ${cell(execution.testId)} | ${cell(execution.status.toUpperCase())} | ${cell(execution.actualResult || "—")} | ${cell(execution.reproductionFrequency || "—")} | ${cell(execution.evidence.length)} | ${cell(integrityLabel)} |`;
  });

  const defectRows = report.defects.length
    ? report.defects.map(defect => `| ${cell(defect.severity)} | ${cell(defect.priority)} | ${cell(defect.title)} | ${cell(defect.status ?? "open")} | ${cell(defect.linkedTestId ?? "—")} |`)
    : ["| — | — | No defects linked to this report | — | — |"]; 

  return [
    `# Atlas Validation Report — ${productLabel}`,
    "",
    `- **Session:** ${session.id}`,
    `- **Created:** ${session.createdAt}`,
    `- **Generated:** ${report.generatedAt}`,
    session.tester ? `- **Tester:** ${session.tester}` : "- **Tester:** not recorded",
    "",
    "> Generated test coverage is a plan, not a result. PASS / FAIL / BLOCKED below only reflects manually recorded executions in this session.",
    "",
    "## Environment",
    "",
    ...(environment.length ? environment : ["- No environment details recorded."]),
    "",
    "## Summary",
    "",
    `- Planned cases: **${quality.planned}**`,
    `- Executed: **${quality.executed}**`,
    `- Complete executed records: **${quality.completeExecuted}**`,
    `- Incomplete executed records: **${quality.incompleteExecuted}**`,
    `- Executions with attached evidence reference: **${quality.withEvidence}**`,
    `- PASS: **${quality.pass}** · FAIL: **${quality.fail}** · BLOCKED: **${quality.blocked}** · NOT RUN: **${quality.notRun}**`,
    "",
    "## Executions",
    "",
    "| Test | Status | Actual observed result | Reproduction | Evidence refs | Record integrity |",
    "| --- | --- | --- | --- | ---: | --- |",
    ...executionRows,
    "",
    "## Defects",
    "",
    "| Severity | Priority | Title | Status | Linked test |",
    "| --- | --- | --- | --- | --- |",
    ...defectRows,
    "",
    "## Limitations",
    "",
    ...report.limitations.map(item => `- ${item}`),
    quality.incompleteExecuted > 0 ? `- ${quality.incompleteExecuted} executed record(s) are missing required observation/environment details and should not be treated as portfolio-ready evidence yet.` : "- All executed records satisfy the Atlas minimum execution-integrity checks.",
    "",
  ].join("\n");
}
