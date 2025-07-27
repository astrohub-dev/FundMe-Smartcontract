import { ethers } from "ethers";
import "dotenv/config";
import fundMeArtifact from "../artifacts/contracts/FundMe.sol/FundMe.json";

async function main() {
  try {
    const { SEPOLIA_RPC_URL, PRIVATE_KEY } = process.env;
    const provider = new ethers.JsonRpcProvider(SEPOLIA_RPC_URL);
    const wallet = new ethers.Wallet(PRIVATE_KEY!, provider);
    const contractAddress = "0x6750a41dB18db84645B4Be8CdB62B3500cc64B8d";

    // ABI from artifacts
    const contractABI = fundMeArtifact.abi;

    //connect to deployed contract
    const contract = new ethers.Contract(contractAddress, contractABI, wallet);

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

    //Receipt
    const sent = await contract.addressToAmountSent(wallet.address);
    console.log("You sent:", ethers.formatEther(sent));

    // Read balance of the contract
    const balance = await provider.getBalance(contract.target);
    console.log("Contract balance:", ethers.formatEther(balance), "ETH");

    //Call withdraw() (must be owner)
    const txWithdraw = await contract.withdraw();
    console.log("Withdrawing... tx hash:", txWithdraw.hash);
    await txWithdraw.wait();
    console.log("Withdrawn!");

    process.exit(0);
  } catch (error) {
    console.error("error caught:", error);
    process.exit(1);
  }
}

main();
