import { describe, expect, it, beforeEach } from "vitest";
import { Cl } from "@stacks/transactions";

const accounts = simnet.getAccounts();
const deployer = accounts.get("deployer")!;
const wallet1 = accounts.get("wallet_1")!;
const wallet2 = accounts.get("wallet_2")!;
const wallet3 = accounts.get("wallet_3")!;

const CONTRACT = "indiegogo-v2";
const TOKEN = "usdcx-v2";
const TOKEN_FQN = `${deployer}.${TOKEN}`;

// Helpers
const FLEXIBLE = Cl.uint(0);
const ALL_OR_NOTHING = Cl.uint(1);
const ONE_USDC = 1_000_000n; // 1 USDCx in atomic units
const TOKEN_CV = Cl.contractPrincipal(deployer, TOKEN);

function mintTokens(recipient: string, amount: bigint) {
  return simnet.callPublicFn(TOKEN, "mint", [Cl.uint(amount), Cl.principal(recipient)], deployer);
}

function createCampaign(
  caller: string,
  goal: bigint,
  duration: number,
  model: typeof FLEXIBLE | typeof ALL_OR_NOTHING
) {
  return simnet.callPublicFn(
    CONTRACT,
    "create-campaign",
    [TOKEN_CV, Cl.uint(goal), Cl.uint(duration), model],
    caller
  );
}

function donate(caller: string, id: number, amount: bigint) {
  return simnet.callPublicFn(
    CONTRACT,
    "donate",
    [TOKEN_CV, Cl.uint(id), Cl.uint(amount)],
    caller
  );
}

function withdraw(caller: string, id: number) {
  return simnet.callPublicFn(CONTRACT, "withdraw", [TOKEN_CV, Cl.uint(id)], caller);
}

function claimRefund(caller: string, id: number) {
  return simnet.callPublicFn(CONTRACT, "claim-refund", [TOKEN_CV, Cl.uint(id)], caller);
}

// ─────────────────────────────────────────────────────────────
// SETUP: allow USDCx token and fund test wallets
// ─────────────────────────────────────────────────────────────
beforeEach(() => {
  simnet.callPublicFn(CONTRACT, "set-allowed-token", [Cl.principal(TOKEN_FQN), Cl.bool(true)], deployer);
  mintTokens(wallet1, ONE_USDC * 10000n);
  mintTokens(wallet2, ONE_USDC * 10000n);
  mintTokens(wallet3, ONE_USDC * 10000n);
});

// ─────────────────────────────────────────────────────────────
// create-campaign
// ─────────────────────────────────────────────────────────────
describe("create-campaign", () => {
  it("creates a campaign and returns id 1", () => {
    const { result } = createCampaign(wallet1, ONE_USDC * 1000n, 100, FLEXIBLE);
    expect(result).toBeOk(Cl.uint(1));
  });

  it("increments campaign count on each creation", () => {
    createCampaign(wallet1, ONE_USDC * 1000n, 100, FLEXIBLE);
    const { result } = createCampaign(wallet2, ONE_USDC * 500n, 50, ALL_OR_NOTHING);
    expect(result).toBeOk(Cl.uint(2));
  });

  it("stores correct creator and goal", () => {
    createCampaign(wallet1, ONE_USDC * 1000n, 100, FLEXIBLE);
    const { result } = simnet.callReadOnlyFn(CONTRACT, "get-campaign", [Cl.uint(1)], wallet1);
    expect(result).toBeSome(
      Cl.tuple({
        creator: Cl.principal(wallet1),
        token: Cl.principal(TOKEN_FQN),
        goal: Cl.uint(ONE_USDC * 1000n),
        "total-raised": Cl.uint(0),
        withdrawn: Cl.bool(false),
        active: Cl.bool(true),
        "funding-model": Cl.uint(0),
      })
    );
  });

  it("rejects goal of 0", () => {
    const { result } = createCampaign(wallet1, 0n, 100, FLEXIBLE);
    expect(result).toBeErr(Cl.uint(107)); // ERR-INVALID-AMOUNT
  });

  it("rejects duration of 0", () => {
    const { result } = createCampaign(wallet1, ONE_USDC * 1000n, 0, FLEXIBLE);
    expect(result).toBeErr(Cl.uint(107));
  });

  it("rejects invalid funding model", () => {
    const { result } = simnet.callPublicFn(
      CONTRACT,
      "create-campaign",
      [TOKEN_CV, Cl.uint(ONE_USDC * 1000n), Cl.uint(100), Cl.uint(99)],
      wallet1
    );
    expect(result).toBeErr(Cl.uint(113)); // ERR-INVALID-MODEL
  });

  it("rejects token not on allowlist", () => {
    const fakeToken = Cl.contractPrincipal(deployer, "fake-token");
    const { result } = simnet.callPublicFn(
      CONTRACT,
      "create-campaign",
      [fakeToken, Cl.uint(ONE_USDC * 1000n), Cl.uint(100), FLEXIBLE],
      wallet1
    );
    expect(result).toBeErr(Cl.uint(112)); // ERR-TOKEN-NOT-ALLOWED
  });
});

