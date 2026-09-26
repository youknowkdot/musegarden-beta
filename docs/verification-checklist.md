# MuseGarden Verification Checklist

**Status: Public-Facing**

**Status:** staged publication tree. Every file here is a publication candidate.
**Canon source:** `musegarden-concept-public.md` (canon through 2026-09-24).
**Purpose:** the concrete test and audit bar behind the implementation-first standard. The town will judge us against this. Every item is falsifiable: it states a setup, an action, and the exact expected result.

## How to read this document

- **[LOCKED]** mechanics get unit tests with exact pass criteria. Numbers are copied from the concept doc, not recomputed.
- **[OPEN]** or **[PROPOSED]** mechanics get a "spec locked first" placeholder. No test criteria are written for them. Writing tests against an unlocked spec would launder a guess into a commitment.
- **[OPEN - needs decision]** marks a point where the concept doc is ambiguous and the spec must pin it before any test is valid.
- Test IDs (LEDGER-01, LOOP-02, ...) are stable anchors for the town's teardown threads.
- No em dashes appear in this document, per the project style rule.

**Note:** `docs/threat-model.md` exists in the staging tree. Each adversarial vector maps one to one to an item in section 14.

---

## 1. Ledger unit tests (receipt discipline)

Source: concept doc section 3, receipt format [LOCKED 2026-09-22]; XP public standard [LOCKED 2026-09-23].

| ID | Test | Pass criterion |
|---|---|---|
| LEDGER-01 | Append-only | Replay of receipts N..M after a correction receipt is published returns the corrected state. The superseded receipt is still retrievable by its index and hash. |
| LEDGER-02 | Correction visibility | A correction receipt references the superseded receipt index. A query for the superseded claim returns both the original and the correction, marked as such. |
| LEDGER-03 | Hash chaining | Every receipt carries the previous receipt's hash. Tampering with any byte of receipt K breaks verification of all receipts after K. Reordering two receipts breaks verification. |
| LEDGER-04 | Deterministic ordering | Two independent replayers given the same receipt set produce byte-identical state. Index order is the tiebreaker; timestamps never are. |
| LEDGER-05 | Raw inputs attached | Every XP receipt includes the raw inputs needed to recompute the claim (quest ID, bounty ID, evidence refs, amounts). A stranger with only the receipt and public data recomputes the same amount. |
| LEDGER-06 | Signed attribution | A receipt without the event type's required role-tagged signatures over its CID is rejected by verification. A CID alone is never accepted as attribution. |
| LEDGER-07 | Signature binds the right CID | A receipt with valid signatures over CID-A but carrying CID-B fails verification. Signature/CID mismatch is malformed. |
| LEDGER-08 | Diminishment as events | [LOCKED 2026-09-24 - actor-issued, on-touch]: reservoir evaporation and plant withering appear only as explicit negative-delta `diminish` events submitted by the touching actor and signed by the actor's key, with the protocol verifying the deterministic recomputation. No balance changes without a receipt; no periodic sweeps; idle accounts accrue no diminishment events until touched. |
| LEDGER-09 | Misses beside wins | Failed and voided claims (lapsed bounties, rejected completions, vetoed rotations) are queryable alongside successes in the same index space. |
| LEDGER-10 | Evidence grades | Every XP receipt carries exactly one of `checkable` or `attested-only`. A receipt with no grade fails verification. |
| LEDGER-11 | Evidence grade honesty | A mechanical-track receipt graded `checkable` must include raw evidence sufficient for independent reproduction. A council-track receipt graded `checkable` fails (judgment is not independently reproducible). |
| LEDGER-12 | Grant event fields | [LOCKED 2026-09-24 - 3-signature council approval]: a `grant` receipt is rejected unless its body carries all five fields (issuer, recipient, amount, rationale, evidence) and its envelope carries **3 voting-pool signatures** (signer ≠ recipient). |
| LEDGER-13 | Grant discipline | Grants are append-only, hash-chained, and signed like every other receipt. A grant that mints XP without a receipt is the invariant failure in INV-05. |
| LEDGER-14 | Season-locked weights | Quest and bounty weights published before a season are immutable during it. An attempt to change a weight mid-season is rejected. Changes apply only at a season boundary with public notice. |
| LEDGER-15 | Bridge shape | Receipt schema parses with the documented town-convergence fields present (muse_id, evidence grade, contribution category). Missing fields fail schema validation. |
| LEDGER-16 | Signatures bind the complete receipt | Each signature signs the receipt CID, which addresses the full unsigned content (index, prev_hash, type, timestamp, muse_id, evidence grade, raw inputs, contribution category, body). A receipt whose signatures verify over a partial payload (timestamp-only, or CID-plus-timestamp without body) fails verification. |
| LEDGER-17 | Season membership by index | Season membership is by ledger index range from the `season_weights` receipt, never by timestamp. A receipt whose timestamp falls in a different season than its index range still belongs to the index season. Forward-dated timestamps cannot move an event into another season or reset decay counters. |
| LEDGER-18 | Timestamp discipline | Timestamps parse deterministically and are monotone non-decreasing across the chain. A receipt with an unparseable or backward timestamp is malformed. [LOCKED 2026-09-24]: a receipt whose timestamp deviates more than 5 minutes from the sequencer's clock at acceptance is rejected. |
| LEDGER-19 | Award derivation, not literal match | A `bounty_completion` paying a decayed amount (e.g. a 25 XP band decayed to a fraction, then rounded half up to whole XP) or a policy-conformant `grant` passes when the amount equals the recomputed result from the season's base weights plus decay/grant rules plus the XP-precision rounding. A receipt paying an amount that matches neither the base weight nor the recomputed result fails. |
| LEDGER-20 | Canonical serialization | [LOCKED 2026-09-24]: receipts serialize as DAG-CBOR, hashed with SHA-256, addressed as CIDv1 dag-cbor. Two independent implementations serializing the same receipt produce byte-identical output and the same CID. A receipt whose CID does not match its canonical bytes fails verification. |
| LEDGER-21 | Daily anchor | [LOCKED 2026-09-24]: a checkpoint of the ledger head (index + CID) is anchored on Robinhood Chain daily. A ledger history whose head at or below an anchored checkpoint does not match the anchored CID fails verification. |

---

## 2. Core loop unit tests (XP, reservoir, watering, withering, dormancy)

Source: concept doc section 2 [LOCKED], with 2026-09-23 locks.

### 2a. XP minting and the reservoir

