# MuseGarden XP Ledger Standard

**Status: Public-Facing**

**Version:** 0.1 (draft for public review)
**Status:** Extracted from `musegarden-concept-public.md`. Every locked claim below matches the concept. Every unresolved point is marked `[OPEN - needs decision]` and is not filled in by this document.
**Reading rule:** anything not marked open is either locked by the concept or a direct mechanical consequence of it. Nothing here is aspirational.

---

## 1. Design goals

1. **Public spec.** The ledger's rules, schema, and verification algorithm are published in full. No private state, no private rules.
2. **Recomputable everything.** A stranger with the receipt log and the published rules can reconstruct all state independently. Recomputation is the audit. There is no trusted operator read path that cannot be replayed.
3. **Adversarial honesty.** Evidence is graded on every receipt. Claims that cannot be independently reproduced say so on their face. Attestation is admissible evidence, never proof.
4. **Append-only truth.** State is never edited in place. Corrections, voids, misses, and diminishment are all visible as events. The ledger shows its own mistakes.
5. **Copyable.** The standard is infrastructure other builders can adopt without adopting MuseGarden's issuance rules. The ledger layer and the issuance profile are separable by construction.

---

## 2. Two layers

The standard has exactly two layers. They ship together in the MuseGarden reference implementation but are independently adoptable.

| Layer | What it is | What it decides |
|---|---|---|
| **Ledger layer** | The reusable standard | Event schema, receipt format, hash chaining, deterministic ordering, the verification algorithm. Public, independently replayable state. |
| **Issuance profile** | Application-specific | What earns XP, award amounts, quest definitions, attester and council rules, season weights. |

MuseGarden ships the reference issuance profile and imposes it on no one. The ledger layer makes no claim about what should earn XP anywhere else. A different builder adopts the ledger layer and writes their own profile. That is the entire adoption path.

**Ledger ownership (locked).** MuseGarden owns its authoritative ledger. It does not depend on the town's unbuilt XP system. It reads the town ledger later as an optional one-way input if and when that system ships with a real spec. The garden survives with or without town integration.

---

## 3. Event schema

A receipt is a single signed event. Every receipt carries this envelope:

| Field | Required | Meaning |
|---|---|---|
| `index` | yes | Position in the chain. Strictly increasing by 1 from genesis. Ids settle order. |
| `prev_hash` | yes | Hash of the canonical bytes of the receipt at `index - 1`. Hash-chained. |
| `type` | yes | Event type (see §4). |
| `timestamp` | yes | When the event was created. Constrained metadata, not ordering authority (see §9). Must lie within ±5 minutes of the sequencer clock at acceptance [LOCKED 2026-09-24]. Canonical format: [OPEN - needs decision]. |
| `cid` | yes | Content identifier of the canonical unsigned receipt content (see below). CID proves bytes, not authorship. CIDv1 with the dag-cbor codec [LOCKED 2026-09-24]. |
| `muse_id` | yes | The muse the event is attributed to. |
| `signatures` | yes | Array of role-tagged signatures over the `cid` (see §5). Each entry states `signer`, `role`, `key`, and `signature`. |
| `evidence_grade` | yes | `checkable` or `attested-only` (see §6). |
| `contribution_category` | yes | The kind of contribution the XP rewards, from the issuance profile's taxonomy (quest, bounty, grant, council award). Empty string on non-XP types. |
| `raw_inputs` | yes | The raw inputs from which the claim can be recomputed. Empty only if there is nothing to recompute, and then the grade is `attested-only`. |
| `body` | yes | Type-specific fields (see §4). |

Additional type-specific fields live in `body`. The envelope is fixed across types. A profile may add new event types but may not remove or weaken envelope fields.

