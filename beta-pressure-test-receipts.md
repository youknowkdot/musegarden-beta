# MuseGarden Beta Slice: Pressure Test Receipts

**Date:** 2026-09-25
**Status: Public-Facing**
**Outcome:** All findings resolved and re-verified 2026-09-25. No open issues.
**Target:** The beta slice as a single static HTML file (inline CSS/JS, ~50KB), served from a local test server.
**Live pass target:** A temporary public test URL used only so a test browser could reach the page. Removed after the pass.
**Scope:** Find everything that can go wrong, test far beyond the happy path, keep all receipts.
**Build under test:** 2D placeholder art with a visible notice reading `PLACEHOLDER ART · FINAL 2D ARTWORK IN DEVELOPMENT`. No production artwork in the file. No 3D references anywhere.

## Severity totals

| Severity | Found | Status |
|---|---|---|
| P0 (ship-blocker) | 0 | None |
| P1 (spec/economy question, needed a design decision) | 1 | Resolved |
| P2 (real issue, lower urgency) | 6 | All resolved |
| OK (verified correct under pressure) | 24 | Verified |
| UX nits from the live pass | 4 | 3 fixed, 1 watch item |

## Key findings and how they were resolved

1. **P1:** Bounties paid 48 reservoir water total (8/15/25) on top of XP, but the beta spec listed XP-only rewards while the page footer claimed the numbers matched the locked spec. **Resolved:** XP plus equal reservoir water is the intended design (1 XP earned = 1 reservoir unit on every earn, including bounties). The built UI was correct; the spec text was wrong. No code change needed.
2. **P2:** Dragging the timeline slider to day 45 left the 60x button lit while time was frozen; reaching day 45 through live play correctly auto-paused. **Fixed:** scrubbing to day 45 now auto-pauses exactly like live playback.
3. **P2:** Reloading wiped all progress (no stored state at all). **Resolved:** the garden now persists device-locally across reloads via an event-sourced journal in localStorage, with strict sanitization on load.

## Screenshot status

The live-browser pass completed 2026-09-25 against the temporary test URL (since removed). Five screenshots were captured and are archived with this report:

1. `1-rapid-click-abuse.png`: state after the rapid-click abuse sequence
2. `2-pre-reload-bloom-128xp.png`: Bloom at 128 XP before reload
3. `3-post-reload-full-reset.png`: unplanted state after reload (full reset, pre-persistence)
4. `4-full-page-layout.png`: full-page layout at desktop width
5. `5-quests-bounties.png`: quest and bounty cards

## Live-pass visual confirmations

- **Placeholder notice: confirmed visible.** Banner reads `PLACEHOLDER ART · FINAL 2D ARTWORK IN DEVELOPMENT`.
- **No brown circle: confirmed.** Planted tree art shows no brown circle or ellipse at the base in any stage.
- **Stage XP thresholds: confirmed live.** Seed 0 XP → Sprout 16 XP ("112 XP TO BLOOM") → Bloom 128 XP ("272 XP TO CANOPY") → Canopy 400 XP ("FULL CANOPY").
- **Thirst/withering timing: confirmed live at 1440x.** Thirsty around Day 1, 09:13 (log: "became thirsty"); withering around Day 2, 09:13 (log: "started withering"); art visibly darker and drooping when withering.
- **Day-45 freeze: confirmed live.** Slider to 45 stopped the clock with time frozen. Matched P2-1.
- **Rapid-click abuse: confirmed live.** Five fast plant clicks produced exactly one plant event (later clicks followed the water path). Ten fast water clicks applied exactly one watering. No double XP, no duplicate log entries, no errors.
- **Reload: confirmed live.** Before the persistence fix, reload returned a full reset to the fresh garden. P2-4 verified in a real browser.
- **Quest double-claim: confirmed impossible live.** Completed quests render DONE and disabled; claimed bounties render CLAIMED and disabled; repeat attempts are refused. Completions are keyed by day and quest.
- **Backward scrub: confirmed live.** Scrubbing backward and forward across days kept the clock, reservoir, and journal consistent; the journal is not truncated by scrubbing, quests refresh per demo day, and claimed bounties stay claimed.
- **Mobile 390px: not verified.** The test browser could not resize viewports. The CSS has breakpoints at 980px, 700px, and 410px that look adequate on inspection, but genuine 390px rendering needs a real device or a resizable browser.

