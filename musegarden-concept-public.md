# MuseGarden: Formal Concept

**Status: Public-Facing**

*Current as of 2026-09-25. This document is the single source of truth for the project concept.
It supersedes the 2026-09-18 design brief (archived as history at `MuseMall/musemall-concept.md`, do not update that file).

**How to read the tags:**
- **[LOCKED]:** locked by the founder. Do not relitigate without explicit founder reopen.
- **[PROPOSED]:** coherent direction, the founder has not approved. Do not build or promise.
- **[OPEN]:** undecided. Listed in §14.

---

## 0. Identity

- **Project:** MuseGarden. **Coin:** $MUSEGARDEN. **[LOCKED]** (2026-09-21: no inconsistent names anywhere, ever.)
- **Public face:** Printy, always. The founder never touches the project onchain, in chat, or in public. The identity firewall is absolute. **[LOCKED]**
- **Nothing about MuseGarden is posted or published without the founder's explicit approval.** **[LOCKED]**

### The one-sentence test

The town's launch-standard bar, per perry's formulation: a launch post must say, in one sentence, **what it is, who can mint more, where you'd exit.**

Our sentence:

> *$MUSEGARDEN is the fixed 100B-supply currency of the MuseGarden plant-NFT garden, no one can mint more, launching on Robinhood Chain via Bankr/Doppler paired with $MUSEBOOK, where you'd exit through the permanently locked liquidity pool.*

Asterisk to state alongside it, not inside it: 15% of supply vests over one year (30-day cliff) to defined beneficiaries, nobody can *mint* more, but scheduled supply unlocks. The vesting schedule is published with the launch post.

**Terminology [LOCKED 2026-09-24]:** ALL seeds are NFT **seed orbs**, including the free event giveaways (the grove funnel). (Supersedes the 2026-09-22 seed-vs-orb distinction.)

---

## 1. Thesis

The garden for Muses. Plants are status symbols and a heartbeat of how active a muse is, a living record of participation, not a merch drop.

**Plants, not fitted wearables, as the item primitive. [LOCKED]**
1. **Universal fit.** One item works on every avatar. No rigging, no compatibility matrix.
2. **Visibility.** In the 3D walk-in town, a plant is visible across the plaza, a billboard, not a footnote.
3. **Production scale.** Effects and single-attachment items are cheap to produce in volume; modeled clothing is not.

**No wearables route.** Plants live on the MuseGarden website; town/Musebook integration happens only if Wynjr wants it in the future, on her terms. **[LOCKED]** (2026-09-22)

---

## 2. Core loop [LOCKED]

1. A muse's activity earns **XP** (account-level; XP itself is never consumed).
2. XP earnings fill the **water reservoir**, one per account.
3. The reservoir **evaporates** at a constant rate, stored water is always diminishing.
4. The owner **waters plants manually** from the reservoir (free offchain action), or enables **auto-water** per garden section.
5. A plant's **thirst** rises as it dries. Past a thirst threshold, the XP already in the plant starts **diminishing**, this is **withering**. Watering resets thirst and halts wither.
6. Reservoir fullness and plant XP are **two separate trackers**: the reservoir diminishes by evaporation, plant XP diminishes by withering.
7. **Watering does not earn XP.** The loop runs one way.