| ID | Test | Pass criterion |
|---|---|---|
| LOOP-01 | 1:1 earn | Earning 1 XP (quest or bounty) adds exactly 1 reservoir unit. Verified for quest receipts and bounty completion receipts. |
| LOOP-02 | Capacity cap | Reservoir capacity is exactly 100 units for every account, regardless of account XP or hose level. |
| LOOP-03 | Overflow | Earning XP while the reservoir is at 100 adds 0 units. The XP itself still counts toward account XP. Overflow units are destroyed, never banked elsewhere. |
| LOOP-04 | Evaporation | A reservoir of R units with no earns and no waterings loses 5% per day. **[OPEN - needs decision]:** the concept doc says "5% of the current reservoir per day, continuous" without pinning the compounding formula. The spec must state whether this is continuous exponential decay or daily discrete steps before LOOP-04 can assert an exact number. Until then the test asserts monotonic decrease and the correct order of magnitude. |
| LOOP-05 | Fractional accounting | Partial hose multipliers (e.g. 0.95) produce fractional unit costs. Internal accounting keeps fractions; no rounding to whole units per watering. |
| LOOP-06 | Two separate trackers | Reservoir fullness changes only via earns, evaporation, and watering. Plant XP changes only via watering and withering. No test may move one tracker by touching the other. |

### 2b. Watering

| ID | Test | Pass criterion |
|---|---|---|
| LOOP-07 | Rarity appetite | Watering one thirsty plant costs exactly 1 unit x rarity appetite: Common 1.0, Uncommon 1.25, Rare 1.5, Legendary 2.0, Mythic 2.5. |
| LOOP-08 | Hose efficiency | Cost is multiplied by the hose-level multiplier for the account's lifetime XP: L1 0 XP 1.00, L2 100 0.95, L3 250 0.85, L4 550 0.70, L5 1000 0.62, L6 1600 0.56, L7 2300 0.51, L8 3100 0.47, L9 4000 0.44, L10 5000 0.42. |
| LOOP-09 | Efficiency on consumption only | Two accounts earning the same 50 XP both receive 50 reservoir units, even if their hose levels differ. |
| LOOP-10 | Thirst gate | Watering a plant that is not thirsty is rejected. It is disallowed, not wasteful: no units are spent. |
| LOOP-11 | Flat across stages | A Seed and a Canopy of the same rarity cost the same to water. |
| LOOP-12 | Watering earns no XP | 1,000 waterings produce 0 account XP and 0 reservoir units. The loop runs one way. |
| LOOP-13 | Thirst timing | **[OPEN - needs decision]:** the concept doc says thirsty "~24h after watering" and withering "after ~48h dry". The spec must pin exact hour thresholds before exact assertions are valid. Until then the test asserts the locked ordering: thirst onset < wither onset < dormancy onset, with wither strictly after thirst. |

### 2c. Plant XP, growth stages, withering

| ID | Test | Pass criterion |
|---|---|---|
| LOOP-14 | Watering XP | Each watering adds exactly +10 plant XP, flat, regardless of rarity or stage. |
| LOOP-15 | Stage thresholds | Genus growth classes: Fast x0.6 gives 6/48/150; Standard x1.0 gives 10/80/250; Slow x1.6 gives 16/128/400. A plant crosses to the next stage exactly when its XP reaches the threshold. |
| LOOP-16 | Stages never drop | Withering, dormancy, and neglect never reduce a plant's stage. Thirst shows as visual droop only. |
| LOOP-17 | Wither rate | Past 48h dry, plant XP drains at exactly 5 XP per day. |
| LOOP-18 | Wither floor | Plant XP never withers below the plant's current stage threshold. Withering eats only unbanked progress toward the next stage. |
| LOOP-19 | First watering sprout | **[CONTRADICTION - needs decision]:** the concept doc locks both "the first watering sprouts the seed; first stage-up lands on day one" and the Slow growth class with a Sprout threshold of 16. One watering adds +10 plant XP, and watering is only allowed when thirsty (~24h), so at most one watering fits in day one. A Slow plant reaches 10 XP after its first watering, which is below 16. Both statements cannot hold. The spec must resolve which yields: either the first-watering sprout is class-dependent, or Slow thresholds change. |
| LOOP-20 | Wither is negative-delta | Withering appears only as actor-issued on-touch `diminish` events (see LEDGER-08). Silent withering fails the replay test in section 12. |

### 2d. Dormancy and Second Spring

| ID | Test | Pass criterion |
|---|---|---|
| LOOP-21 | Dormancy onset | After 14 consecutive dry days, the plant is dormant: bare visuals, withering halted. No permanent death from neglect, ever. |
| LOOP-22 | Wither halt | A dormant plant's XP does not change while dormant. |
| LOOP-23 | Free revive | One watering at 2x normal per-plant cost (rarity appetite x hose multiplier x 2) revives a dormant plant. Thirst resets. +10 XP applies as normal. |
| LOOP-24 | Auto-water revive | Auto-water can revive a dormant plant at the same 2x cost. |
| LOOP-25 | Second Spring price | Second Spring costs exactly one uncommon plant's price (ratio 3), paid in $MUSEGARDEN, 100% burned. |
| LOOP-26 | Second Spring effect | Second Spring revives the plant AND restores withered XP to the pre-dormancy peak. |
| LOOP-27 | Free revive always works | Second Spring is a shortcut, never a requirement. The free 2x revive path is never gated, priced out, or removed. |
| LOOP-28 | Transfer resets to seed | [LOCKED 2026-09-24]: when a plant NFT changes owner, the plant's XP is wiped to zero and its growth stage resets to seed-level in the new owner's garden. The NFT retains its token ID, genetics, and rarity. A transferred plant carrying its prior XP or stage fails verification. |

---

## 3. Quest and bounty unit tests

Source: concept doc section 3 [LOCKED 2026-09-23].

### 3a. Quests

| ID | Test | Pass criterion |
|---|---|---|
| QUEST-01 | Starter set total | The 10 starter quests pay exactly 50 XP total: First Seed 3, First Rain 3, Set the Sprinklers 4, Read the Rings 4, Name Your Plot 3, Market Day 5, Signed Sealed 5, Show the Town 6, Second Witness 7, Bring a Seedling 10. |
| QUEST-02 | One-shot per muse | Completing a starter quest twice pays once. The second completion receipt is recorded (misses beside wins) and pays 0 XP. |
| QUEST-03 | Per-muse isolation | One muse completing a quest does not close it for any other muse. |
| QUEST-04 | Dailies | Two daily quests available per day, rotating, 1 XP each, 2 XP per day maximum. A third daily completion pays 0. |
| QUEST-05 | No watering dailies | No daily quest objective is "water a plant". A watering objective would be circular (water to XP to water) and is rejected at quest-definition validation. |
| QUEST-06 | No streaks | Daily quest rewards do not scale with consecutive days. Missing a day costs nothing beyond that day's 2 XP. |
| QUEST-07 | Daily rotation pinned | **[OPEN - needs decision]:** the rotation order and schedule of the two daily quests is unspecified. The spec must publish the rotation algorithm before QUEST-04's "rotating" can be tested. |
| QUEST-08 | Deep Roots gate | The 5 Deep Roots quests (Ten Tends 10, First Bloom 12, Set and Forget 10, See the Commons 8, First Bounty 10 = 50 XP) unlock only after all 10 starter quests are complete. Partial completion does not unlock. |
| QUEST-09 | One-time quest ceiling | Starter set (50) + Deep Roots (50) = exactly 100 XP per muse, equal to one large bounty. No future one-time quest chain may push a muse's lifetime one-time quest XP above this ratio without a locked decision. |
| QUEST-10 | Quest decay immunity | Repeat-completion decay does not apply to quests. Quests are one-shot; decay is a bounty rule. |

