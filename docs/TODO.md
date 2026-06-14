# FundX — TODO (prioritized)

Reconciled against `HANDOVER.md` (2026-06-10) + live Hiro mainnet state. Highest-impact first.

## Done — escrow cutover (was P0/P1)

The old plan to cut over to `fundx-escrow-v3` has been **superseded**: the project moved to
**`fundx-escrow-v4`**, the dual-asset escrow where each campaign picks **STX *or* USDCx**.

- [x] `fundx-escrow-v4` deployed to mainnet (deployer `SP6X0MXEEGZX14ZTK7XQXJ76W35ZJDP9NZBT6F39`).
- [x] USDCx allow-listed on v4 (and legacy v3). Real token:
      `SP120SBRBQJ00MCWS7TM5R8WJNTTKD5K0HFRC2CNE.usdcx`, FT asset `usdcx-token`, 6 decimals.
- [x] Frontend wired to v4 (`stacks-config.ts` → `CONTRACT_NAME = "fundx-escrow-v4"`),
      typechecks clean, split `-stx`/`-ft` rails routed by the campaign's asset.
- [x] STX is now a **real on-chain choice** in the create form (was UI-only).

## P0 — verify the STX rail on mainnet

- [ ] **Smoke-test `donate-stx` / `withdraw-stx` / `claim-refund-stx` on mainnet.** Deployed
      but never exercised. Make it recoverable: creator = owner = deployer so funds round-trip;
      use `duration=1` (deadlines are tenure-paced, ~10 min/unit). STX is 6-dec like USDCx.
- [ ] **Run the simnet suites locally** — `cd contracts && npm test`
      (`tests/fundx-escrow-v3.test.ts`, `tests/fundx-escrow-v4.test.ts`). Couldn't run in the
      CI sandbox (vitest 4 ↔ clarinet-sdk worker + offline trait requirement).

## P1 — deploy pipeline

- [ ] **Vercel deploys failing/queued.** Root cause (unused `@jadonamite/*` SDKs pinning
      `@stacks@^6` vs FundX's `@stacks@7`, an `ERESOLVE`) was fixed by removing them
      (commit `a94a26d`); fix is sitting in a queued deploy. Check Vercel Usage/Billing for a
      paused/limit state, cancel the stuck queued deploy, run `vercel --prod` from the fix.
- [ ] **Throttle the auto-push flood.** `.push.sh` commits + pushes on every file change →
      a Vercel deploy each → queue/limit pressure. Throttle or disable auto-deploy-on-push.

## P2 — correctness / cleanup

- [x] ~~Wire or scope STX~~ — wired in v4.
- [x] ~~Delete dead `src/lib/stacks-auth.ts`~~ — removed.

## P3 — docs hygiene

- [x] ~~Fix the Circle/CCTP wording in `FundXDocs.md`~~ — done (USDCx is the Stacks-native
      `…usdcx` token, not a Circle CCTP mint).
- [x] ~~Fix or retire `contracts/deployments/FUNDX-GUIDE.md`~~ — retired (documented the old
      `fundx-escrow`, 3-arg create, and a non-existent token).
- [x] ~~Regenerate `structure.md` / `Struct.md`~~ — done.
- [x] ~~Update `PROGRESS.md`~~ — now reflects v4, real USDCx, and `waitForTx` polling.
- [ ] `clarinet check` has 1 pre-existing error: `fundx-tips.clar` undeclared-trait
      (unrelated to v3/v4, which are clean).

## Backlog — deployed but unwired features

- [ ] `fundx-milestone` (3-tranche release) — build UI or move to roadmap.
- [ ] `fundx-tips` (direct tipping + reputation) — build UI or move to roadmap.

## Deferred

- [ ] Accept STX **and** USDCx in a single campaign — needs per-asset accounting; no oracle.
</content>
</invoke>