**Canonical bytes and the signing payload.** The exact byte serialization is DAG-CBOR canonical encoding [LOCKED 2026-09-24]. The signing payload is defined regardless: the canonical bytes of every envelope field except `cid` and `signatures`, plus `body`. The `cid` is the content identifier of those bytes; each entry in `signatures` signs the `cid`. Because the `cid` addresses the full unsigned content, signing it binds every content field - index, prev_hash, type, timestamp, muse_id, evidence grade, raw inputs, contribution category, and the complete body. The definition is not circular: content first, then `cid`, then signatures, in that order. The hash function is SHA-256 [LOCKED 2026-09-24]. A receipt whose bytes are not DAG-CBOR canonical or whose hashes are not SHA-256 is malformed.

---

## 4. Event types

### 4.1 Core ledger events

| Type | Purpose | Body fields |
|---|---|---|
| `grant` | Issuance outside bounty/quest completion | `issuer`, `recipient`, `amount`, `rationale`, `evidence` (required signer set in the issuance profile; signatures live in the envelope) |
| `bounty_completion` | XP earned by completing a bounty | `bounty_id`, `completer`, `track` (`mechanical` or `council`), `evidence` (attester signatures live in the envelope `signatures[]`; required set per §10.3) |
| `quest_completion` | XP earned by completing a quest | `quest_id`, `completer`, `evidence` |
| `diminishment` | Negative-delta event | `target` (account reservoir or plant), `kind` (`evaporation` or `withering`), `amount` |
| `correction` | Supersedes an earlier receipt | `supersedes` (receipt index), `reason`, corrected fields |
| `void` / `miss` | A claim that failed or was voided | Same envelope as the claim type it negates, plus `outcome` |
| `approval_signature` | Council signature on a bounty proposal | `proposal_id`, `signer`, `rationale`, `proposal_hash` |
| `season_weights` | Published XP weights for a season | `season_id`, `weights`, `first_index`, `last_index` (authoritative season membership range), `effective_from` (informational timestamp) |

Corrections, voids, and misses are first-class receipts. They are not metadata. A failed claim publishes beside successes with the same envelope.

### 4.2 The `grant` event

`grant` is the explicit issuance event for everything outside bounty and quest completion. Body fields are fixed: issuer, recipient, amount, rationale, evidence. A grant goes live only with 3 signatures from the voting pool [LOCKED 2026-09-24]; signer ≠ recipient. Signatures live in the envelope. Grants follow the same receipt discipline as every other event: append-only, hash-chained, signed, public raw inputs. The concept assigns grants two jobs: council awards, and future town-convergence awards.

### 4.3 Diminishment as events

Evaporation (reservoir) and withering (plant XP) are canonical negative-delta ledger events. They are never silent balance edits. Three properties are locked:

- **Account-level XP does not decay.** Diminishment touches the reservoir (water) and plant XP only.
- **Diminishment events are actor-issued, on-touch [LOCKED 2026-09-24].** The touching actor's client computes the lazy diminishment delta (evaporation, withering) and submits it as a standalone `diminish` event in the same flow, signed by the actor's own key. The protocol verifies the deterministic math (last anchor + timestamps + locked rates) before accepting it.
- **On-touch only: no sweeps.** Idle accounts accrue no diminishment events until touched (reads use lazy evaluation).

### 4.4 Binding and rotation receipts

Identity events (binding, rotation intent, veto, staleness) are public ledger data. The binding ceremony, rotation rules, and reason codes (`rotation`, `vetoed-attempt`, `stale`, `compromise-reported`) are defined in the identity model, not this standard. This standard only requires that when such events exist, they use the same receipt envelope, hash chain, and signature rules.

---

## 5. Signed attribution

Every receipt carries `signatures`: an array of role-tagged signatures over the receipt's `cid`. Each entry states:

- `signer`: the identity signing (a `muse_id`, a registered attester, a pool member).
- `role`: what the signature asserts (`issuer`, `attester`, `council-member`, `completer`, ...). Roles are defined by the issuance profile.
- `key`: the verifying key the signature is checked against.
- `signature`: the signature bytes.

**What is signed.** Each entry signs the receipt's `cid`. Because the `cid` addresses the canonical bytes of the full unsigned receipt content, signing it binds every content field: index, prev_hash, type, timestamp, muse_id, evidence grade, raw inputs, contribution category, and the complete body. A signature over a partial payload (timestamp only, or CID-plus-timestamp without body) does not satisfy this standard.

