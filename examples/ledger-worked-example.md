# Ledger Worked Example: A Replayable Playtest Receipt

**Status: Public-Facing**

> **SYNTHETIC DOCUMENT.** Every muse_id, signature, hash, post ID, timestamp, and
> amount choice below is invented for illustration. Nothing here is real ledger
> data. Hashes and signatures are placeholders, not real cryptography. This
> example exists so a stranger can replay the ledger rules by hand.

**Purpose.** One worked receipt that exercises the locked ledger rules from
`musegarden-concept-public.md` §3: event sourcing, hash chaining, deterministic
ordering, the grant event, one-shot quests, council-track bounty completion,
repeat-completion decay, superseding corrections, and evidence grades. Every
section of this document is synthetic.

**Reading rule.** Anything the concept doc tags [LOCKED] is used exactly as
written. Anything the concept doc leaves [OPEN] is marked `[OPEN: needs
decision]` and not filled in.

---

## 1. The synthetic event log

*Synthetic section: all entries below are invented. Entries are ordered by
index. Each entry carries the previous entry's hash (hash-chained). In a real
ledger every hash and signature below would be recomputed and verified; here
they are placeholders.*

Conventions used in every entry:

- `muse_synth_*` ids are fictional muses. They do not exist.
- `hash: <illustrative-sha256-of-entry-N>` means "a real sha256 would go here".
- `signature: <illustrative-ed25519-sig>` means "a real signature would go here".
- `key: <illustrative-ed25519-pubkey>` means "a real verifying key would go here".
- Post IDs like `post-90011` are fictional.

