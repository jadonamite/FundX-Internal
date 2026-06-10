import { describe, expect, it, beforeEach } from "vitest";
import { Cl } from "@stacks/transactions";

const accounts = simnet.getAccounts();
const deployer = accounts.get("deployer")!;
const w1 = accounts.get("wallet_1")!;
const w2 = accounts.get("wallet_2")!;
const C = "fundx-escrow-v4";
const TOKEN = "usdcx-v2";
const TOKEN_FQN = `${deployer}.${TOKEN}`;
const TOKEN_CV = Cl.contractPrincipal(deployer, TOKEN);
const U = 1_000_000n;
const FLEX = Cl.uint(0), AON = Cl.uint(1);

function mint(to: string, amt: bigint) { return simnet.callPublicFn(TOKEN, "mint", [Cl.uint(amt), Cl.principal(to)], deployer); }

beforeEach(() => {
  simnet.callPublicFn(C, "set-allowed-token", [Cl.principal(TOKEN_FQN), Cl.bool(true)], deployer);
  mint(w1, U * 10000n); mint(w2, U * 10000n);
});

describe("STX rail", () => {
  it("create-stx -> donate-stx -> withdraw-stx (flexible)", () => {
    expect(simnet.callPublicFn(C, "create-campaign-stx", [Cl.uint(U * 10n), Cl.uint(5), FLEX], w1).result).toBeOk(Cl.uint(1));
    expect(simnet.callPublicFn(C, "donate-stx", [Cl.uint(1), Cl.uint(U * 5n)], w2).result).toBeOk(Cl.bool(true));
    expect(simnet.callReadOnlyFn(C, "get-donation", [Cl.uint(1), Cl.principal(w2)], w2).result).toBeUint(U * 5n);
    simnet.mineEmptyBlocks(6);
    expect(simnet.callPublicFn(C, "withdraw-stx", [Cl.uint(1)], w1).result).toBeOk(Cl.bool(true));
  });
  it("all-or-nothing STX refund when goal missed", () => {
    simnet.callPublicFn(C, "create-campaign-stx", [Cl.uint(U * 1000n), Cl.uint(5), AON], w1);
    simnet.callPublicFn(C, "donate-stx", [Cl.uint(1), Cl.uint(U * 5n)], w2);
    simnet.mineEmptyBlocks(6);
    expect(simnet.callPublicFn(C, "claim-refund-stx", [Cl.uint(1)], w2).result).toBeOk(Cl.uint(U * 5n));
    expect(simnet.callReadOnlyFn(C, "get-donation", [Cl.uint(1), Cl.principal(w2)], w2).result).toBeUint(0);
  });
  it("get-campaign marks asset-stx true, token none", () => {
    simnet.callPublicFn(C, "create-campaign-stx", [Cl.uint(U * 10n), Cl.uint(5), FLEX], w1);
    const c = simnet.callReadOnlyFn(C, "get-campaign", [Cl.uint(1)], w1).result.value.value as any;
    expect(c["asset-stx"]).toEqual(Cl.bool(true));
    expect(c["token"]).toEqual(Cl.none());
  });
});

describe("FT (USDCx) rail", () => {
  it("create-ft -> donate-ft -> withdraw-ft (flexible)", () => {
    expect(simnet.callPublicFn(C, "create-campaign-ft", [TOKEN_CV, Cl.uint(U * 10n), Cl.uint(5), FLEX], w1).result).toBeOk(Cl.uint(1));
    expect(simnet.callPublicFn(C, "donate-ft", [TOKEN_CV, Cl.uint(1), Cl.uint(U * 5n)], w2).result).toBeOk(Cl.bool(true));
    simnet.mineEmptyBlocks(6);
    expect(simnet.callPublicFn(C, "withdraw-ft", [TOKEN_CV, Cl.uint(1)], w1).result).toBeOk(Cl.bool(true));
  });
  it("create-ft rejects non-allowlisted token", () => {
    simnet.callPublicFn(C, "set-allowed-token", [Cl.principal(TOKEN_FQN), Cl.bool(false)], deployer);
    expect(simnet.callPublicFn(C, "create-campaign-ft", [TOKEN_CV, Cl.uint(U * 10n), Cl.uint(5), FLEX], w1).result).toBeErr(Cl.uint(112));
  });
  it("all-or-nothing FT refund when goal missed", () => {
    simnet.callPublicFn(C, "create-campaign-ft", [TOKEN_CV, Cl.uint(U * 1000n), Cl.uint(5), AON], w1);
    simnet.callPublicFn(C, "donate-ft", [TOKEN_CV, Cl.uint(1), Cl.uint(U * 5n)], w2);
    simnet.mineEmptyBlocks(6);
    expect(simnet.callPublicFn(C, "claim-refund-ft", [TOKEN_CV, Cl.uint(1)], w2).result).toBeOk(Cl.uint(U * 5n));
  });
});

describe("asset guards (cross-rail misuse blocked)", () => {
  it("donate-stx on an FT campaign -> ERR-WRONG-ASSET u114", () => {
    simnet.callPublicFn(C, "create-campaign-ft", [TOKEN_CV, Cl.uint(U * 10n), Cl.uint(5), FLEX], w1);
    expect(simnet.callPublicFn(C, "donate-stx", [Cl.uint(1), Cl.uint(U * 5n)], w2).result).toBeErr(Cl.uint(114));
  });
  it("donate-ft on a STX campaign -> ERR-WRONG-ASSET u114", () => {
    simnet.callPublicFn(C, "create-campaign-stx", [Cl.uint(U * 10n), Cl.uint(5), FLEX], w1);
    expect(simnet.callPublicFn(C, "donate-ft", [TOKEN_CV, Cl.uint(1), Cl.uint(U * 5n)], w2).result).toBeErr(Cl.uint(114));
  });
  it("withdraw-stx on FT campaign -> ERR-WRONG-ASSET u114", () => {
    simnet.callPublicFn(C, "create-campaign-ft", [TOKEN_CV, Cl.uint(U * 10n), Cl.uint(2), FLEX], w1);
    simnet.mineEmptyBlocks(3);
    expect(simnet.callPublicFn(C, "withdraw-stx", [Cl.uint(1)], w1).result).toBeErr(Cl.uint(114));
  });
});