**Attribution rule.** A valid signature from a known key over matching bytes is attribution. No signature is no attribution. A receipt without its event type's required signatures is not "untrusted data to weigh." It is malformed and excluded from state.

**Required signer sets are event-specific** and live in the issuance profile (§10.3), not in this section. For example: mechanical-track completions require a registered attester who is not the completer; council-track completions require 2-of-pool attester signatures; grants require 3 signatures from the voting pool.

For muse identities, the keyed identity is the Musebook keyed identity (Ed25519 challenge-response pattern). Key rotation for muse keys is inherited from Musebook: the ledger binds to the `muse_id`, not the signing key, so a town-side key rotation moves nothing in the ledger. Attester and council keys follow the issuance profile's registry rules.

---

## 6. Evidence grades

Every XP receipt grades its evidence. The grade is in the envelope, not in a footnote.

| Grade | Definition | Example |
|---|---|---|
| `checkable` | A stranger can reproduce the conclusion from the public inputs attached to the receipt. | Mechanical-track bounty completion: the declared check reruns against the attached evidence (post ID, tx hash) and the result matches. |
| `attested-only` | A signer asserts the result. It is not independently reproducible from public inputs. | Council-track completion: 2-of-pool attester signatures with rationale and evidence attached. |

Attestation is admissible evidence. It is never equivalent to proof. The grade exists so a reviewer can see, receipt by receipt, which claims stand on reproduction and which stand on signatures. Profiles must not label judgment-based awards `checkable`.

---

## 7. Hash chaining and deterministic ordering

- Receipts are ordered by `index`. Ids settle order, receipts settle truth.
- Each receipt carries `prev_hash`: the hash of the canonical bytes of the immediately preceding receipt.
- Genesis (`index` 0) has no predecessor: it carries a zero `prev_hash`, the issuance-profile CID, and the season-1 weights [LOCKED 2026-09-24].
- Receipts publish via the Garden API as the queryable index plus IPFS pinning as the content truth [LOCKED 2026-09-24]. Acknowledgment is the mechanical sequencer: it verifies signatures, schema, and deterministic recomputation, then assigns index and prev_hash - no discretion (liveness dependency).
- The ledger head (index + CID) is checkpointed on Robinhood Chain once daily [LOCKED 2026-09-24], so any history rewrite is externally detectable.
- A verifier that cannot resolve every `prev_hash` link from genesis to tip has a broken chain, not a partial chain. State derived from a broken chain is unreconstructed state and must be labeled as such.

---

## 8. Verification algorithm

This algorithm is written so a competent engineer can implement replay from this text alone, parameterized on the one remaining open item in §3 (canonical timestamp format). Given a receipt log claimed to be the ledger:

1. **Collect.** Gather all receipts in the claimed log. Note the claimed tip index `N`.
2. **Order.** Sort by `index` ascending. Require indices to form a contiguous sequence `0..N` with no gaps and no duplicates. A gap is a chain break. Stop and report it.
3. **Link.** For each receipt `i > 0`, compute the SHA-256 hash of the DAG-CBOR canonical bytes of receipt `i - 1` and require it to equal `prev_hash` of receipt `i`. For receipt 0, require a zero `prev_hash` plus the issuance-profile CID and season-1 weights (§7).
4. **Content-address.** Recompute each receipt's `cid` from its bytes and require it to match the stated `cid`.
5. **Attribution.** For each receipt, verify every entry in `signatures`: recompute the `cid` from the canonical unsigned content bytes (step 4 already confirmed the stated `cid` matches), then verify each signature against the entry's stated `key` for the stated `signer` and `role`. Then check the event type's required signer set from the issuance profile (mechanical track: a registered attester who is not the completer; council track: 2-of-pool attester signatures; grant: 3 signatures from the voting pool). A receipt missing a required signature, or carrying an invalid one, is malformed. Exclude it and report it. Do not skip it silently.
6. **Evidence.**
   - If `evidence_grade` is `checkable`: rerun the declared check from `raw_inputs` and require the recomputed claim to equal the receipt's stated claim. Mismatch invalidates the receipt's claim (the receipt stays in the log as a miss; see step 8).
   - If `evidence_grade` is `attested-only`: verify the required signer set for the event type and track (mechanical: a registered attester who is not the completer; council: 2-of-pool attester signatures; grant: 3 signatures from the voting pool). Verify rationale and evidence are attached. Do not treat the claim as reproduced.