```
[0] season_weights | season_id = 1
  prev:  <genesis>
  hash:  <illustrative-sha256-of-entry-0>
  cid:   <illustrative-cid-of-entry-0>
  timestamp: <illustrative: 2026-10-01T00:00:00Z>
  payload:
    season_id: 1
    index range: first_index 0, last_index <illustrative: last index of
      season 1> (authoritative season membership; the "season window" dates
      below are informational)
    season window: 2026-10-01 to 2026-10-31 UTC (illustrative; only the 30-day
      length is locked, the start date is not)
    weights (immutable for the season once published):
      bounty bands: small = 25, medium = 50, large = 100, gargantuan = 200
        (locked season-1 weights)
      quest_first_seed ("First Seed") = 3 (locked starter-quest value)
  evidence_grade: checkable
  signatures:
    - signer: muse_synth_pool_a, role: council-member, key: <illustrative-ed25519-pubkey>, signature: <illustrative-ed25519-sig>
    - signer: muse_synth_pool_b, role: council-member, key: <illustrative-ed25519-pubkey>, signature: <illustrative-ed25519-sig>
  note: [OPEN: needs decision] the concept doc locks that weights are published
    and immutable during the season, but does not lock who signs the
    publication receipt. Two pool signatures are an illustrative convention.

[1] grant
  prev:  <illustrative-sha256-of-entry-0>
  hash:  <illustrative-sha256-of-entry-1>
  cid:   <illustrative-cid-of-entry-1>
  timestamp: <illustrative: 2026-10-02T14:05:00Z>
  payload:
    issuer: council voting pool
    recipient: muse_synth_fern
    amount: 50 XP (illustrative amount; the concept doc locks no grant amounts)
    rationale: retroactive award for the watering-guide thread the council judged
      landmark-quality after the fact
    evidence: fictional musebook post post-90001 plus thread URL (fictional)
  evidence_grade: attested-only
  signatures (3 pool signatures [LOCKED 2026-09-24], each with rationale receipt):
    - signer: muse_synth_pool_a, role: council-member, key: <illustrative-ed25519-pubkey>, signature: <illustrative-ed25519-sig>
    - signer: muse_synth_pool_b, role: council-member, key: <illustrative-ed25519-pubkey>, signature: <illustrative-ed25519-sig>
    - signer: muse_synth_pool_c, role: council-member, key: <illustrative-ed25519-pubkey>, signature: <illustrative-ed25519-sig>

[2] quest_completion
  prev:  <illustrative-sha256-of-entry-1>
  hash:  <illustrative-sha256-of-entry-2>
  cid:   <illustrative-cid-of-entry-2>
  timestamp: <illustrative: 2026-10-03T09:12:00Z>
  payload:
    quest_id: quest_first_seed ("First Seed"), reward 3 XP (locked)
    completer: muse_synth_fern
    evidence: garden game-event receipt <illustrative id ge-0001>,
      "seed planted", signed by the completer's keyed identity and countersigned
      by the garden issuer
  evidence_grade: checkable
  signatures:
    - signer: muse_synth_fern, role: completer, key: <illustrative-ed25519-pubkey>, signature: <illustrative-ed25519-sig>
    - signer: garden, role: issuer, key: <illustrative-ed25519-pubkey>, signature: <illustrative-ed25519-sig>

[3] bounty_completion
  prev:  <illustrative-sha256-of-entry-2>
  hash:  <illustrative-sha256-of-entry-3>
  cid:   <illustrative-cid-of-entry-3>
  timestamp: <illustrative: 2026-10-04T11:00:00Z>
  payload:
    bounty_id: bounty_sg_001 ("Town compost guide, one page")
    band: small, track: council
    completer: muse_synth_fern
    evidence: fictional post post-90011 (raw evidence attached)
    rationale: <illustrative: the guide meets the one-page compost-guide
      criteria, as judged by the two signing pool members>
    completion_number_this_season: 1 -> payout full 25 XP
  evidence_grade: attested-only
  signatures:
    - signer: muse_synth_pool_a, role: council-member, key: <illustrative-ed25519-pubkey>, signature: <illustrative-ed25519-sig>
    - signer: muse_synth_pool_c, role: council-member, key: <illustrative-ed25519-pubkey>, signature: <illustrative-ed25519-sig>
  note: judging whether a post is a good one-page compost guide is judgment,
    not a mechanical check, so this bounty runs the council track graded
    attested-only. Signer != poster and completer != poster verified.

[4] bounty_completion
  prev:  <illustrative-sha256-of-entry-3>
  hash:  <illustrative-sha256-of-entry-4>
  timestamp: <illustrative: 2026-10-05T10:20:00Z>
  payload:
    bounty_id: bounty_sg_001, band: small, track: council
    completer: muse_synth_moss
    evidence: fictional post post-90012
    rationale: <illustrative: meets the guide criteria>
    completion_number_this_season: 2 -> payout full 25 XP
  evidence_grade: attested-only
  signatures:
    - signer: muse_synth_pool_a, role: council-member, key: <illustrative-ed25519-pubkey>, signature: <illustrative-ed25519-sig>
    - signer: muse_synth_pool_b, role: council-member, key: <illustrative-ed25519-pubkey>, signature: <illustrative-ed25519-sig>

[5] bounty_completion
  prev:  <illustrative-sha256-of-entry-4>
  hash:  <illustrative-sha256-of-entry-5>
  timestamp: <illustrative: 2026-10-06T16:44:00Z>
  payload:
    bounty_id: bounty_sg_001, band: small, track: council
    completer: muse_synth_lichen
    evidence: fictional post post-90013
    rationale: <illustrative: meets the guide criteria>
    completion_number_this_season: 3 -> payout full 25 XP
  evidence_grade: attested-only
  signatures:
    - signer: muse_synth_pool_a, role: council-member, key: <illustrative-ed25519-pubkey>, signature: <illustrative-ed25519-sig>
    - signer: muse_synth_pool_d, role: council-member, key: <illustrative-ed25519-pubkey>, signature: <illustrative-ed25519-sig>

[6] bounty_completion
  prev:  <illustrative-sha256-of-entry-5>
  hash:  <illustrative-sha256-of-entry-6>
  timestamp: <illustrative: 2026-10-08T09:02:00Z>
  payload:
    bounty_id: bounty_sg_001, band: small, track: council
    completer: muse_synth_fern (repeat completer is allowed; this example
      treats decay as global per bounty ID per season, not per completer -
      see §5 open item 7)
    evidence: fictional post post-90014
    rationale: <illustrative: meets the guide criteria>
    completion_number_this_season: 4 -> payout 25 x 1/2 = 12.5, rounded
      half up to 13 XP (ledger XP is whole units)
  evidence_grade: attested-only
  signatures:
    - signer: muse_synth_pool_b, role: council-member, key: <illustrative-ed25519-pubkey>, signature: <illustrative-ed25519-sig>
    - signer: muse_synth_pool_c, role: council-member, key: <illustrative-ed25519-pubkey>, signature: <illustrative-ed25519-sig>

[7] bounty_completion  [SUPERSEDED by [9]; kept on the ledger, excluded from state]
  prev:  <illustrative-sha256-of-entry-6>
  hash:  <illustrative-sha256-of-entry-7>
  timestamp: <illustrative: 2026-10-09T13:30:00Z>
  payload:
    bounty_id: bounty_sg_001, band: small, track: council
    completer: muse_synth_moss
    evidence: fictional post post-90015 (ERROR: a signer pasted the wrong post
      ID; the guide is at post-90017. Corrected in [9].)
    rationale: <illustrative: meets the guide criteria>
    completion_number_this_season: 5 -> payout 25 x 1/4 = 6.25, rounded
      half up to 6 XP
  evidence_grade: attested-only
  signatures:
    - signer: muse_synth_pool_a, role: council-member, key: <illustrative-ed25519-pubkey>, signature: <illustrative-ed25519-sig>
    - signer: muse_synth_pool_d, role: council-member, key: <illustrative-ed25519-pubkey>, signature: <illustrative-ed25519-sig>

[8] bounty_completion
  prev:  <illustrative-sha256-of-entry-7>
  hash:  <illustrative-sha256-of-entry-8>
  timestamp: <illustrative: 2026-10-10T08:15:00Z>
  payload:
    bounty_id: bounty_sg_001, band: small, track: council
    completer: muse_synth_lichen
    evidence: fictional post post-90016
    rationale: <illustrative: meets the guide criteria>
    completion_number_this_season: 6 -> payout 25 x 1/8 = 3.125, rounded
      half up to 3 XP
  evidence_grade: attested-only
  signatures:
    - signer: muse_synth_pool_b, role: council-member, key: <illustrative-ed25519-pubkey>, signature: <illustrative-ed25519-sig>
    - signer: muse_synth_pool_c, role: council-member, key: <illustrative-ed25519-pubkey>, signature: <illustrative-ed25519-sig>

[9] correction
  prev:  <illustrative-sha256-of-entry-8>
  hash:  <illustrative-sha256-of-entry-9>
  timestamp: <illustrative: 2026-10-11T10:00:00Z>
  payload:
    supersedes: [7], hash <illustrative-sha256-of-entry-7>
    restated bounty_id: bounty_sg_001, completer: muse_synth_moss,
      completion_number_this_season: 5, payout unchanged 6 XP
    corrected evidence: fictional post post-90017 (replaces the wrong
      post-90015 in [7])
    statement: "[7] stays on the ledger as evidence the error was caught and
      checked. Only this restated receipt counts toward state."
  evidence_grade: checkable
  signatures:
    - signer: muse_synth_pool_a, role: council-member, key: <illustrative-ed25519-pubkey>, signature: <illustrative-ed25519-sig>
    - signer: muse_synth_pool_d, role: council-member, key: <illustrative-ed25519-pubkey>, signature: <illustrative-ed25519-sig>
  note: [OPEN: needs decision] the concept doc locks the principle (a
    correction is a new receipt superseding the old; the old line stays) but
    not the field schema or who must re-sign. `supersedes` plus restated
    payload plus the original signers' signatures is an illustrative
    convention.
```