// ─────────────────────────────────────────────────────────────
// donate
// ─────────────────────────────────────────────────────────────
describe("donate", () => {
  beforeEach(() => {
    createCampaign(wallet1, ONE_USDC * 1000n, 100, FLEXIBLE);
  });

  it("accepts a valid donation", () => {
    const { result } = donate(wallet2, 1, ONE_USDC * 100n);
    expect(result).toBeOk(Cl.bool(true));
  });

  it("accumulates multiple donations from same donor", () => {
    donate(wallet2, 1, ONE_USDC * 50n);
    donate(wallet2, 1, ONE_USDC * 50n);
    const { result } = simnet.callReadOnlyFn(
      CONTRACT,
      "get-donation",
      [Cl.uint(1), Cl.principal(wallet2)],
      wallet2
    );
    expect(result).toBeUint(ONE_USDC * 100n);
  });

  it("updates campaign total-raised", () => {
    donate(wallet2, 1, ONE_USDC * 200n);
    donate(wallet3, 1, ONE_USDC * 300n);
    const { result } = simnet.callReadOnlyFn(CONTRACT, "get-campaign", [Cl.uint(1)], wallet1);
    const campaign = result.value.value as any;
    expect(campaign["total-raised"]).toEqual(Cl.uint(ONE_USDC * 500n));
  });

  it("rejects donation of 0", () => {
    const { result } = donate(wallet2, 1, 0n);
    expect(result).toBeErr(Cl.uint(107)); // ERR-INVALID-AMOUNT
  });

  it("rejects donation to nonexistent campaign", () => {
    const { result } = donate(wallet2, 999, ONE_USDC * 100n);
    expect(result).toBeErr(Cl.uint(100)); // ERR-NOT-FOUND
  });

  it("rejects donation after deadline", () => {
    simnet.mineEmptyBlocks(101);
    const { result } = donate(wallet2, 1, ONE_USDC * 100n);
    expect(result).toBeErr(Cl.uint(103)); // ERR-EXPIRED
  });

  it("rejects donation to inactive campaign", () => {
    simnet.callPublicFn(CONTRACT, "deactivate-campaign", [Cl.uint(1)], deployer);
    const { result } = donate(wallet2, 1, ONE_USDC * 100n);
    expect(result).toBeErr(Cl.uint(102)); // ERR-INACTIVE
  });
});