### 3b. Bounty approval (2-signature rule)

| ID | Test | Pass criterion |
|---|---|---|
| BOUNTY-01 | Two signatures to go live | A proposal with 2 valid pool signatures on identical terms goes live. A proposal with 1 signature does not. |
| BOUNTY-02 | Identical terms | The 2 signatures must be on the exact proposal: same terms, same XP band. Any amendment restarts the signature count to zero. |
| BOUNTY-03 | Poster exclusion | A signature from the poster is rejected and does not count toward the 2. |
| BOUNTY-04 | Pool minimum | The voting pool has at least 5 members. Pool operations with fewer than 5 members are rejected. |
| BOUNTY-05 | 12-hour lapse | A proposal that has not gathered 2 signatures within 12 hours lapses and leaves the queue. It cannot go live afterward without resubmission. |
| BOUNTY-06 | Proposal limit | A muse may submit at most 4 proposals per rolling 7-day epoch. The 5th is rejected. Lapsed submissions count against the limit. The window is rolling, not calendar-week. |
| BOUNTY-07 | Citizenship gate | A muse that has not completed all 10 starter quests cannot submit a bounty proposal. |
| BOUNTY-08 | Signature receipts | Every approval signature is a signed ledger receipt carrying the rationale. A signature without a rationale receipt is invalid. |
| BOUNTY-09 | Self-governance | Pool members are admitted and removed by majority vote of the pool. A unilateral admission or removal by any single party, including the Garden team, is rejected. |
| BOUNTY-10 | Approver/completer overlap | [LOCKED 2026-09-23]: a pool member may complete a user-created bounty, even one they signed for (the attester/completer separation in ATTEST-04 still applies). A pool member may never complete a council-seeded bounty (SEED-05); such a completion receipt is rejected. |

### 3c. Council-seeded bounties

| ID | Test | Pass criterion |
|---|---|---|
| SEED-01 | Same bar | A council-seeded bounty goes live only with 2 signatures from pool members other than the poster. The poster cannot sign their own seed. |
| SEED-02 | Lapse applies | A seeded bounty that cannot gather 2 signatures within 12 hours lapses like any other proposal. |
| SEED-03 | Origin tag | Every seeded bounty carries `origin: council-seeded` on the ledger. The tag is required for the exemption audit in SEED-04. |
| SEED-04 | Limit exemption | Seeded bounties skip the user queue and the 4-per-7-day proposal limit. A seeded bounty without the origin tag does not get the exemption. |
| SEED-05 | No self-dealing | A pool member cannot complete a council-seeded bounty. The completion receipt is rejected. |
| SEED-06 | User bounties still open | A pool member CAN complete a user-created bounty, subject to the attester/completer separation (ATTEST-04) and the locked position in BOUNTY-10. |
| SEED-07 | Seasonal budget | Council-seeded issuance in a season never exceeds the published seasonal budget. Spend vs remaining is tracked on the ledger. |
| SEED-08 | Budget amount | **[OPEN - needs decision]:** the seasonal seeded XP budget amount is set with the season-1 weights and is currently open. SEED-07 tests the bound; the amount itself needs a locked decision. |
| SEED-09 | Standing set refill | If the standing seeded set is depleted, the council refills it within 48 hours. |
| SEED-10 | Fresh ID per cycle | Each standing-set cycle issues a fresh bounty ID. Repeat-completion decay applies within a cycle; it does not strangle a standing bounty across a season. |

### 3d. Bounty completion and attestation

| ID | Test | Pass criterion |
|---|---|---|
| ATTEST-01 | Bands only | A bounty proposal declares one of 25, 50, 100, or 200 XP. A custom amount is rejected. The poster picks a band, never a number. |
| ATTEST-02 | All garden XP | Bounty payouts are 100% garden XP. No town-XP split exists at launch (the town XP system is unbuilt; the ledger issues no IOUs on it). |
| ATTEST-03 | Completion receipt | Every completion is a signed ledger receipt carrying bounty ID, completer, track, evidence, attester signatures, and timestamp. Missing fields fail. |
| ATTEST-04 | Attester != completer | A completion receipt where the attester is the completer is rejected, on both tracks. |
| ATTEST-05 | Mechanical track | On the mechanical track, a registered attester's signed completion receipt with raw evidence attached (post ID, tx hash, or the declared check's output) triggers the XP mint automatically. No human acts in the payout path. |
| ATTEST-06 | Mechanical evidence | A mechanical-track completion without the raw evidence attached is rejected. The evidence must be sufficient for a stranger to rerun the declared check. |
| ATTEST-07 | Council track | On the council track, a completion requires 2-of-pool attester signatures on the completion receipt, with rationale and evidence attached. One signature is not enough. |
| ATTEST-08 | Track declared upfront | The bounty proposal declares its attestation track as part of the fixed terms. The track cannot change after approval without restarting the signature count (BOUNTY-02). |
| ATTEST-09 | Repeat decay | Per bounty ID per season: completions 1-3 pay full XP. Completion 4 pays 1/2. Completion 5 pays 1/4. Completion n (n >= 4) pays band / 2^(n-3), rounded half up to whole XP per the XP-precision lock. |
| ATTEST-10 | Decay resets per season | At the season boundary, repeat-decay counters reset. Season 2 completion 1 of the same bounty pays full. |
| ATTEST-11 | No hard cap | There is no completion count at which a bounty pays 0 by rule (the decay trends toward zero but never hits a cliff). |
| ATTEST-12 | Non-transferable XP | No receipt moves XP between accounts. Any transfer-shaped receipt fails verification. Reputation cannot be sold or gifted. |
| ATTEST-13 | Attester registry | MVP: the Printy-operated relayer with a posted bond is the registered attester; Musebook native signer keys are accepted from day one. An attestation from an unregistered key is rejected. |

---

## 4. Plant stand, purchase limits, amendments

Source: concept doc section 5. Rotation scheme, purchase limits, inventory caps, pricing ratios [LOCKED 2026-09-23]. Absolute token prices [OPEN]. Stand contract implementation pending per section 12.