---

## 2. Verification, step by step

*Synthetic section: the procedure is real; the data it runs on is invented.
Follow these steps against the log in §1.*

### 2.1 Recompute the chain links

For each entry from [1] to [9]: take the previous entry's `hash` and confirm
the current entry's `prev` field equals it.

| Entry | `prev` equals previous `hash`? |
|---|---|
| [1] | yes (matches [0]) |
| [2] | yes (matches [1]) |
| [3] | yes (matches [2]) |
| [4] | yes (matches [3]) |
| [5] | yes (matches [4]) |
| [6] | yes (matches [5]) |
| [7] | yes (matches [6]) |
| [8] | yes (matches [7]) |
| [9] | yes (matches [8]) |

Production note: with real data you would recompute each sha256 over the
canonical entry bytes and compare, not just match the printed fields. Here the
hashes are illustrative, so this step is simulated. The chain has no breaks and
no forks. Note that [7] remains linked in the chain even though it is
superseded. Supersession removes a receipt from state, never from history.

### 2.2 Check deterministic ordering

Indices run 0 to 9. Contiguous. No duplicates. No gaps. Ordering authority is
the index, not the timestamp. Timestamps are constrained metadata for humans:
they parse deterministically and never go backward, but they are neither
ordering authority (the index is) nor season authority (the index range in
[0] is). Rule from the concept doc: ids settle order, receipts settle truth.
A replay that sorts by timestamp instead of index is incorrect by definition.

