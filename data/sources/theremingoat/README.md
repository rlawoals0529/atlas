# ThereminGoat score snapshots

The three CSV files are unmodified exports from [ThereminGoat/switch-scores](https://github.com/ThereminGoat/switch-scores/tree/324e870272e83a96ff3f8e13b15b9f4671166674), retrieved October 30, 2026. The source commit is `324e870272e83a96ff3f8e13b15b9f4671166674`; the sheets themselves show October 24, 2026 in their headers. Some scoring dates are later than that header. Atlas preserves those dates as published.

- `overall.csv`: `1-Composite Overall Total Score Sheet.csv`, scale 100.
- `hard.csv`: `1-Composite Hard Total Score Sheet.csv`, scale 70.
- `soft.csv`: `1-Composite Soft Total Score Sheet.csv`, scale 30.

Run `npm run scores:generate` to regenerate the lazy frontend snapshot. `npm run scores:validate` compares it against these source files. Only the first total-ranking section is imported; subsequent type-specific rankings and manufacturer statistics repeat data and are excluded. All 474 source rows remain, including differently dated rescores. No fuzzy joins to Atlas product records are performed.

Scores, ranks, names, dates and manufacturers are attributed reviewer data, not Atlas measurements or compatibility claims. Time-weighted values are frozen exactly as exported, without recalculating age decay. Hard has no weighted column. Original source ranks remain visible even when the user changes sorting or filters.

The older scorecard-link directory uses its own September 30 snapshot and remains a separate metadata-only directory. See [the reviewer's methodology](https://www.theremingoat.com/shorts/a-scorecard-time-change) for the distinction between timeless and time-weighted scores. Original reviews and scorecards remain hosted by their author.
