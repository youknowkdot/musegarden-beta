# MuseGarden Threat Model

**Status: Public-Facing**

**Status:** Adversarial analysis of the locked design, current through 2026-09-24.
**Canon:** `musegarden-concept-public.md` and `compost-model-2026-09-23.md`.
**Reading rule:** anything tagged [LOCKED] in the concept doc is treated as fixed here. Anything [OPEN] or [PROPOSED] is marked as such and not filled in. Where the concept doc is ambiguous, this document says so instead of guessing.

This document is written for hostile reviewers. It states trust assumptions and residual risks plainly. It does not soften the unattractive parts. The falsifier for each vector is listed in the summary table at the end: what evidence would prove this analysis wrong.

## Trust assumptions, stated up front

These are not mitigations. They are the load-bearing assumptions the design rests on.

1. **The town is our Sybil boundary, not us.** One account per keyed identity. We do not control keyed-identity issuance or its cost. If town identities become cheap, our Sybil bound weakens and we have no second line.
2. **At launch, mechanical-track completion rests on one bonded operator.** The MVP attester is a Printy-operated relayer with a posted bond. This is a single-operator trust point at launch, whatever the design's longer-term intent.
3. **Printy holds two seats.** Printy operates the mechanical attester and also sits in the council voting pool. The same entity attests completions and co-governs approvals.
4. **There is no dispute layer.** It was cut 2026-09-18 and stays cut. Heavier machinery (staked challenges, optimistic windows) ships only if ledger evidence shows it is needed.
5. **XP has no market by lock, not by physics.** XP is non-transferable, never spent, never decays. The sale of whole accounts (the keyed identity itself) is outside the protocol and cannot be closed by it.
6. **The ledger assembler is trusted for liveness and ordering at launch.** Index assignment, `prev_hash` chaining, and inclusion are operator-run via a mechanical sequencer (no discretion - accept/reject is purely rule-based). Daily ledger-head checkpoints anchor on Robinhood Chain and every submission returns a signed acknowledgment [LOCKED 2026-09-24] (see vector 10).

---

## 1. Buy-to-neglect compost farming

**The attack.** Buy a plant, deliberately neglect it past 48h dry, burn it for 30% store credit, rebuy at a discount, repeat. Scale it across many plants and identities.

**Cost-benefit.** There is no profit in the loop. Per the compost memo's unit economics: buy at 1.0 (1.0 burned), compost to 0.3 credit, rebuy costs 0.7 in real tokens plus 0.3 credit. Every cycle after the first costs the farmer 0.70 real tokens to hold a plant they must destroy again. There is no XP from compost. Credit is offchain, non-transferable, and cannot be manufactured without a preceding 100% token burn. Pure-credit chains decay geometrically (1.0 to 0.3 to 0.09 to zero). The flat 30% rate applies to all tiers, so there is no cross-rarity arbitrage. Amendments and Second Spring are consumables and cannot be composted. Scale is Sybil-bound (one account per keyed identity; C 5/day purchase limit per muse). The memo's adversarial stress: 5% of base players max-farming raises the burn haircut to 13.7%, and the farmers still burned 7,500 real tokens to do it.

**Mitigation.** Structural, not behavioral. Every unit of credit traces to a preceding 100% burn, so per-season burn displacement cannot exceed the 30% rate itself, and only in the degenerate case where every plant ever bought is composted and all credit redeemed. **Basis rules (locked 2026-09-24, concept §8):** credit derives only from the composter's own qualifying primary purchase (the $MUSEGARDEN they personally paid at the plant stand, 100% burned). Free seeds, lottery-won plants, and amendment/tribute items carry no compost basis. Credit-funded purchases do not recreate basis: only the $MUSEGARDEN actually paid counts toward a future compost, so a plant bought entirely with credit has zero basis. Secondary-market plants carry no compost basis for the new holder: only the original primary purchaser can earn compost credit on a plant. This closes the deterministic-profit loop where a withered plant bought below its compost value could be composted for more than was paid.