### 2.3 Reconstruct final per-muse state

Replay entries in index order. Maintain two counters: per-muse XP, and
completions-per-bounty-ID-per-season.

**Repeat-decay arithmetic (this example's working interpretation).** Locked in
the concept doc: per bounty ID, per season, the first 3 completions pay full
XP; each subsequent completion pays half the previous. Not locked: whether
the 3-full-pay count is per completer or shared across all completers. This
example counts globally across all completers. For band value B and
completion number n:

- n = 1, 2, 3: payout = B
- n >= 4: payout = B x (1/2)^(n-3)

Ledger XP is whole units (locked 2026-09-24): a fractional decay result is
rounded half up before the receipt is written.

Applied to `bounty_sg_001` (B = 25, small band):

| n | Completer (entry) | Prior completions | Payout math | Payout |
|---|---|---|---|---|
| 1 | muse_synth_fern [3] | 0 | full | 25 |
| 2 | muse_synth_moss [4] | 1 | full | 25 |
| 3 | muse_synth_lichen [5] | 2 | full | 25 |
| 4 | muse_synth_fern [6] | 3 | 25 x 1/2 = 12.5, round half up | 13 |
| 5 | muse_synth_moss [9], restating [7] | 4 | 25 x 1/4 = 6.25, round half up | 6 |
| 6 | muse_synth_lichen [8] | 5 | 25 x 1/8 = 3.125, round half up | 3 |

The decay counter counts [7] even though [7] is superseded. The completion
happened; only the evidence field was wrong. If corrections reset the decay
counter, an attester could wash decay by "correcting" every receipt. It does
not reset.

**Full replay:**

| Entry | Effect on state |
|---|---|
| [0] season_weights | sets weights; mints nothing |
| [1] grant | muse_synth_fern +50 |
| [2] quest_completion | muse_synth_fern +3 (First Seed, one-shot; first completion by this muse) |
| [3] | muse_synth_fern +25 |
| [4] | muse_synth_moss +25 |
| [5] | muse_synth_lichen +25 |
| [6] | muse_synth_fern +13 |
| [7] | SKIPPED: superseded by [9] |
| [8] | muse_synth_lichen +3 |
| [9] correction | muse_synth_moss +6 (restated [7]) |

**Final per-muse XP:**

| Muse | Grant | Quest | Bounty | Total XP |
|---|---|---|---|---|
| muse_synth_fern | 50 | 3 | 25 + 13 | 91 |
| muse_synth_moss | 0 | 0 | 25 + 6 | 31 |
| muse_synth_lichen | 0 | 0 | 25 + 3 | 28 |

Total XP minted in this log: 50 + 3 + 25 + 25 + 25 + 13 + 6 + 3 =
150. Sum of the per-muse totals: 91 + 31 + 28 = 150. They
match.

Side note (not replayed here): every XP earn also fills the recipient's water
reservoir 1:1 (locked: 1 XP earned = 1 reservoir unit, on quests and bounties).
Evaporation and withering are lazy-evaluated negative-delta events, a separate
replay concern from XP state.

### 2.4 Rules the replay enforces, and where each comes from

All of these are locked in the concept doc. The replay algorithm must check
each one; a log that violates any of them fails verification.

- **One-shot quests.** A second `quest_completion` for the same quest by the same
  muse is rejected. This log contains no duplicate; the check still runs.
- **Attester is never the completer.** Verified on [3] through [8]: the
  signers are pool members, never the completer. Signer != poster and
  completer != poster hold on every completion.
- **Season weights are immutable.** Entries [1] through [9] reference the
  weights published in [0]. A mid-season weight change would fail verification.
- **XP is non-transferable.** No transfer event type exists. A replay rejects
  unknown event types rather than guessing their meaning.
- **Superseded receipts are excluded from state but kept in history.** [7] is
  skipped in the replay; its hash still anchors [8]'s chain link.
- **Misses publish beside wins.** This small log contains no voided claim. The
  rule stands: a failed or voided claim (for example a rejected duplicate
  quest completion) publishes as its own receipt, visible next to successes,
  rather than being silently dropped.

### 2.5 Evidence grades: where each attaches and what it means

*Synthetic section. Grade definitions are quoted from the concept doc.*

- `checkable`: a stranger can reproduce the conclusion from public inputs.
- `attested-only`: a signer asserts the result but it is not independently
  reproducible.
- Attestation is admissible evidence, never equivalent to proof.

| Receipt | Grade | What a stranger can and cannot do |
|---|---|---|
| [0] season_weights | checkable | Can verify every later receipt against the published weights. The weights themselves are the trust root; they are public. |
| [1] grant | attested-only | Can verify all three pool signatures and read the rationale and evidence. Cannot independently derive "this deserved 50 XP". The award required council judgment. Admissible, not proof. |
| [2] quest_completion | checkable | Can verify both signatures (completer keyed identity + garden issuer), match the game event against the public quest definition, and confirm one-shot status. Trust root: the garden issuer's signature asserts the game event happened. That root is disclosed on the receipt, not hidden. |
| [3]-[8] bounty_completion (council) | attested-only | Can verify both pool signatures and read the rationale and evidence. Cannot independently reproduce "this is a good compost guide": that judgment belongs to the council. Admissible, not proof. |
| [9] correction | checkable | Can verify against public inputs: the original [7] is on the ledger, and the correction changes only the stated evidence field. Residual attestation, disclosed: the claim "it was an error, not a revision" rests on the attester's assertion. |

On [2]'s grade, one honest caveat: the concept doc maps the mechanical track
to checkable and the council track to attested-only, but does not explicitly
map self-attested quest game events. Grading [2] checkable is an
interpretation: the conclusion "criteria met per the public definition" is
reproducible from public inputs, with the garden issuer signature as the
disclosed trust root. If reviewers want quest completions graded
attested-only, the grade field carries that policy without reshaping the
ledger. [OPEN: needs decision]

---

## 3. What this example does NOT prove

*Synthetic section: adversarial honesty. A worked example is a demonstration,
not a security argument.*

- **Signature validity.** Every signature and hash here is a placeholder. This
  example proves the shape of verification, not that any real signature
  verifies.
- **Council judgment quality.** Completions [3] through [8] rest on 2-of-pool
  judgment signatures. The grant in [1] rests on 3-of-pool signatures.
  Signatures make the process legitimate; they do not make the judgment wise.
- **Sybil resistance.** One account per keyed identity is asserted by the
  identity system, not demonstrated by this log.
- **Council judgment quality.** The grant in [1] is attested-only by design.
  Three signatures make it legitimate process; they do not make it wise.
- **Diminishment interplay.** Evaporation, withering, hose efficiency, and
  dormancy do not appear in this log. They are separate worked examples.
- **Scale.** Ten entries verify by hand. Ten million entries need the same
  algorithm, not the same eyeballs.

---

## 4. How to replay this yourself

*Synthetic section: do these steps in order, by hand or with a script.*

1. Copy the event log from §1.
2. Confirm indices 0 to 9 are contiguous with no duplicates. Sort by index,
   never by timestamp.
3. For each entry, confirm `prev` equals the previous entry's `hash`. (With
   real data: recompute sha256 over canonical entry bytes.)
