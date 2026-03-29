# FundX 

**Stable Crowdfunding on Stacks. Powered by USDCx.**

FundX is a decentralized fundraising platform that solves the "volatility risk" for Bitcoin builders. It allows users to raise capital in **USDCx** (stable purchasing power) while leveraging **Clarity smart contracts** for trustless escrow, ensuring funds are only released when goals are met.



##  The Problem
1. **Volatility:** Raising funds in STX/BTC is risky. A 20% market dip can kill a project before it starts.
2. **Friction:** Users with stablecoins on Ethereum/Polygon usually struggle to bridge to Stacks.

##  Features
* **Liquidity Funnel:** Integrated **Allbridge Core Widget** allows users to bridge ETH/USDC to Stacks directly inside the app.
* **Trustless Escrow:** Funds are held in a Clarity smart contract (`stax-fund.clar`), not a centralized wallet.
* **SIP-010 Compatible:** Built to the standard Stacks Fungible Token specification.

## 🏗 Technical Stack
* **Smart Contract:** Clarity (Stacks 2.5)
* **Frontend:** Next.js 14, React, Tailwind CSS
* **Integration:** Stacks.js, Allbridge Core SDK (Widget)
* **Testing:** Clarinet, Vitest

## ⚡ Quick Start

### 1. Prerequisites
* [Clarinet](https://github.com/hirosystems/clarinet)
* Node.js & NPM
* Hiro Wallet Extension

### 2. Contract Setup (Local Dev)
```bash
# Clone the repo
git clone [https://github.com/yourusername/fundx.git](https://github.com/yourusername/fundx.git)
cd fundx

# Run local chain & deploy contracts
clarinet integrate