## Method

A Node.js harness extracted the page's exact inline script and executed it under a simulated DOM with a deterministic clock, driving the real code paths: planting, watering, quest and bounty claims, demo stage jumps, timeline scrubbing (0 to 45 days), all five speeds, resets, and spam-clicking. **122 checks passed, 0 failed.** Two edge-case batches added 13 more checks (13 pass, 1 real finding). A follow-up batch added 6 checks for the P2-7 demo-jump-then-water bounty exploit (6 pass, 1 real finding, fixed and re-verified) plus a 27-check re-run of the full P2 regression suite (27 pass, 0 failed). Every discrepancy between test expectations and app behavior was investigated with focused debug scripts; all resolved as test-script expectation errors except the slider-to-45, P2-6, and P2-7 findings. Source audits covered what the harness could not (timer throttling, storage behavior, art markup). The build under test was not modified during QA.

Key measured receipts: 10-day evaporation displayed `35.0` (exact 35.026, display rounds to 1 decimal); a 45-day greedy playthrough kept the reservoir within [0, 100]; withering for 1.2 days from 26 XP landed at ~20.1 XP; 1440x advanced about 1 sim-day per real second; post-germination watering moved XP from 16 to 26; timeline replay of 45 → 0 → 45 reproduced byte-identical state.

**Reproducibility pin (2026-09-25):** the build under test is `musegarden-beta-slice.html` at this repo's root (git blob `19f5335eadf1a863f87be4c60cc96da18c7490be`). The harness is published at `qa/harness/` with exact commands and expected results in `qa/harness/README.md`. Re-running against the pinned build: `node qa/harness/harness.js` gives 121 PASS, 1 FAIL (the single FAIL is M4 "no localStorage", superseded by the 2026-09-25 persistence decision, see P2-4); `node qa/harness/edge2.js` gives 8 PASS, 0 FAIL. The 122/0 figure above was recorded against the pre-fix build during QA; the pin reflects the final shipped build.

---

## Findings

### P1-1. Bounty rewards granted reservoir water the spec did not list

- **Severity:** P1
- **Repro:** Fresh load → select seed orb → plant → water (germination starts) → claim the "First Planting" bounty. The reservoir rose 58.5 → 66.5 (+8 water) and the event log read "First Planting claimed. +8 XP, +8 reservoir units."
- **Expected:** Per the beta spec, bounty rewards were XP only (8 / 15 / 25 XP). The page footer stated "Growth numbers match the locked spec."
- **Actual:** Each bounty granted equal XP and reservoir units: 8, 15, and 25 water respectively, 48 water total across all three. The bounty cards openly advertised "+XP / +water", so the code was self-consistent; the mismatch was against the written spec.
- **Why it mattered:** 48 water is about 80% of a full reservoir. In a demo about reservoir management, that is a material economy input.
- **Resolution (2026-09-25):** XP plus equal reservoir water is the intended design. The built UI was correct and the spec text was wrong, so no code change was needed. The footer claim stands as accurate.
- **Spec diff (pinned 2026-09-25):** the amended spec was the *beta spec text*, not the canon. Before: "bounty rewards were XP only (8 / 15 / 25 XP)." After: "bounty rewards are 8 / 15 / 25 XP plus an equal number of reservoir units." Basis: the locked canon (`musegarden-concept-public.md`: "1 XP earned = 1 reservoir unit, on every earn (quests and bounties)"), locked 2026-09-23, two days before this QA run. No canon lock was moved; the canon was confirmed on 2026-09-25 and the beta text was corrected to match it.

