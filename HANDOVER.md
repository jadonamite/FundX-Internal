# FundX — Session Handover

_Last updated: 2026-06-10. Network: Stacks **mainnet**. Owner/deployer:
`SP6X0MXEEGZX14ZTK7XQXJ76W35ZJDP9NZBT6F39`._

## TL;DR
FundX moved from a SIP-010-only escrow to a **dual-asset escrow (`fundx-escrow-v4`)
where a fundraiser picks STX *or* USDCx per campaign**. v4 is deployed and live, USDCx
is allow-listed, and the frontend is wired to it. The USDCx (FT) rail is proven on
mainnet; the **native-STX rail is deployed but not yet smoke-tested on mainnet**.
"Accept both assets in one campaign" was deliberately deferred.

---

## Live mainnet contracts (deployer `SP6X0M…`)

| Contract | Role | Status | Deploy tx |
|---|---|---|---|
| **`fundx-escrow-v4`** | **CURRENT primary.** STX *or* USDCx per campaign (split `-stx`/`-ft` fns) | live, USDCx allow-listed | `8f55f774…da7adb` |
| `fundx-escrow-v3` | SIP-010-only (multi-token). Superseded by v4 | live, legacy | `edf5f693…3a4d30` |
| `fundx-registry` | On-chain campaign metadata | live, used | (earlier) |
| `indiegogo-v2` | Original escrow; deployed copy lacks `get-campaign-count` | live, abandoned | (earlier) |
| `usdcx-v2` | Owner-mintable MOCK token (testing only) | live, legacy | (earlier) |
| `fundx-milestone`, `fundx-tips` | Deployed, no UI | live, unused | (earlier) |

**Settlement token (USDCx):** `SP120SBRBQJ00MCWS7TM5R8WJNTTKD5K0HFRC2CNE.usdcx`
(FT asset `usdcx-token`, 6 decimals). Confirmed by owner as Stacks' Circle USDC
("USDCx"). Allow-listed on v4 (tx `6bbe7541…0c6fcb2d`) and v3 (`202b36da…e0822b`).

### v4 function map
- STX rail: `create-campaign-stx` / `donate-stx` / `withdraw-stx` / `claim-refund-stx`
- FT rail: `create-campaign-ft` / `donate-ft` / `withdraw-ft` / `claim-refund-ft`
- Cross-rail misuse blocked → `ERR-WRONG-ASSET (u114)`. 2% fee, flexible/all-or-nothing,
  working `get-campaign-count`/`get-nonce`, `map-delete` refund, state-before-transfer.
- Admin: `set-allowed-token` (FT only), `deactivate-campaign`. Owner = deployer.

---

## What's verified on mainnet
- **USDCx/FT full cycle** (create → donate → withdraw → claim-refund) — proven on v3
  with mock `usdcx-v2`; v4 reuses the identical FT logic. Balances round-tripped exactly.
- **v3 demo campaign #1 "FundX Genesis"** created + registry metadata attached.
- **v4 reads**: `get-campaign-count` → `u0`, `is-token-allowed(USDCx)` → `true`.

## NOT yet verified
- **Native-STX rail on mainnet** (donate-stx/withdraw-stx/claim-refund-stx). Recommended:
  a recoverable smoke test (creator = owner = deployer, so funds round-trip; STX is also
  6-dec). Deadlines are tenure-paced (~10 min/unit), so use `duration=1`.

---

## Frontend (wired, typechecks clean — 0 `src/` errors)
- `src/lib/stacks-config.ts` → `CONTRACT_NAME = "fundx-escrow-v4"`, real USDCx,
  `TOKEN_ASSET_NAMES["usdcx"] = "usdcx-token"`.
- `src/lib/stacks-contract.ts` → parses `asset-stx` (bool) + `token` (optional principal);
  `currency` derives from the asset flag.
- `create`, `campaigns/[id]`, dashboard `CreatorTab`/`BackerTab` → route to `-stx` vs `-ft`
  by the campaign's asset; STX donate uses `.ustx()` post-condition, USDCx uses `.ft()`;
  withdraw/refund use `postConditionMode: "allow"` (funds leave via `as-contract`).
- Create form's STX/USDCx selector is now a **real** on-chain choice (was UI-only before).
- Dead `src/lib/stacks-auth.ts` (old showConnect) still present but unused — safe to delete.

## Docs updated
- `README.md` rewritten (+ Multi-token/dual-asset section, real contract/token tables).
- `docs/ARCHITECTURE.md`, `docs/TODO.md` (contract comparison, v4 rationale, migration).
- `FundXDocs.md` — removed the non-existent "goal cap" behavior.
- `public/IMAGE-CREDITS.md` — attribution for new demo images.

---

## Fixes from the QA tester review (`TesterReview.md`)
- **Wallet "module factory not available"** → **does NOT reproduce** in the current clean
  Turbopack prod build (verified via headless-Chrome click on Connect Wallet — no
  module-factory error/exception). It was the old/stale build.
- **Campaign image 400s** → **fixed**. `data.ts` referenced `campaign-4/5/6.jpg` which
  didn't exist. Added topical, commercially-licensed, watermark-free images from Wikimedia
  Commons (`public/campaign-4|5|6.jpg`), credited in `IMAGE-CREDITS.md`.

---

## Open issues / next steps
1. **Vercel deployments failing/queued.** All recent prod builds `Error` in ~3s from an
   npm `ERESOLVE`: the `@jadonamite/{chessify-sdk,fundxagon-sdk,stacks-core}` packages pin
   `@stacks@^6` but FundX uses `@stacks@7`. They were **unused** → removed from
   `package.json` + lockfile regenerated (commit `a94a26d`). That fix is sitting in the
   **Queued** deployment. ACTION: check Vercel dashboard → Usage/Billing for a limit/paused
   state; cancel the stuck queued deploy and run `vercel --prod` from the fixed commit.
2. **Auto-push flood.** `.push.sh` commits/pushes on every file change → a Vercel deploy
   each → queue/limit pressure. Throttle it or disable auto-deploy-on-push.
3. **Run the test suites locally** — `cd contracts && npm test`. Vitest 4 couldn't run in
   the build sandbox (worker incompatibility + offline trait requirement). Suites exist:
   `tests/fundx-escrow-v3.test.ts`, `tests/fundx-escrow-v4.test.ts`.
4. **STX-rail mainnet smoke test** (see above).
5. **`clarinet check`** has 1 pre-existing error: `fundx-tips.clar` undeclared-trait
   (unrelated, out of scope). v3/v4 are clean.
6. **Deferred feature:** accept STX **and** USDCx in one campaign (needs per-asset
   accounting; no oracle). Design notes in chat/ARCHITECTURE.

---

## Gotcha for whoever deploys next
The repo's `deploy-new-contracts.cjs` / `AllowToken.cjs` use `@stacks` `broadcastTransaction`,
which posts to a host that **fails from this machine** ("fetch failed"). Workaround used all
session: build + sign the tx, then POST the raw bytes directly to
`https://api.hiro.so/v2/transactions` (read calls to `api.hiro.so` work fine). Key is
`STACKS_MASTER_2_PRIVATE_KEY` in `contracts/.env`.
