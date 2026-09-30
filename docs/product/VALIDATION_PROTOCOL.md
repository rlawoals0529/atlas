# Atlas hardware/system validation protocol

## Integrity rule

A generated test case is **PLANNED / NOT RUN**.

It may only become PASS, FAIL or BLOCKED after a person physically executes it against a real device and records the environment and observed result.

Catalog specifications can generate requirements and coverage. They cannot generate test results.

## Guided physical runner

Atlas exposes a dedicated guided execution surface at `#validation-run` in addition to the broader Product Lab.

The runner uses the same browser-local validation sessions and defects as Product Lab, but makes the evidence workflow explicit:

1. declare the real device and execution environment;
2. record at minimum the OS and actual connection mode before creating a session;
3. start with P0 enumeration/input/recovery paths or expand to the full capability-derived plan;
4. execute the physical steps and record the actual observed result rather than copying the expected result;
5. record failure reproduction frequency when a case fails;
6. attach a traceable evidence reference when available;
7. resume saved browser-local sessions instead of starting over;
8. export structured JSON or a human-readable Markdown validation report.

A changed status is not, by itself, a complete evidence record. Atlas checks executed cases for an observation, timestamp and core environment context. Failed cases also need reproduction-frequency context. Incomplete executed records remain visible in the report and are explicitly not treated as portfolio-ready evidence.

## Test case fields

Atlas validation cases carry:

- test ID and title;
- product ID;
- requirement and requirement source;
- functional area;
- test priority;
- method/type;
- automation suitability (`good-candidate`, `partial`, `manual-first`);
- environment requirements;
- preconditions;
- ordered steps;
- expected result;
- rationale;
- initial `not-run` status.

Execution records add:

- device/product ID;
- environment snapshot;
- actual result;
- PASS / FAIL / BLOCKED / NOT RUN;
- reproduction frequency;
- evidence;
- linked defect;
- regression status;
- execution timestamp;
- tester and notes when supplied.

## Requirement provenance

A requirement source is explicit. It can be:

- a sourced Atlas catalog field;
- a manufacturer/independent source reference;
- a capability derived from one or more sourced catalog fields;
- a documented Atlas test-policy requirement.

A generated requirement can justify a **planned test**. It cannot prove the device behaves that way.

## Environment minimum

Before claiming an execution result, record what is relevant and actually known:

- mouse model/revision;
- firmware version;
- receiver firmware/version when applicable;
- Windows/OS version and build;
- host/CPU/system when material;
- USB port/controller/path, including direct vs hub when applicable;
- wired / 2.4 GHz / Bluetooth mode;
- receiver type/placement when material;
- DPI and polling setting for sensor/polling work;
- configuration software/browser version where relevant;
- surface and power state when relevant.

The guided runner requires the OS and connection mode before a new physical session can be created. Other fields remain conditional on what is relevant and actually known. Unknown fields remain unknown; do not fill them with assumptions.

## Execution-record completeness

For an executed case to pass Atlas's minimum evidence-integrity check:

- status must no longer be `NOT RUN`;
- an actual observed result must be written;
- an execution timestamp must exist;
- OS / host environment context must be present;
- connection mode must be present;
- a FAIL must include reproduction-frequency context;
- a regression marked passed/failed must include notes describing the change or recheck.

An evidence attachment/reference is encouraged and counted separately from record completeness because some deterministic functional checks can be credibly documented with a detailed observation alone. When a method depends on logs, measurements, screenshots or video, the appropriate evidence should still be captured.

## Methods

### Functional
Deterministic requirement behavior such as enumeration, inputs and configuration changes.

### Regression
Previously working core behavior after firmware/configuration/software changes or repeated state transitions.

### Compatibility
Behavior across hosts, Windows builds, USB paths and connection modes actually available to test.

### Boundary
High polling, low-power state, reconnect cycles, rapid/simultaneous input and other supported limits.

### Exploratory
Physical/surface-dependent behavior, intermittent wireless behavior and user-visible anomalies that are poorly represented by a single scripted assertion.

## Core mouse coverage

Capability-derived coverage includes:

- connection enumeration and basic input;
- repeated unplug/replug and reconnect recovery;
- wired / 2.4 GHz / Bluetooth modes when advertised;
- repeated supported mode switching when multiple modes exist;
- primary/side/wheel/auxiliary inputs;
- rapid/simultaneous host-visible input;
- polling settings through the advertised ceiling;
- representative sensor movement and lift/reposition behavior;
- DPI/polling/remap persistence;
- onboard-memory expectations where documented;
- sleep/wake and receiver recovery;
- charging/low-battery/power transitions when applicable;
- Windows/host/USB compatibility paths actually available;
- post-change smoke/regression coverage;
- declared-cycle/declared-duration reliability checks.

Long-duration and repeated-cycle claims must record the actual duration/cycle count. The plan itself is not evidence of endurance.

## P0-first execution

The guided runner defaults to a P0-first view. This is an execution convenience, not a statement that P1/P2 cases are unimportant.

P0 emphasizes release-path failures such as enumeration, basic input, reconnect recovery and wireless recovery where applicable. After core paths are exercised, expand to the full plan for polling, sensor behavior, configuration persistence, compatibility, power and reliability coverage.

## Automation strategy

Good candidates:

- device enumeration;
- host-visible button events;
- supported polling-setting checks where a trustworthy host tool is available;
- configuration persistence;
- repeatable smoke/regression coverage.

Partial candidates often combine host-visible assertions with manual physical state changes, such as repeated reconnects.

Manual/exploratory stays first-class for:

- shape and physical feel;
- coating/click/wheel feel;
- intermittent wireless behavior;
- power-state behavior requiring real hardware;
- surface-dependent sensor behavior;
- noise and mechanical observations.

The goal is risk coverage, not automation percentage.

## Defect report

A validation defect should include:

- title;
- affected product;
- environment;
- firmware/software versions;
- reproduction steps;
- expected behavior;
- actual behavior;
- reproduction frequency;
- severity;
- priority;
- evidence;
- suspected layer only when supported;
- linked test case;
- regression test after fix;
- status and resolution/fix build when known.

Severity and priority are separate. Severity describes impact; priority describes when the work should be handled.

Suggested severity scale:

- **S1** — unusable/core data-loss or safety/security-equivalent impact;
- **S2** — major core feature failure with limited/no workaround;
- **S3** — meaningful defect with workaround or partial impact;
- **S4** — minor/cosmetic/low-impact behavior.

Do not promote a suspected layer into a root-cause statement unless evidence establishes it.

## Report export

`buildValidationReport()` creates a structured report from one real manual session. It counts PASS/FAIL/BLOCKED only from statuses the tester recorded and keeps NOT RUN visible. The report states the tested environment and limitations, and links defects only when they apply to the product/session coverage.

The Product Lab exports structured session JSON. The guided runner at `#validation-run` exports that same evidence model as JSON and also builds a Markdown validation report with environment context, execution totals, per-case record-integrity warnings, defects and limitations.

Neither export upgrades an incomplete execution into valid evidence. If an executed case is missing required observation/environment details, the Markdown report flags it explicitly rather than presenting it as complete portfolio evidence.
