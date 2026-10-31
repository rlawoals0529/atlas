# Drift and Atlas

Drift should remain a standalone native application and have its own repository.
Atlas owns product research and a browser preview; Drift owns raw-input trials,
curve search, saved evidence, driver application and restoration. This pass
does not create a remote Drift repository.

## Canonical native workspace

The `sensitivity-finder/` folder inside the Atlas workspace is now the primary
native Drift source and build location. Use its `SensitivityFinder.exe` (6.1.1)
or the local `Open Drift` launcher. The former D: copy is a backup.
The folder and launcher are excluded from the Atlas repository to keep local
profiles, sessions and binaries private. Native changes must be made here.

The native presentation pass adds Atlas colors, workspace and profile tabs,
metadata labels and setup guidance. Calibration and driver workflows remain native.

## Implemented bridge

Sensitivity Lab has Convert, Match distance and Drift curves workspaces. The
curve desk accepts a Drift `SavedProfile` with `Schema: 1`, `Setup` and `Response`,
or the smaller `atlas-drift-preview` format below. Parsing and plotting stay in
the tab. Only DPI, baseline cm/360 and explicit curve parameters are retained.
Names, paths, Raw Accel payloads, session logs and claims of verification are
discarded. Imported files are not sent to analytics or persisted to localStorage.

Supported mathematics:

- Natural / Gain, including the cancellation-safe expression near onset.
- Classic exponent 2 / Gain, uncapped.
- Lookup tables in Velocity mode, with float32 knots, first-knot ratio below
  the table, linear output-velocity interpolation and final-segment extrapolation.

The graph shows horizontal multiplier against counts/ms. The probe converts
that speed to cm/s using user-supplied DPI. Distance readouts are constant-speed
cm/360 equivalents, not an integrated accelerated turn or a measured CPI value.
Whole mode, normalization off and no additional driver transforms are assumed.
Preview bounds reject malformed values rather than silently changing models.

The browser neither runs Drift's native aim protocol nor claims to find an
optimal response. Defaults and edits are untested examples. No driver installer,
loopback bridge, file-system permissions or native application launcher is added.

## Source snapshot and parity

The native source was inspected read-only on October 30, 2026. These hashes record the original algorithm snapshot before the local copy and presentation pass described above:

| Native Drift source | SHA-256 |
| --- | --- |
| `src/Model.cs` | `6987BB52028D4355EB8602DBF9986DEC529FCAECAF05431589F3F7B4A9A979DD` |
| `src/CuratedCurves.cs` | `B60514507FA88040E77D07A8A11B6132F3F3F16BECC4117A0C0CBE92E3BCFE8B` |
| `src/ProfileLibrary.cs` | `C9585DE48AD3996F808D74A552826FCBF6A9E60C5DC2B0DDDE2274B26E3E0F48` |

`Candidate.Multiplier`, `MathUtil.NaturalGain` and
`CurveMath.VelocityRatio` were extracted into a temporary pure-math C# runner.
Its 30 synthetic calculations are saved in `tests/drift-reference.json`.
`tests/drift.test.ts` compares the TypeScript port against those outputs and tests
onset, limits, interpolation, extrapolation, import validation and data stripping.
These are numerical comparisons, not human aiming results or live-driver tests.

## Portable preview format

```json
{
  "schema": 1,
  "format": "atlas-drift-preview",
  "dpi": 800,
  "baseCm": 40,
  "curve": {
    "kind": "natural",
    "baseGain": 1,
    "yRatio": 1,
    "limit": 1.5,
    "offset": 5,
    "decay": 0.1,
    "acceleration": 0,
    "points": []
  }
}
```

This format is implemented by Atlas only. It is not Raw Accel `settings.json`
and is not currently a native Drift import. Adding native import must create a
new **untested draft**, never a tested result or an automatic driver change.

## Keeping both projects maintainable

1. Put the existing Drift source/build scripts and a reviewed asset allowlist
   in a separate repository. Exclude sessions, profiles, player-profile.json,
   backups, executables, exports and personal paths/defaults. Review the existing
   source's user-specific setup defaults before publishing any baseline.
2. Add the versioned preview importer/exporter to Drift as a small independent
   change. Keep driver payload generation and trial evidence native.
3. Publish language-neutral reference vectors with each native curve-engine
   release. Keep C# and TypeScript implementations in their own repositories,
   checked against those same vectors; don't attempt to share Windows UI code.
4. Replace this file-hash pin with a reviewed Drift commit/release once that
   repository exists. Update the Atlas adapter in a focused PR when it changes.

No cross-chat work was overwritten and no private profiles were published.

Primary algorithm context: [Raw Accel 1.6.1 guide](https://github.com/RawAccelOfficial/rawaccel/blob/v1.6.1/doc/Guide.md).
