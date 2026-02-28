# FundX

## Stable Capital Formation on Stacks

FundX is a programmable escrow protocol that enables builders to raise capital in USDCx on Stacks with transparent, on-chain enforcement of funding rules.

It eliminates volatility risk while preserving Bitcoin alignment.

---

## Vision

FundX is not just a crowdfunding app.

It is a stable, programmable escrow layer for Bitcoin-native capital formation.

Builders raise in USDCx.
Backers fund with confidence.
Smart contracts enforce the rules.

No custodians. No hidden conditions. No volatility chaos.

---

## The Problem

### 1. Volatility Risk

Raising in STX or BTC exposes campaigns to price swings that can destroy runway before execution begins.

### 2. Escrow Trust

Most crowdfunding platforms rely on centralized custody and discretionary fund release.

### 3. Fragmented Stable Liquidity

Bitcoin-aligned builders often rely on stablecoins bridged from other ecosystems, introducing complexity and risk.

---

## The Solution

FundX introduces a USDCx-powered on-chain escrow model:

* Funds are held in a Clarity smart contract
* Release conditions are enforced programmatically
* Platform fees are transparent and deterministic
* Backer protection is embedded in funding logic

---

## Core Features

### Stable Funding via USDCx

FundX uses USDCx, a USDC-backed token minted via Circle’s infrastructure and interoperable through CCTP mechanisms managed by Circle.

This provides:

* 1:1 USD backing
* Cross-chain mint and burn mechanics
* Native liquidity within supported ecosystems

---

### Programmable Funding Models

Each campaign defines its funding logic at creation.

Supported models:

**Flexible Funding**

* Creator can withdraw after deadline
* Goal does not need to be reached

**All-or-Nothing**

* Funds released only if goal is met
* Backers can claim refunds if goal fails

Future roadmap includes milestone-based releases.

---

### On-Chain Escrow

Campaign funds are:

* Held by the contract
* Not by the platform
* Not by the creator
* Not by a multisig

Withdrawals are rule-based and deterministic.

---

### Transparent Platform Fee

* 2 percent fee on successful withdrawals
* Fee is automatically calculated and transferred
* No hidden charges

---

## Architecture

### Smart Contract Layer

Language: Clarity
Network: Stacks

Core Components:

* Campaign registry map
* Donation tracking map
* Funding model selector
* Withdrawal enforcement logic
* Refund logic for all-or-nothing campaigns

All logic is deterministic and auditable.

---

### Frontend Stack

* Next.js 14
* React
* Tailwind CSS
* Stacks.js integration

UI responsibilities:

* Campaign creation
* Donation flow
* Funding model selection
* Deadline countdown
* Withdrawal visibility
* Refund claim interface

---

## Campaign Lifecycle

### 1. Create Campaign

Creator defines:

* Funding goal
* Duration in blocks
* Funding model
* Campaign metadata

Contract assigns:

* Campaign ID
* Deadline
* Active state

---

### 2. Donate

Backers:

* Approve USDCx transfer
* Donate to campaign vault
* Have donation tracked on-chain

If goal would be exceeded:

* Only remaining amount is accepted
* Excess is not transferred

---

### 3. Settlement

Flexible model:

* Creator withdraws after deadline

All-or-nothing:

* Creator withdraws only if goal reached
* Backers claim refund if goal not reached

---

## Security Principles

* No re-entrancy
* No floating arithmetic
* No dynamic code execution
* Explicit error codes
* State updated before transfers
* Deterministic logic only

Economic logic is prioritized over complexity.

---

## UX Philosophy

FundX focuses on clarity over gimmicks.

### Design Priorities

* Show funding model clearly on campaign card
* Display real-time goal progress
* Convert blocks to readable time estimates
* Show withdrawal eligibility status
* Clearly display platform fee before withdrawal
* Explicit refund availability notice for all-or-nothing campaigns

Trust is built through visibility.

---

## Roadmap

### Phase 1

* Deploy escrow contract
* Integrate USDCx token
* Launch flexible + all-or-nothing models

### Phase 2

* Milestone-based funding
* Campaign analytics
* Grant program integration

### Phase 3

* Treasury tools for Bitcoin-native teams
* Protocol-level integrations

---

## Why Stacks

* Bitcoin-aligned settlement
* Clarity’s decidable smart contracts
* Predictable execution
* Strong security guarantees

FundX exists to strengthen capital formation inside the Bitcoin ecosystem.

---

## Getting Started

### Prerequisites

* Clarinet
* Node.js 18+
* Hiro Wallet
* Stacks testnet account

### Local Development

Clone the repository:

```
git clone https://github.com/yourusername/fundx.git
cd fundx
```

Start local chain:

```
clarinet integrate
```

Run frontend:

```
npm install
npm run dev
```

---

## Contributing

We welcome:

* Smart contract review
* UI improvements
* Economic model feedback
* Security analysis

All contributions must prioritize simplicity and auditability.

---

## License

MIT

---


