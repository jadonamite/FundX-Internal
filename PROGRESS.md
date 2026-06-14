# FundX (Stacks) — Integration Progress

> Stacks port of FundX-Celo's contract integration pattern. Validates the cross-chain abstraction.

---

## Reference

| Item | Value |
|---|---|
| Network | Stacks Mainnet |
| FundX Escrow | `SP6X0MXEEGZX14ZTK7XQXJ76W35ZJDP9NZBT6F39.fundx-escrow-v4` (dual-asset: STX *or* USDCx per campaign) |
| USDCx Token | `SP120SBRBQJ00MCWS7TM5R8WJNTTKD5K0HFRC2CNE.usdcx` (FT asset `usdcx-token`, 6 dec) |
| API | `https://api.hiro.so` |
| Platform fee | 2% (200 bps), enforced in contract |
| Campaign IDs | **1-indexed** (Celo is 0-indexed — important when porting) |
| Deadlines | Stacks block height (not timestamps) — derived `daysLeft` uses `~144 blocks/day` |

---

## What was ported

### New files

| File | Purpose |
|---|---|
| `src/lib/stacks-config.ts` | Contract addresses, network, decimals, blocks-per-day constant |
| `src/lib/stacks-contract.ts` | Pure read functions: `getNonce`, `getCampaignRaw`, `getDonation`, `getBlockHeight`, `mapCampaign`, `fetchAllCampaigns`. Mirrors the Celo `mapContractCampaign` helper. |
| `src/lib/hooks/useStacksContract.ts` | React hooks: `useAllCampaigns`, `useCampaign`, `useDonation`, `useUserDonations`. Hand-rolled with `useEffect` — no wagmi equivalent for Stacks. |

### Rewritten files

| File | Change |
|---|---|
| `src/app/explore/page.tsx` | Live `useAllCampaigns` + mock padding pattern (mirrors Celo) |
| `src/app/campaigns/[id]/page.tsx` | Full contract integration — donate / withdraw / refund flows + mock slug branch for demo campaigns |
| `src/components/dashboard/CreatorTab.tsx` | Filters `useAllCampaigns` by `creator === userAddress`, fixed-pattern withdraw call |
| `src/components/dashboard/BackerTab.tsx` | `useUserDonations` over all campaign IDs, finds where user donated, refund flow |

### Pre-existing fixes (blocking builds)

| File | Fix |
|---|---|
| `src/components/fundx/hero/HeroBackdrop.tsx` | Scrambled function declarations — `startAnimation`/`animate`/`HeroLogoParallax` were interleaved in wrong order. Rewrote to match Celo version. |
| `src/app/create/page.tsx` | `handleSubmit` and `formData` were defined outside the `CreateCampaign` function. Restructured. |
| `src/app/page.tsx` | `<section_>` → `<section>` |
| `src/components/Logo.tsx` | `className_` → `className` |

---

## Stacks-specific notes (differences from Celo)

1. **Dual-asset, one asset per campaign** — `fundx-escrow-v4` lets each campaign pick **STX *or* USDCx** at creation, via split rails (`create-campaign-stx`/`-ft`, `donate-stx`/`-ft`, etc.). Cross-rail misuse is blocked with `ERR-WRONG-ASSET (u114)`. `currency` is derived from the campaign's `asset-stx` flag. Accepting both assets in a single campaign is deferred (needs per-asset accounting / oracle).

2. **No ERC20 approve step** — Stacks SIP-010 transfers don't require pre-approval. Instead, the donate transaction carries a **post-condition** (`Pc.principal(user).willSendLte(amount).ft(usdcxFQN, "usdcx")`) which the wallet shows to the user. One signature, one transaction.

3. **No `feeCurrency` concept** — no MiniPay equivalent. Wallet (Leather, Xverse) handles fees in STX.

4. **Deadline is a block height, not a timestamp** — `daysLeft` is approximate (`(deadlineBlock - currentBlock) / 144`). Need to fetch current block height from Hiro API.

5. **Reads are sequential, not batched** — Stacks RPC has no `multicall` primitive. `useAllCampaigns` does `Promise.all` over individual `get-campaign` calls. Acceptable up to ~100 campaigns; would need pagination beyond.

6. **Wallet state via context, not hooks** — uses `useStacks()` from `StacksProvider`. `walletData.stxAddress` is the principal.

7. **Confirmation via tx polling after writes** — Stacks has no wagmi `waitForTransactionReceipt`. After a write we call `waitForTx(txid)` (`src/lib/utils.ts`), which polls `/extended/v1/tx/{txid}` until the tx settles, then refetches. Replaced the earlier `setTimeout(refetch, 8000)` heuristic.

---

## Known limitations

1. **No on-chain metadata** (same as Celo) — title/description/image render as "Campaign #N" with cycled placeholders.
2. **Tx confirmation is a polling loop, not a hook** — `waitForTx(txid)` polls `/extended/v1/tx/{txid}`; a reusable `useTransactionStatus(txid)` hook would be cleaner.
3. **Block-height deadlines are not user-friendly** — UI shows "~12 days" which depends on block time being ~10 min. During chain slowdowns this estimate is wrong.
4. **No backer count** (same as Celo) — contract doesn't expose this.
5. **Mock and live IDs share routing** — works because mocks are slugs and live IDs are numeric, but a slug like `"123"` would break things (none in mock data currently).

---

## Cross-chain mapping (validated against Celo)

| Behavior | Celo | Stacks |
|---|---|---|
| List campaigns | `campaignCount_` + batched `getCampaign(i)` (i ∈ [0, count)) | `get-nonce` + sequential `get-campaign(i)` (i ∈ [1, nonce]) |
| Read user donation | `getDonation(id, address)` | `get-donation(id, principal)` (returns optional tuple, default 0) |
| Donate | `approve` ERC20 → `donate(id, amount)` | Single tx: `donate(id, amount)` with FT post-condition |
| Withdraw | `withdraw(id)` | `withdraw(id)` |
| Refund | `claimRefund(id)` | `claim-refund(id)` |
| Tx confirmation | `waitForTransactionReceipt(config, { hash })` | `waitForTx(txid)` polling `/extended/v1/tx/{txid}` |
| Address format | `0x...` 20 bytes | `SP...` Stacks principal |
| Decimals | cUSD 18 / USDC 6 | USDCx 6 |
| Deadline | Unix timestamp | Block height (~10 min/block) |
| ID base | 0-indexed | 1-indexed |
