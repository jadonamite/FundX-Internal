# FundX — TODO (prioritized)

Derived from a full source read + live Hiro mainnet verification. Highest-impact first.

## P0 — deploy & cut over to fundx-escrow-v3 (in progress)

The best-of-both-worlds escrow `fundx-escrow-v3.clar` is written, `clarinet check`-clean,
and the frontend (`stacks-config.ts`) is already pointed at it + real USDCx. Remaining:

- [ ] **Deploy `fundx-escrow-v3` to mainnet** (sender `SP6X0MXEEGZX14ZTK7XQXJ76W35ZJDP9NZBT6F39`).
      A v3 entry has been added to `deploy-new-contracts.cjs`. **Needs the deployer key
      (`.env`) and real STX — irreversible, requires owner action.**
- [ ] **Allow-list USDCx on v3** — as `CONTRACT-OWNER` call
      `set-allowed-token('SP120SBRBQJ00MCWS7TM5R8WJNTTKD5K0HFRC2CNE.usdcx, true)` (one tx).
- [ ] **Run the simnet suite locally** — `cd contracts && npm test` (vitest config restored).
      Could not execute in CI sandbox (vitest 4 ↔ clarinet-sdk worker + offline trait requirement).
- [ ] A fresh v3 deploy starts at `campaign-count = 0`, which **sidesteps** the old
      `indiegogo-v2` problems below (no missing accessor, no 9,907-row fan-out).

### Background — why the old `indiegogo-v2` is being replaced
- Deployed `indiegogo-v2` is **missing `get-campaign-count`** (live call returns
  `UndefinedFunction`), so the frontend's enumeration throws against it.
- Its `campaign-count` data-var reads **9,907**, making the unbatched `fetchAllCampaigns`
  fan-out non-viable. (If you ever keep `indiegogo-v2`, paginate/index it.)

## P1 — real USDCx (done in config, pending on-chain)

- [x] Identify the real token: **USDCx** `SP120SBRBQJ00MCWS7TM5R8WJNTTKD5K0HFRC2CNE.usdcx`,
      FT asset `usdcx-token`, **6 decimals** (same as the mock → no amount-math changes).
- [x] `src/lib/stacks-config.ts` updated: `USDCX_CONTRACT_ADDRESS/NAME` → real USDCx,
      `TOKEN_ASSET_NAMES["usdcx"] = "usdcx-token"`.
- [ ] On-chain: allow-list it on v3 (see P0).
- [ ] Update the "Circle / CCTP" wording in `FundXDocs.md` — USDCx here is the mainnet
      `…usdcx` token, not a Circle-native CCTP mint.

## P2 — correctness / cleanup

- [ ] **Wire or scope STX.** The create form offers STX but the code always submits USDCx.
      Either wire a wrapped SIP-010 STX or remove the option from the form.
- [ ] **Delete dead code** — `src/lib/stacks-auth.ts` is imported nowhere
      (`StacksProvider` uses the modern `@stacks/connect` API).

## P3 — docs hygiene

- [ ] Fix or retire `contracts/deployments/FUNDX-GUIDE.md` — it documents `fundx-escrow`
      (3-arg create, USDCx-only) and a non-existent token `SP2C2YFP…usdcx`, not the live contract.
- [ ] Regenerate `structure.md` / `Struct.md` (file trees are outdated).
- [ ] Update `PROGRESS.md`: contract is `indiegogo-v2` (not `fundx-escrow-v2`); confirmation
      uses `waitForTx` polling (not `setTimeout(refetch, 8000)`).

## Backlog — deployed but unwired features

- [ ] `fundx-milestone` (3-tranche release) — build UI or move to roadmap.
- [ ] `fundx-tips` (direct tipping + reputation) — build UI or move to roadmap.
