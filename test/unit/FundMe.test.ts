import { ethers } from "hardhat";
import { parseEther, parseUnits } from "ethers";
import { expect } from "chai";

describe("FundMe", function () {
    let fundMe: any;
    let mockV3Aggregator: any;
    let deployer: any;
    let user1: any;
    let user2: any;
    let user3: any;
    const DECIMALS = 8;
    const INITIAL_ANSWER = parseUnits("2000", DECIMALS); // $2000
    const SEND_VALUE = parseEther("1"); // 1 ETH
    beforeEach(async function () {
        [deployer, user1, user2, user3] = await ethers.getSigners();
        const MockV3AggregatorFactory = await ethers.getContractFactory(
            "MockV3Aggregator"
        );
        mockV3Aggregator = await MockV3AggregatorFactory.deploy(
            DECIMALS,
            INITIAL_ANSWER
        );
        const FundMeFactory = await ethers.getContractFactory("FundMe");
        fundMe = await FundMeFactory.deploy(mockV3Aggregator.target);
    });

    describe("constructor", function () {
        it("should set the price feed address correctly", async function () {
            expect(await fundMe.priceFeed()).to.equal(mockV3Aggregator.target);
        });
    });

    describe("receive", function () {
        it("Should handle plain ETH transfers with empty calldata", async function () {
            const txn = await user1.sendTransaction({
                to: fundMe.target,
                value: SEND_VALUE,
            });
            await txn.wait();
            const amount = await fundMe.addressToAmountSent(user1.address);
            expect(amount).to.equal(SEND_VALUE);
        });
    });

    describe("fallback", function () {
        it("Should handle ETH transfers with unknown function selectors or non-empty calldata", async function () {
            const txn = await user2.sendTransaction({
                to: fundMe.target,
                value: SEND_VALUE,
                data: "0x555777",
            });
            await txn.wait();
            const amount = await fundMe.addressToAmountSent(user2.address);
            expect(amount).to.equal(SEND_VALUE);
        });
    });

    describe("fund", function () {
        it("Should revert if not enough ETH sent", function () {
            expect(fundMe.fund()).to.be.revertedWithCustomError;
        });
        it("Should update the amount funded", async function () {
            await fundMe.fund({ value: SEND_VALUE });
            const amount = await fundMe.addressToAmountSent(deployer.address);
            expect(amount).to.equal(SEND_VALUE);
        });
        it("Should add funder to array", async function () {
            await fundMe.fund({ value: SEND_VALUE });
            const funder = await fundMe.funders(0);
            expect(funder).to.equal(deployer.address);
        });
    });

    describe("withraw", function () {
        beforeEach(async function () {
            await fundMe.fund({ value: SEND_VALUE });
        });
        it("Should allow owner to withraw ETH", async function () {
            const startingFundMeBalance = await ethers.provider.getBalance(
                fundMe.target
            );
            const startingDeployerBalance = await ethers.provider.getBalance(
                deployer.address
            );
            const txResponse = await fundMe.withdraw();
            const txReceipt = await txResponse.wait(1);
            const gasCost = txReceipt.fee;
            const endingFundMeBalance = await ethers.provider.getBalance(
                fundMe.target
            );
            const endingDeployerBalance = await ethers.provider.getBalance(
                deployer.address
            );
            expect(endingFundMeBalance).to.equal(0);
            const expectedEndingDeployerBalance =
                BigInt(startingDeployerBalance) +
                BigInt(startingFundMeBalance) -
                BigInt(gasCost);
            expect(endingDeployerBalance).to.equal(
                expectedEndingDeployerBalance
            );
        });
        it("Should only allow the owner to withdraw", function () {
            const randomContract = fundMe.connect(user3);
            expect(randomContract.withdraw()).to.be.revertedWithCustomError;
        });
    });
});
