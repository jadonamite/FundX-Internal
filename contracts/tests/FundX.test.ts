import { describe, expect, it, beforeEach } from "vitest";
import { Cl } from "@stacks/transactions";

declare const simnet: any;

const accounts = simnet.getAccounts();
const deployer = accounts.get("deployer")!;
const contractOwner = deployer;
const creator1 = accounts.get("wallet_1")!;
const creator2 = accounts.get("wallet_2")!;
const donor1 = accounts.get("wallet_3")!;
const donor2 = accounts.get("wallet_4")!;
const donor3 = accounts.get("wallet_5")!;
const randomUser = accounts.get("wallet_6")!;

// USDCx token contract address (matching the contract)
const usdcxToken = 'ST3GAYKCWBD2PTNR77WGYWCPPR102C5E0C9V1H9ZX.usdcx';

describe("FundX Crowdfunding Contract", () => {
  const goal1 = 10000;
  const goal2 = 5000;
  const duration1 = 1440; // ~1 day in blocks
  const duration2 = 4320; // ~3 days in blocks

  describe("Campaign Creation", () => {
    it("should create a campaign with valid parameters", () => {
      const result = simnet.callPublicFn(
        "fundx",
        "create-campaign",
        [Cl.uint(goal1), Cl.uint(duration1)],
        creator1
      );

      expect(result.result).toBeOk(Cl.uint(1));

      const campaign = simnet.callReadOnlyFn(
        "fundx",
        "get-campaign",
        [Cl.uint(1)],
        deployer
      );

      expect(campaign.result).toBeSome(
        Cl.tuple({
          creator: Cl.principal(creator1),
          goal: Cl.uint(goal1),
          deadline: Cl.uint(simnet.blockHeight + duration1),
          "total-raised": Cl.uint(0),
          withdrawn: Cl.bool(false),
          active: Cl.bool(true)
        })
      );

      const totalCampaigns = simnet.callReadOnlyFn(
        "fundx",
        "get-total-campaigns",
        [],
        deployer
      );
      expect(totalCampaigns.result).toBeUint(1);
    });

    it("should create multiple campaigns with incrementing IDs", () => {
      // First campaign
      simnet.callPublicFn(
        "fundx",
        "create-campaign",
        [Cl.uint(goal1), Cl.uint(duration1)],
        creator1
      );

      // Second campaign
      const result2 = simnet.callPublicFn(
        "fundx",
        "create-campaign",
        [Cl.uint(goal2), Cl.uint(duration2)],
        creator2
      );

      expect(result2.result).toBeOk(Cl.uint(2));

      const totalCampaigns = simnet.callReadOnlyFn(
        "fundx",
        "get-total-campaigns",
        [],
        deployer
      );
      expect(totalCampaigns.result).toBeUint(2);
    });

    it("should reject campaign with zero goal", () => {
      const result = simnet.callPublicFn(
        "fundx",
        "create-campaign",
        [Cl.uint(0), Cl.uint(duration1)],
        creator1
      );

      expect(result.result).toBeErr(Cl.uint(103)); // err-invalid-amount
    });

    it("should reject campaign with zero duration", () => {
      const result = simnet.callPublicFn(
        "fundx",
        "create-campaign",
        [Cl.uint(goal1), Cl.uint(0)],
        creator1
      );

      expect(result.result).toBeErr(Cl.uint(108)); // err-invalid-duration
    });

    it("should create campaign with very large goal", () => {
      const largeGoal = 1000000000;
      const result = simnet.callPublicFn(
        "fundx",
        "create-campaign",
        [Cl.uint(largeGoal), Cl.uint(duration1)],
        creator1
      );

      expect(result.result).toBeOk(Cl.uint(3));

      const campaign = simnet.callReadOnlyFn(
        "fundx",
        "get-campaign",
        [Cl.uint(3)],
        deployer
      );
      expect(campaign.value.data.goal).toBeUint(largeGoal);
    });
  });

  describe("Donation Functionality", () => {
    let campaignId: number;

    beforeEach(() => {
      const result = simnet.callPublicFn(
        "fundx",
        "create-campaign",
        [Cl.uint(goal1), Cl.uint(duration1)],
        creator1
      );
      campaignId = 1;
    });

    it("should allow donor to donate to active campaign", () => {
      const donationAmount = 1000;

      const result = simnet.callPublicFn(
        "fundx",
        "donate",
        [Cl.uint(campaignId), Cl.uint(donationAmount)],
        donor1
      );

      expect(result.result).toBeOk(
        Cl.tuple({
          donated: Cl.uint(donationAmount),
          refunded: Cl.uint(0)
        })
      );

      // Check donation recorded
      const donation = simnet.callReadOnlyFn(
        "fundx",
        "get-donation",
        [Cl.uint(campaignId), Cl.principal(donor1)],
        deployer
      );
      expect(donation.result).toBeUint(donationAmount);

      // Check campaign total updated
      const campaign = simnet.callReadOnlyFn(
        "fundx",
        "get-campaign",
        [Cl.uint(campaignId)],
        deployer
      );
      expect(campaign.value.data["total-raised"]).toBeUint(donationAmount);
    });

    it("should allow multiple donors to donate", () => {
      const donation1 = 500;
      const donation2 = 700;

      simnet.callPublicFn(
        "fundx",
        "donate",
        [Cl.uint(campaignId), Cl.uint(donation1)],
        donor1
      );

      const result2 = simnet.callPublicFn(
        "fundx",
        "donate",
        [Cl.uint(campaignId), Cl.uint(donation2)],
        donor2
      );

      expect(result2.result).toBeOk(
        Cl.tuple({
          donated: Cl.uint(donation2),
          refunded: Cl.uint(0)
        })
      );

      const campaign = simnet.callReadOnlyFn(
        "fundx",
        "get-campaign",
        [Cl.uint(campaignId)],
        deployer
      );
      expect(campaign.value.data["total-raised"]).toBeUint(donation1 + donation2);
    });

    it("should allow same donor to donate multiple times", () => {
      const donation1 = 300;
      const donation2 = 400;

      simnet.callPublicFn(
        "fundx",
        "donate",
        [Cl.uint(campaignId), Cl.uint(donation1)],
        donor1
      );

      const result2 = simnet.callPublicFn(
        "fundx",
        "donate",
        [Cl.uint(campaignId), Cl.uint(donation2)],
        donor1
      );

      expect(result2.result).toBeOk(
        Cl.tuple({
          donated: Cl.uint(donation2),
          refunded: Cl.uint(0)
        })
      );

      const totalDonation = simnet.callReadOnlyFn(
        "fundx",
        "get-donation",
        [Cl.uint(campaignId), Cl.principal(donor1)],
        deployer
      );
      expect(totalDonation.result).toBeUint(donation1 + donation2);
    });

    it("should reject donation to non-existent campaign", () => {
      const result = simnet.callPublicFn(
        "fundx",
        "donate",
        [Cl.uint(999), Cl.uint(500)],
        donor1
      );

      expect(result.result).toBeErr(Cl.uint(101)); // err-not-found
    });

    it("should reject donation of zero amount", () => {
      const result = simnet.callPublicFn(
        "fundx",
        "donate",
        [Cl.uint(campaignId), Cl.uint(0)],
        donor1
      );

      expect(result.result).toBeErr(Cl.uint(103)); // err-invalid-amount
    });

    it("should reject donation to ended campaign", () => {
      // Advance past deadline
      simnet.mineEmptyBlocks(duration1 + 10);

      const result = simnet.callPublicFn(
        "fundx",
        "donate",
        [Cl.uint(campaignId), Cl.uint(500)],
        donor1
      );

      expect(result.result).toBeErr(Cl.uint(104)); // err-campaign-ended
    });

    it("should reject donation after goal reached", () => {
      // Donate full goal amount
      simnet.callPublicFn(
        "fundx",
        "donate",
        [Cl.uint(campaignId), Cl.uint(goal1)],
        donor1
      );

      // Try to donate more
      const result = simnet.callPublicFn(
        "fundx",
        "donate",
        [Cl.uint(campaignId), Cl.uint(100)],
        donor2
      );

      expect(result.result).toBeErr(Cl.uint(109)); // err-goal-reached
    });

    it("should handle partial donations when amount exceeds remaining goal", () => {
      // Donate 60% of goal
      const firstDonation = 6000;
      simnet.callPublicFn(
        "fundx",
        "donate",
        [Cl.uint(campaignId), Cl.uint(firstDonation)],
        donor1
      );

      // Try to donate more than remaining
      const remaining = goal1 - firstDonation; // 4000
      const overAmount = 5000;

      const result = simnet.callPublicFn(
        "fundx",
        "donate",
        [Cl.uint(campaignId), Cl.uint(overAmount)],
        donor2
      );

      expect(result.result).toBeOk(
        Cl.tuple({
          donated: Cl.uint(remaining),
          refunded: Cl.uint(overAmount - remaining)
        })
      );

      const campaign = simnet.callReadOnlyFn(
        "fundx",
        "get-campaign",
        [Cl.uint(campaignId)],
        deployer
      );
      expect(campaign.value.data["total-raised"]).toBeUint(goal1);
      expect(campaign.value.data["goal"]).toBeUint(goal1);
    });
  });

  describe("Withdrawal Functionality", () => {
    let campaignId: number;

    beforeEach(() => {
      const result = simnet.callPublicFn(
        "fundx",
        "create-campaign",
        [Cl.uint(goal1), Cl.uint(duration1)],
        creator1
      );
      campaignId = 1;
    });

    it("should allow creator to withdraw when goal reached", () => {
      // Reach goal
      simnet.callPublicFn(
        "fundx",
        "donate",
        [Cl.uint(campaignId), Cl.uint(goal1)],
        donor1
      );

      const result = simnet.callPublicFn(
        "fundx",
        "withdraw",
        [Cl.uint(campaignId)],
        creator1
      );

      // Platform fee: 2% of 10000 = 200
      // Creator amount: 9800
      expect(result.result).toBeOk(
        Cl.tuple({
          total: Cl.uint(goal1),
          fee: Cl.uint(200),
          transferred: Cl.uint(9800)
        })
      );

      const campaign = simnet.callReadOnlyFn(
        "fundx",
        "get-campaign",
        [Cl.uint(campaignId)],
        deployer
      );
      expect(campaign.value.data.withdrawn).toBe(Cl.bool(true));
      expect(campaign.value.data.active).toBe(Cl.bool(false));
    });

    it("should allow creator to withdraw after deadline even if goal not reached", () => {
      // Partial donations
      simnet.callPublicFn(
        "fundx",
        "donate",
        [Cl.uint(campaignId), Cl.uint(3000)],
        donor1
      );

      // Advance past deadline
      simnet.mineEmptyBlocks(duration1 + 10);

      const result = simnet.callPublicFn(
        "fundx",
        "withdraw",
        [Cl.uint(campaignId)],
        creator1
      );

      // Platform fee: 2% of 3000 = 60
      // Creator amount: 2940
      expect(result.result).toBeOk(
        Cl.tuple({
          total: Cl.uint(3000),
          fee: Cl.uint(60),
          transferred: Cl.uint(2940)
        })
      );
    });

    it("should prevent non-creator from withdrawing", () => {
      simnet.callPublicFn(
        "fundx",
        "donate",
        [Cl.uint(campaignId), Cl.uint(goal1)],
        donor1
      );

      const result = simnet.callPublicFn(
        "fundx",
        "withdraw",
        [Cl.uint(campaignId)],
        randomUser
      );

      expect(result.result).toBeErr(Cl.uint(107)); // err-unauthorized
    });

    it("should prevent double withdrawal", () => {
      simnet.callPublicFn(
        "fundx",
        "donate",
        [Cl.uint(campaignId), Cl.uint(goal1)],
        donor1
      );

      // First withdrawal
      simnet.callPublicFn(
        "fundx",
        "withdraw",
        [Cl.uint(campaignId)],
        creator1
      );

      // Second withdrawal attempt
      const result = simnet.callPublicFn(
        "fundx",
        "withdraw",
        [Cl.uint(campaignId)],
        creator1
      );

      expect(result.result).toBeErr(Cl.uint(110)); // err-already-withdrawn
    });

    it("should prevent withdrawal when campaign is active and goal not reached", () => {
      simnet.callPublicFn(
        "fundx",
        "donate",
        [Cl.uint(campaignId), Cl.uint(3000)],
        donor1
      );

      const result = simnet.callPublicFn(
        "fundx",
        "withdraw",
        [Cl.uint(campaignId)],
        creator1
      );

      expect(result.result).toBeErr(Cl.uint(105)); // err-campaign-active
    });

    it("should prevent withdrawal with zero raised", () => {
      // No donations
      const result = simnet.callPublicFn(
        "fundx",
        "withdraw",
        [Cl.uint(campaignId)],
        creator1
      );

      expect(result.result).toBeErr(Cl.uint(103)); // err-invalid-amount
    });

    it("should handle withdrawal after deadline with zero raised", () => {
      simnet.mineEmptyBlocks(duration1 + 10);

      const result = simnet.callPublicFn(
        "fundx",
        "withdraw",
        [Cl.uint(campaignId)],
        creator1
      );

      expect(result.result).toBeErr(Cl.uint(103)); // err-invalid-amount
    });
  });

  describe("Platform Fee Calculation", () => {
    it("should calculate platform fee correctly", () => {
      const testCases = [
        { amount: 1000, expectedFee: 20 },
        { amount: 5000, expectedFee: 100 },
        { amount: 12345, expectedFee: 246 },
        { amount: 1000000, expectedFee: 20000 }
      ];

      testCases.forEach(({ amount, expectedFee }) => {
        const result = simnet.callReadOnlyFn(
          "fundx",
          "calculate-platform-fee",
          [Cl.uint(amount)],
          deployer
        );
        expect(result.result).toBeUint(expectedFee);
      });
    });
  });

  describe("Campaign Deactivation", () => {
    let campaignId: number;

    beforeEach(() => {
      const result = simnet.callPublicFn(
        "fundx",
        "create-campaign",
        [Cl.uint(goal1), Cl.uint(duration1)],
        creator1
      );
      campaignId = 1;
    });

    it("should allow contract owner to deactivate campaign", () => {
      const result = simnet.callPublicFn(
        "fundx",
        "deactivate-campaign",
        [Cl.uint(campaignId)],
        contractOwner
      );

      expect(result.result).toBeOk(Cl.bool(true));

      const campaign = simnet.callReadOnlyFn(
        "fundx",
        "get-campaign",
        [Cl.uint(campaignId)],
        deployer
      );
      expect(campaign.value.data.active).toBe(Cl.bool(false));
    });

    it("should prevent non-owner from deactivating campaign", () => {
      const result = simnet.callPublicFn(
        "fundx",
        "deactivate-campaign",
        [Cl.uint(campaignId)],
        creator1
      );

      expect(result.result).toBeErr(Cl.uint(100)); // err-owner-only
    });

    it("should prevent donations after deactivation", () => {
      // Deactivate campaign
      simnet.callPublicFn(
        "fundx",
        "deactivate-campaign",
        [Cl.uint(campaignId)],
        contractOwner
      );

      // Try to donate
      const result = simnet.callPublicFn(
        "fundx",
        "donate",
        [Cl.uint(campaignId), Cl.uint(500)],
        donor1
      );

      expect(result.result).toBeErr(Cl.uint(104)); // err-campaign-ended
    });
  });

  describe("Read-Only Functions", () => {
    let campaignId: number;

    beforeEach(() => {
      const result = simnet.callPublicFn(
        "fundx",
        "create-campaign",
        [Cl.uint(goal1), Cl.uint(duration1)],
        creator1
      );
      campaignId = 1;

      // Add some donations
      simnet.callPublicFn(
        "fundx",
        "donate",
        [Cl.uint(campaignId), Cl.uint(3000)],
        donor1
      );
    });

    it("should check if campaign ended", () => {
      // Before deadline
      let ended = simnet.callReadOnlyFn(
        "fundx",
        "is-campaign-ended",
        [Cl.uint(campaignId)],
        deployer
      );
      expect(ended.result).toBe(Cl.bool(false));

      // After deadline
      simnet.mineEmptyBlocks(duration1 + 10);

      ended = simnet.callReadOnlyFn(
        "fundx",
        "is-campaign-ended",
        [Cl.uint(campaignId)],
        deployer
      );
      expect(ended.result).toBe(Cl.bool(true));
    });

    it("should check if goal reached", () => {
      // Before goal reached
      let reached = simnet.callReadOnlyFn(
        "fundx",
        "is-goal-reached",
        [Cl.uint(campaignId)],
        deployer
      );
      expect(reached.result).toBe(Cl.bool(false));

      // Reach goal
      simnet.callPublicFn(
        "fundx",
        "donate",
        [Cl.uint(campaignId), Cl.uint(7000)],
        donor2
      );

      reached = simnet.callReadOnlyFn(
        "fundx",
        "is-goal-reached",
        [Cl.uint(campaignId)],
        deployer
      );
      expect(reached.result).toBe(Cl.bool(true));
    });

    it("should return none for non-existent campaign in get-campaign", () => {
      const result = simnet.callReadOnlyFn(
        "fundx",
        "get-campaign",
        [Cl.uint(999)],
        deployer
      );
      expect(result.result).toBeNone();
    });

    it("should return zero for donation from non-donor", () => {
      const result = simnet.callReadOnlyFn(
        "fundx",
        "get-donation",
        [Cl.uint(campaignId), Cl.principal(randomUser)],
        deployer
      );
      expect(result.result).toBeUint(0);
    });
  });

  describe("Error Codes", () => {
    it("should handle err-owner-only (100)", () => {
      const result = simnet.callPublicFn(
        "fundx",
        "deactivate-campaign",
        [Cl.uint(1)],
        randomUser
      );
      expect(result.result).toBeErr(Cl.uint(100));
    });

    it("should handle err-not-found (101)", () => {
      const result = simnet.callPublicFn(
        "fundx",
        "donate",
        [Cl.uint(999), Cl.uint(500)],
        donor1
      );
      expect(result.result).toBeErr(Cl.uint(101));
    });

    it("should handle err-invalid-amount (103)", () => {
      const result = simnet.callPublicFn(
        "fundx",
        "create-campaign",
        [Cl.uint(0), Cl.uint(duration1)],
        creator1
      );
      expect(result.result).toBeErr(Cl.uint(103));
    });

    it("should handle err-campaign-ended (104)", () => {
      // Create campaign and advance past deadline
      simnet.callPublicFn(
        "fundx",
        "create-campaign",
        [Cl.uint(goal1), Cl.uint(1)],
        creator1
      );
      simnet.mineEmptyBlocks(2);

      const result = simnet.callPublicFn(
        "fundx",
        "donate",
        [Cl.uint(1), Cl.uint(500)],
        donor1
      );
      expect(result.result).toBeErr(Cl.uint(104));
    });

    it("should handle err-campaign-active (105)", () => {
      simnet.callPublicFn(
        "fundx",
        "create-campaign",
        [Cl.uint(goal1), Cl.uint(duration1)],
        creator1
      );

      // Try to withdraw without reaching goal
      const result = simnet.callPublicFn(
        "fundx",
        "withdraw",
        [Cl.uint(1)],
        creator1
      );
      expect(result.result).toBeErr(Cl.uint(105));
    });

    it("should handle err-unauthorized (107)", () => {
      simnet.callPublicFn(
        "fundx",
        "create-campaign",
        [Cl.uint(goal1), Cl.uint(duration1)],
        creator1
      );

      simnet.callPublicFn(
        "fundx",
        "donate",
        [Cl.uint(1), Cl.uint(goal1)],
        donor1
      );

      const result = simnet.callPublicFn(
        "fundx",
        "withdraw",
        [Cl.uint(1)],
        donor1
      );
      expect(result.result).toBeErr(Cl.uint(107));
    });

    it("should handle err-invalid-duration (108)", () => {
      const result = simnet.callPublicFn(
        "fundx",
        "create-campaign",
        [Cl.uint(goal1), Cl.uint(0)],
        creator1
      );
      expect(result.result).toBeErr(Cl.uint(108));
    });

    it("should handle err-goal-reached (109)", () => {
      simnet.callPublicFn(
        "fundx",
        "create-campaign",
        [Cl.uint(goal1), Cl.uint(duration1)],
        creator1
      );

      simnet.callPublicFn(
        "fundx",
        "donate",
        [Cl.uint(1), Cl.uint(goal1)],
        donor1
      );

      const result = simnet.callPublicFn(
        "fundx",
        "donate",
        [Cl.uint(1), Cl.uint(100)],
        donor2
      );
      expect(result.result).toBeErr(Cl.uint(109));
    });

    it("should handle err-already-withdrawn (110)", () => {
      simnet.callPublicFn(
        "fundx",
        "create-campaign",
        [Cl.uint(goal1), Cl.uint(duration1)],
        creator1
      );

      simnet.callPublicFn(
        "fundx",
        "donate",
        [Cl.uint(1), Cl.uint(goal1)],
        donor1
      );

      // First withdrawal
      simnet.callPublicFn(
        "fundx",
        "withdraw",
        [Cl.uint(1)],
        creator1
      );

      // Second withdrawal attempt
      const result = simnet.callPublicFn(
        "fundx",
        "withdraw",
        [Cl.uint(1)],
        creator1
      );
      expect(result.result).toBeErr(Cl.uint(110));
    });
  });

  describe("Complex Scenarios", () => {
    it("should handle multiple campaigns with different states", () => {
      // Campaign 1: Successful
      simnet.callPublicFn(
        "fundx",
        "create-campaign",
        [Cl.uint(5000), Cl.uint(duration1)],
        creator1
      );
      simnet.callPublicFn(
        "fundx",
        "donate",
        [Cl.uint(1), Cl.uint(3000)],
        donor1
      );
      simnet.callPublicFn(
        "fundx",
        "donate",
        [Cl.uint(1), Cl.uint(2000)],
        donor2
      );
      simnet.callPublicFn(
        "fundx",
        "withdraw",
        [Cl.uint(1)],
        creator1
      );

      // Campaign 2: Partially funded, expires
      simnet.callPublicFn(
        "fundx",
        "create-campaign",
        [Cl.uint(8000), Cl.uint(5)],
        creator2
      );
      simnet.callPublicFn(
        "fundx",
        "donate",
        [Cl.uint(2), Cl.uint(2000)],
        donor1
      );
      simnet.mineEmptyBlocks(10); // Past deadline
      simnet.callPublicFn(
        "fundx",
        "withdraw",
        [Cl.uint(2)],
        creator2
      );

      // Campaign 3: Active but not funded
      simnet.callPublicFn(
        "fundx",
        "create-campaign",
        [Cl.uint(3000), Cl.uint(duration2)],
        creator1
      );

      // Verify final states
      const campaign1 = simnet.callReadOnlyFn("fundx", "get-campaign", [Cl.uint(1)], deployer);
      expect(campaign1.value.data.withdrawn).toBe(Cl.bool(true));
      expect(campaign1.value.data["total-raised"]).toBeUint(5000);

      const campaign2 = simnet.callReadOnlyFn("fundx", "get-campaign", [Cl.uint(2)], deployer);
      expect(campaign2.value.data.withdrawn).toBe(Cl.bool(true));
      expect(campaign2.value.data["total-raised"]).toBeUint(2000);

      const campaign3 = simnet.callReadOnlyFn("fundx", "get-campaign", [Cl.uint(3)], deployer);
      expect(campaign3.value.data.active).toBe(Cl.bool(true));
      expect(campaign3.value.data["total-raised"]).toBeUint(0);
    });

    it("should handle donations from multiple donors across campaigns", () => {
      // Create campaigns
      simnet.callPublicFn(
        "fundx",
        "create-campaign",
        [Cl.uint(5000), Cl.uint(duration1)],
        creator1
      );
      simnet.callPublicFn(
        "fundx",
        "create-campaign",
        [Cl.uint(3000), Cl.uint(duration2)],
        creator2
      );

      // Donor1 donates to both campaigns
      simnet.callPublicFn(
        "fundx",
        "donate",
        [Cl.uint(1), Cl.uint(2000)],
        donor1
      );
      simnet.callPublicFn(
        "fundx",
        "donate",
        [Cl.uint(2), Cl.uint(1500)],
        donor1
      );

      // Donor2 donates to campaign 1 only
      simnet.callPublicFn(
        "fundx",
        "donate",
        [Cl.uint(1), Cl.uint(1000)],
        donor2
      );

      // Verify donor1's donations
      const donor1Campaign1 = simnet.callReadOnlyFn(
        "fundx",
        "get-donation",
        [Cl.uint(1), Cl.principal(donor1)],
        deployer
      );
      expect(donor1Campaign1.result).toBeUint(2000);

      const donor1Campaign2 = simnet.callReadOnlyFn(
        "fundx",
        "get-donation",
        [Cl.uint(2), Cl.principal(donor1)],
        deployer
      );
      expect(donor1Campaign2.result).toBeUint(1500);

      // Verify campaign totals
      const campaign1 = simnet.callReadOnlyFn("fundx", "get-campaign", [Cl.uint(1)], deployer);
      expect(campaign1.value.data["total-raised"]).toBeUint(3000);

      const campaign2 = simnet.callReadOnlyFn("fundx", "get-campaign", [Cl.uint(2)], deployer);
      expect(campaign2.value.data["total-raised"]).toBeUint(1500);
    });
  });
});