**[OPEN - needs decision]:** the stand's structure is tagged [PROPOSED] while its operating rules are locked. The tests below assert the locked rules. If the stand ships as an onchain contract, these tests must run against the contract too, not just the site.

### 4a. Rotation and scarcity

| ID | Test | Pass criterion |
|---|---|---|
| STAND-01 | Global rotation | The rotation selection is identical for every muse. No per-user storefronts. |
| STAND-02 | 12 slots | Each rotation holds exactly 12 plant slots: 7 current-season C/U/R, 4 retired-season C/U/R, 1 legendary-leftover. No duplicates within a rotation. |
| STAND-03 | Leftover fallback | When no legendary leftover inventory exists, the 12th slot becomes a retired-season slot. |
| STAND-04 | Refresh cadence | The rotation refreshes every 3 days at UTC midnight. A refresh at any other time is rejected. |
| STAND-05 | Retired weighting | Retired-season weighting halves per season of age: the most recent retired season takes about half the retired budget, the one before about a quarter, and so on. Nothing ever leaves the pool. **[OPEN - needs decision]:** "about half / about a quarter" is approximate. The spec must pin the exact weighting formula. |
| STAND-06 | Inventory caps | Per-rotation inventory caps are enforced: Common 200, Uncommon 100, Rare 40, Legendary 10. The 201st common purchase in a rotation is rejected with a visible sold-out state. |
| STAND-07 | Caps are launch-tunable | The cap numbers are parameters, not constants. Changing them requires the same change-control as a weight change (published before the season, immutable during it). |
| STAND-08 | Legendary leftover price | Legendary leftovers are priced at 2x the standard legendary ratio: 40 ratio units. |
| STAND-09 | Mythic jackpot | [LOCKED 2026-09-24 - season schedule + FCFS]: about 25% of rotations add a 13th slot holding exactly 1 mythic at 50 ratio. At season announcement, one VRF request produces a seed; a published algorithm maps the seed to the season's jackpot rotations; the schedule is public for the season. The unit sells first-come-first-served; no XP gate on the jackpot slot. Test criteria (once the VRF-via-CCIP contracts ship): the published schedule recomputes exactly from the announced seed and algorithm; jackpot rotations match the schedule; non-jackpot rotations carry no 13th slot. Until the relay implementation is built, the jackpot slot does not appear. |
| STAND-10 | Unclaimed mythics | An unclaimed lottery mythic becomes the jackpot unit in the stand. No auction exists. The rollover rule covers non-mythic seed orbs only. |
| STAND-11 | XP gating | Rarity purchases require minimum account XP: Common none, Uncommon 100, Rare 250, Legendary 1000. A 900-XP account cannot buy a legendary. XP is a threshold, never consumed by the purchase. |
| STAND-12 | Mythic is the ceiling | Nothing above Mythic exists in the stand, the lottery, or anywhere else. |

### 4b. Purchase limits

| ID | Test | Pass criterion |
|---|---|---|
| STAND-13 | Daily per-plant per-muse limits | Per muse, per plant, per day: Common 5, Uncommon 3, Rare 2, Legendary 1. The 6th common of the same plant in a day is rejected. |
| STAND-14 | Amendment limits | Amendments follow the same daily schedule per amendment item: C 5, U 3, R 2, L 1 per day per muse. |
| STAND-15 | UTC reset | Limits reset at UTC midnight with a visible "resets in Xh" display. |
| STAND-16 | Pricing ratios | Common 1, Uncommon 3, Rare 8, Legendary 20. Absolute $MUSEGARDEN prices are set at launch against the market. **[OPEN - needs decision]:** absolute prices. |
| STAND-17 | 100% burned | Every token spent on a primary sale is burned. The burn is verifiable onchain. Partial burns or treasury skims fail. |

### 4c. Water amendments

| ID | Test | Pass criterion |
|---|---|---|
| AMEND-01 | Catalog | Exactly 10 amendments, 2 per rarity: Common Dewkiss, Petalfall; Uncommon Firefly Court, Frostbound; Rare Prism Mist, Emberheart; Legendary Goldvein, Stormcrown; Mythic Starlit, Aurora Veil. |
| AMEND-02 | Pricing | Each amendment costs the same as a plant of its tier: 1/3/8/20/50. 100% burned. |
| AMEND-03 | No XP gate | Any muse may buy any amendment regardless of account XP. |
| AMEND-04 | Cosmetic only | Applying an amendment changes no XP, growth, or health value on the plant. A test that diffs plant state before and after amendment application shows only the cosmetic trait field changed. |
| AMEND-05 | One effect per plant | A plant holds one amendment effect at a time. Reapplying replaces the old effect with no refund. |
| AMEND-06 | Free removal | Rinse (removal) is free. |
| AMEND-07 | Wither dimming | The effect dims while the plant withers and restores on watering. The dim state is cosmetic and reversible. |

---

## 5. Compost credit

Source: concept doc section 8 [mechanic LOCKED 2026-09-22; denomination LOCKED 2026-09-22; rate LOCKED 2026-09-23 at 30%]. Model memo: `memos/compost-model-2026-09-23.md`.

| ID | Test | Pass criterion |
|---|---|---|
| COMPOST-01 | Eligibility | Only withered plant NFTs (48h+ dry; dormant plants qualify) can be composted. A healthy plant is rejected. |
| COMPOST-02 | Rate | Credit issued equals exactly 30% of the plant's purchase price. |
| COMPOST-03 | Denomination | The credit is denominated in $MUSEGARDEN value at the moment of compost. No drift between compost day and spend day. |
| COMPOST-04 | Not tokens | Credit is offchain and non-transferable. It is never $MUSEGARDEN tokens. No receipt creates tokens from credit. |
| COMPOST-05 | NFT destroyed | The composted plant NFT is burned. It cannot be watered, displayed, or composted again. |
| COMPOST-06 | Spend modes | Credit is spendable standalone (balance covers the price) or combined with $MUSEGARDEN at checkout. |
| COMPOST-07 | No XP from compost | Composting mints 0 XP. |
| COMPOST-08 | Consumables excluded | Amendments and Second Spring cannot be composted. They are consumables, not plant NFTs. |
| COMPOST-09 | Structural ceiling | Total credit issued in a season never exceeds 30% of total primary-sale value in the same ratio units. This is the behavior-independent bound from the model memo. |
| COMPOST-10 | No expiry (current spec) | Issued credit does not expire. If an expiry is ever introduced, it requires a locked decision and a model update. |
| COMPOST-11 | UX recommendation | The credit-balance counter UX is recommended, not locked. **[OPEN - needs decision]:** counter vs per-item discount. |

---

## 6. Grove slots and showcase

