# 🪙 FundMe Smart Contract

A Solidity smart contract that allows users to fund a project with ETH and enables the owner to withdraw the collected funds — powered by Chainlink oracles for real-time ETH/USD conversion.

## 🚀 Overview

This contract:

- Accepts ETH donations from users
- Requires a minimum amount (in USD) for any contribution
- Tracks how much each address has funded
- Allows only the contract owner (deployer) to withdraw the funds
- Uses **Chainlink Price Feeds** to get the real-time ETH/USD rate

---

## 🧠 How It Works

### FundMe.sol

```solidity
function fund() public payable {
    require(msg.value.ethToUsd() >= MINIMUM_USD, "Not enough funds");
    funders.push(msg.sender);
    addressToAmountSent[msg.sender] = msg.value;
}
•	Users send ETH using the fund() function
	•	The amount must be worth at least $50 in USD (converted using Chainlink)
	•	The contract stores the sender address and the amount

Withdraw
function withdraw() public onlyOwner {
    payable(i_owner).transfer(address(this).balance);
}
•	Only the deployer (i_owner) can withdraw the funds
•	Anyone else calling this will be rejected by the onlyOwner modifier
```

🔗 Chainlink oracle

We use Chainlink’s ETH/USD price feed to determine the USD equivalent of incoming ETH:
require(msg.value.ethToUsd() >= MINIMUM_USD, "Not enough funds");

🛠 Setup and Deployment

1. Clone the repo

```
   git clone https://github.com/astrohub-dev/FundMe-Smartcontract.git
   cd hardhat-fundme
```

2. Install dependencies

```bash
   yarn install
   or:
   npm install
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
   npx hardhat run scripts/deploy.ts --network sepolia
```

🧪 Interact with the Contract

Edit scripts/interact.ts to call fund() or withdraw(), then:

```bash
npx ts-node scripts/interact.ts
or:
npx hardhat run scripts/interact.ts --network sepolia
```

✅ TODO

• Add tests using Hardhat and Chai

• Add frontend (React + Ethers.js)

• Add support for other chains (Polygon, Arbitrum, etc.)

• Use Hardhat Ignition for cleaner deployment

📑Please feel free to read and write the version I deployed on etherscan https://sepolia.etherscan.io/address/0x6750a41dB18db84645B4Be8CdB62B3500cc64B8d#code

🤝 Contributing

PRs are welcome! If you find bugs or improvements, feel free to open an issue or submit a pull request.

📜 License

MIT — free to use and modify.

💬 Questions?

Feel free to reach out via GitHub or open an issue if you’re stuck!
