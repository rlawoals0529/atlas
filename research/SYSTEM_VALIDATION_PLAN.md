# System Test and Validation Plan

## Purpose

Input Atlas now includes a portfolio-oriented validation layer that translates peripheral product specifications into a structured system test plan.

The goal is to demonstrate test-engineering thinking without inventing laboratory results. A generated test case is a planned check, not a passed result.

## System under test

The current generator targets gaming mice. Test coverage is derived from each product record, including:

- advertised connectivity modes;
- number of programmable inputs when known;
- sensor and polling ceiling;
- wireless capability;
- onboard profiles;
- browser/driverless configuration signals;
- battery capabilities where documented.

## Core validation areas

### Connectivity

Validate enumeration, usable input, reconnect behavior and mode transitions. Wireless products receive additional reconnect coverage.

### Input

Validate primary buttons, side buttons, wheel behavior and rapid-use paths. Missing, duplicated or incorrectly mapped events are user-visible failures.

### Sensor and polling

Exercise representative slow/fast movement, lift/reposition behavior and supported polling settings. An advertised polling ceiling is treated as a requirement to test for stability, not proof that a device sustains a particular measured rate.

### Power

For products with documented battery behavior, exercise low-power, charging, sleep and wake transitions.

### Configuration

Change settings, restart/reconnect and verify persistence according to documented behavior. Products with onboard memory receive explicit persistence expectations.

### Compatibility

Exercise restart, sleep/wake, reconnect and available host/USB combinations. The portfolio should only claim coverage for environments actually tested.

### Reliability and regression

After configuration or firmware-related changes, rerun a compact smoke/regression suite across connection, pointer, click and wheel behavior.

## Priority model

- **P0** - release-blocking core paths such as enumeration, basic input and wireless recovery.
- **P1** - important product behavior such as polling stability, configuration persistence, power and compatibility.
- **P2** - lower-risk or extended coverage when added later.

Priority is distinct from bug severity. A future execution report should record both test priority and defect severity separately.

## Test methods represented

- functional;
- regression;
- compatibility;
- boundary;
- exploratory.

The plan deliberately mixes scripted and exploratory testing because peripheral quality includes both deterministic requirements and user-visible behavior that is difficult to reduce to one synthetic metric.

## Automation strategy

Automation candidates are marked where repeatable host-visible checks could reasonably be scripted, such as enumeration, button events, configuration persistence and regression smoke coverage.

Automation is not treated as the goal by itself. Manual/exploratory work remains appropriate for:

- physical feel;
- intermittent reconnect behavior;
- surface-dependent tracking anomalies;
- power-state transitions requiring real hardware;
- cross-device compatibility that cannot be simulated honestly.

## Required evidence for an executed test

A future real test result should include:

1. device and firmware version;
2. receiver/dongle version when applicable;
3. operating system and host hardware;
4. connection mode and relevant settings;
5. exact reproduction steps;
6. expected and actual behavior;
7. pass/fail/blocked status;
8. reproduction frequency for failures;
9. logs, screenshots, video or measurement output when useful;
10. linked defect and regression test after a fix.

## Example defect format

**Title:** Wireless mouse fails to recover after host sleep at 4K polling

**Environment:** identify OS, firmware, receiver, USB path and power settings

**Steps:** numbered, deterministic reproduction sequence

**Expected:** input resumes after wake within documented behavior

**Actual:** receiver remains enumerated but pointer/button input does not resume

**Frequency:** e.g. 7/10 attempts

**Severity:** based on user impact

**Evidence:** logs/video/host event information

## Interview framing

This work is intended to demonstrate that the tester can:

- derive tests from product requirements and specifications;
- prioritize release risk;
- distinguish functional, regression, compatibility, boundary and exploratory testing;
- identify appropriate automation candidates without forcing every test into automation;
- avoid claiming results that were never executed;
- communicate failures in a reproducible form that engineering can act on.
