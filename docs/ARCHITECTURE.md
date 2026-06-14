# FundX — Architecture & Deep-Read Reference

A factual map of what is deployed, what the frontend calls, and how the pieces fit.
Everything here was verified against the source files and the live Hiro mainnet API.

Deployer / contract principal: `SP6X0MXEEGZX14ZTK7XQXJ76W35ZJDP9NZBT6F39`

---

## 1. Contract inventory

| Deployed name | Source | Counter | Tokens | Used by UI |
|---|---|---|---|---|
| `fundx-escrow-v3` | `fundx-escrow-v3.clar` | `campaign-count` (+`get-nonce` alias) | multi-token allowlist | 🔜 new primary (pending deploy) |
| `indiegogo-v2` | `indiegogo.clar` | `campaign-count` | multi-token allowlist | superseded by v3 |
| `fundx-escrow-v2` | `fundx-escrow.clar` | `campaign-nonce` | USDCx-only (`.usdcx-v2`) | ❌ |
| `fundx-milestone` | `fundx-milestone.clar` | `campaign-nonce` | USDCx-only | ❌ |
| `fundx-tips` | `fundx-tips.clar` | — (stats only) | USDCx-only | ❌ |
| `fundx-registry` | `fundx-registry.clar` | — (keyed by campaign id) | n/a | ✅ |
| `usdcx-v2` | `usdcx-mock.clar` | — | n/a (the token) | ✅ |
| `sip-010-trait-v2` | `sip-010-trait-ft-standard.clar` | — | n/a | trait dep |

> `usdcx-mock.clar` is explicitly marked "LOCAL TESTING ONLY — DO NOT DEPLOY TO
> MAINNET" in its own header, yet it is the original live settlement token. It is an
> owner-mintable `define-fungible-token`. The real settlement token is **USDCx**
> `SP120SBRBQJ00MCWS7TM5R8WJNTTKD5K0HFRC2CNE.usdcx` (FT asset `usdcx-token`,
> 6 decimals) — the frontend now targets it. See [`TODO.md`](TODO.md).

---

## 2. `indiegogo-v2` — the live escrow

State:
- `campaign-count` (uint) — 1-indexed (`new-id = count + 1`).
- `campaigns`: key **plain `uint`** → `{ creator, token, goal, deadline, total-raised, withdrawn, active, funding-model }`.
- `donations`: key `{ campaign-id, donor }` → **plain `uint`** (accumulated).
- `allowed-tokens`: `principal → bool`.

Public functions (each write takes the SIP-010 token trait first):
- `create-campaign(token-trait, goal, duration, funding-model)` → `(ok new-id)`. Asserts token is allow-listed, `goal > 0`, `duration > 0`, model ∈ {0,1}. Stores the token on the campaign.
- `donate(token-trait, id, amount)` — asserts trait == `campaign.token`, active, before deadline, `amount > 0`; transfers in, accumulates donor total, bumps `total-raised`. **No goal cap.**
- `withdraw(token-trait, id)` — creator only, once, after deadline; for all-or-nothing requires `raised >= goal`. Sets `withdrawn/active` before transferring 2% fee → owner, 98% → creator.
- `claim-refund(token-trait, id)` — all-or-nothing only, after deadline, `raised < goal`; zeroes the donor record before refunding full amount (no fee).
- `deactivate-campaign(id)` — owner only; blocks new donations (does not move funds).
- `set-allowed-token(token, allowed)` — owner only.

Read-only: `get-campaign`, `get-donation` (defaults to `u0`), `calculate-fee`, `calculate-net`, `is-past-deadline`, `is-goal-reached`.

Fee: `PLATFORM-FEE-BPS u200 / BPS-DENOMINATOR u10000` = 2%.

### Allowlist nuance
The allowlist is enforced only at `create-campaign`. `donate`/`withdraw`/`claim-refund`
check the passed trait against `campaign.token`, not against `allowed-tokens`. Removing
a token from the allowlist does not stop existing campaigns from using it.

---

## 3. `indiegogo-v2` vs `fundx-escrow-v2`

Both implement the same flexible / all-or-nothing escrow. They diverge:

| Axis | `indiegogo-v2` (live) | `fundx-escrow-v2` (unused) |
|---|---|---|
| Enumeration accessor | `get-campaign-count` — **missing on deployed bytecode** | `get-nonce` — present, works |
| `campaigns` key | plain `uint` | `{ id: uint }` |
| `donations` value | plain `uint` | `{ amount: uint }` |
| Refund cleanup | set to `u0` (row remains) | `map-delete` (removed) |
| Tokens | multi-token allowlist, per-campaign token | single hardcoded `.usdcx-v2` |
| Fee representation | BPS (200/10000) | percent (2/100) |
| SIP-010 trait import | mainnet FQN `SP3FBR2…` | local `.sip-010-trait-v2` |
| Inline documentation | sparse | thorough |