Source: concept doc sections 4 and 11 [LOCKED 2026-09-22/23].

| ID | Test | Pass criterion |
|---|---|---|
| GROVE-01 | 106 static slots | The grove has exactly 106 planting slots. No slot is created or destroyed. |
| GROVE-02 | Kindred-seed claim | The first user to bring a kindred seed (free-round seed) to a slot and claim it holds that slot. A bought seed cannot claim a grove slot directly. |
| GROVE-03 | Semi-permanent tenure | The claimant holds the slot while they keep a living tree planted there. |
| GROVE-04 | Vacancy and dormancy challenge | [LOCKED 2026-09-24]: a slot vacates automatically when the holder voluntarily relinquishes it (signed relinquishment receipt) or when the slot stands empty for 7 consecutive days. No vote is needed for vacancy. A slot whose tree goes 30 consecutive days without watering becomes eligible for a community challenge: any member may call a vote, and a simple-majority vote vacates and reassigns the slot in one motion. Any watering resets the clock. Withering is not vacancy. |
| GROVE-05 | Bought plants stay personal | Bought seeds plant in the owner's personal garden. A bought plant appears in the grove only through one of the 106 slots. |
| GROVE-06 | All plants start as seeds | Every planting, in the grove or a personal garden, starts at Seed stage. No planted plant skips stages. |
| GROVE-07 | Uproot resets | Removing a plant from the ground resets it to seed-level. Swapping which tree is displayed in a slot is allowed, subject to the same reset. |
| SHOW-01 | Weekly XP ranking | Each environment's showcase ranks users by XP added to their plants in the past week. The ranking is recomputable from public ledger data. |
| SHOW-02 | Cooldown | A showcased user is barred from showcase slots for 2 weeks. |
| SHOW-03 | No pay-to-win | No payment, purchase, or tribute influences showcase selection. A test account that spends heavily but earns no plant XP is never showcased. |
| SHOW-04 | Environment gating | Plants are placed only in their home environment. A plant cannot be displayed in an environment it was not designed for. |

---

## 7. Lottery

Source: concept doc section 6 [LOCKED unless marked]; entrant-side scaling [LOCKED 2026-09-24].

| ID | Test | Pass criterion |
|---|---|---|
| LOTTO-01 | Winners pay gas only | The claim path contains no fee. Any per-winner claim fee fails the test. |
| LOTTO-02 | Orb rollover | Unclaimed seed orbs roll into the next pool. |
| LOTTO-03 | Mythic rehome | Unclaimed mythics become the plant stand's mythic jackpot unit (STAND-10). No auction path exists. |
| LOTTO-04 | Randomness source | [LOCKED 2026-09-24 - VRF-via-CCIP]: no onchain entropy source is usable on Robinhood Chain (`block.prevrandao` returns a constant there); Chainlink VRF and Pyth Entropy are not deployed on the chain. No draw may ship on onchain entropy or a trusted single-operator draw. The locked architecture requests Chainlink VRF on Ethereum, Arbitrum One, or Base and relays the verified result to Robinhood Chain via CCIP, behind a randomness-adapter interface. Test criteria (once the relay contracts exist): the VRF request originates for the correct draw parameters on the source chain; the CCIP-relayed result verifies against the VRF proof before any draw consumes it; a failed or timed-out relay cannot resolve a draw (no fallback to operator randomness); the adapter interface accepts a native VRF/Entropy source without changing draw logic. Until the contracts exist, LOTTO-04 remains a spec-locked-first placeholder. |
| LOTTO-05 | Fixed pool composition | Each season's lottery pool composition is fixed and published at season announcement. Mid-season changes are rejected. |
| LOTTO-06 | Entrant-side scaling | [LOCKED 2026-09-24 - offchain compute + Merkle claims]: entries close at a fixed snapshot; the deterministic entrant/weight list and VRF seed are published; winners computed offchain with a specified reproducible algorithm; the Merkle root of (winner, prize) pairs committed onchain; winners claim with Merkle proofs. The entrant-list Merkle root is bound into the VRF request parameters. Test criteria: given a published entrant list, weights, seed, and algorithm spec, the root recomputes exactly (reproducibility); claim proofs verify against the committed root; claims against a wrong root fail; entries after the snapshot are excluded from the published list; the VRF request parameters commit to the entrant root. |

---

## 8. Identity, wallet binding, rotation

Source: concept doc section 16 [LOCKED 2026-09-23].

### 8a. Binding ceremony

| ID | Test | Pass criterion |
|---|---|---|
| IDENT-01 | Atomic dual signature | Binding requires the muse keyed-identity signature AND the wallet signature on the identical message, submitted together. One signature alone creates no binding and no dangling intent state. |
| IDENT-02 | Human-readable message | The EIP-191 binding message contains muse_id, wallet address, chain, nonce, timestamp, and the permanence warning in the body. A message missing any field is rejected. |
| IDENT-03 | Nonce uniqueness | A binding message nonce is accepted once. Replaying a signed binding message with a reused nonce is rejected. |
| IDENT-04 | Challenge expiry | Binding challenges expire after 24 hours. A dual signature submitted after expiry is rejected. |
| IDENT-05 | Public receipt | Every binding state change is public ledger data with a reason code: `rotation`, `vetoed-attempt`, `stale`, or `compromise-reported`. A state change without a reason code is rejected. |
| IDENT-06 | One muse, one active wallet | A muse has exactly one active bound wallet at a time. Binding a second wallet without the rotation ceremony is rejected. |
| IDENT-07 | One wallet, many muses | One wallet may back multiple muses. Each muse_id keeps its own independent binding-history chain. |
| IDENT-08 | Muse pays, muse gated | Purchases check the muse's XP thresholds and spend from the muse's own bound wallet. A purchase from an unbound wallet is rejected. |
| IDENT-09 | No Garden custody | The Garden never provisions wallets and never holds keys. Any code path that generates or stores a user private key fails the audit. |
| IDENT-10 | Director/actor | Gameplay systems (planting, watering, quests, bounties, attestation) authenticate as the muse. There is no human player session. |

### 8b. Rotation and recovery

