import { ethers, network } from "hardhat";
import { parseEther } from "ethers";
import { expect } from "chai";
import { contractAddress } from "../../scripts/constants";

describe("FundMe Staging test", function () {
    let fundMe: any;
    const sendValue = parseEther("0.03");
    before(async function () {
        if (network.name === "hardhat" || network.name === "localhost") {
            this.skip(); // Don't run staging tests on local network
        }
        fundMe = await ethers.getContractAt("FundMe", contractAddress);
    });
    it("Should allow funding and withdrawing on testnet", async function () {
        const startingBalance = await ethers.provider.getBalance(
            contractAddress
        );
        console.log(
            `The balance of the contract address before funding is ${startingBalance.toString()}`
        );
        const fundTx = await fundMe.fund({ value: sendValue });
        await fundTx.wait(1);
        const balanceAfterFunding = await ethers.provider.getBalance(
            contractAddress
        );
        console.log(
            `The balance of the contract address after funding is ${balanceAfterFunding.toString()}`
        );
        expect(balanceAfterFunding.toString()).to.equal(sendValue.toString());
        const withdrawTx = await fundMe.withdraw();
        await withdrawTx.wait(1);
        const endingBalance = await ethers.provider.getBalance(contractAddress);
        console.log(
            `The balance of the contract address after withdrawing is ${endingBalance.toString()}`
        );
        expect(endingBalance.toString()).to.equal("0");
    });
});