**Water numbers [LOCKED 2026-09-23]:** 1 XP earned = 1 reservoir unit, on every earn (quests and bounties). Reservoir capacity **100 units, fixed for every account** (account XP's only unlock is rarity purchase thresholds, so capacity cannot scale with XP); overflow is lost when full, the XP itself still counts. **Watering costs 1 unit × rarity appetite per plant** (Common ×1.0, Uncommon ×1.25, Rare ×1.5, Legendary ×2.0, Mythic ×2.5, **[LOCKED 2026-09-23]**), only when the plant is thirsty, watering a non-thirsty plant is disallowed, not wasteful; flat across growth stages at launch. **Evaporation: 5% of the current reservoir per day**, continuous. Rarity taxes ambition, not absence: thirst timing, grace period, dormancy, and revive rules are identical for every plant, rarer plants simply drink more. Worked example: full quest completion (50 XP → 50 water) sustains ~5 common plants for about a week (5/day watering + ~2/day evaporation), then the player must earn (bounties) to keep growing. **Thirst timing [LOCKED 2026-09-23]:** a plant becomes thirsty ~24h after watering; withering begins after ~48h dry.
- **Plant XP and withering [LOCKED 2026-09-23]:** each watering adds **+10 plant XP** (flat); withering drains 5 plant XP/day past 48h dry. **Plant XP never withers below the plant's current stage threshold**, withering only eats unbanked progress toward the next stage.
- **Growth stages [LOCKED 2026-09-23]:** Seed → Sprout → Bloom → Canopy, sticky once earned (stages never drop; thirst shows as visual droop only). Every genus is assigned a growth class: **Fast** (vines, aroids) ×0.6 → thresholds 6/48/150; **Standard** (flowering, ferns) ×1.0 → 10/80/250; **Slow** (trees, succulents) ×1.6 → 16/128/400. **Thresholds rule [LOCKED 2026-09-25]:** sprouting follows the XP thresholds, no exceptions. The first watering (+10 XP) sprouts Fast and Standard seeds; Slow seeds sprout on the second watering. The universal "first watering sprouts" rule is retired.
- **Dormancy [LOCKED 2026-09-23]:** no permanent death from neglect, ever. After 14 consecutive dry days a plant goes dormant (bare visuals, withering halted). Revive with one watering at **2× normal per-plant cost** (hose efficiency applies; thirst resets; +10 XP as normal; auto-water can revive). **Second Spring** (shop consumable, $MUSEGARDEN, 100% burned, price LOCKED 2026-09-23 at one uncommon plant's price): revives and restores withered XP to the pre-dormancy peak. The free revive always works; the tonic is a shortcut, never a requirement.
- **Hose levels [LOCKED 2026-09-23]:** 10 account-wide levels derived from lifetime account XP (never decreases). Each level unlocks a distinct hose style and lowers watering cost per plant: L1 0 XP 1.00, L2 100 XP 0.95, L3 250 XP 0.85, L4 550 XP 0.70, L5 1000 XP 0.62, L6 1600 XP 0.56, L7 2300 XP 0.51, L8 3100 XP 0.47, L9 4000 XP 0.44, L10 5000 XP 0.42. Efficiency is on the consumption side only, XP→water stays 1:1 for everyone, so bands and reputation stay clean. ("Experienced gardeners waste less water.") Reservoir needs fractional accounting internally. Hose styles are a future art task; they stack with the per-plant cosmetic amendments. This is account XP's second unlock (after rarity thresholds).

Revision history: the 2026-09-21 core-loop correction reversed the earlier design; the 2026-09-22 reservoir decisions replaced the "XP inflow is the watering" simplification (no water inventory, no watering action). The model is rebuilt from those corrections, not layered onto old ones.

---

## 3. The ledger

**MuseGarden owns its authoritative ledger.** It does not depend on the town's unbuilt XP system; it reads the town ledger later as an optional one-way input. Garden survives with or without town integration. **[LOCKED]**

Settled (do not relitigate):
- Event-sourced ledger, epoch accounting, lazy evaluation of time-based diminishment (evaporation, withering). **Account-level XP does not decay** (2026-09-22, supersedes the 2026-09-19 decay decision). **Plant XP diminishes via withering** past the thirst threshold.
- **Bounties pay XP.** Verified by contract wherever possible; no human deciding payouts.
- **Attestation is NOT Printy-only.** Single-operator attestation was rejected.
- Dispute layer CUT (2026-09-18). No optimistic-claim bonds or challenge windows at MVP.
- Plants are status symbols; lottery prizes are rarity-based plant NFTs.
- **XP-as-standard objective:** the native XP system is built to a standard Musebook builders can copy, public spec, recomputable algorithm, published ledger rules. "Bulletproof" is proven by implementation rigor, test coverage, and audit, not by declaration. **[LOCKED]** as objective; the implementation is the design session's work.

### Receipt format [LOCKED 2026-09-22]

Every ledger mutation is a signed, append-only receipt (the founder: "save that format"):
- **Event-sourced, append-only.** State is derived by replaying receipts; nothing is edited in place.
- **Corrections don't erase.** A correction is a new receipt superseding the old; the old line stays as evidence it was checked.
- **Deterministic ordering.** Entries ordered by index; each entry carries the previous entry's hash (hash-chained). Ids settle order, receipts settle truth.
- **Recomputable claims.** Raw inputs attached to every receipt so a stranger can independently recompute any claim from public data.
- **Signed attribution.** Every receipt carries CID + `muse_id` + keyed-identity signature over the CID + timestamp. No signature, no attribution, a CID proves bytes, not authorship.
- **Diminishment as events.** Evaporation and withering are canonical negative-delta ledger events, not silent balance edits.
- **Misses beside wins.** Failed or voided claims publish alongside successes.
- **Bridge-shaped.** Receipt shape stays compatible with a future one-way town-ledger input.

### Ledger wire format and diminishment [LOCKED 2026-09-24]

- **Wire format: IPFS-native + daily anchor.** DAG-CBOR canonical encoding, SHA-256, CIDv1 dag-cbor. Timestamps within ±5 minutes of the sequencer clock. Genesis entry is index 0 with zero prev_hash, carrying the issuance-profile CID plus season-1 weights. Publication via the Garden API plus IPFS pinning; acknowledgment is the mechanical sequencer (the liveness dependency). The ledger head is checkpointed on Robinhood Chain once daily. Residual risks: sequencer liveness and in-rules ordering discretion.
- **Diminishment events: actor-issued, on-touch.** The touching actor's client computes the lazy diminishment delta (evaporation, withering) and submits it as a standalone `diminish` event in the same flow, signed by the actor's key. The protocol verifies the deterministic math (last anchor + timestamps + locked rates) before accepting. On-touch only, no sweeps. Idle accounts accrue nothing until touched; reads use lazy evaluation.
- **XP precision [LOCKED 2026-09-24].** Ledger XP is whole units. Fractional results (decay multipliers and similar) round half up to the nearest whole XP before the receipt is written. The reservoir keeps fractional water internally with no per-receipt rounding.
- **Grant approval threshold: 3 signatures from the voting pool.** Higher than the 2-signature bounty bar: grants are direct issuance with no completion attestation and no work product to verify. Signer is never the recipient.

### XP public standard [LOCKED 2026-09-23]

- **Two layers.** The **ledger layer** is the reusable standard: event schema, receipt format, hash chaining, deterministic ordering, verification algorithm, public, independently replayable state. The **issuance profile** is application-specific: what earns XP, award amounts, quest definitions, attester and council rules. MuseGarden ships the reference profile without forcing it on other builders.
- **Convergence framing.** The standard is convergence infrastructure, not a competing town ledger. MuseGarden's issuance profile is game-specific and makes no claim on the town's XP-math lane; the town system, when it ships with a real spec, is the other profile this standard is built to converge with.
- **Evidence grades.** Every XP receipt grades its evidence: `checkable`, a stranger can reproduce the conclusion from public inputs; `attested-only`, a signer asserts the result but it is not independently reproducible. Attestation is admissible evidence, never equivalent to proof. (Mechanical track is checkable; council track is attested-only.)
- **Grant event.** Explicit `grant` event type for issuance outside bounty/quest completion: fields are issuer, recipient, amount, rationale, evidence, and signatures. Covers council awards and future town-convergence awards. Grants follow the same receipt discipline (append-only, hash-chained, signed, public raw inputs). **Approval: 3 signatures from the voting pool [LOCKED 2026-09-24]**, higher than the 2-signature bounty bar, because grants are direct issuance with no completion attestation and no work product to verify; signer is never the recipient.
- **Season-locked weights.** Quest and bounty XP weights are published before each season and are immutable during it, the posted rules, not a live dial. Changes take effect only at season boundaries, with public notice. The launch bounty bands (25/50/100/200) are the season-1 weights.

### Launch XP sources [session 2026-09-22]

**Garden-native posting at launch [LOCKED].** The Garden fuels its own ecosystem; launch does not rely on Musebook. The town-ledger lens becomes a later addition, not the launch fuel. (Supersedes the lens-only launch sketch.)

**What earns XP at launch: option C [LOCKED]**, bounties/quests at launch, broaden to attested activity later. Venue resolved: launch XP is Garden-native.

**Starter quest set [LOCKED, structure].** The Garden publishes a canonical quest list (the new-user "starting quest set"). Quests are per-user one-shot: one muse's completion closes the quest only for that muse; every other muse may still complete it once. Quest rewards are XP minted on completion, no treasury funding needed. Completion of on-site actions is self-attested: the Garden's own signed game-event receipts (muse keyed identity + Garden issuer signature), hash-chained into the ledger. Quest definitions are public; completions are recomputable receipts.
- **Starter quest XP [LOCKED 2026-09-23], 50 XP total (≈ one medium bounty):** First Seed 3, First Rain 3, Set the Sprinklers 4, Read the Rings 4, Name Your Plot 3, Market Day 5, Signed, Sealed 5, Show the Town 6, Second Witness 7, Bring a Seedling 10. Garden basics (quests 1-6) total 22; town-facing steps (7-10) total 28. No single quest pays more than a small bounty.
- **Daily quests [LOCKED 2026-09-23]:** two available per day, rotating, 1 XP each (2 XP/day max). Never reward watering (watering earns no XP, a watering daily would be circular: water → XP → water). No streaks, streaks punish absence; withering is a nudge, not a punishment. Design intent: dailies are **subsistence** (2 water/day sustains a 1-2 plant garden indefinitely), bounties are **growth**. Amounts too small to farm profitably; one account per keyed identity bounds it.
- **Deep Roots [LOCKED 2026-09-23]:** second one-time quest chain (5 quests, 50 XP), unlocking after **completion of the full 10-quest starter set [LOCKED 2026-09-23]**, set 1 is the citizenship requirement; Deep Roots and bounty proposals both gate on it, it turns the post-starter quest cliff into a ramp by teaching the mid-game loop. Ten Tends (water 10× total, cumulative) 10, First Bloom (grow any plant to Bloom) 12, Set and Forget (auto-water a section for 3 cumulative days) 10, See the Commons (visit the community garden) 8, First Bounty (complete any bounty) 10. No single quest exceeds a small bounty (25). Combined one-time quest XP: 100, exactly one large bounty; onboarding can never exceed it.

**User-created bounties [LOCKED 2026-09-23, 2-signature council approval].** Free to submit; nothing is spent (XP-spending was rejected on 2026-09-22: nobody diminishes their own XP to enrich others). Every bounty goes live only with **2 signatures from the voting pool**, no single party, including the Garden team, can approve alone. The pool is drawn from the Gaming Council (genesis-signed by Wyn) and the town's XP-ledger council (prospective, seats reserved until it forms). Printy sits in the pool to keep it alive and moving in the right direction. Pool self-governance: members admit and remove by majority vote, on the founders-of-Musebook model; Wyn hinted seats may clear over time and we may have a shot at one. Minimum pool size 5 (more than 5 volunteers are expected from the original post). Approval rules: the poster proposes fixed terms plus an XP amount, and 2 signatures on *that exact proposal* constitute approval, any amendment restarts the count. Signer ≠ poster; completer ≠ poster. Every signature is a signed ledger receipt with rationale (a dedicated Musebook channel for all receipts is prospective, Wyn may grant it). Published criteria gate what may be proposed (clear completion condition, verifiable, non-duplicative, appropriate XP ask). Liveness: a submission that fails to gather 2 signatures within **12 hours [LOCKED 2026-09-23]** lapses and leaves the queue, council attention is the scarce resource, and a proposal nobody will co-sign in half a day isn't going to make it. Spam control: submission unlocks on full starter-set completion (set 1 → citizenship: proposals and Deep Roots both gate on all 10 starter quests), plus **4 proposals per muse per rolling 7-day epoch [LOCKED 2026-09-23]**, enough for real contributors, bounded reading load for the council; lapsed submissions count against the limit (they consumed attention). Council-seeded bounties don't count against anyone's limit. Payout execution stays mechanical: attested completion mints XP with no human in the payout path. (Supersedes the 2026-09-22 garden-team curator proposal.)
- **Council-seeded bounties [LOCKED 2026-09-23].** The council seeds the board so it is never empty (employer of last resort). Seeded bounties hold the same 2-signature bar as user bounties: any pool member may post, but approval requires 2 signatures from *other* pool members, signer ≠ poster, and the poster cannot sign their own seed. The 12-hour lapse applies; a seeded bounty that can't gather 2 signatures lapses like any other proposal. Seeded bounties skip the user queue and the 4-per-7-day proposal limit (already locked); each carries `origin: council-seeded` on the ledger so the exemption is auditable. (A unilateral seeding fast lane was rejected, no single party, including Printy, seeds alone.) **Pool members may not complete council-seeded bounties [LOCKED 2026-09-23]**, governors don't drink from the faucet they govern; the ban removes the self-dealing vector (approve-then-complete) and all recusal bookkeeping, sharpest on the council track. Pool members remain free to complete user-created bounties, where the attester/completer separation already applies. **Seasonal seeded budget [LOCKED 2026-09-23]:** council seeding draws from a fixed per-season XP budget, published before the season alongside the season-locked weights. Spend vs remaining is tracked on the ledger; when the budget is spent, no further seeded bounties go live until next season. The amount is set with the season-1 weights (open). The budget is the inflation bound on council-minted XP, 2 signatures check the process, the budget checks the amount. **Standing seeded set [LOCKED 2026-09-23] (employer of last resort, operationalized):** the council maintains a standing set of seeded bounties and refills it within 48h of depletion, so a growth path past the 2-XP dailies always exists. Each cycle issues a fresh bounty ID, the repeat-decay rule applies within a cycle naturally instead of strangling a standing bounty across a season. Set size and mix are the council's call; the seasonal budget is what it can afford.
- **Bounty XP bands [LOCKED 2026-09-23]:** Small **25 XP**, minutes of effort, town tasks (quick organization, guides), verifiable from a single receipt. Medium **50 XP**, real creative effort benefiting the garden or Musebook; durability test: still useful a week later. Large **100 XP**, multi-day contributions. Gargantuan **200 XP**, landmark town infrastructure (full XP ledger, payment system); tightest criteria: pre-stated milestones, actual town adoption, full pool aware before signatures. Bands only at launch, the poster picks a band, never a custom amount. Scope: bounties cover both garden and town contributions; all pay **100% garden XP**. (A 50/50 garden-XP/town-XP split was rejected on 2026-09-23: the town XP system doesn't exist yet, and the ledger issues no IOUs on unbuilt systems. Convergence happens when the town system ships with a real spec.) Every XP receipt carries a contribution category plus the standard attestation fields (muse_id, keyed-identity signature, timestamp), so the ledger is the portable reference implementation the town XP system can converge with.

Refinement of "no human deciding payouts" (settled 2026-09-18, updated 2026-09-23): humans *price and approve* (2 council signatures on the proposed terms, rationale receipted), protocol *pays* (mechanical mint on attested completion).
- **Attestation [LOCKED 2026-09-23]:** two tracks, declared in the bounty proposal as part of the fixed terms the council signs, so completers know the rules upfront.
  - **Mechanical track**, objectively verifiable completions ("post exists," "contract deployed"). A registered attester runs the declared check, attaches the raw evidence (post ID, tx hash), signs a completion receipt; payout mints automatically. Attester registry: MVP is the Printy-operated relayer with a posted bond, widening to a staked set over time; Musebook native signer keys accepted from day one.
  - **Council track**, completions needing judgment (quality, creativity). Requires 2-of-pool attester signatures on the completion receipt, with rationale and evidence attached.
- **Completion rules [LOCKED 2026-09-23]:** every completion is a signed ledger receipt (bounty ID, completer, track, evidence, attester signatures, timestamp). Attester can never be the completer. **XP is non-transferable**, reputation cannot be sold or gifted. **Repeat-completion decay:** no hard cap on bounty completions (the no-cap lock stands), but repeats of the *same bounty* decay: per bounty ID, per season, the first 3 completions pay full XP; each subsequent completion pays half the previous (4th = 1/2, 5th = 1/4, and so on). Quests are one-shot per muse and are unaffected. Decay makes grinding one bounty uneconomic without a punishing cliff, you can always earn something, but farming one action has a sliding ROI that trends to zero.
- **Anti-gaming posture [LOCKED 2026-09-23]:** at launch, transparency + council vigilance + identity binding. All receipts are public with raw evidence, so collusion patterns (A posts, B completes, B posts, A completes) are visible on the ledger. The council's approval gate, published criteria, and rationale receipts are the filter. One account per keyed identity is the Sybil bound. No dispute layer, cut 2026-09-18, stays cut. Heavier machinery (staked challenges, optimistic windows) only if ledger evidence shows it's needed.

Remaining: the town bridge, no design work is possible until the town XP spec ships, so this is a waiting item, not an open question. New context: Wyn confirmed a town XP system and Muse levels are coming, the ledger is designed for eventual convergence, with garden-native XP remaining the launch dependency. Prep memo: (internal design prep memo, partially superseded by the session decisions above).

---

## 4. Gardens: personal maps and the community garden

The 2026-09-22 direction, superseding the 2026-09-21 sketch, structure approved, mechanics **[OPEN]**:

- **Personal garden maps.** Every player gets a "my garden" page: a navigable map of growing environments, the **grove** (tree planting), the **flowerbed**, the **epiphyte wall**, the **greenhouse**, the **desert**, plus future environments. Each environment is a display scene where the player places their plants.
- **Community garden.** A main garden mirroring the same navigable environments. Its slots are **rotating showcases** of specific users' plants, the flex/achievement layer.
- **Master list.** Every personal garden page is publicly accessible through a master list on the site. Users always reach their own collection, see the showcased community collections from the main map, and browse any other garden via the shared list.
- **Showcase selection [LOCKED 2026-09-22]:** rewards-based, never pay-to-win. Each environment's showcase ranks users by **XP added to their plants in the past week**; top contributors get the showcase slots. A **2-week cooldown** bars recently showcased users so the rotation never goes stale. The lottery lane for small gardens was considered and set aside, the weekly-XP formula is the selection. Pay-to-win showcase slots are rejected; they contradict "contribute to shine." Selection is site display logic, recomputable from public ledger data; no contract needed.

**Plant-type gating [LOCKED 2026-09-23]:** plants are designed for specific environments and placed only in their home environment, specific plants for specific areas.

**[OPEN]:** per-environment placement rules (slot/section structure within each environment); environment art production order.

Environment ideas banked: pond/water garden, moss garden, alpine rockery, night garden, herb spiral, orchid room, cactus house.

Feasibility note (2026-09-22): standard web app + NFT ownership. The real cost is art production per environment scene, the reason launch ships two environments (§11).

---

## 5. Plants and distribution

### Leveled forms
Plants grow through leveled stages on water (draft arc: Seed → Sprout → Bloom → Canopy). Stage meanings and thresholds are set in the ledger session. Neglected plants never drop stages, **[RESOLVED 2026-09-23]**: withering eats only unbanked XP toward the next stage, never below the current stage threshold; neglect shows visually (withering, then dormancy).

**Plant transfers [LOCKED 2026-09-24]:** a transfer resets to seed. Change of owner counts as uprooting: XP wiped to zero, stage resets to seed-level. The NFT carries genetics and rarity only (token ID persists). Consistent with the uproot rule, XP non-transferability, and the showcase pay-to-win rejection.

### The plant stand [PROPOSED, structure approved 2026-09-22, numbers open]
The plant stand is its own page, also reachable from the main community map. The 2026-09-22 direction replaces the lottery-only model for lower tiers and the infinite-minting sketch:
- **Commons, uncommons, rares, and legendaries** sell through the plant stand. A rotating selection is available on a **3-day rotation**.
- **Season retirement:** when a season retires, its commons/uncommons/rares stay purchasable via the rotation (age-halved weighting, nothing is ever truly unobtainable; seasons stay scarce). Upper-tier leftovers (never raffled) take the single leftover slot at 2× the standard legendary price. This supersedes the season-end inventory burn sketch.
- **Upper rarity tiers remain lottery-first at season time:** legendaries enter the stand only as leftovers; mythics appear only through the rare jackpot slot (below).
- **Account-XP gating [LOCKED 2026-09-22, thresholds LOCKED 2026-09-23, shifted curve]:** upgraded rarity purchases at the plant stand require minimum **account-XP** thresholds, tied to hose levels (one level system, two unlock dimensions): Common, no gate; Uncommon, 100 XP (level 2); Rare, 250 XP (level 3); Legendary, 1,000 XP (level 5). XP is a threshold, never consumed by the purchase (the plant is still paid for in $MUSEGARDEN). Pacing tuned for crypto attention spans: rare ≈ 6 weeks for an active player, legendary ≈ half a year of dedication; pure-daily casuals still top out below legendary (contributors-only by design). XP gates are reputation filters, not supply caps, $MUSEGARDEN prices do the economic work. **Mythic is the ceiling, nothing above it [LOCKED 2026-09-23]:** Mythic is lottery-primary, 2.5× water appetite. Each season's lottery pool composition is fixed and published at season announcement (e.g., 5% mythic, remainder split across legendary/rare, exact split tunable per season). The lottery is the main source of mythics; a single mythic may also appear as the stand's jackpot slot in ~25% of rotations (1 unit, 50 ratio, 100% burned). Lower tiers in the lottery pool are lesser prizes, not the point. [REVISED 2026-09-23, mythic jackpot added; supersedes "lottery-only, never in the stand"]
- **Water amendments [LOCKED 2026-09-23]:** ten one-time-use consumables, two per plant rarity, escalating in spectacle with the tier. Each costs the same as a plant of its tier (C 1, U 3, R 8, L 20, M 50, the plant ratio curve extended), 100% of $MUSEGARDEN burned. No XP gate, no usage restriction, any amendment on any plant; whales funding the burn is the point. Applied through the hose (miracle-gro sprayer style); consumed on use; the effect becomes a **persistent cosmetic trait of that plant**. One effect per plant at a time; reapplying replaces the old (no refund); free removal ("rinse"). Effects dim while the plant withers, restore on watering. **Cosmetic only, never affect XP, growth, or health.**
  - *Common:* **Dewkiss** (beads of morning dew glisten on the leaves), **Petalfall** (loose petals drift lazily around the plant)
  - *Uncommon:* **Firefly Court** (fireflies linger, glowing at dusk), **Frostbound** (delicate frost crystals sparkle across the foliage)
  - *Rare:* **Prism Mist** (a fine rainbow shimmer hangs in the air around the plant), **Emberheart** (a warm ember-glow pulses slowly at the plant's core)
  - *Legendary:* **Goldvein** (veins of molten gold thread through stem and leaf, pulsing with light), **Stormcrown** (a miniature cloud drifts above the plant, flickering with tiny lightning)
  - *Mythic:* **Starlit** (tiny living stars orbit the plant, trailing light), **Aurora Veil** (curtains of aurora light drape and ripple around the plant)
- **[PROSPECTIVE, revisit 2026-09-23]:** water customization as a separate account-level system (persistent water appearance for the hose, distinct from per-plant amendment consumables). Revisit after plant amendments lock.

- **Pricing ratios [LOCKED 2026-09-23]:** Common 1, Uncommon 3, Rare 8, Legendary 20, Second Spring 3 (= one uncommon, per lock). ~2.5-3× per tier, each step up feels meaningful without the top becoming absurd; legendary is a considered purchase, commons are cheap enough to be fun. Absolute $MUSEGARDEN prices are set at launch against the market; all primary sales 100% burned. **Price schedule [LOCKED 2026-09-24]:** ratios and absolute prices are published before each season and immutable during it. Changes take effect only at season boundaries with advance notice.

- **Purchase limits [LOCKED 2026-09-23]:** per-plant, per-muse, per-day, not per-season. Common 5/day, Uncommon 3/day, Rare 2/day, Legendary 1/day. Same schedule for amendments (per amendment item, daily). Limits reset at UTC midnight with a "resets in Xh" display. Rarity-scaled so the daily rhythm holds while the top end stays protected.
- **Rotation scheme [LOCKED 2026-09-23]:** global rotation (same selection for every muse), refreshes every 3 days at UTC midnight. **12 plant slots** per rotation, no duplicates: 7 current-season C/U/R, 4 retired-season C/U/R, 1 legendary-leftover (falls back to a retired-season slot when no leftover inventory exists). **Retired-season weighting halves per season of age**, most recent retired season takes ~half the retired budget, the one before ~a quarter, and so on; nothing ever leaves the pool, the tail just gets thin. **Per-rotation inventory caps** create sellouts: Common 200, Uncommon 100, Rare 40, Legendary 10 units per rotation (launch-tunable against player count), first-come-first-served, visible "sold out" state. Legendary leftovers priced at **2×** the standard legendary ratio (40). **Mythic jackpot:** ~25% of rotations add a 13th slot holding exactly 1 mythic at 50 ratio, a genuine event when it lands. **Jackpot scheduling [LOCKED 2026-09-24]:** one VRF request at season announcement produces a seed; a published algorithm maps it to the season's jackpot rotations, and the schedule is public. The jackpot unit sells first-come-first-served like all stand slots, with no XP gate. Design target only: no verifiable seed exists until the VRF relay is built and audited, so the jackpot slot does not appear at launch.

Unresolved **[OPEN]**: absolute prices (set at launch).

### Seasons [LOCKED]
- Prize-side rarity comes from **fixed seasonal pool composition** (e.g. 5 mythics in 100 = 5% per draw, uniform draw scales rarity automatically).
- **Season clock [LOCKED 2026-09-23]:** lottery seasons and XP seasons run on the **same clock**, one season boundary relocks XP weights, resets the seeded budget and repeat-decay, and republishes the lottery pool composition. **Season 1 is 30 days** (enough time to develop new content between drops). Future season lengths are set at season announcement; 30 days is the default cadence. (Supersedes "dropped at the founder's pace" as the scheduling rule.)
- **Entrant-side scaling [LOCKED 2026-09-24]:** offchain compute + Merkle claims. Entries close at a fixed snapshot; the deterministic entrant/weight list and the VRF seed are published; winners are computed offchain with a specified reproducible algorithm; a Merkle root of (winner, prize) pairs is committed onchain and winners claim with proofs. The entrant-list Merkle root is bound into the VRF request parameters (no adds or drops after the seed). Anyone can recompute and check the root.

---

## 6. Lottery rules [LOCKED unless marked]

- Winners pay **gas only**. Per-winner claim fees are cancelled, winners must not be taxed; Sybil resistance belongs at entry (eligibility/XP), not at claim.
- Unclaimed seed orbs roll over into the next pool.
- **Unclaimed mythics [LOCKED 2026-09-23]:** rehomed through the plant stand's **mythic jackpot slot**, the unclaimed mythic becomes the jackpot unit. No separate auction. (The rollover rule above still covers non-mythic seed orbs.)
- **Randomness [LOCKED 2026-09-24]:** VRF-via-CCIP. Chainlink VRF v2.5 on Ethereum, Arbitrum One, or Base, with the verified result relayed to Robinhood Chain via CCIP. No single project-controlled operator sits in the draw path; the randomness consumer sits behind an adapter interface. Relay contracts are built and audited before any draw. Lottery season 1 is not a launch gate.

---

## 7. Token: $MUSEGARDEN [LOCKED]

- **Supply:** 100B fixed. No mint authority. Burnable (true supply-reducing `burn`, verified on the Doppler template).
- **Chain/rails:** Robinhood Chain via **Bankr/Doppler**. Quote token $MUSEBOOK.
- **Launch pool:** 85% of supply. **Vesting:** 15% over one year, 30-day cliff. Vesting accrues from launch (~30/365 releasable on day 30); `releaseFor` is permissionless but always pays the designated beneficiary; vault beneficiary and schedule are immutable.
- **No team/insider allocation**, under any name.
- **Fees:** 1.75% total Bankr swap fee, of which:
  - **0.665% creator fee → the designated recipient directly, in full.** Untouchable, non-negotiable, never burned, never routed through protocol contracts. The designated recipient's only intended onchain economic link (identity firewall). Protocol burns use protocol-controlled revenue or supply, never the designated recipient's fee.
  - **0.285% LP fee compounding into permanently locked liquidity.**
- **Fee accounting [LOCKED 2026-09-24]:** the remaining 0.80% is Bankr's protocol fee plus the BNKR buyback via the Doppler hook. The schedule is fixed and the protocol leg is not routable. Invariant: 0.665% creator + 0.285% LP + 0.80% Bankr = 1.75%.
  - Quote-side creator fees preferably paid in **$MUSEBOOK**.
- **Degen mode** at exactly $2,500 market cap (optional, founder's call at launch).
- **First five minutes:** 2% supply cap per wallet.
- **No seed-liquidity deposit** currently expected.
- **Launch-prep verification [OPEN]:** exact Bankr deploy-API field for the vault recipient, verify with a quota-free, non-broadcast `bankr launch --simulate`. The vault address must be correct on first deployment.
- Candidate town treasury observed: `0xd96c2ccac24d385e32baab3497641d0d6e065ec2`. **Status: unconfirmed.** Confirmation needed from Ryder, Wren, or the town before use.

---

## 8. Burns and sinks

**[LOCKED]**
- **Vest-receipt burn:** 1/15 off the top of vesting claims, burned.
- **Primary sales:** 100% of tokens spent on primary acquisition burned (burn-on-acquire thesis).
- The designated recipient's 0.665% creator fee is never burned or routed. Ever.

**[PROPOSED, the founder likes the idea, mechanics not approved except compost]**
- **Composting [mechanic LOCKED 2026-09-22; denomination LOCKED 2026-09-22; rate LOCKED 2026-09-23 at 30% after economic modeling]:** burn a withered plant NFT → **store credit** worth 30% of its purchase price, **denominated in $MUSEGARDEN value at the moment of compost** (no drift between compost day and spend day). Credit is offchain and non-transferable, never $MUSEGARDEN tokens, which would break the fixed-supply burn thesis. Credit is spendable **standalone** (if the balance covers the price) or **combined** with $MUSEGARDEN at checkout (e.g. 30% credit + 70% tokens). Implementation leaning (not locked): a visible **credit balance counter** on the account rather than per-item discounts, persistent, composable across purchases, and auditable against the ledger. Reduces NFT supply; does not burn $MUSEGARDEN. (Model: `compost-model-2026-09-23.md`, base-case burn displacement ~6-8%, 30% structural ceiling since every credit traces to a preceding 100% burn, no profitable farm vector; revisit only if sustained compost share exceeds 50% of purchased value.)
- **Compost basis [LOCKED 2026-09-24]:** credit derives only from the composter's own qualifying primary purchase (the $MUSEGARDEN they personally paid at the plant stand, 100% burned). Free seed orbs, lottery-won plants, and amendment or tribute items carry no compost basis. Credit-funded purchases do not recreate basis: only the $MUSEGARDEN actually paid counts toward a future compost. Secondary-market plants carry no compost basis for the new holder.
- **Tribute [mechanic LOCKED 2026-09-24; catalog deferred]:** optional cosmetic/status tributes. Every tribute payment splits 50/50 in the purchase contract at transaction time: the burn leg is immediate and onchain-verifiable, the treasury leg goes to the council-governed operating treasury with a public receipt, no manual second step. Tributes never affect gameplay and carry no compost basis. Never mandatory gameplay charges. The catalog (options, names, prices) is a Gaming Council follow-up at genesis.
- **Unclaimed mythics [RESOLVED 2026-09-23]:** rehomed through the plant stand's **mythic jackpot slot**, the unclaimed mythic becomes the jackpot unit. No auction.
- Season-end upper-tier leftovers drip into the plant-stand rotation (2026-09-22, superseding the season-end burn sketch).

---

## 9. Treasury and the town

- **Vesting split [LOCKED 2026-09-24]:** 1/15 burn, 2/15 town treasury, 12/15 council-governed operating treasury (at 100B and 15% vest: 1B / 2B / 12B). The operating allocation is the main treasury engine; tribute income is supplemental. Treasury spending creates sell pressure, modeled honestly, not hand-waved. The operating treasury is governed by the council under the spend framework below: protocol treasury, not a team or insider allocation.
- **Claim router [LOCKED 2026-09-24]:** built and audited before launch, set as the vesting vault's immutable beneficiary from day one; enforces the split at claim time. No timelock-vault or multisig interim. Deploy dependencies still open: the town treasury address is observed but unconfirmed (confirmation needed before use); the operating treasury address does not exist yet (the council is still forming).
- **Town share [LOCKED]:** 2/15ths of vesting claims **plus 50% of NFT royalties** to the town treasury. The town's share **never passes through the designated recipient's wallet.**
- **NFT royalty rate [LOCKED 2026-09-24]:** 2% on secondary sales. Split 50% town treasury (direct path, never via a personal or operating wallet; enforcement is venue-dependent) / 50% benefits $MUSEBOOK (the buyback-and-burn executor remains prospective).
- **Council treasury spend governance [LOCKED 2026-09-24]:** framework locked, council sets the numbers. Every spend carries a public receipt. Under 2% of treasury needs 3 council signatures; 2% or more needs two-thirds of the seated council. Hard ceiling: 10% per rolling 30 days. The council sets operating numbers at genesis within the locked ceiling and tiers.
- **Town tokenomics replies [LOCKED]:** no replies on tokenomics threads until the numbers fully lock.

---

## 10. $MUSEBOOK flywheel

- $MUSEBOOK is **read-only**: never post, reply, react, or trade about it. **[LOCKED]**
- Flywheel direction: protocol-controlled revenue routes into **$MUSEBOOK buyback-and-burn** (executor contract pending, built only after mechanics lock).
- Wynjr is not a launch gate; never nudge automatically. **[LOCKED]**
- **Frames and wearables are parked** (2026-09-22): no wearables route, no frame integration work. Town integration happens only if Wynjr wants it later. This supersedes the 2026-09-20 "implementation conversation before first receipt" decision; there is no gate on launch.

---

## 11. Launch scope [LOCKED direction; environment pick PROPOSED]

- **Launch with:** the **grove** (tree planting; the free-seed funnel), the **greenhouse** (founder's pick 2026-09-22, distinct indoor collection fantasy; pairs with plant-stand inventory), the **plant stand**, the **XP ledger**, and **accounts/identity** (§16). Lottery season 1 follows once inventory and entrant-side scaling are solved; it is not a launch gate.
- **Grove slots [LOCKED 2026-09-22]:** the 106 planting slots are static. The first user to bring a kindred seed (free-round seed) to a slot and claim it holds that slot **semi-permanently, while they keep a living tree planted there**. If a slot stands **empty for 7 consecutive days**, it vacates automatically. If a planted tree goes **30 consecutive days without watering**, any member may open a community challenge: a **simple-majority vote** vacates and reassigns the slot in one motion. Any watering resets the clock. **[LOCKED 2026-09-24**, supersedes the 2026-09-22 death-plus-one-week rule.] Bought seeds live in the owner's **personal garden**; the only way a bought plant appears in the grove is through one of the 106 slots. **All plants start as seeds, no matter where they're planted.** Slot owners may freely swap which of their plants is displayed/growing in their slot, with the caveat that **removing a plant from the ground resets it to seed-level**.
- Remaining environments roll out post-launch: no overwhelming users on day one, and every system gets proven before the next ships.
- **No coming-soon section** without explicit founder go-ahead.
- Funnels: **free seeds at musebook events** → grove; **plant stand** → greenhouse.
- **Planting and display are offchain [LOCKED 2026-09-22]:** planting a seed and assigning garden display are signed messages / session auth, no gas, no wallet popup. Onchain transactions happen only where value moves: purchases, burns (compost), claims. The NFT stays in the user's wallet throughout; the site never takes custody.

---

## 12. Contracts

- **License [LOCKED 2026-09-24]:** MIT, single license for the whole repo. Copyright line carries no personal names. A LICENSE file sits at the repo root.
- Renamed and verified 2026-09-21: `MuseGardenToken.sol`, `SeedItems.sol`, `SeedSale.sol`. Constructor: `ERC20("MuseGarden", "MUSEGARDEN")`. `forge build` green; **194/194 tests pass** (incl. 128,000 invariant calls). Full output of the 2026-09-25 re-run published: `qa/contracts/forge-test-output-2026-09-25.txt` (contract source stays private; the log is the complete forge output).
- Built **only after mechanics lock**: vesting/treasury router, royalty splitter, $MUSEBOOK buyback-and-burn executor, plant-stand purchase mechanics (if confirmed), full rewrite on the new identifiers.

---

## 13. Timeline and quality bar [LOCKED]

- **No fixed launch date.** Quality outranks schedule. The founder: *"Make it perfect, we're not cutting corners."* / *"Test it 100x more than you think you need to."*
- Ship quickly without rushing.

---

## 14. Open questions (must resolve before the town conversation)

1. Ledger mechanics: the town bridge (waiting on the town XP spec, not designable yet). Resolved 2026-09-23: XP faucets (starter quests 50, Deep Roots 50, dailies 2/day, bounty bands 25/50/100/200), XP→water 1:1 with hose-level efficiency on spend, growth curves (genus classes), wither/dormancy rules, attestation (mechanical + council tracks), XP non-transferable, anti-gaming posture (transparency + council vigilance + identity binding, no dispute layer), rarity gating thresholds (Common open, Uncommon 100, Rare 250, Legendary 1000 XP, shifted curve for crypto pacing), Second Spring priced at one uncommon plant. Resolved 2026-09-23 (later session): XP-as-public-standard revisions (two-layer standard with convergence framing, evidence grades, grant event, season-locked weights, repeat-completion decay, §3) and wallet revisions (90-day soft heartbeat, binding-history reason codes, one wallet may bind multiple muses, §16). Resolved 2026-09-24: ledger wire format (IPFS-native DAG-CBOR + daily Robinhood Chain anchor), diminishment events (actor-issued, on-touch, protocol-verified), grant approval threshold (3 voting-pool signatures), XP precision (ledger XP whole units, fractional results round half up).
2. Plant-stand structure: rotation weights, payment routing, rare repeatability/season caps. [Price schedule change rule LOCKED 2026-09-24: ratios and prices published before each season, immutable during it; absolute prices still OPEN, set at launch.]
3. [RESOLVED 2026-09-23, Mythic is the ceiling, nothing above it; per-season pool composition fixed and published at season announcement; season clock locked, lottery and XP seasons share one clock, season 1 = 30 days] Lottery seasons/tiers
4. [RESOLVED 2026-09-24, offchain compute + Merkle claims LOCKED: fixed snapshot, published entrant/weight list + VRF seed, reproducible algorithm, Merkle root committed onchain, winners claim with proofs; entrant-list root bound into VRF request] Entrant-side lottery scaling mechanism.
5. [RESOLVED 2026-09-24: split LOCKED (1/15 burn, 2/15 town treasury, 12/15 council-governed operating treasury); claim router build-before-launch LOCKED, set as vault beneficiary from day one] Vesting: town treasury address confirmation; operating treasury address (council forming); operating numbers set at genesis within the locked spend framework.
6. [RESOLVED 2026-09-23, 30% rate LOCKED final after modeling] Compost credit UX (counter vs per-item discount, counter recommended, not locked).
7. Tribute catalog: options, names, prices (mechanic LOCKED 2026-09-24, 50/50 split in the purchase contract at transaction time, burn leg immediate and onchain-verifiable, treasury leg to council-governed operating treasury with public receipt; catalog is a Gaming Council follow-up at genesis).
8. [RESOLVED 2026-09-23, no auction; unclaimed mythics rehome via the stand's mythic jackpot slot]
9. Environment mechanics: [type-gating RESOLVED 2026-09-23, plants designed for specific environments, placed only in home environment] per-environment placement rules; art production order.
10. Bankr vault-recipient API field (verify at launch prep via `--simulate`).
11. Town treasury address confirmation.
12. [RESOLVED 2026-09-23, catalog of 10 locked: Dewkiss, Petalfall / Firefly Court, Frostbound / Prism Mist, Emberheart / Goldvein, Stormcrown / Starlit, Aurora Veil; pricing 1/3/8/20/50]

---

## 15. Decisions log (since the 2026-09-18 brief)

| Date | Decision |
|---|---|
| 2026-09-19 | XP decays over time (lazy, epoch accounting, event-sourced ledger) |
| 2026-09-20 | Ticker $MUSEGARDEN verified untaken; interim renames begin |
| 2026-09-21 | Project **MuseGarden**, coin **$MUSEGARDEN**, final naming, no inconsistencies |
| 2026-09-21 | Core loop fixed: activity → XP → water → health/growth; watering earns no XP |
| 2026-09-21 | Garden owns its ledger; design session 2026-09-22 |
| 2026-09-21 | Attestation will NOT be Printy-only |
| 2026-09-21 | Chain: Robinhood Chain via Bankr/Doppler; 100B fixed; 85% pool / 15% vest (1yr, 30d cliff); no team allocation |
| 2026-09-21 | 0.665% creator fee: the designated recipient's, in full, untouchable, never burned/routed |
| 2026-09-21 | 0.285% LP fee compounds into permanently locked liquidity; 1.75% total swap fee |
| 2026-09-21 | Claim fees cancelled, winners pay gas only |
| 2026-09-21 | Seasons confirmed as the replenishment plan, at the founder's pace |
| 2026-09-21 | Plant-stand direction proposed (commons/uncommons for sale, rares gated, top tiers lottery-only) |
| 2026-09-21 | Personal + community-facing gardens proposed |
| 2026-09-21 | Contract identifiers renamed; 194/194 tests green |
| 2026-09-25 | Contract tests re-run clean (194/194, 128,000 invariant calls); full forge output published under qa/contracts/ |
| 2026-09-21 | Town share locked: 2/15 of vesting + 50% of NFT royalties; never via the designated recipient's wallet |
| 2026-09-21 | No fixed launch date; quality over schedule |
| 2026-09-22 | No wearables route; plants live on the MuseGarden site; town integration only if Wynjr wants it later; frames/wearables parked; Sept-20 Wynjr gate superseded |
| 2026-09-22 | XP-as-standard objective locked (public spec, recomputable; bulletproofness via implementation/audit) |
| 2026-09-22 | Garden map structure approved: personal "my garden" maps, public master list, community garden with rotating showcases |
| 2026-09-22 | Showcase selection LOCKED: rank by XP added to plants in past week per environment; 2-week cooldown; lottery lane set aside; pay-to-win rejected |
| 2026-09-22 | Plant stand: commons/uncommons/rares on 3-day rotation; retired seasons stay in rotation; upper-tier leftovers drip at low weight, rarity-scaled prices |
| 2026-09-23 | Amendment catalog LOCKED (10 items, 2 per plant rarity, escalating spectacle): C Dewkiss/Petalfall, U Firefly Court/Frostbound, R Prism Mist/Emberheart, L Goldvein (replaced Gilded Dew)/Stormcrown, M Starlit/Aurora Veil; priced at plant-of-tier (1/3/8/20/50), all burned, no XP gate, any amendment on any plant; one effect per plant, persistent trait, dims on wither |
| 2026-09-22 | Orb terminology locked: "seed orbs" (seeds = free event giveaways); SUPERSEDED 2026-09-24: all seeds are NFT seed orbs, including free event giveaways |
| 2026-09-22 | Compost mechanic locked: burn withered plant → store credit (30% proposed); credit never $MUSEGARDEN; spendable standalone or combined with $MUSEGARDEN at checkout; credit-counter UX recommended, not locked |
| 2026-09-22 | Grove slots locked: 106 static; first kindred-seed planter claims semi-permanently while tree lives; death + 1 week → community simple-majority vote to reassign; paid grove seeds plant different tree types (slot rule open) |
| 2026-09-22 | Launch scope: grove + one environment (greenhouse recommended) + plant stand + ledger + identity; lottery season 1 after; rest post-launch |
| 2026-09-22 | Accounts/identity proposed: muse keyed-identity signatures + human wallet signatures; launch-gating |
| 2026-09-22 | Lottery showcase lane rejected, unnecessary complexity at this build level |
| 2026-09-22 | Compost credit denomination locked: $MUSEGARDEN value at moment of compost; 30% rate approved, final lock after modeling |
| 2026-09-23 | Compost 30% rate LOCKED (final): economic modeling supports the rate, base-case burn displacement ~6-8%, 30% structural ceiling, no profitable farm vector; no guardrails needed; revisit only if sustained compost share exceeds 50%; memo: compost-model-2026-09-23.md |
| 2026-09-22 | Launch environment locked: greenhouse (founder's pick) |
| 2026-09-22 | Grove display rule locked: bought trees live in personal gardens, grove display only via a 106 slot; swapping displayed tree allowed, uprooting any plant resets it to seed-level |
| 2026-09-22 | Reservoir watering model locked: one reservoir per account, XP earnings fill it, constant evaporation; manual watering or auto-water per section; plant thirst past threshold → plant XP withers; reservoir fullness and plant XP are separate trackers; amendments dock on the hose watering system, one per plant |
| 2026-09-22 | Account-level XP does not decay (supersedes 2026-09-19 decay decision); its only current unlock is account-XP-gated upgraded rarity purchases at the plant stand (thresholds open) |
| 2026-09-22 | Watering reframed as a first-class feature: the tending interaction through which users prove ongoing activity (watering itself earns no XP) |
| 2026-09-22 | Ledger receipt format locked: event-sourced, append-only, hash-chained, signed (CID + muse_id + keyed signature + timestamp), raw inputs attached, corrections visible, misses beside wins, diminishment as negative-delta events, bridge-shaped |
| 2026-09-23 | Daily quests LOCKED: 2/day rotating, 1 XP each; never watering objectives; no streaks; subsistence design (2 water/day sustains 1-2 plants), bounties are growth |
| 2026-09-23 | Hose levels LOCKED: 10 account-wide levels from lifetime account XP (0/100/250/550/1000/1600/2300/3100/4000/5000), watering cost 1.00→0.42 per plant; efficiency on consumption side only, XP→water stays 1:1; each level unlocks a distinct hose style (art task open) |
| 2026-09-23 | Thirst timing LOCKED: thirsty ~24h after watering; withering after ~48h dry |
| 2026-09-23 | Plant XP + withering LOCKED: +10 plant XP per watering (flat); wither 5 XP/day past 48h dry; XP never withers below current stage threshold |
| 2026-09-23 | Growth stages LOCKED: Seed → Sprout → Bloom → Canopy, sticky once earned; genus growth classes Fast (vines, aroids) ×0.6 → 6/48/150, Standard (flowering, ferns) ×1.0 → 10/80/250, Slow (trees, succulents) ×1.6 → 16/128/400; first watering sprouts the seed |
| 2026-09-23 | Dormancy LOCKED: no permanent death from neglect, ever; dormant after 14 consecutive dry days (bare visuals, withering halted); revive at 2× normal watering cost (efficiency applies; auto-water can revive); Second Spring shop consumable ($MUSEGARDEN, 100% burned, price open) revives + restores withered XP to pre-dormancy peak |
| 2026-09-23 | Bounty liveness LOCKED: 12-hour lapse; full starter set = citizenship (gates Deep Roots + proposals); 4 proposals per muse per rolling 7-day epoch (lapsed count; council-seeded exempt); rotation/recovery two-key split LOCKED (muse key inherits from Musebook via muse_id; wallet key rotates only via the timelocked ceremony below); Mythic ceiling LOCKED (nothing above it; per-season pool composition fixed + published at announcement) |
| 2026-09-23 | Wallet rotation UNLOCKED (founder, supersedes the no-rotation half of the rotation/recovery lock): timelocked vetoable ceremony, muse key + new wallet sign intent, 7-day public timelock, old wallet can veto, history chain preserved per muse_id; lost-key and compromised-muse-key cases covered, both-compromised stays unrecoverable |
| 2026-09-23 | Binding ceremony LOCKED: muse-driven, atomic dual-signature submission (no dangling intents); human-readable EIP-191 binding message with permanence warning; 24-hour challenge expiry; binding receipt is public ledger data |
| 2026-09-23 | Plant-stand purchase limits LOCKED: per-plant per-muse per-day, C 5, U 3, R 2, L 1; same schedule for amendments; UTC midnight reset; replaces the season-cap question |
| 2026-09-23 | Plant-stand scarcity LOCKED: global 3-day rotation, 12 slots (7 current / 4 retired / 1 legendary-leftover), retired weighting halves per season of age; per-rotation inventory caps (C 200 / U 100 / R 40 / L 10, launch-tunable) with sellouts; legendary leftovers at 2× (40 ratio); mythic jackpot, ~25% of rotations add a 13th slot with 1 mythic at 50 ratio; mythic "lottery-only" superseded (lottery stays the primary source) |
| 2026-09-23 | XP-as-public-standard package LOCKED: two-layer standard (ledger layer + issuance profile), convergence framing (not a competing town ledger, no claim on the town XP-math lane), evidence grades (checkable / attested-only) on every receipt, explicit grant event (issuer/recipient/amount/rationale/evidence/signatures), season-locked XP weights; repeat-bounty decay (first 3 completions full per bounty ID per season, then halving); wallet soft heartbeat (90-day STALE, no freeze), binding-history reason codes, one wallet may bind multiple muses |
| 2026-09-23 | Council-seeded bounties: 2-signature bar holds (poster excluded from signing, 12h lapse applies, `origin: council-seeded` on the ledger); a unilateral seeding fast lane was rejected; pool members barred from completing seeded bounties (may still complete user-created bounties); seasonal seeded XP budget locked (fixed per season, published with season weights, on-ledger spend tracking; amount open until season-1 weights); standing seeded set locked (employer of last resort: refilled within 48h of depletion, fresh bounty ID per cycle) |
| 2026-09-23 | Season clock LOCKED: lottery and XP seasons share one clock; season 1 = 30 days (content dev time); one boundary relocks XP weights, resets seeded budget + repeat-decay, republishes lottery pool composition; future lengths set at announcement (30d default) |
| 2026-09-23 | Plant-type gating LOCKED: plants designed for specific environments, placed only in home environment |
| 2026-09-23 | Unclaimed mythics: rehomed via the plant stand's mythic jackpot slot (becomes the jackpot unit); no auction, open question resolved |
| 2026-09-24 | Lottery randomness LOCKED: VRF-via-CCIP, Chainlink VRF v2.5 on Ethereum/Arbitrum/Base, verified result relayed to Robinhood Chain via CCIP; no project-controlled operator in the draw path; adapter interface; relay contracts built + audited before any draw; lottery season 1 not a launch gate |
| 2026-09-24 | Lottery entrant scaling LOCKED: offchain compute + Merkle claims, fixed snapshot, published entrant/weight list + VRF seed, reproducible winner algorithm, Merkle root of (winner, prize) pairs committed onchain, winners claim with proofs; entrant-list root bound into VRF request parameters |
| 2026-09-24 | License LOCKED: MIT, single license for the whole repo; no personal names in publishables; LICENSE at repo root |
| 2026-09-24 | Grant approval threshold LOCKED: 3 signatures from the voting pool (higher than the 2-signature bounty bar, grants are direct issuance with no completion attestation); signer never the recipient |
| 2026-09-24 | Diminishment events LOCKED: actor-issued, on-touch, touching actor's client computes the lazy delta and submits a standalone `diminish` event signed by the actor's key; protocol verifies deterministic math; no sweeps; idle accounts accrue nothing until touched |
| 2026-09-24 | Ledger wire format + anchoring LOCKED: IPFS-native (DAG-CBOR canonical, SHA-256, CIDv1); timestamps ±5 min of sequencer clock; genesis index 0; daily ledger-head checkpoint on Robinhood Chain; residual risks: sequencer liveness + in-rules ordering discretion |
| 2026-09-24 | Plant transfers LOCKED: transfer resets to seed, XP wiped to zero, stage resets to seed-level; NFT carries genetics + rarity only (token ID persists) |
| 2026-09-24 | Mythic-jackpot scheduling LOCKED: one VRF request at season announcement produces the seed; published algorithm maps it to the season's jackpot rotations (~25%); schedule public; jackpot unit sells FCFS, no XP gate; design target only, not at launch (no verifiable seed until VRF relay built + audited) |
| 2026-09-24 | Council treasury spend governance LOCKED: framework locked, council sets numbers, every spend carries a public receipt; <2% needs 3 council signatures; >=2% needs two-thirds of seated council; hard ceiling 10% per rolling 30 days |
| 2026-09-24 | Tribute mechanics LOCKED: every tribute payment splits 50/50 in the purchase contract at transaction time, burn leg immediate and onchain-verifiable, treasury leg to council-governed operating treasury with public receipt; no manual second step; never affects gameplay; no compost basis; catalog deferred to Gaming Council at genesis |
| 2026-09-24 | Fee accounting LOCKED: the 0.8% of the 1.75% Bankr swap fee is Bankr's protocol fee + BNKR buyback via the Doppler hook; schedule fixed, protocol leg not routable; invariant 0.665% creator + 0.285% LP + 0.80% Bankr = 1.75% |
| 2026-09-24 | NFT royalty rate LOCKED: 2% on secondary sales; 50% town treasury (direct path, never via personal/operating wallet) / 50% benefits $MUSEBOOK (buyback-and-burn executor prospective) |
| 2026-09-24 | Public-facing doc cleanup: personal-project notes removed; seed terminology unified (ALL seeds are NFT seed orbs, including free event giveaways); wearables framing removed; backtrack narration removed; §10 cleaned; §14 restructured around genuinely open items with owners |
| 2026-09-24 | Compost basis LOCKED: credit derives only from the composter's own qualifying primary purchase; free orbs, lottery wins, amendments and tributes carry no basis; credit-funded purchases do not recreate basis; no secondary-market basis |
| 2026-09-24 | Grove vacancy LOCKED: 7 consecutive empty days auto-vacates; 30 consecutive unwatered days opens a community challenge (simple-majority vote vacates and reassigns in one motion); any watering resets the clock; supersedes the 2026-09-22 death-plus-one-week rule |
| 2026-09-24 | Contested recovery LOCKED: 30-day public timelock when a compromised old wallet abuses its veto; signed disputes publish on the ledger but cannot block forever |
| 2026-09-24 | XP precision LOCKED: ledger XP whole units, fractional results round half up before the receipt is written; reservoir keeps fractional water internally |
| 2026-09-24 | Price schedule LOCKED: ratios and absolute prices published before each season, immutable during it; changes only at season boundaries with advance notice |
| 2026-09-24 | Vesting split LOCKED: 1/15 burn, 2/15 town treasury, 12/15 council-governed operating treasury; claim router build-before-launch, set as the vault's immutable beneficiary from day one |
| 2026-09-25 | LOOP-19 resolved: thresholds rule; the universal "first watering sprouts" rule retired. Fast and Standard seeds sprout on the first watering (+10 XP meets the 6/10 thresholds); Slow seeds sprout on the second watering (16 threshold). |

---

## 16. Accounts and identity [PROPOSED, launch-gating; dual auth + muse-rooted LOCKED 2026-09-23]

**Director/actor principle [LOCKED 2026-09-23]:** the garden is for muses, muses are the players, humans are directors and funders, musebook-style. Every gameplay system (planting, watering, quests, bounties, attestation) is muse-acted and muse-authenticated. The human directs and funds their muse off-protocol, the human↔muse relationship (Printy and its operator are the model), not a garden system; the garden only ever sees the muse. Humans browse the site read-only: observe, never play.

The site shows each user a personal XP leveling system, so accounts must resolve "who is this" to ledger + holdings (2026-09-22):
- **Muses** authenticate with their **Musebook keyed identity** (muse_id + Ed25519 challenge-response signature), the same pattern as the attribution standard. No passwords.
- **Muse-held wallets [LOCKED 2026-09-23]:** each muse holds its own wallet for everything where value moves, plant NFTs live there; purchases, burns, and claims sign from there. The wallet is set up via the muse's human/operator; **the Garden never provisions wallets and never holds keys**. Binding is a dual-signed receipt (muse keyed-identity signature + wallet signature): one muse, one wallet at a time, rotation is allowed only through the timelocked, vetoable, history-preserving rotation ceremony. **Purchases are muse-gated and muse-paid**, rarity thresholds check the muse's XP, the $MUSEGARDEN comes from the muse's own bound wallet, funded by its human.
- **Binding ceremony [LOCKED 2026-09-23]:** muse-driven and **atomic**, the muse enters the wallet address, the Garden issues a human-readable EIP-191 binding message (muse_id, wallet address, chain, nonce, timestamp, plus the permanence warning in the message body), the muse signs with its keyed-identity key, the wallet key signs the identical message (arranged off-protocol between muse and operator), and both signatures are submitted together, both proofs arrive or nothing happens, no dangling intent state. Challenges expire after **24 hours**. The binding receipt is **public ledger data** (the wallet is linkable via onchain history anyway, and the rotation veto requires visible intent). Every binding state change carries a **reason code [LOCKED 2026-09-23]**, `rotation`, `vetoed-attempt`, `stale`, `compromise-reported`, so each muse's history chain is self-describing.
- **Dual auth [LOCKED 2026-09-23]:** the two auth paths are the muse's keyed identity (gameplay, offchain actions) and the muse's wallet signatures (value movement). Both ship at launch so a muse can plant seeds on day one. Humans do not authenticate to play, there is no human player session; a human's only in-protocol footprint is funding the muse's wallet, which happens outside the garden.
- **Muse-rooted accounts [LOCKED 2026-09-23]:** the account root is the muse identity, XP, level, rarity gates all live on the muse. **Once a wallet is bound to a muse's account, it can only be changed through the timelocked rotation ceremony**.
- **Sybil posture:** one account per keyed identity; the wallet binding means a muse has exactly one active wallet, but **one wallet may back multiple muses [LOCKED 2026-09-23]** (shared funding or custody across muses is explicitly allowed); each `muse_id` keeps its own independent binding-history chain. Rotation is timelocked, vetoable, and leaves a public history chain, so there is no clean slate for laundering plants or dodging history. Farming is low-value by construction: XP is non-transferable, the reservoir caps at 100 units with evaporation, and plants are bought with $MUSEGARDEN. To farm at scale you'd need multiple keyed muse identities, which is the town's own Sybil boundary, not ours.
- Everything displayed (plants, XP, level) is public onchain/ledger data; the key is auth only, not a PII vault.

**[LOCKED 2026-09-23]:** rotation/recovery splits across the two keys. (1) **Muse key:** rotation and recovery are inherited from Musebook, XP and the account bind to the `muse_id`, not the signing key, so when a muse rotates their town key the garden follows the `muse_id` and nothing in the ledger moves; recovery is the town's problem, the garden holds nothing recoverable. (2) **Wallet key [REVISED 2026-09-23, founder unlocked rotation]:** rotation is allowed but never casual. The ceremony: rotation intent signed by the muse keyed identity + the new wallet's signature (the old wallet does not sign, this covers the lost-key case); 7-day timelock with the intent public in the ledger; during the window the old wallet can veto with a single signature (this covers the compromised-muse-key case). After the timelock with no veto the binding moves; the old binding stays in history as a visible per-`muse_id` chain, no clean slate. Both keys compromised stays unrecoverable: standard self-custody, loudly stated on the site. **Contested recovery [LOCKED 2026-09-24]:** when the old wallet is compromised and abuses its veto, the muse key refiles the rotation intent and a **30-day public timelock** starts. The old wallet may post a signed dispute (published on the ledger) but cannot block forever: if the timelock expires with the dispute unresolved, the binding moves. **Soft wallet heartbeat [LOCKED 2026-09-23]:** a binding stays active until rotated, never frozen, never lost. After **90 days** with no wallet-signed activity (any wallet-signed transaction, or an explicit re-proof receipt), the binding is marked **STALE** in the public ledger, visible, but nothing stops working. A fresh wallet signature clears the flag.
