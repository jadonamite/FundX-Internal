# FundX — Repo Structure (overview)

_Top-level: frontend + Clarity contracts. Regenerated 2026-06-14. For the detailed frontend tree see structure.md._

```
./
├── contracts/
│   ├── contracts/
│   │   ├── archive/
│   │   ├── FundX.clar
│   │   ├── fundx-escrow.clar
│   │   ├── fundx-escrow-v3.clar
│   │   ├── fundx-escrow-v4.clar
│   │   ├── fundx-milestone.clar
│   │   ├── fundx-registry.clar
│   │   ├── fundx-tips.clar
│   │   ├── indiegogo.clar
│   │   ├── sip-010-trait-ft-standard.clar
│   │   └── usdcx-mock.clar
│   ├── deployments/
│   │   ├── default.mainnet-plan.yaml
│   │   ├── default.simnet-plan.yaml
│   │   └── default.testnet-plan.yaml
│   ├── settings/
│   │   ├── Devnet.toml
│   │   ├── Mainnet.toml
│   │   └── Testnet.toml
│   ├── tests/
│   │   ├── fundx-escrow-v3.test.ts
│   │   ├── fundx-escrow-v4.test.ts
│   │   └── FundX.test.ts
│   ├── AllowToken.cjs
│   ├── Clarinet.toml
│   ├── deploy-new-contracts.cjs
│   ├── find-owner.cjs
│   ├── FundTalos.cjs
│   ├── package.json
│   ├── package-lock.json
│   ├── resume-cycle.cjs
│   ├── run-cycle.cjs
│   ├── test-address.cjs
│   ├── test-new-contracts.cjs
│   ├── tsconfig.json
│   └── vitest.config.ts
├── docs/
│   ├── ARCHITECTURE.md
│   └── TODO.md
├── public/
│   ├── Asset 4_093214.svg
│   ├── bitcoin-btc-logo.svg
│   ├── bitcoin.svg
│   ├── campaign-1.jpg
│   ├── campaign-2.jpg
│   ├── campaign-3.jpg
│   ├── campaign-4.jpg
│   ├── campaign-5.jpg
│   ├── campaign-6.jpg
│   ├── Dummy.jpg
│   ├── favicon.ico
│   ├── globe.svg
│   ├── image copy.png
│   ├── IMAGE-CREDITS.md
│   ├── image.png
│   ├── _.jpeg
│   ├── last_093213.svg
│   ├── Logo(1).png
│   ├── LogoFrame.svg
│   ├── Logo.svg
│   ├── stacks.png
│   ├── thesis.md
│   └── window.svg
├── src/
│   ├── app/
│   │   ├── campaigns/
│   │   ├── create/
│   │   ├── dashboard/
│   │   ├── explore/
│   │   ├── favico.ico
│   │   ├── globals.css
│   │   ├── layout.tsx
│   │   └── page.tsx
│   ├── components/
│   │   ├── create/
│   │   ├── dashboard/
│   │   ├── fundx/
│   │   ├── ui/
│   │   └── Logo.tsx
│   └── lib/
│       ├── hooks/
│       ├── data.ts
│       ├── stacks-config.ts
│       ├── stacks-contract.ts
│       └── utils.ts
├── Another.md
├── components.json
├── dashboard.png
├── eslint.config.mjs
├── FundXDocs.md
├── HANDOVER.md
├── Helper.md
├── landing_page.png
├── next.config.ts
├── next-env.d.ts
├── package.json
├── package-lock.json
├── postcss.config.mjs
├── PROGRESS.md
├── README.md
├── Struct.md
├── structure.md
├── TesterReview.md
├── trials.md
├── tsconfig.json
└── whattofix.md

22 directories, 87 files
```