// ─────────────────────────────────────────────────────────────
// withdraw
// ─────────────────────────────────────────────────────────────
describe("withdraw", () => {
  it("flexible: creator withdraws after deadline even if goal not met", () => {
    createCampaign(wallet1, ONE_USDC * 1000n, 10, FLEXIBLE);
    donate(wallet2, 1, ONE_USDC * 50n); // below goal
    simnet.mineEmptyBlocks(11);
    const { result } = withdraw(wallet1, 1);
    expect(result).toBeOk(Cl.bool(true));
  });

  it("all-or-nothing: creator withdraws after deadline when goal reached", () => {
    createCampaign(wallet1, ONE_USDC * 100n, 10, ALL_OR_NOTHING);
    donate(wallet2, 1, ONE_USDC * 100n);
    simnet.mineEmptyBlocks(11);
    const { result } = withdraw(wallet1, 1);
    expect(result).toBeOk(Cl.bool(true));
  });

  it("all-or-nothing: creator cannot withdraw when goal not reached", () => {
    createCampaign(wallet1, ONE_USDC * 1000n, 10, ALL_OR_NOTHING);
    donate(wallet2, 1, ONE_USDC * 50n);
    simnet.mineEmptyBlocks(11);
    const { result } = withdraw(wallet1, 1);
    expect(result).toBeErr(Cl.uint(105)); // ERR-GOAL-NOT-REACHED
  });

  it("rejects withdrawal before deadline", () => {
    createCampaign(wallet1, ONE_USDC * 100n, 100, FLEXIBLE);
    donate(wallet2, 1, ONE_USDC * 100n);
    const { result } = withdraw(wallet1, 1);
    expect(result).toBeErr(Cl.uint(104)); // ERR-STILL-ACTIVE
  });

  it("rejects double withdrawal", () => {
    createCampaign(wallet1, ONE_USDC * 100n, 10, FLEXIBLE);
    donate(wallet2, 1, ONE_USDC * 100n);
    simnet.mineEmptyBlocks(11);
    withdraw(wallet1, 1);
    const { result } = withdraw(wallet1, 1);
    expect(result).toBeErr(Cl.uint(106)); // ERR-ALREADY-WITHDRAWN
  });

  it("rejects withdrawal by non-creator", () => {
    createCampaign(wallet1, ONE_USDC * 100n, 10, FLEXIBLE);
    donate(wallet2, 1, ONE_USDC * 100n);
    simnet.mineEmptyBlocks(11);
    const { result } = withdraw(wallet2, 1);
    expect(result).toBeErr(Cl.uint(101)); // ERR-NOT-CREATOR
  });

  it("fee split: platform gets 0.2%, creator gets 99.8%", () => {
    createCampaign(wallet1, ONE_USDC * 1000n, 10, FLEXIBLE);
    donate(wallet2, 1, ONE_USDC * 1000n);
    simnet.mineEmptyBlocks(11);

    const creatorBefore = simnet.callReadOnlyFn(TOKEN, "get-balance", [Cl.principal(wallet1)], wallet1).result;
    const platformBefore = simnet.callReadOnlyFn(TOKEN, "get-balance", [Cl.principal(deployer)], deployer).result;

    withdraw(wallet1, 1);

    const creatorAfter = simnet.callReadOnlyFn(TOKEN, "get-balance", [Cl.principal(wallet1)], wallet1).result;
    const platformAfter = simnet.callReadOnlyFn(TOKEN, "get-balance", [Cl.principal(deployer)], deployer).result;

    const raised = ONE_USDC * 1000n;
    const fee = (raised * 200n) / 10000n; // 0.2% in BPS
    const net = raised - fee;

    expect(BigInt((creatorAfter as any).value) - BigInt((creatorBefore as any).value)).toBe(net);
    expect(BigInt((platformAfter as any).value) - BigInt((platformBefore as any).value)).toBe(fee);
  });
});

