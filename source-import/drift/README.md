# Native renderer regression checks

`atlas-render-reuse.patch` records the change applied to the canonical local Drift source. Apply it relative to the native project root, not the Atlas root. Expected source hashes and verification results are in `docs/DRIFT_RENDER_OPTIMIZATION.md`.

`RenderSmoke.cs` exercises the current renderer without collecting mouse input or changing a driver. Compile it as an x64 console executable using the .NET Framework compiler, referencing `System.Drawing.dll`, `System.Windows.Forms.dll` and the canonical `SensitivityFinder.exe`. Put the resulting executable beside `SensitivityFinder.exe` so the assembly resolves.

`RenderComparison.cs` loads two Drift executables by absolute path, renders normal and lesson fixtures and compares framebuffer bytes. It returns nonzero on a mismatch, empty readback or unavailable renderer. Its one-shot timing output is diagnostic only; it is not a performance benchmark result.

Example after compiling the comparison executable:

```powershell
.\RenderComparison.exe 'C:\path\to\previous\SensitivityFinder.exe' 'C:\path\to\current\SensitivityFinder.exe'
```

Use a local Windows desktop with hardware OpenGL. These checks do not start aiming trials or apply Raw Accel settings.

## Accuracy pass

`accuracy-pass.patch` applies to the canonical native project after the renderer pass. It contains arrival/frame diagnostics, four-pair confirmation, physical calibration, installed-calculator parity tests and backward-compatibility checks. Apply it from the native project root; do not apply it to the Atlas website root. See `docs/DRIFT_ACCURACY.md` in the Atlas repository for the measurement boundaries and test commands.

The patch was applied to a clean copy of the backed-up source and compared against the canonical files. Profiles, sessions, calibration reports, binaries and installed vendor libraries are excluded.
