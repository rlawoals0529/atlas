# Atlas hardware/system validation protocol

## Integrity rule

A generated test case is **PLANNED / NOT RUN**.

It may only become PASS, FAIL or BLOCKED after a person physically executes it against a real device and records the environment and observed result.

Catalog specifications can generate requirements and coverage. They cannot generate test results.

## Test case fields

Atlas validation cases carry:

- test ID;
- requirement;
- functional area;
- priority;
- method/type;
- preconditions;
- ordered steps;
- expected result;
- automation-candidate flag;
- rationale;
- initial `not-run` status.

Execution records add:

- device/product ID;
- environment;
- actual result;
- PASS / FAIL / BLOCKED / NOT RUN;
- reproduction frequency;
- evidence;
- linked defect;
- regression status;
- execution timestamp.

## Environment minimum

Before claiming an execution result, record what is relevant and actually known:

- mouse model/revision;
- firmware version;
- receiver firmware/version when applicable;
- Windows/OS version and build;
- host/USB path or hub/controller if relevant;
- wired / 2.4 GHz / Bluetooth mode;
- DPI and polling setting for sensor/polling work;
- configuration software/browser version where relevant.

Unknown fields remain unknown; do not fill them with assumptions.

## Methods

### Functional
Deterministic requirement behavior such as enumeration, inputs and configuration changes.

### Regression
Previously working core behavior after firmware/configuration/software changes.

### Compatibility
Behavior across hosts, Windows builds, USB paths and connection modes actually available to test.

### Boundary
High polling, low-power state, reconnect cycles, rapid/simultaneous input and other supported limits.

### Exploratory
Physical/surface-dependent behavior, intermittent wireless behavior and user-visible anomalies that are poorly represented by a single scripted assertion.

## Core mouse coverage

Capability-derived coverage currently includes:

- connection enumeration and unplug/replug;
- wired / 2.4 GHz / Bluetooth modes when advertised;
- primary/side/wheel/auxiliary inputs;
- rapid/simultaneous host-visible input;
- polling settings through advertised ceiling;
- representative sensor movement and lift/reposition behavior;
- DPI/polling/remap persistence;
- onboard-memory expectations where documented;
- sleep/wake and receiver recovery;
- charging/low-battery/power transitions when applicable;
- available Windows/USB compatibility paths;
- post-change smoke/regression coverage.

## Automation strategy

Good candidates:

- device enumeration;
- host-visible button events;
- supported polling-setting checks where a trustworthy host tool is available;
- configuration persistence;
- repeatable smoke/regression coverage.

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
- regression test after fix.

Severity and priority are separate. Severity describes impact; priority describes when the work should be handled.

Suggested severity scale:

- **S1** — unusable/core data-loss or safety/security-equivalent impact;
- **S2** — major core feature failure with limited/no workaround;
- **S3** — meaningful defect with workaround or partial impact;
- **S4** — minor/cosmetic/low-impact behavior.

## Report export

The current Product Lab can export a validation session as JSON. The export carries an integrity note and only records results the user manually entered. Evidence URIs/attachments can be expanded later without changing the core execution schema.
