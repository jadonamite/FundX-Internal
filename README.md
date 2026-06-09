# FundX

**Stable crowdfunding on Stacks. Trustless USDCx escrow, enforced by Clarity.**

FundX lets builders raise capital in a USD-denominated SIP-010 token (USDCx) and
holds it in an on-chain Clarity escrow. Funds move only when the contract's rules
are met — no custodian, no discretionary release. Campaigns choose one of two
funding models at creation, and a flat 2% platform fee is applied on successful
withdrawal.

> **Token status:** the contract currently in use settles in a **mock USDCx token
> (`usdcx-v2`)** that is owner-mintable and intended for demo/testing. Production
> migration target is **aeUSDC** (Allbridge-bridged USDC),
> `SP3Y2ZSH8P7D50B0VBTSX11S7XSG24M1VB9YFQA4K.token-aeusdc` (6 decimals). See
> [`docs/TODO.md`](docs/TODO.md).

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
| `indiegogo-v2` | `contracts/contracts/indiegogo.clar` | Primary escrow — multi-token allowlist, flexible / all-or-nothing | ✅ |
| `fundx-registry` | `contracts/contracts/fundx-registry.clar` | On-chain campaign metadata (title, tagline, image, etc.) | ✅ |
| `usdcx-v2` | `contracts/contracts/usdcx-mock.clar` | Mock SIP-010 settlement token | ✅ |
| `fundx-escrow-v2` | `contracts/contracts/fundx-escrow.clar` | Cleaner USDCx-only escrow (working `get-nonce`) | ❌ deployed, unused |
| `fundx-milestone` | `contracts/contracts/fundx-milestone.clar` | 3-tranche milestone escrow | ❌ deployed, UI pending |
| `fundx-tips` | `contracts/contracts/fundx-tips.clar` | Direct creator tipping, on-chain reputation | ❌ deployed, UI pending |
| `sip-010-trait-v2` | `contracts/contracts/sip-010-trait-ft-standard.clar` | SIP-010 trait | dependency |

> The live frontend talks only to `indiegogo-v2`, `fundx-registry`, and `usdcx-v2`.
> Architecture details and a known-issues list are in [`docs/ARCHITECTURE.md`](docs/ARCHITECTURE.md).

## How it works

- **Create** is two transactions: `indiegogo-v2.create-campaign` (escrow) then `fundx-registry.register` (metadata).
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
