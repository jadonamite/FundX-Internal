# FundX — TODO (prioritized)

Derived from a full source read + live Hiro mainnet verification. Highest-impact first.

## P0 — broken against mainnet

- [ ] **`get-campaign-count` missing on deployed `indiegogo-v2`.** Live call returns
      `UndefinedFunction("get-campaign-count")`. The frontend relies on it, so Explore,
      Dashboard, and create-page ID prediction throw on mainnet.
      Fix options:
      1. Read the `campaign-count` **data-var** directly (`/v2/data_var/SP6X0M….indiegogo-v2/campaign-count`) — no redeploy; or
      2. Redeploy `indiegogo` (it adds the accessor); or
      3. Switch the frontend to `fundx-escrow-v2`, which already has `get-nonce`.
- [ ] **Paginate / index enumeration.** `campaign-count` is **9,907**. The current
      unbatched `fetchAllCampaigns` fan-out (~2 reads × count) is non-viable. Add
      pagination or an off-chain indexer regardless of how the count is read.

## P1 — token: mock → real USDC

- [ ] **Replace mock `usdcx-v2` with aeUSDC.** Target:
      `SP3Y2ZSH8P7D50B0VBTSX11S7XSG24M1VB9YFQA4K.token-aeusdc` (Allbridge-bridged USDC,
      **6 decimals — same as the mock, so no amount-math changes**).
      Migration (minimal, no escrow redeploy):
      1. As `CONTRACT-OWNER`, call `indiegogo-v2.set-allowed-token(…token-aeusdc, true)`.
      2. In `src/lib/stacks-config.ts`, point `USDCX_CONTRACT_ADDRESS`/`USDCX_CONTRACT_NAME`
         at the aeUSDC contract and add `"token-aeusdc": "aeUSDC"` to `TOKEN_ASSET_NAMES`
         (the donate post-condition needs the `aeUSDC` asset name). Keep decimals = 6.
      3. New campaigns settle in aeUSDC; legacy mock campaigns are filtered as legacy.
      - Note: there is **no native Circle/CCTP USDC** on Stacks; aeUSDC is the de-facto USDC.
        Update any "Circle / CCTP" wording in `FundXDocs.md` accordingly.

## P2 — correctness / cleanup

- [ ] **Decide the canonical escrow.** `fundx-escrow-v2` is cleaner (working `get-nonce`,
      `map-delete` refund cleanup, tuple data model). Either adopt it (redeploy pointed at
      aeUSDC) or redeploy `indiegogo` with the accessor — see `ARCHITECTURE.md` §3.
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