**Assessment:** `fundx-escrow-v2` is the cleaner, safer design (working enumeration,
true refund cleanup, self-documenting tuples). `indiegogo-v2` wins only on multi-token
flexibility — and its deployed copy is missing `get-campaign-count`.

### Resolution: `fundx-escrow-v3` (best of both worlds)
`fundx-escrow-v3.clar` merges both: indiegogo's **multi-token allowlist + per-campaign
token** with fundx-escrow's **working enumeration** (`get-campaign-count` *and*
`get-nonce`), **`map-delete` refund cleanup**, and documented invariants. Its external
API is byte-compatible with `indiegogo-v2`, so the frontend needed only a config change.
It is `clarinet check`-clean; tests live in `contracts/tests/fundx-escrow-v3.test.ts`.

---

## 4. Deployed-but-unwired contracts

- **`fundx-milestone`** — 3-tranche release. Each tranche ≈ 1/3 of `total-raised` (tranche 3 takes the remainder), gated on milestone block heights, tracked by a `claimed` bitmask. 2% fee per tranche. Refund path mirrors the escrow. No UI.
- **`fundx-tips`** — permissionless direct tipping (`tip(token, creator, amount, memo)`), 2% fee, accumulates per-creator and per-tipper stats + global counters. No campaigns/deadlines. No UI.
- **`fundx-registry`** — used. Stores per-campaign metadata; `register` is first-come ownership, owner-overwrite thereafter; `delete-meta` and owner `transfer-ownership` for moderation.

---

## 5. Frontend data flow

```
stacks-config.ts   addresses, network (mainnet), decimals(6), fee bps, blocks/day, FUNDING_MODEL
      │
stacks-contract.ts read helpers: getCampaignCount, getCampaignRaw, getRegistryMeta,
      │            getDonation, getBlockHeight, mapCampaign, fetchAllCampaigns
      │
hooks/useStacksContract.ts  useAllCampaigns, useCampaign, useDonation, useUserDonations
      │
app/ pages         /explore (live + mock pad), /campaigns/[id] (donate/withdraw/refund),
                   /create (2-tx create+register), /dashboard (CreatorTab, BackerTab)
```

Behavioral facts worth knowing:
- **Wallet** state comes from `StacksProvider` (`useStacks()`), using the modern
  `@stacks/connect` `connect()/disconnect()/isConnected()` API.
- **Create = 2 transactions** — escrow create, then registry register; the new id is
  predicted from the campaign count.
- **STX is a real on-chain choice.** `fundx-escrow-v4` has split rails, so `create/page.tsx`
  routes to `create-campaign-stx` or `create-campaign-ft` by the selected asset (the STX rail
  is deployed but not yet smoke-tested on mainnet).
- **Post-condition modes differ:** donate uses `"deny"` + an explicit FT post-condition
  (`Pc.principal(user).willSendLte(amount).ft(token, asset)`); dashboard withdraw/refund
  use `"allow"` because funds leave the contract via `as-contract` (a sender post-condition
  would not apply).
- **Tx confirmation** uses real polling — `waitForTx()` in `utils.ts` polls
  `/extended/v1/tx/{txid}` until success/failure/timeout (not a fixed sleep).
- **Reads are sequential** — `fetchAllCampaigns` does `Promise.all` over per-id calls;
  no multicall on Stacks.
- **Mock vs live routing** — Explore merges live numeric-id campaigns with mock slug-id
  demo cards (`src/lib/data.ts`); the campaign page branches on `isNaN(id)`.

---

## 6. On-chain verification (Hiro mainnet)

Checked against `indiegogo-v2` on the live API:

- `get-campaign-count` → **does not exist** on the deployed bytecode
  (`RuntimeCheck(UndefinedFunction("get-campaign-count"))`). The local source has it;
  it was never redeployed. The frontend depends on it, so Explore / Dashboard / create
  ID-prediction break against mainnet.
- The `campaign-count` **data-var** reads fine via `/v2/data_var` → **9,907**.
- `get-campaign(u1)` returns a valid campaign (goal 14,608 USDCx, raised 0, flexible).

Implications: enumeration must read the data-var (or be redeployed with the accessor),
**and** be paginated/indexed — a 9,907-campaign unbatched fan-out is not viable.

---

## 7. Stale docs (do not trust as current)

- `FUNDX-GUIDE.md` documents `fundx-escrow` (3-arg create, USDCx-only) and a token
  address `SP2C2YFP…usdcx` that **does not exist on mainnet** — not the live contract.
- `structure.md` / `Struct.md` file trees are outdated.
- `PROGRESS.md` is largely accurate but names `fundx-escrow-v2` as the contract (live is
  `indiegogo-v2`) and describes an old `setTimeout(refetch, 8000)` confirmation (now `waitForTx`).
- `Helper.md`, `Another.md`, `trials.md`, `whattofix.md` are git-ignored scratch notes.
- `FundX.clar` is the original Clarity-3 testnet version, superseded by the two escrows.
