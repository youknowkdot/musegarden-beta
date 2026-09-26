# MuseGarden Beta Slice

**Status: Public-Facing**

A playable demo slice of MuseGarden's core loop: plant a Kindred Tree seed orb, keep its reservoir watered, and grow it from seed to full canopy across a 45-day demo timeline.

## Contents

- `musegarden-beta-slice.html`: the playable beta. A single static file (no build step, no backend, no network calls). Open it in any modern browser.
- `beta-pressure-test-receipts.md`: the full QA teardown: 141 automated checks plus a live-browser playtest, every finding with its repro and resolution. No open P0/P1 issues.
- `musegarden-concept-public.md`: the full project concept. Every decision tagged [LOCKED], [PROPOSED], or [OPEN]. The single source of truth for the design.
- `evidence/screenshots/`: five screenshots captured during the live-browser pass.

## Teardown documents

The full design teardown, built for the town review. All public-facing.

- `docs/musegarden-concept.md`: condensed working extract of the public concept.
- `docs/tokenomics.md`: one-page $MUSEGARDEN tokenomics reference (supply, fees, vesting split, burns).
- `docs/threat-model.md`: adversarial analysis of the locked design.
- `docs/xp-ledger-standard.md`: the XP ledger public standard (wire format, receipt schema, verification rules).
- `docs/verification-checklist.md`: the full verification checklist, every claim testable.
- `examples/ledger-worked-example.md`: a synthetic, replayable playtest receipt walking the ledger end to end.
- `memos/compost-model-2026-09-23.md`: the compost economy decision memo behind the locked 30% credit rate.

## Playing it

Open `musegarden-beta-slice.html` in a browser. Select the seed orb, plant it, and water it when it gets thirsty. The clock runs at 60x by default; use the speed controls or drag the timeline to scrub across the 45 days. Daily quests and one-time bounties pay XP and reservoir water. Progress saves on your device automatically.

The artwork is placeholder. Final 2D artwork is in development.

## Design notes

- Watering earns no XP. XP earned from activity fills the reservoir; water keeps the tree alive and growing.
- The 48-hour germination timer is demo scaffolding for testing. The design calls for sprouting on XP thresholds: Fast and Standard seeds sprout on the first watering, Slow seeds on the second.
