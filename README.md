# 🪙 FundMe Smart Contract

A Solidity smart contract that allows users to fund a project with ETH and enables the owner to withdraw the collected funds — powered by Chainlink oracles for real-time ETH/USD conversion.

## 🚀 Overview

This contract:

-   Accepts ETH donations from users
-   Requires a minimum amount (in USD) for any contribution
-   Tracks how much each address has funded
-   Allows only the contract owner (deployer) to withdraw the funds
-   Uses **Chainlink Price Feeds** to get the real-time ETH/USD rate

---

## 🧠 How It Works

### FundMe.sol

```solidity
function fund() public payable {
     if (msg.value.ethToUsd(priceFeed) < MINIMUM_USD) {
            revert FundMe__InsufficienETH();
      }
      funders.push(msg.sender);
      addressToAmountSent[msg.sender] += msg.value;
}
•	Users send ETH using the fund() function
	•	The amount must be worth at least $50 in USD (converted using Chainlink)
	•	The contract stores the sender address and the amount

Withdraw
function withdraw() public onlyOwner {
    payable(OWNER).transfer(address(this).balance);
}
•	Only the deployer (i_owner) can withdraw the funds
•	Anyone else calling this will be rejected by the onlyOwner modifier
```

🔗 Chainlink oracle

We use Chainlink’s ETH/USD price feed to determine the USD equivalent of incoming ETH:
if (msg.value.ethToUsd(priceFeed));

🛠 Setup and Deployment

1. Clone the repo (optional)

```
   git clone https://github.com/astrohub-dev/FundMe-Smartcontract.git
   cd hardhat-fundme
```

2. Install dependencies (feel free to use npm if it's your preference)

```bash
   yarn add --dev hardhat typescript ts-node typechain @nomicfoundation/hardhat-toolbox @typechain/hardhat @types/node @nomicfoundation/hardhat-verify @chainlink/contracts dotenv prettier solhint
```

3. Create .env

```env
   PRIVATE_KEY=your_private_key
   RPC_URL=https://sepolia.infura.io/v3/your_project_id
   ETHERSCAN_API_KEY=your_etherscan_api_key
```

4. Compile contracts

```bash
   npx hardhat compile
```

5. Deploy to sepolia

```bash
   npx hardhat ignition deploy ignition/modules/FundMeModule.ts --network sepolia
```

6. Run unit test (output gas report)

```bash
   npx hardhat test
```

7. Run staging test

```bash
   npx hardhat test test/staging/FundMe.staging.test.ts --network sepolia
```

8. Lint contracts

```bash
   npx solhint 'contracts/**/*.sol'
```

9. Verify contract on Etherscan

```bash
   npx hardhat verify --network sepolia <your contract address> <contructor argument>
```

🧪 Interact with the Contract

Edit scripts/interact.ts to call fund() or withdraw(), then:

```bash
npx ts-node scripts/interact.ts
or:
npx hardhat run scripts/interact.ts --network sepolia
```

✅ TODO

• Add frontend (React + Ethers.js)

• Add support for other chains (check helper-hardhat-config to see chains you can add supports for)

• Use Hardhat Ignition for cleaner deployment

📑Please feel free to read and write the version I deployed on etherscan https://sepolia.etherscan.io/address/0xbd67282F33b5c99b04Ee883758F3eE33ae6dB426

🤝 Contributing

PRs are welcome! If you find bugs or improvements, feel free to open an issue or submit a pull request.

📜 License

MIT — free to use and modify.

💬 Questions?

Feel free to reach out via GitHub or open an issue if you’re stuck!

🙋‍♂️ Author

Ndubuisi Ugwuja 💬 Let’s connect!
