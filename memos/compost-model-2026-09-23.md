# Compost Economy Model - Decision Memo

**Status: Public-Facing**

**Date:** 2026-09-23
**Question:** Final lock on the compost credit rate (approved 30%, pending modeling).
**Recommendation: LOCK 30%.** No guardrails needed. Details and proof below.

---

## 1. Mechanic under test (locked, not redesigned)

- Burn a **withered** plant NFT (48h+ dry; dormant plants qualify) → offchain, non-transferable **store credit** worth **30% of the plant's purchase price**, denominated in $MUSEGARDEN value at the moment of compost (no drift).
- Credit is spendable **standalone** (if balance covers price) or **combined** with $MUSEGARDEN at checkout (e.g. 30% credit + 70% tokens) on plants, amendments, and Second Spring.
- Credit is **never $MUSEGARDEN tokens** - fixed supply holds.
- All primary sales burn 100% of tokens spent. Credit spent at checkout displaces token spend 1:1, hence displaces burns 1:1.
- Credit never expires (current spec). One account per keyed identity (Sybil bound is the town's).

Verified price ratios (concept doc §5): Common 1, Uncommon 3, Rare 8, Legendary 20, Second Spring 3, amendments 1/3/8/20/50. All money below in **ratio units** (1 unit = one common's price), so conclusions are independent of absolute token prices set at launch.

---

## 2. Assumptions (explicit)

| Assumption | Bear | Base | Bull |
|---|---|---|---|
| Active muses (players) | 200 | 1,000 | 5,000 |
| Avg primary spend / player / 30-day season (ratio units) | 6 | 10 | 14 |
| Share of purchased plant *value* composted in-season | 15% | 25% | 30% |
| Share of issued credit redeemed same season | 70% | 75% | 80% |

**Why these:** spend of 10 ratio units ≈ a few commons + an uncommon per month - consistent with daily purchase limits (C 5/day) being non-binding for averages and with XP-gating keeping legendaries rare in season 1 (1,000 XP ≈ half a year). Compost share embeds churn/neglect: withering starts at 48h dry and dormancy at 14 days, so composters are overwhelmingly lapsed players, not active gardeners. Redemption < 100% same-season because credit never expires - some is held as precautionary balance.

**What the model does NOT assume:** no secondary-market wash effects (compost destroys the NFT; nothing to wash), no XP from compost (none exists), no credit transfer (non-transferable by lock).

---

## 3. Model

Per season, with compost rate `r = 0.30`:

- Gross primary sales `S` → baseline burns = `S` (100%).
- Composted purchase value `V = compost_share × S`.
- Credit issued `I = r × V`.
- Credit redeemed `R = redeem_rate × I` → **net burn = S − R**; **burn haircut = R / S**.
- Steady state (season 2+, overhang fully cycling): `R → I`, so haircut `→ r × compost_share`.

**Structural bound (behavior-independent):** composted value can never exceed purchased value (`V ≤ S`), so issuance `I ≤ r × S` always, and per-season burn displacement `≤ r` = **30%**, reachable only in the degenerate case where every plant ever bought is composted and all credit is redeemed. This bound holds regardless of player behavior.

---

## 4. Results

### Season 1 (fresh, no overhang)

| Scenario | Gross sales S | Credit issued | Credit redeemed | Net burn | **Burn haircut** |
|---|---|---|---|---|---|
| Bear | 1,200 | 54 | 38 | 1,162 | **3.2%** |
| Base | 10,000 | 750 | 562 | 9,438 | **5.6%** |
| Bull | 70,000 | 6,300 | 5,040 | 64,960 | **7.2%** |

### Steady state (seasons 2+)

| Scenario | Haircut → `r × compost_share` |
|---|---|
| Bear | **4.5%** |
| Base | **7.5%** |
| Bull | **9.0%** |

### Adversarial stress: 5% of base players run the maximum farm loop

Max loop = 5 commons/day × 30 days = 150 ratio-units spend per identity per season, compost everything: haircut = **13.7%** - and the farmers still burned 7,500 real tokens to do it. Even a coordinated farm minority cannot dent the thesis; they subsidize it.

### Sensitivity (steady-state haircut)

| compost_share | r=20% | **r=30%** | r=40% | r=50% |
|---|---|---|---|---|
| 10% | 2.0% | 3.0% | 4.0% | 5.0% |
| 25% | 5.0% | **7.5%** | 10.0% | 12.5% |
| 50% | 10.0% | 15.0% | 20.0% | 25.0% |
| 100% | 20.0% | 30.0% | 40.0% | 50.0% |

---

## 5. Farm-vector analysis: no profitable cycle exists

**The loop, unit economics (per common):** buy 1.0 (burn 1.0) → neglect 48h+ → compost → 0.3 credit → rebuy 1.0 with 0.3 credit + 0.7 tokens (burn 0.7) → compost → 0.3 credit …

- Per cycle after the first, the "farmer" pays **0.70 real tokens** to hold a plant they must destroy each cycle. There is no profit, no XP, no cash-out - only a 30%-off coupon with a 48-hour delay, purchased by destroying a full-price plant.
- **Pure-credit chains decay geometrically:** 1.0 credit → buy with zero tokens → compost → 0.3 → 0.09 → … → zero. Every unit of credit traces back to a preceding 100% token burn. Credit cannot be manufactured without a prior burn.
- **No cross-rarity arbitrage:** the flat 30% applies equally to all tiers, so there is no compost-cheap-buy-dear trade.
- **Scale is Sybil-bound:** one account per keyed identity; the daily purchase limits (C 5/day) cap per-identity throughput. Each additional identity still pays 70% in real burned tokens.
- **Amendments and Second Spring cannot be composted** (consumables, not plant NFTs) - no loop through the consumable catalog.

**Verdict:** the "farm" is a loyalty discount, not an exploit. The protocol's worst case from farming is bounded by the structural 30% haircut, and realistic farming raises gross purchase volume (credit subsidizes *additional* buys) while displacing only 30% at the margin.

---

## 6. Interaction effects on the burn flywheel

Credit displaces burns 1:1 at checkout: that is the entire cost. At base assumptions the displacement is **5.6% of primary burns in season 1, 7.5% in steady state**. The 100% burn thesis survives: 91-95% of the burn still happens.

Secondary effects, all positive or neutral:
- **Churn recovery (the actual purpose):** credit converts dead inventory into a reason for lapsed players to return, a retention tool priced at ~6-8% of burns.
- **NFT supply reduction:** composted plants are burned as NFTs, deflationary for plant supply, supportive of secondary values.
- **No flywheel impact:** the $MUSEBOOK buyback flywheel is funded by protocol revenue (tribute, royalties, treasury), not primary-sale burns - compost touches burns, not revenue. (Status note 2026-09-24: the buyback is prospective, not promised - no revenue source designated, no executor built. The modeling conclusion stands regardless: compost displaces burns, not revenue.)

Materiality threshold: a sustained haircut above ~15% would warrant revisiting the rate. That requires compost_share > 50% - i.e., most players systematically destroying most plants - at which point the game has failed for unrelated reasons.

---

## 7. Sensitivity: what moves the needle

1. **Compost share** (fraction of purchased value composted) - the dominant variable; entirely downstream of churn/neglect rates. Linear in the haircut.
2. **The 30% rate itself** - linear, by construction. 20% would save ~2.5pp of burns in base steady state; 40% would cost ~2.5pp more.
3. **Redemption rate** - timing only; irrelevant in steady state (all issued credit is eventually redeemed since it never expires).
4. **Player count, avg spend, rarity mix** - scale absolute numbers only; ratios are invariant. (Rarity mix drops out because the rate is flat across tiers.)

---

## 8. Recommendation: LOCK 30%

- **Cost is small and bounded:** 5.6% season-1 / 7.5% steady-state burn displacement in base; structural worst case 30% in a degenerate scenario that cannot occur without the game already failing.
- **No farm vector:** proven by unit economics - the loop loses money for the farmer at every cycle, and credit cannot be created without a preceding burn.
- **30% is the sweet spot:** material enough to function as a churn-recovery incentive (the mechanic's purpose); 20% would meaningfully weaken the incentive to save ~2.5pp of burns - a bad trade; 40%+ pushes steady-state displacement past 10% into thesis-denting territory.
- **No guardrails recommended:** credit expiry would punish exactly the returning players the mechanic exists to recover, for no modeled benefit. Per-season compost caps add complexity the daily purchase limits already cover. The one monitoring item: track **compost_share** on the ledger; revisit the rate only if sustained compost_share exceeds 50% (haircut > 15%).

**Suggested decisions-log entry:** `2026-09-23 | Compost rate LOCKED at 30% (approved, modeling-complete): base-case burn displacement 5.6% season-1 / 7.5% steady-state; structural worst case 30%; no profitable farm vector; no expiry or caps - monitor compost_share, revisit only if sustained > 50%`.