### P2-1. Slider dragged to day 45 did not auto-pause; speed button misled

- **Severity:** P2
- **Repro:** Plant → set speed 60x → drag the timeline slider to 45 → observe the speed control.
- **Expected:** Consistent end-of-timeline behavior: reaching day 45 stops time and drops speed to pause, the way live playback does (verified: reaching day 45 through ticks auto-paused and capped the slider at 45).
- **Actual:** The 60x button stayed highlighted, the clock sat at Day 45, and time never advanced (the tick handler early-returned at the cap). The UI implied time was flowing at 60x while it was frozen.
- **Resolution (2026-09-25):** Fixed. Scrubbing to day 45 now sets speed to pause, exactly matching live-play behavior. Scrubbing back keeps the pause until a speed is chosen.

### P2-2. Demo stage-jump buttons silently hydrated the plant

- **Severity:** P2
- **Repro:** Plant → water → use DEMO GROWTH to jump to Bloom → check water status immediately.
- **Expected:** The control sets "exact stage and XP" and nothing else.
- **Actual:** Every stage jump reset the watering clock to the current time, so the plant read Hydrated with the next watering 24h out. Anyone using the demo buttons to stage-manage a test (for example, jumping to Canopy and then demonstrating withering) silently received a 24h hydration they did not ask for.
- **Resolution (2026-09-25):** Fixed. Stage jumps now set exact stage and XP and leave the watering state untouched.

### P2-3. Background tabs lost sim time at high speeds

- **Severity:** P2
- **Repro (source):** The 1-second interval capped each frame's simulated delta at 1000ms of real time. A background tab throttled to about 1 tick per minute at 1440x advanced roughly 24 sim-hours per real hour instead of the expected 60 sim-days.
- **Expected:** Displayed time tracks the selected speed, or the UI warns that background play drifts.
- **Actual:** Elapsed real time while throttled was silently discarded; the clock fell arbitrarily far behind the selected speed with no indication.
- **Resolution (2026-09-25):** Fixed. The tick now uses the real elapsed delta, so background tabs track the selected speed. Foreground cadence is unchanged.

### P2-4. Reload wiped all progress

- **Severity:** P2
- **Repro (source):** The page used no localStorage, sessionStorage, or IndexedDB (verified by source search). Reloading at any point returned a fresh garden; the journal lived in memory only.
- **Expected:** To be decided: "local-only state" could mean ephemeral-per-session (the behavior at the time) or persistent-across-reload.
- **Actual:** A tester who accidentally reloaded mid-playtest lost everything, including journal history.
- **Resolution (2026-09-25):** Persistent device-local state across reloads. The page is event-sourced, so the saved journal, current time, and speed replay deterministically on load. Saves happen on every action, scrub, speed change, and clock tick; loading sanitizes strictly (version check, invalid actions dropped, time clamped to the 45-day window); storage failure degrades gracefully to ephemeral behavior; Reset clears the save. Nothing leaves the device.

### P2-5. Dead `.tree-mound` CSS remained after the mound removal

- **Severity:** P2 (cleanup, harmless)
- **Repro (source):** Unused `.tree-mound` positioning and drop-shadow rules remained in the stylesheet, but the tree renderer no longer emitted any mound markup (verified: planted art contained no `tree-mound` element and no brown soil fills).
- **Expected:** A removed feature leaves no dead styles.
- **Actual:** Harmless dead CSS, flagged so a future reader would not assume a mound still renders.
- **Resolution (2026-09-25):** Fixed. The unused rules were removed.

### P2-6. Demo stage skip granted "Sprout Emerges" without ever being a Sprout