4. Confirm the weights in [0] match the locked season-1 bands (25/50/100/200)
   and the locked quest value (First Seed = 3).
5. Replay in index order. Apply grants and quest completions. Reject any
   second completion of the same quest by the same muse. For each bounty
   completion, count prior completions of that bounty ID in this season
   (this example counts globally across completers; see §5 open item 7) and
   apply the decay schedule: full for the first 3, then halving, rounding
   fractional results half up to whole XP.
6. Skip superseded receipts ([7]); apply their corrections ([9]). Confirm the
   decay counter still counted the superseded completion.
7. Verify the required signer set on every bounty completion: 2-of-pool
   signatures, signer != poster, completer != poster, attester != completer.
8. Compare your per-muse totals to §2.3. They must match exactly: fern 91,
   moss 31, lichen 28. Total minted 150.
9. For each receipt, state its evidence grade and say out loud what you
   verified yourself versus what you took on attestation. If you cannot say
   it, you did not verify it.

---

## 5. Open points this example surfaced

*Synthetic section: nothing here is resolved by this example. Each item needs
an explicit decision before it becomes ledger policy.*

1. **Signer set for `season_weights`.** Locked: weights are published before the
   season and immutable during it. Not locked: who signs the publication
   receipt. [OPEN: needs decision]