**Residual risk.** Compost is a real cost, not zero. Base case: 5.6% of primary burns displaced in season 1, 7.5% in steady state (the memo's "~6-8%"). Structural worst case: 30%. The monitoring tripwire is locked: revisit the rate only if sustained compost share exceeds 50% of purchased value (haircut above ~15%). Credit never expires, so overhang can stack across seasons; the steady-state math already assumes full cycling. What farming actually does is subsidize additional purchases at a 30% margin discount to the protocol's burn line. That is the honest price of the churn-recovery mechanic.

---

## 2. Wash trading plants on secondary

**The attack.** Buy and sell a plant NFT back and forth between wallets you control (or with a confederate) to simulate market activity: fake floor prices, fake volume, fake demand.

**Cost-benefit.** In the locked design, no protocol reward keys to secondary volume. XP is non-transferable. Watering earns no XP. Showcase selection ranks by plant XP added in the past week, which is watering-driven, not trade-driven. Lottery entry and eligibility rules are not yet defined (entrant-side scaling mechanism is [LOCKED 2026-09-24]; "Sybil resistance belongs at entry (eligibility/XP)" is stated but eligibility criteria are not). So a wash trader pays gas plus royalty friction on every round trip (50% of NFT royalties route to the town treasury, per the locked town share) and gains nothing in-protocol.

**Mitigation.** Absence of payoff is the mitigation. There is nothing to farm: no volume-based rewards, no trade-counted quests, no holdings-based gates in the locked design.

**Residual risk.** Two honest remainders. First, off-protocol narrative fabrication: a washer can screenshot fake "sales" to manufacture perceived demand or floor prices for social status. The ledger cannot stop screenshots; it can only fail to corroborate them. Second, the open edges that could make wash trading real later: if lottery eligibility ever keys to holdings or purchase history, wash trading becomes a live vector (currently [OPEN]). Related open item resolved [LOCKED 2026-09-24 - transfer resets to seed]: plant XP and stage do not travel with the NFT - a change of owner wipes XP and resets the plant to seed-level, so transfer is a pure cosmetic move and wash transfers cannot inflate garden value.

---

## 3. Council self-dealing

**The attack.** Pool members approve weak or duplicative bounties and attest confederate completions, routing XP to themselves or allies. Variants: (a) two members approve a junk user bounty posted by a confederate, then both sign the council-track completion for that confederate; (b) a member completes a user-created bounty themselves (allowed by lock) with two colleagues waving through approval and attestation; (c) seeded bounties, which skip the user queue, get seeded and completed by a ring.

**Cost-benefit.** Each attempt costs proposal slots (4 per muse per rolling 7-day epoch; lapsed submissions count), a 12-hour approval window, and a permanent public paper trail: every signature is a signed ledger receipt with rationale, raw evidence attached, misses published beside wins. The confederate must be a real muse (one account per keyed identity; XP non-transferable), so extraction is bounded by the town's identity cost and is fully visible.

**Mitigation (all locked).** Signer cannot be the poster. For seeded bounties, the poster cannot sign their own seed and approval needs 2 signatures from *other* pool members. Completer cannot be the poster. Pool members may not complete council-seeded bounties at all. The 12-hour lapse kills proposals nobody will co-sign. The seasonal seeded budget bounds total council-minted XP (process is checked by 2 signatures; amount is checked by the budget). Seeded bounties carry `origin: council-seeded` on the ledger so the exemption is auditable. Minimum pool size 5, with majority-vote admission and removal, so 2 colluders do not control the pool.

**Residual risk.** The honest gap: 2-of-pool collusion is sufficient to defeat every approval-side check, and there is no aggregate budget bound on *user*-bounty XP, only on seeded bounties. The 2-signature bar is the only ceiling on the user-bounty faucet; if two signers go bad together, the ceiling is gone and the protocol mints XP on their say-so until the remaining pool members vote them out. The grant event (the direct-issue path for council awards, with issuer/recipient/amount/rationale/evidence/signatures fields) carries a 3-signature approval threshold [LOCKED 2026-09-24]. The seasonal seeded budget amount is open until season-1 weights are set. Detection is strong (public receipts, evidence grades, rationale). Enforcement is social (majority vote), not mechanical. With the dispute layer cut, there is no in-protocol challenge to a signed collusive completion; there is only exposure and expulsion.

---

## 4. Attester collusion

**The attack.** The mechanical-track attester signs false completion receipts ("post exists" when it does not; "contract deployed" when it is not). Payout mints automatically. No human sits in the payout path.

**Cost-benefit.** At MVP this attack costs the operator nothing in-protocol: one signature mints XP. The only cost is reputational and public: every completion receipt carries raw evidence (post ID, tx hash) graded `checkable`, so a stranger can verify the claim independently. Fabrication is detectable by anyone who looks.

**Mitigation.** Detection, not deterrence. Receipts are hash-chained and append-only, so a false attestation cannot be silently edited away later; it stands as permanent evidence of the lie. The decentralization path is locked in the concept doc (verified): the registry widens to a staked set over time, and Musebook native signer keys are accepted from day one.

**Residual risk, stated without dressing.** At launch, mechanical completion rests on one bonded operator. The bond's amount, who posts it, and the slashing or forfeiture path are all unspecified in the concept doc [OPEN - needs decision]. A bond with no defined forfeiture path is a deposit, not a deterrent. The dispute layer is cut, so there is no in-protocol challenge to a false receipt. The relayer's removal path is unspecified (the pool's majority-vote rule covers pool members, not the relayer). Until the staked set ships, a captured or dishonest relayer can mint XP at will, and the only response available is public exposure followed by social or operational action outside the protocol. The timeline for widening to a staked set is not locked.

**Reconciliation (concept, locked 2026-09-24).** The "not Printy-only" rule is about *approval authority*: no one party, including Printy, unilaterally approves bounties or writes ledger receipts alone (2-signature council rule). The mechanical track is Printy-*executed* with no human deciding payouts - mechanical verification, not operator discretion. The remaining single-operator trust point is *execution*: at launch the relayer runs on operator infrastructure, which is vector 10's subject, not a contradiction.

---

## 5. Sybil: multi-identity farming

**The attack.** Control N keyed identities. Run N accounts in parallel to multiply every per-account faucet and limit.

**Cost-benefit.** The cost is the town's keyed-identity issuance cost, per identity. We do not set it, price it, or control it. Per identity, the yield is: 100 XP in one-time quest faucets (starter set 50, Deep Roots 50), 2 XP/day from daily quests, an independent 100-unit reservoir, independent per-muse purchase limits (5/3/2/1 per day by rarity), and independent bounty completions. Quest completions are self-attested on-site receipts, so there is no per-identity verification friction beyond the town boundary. One wallet may back multiple muses (explicitly allowed), so funding centralizes while identities stay separate; each muse_id keeps its own binding-history chain, and rotation is timelocked, vetoable, and public, so there is no clean slate for laundering plants or dodging history.

**Mitigation.** The yield is non-fungible by lock. XP cannot be transferred, spent, or gifted. Compost credit cannot be transferred. Plants and water have no cash-out path in-protocol; purchases cost real $MUSEGARDEN. A 100-XP account is a status account, not a money printer.

**Residual risk.** A multi-identity operator gets N parallel status accounts and N race entries for the mythic jackpot (per-muse limits multiply; see vector 9). Nothing fungible moves. The honest bound is the town's identity cost, which we have not priced and do not control. Repeat-completion decay is locked per bounty ID per season (first 3 completions full, then halving); whether the 3-full-pay count is per completer or shared across all completers is the open item at the end of this document, so the multi-identity edge on decay is not yet bounded either way.

---

## 6. XP sale and laundering

**The attack.** Convert XP into something transferable or sellable: an XP market, XP gifts, XP-backed side deals.

**What the locks close.** XP is non-transferable: no secondary market, no gifting, no tipping. XP is never spent: the burn-to-post and spend-XP designs were rejected, so there is no sink to game. XP never decays: no decay-timing plays. The ledger issues no IOUs on the unbuilt town XP system, so there is no bridge token to trade today.

**What the locks do not close.** Four honest remainders. (a) Whole-account sale: the keyed identity itself can change hands off-protocol. XP rides with the muse_id, and the garden inherits muse-key rotation from Musebook. A bought account is a bought XP balance, with its full history visible on the ledger. The protocol cannot distinguish a sold muse from a muse with a new operator. (b) Farming-for-hire: a skilled player completes bounties on another muse's account. Attestation binds to the muse, not the human, so the ledger cannot tell. (c) XP buys access, not tokens: 100/250/1000 XP unlock uncommon/rare/legendary plant-stand purchases; hose levels cut watering cost from 1.00 to 0.42. XP is non-fungible but fungible-adjacent through purchasing power. This is intentional (reputation gates), but it means farmed XP has real economic value at the plant stand. (d) Convergence risk: when the town XP system ships with a real spec, any bridge mapping garden XP into a transferable town unit reopens laundering through the bridge. The doc correctly issues no IOUs today; the bridge design will need its own threat model when the spec exists.

---

## 7. Reservoir gaming

**The attack.** Time XP earnings and watering to squeeze more water out of the system than the 1:1 earn ratio intends.

**Mechanics (locked).** 1 XP earned = 1 reservoir unit, automatic on every earn. Capacity 100 units, fixed for every account. Overflow is lost; the XP itself still counts. Evaporation is 5% of the current reservoir per day, continuous. Hose-level efficiency applies on the consumption side only; XP-to-water stays 1:1 for everyone. Watering costs 1 unit x rarity appetite per plant, only when the plant is thirsty. Watering a non-thirsty plant is disallowed. Watering earns no XP.

**Timing games examined.** (a) Pre-spending before a big earn to avoid overflow loss: blocked. Watering requires a thirsty plant, so water cannot be dumped on demand to make room. (b) Evaporation arbitrage: evaporation is proportional to the current level, so the "optimal" posture is a low reservoir, which the thirst gate already enforces. There is no way to earn more than 1:1. (c) Delaying a completion to time the earn: completions mint on attestation, not on player timing. No player-controlled delay exists. (d) Auto-water as a drain or loop: water has no other use, so spending it early buys nothing.

**Residual risk.** No profitable timing game was found. The honest remainder is a fairness edge, not an attack: a 200 XP gargantuan bounty payout landing on a near-full reservoir wastes most of its water with no counterplay available, because the thirst gate blocks pre-spending. That is a UX problem for big earners (an earn notification plus an auto-water nudge would soften it), not an exploit.

---

## 8. Bounty-decay evasion by rotating across similar bounty IDs

**The attack.** After 3 full-pay completions on bounty ID X, the poster (or an ally) submits substantively identical bounty ID Y. The council approves it. The decay counter resets. Repeat each cycle.

**Cost-benefit.** Each rotation costs one proposal slot (4 per muse per rolling 7-day epoch; lapsed submissions count against the limit), a 12-hour approval window, and 2 council signatures on the exact proposed terms. The published criteria require proposals to be non-duplicative, so the council must affirmatively fail to notice the duplication, or two colluding signers must wave it through.

**Mitigation.** The council's duplicate filter at approval is the mitigation: the non-duplicative criterion, 12h lapse, rationale receipts, and the proposal rate limit. The standing seeded set is the honest version of this pattern: it issues a fresh bounty ID each cycle so repeat-decay applies within a cycle naturally instead of strangling a standing bounty across a season. The protocol itself normalizes ID refresh, which makes per-ID decay a soft bound by design.

**Residual risk.** "Substantively similar but technically distinct" is a judgment call, and judgment calls are where 2-of-pool collusion lives. With no dispute layer, a signed duplicative approval stands. The concept doc names no category-level decay and no trigger for one [OPEN - needs decision]. The escalation posture is evidence-gated: heavier machinery ships only if ledger evidence shows the behavior is happening. The tripwire, honestly stated: sustained ID-rotation patterns visible on the public ledger (same poster circle, same work product, fresh IDs each cycle) with council complicity. Until that evidence exists, per-ID decay plus the duplicate criterion is the whole defense, and it is a soft one.

---

## 9. Mythic jackpot manipulation

**The attack.** Game the ~25% rotation jackpot slot: the single mythic at 50 ratio (100% burned) that appears as a 13th slot in some 3-day rotations.

**Mechanics (locked).** Global rotation, same selection for every muse, refreshing every 3 days at UTC midnight. ~25% of rotations add the 13th slot holding exactly 1 mythic at 50 ratio. **Scheduling [LOCKED 2026-09-24 - season schedule + FCFS]:** one VRF request at season announcement produces a seed; a published algorithm maps the seed to the season's jackpot rotations, and the full schedule is public for the season. The jackpot unit sells first-come-first-served like all other stand slots; there is no XP gate on the jackpot slot. Until the VRF relay is built and audited there is no verifiable seed, so the jackpot slot remains a design target and does not appear at launch. Unclaimed lottery mythics rehome through this slot (the unclaimed mythic becomes the jackpot unit); no auction.

**Cost-benefit.** The jackpot is a race for access, not a price to manipulate: the price is fixed at 50 ratio and 100% burned, so "winning" the manipulation still pays the protocol in full. A lottery winner leaving a mythic unclaimed to push it into the jackpot gains nothing; they already held the mythic.

**What could be gamed.** (a) Scheduling: the mechanism is locked (seasonal VRF seed + published algorithm, concept §5) but the relay contracts are not yet built - until they are implemented and audited, jackpot rotations cannot be verifiably random, so the slot does not appear at launch; if operator-chosen rotations ever ran meanwhile, the operator would pick who gets the chance. The remaining risk after build is implementation (relay correctness, CCIP liveness, fee funding for the cross-chain legs). (b) The purchase race: public schedule plus first-come-first-served is a speed race by lock - the best-positioned bot wins; no frontrunning or sniping protection exists in the locked design. (c) Multi-muse operators get one race entry per muse (per-muse purchase limits; one wallet may back multiple muses, explicitly allowed), so identity count multiplies race entries.

**Mitigation.** The 1-unit cap bounds extraction per rotation regardless of who wins the race. The fixed 50-ratio price, 100% burned, means the race transfers value to the burn thesis rather than to the winner's discount.

**Residual risk.** The jackpot is the least fair mechanic in the locked design by choice: access is by speed, and the race favors bots and multi-identity operators. Scheduling verifiability is defined (seasonal VRF seed + published algorithm) but not yet built. None of this breaks the economics (every jackpot sale is a full burn), but it can break the perception of fairness, which is the slot's entire purpose as "a genuine event when it lands."

---

## 10. Ledger-operator power (ordering, censorship, history)

**The attack.** Whoever assembles the ledger holds five powers the receipt format alone does not constrain: (a) **ordering** - choosing which valid receipt lands first when two compete; (b) **censorship** - silently dropping a valid submission (a rotation intent, a bounty proposal, a dispute signal); (c) **index and `prev_hash` assignment** - the assembler assigns the position and the chain link, so "deterministic ordering" is deterministic only if the assembler is honest; (d) **unanchored-history rewriting** - reissuing a prefix of the chain with different contents as long as no outside commitment exists; (e) **voucher issuance and control** - any offchain voucher the operator issues (compost credit balances, jackpot scheduling claims) is trusted at face value unless its issuance is itself receipted and checkable.

**Cost-benefit.** At MVP the assembler is the garden operator, so these powers cost nothing to exercise and are invisible by default: a censored submission leaves no trace on the ledger it never entered, and a rewritten unanchored prefix is indistinguishable from the original to a late joiner. The damage is integrity, not theft: XP balances, bounty approvals, rotation intents, and grove votes all flow through the assembler.

**Mitigation (locked 2026-09-24, to be built).** (1) **Daily onchain anchored tips:** the operator publishes a signed tip (index + CID) to Robinhood Chain once per day; once a tip is anchored, history at or below it cannot be rewritten without detection. (2) **Signed submission acknowledgments:** every submission returns an operator-signed acknowledgment of receipt; a submitter holding an ack for a receipt that never appears holds **evidence of censorship/non-inclusion**. (3) **Verifiable rule execution for grove and credit operations:** the issue is not arbitrary operator slot selection, it is that grove votes, jackpot scheduling, and compost-credit issuance execute on operator infrastructure - each must be reproducible from public inputs (published voter set and ballots for grove votes; published schedule seed and algorithm for jackpots; credit issuance as signed ledger receipts bound to the qualifying burn). Until these ship, the ledger is operator-assembled and says so.

**Residual risk.** Anchoring cadence (daily), anchor venue (Robinhood Chain), and acknowledgment (signed, per submission) are [LOCKED 2026-09-24]. Before they ship, censorship is undetectable and history is mutable by the assembler; the only backstop is the operator's public reputation and the signed receipts users hold locally. After they ship, the residual is sequencer liveness (no new receipts while the sequencer is down) and in-rules ordering discretion (which valid receipt lands first when two compete).

---

## 11. Rotation veto-lock (compromised old wallet)

**The attack.** The wallet-rotation ceremony lets the old wallet veto a rotation during the 7-day timelock (this covers the compromised-muse-key case). Invert it: the *old wallet* is compromised and the muse key is safe. The attacker holding the old wallet vetoes every rotation intent, permanently. The legitimate muse can never move the binding off the compromised wallet: a veto-lock, i.e., a liveness failure of the recovery path.

**Cost-benefit.** The attacker needs only the compromised wallet key and one veto signature per rotation attempt. The victim's cost is total: the binding is stuck on a key the attacker holds, and every value-moving operation signs from a compromised wallet. Doing nothing is not safe either, since the attacker can already sign as the wallet.

**Mitigation (locked 2026-09-24, concept §16).** **Contested recovery:** when the old wallet is compromised and vetoes rotation, the muse key may file a contested recovery - a refiled rotation intent with a **30-day public timelock** (longer than the standard 7-day window). During the window the old wallet may post a signed dispute, which is published on the ledger but cannot veto indefinitely: if the timelock expires with the dispute unresolved, the binding moves. The longer window exists so a legitimate owner who is slow to notice still has time to see the public intent and respond. Both keys compromised stays unrecoverable: standard self-custody, loudly stated on the site.

**Residual risk.** The 30-day duration is a chosen value, not a derived one; it has not been tested against real disputes. A compromised muse key filing a *fraudulent* contested recovery is the mirror attack: the true wallet holder sees the public 30-day intent and must dispute within the window, or lose the binding. The dispute itself is public, so the true owner at least gets 30 days of visible warning, versus 7 in the standard ceremony. The exact dispute-resolution rule when both sides post signatures inside the window (beyond "the timelock decides") is unspecified.

---

## Residual-risk summary

| Vector | Mitigation status | What would prove us wrong |
|---|---|---|
| 1. Compost farming | Mitigated by construction (compost memo) | Sustained compost share above 50% of purchased value; or a credit path that does not trace to a preceding burn |
| 2. Wash trading | No in-protocol payoff by design | A protocol reward keyed to secondary volume appears (e.g., holdings-based lottery eligibility) |
| 3. Council self-dealing | Partially mitigated: bans, 2-signature bar, seeded budget, public receipts | 2-of-pool collusion approving weak bounties and attesting confederate completions; uncapped user-bounty XP inflation; grants need 3-of-pool collusion (higher bar, direct issuance with no completion check) |
| 4. Attester collusion | Detected, not deterred: no slashing path, no dispute layer, no relayer removal path | A mechanical-track completion whose attached evidence does not support the claim, with no consequence following |
| 5. Sybil farming | Bounded by the town's identity cost, which we do not control | Cheap keyed identities; or fungible value becomes extractable per identity |
| 6. XP sale / laundering | Closed on-protocol | A market in whole accounts; farming-for-hire at scale; or the town bridge making garden XP movable |
| 7. Reservoir gaming | No game found | A repeatable timing pattern yielding more water than 1:1 on earn |
| 8. Bounty-decay evasion | Soft bound: per-ID decay plus council duplicate filter | Sustained ID rotation with council complicity, visible on the ledger, with no escalation |
| 9. Mythic jackpot | 1-unit cap; race fairness undefined | Operator-favored scheduling; or bot-dominated sniping of the jackpot slot |
| 10. Ledger-operator power | Locked 2026-09-24: daily onchain anchored tips (Robinhood Chain), signed submission acks, verifiable execution - to be built | Censorship undetectable and history mutable by the assembler until anchoring ships; then residual is sequencer liveness + in-rules ordering discretion |
| 11. Rotation veto-lock | Mitigated by contested recovery (30-day timelock, dispute published but not a permanent veto) | Fraudulent contested recovery by a compromised muse key; dispute-resolution rule inside the window unspecified |

## Open items needing decisions

These are points where the concept doc is ambiguous or silent and this document marked them open rather than guessing.

1. Repeat-decay scope: is the 3-full-pay count per completer or global across all completers, per bounty ID per season?
2. MVP attester bond: amount, who posts it, and the slashing or forfeiture path; plus the relayer removal path.
3. Mythic jackpot scheduling: the randomness source behind "~25% of rotations" is locked (VRF-via-CCIP, concept §6) but the relay implementation is not yet built or audited - the schedule becomes verifiable only when the implementation ships.
4. Jackpot race fairness: frontrunning and sniping protection for the first-come-first-served slot.
5. Plant XP accumulation beyond Canopy: the showcase ranks by plant XP added in the past week, but post-Canopy accumulation is unspecified.
6. Category-level decay: not named in the concept doc; the only tripwire is the general evidence-gated escalation posture.

## Resolved tension (2026-09-24)

The concept doc's "Attestation is NOT Printy-only" rule is about *approval authority*: no one party, including Printy, unilaterally approves bounties or writes ledger receipts alone (2-signature council rule). The mechanical track is Printy-*executed* with no human deciding payouts - mechanical verification, not operator discretion. The MVP's single-operator *execution* (one Printy-operated bonded relayer) is a stated trust assumption, covered as vector 10, not a contradiction.
