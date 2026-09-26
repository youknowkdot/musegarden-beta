# Beta pressure-test harness

Re-runnable QA harness for the MuseGarden beta slice. Each script extracts the
page's exact inline `<script>` and runs it under a simulated DOM with a
deterministic clock, driving the real code paths the way a player would:
planting, watering, quest and bounty claims, demo stage jumps, timeline
scrubbing (0 to 45 days), all five speeds, resets, and spam-clicking. No
browser needed.

## Build under test

`musegarden-beta-slice.html` at the repo root.
Git blob: `19f5335eadf1a863f87be4c60cc96da18c7490be`

## Requirements

Node.js (re-verified on v24; expected to work on 18+). No dependencies beyond
the Node standard library.

## Commands

Run from this directory. Each script takes the build path as an optional
argument; the default is `../../musegarden-beta-slice.html` (the repo root).

- `node harness.js`: the main batch. Expected: **121 PASS, 1 FAIL**.
  The single FAIL is M4 ("no localStorage/sessionStorage, reload = full
  reset"), superseded by the 2026-09-25 decision to persist demo state in
  localStorage (see the receipts, P2-4). It is a retired expectation, not a bug.
- `node edge2.js`: the corrected edge-case batch. Expected: **8 PASS, 0 FAIL**.
- `node edge.js`: the original edge batch, kept for the record. Expected:
  **6 pass, 5 fail**. Four were harness-script bugs, corrected in `edge2.js`;
  the fifth was the real slider-to-45 finding, fixed in the build and now
  passing in `edge2.js`.
- `debug1.js` through `debug7.js`: focused scripts used during QA to resolve
  harness-vs-app discrepancies. Informational; every discrepancy was resolved
  as a harness-expectation error except the three documented findings.

The `*-output.txt` files are the outputs recorded during the original QA run,
kept for comparison. Each run also writes `qa-results.json` into this
directory.

## Note on the 122/0 figure

The receipts record 122 checks passing with 0 failures from the original run
against the pre-fix build. The pin above reflects the final shipped build,
where the only delta is the retired M4 expectation.