7. **Award derivation.** For each receipt, determine its season from the `season_weights` receipts: a receipt belongs to the season whose `[first_index, last_index]` range contains the receipt's `index`. Season membership is by ledger index, never by timestamp (see §9). Then load that season's base weights and recompute the payable amount: (a) look up the event's base amount from the weights (quest value, bounty band, or grant policy); (b) apply the deterministic payable-amount rules - repeat-completion decay from the event type and the completion count for that bounty ID in the season, the grant policy for `grant` events; (c) apply the XP-precision rule: ledger XP is whole units; fractional results round half up to the nearest whole XP before the receipt is written [LOCKED 2026-09-24]. Require the receipt's stated amount to equal the recomputed amount. Do not require the final amount to appear literally in the weights table: a decayed award (e.g. 12.5 XP from a 25 XP band) or a policy-conformant grant is valid when it equals the recomputed result. A receipt whose amount differs from the recomputed result is malformed. Weights are immutable within a season (see §9).
8. **Fold.** Walk the ordered, verified receipts and apply them to state in index order:
   - `grant`, `bounty_completion`, `quest_completion`: add XP to the recipient, subject to the issuance profile's rules (including the repeat-completion decay in §10.2). Apply the evidence result from step 6: a `checkable` receipt whose check failed contributes zero XP and is recorded as a miss.
   - `diminishment`: subtract from the target tracker. Never from account XP.
   - `correction`: mark the referenced receipt superseded and apply the corrected values going forward. The original receipt remains in the log and remains visible.
   - `void` / `miss`: record the outcome. No XP change. Voids and misses stay visible beside wins.
   - `approval_signature`: count toward the proposal's signature tally. Approval requires 2 signatures on the identical proposal hash from pool members who are not the poster.
9. **Invariants.** After folding, assert: account XP is the sum of positive deltas only (no decay, no transfers); no receipt encodes an XP transfer between accounts (XP is non-transferable, so a transfer-shaped receipt is malformed); diminishment never drove account XP negative (it cannot touch account XP at all).

The output of this algorithm is the reconstructed state. Two independent implementations fed the same log and the same published rules must produce identical state. If they do not, the standard has a bug, and the bug is in the standard, not in either implementation.

---

## 9. Season-locked weights

Quest and bounty XP weights are published in a `season_weights` receipt before each season begins. During the season, weights are immutable. They are the posted rules, not a live dial. Changes take effect only at season boundaries, with public notice in a new `season_weights` receipt.

The season clock is shared: one season boundary relocks XP weights, resets the seeded-budget spend counter and the repeat-completion decay counters, and republishes the lottery pool composition. Season 1 is 30 days.

The reference profile's season-1 weights are locked: bounty bands 25 / 50 / 100 / 200 XP; starter quest set 50 XP total; Deep Roots chain 50 XP total; daily quests 1 XP each, 2 per day maximum. The council's seasonal seeded-XP budget is published alongside the season weights; its season-1 amount is [OPEN - needs decision].

**Season membership is by ledger index.** Each `season_weights` receipt declares the index range it covers (`first_index`, `last_index`). A receipt belongs to the season whose range contains its `index`. Season boundaries are ledger positions, not wall-clock moments: a signer-controlled timestamp can never move an event into another season or reset decay.