// ─────────────────────────────────────────────────────────────
// claim-refund
// ─────────────────────────────────────────────────────────────
describe("claim-refund", () => {
  beforeEach(() => {
    createCampaign(wallet1, ONE_USDC * 1000n, 10, ALL_OR_NOTHING);
    donate(wallet2, 1, ONE_USDC * 100n); // below goal
  });

  it("backer claims full refund when goal not met", () => {
    simnet.mineEmptyBlocks(11);
    const { result } = claimRefund(wallet2, 1);
    expect(result).toBeOk(Cl.uint(ONE_USDC * 100n));
  });

  it("donation zeroed out after refund (double-claim blocked)", () => {
    simnet.mineEmptyBlocks(11);
    claimRefund(wallet2, 1);
    const { result } = claimRefund(wallet2, 1);
    expect(result).toBeErr(Cl.uint(108)); // ERR-NOT-DONOR
  });

  it("rejects refund on flexible campaign", () => {
    createCampaign(wallet1, ONE_USDC * 1000n, 10, FLEXIBLE);
    donate(wallet2, 2, ONE_USDC * 100n);
    simnet.mineEmptyBlocks(11);
    const { result } = claimRefund(wallet2, 2);
    expect(result).toBeErr(Cl.uint(108)); // ERR-REFUND-NOT-ALLOWED
  });

  it("rejects refund before deadline", () => {
    const { result } = claimRefund(wallet2, 1);
    expect(result).toBeErr(Cl.uint(104)); // ERR-STILL-ACTIVE
  });

  it("rejects refund when goal was reached", () => {
    createCampaign(wallet1, ONE_USDC * 100n, 10, ALL_OR_NOTHING);
    donate(wallet2, 2, ONE_USDC * 100n); // goal met
    simnet.mineEmptyBlocks(11);
    const { result } = claimRefund(wallet2, 2);
    expect(result).toBeErr(Cl.uint(108)); // ERR-REFUND-NOT-ALLOWED
  });

  it("rejects refund from non-donor", () => {
    simnet.mineEmptyBlocks(11);
    const { result } = claimRefund(wallet3, 1);
    expect(result).toBeErr(Cl.uint(108)); // ERR-NOT-DONOR
  });
});

// ─────────────────────────────────────────────────────────────
// deactivate-campaign
// ─────────────────────────────────────────────────────────────
describe("deactivate-campaign", () => {
  beforeEach(() => {
    createCampaign(wallet1, ONE_USDC * 1000n, 100, FLEXIBLE);
  });

  it("owner can deactivate a campaign", () => {
    const { result } = simnet.callPublicFn(
      CONTRACT,
      "deactivate-campaign",
      [Cl.uint(1)],
      deployer
    );
    expect(result).toBeOk(Cl.bool(true));
  });

  it("deactivated campaign blocks new donations", () => {
    simnet.callPublicFn(CONTRACT, "deactivate-campaign", [Cl.uint(1)], deployer);
    const { result } = donate(wallet2, 1, ONE_USDC * 100n);
    expect(result).toBeErr(Cl.uint(102)); // ERR-INACTIVE
  });

  it("non-owner cannot deactivate", () => {
    const { result } = simnet.callPublicFn(
      CONTRACT,
      "deactivate-campaign",
      [Cl.uint(1)],
      wallet1
    );
    expect(result).toBeErr(Cl.uint(112)); // ERR-NOT-OWNER
  });
});

// ─────────────────────────────────────────────────────────────
// set-allowed-token (admin)
// ─────────────────────────────────────────────────────────────
describe("set-allowed-token", () => {
  it("owner can allowlist a token", () => {
    const { result } = simnet.callPublicFn(
      CONTRACT,
      "set-allowed-token",
      [Cl.principal(TOKEN_FQN), Cl.bool(true)],
      deployer
    );
    expect(result).toBeOk(Cl.bool(true));
  });

  it("non-owner cannot allowlist a token", () => {
    const { result } = simnet.callPublicFn(
      CONTRACT,
      "set-allowed-token",
      [Cl.principal(TOKEN_FQN), Cl.bool(true)],
      wallet1
    );
    expect(result).toBeErr(Cl.uint(112)); // ERR-NOT-OWNER
  });
});
