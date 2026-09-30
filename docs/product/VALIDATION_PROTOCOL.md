# Atlas hardware/system validation protocol

## Integrity rule

A generated test case is **PLANNED / NOT RUN**.

It may only become PASS, FAIL or BLOCKED after a person physically executes it against a real device and records the environment and observed result.

Catalog specifications can generate requirements and coverage. They cannot generate test results.

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

Unknown fields remain unknown; do not fill them with assumptions.

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

The current Product Lab also exports its persisted manual session JSON. The report format can be wired directly into richer HTML/PDF output later without changing the integrity rule.