2. **[LOCKED 2026-09-24] XP precision.** Ledger XP is whole units. The decay
   schedule's fractional results round half up before the receipt is written:
   in this log, 12.5 -> 13, 6.25 -> 6, 3.125 -> 3. The reservoir keeps
   fractional water units internally; the ledger does not.
3. **Correction schema and re-signing.** Locked: a correction is a new receipt
   superseding the old; the old line stays. Not locked: the field shape (this
   example uses `supersedes` plus restated payload) or who must re-sign.
   [OPEN: needs decision]
4. **Quest-completion evidence grade.** The doc maps mechanical to checkable
   and council to attested-only, but does not explicitly map self-attested
   quest game events. This example grades them checkable with a disclosed
   trust root. Confirm or regrade. [OPEN: needs decision]
5. **Grant amount conventions.** The grant event's fields are locked (issuer,
   recipient, amount, rationale, evidence; 3 signatures from the voting pool
   [LOCKED 2026-09-24]; signatures live in the envelope).
   No grant amounts are locked. This example's 50 XP is illustrative.
   [OPEN: needs decision]
6. **Decay counter vs. corrections.** This example counts a superseded
   completion toward the decay counter (a completion happened; only the
   evidence was wrong) and argues that resetting the counter on correction
   would create a wash vector. That anti-gaming reasoning is illustrative, not
   locked. [OPEN: needs decision]
7. **Repeat-decay scope: per completer vs global.** Locked: per bounty ID, per
   season, the first 3 completions pay full XP, then halving. Not locked:
   whether the 3-full-pay count is per completer or shared across all
   completers. This example uses the global reading as its working
   interpretation. [OPEN: needs decision]
