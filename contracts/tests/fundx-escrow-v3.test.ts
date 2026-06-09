import { describe, expect, it, beforeEach } from "vitest";
import { Cl } from "@stacks/transactions";

const accounts = simnet.getAccounts();
const deployer = accounts.get("deployer")!;
const wallet1 = accounts.get("wallet_1")!;
const wallet2 = accounts.get("wallet_2")!;
const wallet3 = accounts.get("wallet_3")!;

const CONTRACT = "fundx-escrow-v3";
const TOKEN = "usdcx-v2";
const TOKEN_FQN = `${deployer}.${TOKEN}`;

const FLEXIBLE = Cl.uint(0);
const ALL_OR_NOTHING = Cl.uint(1);
const ONE_USDC = 1_000_000n;
const TOKEN_CV = Cl.contractPrincipal(deployer, TOKEN);

function mintTokens(recipient: string, amount: bigint) {
  return simnet.callPublicFn(TOKEN, "mint", [Cl.uint(amount), Cl.principal(recipient)], deployer);
}
function createCampaign(caller: string, goal: bigint, duration: number, model: typeof FLEXIBLE) {
  return simnet.callPublicFn(CONTRACT, "create-campaign", [TOKEN_CV, Cl.uint(goal), Cl.uint(duration), model], caller);
}
function donate(caller: string, id: number, amount: bigint) {
  return simnet.callPublicFn(CONTRACT, "donate", [TOKEN_CV, Cl.uint(id), Cl.uint(amount)], caller);
}
function withdraw(caller: string, id: number) {
  return simnet.callPublicFn(CONTRACT, "withdraw", [TOKEN_CV, Cl.uint(id)], caller);
}
function claimRefund(caller: string, id: number) {
  return simnet.callPublicFn(CONTRACT, "claim-refund", [TOKEN_CV, Cl.uint(id)], caller);
}

beforeEach(() => {
  simnet.callPublicFn(CONTRACT, "set-allowed-token", [Cl.principal(TOKEN_FQN), Cl.bool(true)], deployer);
  mintTokens(wallet1, ONE_USDC * 10000n);
  mintTokens(wallet2, ONE_USDC * 10000n);
  mintTokens(wallet3, ONE_USDC * 10000n);
});

describe("enumeration accessors", () => {
  it("get-campaign-count starts at 0 and increments", () => {
    expect(simnet.callReadOnlyFn(CONTRACT, "get-campaign-count", [], wallet1).result).toBeUint(0);
    createCampaign(wallet1, ONE_USDC * 1000n, 100, FLEXIBLE);
    expect(simnet.callReadOnlyFn(CONTRACT, "get-campaign-count", [], wallet1).result).toBeUint(1);
  });
  it("get-nonce mirrors get-campaign-count (escrow API parity)", () => {
    createCampaign(wallet1, ONE_USDC * 1000n, 100, FLEXIBLE);
    expect(simnet.callReadOnlyFn(CONTRACT, "get-nonce", [], wallet1).result).toBeUint(1);
  });
  it("is-token-allowed reflects the allowlist", () => {
    expect(simnet.callReadOnlyFn(CONTRACT, "is-token-allowed", [Cl.principal(TOKEN_FQN)], wallet1).result).toBeBool(true);
    expect(simnet.callReadOnlyFn(CONTRACT, "is-token-allowed", [Cl.principal(`${deployer}.nope`)], wallet1).result).toBeBool(false);
  });
});

describe("create-campaign", () => {
  it("creates a campaign and returns id 1", () => {
    expect(createCampaign(wallet1, ONE_USDC * 1000n, 100, FLEXIBLE).result).toBeOk(Cl.uint(1));
  });
  it("increments id on each creation", () => {
    createCampaign(wallet1, ONE_USDC * 1000n, 100, FLEXIBLE);
    expect(createCampaign(wallet2, ONE_USDC * 500n, 50, ALL_OR_NOTHING).result).toBeOk(Cl.uint(2));
  });
  it("stores creator, token, goal", () => {
    createCampaign(wallet1, ONE_USDC * 1000n, 100, FLEXIBLE);
    const { result } = simnet.callReadOnlyFn(CONTRACT, "get-campaign", [Cl.uint(1)], wallet1);
    expect(result).toBeSome(Cl.tuple({
      creator: Cl.principal(wallet1),
      token: Cl.principal(TOKEN_FQN),
      goal: Cl.uint(ONE_USDC * 1000n),
      deadline: Cl.uint(simnet.blockHeight + 99),
      "total-raised": Cl.uint(0),
      withdrawn: Cl.bool(false),
      active: Cl.bool(true),
      "funding-model": Cl.uint(0),
    }));
  });
  it("rejects goal of 0", () => { expect(createCampaign(wallet1, 0n, 100, FLEXIBLE).result).toBeErr(Cl.uint(107)); });
  it("rejects duration of 0", () => { expect(createCampaign(wallet1, ONE_USDC * 1000n, 0, FLEXIBLE).result).toBeErr(Cl.uint(107)); });
  it("rejects invalid funding model", () => {
    const { result } = simnet.callPublicFn(CONTRACT, "create-campaign", [TOKEN_CV, Cl.uint(ONE_USDC * 1000n), Cl.uint(100), Cl.uint(99)], wallet1);
    expect(result).toBeErr(Cl.uint(113));
  });
  it("rejects token not on allowlist", () => {
    simnet.callPublicFn(CONTRACT, "set-allowed-token", [Cl.principal(TOKEN_FQN), Cl.bool(false)], deployer);
    expect(createCampaign(wallet1, ONE_USDC * 1000n, 100, FLEXIBLE).result).toBeErr(Cl.uint(112));
  });
});

