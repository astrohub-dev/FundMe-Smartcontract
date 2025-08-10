import { ethers } from "ethers";
import "dotenv/config";
import fundMeArtifact from "../artifacts/contracts/FundMe.sol/FundMe.json";
import { contractAddress } from "./constants";

async function main() {
    try {
        const { SEPOLIA_RPC_URL, PRIVATE_KEY } = process.env;
        const provider = new ethers.JsonRpcProvider(SEPOLIA_RPC_URL);
        const wallet = new ethers.Wallet(PRIVATE_KEY!, provider);
        const contractABI = fundMeArtifact.abi;

        // Connect to deployed contract
        const contract = new ethers.Contract(
            contractAddress,
            contractABI,
            wallet
        );

        // Read minimum USD
        const minUsd = await contract.MINIMUM_USD();
        console.log("Minimum USD:", ethers.formatEther(minUsd));

        // Call fund() by sending ETH
        const txFund = await contract.fund({
            value: ethers.parseEther("0.05"), // Send 0.05 ETH
        });
        console.log("Funding... tx hash:", txFund.hash);
        await txFund.wait();
        console.log("Funded!");

        // Map address to amount sent
        const sent = await contract.addressToAmountSent(wallet.address);
        console.log("You sent:", ethers.formatEther(sent));

        // Read balance of the contract after funding
        const balanceAfterFunding = await provider.getBalance(contractAddress);
        console.log(
            "Contract balance after funding:",
            ethers.formatEther(balanceAfterFunding),
            "ETH"
        );

        // Call withdraw() (must be owner)
        const txWithdraw = await contract.withdraw();
        console.log("Withdrawing... tx hash:", txWithdraw.hash);
        await txWithdraw.wait();
        console.log("Withdrawn to owner's address!");

        // Read balance of the contract after withrawal
        const balanceAfterWithradwal = await provider.getBalance(
            contractAddress
        );
        console.log(
            "Contract balance after withdrawing:",
            ethers.formatEther(balanceAfterWithradwal),
            "ETH"
        );
        process.exit(0);
    } catch (error) {
        console.error("error caught:", error);
        process.exit(1);
    }
}

main();
