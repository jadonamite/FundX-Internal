# FundX

**Stable crowdfunding on Stacks. Trustless USDCx escrow, enforced by Clarity.**

FundX lets builders raise capital in a USD-denominated SIP-010 token (USDCx) and
holds it in an on-chain Clarity escrow. Funds move only when the contract's rules
are met — no custodian, no discretionary release. Campaigns choose one of two
funding models at creation, and a flat 2% platform fee is applied on successful
withdrawal.

> **Token status:** the originally deployed escrow (`indiegogo-v2`) settles in a
> **mock, owner-mintable `usdcx-v2`** token (demo only). The current target is the
> **real USDCx** on Stacks mainnet —
> `SP120SBRBQJ00MCWS7TM5R8WJNTTKD5K0HFRC2CNE.usdcx` (FT asset `usdcx-token`,
> 6 decimals). The frontend is wired to the new `fundx-escrow-v3` contract +
> real USDCx; see [`docs/TODO.md`](docs/TODO.md) for the deploy/cutover steps.

## Funding models

- **Flexible** (`u0`) — creator can withdraw after the deadline regardless of whether the goal was met.
- **All-or-Nothing** (`u1`) — creator can withdraw only if the goal was reached; otherwise backers reclaim their full donation (no fee).

There is no goal cap — campaigns may raise beyond their stated goal until the deadline.

## The problem

1. **Volatility** — raising in STX/BTC exposes a project's runway to price swings before it can execute.
2. **Escrow trust** — most crowdfunding relies on centralized custody and manual fund release.

## Deployed contracts (Stacks mainnet)

Deployer / contract address: `SP6X0MXEEGZX14ZTK7XQXJ76W35ZJDP9NZBT6F39`

| Contract (deployed name) | Source | Role | In frontend |
|---|---|---|---|
| `fundx-escrow-v3` | `contracts/contracts/fundx-escrow-v3.clar` | **New primary escrow** — multi-token allowlist + working enumeration + clean refund | 🔜 wired, pending deploy |
| `fundx-registry` | `contracts/contracts/fundx-registry.clar` | On-chain campaign metadata (title, tagline, image, etc.) | ✅ |
| `indiegogo-v2` | `contracts/contracts/indiegogo.clar` | Original escrow — multi-token, but deployed copy lacks `get-campaign-count` | superseded by v3 |
| `usdcx-v2` | `contracts/contracts/usdcx-mock.clar` | Mock SIP-010 token (demo only) | legacy |
| `fundx-escrow-v2` | `contracts/contracts/fundx-escrow.clar` | Cleaner USDCx-only escrow (working `get-nonce`) | ❌ deployed, unused |
| `fundx-milestone` | `contracts/contracts/fundx-milestone.clar` | 3-tranche milestone escrow | ❌ deployed, UI pending |
| `fundx-tips` | `contracts/contracts/fundx-tips.clar` | Direct creator tipping, on-chain reputation | ❌ deployed, UI pending |
| `sip-010-trait-v2` | `contracts/contracts/sip-010-trait-ft-standard.clar` | SIP-010 trait | dependency |

> The frontend (`src/lib/stacks-config.ts`) targets `fundx-escrow-v3` + `fundx-registry`
> + the real USDCx. `fundx-escrow-v3` must be **deployed and have USDCx allow-listed**
> (`set-allowed-token`) before it goes live. Details + known issues:
> [`docs/ARCHITECTURE.md`](docs/ARCHITECTURE.md).

## Multi-token architecture

FundX escrow is **token-agnostic by design** — the reason `indiegogo`/`v3` was
chosen over the single-token `fundx-escrow-v2`:

- **Owner-curated allowlist.** Only the `CONTRACT-OWNER` can enable a settlement
  token via `set-allowed-token(token, allowed)`. `is-token-allowed(token)` exposes
  the current state. This keeps scam/worthless tokens out while leaving room to add
  USDCx, future stablecoins, or a wrapped STX without redeploying.
- **Per-campaign binding.** `create-campaign` records the chosen token on the
  campaign. Every later `donate` / `withdraw` / `claim-refund` re-checks that the
  passed SIP-010 trait equals the campaign's stored token, so funds for one token
  can never be moved with another.
- **SIP-010 generic.** Functions take a `<sip-010-trait>` argument rather than a
  hardcoded principal; any conforming fungible token can be supported once allow-listed.
- **Decimal-aware UI.** `stacks-config.ts` maps each token to its decimals and its
  FT asset name (for post-conditions). USDCx is 6 decimals — the same as the old mock —
  so the migration needs no amount-math changes.

Today the allowlist contains a single entry (USDCx). The architecture is what lets
that set grow later with one owner transaction instead of a new contract.

## How it works

- **Create** is two transactions: `fundx-escrow-v3.create-campaign` (escrow) then `fundx-registry.register` (metadata).
- **Donate / withdraw / claim-refund** each take the campaign's SIP-010 token as the first argument; the contract checks it matches the token the campaign was created with.
- **Deadlines are block heights** (~144 blocks/day). The UI converts the remaining blocks to an approximate "days left".
- **Donations** carry a SIP-010 post-condition (no ERC-20-style approve step) — one signature, one transfer.
- **Reentrancy** is guarded by updating state before every transfer.

## Technical stack

- **Contracts:** Clarity v2 (Stacks mainnet)
- **Frontend:** Next.js 16, React 19, Tailwind CSS v4, Framer Motion
- **Chain integration:** Stacks.js (`@stacks/connect`, `@stacks/transactions`, `@stacks/network`), Hiro API
- **Testing:** Clarinet + Vitest (`contracts/tests/FundX.test.ts`)

## Repository layout

```
contracts/            Clarinet project (Clarity contracts, tests, deployment plans)
  contracts/          .clar source (indiegogo, fundx-escrow, milestone, tips, registry, usdcx-mock)
  tests/              Vitest suite against indiegogo-v2 + usdcx-v2
  deployments/        mainnet/testnet plans
src/
  app/                Next.js routes: /, /explore, /create, /campaigns/[id], /dashboard
  components/         UI, hero, dashboard tabs, campaign cards
  lib/                stacks-config.ts, stacks-contract.ts (reads), hooks/, utils.ts (waitForTx)
docs/                 ARCHITECTURE.md, TODO.md
```

## Quick start

### Prerequisites
- [Clarinet](https://github.com/hirosystems/clarinet)
- Node.js 18+ and npm
- A Stacks wallet (Leather or Xverse)

### Contracts
```bash
cd contracts
clarinet check        # type/▶ analysis
clarinet test         # vitest suite
clarinet console      # local REPL
```

### Frontend
```bash
npm install
npm run dev           # http://localhost:3000
```

The app reads from Stacks **mainnet** via the Hiro API (`src/lib/stacks-config.ts`).

## License

MIT