describe("donate", () => {
  beforeEach(() => { createCampaign(wallet1, ONE_USDC * 1000n, 100, FLEXIBLE); });
  it("accepts a valid donation", () => { expect(donate(wallet2, 1, ONE_USDC * 100n).result).toBeOk(Cl.bool(true)); });
  it("accumulates from same donor", () => {
    donate(wallet2, 1, ONE_USDC * 50n); donate(wallet2, 1, ONE_USDC * 50n);
    expect(simnet.callReadOnlyFn(CONTRACT, "get-donation", [Cl.uint(1), Cl.principal(wallet2)], wallet2).result).toBeUint(ONE_USDC * 100n);
  });
  it("updates total-raised across donors", () => {
    donate(wallet2, 1, ONE_USDC * 200n); donate(wallet3, 1, ONE_USDC * 300n);
    const c = simnet.callReadOnlyFn(CONTRACT, "get-campaign", [Cl.uint(1)], wallet1).result.value.value as any;
    expect(c["total-raised"]).toEqual(Cl.uint(ONE_USDC * 500n));
  });
  it("allows raising beyond goal (no cap)", () => {
    expect(donate(wallet2, 1, ONE_USDC * 5000n).result).toBeOk(Cl.bool(true));
  });
  it("rejects 0", () => { expect(donate(wallet2, 1, 0n).result).toBeErr(Cl.uint(107)); });
  it("rejects nonexistent campaign", () => { expect(donate(wallet2, 999, ONE_USDC * 100n).result).toBeErr(Cl.uint(100)); });
  it("rejects after deadline", () => { simnet.mineEmptyBlocks(101); expect(donate(wallet2, 1, ONE_USDC * 100n).result).toBeErr(Cl.uint(103)); });
  it("rejects on inactive campaign", () => {
    simnet.callPublicFn(CONTRACT, "deactivate-campaign", [Cl.uint(1)], deployer);
    expect(donate(wallet2, 1, ONE_USDC * 100n).result).toBeErr(Cl.uint(102));
  });
});

describe("withdraw", () => {
  it("flexible: withdraws after deadline below goal", () => {
    createCampaign(wallet1, ONE_USDC * 1000n, 10, FLEXIBLE); donate(wallet2, 1, ONE_USDC * 50n); simnet.mineEmptyBlocks(11);
    expect(withdraw(wallet1, 1).result).toBeOk(Cl.bool(true));
  });
  it("all-or-nothing: withdraws when goal reached", () => {
    createCampaign(wallet1, ONE_USDC * 100n, 10, ALL_OR_NOTHING); donate(wallet2, 1, ONE_USDC * 100n); simnet.mineEmptyBlocks(11);
    expect(withdraw(wallet1, 1).result).toBeOk(Cl.bool(true));
  });
  it("all-or-nothing: blocked when goal not reached", () => {
    createCampaign(wallet1, ONE_USDC * 1000n, 10, ALL_OR_NOTHING); donate(wallet2, 1, ONE_USDC * 50n); simnet.mineEmptyBlocks(11);
    expect(withdraw(wallet1, 1).result).toBeErr(Cl.uint(105));
  });
  it("rejects before deadline", () => {
    createCampaign(wallet1, ONE_USDC * 100n, 100, FLEXIBLE); donate(wallet2, 1, ONE_USDC * 100n);
    expect(withdraw(wallet1, 1).result).toBeErr(Cl.uint(104));
  });
  it("rejects double withdraw", () => {
    createCampaign(wallet1, ONE_USDC * 100n, 10, FLEXIBLE); donate(wallet2, 1, ONE_USDC * 100n); simnet.mineEmptyBlocks(11);
    withdraw(wallet1, 1); expect(withdraw(wallet1, 1).result).toBeErr(Cl.uint(106));
  });
  it("rejects non-creator", () => {
    createCampaign(wallet1, ONE_USDC * 100n, 10, FLEXIBLE); donate(wallet2, 1, ONE_USDC * 100n); simnet.mineEmptyBlocks(11);
    expect(withdraw(wallet2, 1).result).toBeErr(Cl.uint(101));
  });
  it("fee split: 2% platform / 98% creator", () => {
    createCampaign(wallet1, ONE_USDC * 1000n, 10, FLEXIBLE); donate(wallet2, 1, ONE_USDC * 1000n); simnet.mineEmptyBlocks(11);
    const cBefore = BigInt((simnet.callReadOnlyFn(TOKEN, "get-balance", [Cl.principal(wallet1)], wallet1).result as any).value.value);
    const pBefore = BigInt((simnet.callReadOnlyFn(TOKEN, "get-balance", [Cl.principal(deployer)], deployer).result as any).value.value);
    withdraw(wallet1, 1);
    const cAfter = BigInt((simnet.callReadOnlyFn(TOKEN, "get-balance", [Cl.principal(wallet1)], wallet1).result as any).value.value);
    const pAfter = BigInt((simnet.callReadOnlyFn(TOKEN, "get-balance", [Cl.principal(deployer)], deployer).result as any).value.value);
    const raised = ONE_USDC * 1000n; const fee = (raised * 200n) / 10000n;
    expect(cAfter - cBefore).toBe(raised - fee);
    expect(pAfter - pBefore).toBe(fee);
  });
});