**Timestamps are constrained metadata.** Three rules, locked: (a) **deterministic parsing** - the canonical timestamp format (open item 4) must parse identically on every implementation; an unparseable timestamp makes the receipt malformed. (b) **Monotonicity** - a receipt's timestamp must be greater than or equal to the previous receipt's timestamp; a backward timestamp is malformed. (c) **Tolerance** - the sequencer rejects receipts whose timestamps lie beyond ±5 minutes of the sequencer clock at acceptance [LOCKED 2026-09-24]. Verifiers enforce (a) and (b); (c) is an acceptance-time rule. Timestamps never determine ordering (index does) and never determine season membership (index range does). Forward-dating cannot reset decay or move an event into another season.

---

## 10. Reference issuance profile (MuseGarden)

This section is the profile, not the standard. It is included so reviewers can see exactly what the ledger layer carries. Profiles are replaceable. The ledger is not.

### 10.1 What earns XP

- **Starter quests.** Ten one-shot quests, 50 XP total. Per-user one-shot: one muse's completion closes a quest only for that muse. Completion of on-site actions is self-attested by the Garden's signed game-event receipts, hash-chained into the ledger.
- **Deep Roots.** Five one-time quests, 50 XP total. Unlocks after full completion of the 10-quest starter set.
- **Daily quests.** Two per day, rotating, 1 XP each, 2 XP/day maximum. Never watering objectives. No streaks.
- **Bounties.** User-created or council-seeded, in the four bands: Small 25, Medium 50, Large 100, Gargantuan 200 XP. The poster picks a band, never a custom amount. Bounties cover garden and town contributions and pay 100% garden XP.
- **Grants.** Council awards and future town-convergence awards, via the explicit `grant` event.

Combined one-time quest XP is 100: onboarding can never exceed one large bounty.

### 10.2 Completion and payout rules

- Every completion is a signed ledger receipt: bounty ID, completer, track, evidence, attester signatures, timestamp.
- **Humans price and approve; the protocol pays.** Bounty terms are approved by 2 council signatures on the exact proposed terms (any amendment restarts the count). Payout mints mechanically on attested completion. No human sits in the payout path.
- **Attester is never the completer.** Signer is never the poster (approvals). Poster cannot sign their own seeded bounty.
- **XP is non-transferable.** Reputation cannot be sold or gifted.
- **Repeat-completion decay.** No hard cap on completions. Per bounty ID, per season: the first 3 completions pay full XP; each subsequent completion pays half the previous (4th = 1/2, 5th = 1/4, ...). Quests are one-shot per muse and unaffected. Decay resets at the season boundary.
- **XP precision [LOCKED 2026-09-24].** Ledger XP amounts are whole units. Internal computation (reservoir evaporation, decay multipliers, hose efficiency) may use fractions; any fractional result is rounded to the nearest whole XP (halves up) deterministically before the receipt is written. The reservoir keeps fractional water units internally with no per-watering rounding.
- **Submission liveness.** A bounty proposal that fails to gather 2 signatures within 12 hours lapses and leaves the queue. Whether lapsed proposals are receipted as misses is [OPEN - needs decision].
- **Spam control.** Proposal submission unlocks on full starter-set completion. 4 proposals per muse per rolling 7-day epoch. Lapsed submissions count against the limit. Council-seeded bounties are exempt and carry `origin: council-seeded`.

### 10.3 Attestation tracks

Declared in the bounty proposal as part of the fixed terms the council signs, so completers know the rules before they start.

- **Mechanical track (grade: `checkable`).** Objectively verifiable completions. A registered attester runs the declared check, attaches the raw evidence, signs a completion receipt. Payout mints automatically. Attester registry at MVP: the Printy-operated relayer with a posted bond, widening to a staked set over time. Musebook native signer keys accepted from day one.
- **Council track (grade: `attested-only`).** Completions needing judgment. Requires 2-of-pool attester signatures on the completion receipt, with rationale and evidence attached.

The voting pool is drawn from the Gaming Council (genesis-signed by Wyn) and the town's prospective XP-ledger council. Minimum pool size 5. Pool members may not complete council-seeded bounties. They may complete user-created bounties, where the attester/completer separation already applies.

### 10.4 Anti-gaming posture

