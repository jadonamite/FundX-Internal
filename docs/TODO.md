# FundX — TODO

From a full source + tooling sweep (2026-06-15). Live contract: `fundx-escrow-v4`
(dual-asset STX **or** USDCx). Core contracts + USDCx flow work; the gaps below are real.

## P0 — broken tooling (blocks all verification)

- [ ] **Test suite never runs** — three stacked failures: (1) `.bin/vitest` is a dangling
      symlink → `npm install` rebuilds it; (2) `vitest@^4` is pinned but
      `vitest-environment-clarinet@3` needs vitest `^3` → forks worker won't start;
      (3) the trait error below aborts simnet init. Fix all three, then `npm test` runs the
      (already thorough) v4 suite.
- [ ] **`clarinet check` error** — legacy contracts (`fundx-escrow.clar`, `fundx-milestone`,
      `fundx-tips`) import the trait locally via `.sip-010-trait-v2.sip-010-trait`, which
      fails simnet analysis. Point them at the remote FQN
      `'SP3FBR2AGK5H9QBDH3EEN6DF8EK8JY7RX8QJ5SVTE.sip-010-trait-ft-standard.sip-010-trait`
      (as v3/v4 do), or drop the unused ones from `Clarinet.toml`. Deployed contracts are
      unaffected — this is local-only.
- [ ] **`next build` typecheck scope** — root `tsconfig.json` includes `**/*.ts` and only
      excludes `node_modules`, pulling `contracts/tests/*.ts` (38+ errors) into the app build.
      Add `contracts` to `exclude`. (`src/` itself is 0 errors.)

## P1 — correctness bugs

- [ ] **UI is asset-blind** — every label hardcodes "USDCx" even for STX campaigns
      (detail page lines 358/383/418/440/456/477/282; `formatMoney` in both dashboard tabs;
      donate input prefix). STX campaigns work on-chain but display the wrong currency.
      Derive the label from `campaign.currency`.
- [ ] **Create wizard drops most input** — collects creatorBio, email, github, portfolio,
      videoUrl, budgetBreakdown, roadmap, projectStage, location, but `register` persists only
      title/tagline/description/image/category/social (location hardcoded `""`). Either persist
      them (extend registry or off-chain store) or stop collecting them.

## P2 — mainnet verification

- [ ] **STX rail never exercised on mainnet** — smoke-test `donate-stx`/`withdraw-stx`/
      `claim-refund-stx` recoverably (creator = owner = deployer, `duration=1`). USDCx cycle
      already proven.

## P3 — deploy pipeline

- [ ] **Vercel deploys** — ERESOLVE fix (removed `@jadonamite/*` SDKs, commit `a94a26d`) is in a
      queued deploy. Check Usage/Billing, cancel the stuck queue, `vercel --prod`.
- [ ] **`.push.sh` auto-push** — commits + pushes to `main` on every file change. Throttle or
      gate it.

## P4 — cleanup

- [ ] Remove unused `reacts-cli` dependency from `package.json`.
- [ ] Decide on `indiegogo-v2` (missing `get-campaign-count`, `campaign-count` reads 9,907),
      `fundx-escrow.clar`, and `FundX.clar` — all dead/superseded. Archive or delete.

## Backlog — deployed, no UI

- [ ] `fundx-milestone` (3-tranche release) — build UI or move to roadmap.
- [ ] `fundx-tips` (tipping + reputation) — build UI or move to roadmap.

## Deferred

- [ ] Accept STX **and** USDCx in one campaign — needs per-asset accounting; no oracle.
</content>