- **Severity:** P2
- **Repro (live):** Fresh plant → click the demo buttons straight to Canopy (skipping Sprout and Bloom) → the "Sprout Emerges" bounty unlocked and was claimable.
- **Expected:** A bounty named "Sprout Emerges" should require the tree to have been a Sprout.
- **Actual:** The unlock condition was `stage >= 1`, so jumping straight to Canopy satisfied it. Each demo click fired exactly once with correct XP (Sprout 16, Bloom 128, Canopy 400), so the issue was the bounty gate, not the demo buttons.
- **Resolution (2026-09-25):** Fixed. The bounty now requires the tree to have genuinely reached Sprout, through germination completing or watering-driven XP growth. A naturally grown sprout unlocks and claims normally.

### P2-7. Demo jump to Canopy followed by watering unlocked "Sprout Emerges"

- **Severity:** P2
- **Repro (harness):** Fresh plant → water (germination starts) → demo jump straight to Canopy → scrub 36h (thirsty) → water. The "Sprout Emerges" bounty unlocked and was claimable, even though the tree never genuinely occupied Sprout.
- **Expected:** Demo jumps never unlock the bounty, per the P2-6 fix.
- **Actual:** The P2-6 fix kept the demo jump itself from setting the sprouted flag, but watering afterward ran `updateStage()`, whose `stage >= 1` gate set sprouted on the already-jumped stage. The direct-jump path stayed locked; only jump-then-water leaked.
- **Resolution (2026-09-25):** Fixed. `updateStage()` now sets the sprouted flag only on a genuine stage increase (stage above its previous value), never on a stage that merely persists. Verified: 6/6 new checks pass (exploit path stays locked, claim attempt grants nothing, natural germination still unlocks and claims 15 XP + 15 water, jump-to-Sprout then water stays locked) and the full P2 regression suite passes 27/27 with no regressions.

### UX nits from the live pass

1. **No "end of timeline" indication.** When time stopped at day 45 there was no label or state change saying the timeline had ended. **Fixed:** the clock now shows "· END OF TIMELINE" at day 45, cleared when scrubbing back.
2. **Clock mixed wall-clock time with elapsed days.** "Day N, HH:MM" read like a calendar date, but HH:MM was anchored to absolute midnight while the day counter ran from demo start, so it wrapped and read as going backward. **Fixed:** the clock now shows honest elapsed time anchored at demo start ("Day 0 + 00:00 elapsed"), which is strictly monotonic and matches quest-day boundaries.
3. **Speed buttons exposed no pressed state to assistive tech.** The active speed was a visual highlight only. **Fixed:** every speed button now carries `aria-pressed`, updated on each render.
4. **Quest revert anomaly (unreproduced, watch item, not a confirmed bug).** In one observation while demo time ran at 60x, completing the second quest via keyboard appeared to revert the first (0 XP, both quests back to completable, quest log entry gone). Under controlled conditions with time paused, both quests complete and persist correctly. The suspect observation showed internally inconsistent clock and slider values, pointing to a race between the page's every-second re-render and the tester's action capture rather than a page bug. It could not be reproduced, so it is flagged, not filed.

---

## Verified OK (24 items, each with receipt)