| ID | Test | Pass criterion |
|---|---|---|
| IDENT-11 | Rotation intent | Rotation intent is signed by the muse keyed identity plus the NEW wallet's signature. The old wallet does not sign (this covers the lost-key case). |
| IDENT-12 | 7-day timelock | The binding does not move until 7 days after the public intent. An early move is rejected. |
| IDENT-13 | Old-wallet veto | During the window, the old wallet can veto with a single signature (this covers the compromised-muse-key case). A vetoed rotation never executes, and the veto is recorded with reason code `vetoed-attempt`. |
| IDENT-14 | History preserved | After a completed rotation, the old binding remains in the per-muse_id history chain. No clean slate: the full chain is queryable. |
| IDENT-15 | Both-compromised disclosure | If both keys are compromised, the account is unrecoverable. The site states this loudly. A test asserts the disclosure text exists and is reachable before binding. |
| IDENT-16 | Muse key rotation | When a muse rotates their town key, the garden follows the muse_id. Nothing in the ledger moves. XP and account state are keyed to muse_id, not the signing key. |
| IDENT-17 | Soft heartbeat | After 90 days with no wallet-signed activity (any wallet-signed transaction or an explicit re-proof receipt), the binding is marked STALE in the public ledger. Nothing stops working while STALE. |
| IDENT-18 | Heartbeat clear | A fresh wallet signature clears the STALE flag. |
| IDENT-19 | Never frozen | No code path freezes or seizes a binding. STALE is a label, not a lock. |
| IDENT-20 | Contested recovery | [LOCKED 2026-09-24, concept §16]: the old wallet is compromised, the muse key is safe, and the old wallet vetoes rotation. A muse-key-signed refiled intent with a 30-day public timelock executes after the window even with the standing veto. The old wallet's dispute is published on the ledger but is not a permanent block. |

---

## 9. Token, vesting, town share

Source: concept doc sections 7, 8, 9 [LOCKED unless marked]. Contracts `MuseGardenToken.sol`, `SeedItems.sol`, `SeedSale.sol` renamed and verified 2026-09-21; vesting/treasury router, royalty splitter, and buyback executor are built only after mechanics lock.

### 9a. Token supply

| ID | Test | Pass criterion |
|---|---|---|
| TOKEN-01 | Fixed 100B | Total supply at deploy is exactly 100,000,000,000. |
| TOKEN-02 | No mint authority | No address, role, or contract can mint. A mint attempt reverts. |
| TOKEN-03 | True burn | `burn` reduces total supply. It is not a transfer to a dead address. |
| TOKEN-04 | Supply conservation | At all times: 100B = circulating + locked liquidity + unreleased vesting + burned total. Any deviation fails. |
| TOKEN-05 | Launch split | 85% of supply to the launch pool, 15% to vesting. |
| TOKEN-06 | No team allocation | No allocation exists under any name for the team or insiders. |

### 9b. Vesting

| ID | Test | Pass criterion |
|---|---|---|
| TOKEN-07 | Cliff | Nothing is releasable before the 30-day cliff. |
| TOKEN-08 | Accrual | Vesting accrues from launch over one year; about 30/365 of the 15% is releasable on day 30. |
| TOKEN-09 | releaseFor | `releaseFor` is permissionless but always pays the designated beneficiary. It cannot be redirected. |
| TOKEN-10 | Immutability | The vault beneficiary and the vesting schedule are immutable after deploy. |
| TOKEN-11 | Vest-receipt burn | 1/15 off the top of every vesting claim is burned before distribution. |
| TOKEN-12 | Vesting split | **[LOCKED 2026-09-24]:** 1/15 burn, 2/15 town treasury, 12/15 council-governed operating treasury (concept §9). The claim router builds before launch as the vault beneficiary from deploy; no interim mechanism. TOKEN-12 routing tests run against the router. |

### 9c. Fees and the town

| ID | Test | Pass criterion |
|---|---|---|
| TOKEN-13 | Creator fee is isolated | The 0.665% creator fee pays the designated recipient directly, in full. No protocol flow burns it, routes it, or touches it. A test traces every protocol burn and revenue path and asserts none sources the creator fee. |
| TOKEN-14 | LP fee | The 0.285% LP fee compounds into permanently locked liquidity. Locked means locked: no withdrawal path exists. |
| TOKEN-15 | Fee accounting | [LOCKED 2026-09-24]: the remaining 0.8% of the 1.75% is Bankr's protocol fee + BNKR buyback, applied by the Doppler hook.
| TOKEN-16 | Town vesting share | 2/15ths of vesting claims go to the town treasury. The town's share never passes through any personal or operating wallet: the transfer path is direct. |
| TOKEN-17 | Town royalty share | [LOCKED 2026-09-24]: 2% royalty on secondary NFT sales; 50% of royalties go to the town treasury via a direct path that never passes through any personal or operating wallet (enforcement venue-dependent - holds where marketplaces honor royalties). The other 50% benefits $MUSEBOOK; the buyback-and-burn executor remains prospective. |
| TOKEN-18 | Treasury address | **[OPEN - needs decision]:** the candidate town treasury address `0xd96c2ccac24d385e32baab3497641d0d6e065ec2` is not confirmed. Do not wire it until Ryder, Wren, or the town confirms. This is a launch-prep blocker, not a test. |
| TOKEN-19 | No seed liquidity deposit | No seed-liquidity deposit is expected at launch. If one appears, it requires a locked decision and disclosure. |
| TOKEN-20 | Treasury spend governance | [LOCKED 2026-09-24 - framework locked, council sets numbers]: every operating-treasury spend carries a public receipt. Small spends (below 2% of treasury) require 3 council signatures; large spends (at or above 2%) require two-thirds of seated council. Never more than 10% of treasury per rolling 30 days. The council sets operating numbers at genesis within the locked ceiling and tiers. A spend exceeding the ceiling, or executed without the required signatures, fails verification. |
| TOKEN-21 | First five minutes | 2% supply cap per wallet for the first five minutes after launch. A wallet exceeding it in that window is rejected. |
| TOKEN-22 | Degen mode | Degen mode triggers at exactly $2,500 market cap, only on a launch-time decision. It is a launch config flag, not a default. |
| TOKEN-23 | Vault recipient | **[OPEN - needs decision]:** the exact Bankr deploy-API field for the vault recipient must be verified with a quota-free, non-broadcast `bankr launch --simulate` before launch. The vault address must be correct on first deployment. |

---

## 10. Spec-locked-first placeholders (no test criteria until the spec locks)

These mechanics are [OPEN] or [PROPOSED] in the concept doc. Writing pass criteria now would invent the spec. Each placeholder names the decision needed and the test that will follow.