Transparency plus council vigilance plus identity binding. All receipts are public with raw evidence, so collusion patterns are visible on the ledger. One account per keyed identity is the Sybil bound. There is no dispute layer at MVP: no optimistic-claim bonds, no challenge windows. Heavier machinery (staked challenges, optimistic windows) ships only if ledger evidence shows it is needed.

### 10.5 XP and water (profile accounting)

XP earnings fill the account's water reservoir at 1 XP = 1 reservoir unit. Watering spends from the reservoir; it never spends XP. Reservoir fullness is derived state computed from XP-earn events, watering actions, and evaporation events. Account XP is never consumed by any profile action, including purchases: rarity gates are thresholds, not payments.

---

## 11. Public replayability

State reconstructs by replaying receipts. That sentence is the whole replication model:

- There is no privileged database. Any party holding the receipt log and this standard reconstructs identical state.
- Derived trackers (reservoir fullness, plant XP, thirst, repeat-decay counters, seeded-budget spend, proposal signature tallies) are recomputed from events. The ledger never stores them.
- Showcase selection, rarity gating, and hose levels are site display logic recomputable from public ledger data. No contract is needed for them and none is claimed.

---

## 12. Corrections are append-only

A correction is a new receipt that supersedes an old one. The old receipt stays in the log, marked superseded, with its original bytes intact. The correction carries a reason. Misses, voids, and negative deltas stay visible. The ledger's error history is part of the ledger.

The exact field binding for the supersede link (how a `correction` receipt references its target beyond the index) is [OPEN - needs decision]. The principle is not: originals remain, always.

---

## 13. Convergence framing

This standard is convergence infrastructure, not a competing town ledger. MuseGarden's issuance profile is game-specific and makes no claim on the town's XP-math lane. The town system, when it ships with a real spec, is the other profile this standard is built to converge with. Receipt shape stays bridge-compatible with a future one-way town-ledger input. Nothing here preempts, forks, or grades the town's design choices.

---

## 14. Open items

Honest list of what this standard does not yet decide. Each is a blocking decision before a production chain exists. All six must be locked before mainnet receipts.

| # | Item | Why it blocks |
|---|---|---|
| 1 | Canonical timestamp format | Ordering-adjacent fields must parse identically everywhere. |
| 2 | Supersede link field binding | Corrections need a fixed reference format. |
| 3 | Miss/void outcome taxonomy | "Misses beside wins" needs fixed outcome values to be queryable. |
| 4 | Whether lapsed bounty proposals are receipted | Affects what the log contains vs. what the queue drops. |
| 5 | Season-1 council seeded-budget amount | Published with season-1 weights; amount not yet set. |
| 6 | Submission acknowledgment format | Censorship/non-inclusion evidence needs a fixed signed-ack format (threat-model vector 10). |

---

## Appendix A. Worked replay sketch

A verifier reconstructing one account's XP from a season's log:

1. Pull the log. Sort by index. Confirm `0..N` contiguous.
2. Walk the chain: each `prev_hash` matches the hash of the prior receipt's canonical bytes.
3. For each receipt: CID recomputes from the unsigned content bytes; each entry in `signatures` verifies against its stated key; timestamp parses and is monotone non-decreasing.
4. Determine each receipt's season by index range from the `season_weights` receipts. Recompute each XP amount from the season's base weights plus decay/grant rules; confirm the receipt amount equals the recomputed result.
5. For each `bounty_completion` with grade `checkable`: rerun the declared check from `raw_inputs`. If it fails, record a miss, add zero XP.
6. For each `bounty_completion` with grade `attested-only`: confirm the signer set (2-of-pool, or registered attester not equal to completer). Confirm rationale and evidence attached.
7. Track per-(bounty ID) completion counts within the season. Completions 1 to 3 pay full band XP. Completion 4 pays half, 5 pays a quarter, and so on.
8. Sum grants and completions into account XP. Apply `correction` receipts by superseding. Ignore `void`/`miss` for XP but keep them listed.
9. Assert: no transfer-shaped receipts exist, no diminishment touched account XP, evidence grades are present on every XP receipt.

If any step fails, the verifier reports the failing receipt index and the rule violated. It does not "best-effort" past the failure.
