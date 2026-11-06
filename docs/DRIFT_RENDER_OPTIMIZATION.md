# Drift renderer reuse

The canonical native app is `sensitivity-finder/SensitivityFinder.exe` in the Atlas workspace. This pass changes `src/ArenaRenderer.cs` only.

- Compile the static room and grid into an OpenGL display list once per renderer. If allocation is unavailable, retain the previous immediate rendering path.
- Allocate the three fixed-size HUD textures once; upload changed pixels with `glTexSubImage2D` rather than reallocating texture storage on each HUD change.
- Delete the display list with the other renderer resources on disposal.

Mouse input, frame pacing, scoring, curve math and driver writes are unchanged.

## Verification

The native build and the full `test.ps1` suite passed. Tests use isolated fixtures and mock driver writes. A separate graphics smoke check on an NVIDIA GeForce RTX 3080 exercised changing HUD text, lesson panels, resizing and disposal without OpenGL errors.

Normal and lesson fixtures at 640 x 360 produced byte-identical framebuffer readbacks against the previous executable. Timing varied across fixtures; these checks do not establish an FPS or input-latency improvement. Further performance work should collect repeated frame-time and allocation measurements during representative workloads.

The public regression harnesses and source patch are in `source-import/drift/`. They contain no player profiles or session data. Run the harnesses from a local Windows desktop with the native app available; an unavailable hardware renderer is a failed or not-run graphics check, not a pass.

Backup: `sensitivity-finder/backups/atlas-render-pass-1/`.

Renderer SHA-256 before: `4f4545159341429387ff6cb8e553ed92863755913757a8af39e6f2ceedcd33a9`.
Renderer SHA-256 after: `b35b9a3ad7f454daf0e5396e688db3317d4b0d3a500ac6b1d4b4885b336938a1`.