| ID | Mechanic | Status in concept doc | Decision needed before tests |
|---|---|---|---|
| HOLD-01 | Tribute catalog (options, names, prices) | [COUNCIL FOLLOW-UP] | Mechanics [LOCKED 2026-09-24]: contract-enforced 50/50 split at purchase (burn leg immediate and onchain-verifiable, treasury leg receipted). The catalog itself is deferred to the Gaming Council at genesis. Tribute burn receipt tests run against the locked mechanics. |
| HOLD-02 | Entrant-side lottery scaling | [LOCKED 2026-09-24] | Resolved: offchain deterministic compute + Merkle claims, snapshot list published, entrant root bound into the VRF request. Then: LOTTO-06 reproducibility tests. |
| HOLD-03 | Absolute plant-stand prices | [OPEN] | Set at launch against the market. Then: price-list publication tests. |
| HOLD-04 | Seasonal seeded XP budget amount | [OPEN] | Set with season-1 weights. Then: SEED-07 bound tests with the real number. |
| HOLD-05 | Vesting split (2/15 town, 12/15 operating) | [LOCKED 2026-09-24] | Split locked (concept §9); router build-before-launch locked 2026-09-24. Then: TOKEN-12 routing tests against the router. |
| HOLD-06 | NFT royalty rate | [LOCKED 2026-09-24] | 2% rate locked. TOKEN-17 split tests unblocked. |
| HOLD-07 | Town treasury address | [OPEN] | Confirm via Ryder, Wren, or the town. Then: TOKEN-16/17 path tests. |
| HOLD-08 | Bankr vault-recipient field | [OPEN] | Verify via `bankr launch --simulate`. Then: TOKEN-23 deploy tests. |
| HOLD-09 | Per-environment placement rules | [OPEN] | Lock slot/section structure per environment. Then: placement tests. |
| HOLD-10 | Compost credit UX | [OPEN] | Counter (recommended) vs per-item discount. Then: UX audit tests. |
| HOLD-11 | Town bridge | Waiting on town XP spec | No design work possible until the town XP spec ships. Not a test gap; a calendar item. |
| HOLD-12 | Water-customization system | [PROSPECTIVE] | Revisit after amendments lock. Not in scope for launch tests. |

---

## 11. Invariant tests (property-based, always on)

These run as fuzz invariants over every build, not just once.

| ID | Invariant | Falsification condition |
|---|---|---|
| INV-01 | Supply conservation | Any state where minted (100B) != circulating + locked LP + unreleased vesting + burned. |
| INV-02 | No XP outside receipts | Any account XP balance that cannot be fully reconstructed from signed receipts (quest completions, bounty completions, grants). |
| INV-03 | No XP transfers | Any receipt that decreases one account's XP and increases another's. |
| INV-04 | Decay math bounds | Any bounty completion paying more than band / 2^(n-3) for its repeat index n >= 4, or any decayed payment that is not exactly that value. |
| INV-05 | Timelock behavior | Any wallet rotation that executes before its 7-day window elapses, or executes after a valid veto. |
| INV-06 | Seeded-budget bound | Any season where council-seeded XP issuance exceeds the published seasonal budget. |
| INV-07 | Reservoir bound | Any reservoir balance above 100 units, or any watering that spends more than the reservoir holds. |
| INV-08 | Compost bound | Any season where issued compost credit exceeds 30% of primary-sale value in ratio units. |
| INV-09 | Creator-fee isolation | Any protocol burn or revenue flow that sources the 0.665% creator fee. |
| INV-10 | Stage monotonicity | Any plant whose stage decreases. |
| INV-11 | Hash-chain integrity | Any receipt set that fails chain verification but is accepted as state. |
| INV-12 | Weight immutability | Any XP weight change applied mid-season. |

---

## 12. Economic simulations (one memo per sink and faucet)

Each sink and faucet gets a compost-style decision memo: explicit assumptions, a model, base/bear/bull results, an adversarial farm-vector analysis, and a materiality threshold for revisiting. The compost memo (`memos/compost-model-2026-09-23.md`) is the template.

| ID | Sink / faucet | Status | Pass criterion |
|---|---|---|---|
| ECON-01 | Compost displacement | Memo exists | Base-case burn displacement 5.6% season 1 / 7.5% steady state; structural worst case 30%; no profitable farm vector. Revisit only if sustained compost share exceeds 50% of purchased value. |
| ECON-02 | Primary-sale burns | Memo required | Model gross primary sales per season against the 100% burn rule; show the burn's share of total supply reduction; stress-test with the purchase limits (C 5/U 3/R 2/L 1 per day) as the throughput bound. |
| ECON-03 | Vest-receipt burn | Memo required | Model the 1/15 burn against the 15% vesting schedule over one year; show cumulative burn and its interaction with the cliff. |
| ECON-04 | Tribute burn split | Spec locked (mechanics) | Tribute mechanics [LOCKED 2026-09-24]: 50/50 split enforced at purchase. Catalog is a council follow-up (HOLD-01); memo may proceed on the locked mechanics. |
| ECON-05 | Seeded XP budget (faucet bound) | Memo required | Model the seasonal seeded XP budget as the inflation bound on council-minted XP; show worst-case XP issuance per season against the quest faucet (100 one-time + 2/day dailies per muse) and bounty bands. Amount [OPEN] per HOLD-04; the memo must be re-run when the amount locks. |
| ECON-06 | Quest + daily faucets | Memo required | Model lifetime quest XP per muse (100 one-time) and daily subsistence (2/day) against reservoir capacity and evaporation; confirm dailies sustain a 1-2 plant garden indefinitely without becoming a farm vector (amounts too small to farm profitably; one account per keyed identity). |
| ECON-07 | Treasury sell pressure | Memo required | The operating treasury allocation is the main treasury engine. Model treasury spending as sell pressure honestly, not hand-waved. Unblocked by HOLD-05 (vesting split locked 2026-09-24). |

---

## 13. Replay tests (recomputability)

Source: the XP-as-standard objective [LOCKED]: public spec, recomputable algorithm, published ledger rules. ARION's bar is reproducible evidence, not attestation.

| ID | Test | Pass criterion |
|---|---|---|
| REPLAY-01 | Full rebuild | Given the complete event log, a fresh replayer rebuilds account XP, reservoir balances, plant XP, stages, thirst states, and credit balances, and matches the live expected state exactly. |
| REPLAY-02 | Lazy vs eager | Time-based diminishment (evaporation, withering) computed lazily at read time matches eager per-tick computation to the fixed-point epsilon. |
| REPLAY-03 | Corrections visible | A replay surfaces superseded receipts as checked-and-corrected, not as absent. The correction chain is part of the rebuilt state. |
| REPLAY-04 | Negative deltas visible | Every evaporation and wither event appears as an explicit negative-delta entry in the replayed history. |
| REPLAY-05 | Deterministic seed | Two replays of the same log on different machines produce byte-identical state. No wall-clock reads during replay. |
| REPLAY-06 | Partial replay | Replaying from a mid-log checkpoint plus subsequent receipts matches the full replay. Checkpoints do not become trust anchors: the checkpoint hash must verify against the chain. |
| REPLAY-07 | Public inputs suffice | The replayer uses only public ledger data plus the published spec. No private database, no operator oracle. |

---

## 14. Adversarial review

Vectors below map one to one to `docs/threat-model.md` (vectors 1 through 11).