1. **Planting flow.** Select orb → plant → single "Kindred Tree planted" event; double-plant impossible (a second click follows the water path, never a second plant event).
2. **No-orb guard.** Clicking the tree with no orb selected shows "Select a seed orb first"; nothing planted.
3. **Water cost and XP.** Thirsty watering costs exactly 1.5 reservoir and grants exactly 10 plant XP (16 → 26 verified post-germination).
4. **Hydrated block.** Immediate re-watering shows "hydrated"; reservoir and XP unchanged; no duplicate water event.
5. **Germinating block.** Watering during the 48h germination shows "Germination is underway" with remaining time; no double-spend.
6. **Low-reservoir block.** Below 1.5 units, watering shows "Reservoir low. 1.5 units needed." The boundary is exact: exactly 1.5 is allowed.
7. **Thirst timing.** Hydrated at 21.6h after watering; thirsty just past 24h with a "became thirsty" event. Watering exactly on the 24h mark logs thirst and water at the same timestamp and still applies.
8. **Withering timing.** At exactly 48h dry the tree reads Thirsty (not Withering); withering begins just after 48h with a "started withering" event. Matches the spec's "around 48 hours".
9. **Withering decay and stage floor.** −5 XP/day while withering; earned stages never drop (26 XP withered 1.2 days → ~20.1, stayed Sprout; withering while exactly on the Bloom floor of 128 XP shows no loss, which is the floor working as specified, not a stuck counter).
10. **Watering stops withering.** Watering a withering tree logs "stopped withering", restores Hydrated, and halts decay.
11. **Reservoir evaporation.** 60 → 58.5 after plant+water; 10 days untouched → 35.0 displayed (exact 35.026, 1-decimal rounding). Compounding 5%-daily confirmed.
12. **Reservoir cap and floor.** A 45-day greedy playthrough (daily quests, water-when-thirsty, bounty claims) never exceeded 100 and never went negative.
13. **Daily quests.** Two quests per day, each once per day, +1 account XP and +1 water; completed quests render DONE and disabled; completion resists double-claim even when the disabled guard is bypassed; day-boundary reset works.
14. **Bounty triggers and one-time claims.** First Planting unlocks on plant; Three Waterings unlocks exactly on the 3rd watering (the germination water counts, verified); Sprout Emerges unlocks when the tree genuinely reaches Sprout (demo stage jumps no longer unlock it, per the P2-6 fix); claimed bounties render CLAIMED and disabled and cannot be re-claimed.
15. **Account XP totals.** 8 + 15 + 25 = 48 XP across all three bounties, verified in the counter.
16. **Demo stage thresholds exact.** Seed 0 / Sprout 16 / Bloom 128 / Canopy 400 XP, each jump logged with a timestamped event.
17. **Germination.** First watering starts a 48h germination with a live countdown and progress bar; completion sets Sprout at 16+ XP and logs "Germination complete". Demo-reset to Seed re-arms germination correctly (water → 48h → Sprout 16).
18. **Germination/withering 48h collision.** Germination completes at exactly 48h while withering would begin just after; ordering is sane (XP raised to 16 first, decay starts from the floor). The tree reads GERMINATING, not a stage, until sprout.
19. **Speeds and pause.** Pause, 1x, 60x, 240x, 1440x all advance correctly (1440x ≈ 1 sim-day per real second); pause holds the clock; speed buttons show exactly one active state.
20. **Day-45 hard stop.** Live playback halts at day 45, speed drops to pause, the slider caps at 45, and further ticks do not advance.
21. **Timeline replay determinism.** Scrubbing 10 → 2 → 10 and 45 → 0 → 45 reproduces byte-identical state; scrubbing to 0 faithfully replays the journal up to the start (verified against a fresh identical opening). Journal entries are time-ordered, so replay ordering is stable.
22. **Scrub-back branching.** Committing a new action after scrubbing back truncates the journal's future entries (verified: fewer water events than the full replay); the old future does not leak back in.
23. **Event log.** Chronological, timestamped (D3 08:00 format), capped at the newest 120 entries; no duplicates across replay.
24. **Art compliance (source level).** Placeholder notice present verbatim; planted tree art contains no `tree-mound` element and no brown soil fills; the unplanted target is a dashed circle with a faint radial tint; no 3D model or library references anywhere. Rendering confirmed by the live pass.

---

## Design notes

- The **48h germination** is beta-only scaffolding for testing. The design specifies sprouting follows XP thresholds (Fast and Standard seeds on the first watering, Slow seeds on the second); the timer must not be treated as the real rule.
- The **unplanted soil target** (dashed circle) is visually distinct from the removed mound in source, and the live pass confirmed it reads correctly.
- No P0s. Nothing crashed, soft-locked, or corrupted state across 135 automated checks, including spam-clicking (10 rapid water clicks applied exactly one), boundary scrubs, and a 185-action 45-day journal.

## Evidence

The full simulation harness, raw check outputs, focused debug scripts, and the five live-pass screenshots are archived with this report.
