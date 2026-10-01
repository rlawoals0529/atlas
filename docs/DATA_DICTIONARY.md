# Atlas data dictionary

Atlas keeps product facts, evidence and modeled fields separate. This document describes the canonical catalog fields contributors are most likely to touch.

The TypeScript source of truth for runtime shapes is `src/shared/types.ts`. The canonical product records live in `data/catalog*.json`.

## Shared product fields

Every catalog product has:

| Field | Meaning |
| --- | --- |
| `id` | Stable internal identifier. Do not recycle an old ID for a different product. |
| `slug` | Stable URL/search-friendly identifier. Must remain globally unique. |
| `type` | `mouse`, `mousepad`, `skate`, `keyboard`, or `switch`. |
| `brand` | Manufacturer/brand name as presented publicly. |
| `model` | Product model/variant name. |
| `status` | `current`, `announced`, or `discontinued`. |
| `msrpUsd` | Manufacturer/list MSRP in USD when a defensible source exists. Missing is better than guessed. |
| `summary` | Short factual description; not a review score or marketing verdict. |
| `tags` | Search/filter descriptors. Tags must not smuggle unsupported claims into the catalog. |
| `sources` | Traceable source definitions used by evidence records. |

## Source records

Each `sources[]` item contains:

| Field | Meaning |
| --- | --- |
| `id` | Product-local source key referenced by evidence notes. |
| `label` | Human-readable source title. |
| `url` | Direct source URL or repository-local research/document path. |
| `kind` | `manufacturer`, `independent`, `community`, or `editorial`. |
| `checkedAt` | Date Atlas last verified the cited source, formatted `YYYY-MM-DD`. |

`checkedAt` is not a publication date. CI rejects malformed or future source-check dates.

## Evidence notes

Type-specific products use an `evidence` map:

```json
{
  "evidence": {
    "specification": {
      "sourceIds": ["manufacturer-product-page"],
      "confidence": "high",
      "note": "Manufacturer publishes 3.5 mm total travel."
    }
  }
}
```

Fields:

- `sourceIds` — IDs from the same product's `sources` array.
- `confidence` — `high`, `medium`, or `low`; this describes support for the field/model, not product quality.
- `note` — methodology, tolerance, disagreement, model caveat or interpretation that would be lost in the scalar field alone.

### Evidence classes

Atlas intentionally keeps these distinct:

- **manufacturer** — official product pages, manuals, specifications and announcements;
- **independent** — third-party measurements, controlled reviews or specialist specification references;
- **community** — attributable user observations with context;
- **editorial** — Atlas research/methodology material.

A manufacturer claim is not converted into an independent measurement simply because Atlas stores it.

## Keyboard switches

`KeyboardSwitchProduct.specs` supports:

| Field | Meaning |
| --- | --- |
| `technology` | `mechanical`, `hall-effect`, `optical-analog`, `tmr`, or `other`. |
| `feel` | `linear`, `tactile`, or `clicky`. |
| `initialForce` | Published initial/start force, only when the source defines it. |
| `actuationForce` | Published operating/actuation force. Do not substitute tactile peak or initial force. |
| `bottomOutForce` | Published end/bottom-out force. |
| `preTravelMm` | Travel before the published actuation/operating point. |
| `totalTravelMm` | Full switch travel. Required by the current switch schema. |
| `factoryLubed` | Store only when the source makes the factory-lube state clear. |
| `ratedKeystrokesM` | Published lifetime in millions of operations. |
| `magneticFluxGs` | Magnetic flux values and optional PCB-thickness condition when actually published. |
| `compatibility` | Board/system-specific compatibility caveats for magnetic technologies. |

Force points preserve the source convention as either `gf` or `cN`. The UI may mathematically normalize force for ordering, but displayed catalog values retain their source units.

For tactile switches, a tactile/pressure-point force is **not automatically bottom-out force**. If the schema has no exact field for a published force point, preserve the distinction in the evidence note rather than storing it under the wrong field.

Current switch records additionally require a manufacturer source, at least one published force point and explicit product media. Hall-effect/TMR records require a compatibility note.

## Keyboards

Important keyboard fields include:

- form factor and layout;
- switch technology and stock switch;
- advertised polling ceiling;
- adjustable actuation range/step where documented;
- Rapid Trigger / SOCD-style behavior / analog input;
- hot-swap and connectivity;
- case/plate/keycap/mount details;
- software/configurator;
- dimensions and weight when sourced.

Minimum adjustable actuation distance is not latency, and advertised polling support is not proof of measured effective polling.

## Mice

Mouse records combine physical dimensions and sourced hardware specifications with a separate Atlas fit model.

Physical/specification fields include:

- length/width/height/grip width;
- weight;
- shape/hump/front flare/side curvature;
- sensor and polling ceiling;
- connectivity;
- switch/encoder/MCU details when sourced;
- button/profile/configuration features;
- battery fields when source conditions are clear.

`fit` values are comparative Atlas model inputs, not physical measurements. They are governed by the methodology documented in `research/FIELD_MODEL.md`.

The optional `performance` block is reserved for measured values with explicit methodology/source IDs.

## Mousepads

Physical fields describe surface/base construction, firmness, dimensions, thickness and stitched edges.

`feel` contains normalized Atlas comparison dimensions such as static speed, dynamic speed, stopping power, texture and humidity resistance. These are comparative indices, not invented friction coefficients.

## Skates

Skate records separate:

- material/format/physical construction;
- normalized speed/control/noise/durability dimensions;
- surface compatibility.

Skate feel is surface-dependent; do not describe a skate as universally fast/slow without the relevant pad context.

## Product media

Media metadata is presentation-only and does not replace canonical product evidence.

- general product media: `src/shared/productImages.ts`;
- switch media: `src/shared/switchProductImages.ts`.

Current switch records must have an explicit verified image. Other current input products may use the Worker manufacturer-source fallback when permitted by validation.

Image entries retain:

- direct media URL;
- source/product-page URL;
- descriptive alt text;
- source credit.

## Missing values

Missing data should stay missing when the evidence is weak or contradictory.

Acceptable responses to disagreement include:

- omit the scalar field;
- preserve the disagreement in an evidence note;
- lower confidence when appropriate;
- add another source before resolving it.

Do not average conflicting manufacturer/reviewer values merely to produce one number.

## Validation

Before a data PR is ready, run:

```bash
npm run data:validate
npm run media:validate
npm run switch-index:validate
npm run product:validate
npm run check
```

The full path is:

```bash
npm run verify
```

The weekly source-health workflow separately checks cited URLs. Only confirmed HTTP 404/410 results are treated as hard broken; authentication blocks, rate limits and transient network/server errors remain separate states.