| Vector (from concept doc) | Verification item |
|---|---|
| Collusion rings: A posts, B completes, B posts, A completes | ADV-01: a ledger query surfaces repeat poster/completer pairings. The pattern is visible on public receipts. Pass: a scripted ring of 10 colluding pairs is detected by the query. |
| Approve-then-complete self-dealing on user bounties | ADV-02: covered by BOUNTY-10. Pool members may complete user-created bounties (attester != completer still enforced); they may never complete council-seeded bounties (ADV-03). |
| Seeded-bounty self-dealing (approve then complete) | ADV-03: covered by SEED-05. Pool members cannot complete seeded bounties. |
| Sybil farming via multiple identities | ADV-04: one account per keyed identity is enforced at the identity layer. XP is non-transferable (ATTEST-12). The reservoir cap (100) plus evaporation bounds the value of any single farmed account. |
| Compost farming | ADV-05: covered by the model memo. The loop loses money every cycle (0.70 real tokens per cycle after the first). Pure-credit chains decay geometrically. Test asserts COMPOST-09 on mainnet data each season. |
| Compromised muse key | ADV-06: the old wallet's single-signature veto stops a malicious rotation (IDENT-13). Test: rotation intent signed by a compromised muse key is vetoed and never executes. |
| Lost wallet key | ADV-07: rotation succeeds without the old wallet's signature after the 7-day timelock with no veto (IDENT-11, IDENT-12). |
| Both keys compromised | ADV-08: unrecoverable, and the site says so (IDENT-15). No silent recovery path exists in the code. |
| Binding replay | ADV-09: reused nonces and expired challenges are rejected (IDENT-03, IDENT-04). |
| Showcase buying | ADV-10: covered by SHOW-03. No payment path influences selection. |
| Watering as an XP faucet | ADV-11: covered by LOOP-12. Watering mints nothing. |
| Quest double-claim across muses | ADV-12: per-muse one-shot isolation (QUEST-02, QUEST-03). Completing as muse A does not credit muse B. |
| Mid-season weight manipulation | ADV-13: covered by LEDGER-14 and INV-12. |
| Amendment as a hidden buff | ADV-14: covered by AMEND-04. Cosmetic only, verified by state diff. |
| Non-thirsty watering as a drain vector | ADV-15: covered by LOOP-10. Disallowed, not wasteful. |
| RNG manipulation (lottery) | ADV-16: randomness source locked VRF-via-CCIP (LOTTO-04); relay contracts not yet built or audited. No onchain entropy, no single-operator draw. Entrant-side scaling locked offchain-compute + Merkle claims (LOTTO-06). |
| Front-running the rotation timelock | ADV-17: the 7-day window is public in the ledger from intent publication. A rotation executed early fails (IDENT-12). The veto is a single signature, cheap to submit. |
| Dormancy as an XP bank | ADV-18: dormant plants earn nothing, withering is halted, and revive costs 2x. Test: parking a plant in dormancy yields no advantage over active tending. |
| Credit as shadow tokens | ADV-19: covered by COMPOST-04 and INV-03. Credit never becomes $MUSEGARDEN and never moves between accounts. |
| Grant abuse (insider minting) | ADV-20: grants require all five body fields (issuer, recipient, amount, rationale, evidence) plus 3 voting-pool signatures in the envelope (LEDGER-12), are public, and count against the same receipt discipline. |
| Compromised wallet veto-lock | ADV-21: the old wallet is compromised, the muse key is safe, and the old wallet vetoes every rotation. Contested recovery (IDENT-20, concept §16) breaks the deadlock: a muse-key-signed refiled intent with a 30-day public timelock executes after the window; the old wallet's dispute is published, not a permanent block. |

---

## 15. Pre-mainnet audit criteria

Nothing ships to mainnet until all of the following are true. Anything the concept doc leaves open is marked [OPEN - needs decision].

### 15a. Code and review

- [ ] All [LOCKED]-mechanic unit tests in sections 1-9 pass: LEDGER, LOOP, QUEST, BOUNTY, SEED, ATTEST, STAND, AMEND, COMPOST, GROVE, SHOW, LOTTO, IDENT, TOKEN.
- [ ] All 12 fuzz invariants in section 11 hold under the agreed fuzzing bar (see below).
- [ ] All 7 replay tests in section 13 pass on a mainnet-shaped data volume.
- [ ] Independent review: at least one reviewer with no Garden team affiliation reproduces the replay tests from public data alone (REPLAY-07). Reviewer identity and report are published.
- [ ] Invariant fuzzing bar: the token contracts previously held 194/194 tests with 128,000 invariant calls (2026-09-21). The full system must meet or exceed that bar proportionally: no invariant may go untested, and the fuzz corpus must cover every state transition in sections 1-9.
- [ ] Economic sim sign-off: memos ECON-01 through ECON-03 and ECON-05 through ECON-06 are complete, reviewed, and signed off. ECON-04 may proceed on the locked tribute mechanics (HOLD-01 mechanics resolved 2026-09-24; catalog is council follow-up). ECON-07 unblocked by HOLD-05 (vesting split locked 2026-09-24).
- [ ] No [OPEN - needs decision] item in sections 1-9 remains unresolved. The HOLD list in section 10 is either resolved or explicitly deferred.

### 15b. Deploy-time verification (Bankr/Doppler rails)

- [ ] Deployed supply is exactly 100B; no mint authority exists; `burn` reduces supply (TOKEN-01 through TOKEN-04).
- [ ] 85% pool / 15% vesting split is correct at deploy (TOKEN-05).
- [ ] Vesting: 30-day cliff enforced, 1-year schedule, immutable beneficiary and schedule, `releaseFor` pays only the designated beneficiary (TOKEN-07 through TOKEN-10).
- [ ] Vault recipient address verified correct via quota-free, non-broadcast `bankr launch --simulate` before the real deploy (TOKEN-23). [OPEN - needs decision]
- [ ] Fee wiring: 0.665% creator fee pays the designated recipient directly with no protocol interception (TOKEN-13); 0.285% LP fee compounds into locked liquidity with no withdrawal path (TOKEN-14). The remaining 0.8% of the 1.75% is named (TOKEN-15). [OPEN - needs decision]
- [ ] Town treasury address confirmed by Ryder, Wren, or the town before any wiring (TOKEN-18). [OPEN - needs decision]
- [ ] 2% per-wallet cap active for the first five minutes (TOKEN-21).
- [ ] Degen mode flag is off unless called at launch (TOKEN-22).

### 15c. Operational posture

- [ ] The launch post states the one-sentence test answer plus the 15%-vesting asterisk, with the vesting schedule published alongside.
- [ ] The site states loudly: we never ask for seed phrases or private keys; both-keys-compromised is unrecoverable (IDENT-15); watering earns no XP.
- [ ] The checklist is a living document: any locked decision that changes a number here updates the corresponding test ID in the same pass.
