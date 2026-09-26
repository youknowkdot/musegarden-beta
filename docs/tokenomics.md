# $MUSEGARDEN Tokenomics

**Status: Public-Facing**

One-page reference. Derived from `musegarden-concept-public.md` (canon through 2026-09-24). **[LOCKED]** = decided. **[OPEN]** / **[PROPOSED]** = not decided; do not treat as fact.

## Supply and rails

| Parameter | Value |
|---|---|
| Supply | 100,000,000,000 $MUSEGARDEN, fixed. No mint authority. True supply-reducing `burn`, verified on the Doppler template. [LOCKED] |
| Chain | Robinhood Chain via Bankr/Doppler. Quote token $MUSEBOOK. [LOCKED] |
| Launch pool | 85% of supply. Single pool, 100% of the LP allocation paired with $MUSEBOOK. Permanently locked. [LOCKED] |
| Vesting | 15% of supply over one year, 30-day cliff, accruing from launch. Permissionless `releaseFor` pays the designated beneficiary; vault beneficiary and schedule immutable. [LOCKED] |
| Team / insider allocation | None, under any name. [LOCKED] |
| Launch mechanics | First five minutes: 2% supply cap per wallet. Degen mode at exactly $2,500 market cap (optional, a launch-time decision). No seed-liquidity deposit expected. [LOCKED] |

## Burn sinks

| Sink | Rule |
|---|---|
| Primary sales | 100% of $MUSEGARDEN spent on primary acquisition burned (burn-on-acquire thesis). [LOCKED] |
| Vest-receipt burn | 1/15 off the top of every vesting claim, burned. [LOCKED] |
| Amendments, Second Spring | 100% burned. [LOCKED] |
| Tributes | 50% burned / 50% council-governed operating treasury, enforced in the purchase contract at transaction time. [LOCKED 2026-09-24; catalog (options, names, prices) open] |
| Compost credit | Displaces burns at checkout, never burns itself. Base-case ~6-8% of primary burns displaced; structural ceiling 30% (every credit traces to a preceding 100% burn). Credit is offchain, non-transferable, never $MUSEGARDEN tokens. [LOCKED; per `compost-model-2026-09-23.md`] |
| Unclaimed mythics | Not burned. Rehomed via the stand's mythic jackpot slot. [LOCKED] |
| Season-end upper-tier leftovers | Not burned. Drip into the plant-stand rotation. [LOCKED] |

The 0.665% creator fee is never burned or routed. [LOCKED]

## Faucet bounds: XP is not tokens

[LOCKED]

- XP issuance is ledger events only. No token mint, spend, or lock creates XP. No token-funded path to XP issuance exists by design.
- XP minting is bounded by: one-shot quests (starter set 50 XP, Deep Roots 50 XP), dailies capped at 2 XP/day, fixed bounty bands (25/50/100/200), and the council's seasonal seeded XP budget (published before each season, spend tracked on the ledger). When the seeded budget is spent, no further seeded bounties go live that season.
- XP is non-transferable. Vesting claims move tokens, never XP. Token supply stays 100B fixed regardless of XP activity.

## Vesting split: honest status

| Claim on the 15% vest | Status |
|---|---|
| 1/15 burned off the top of claims | [LOCKED] |
| 2/15 to the town treasury, plus 50% of NFT royalties (royalty leg venue-dependent), never passing through any personal or operating wallet | [LOCKED] |
| 12/15 to the council-governed operating treasury (at 100B and 15% vest: 1B / 2B / 12B) | [LOCKED 2026-09-24] protocol treasury, not a team or insider allocation; spend-governance framework locked (council sets operating numbers within it) |

Enforcement note: the split is enforced at claim time by the claim router [LOCKED 2026-09-24 - build before launch, vault beneficiary from deploy]. No interim mechanism. Deploy dependencies still open: the town treasury address is observed but unconfirmed (confirmation needed before use); the operating treasury address does not exist yet (the council is still forming).

Treasury spending creates sell pressure. Modeled honestly, not hand-waved.

## Fees

| Fee | Rule |
|---|---|
| Total Bankr swap fee | 1.75% = 0.665% creator + 0.285% LP + 0.80% Bankr protocol fee + BNKR buyback (hook-level, not routable). [LOCKED 2026-09-24] |
| Creator fee 0.665% | To the designated recipient, in full. Disclosed, fixed, onchain-checkable; never burned or routed through protocol contracts. [LOCKED] |
| LP fee 0.285% | Compounds into permanently locked liquidity. Quote-side creator fees preferably paid in $MUSEBOOK. [LOCKED] |

## $MUSEBOOK relationship

- No primary $MUSEBOOK cut. Primary flows (primary sales, vest-receipt burns) stay 100% $MUSEGARDEN burn. [LOCKED]
- $MUSEBOOK benefits from the MUSEGARDEN/MUSEBOOK LP pairing and the 2% secondary royalty routing. Protocol-revenue buyback-and-burn is prospective: no revenue source designated, no executor built, no promise made.
- 2% secondary royalty leg benefits $MUSEBOOK. [LOCKED 2026-09-24]

## Open before the town conversation

- Tribute options, names, prices. [OPEN]
- Bankr vault-recipient API field (verify at launch prep via a non-broadcast `--simulate`). [OPEN]
- Town treasury address confirmation (candidate `0xd96c2ccac24d385e32baab3497641d0d6e065ec2` observed; do not wire until Ryder, Wren, or the town confirms it). [OPEN]