describe("claim-refund", () => {
  beforeEach(() => { createCampaign(wallet1, ONE_USDC * 1000n, 10, ALL_OR_NOTHING); donate(wallet2, 1, ONE_USDC * 100n); });
  it("full refund when goal missed", () => { simnet.mineEmptyBlocks(11); expect(claimRefund(wallet2, 1).result).toBeOk(Cl.uint(ONE_USDC * 100n)); });
  it("record deleted -> get-donation returns 0", () => {
    simnet.mineEmptyBlocks(11); claimRefund(wallet2, 1);
    expect(simnet.callReadOnlyFn(CONTRACT, "get-donation", [Cl.uint(1), Cl.principal(wallet2)], wallet2).result).toBeUint(0);
  });
  it("double-claim blocked (ERR-NOT-DONOR u109)", () => {
    simnet.mineEmptyBlocks(11); claimRefund(wallet2, 1);
    expect(claimRefund(wallet2, 1).result).toBeErr(Cl.uint(109));
  });
  it("rejects on flexible (ERR-REFUND-NOT-ALLOWED u108)", () => {
    createCampaign(wallet1, ONE_USDC * 1000n, 10, FLEXIBLE); donate(wallet2, 2, ONE_USDC * 100n); simnet.mineEmptyBlocks(11);
    expect(claimRefund(wallet2, 2).result).toBeErr(Cl.uint(108));
  });
  it("rejects before deadline (ERR-STILL-ACTIVE u104)", () => { expect(claimRefund(wallet2, 1).result).toBeErr(Cl.uint(104)); });
  it("rejects when goal reached (ERR-REFUND-NOT-ALLOWED u108)", () => {
    createCampaign(wallet1, ONE_USDC * 100n, 10, ALL_OR_NOTHING); donate(wallet2, 2, ONE_USDC * 100n); simnet.mineEmptyBlocks(11);
    expect(claimRefund(wallet2, 2).result).toBeErr(Cl.uint(108));
  });
  it("rejects non-donor (ERR-NOT-DONOR u109)", () => { simnet.mineEmptyBlocks(11); expect(claimRefund(wallet3, 1).result).toBeErr(Cl.uint(109)); });
});

describe("admin", () => {
  beforeEach(() => { createCampaign(wallet1, ONE_USDC * 1000n, 100, FLEXIBLE); });
  it("owner deactivates", () => { expect(simnet.callPublicFn(CONTRACT, "deactivate-campaign", [Cl.uint(1)], deployer).result).toBeOk(Cl.bool(true)); });
  it("deactivate blocks donations", () => {
    simnet.callPublicFn(CONTRACT, "deactivate-campaign", [Cl.uint(1)], deployer);
    expect(donate(wallet2, 1, ONE_USDC * 100n).result).toBeErr(Cl.uint(102));
  });
  it("non-owner cannot deactivate", () => { expect(simnet.callPublicFn(CONTRACT, "deactivate-campaign", [Cl.uint(1)], wallet1).result).toBeErr(Cl.uint(111)); });
  it("owner allowlists token", () => { expect(simnet.callPublicFn(CONTRACT, "set-allowed-token", [Cl.principal(TOKEN_FQN), Cl.bool(true)], deployer).result).toBeOk(Cl.bool(true)); });
  it("non-owner cannot allowlist", () => { expect(simnet.callPublicFn(CONTRACT, "set-allowed-token", [Cl.principal(TOKEN_FQN), Cl.bool(true)], wallet1).result).toBeErr(Cl.uint(111)); });
});
