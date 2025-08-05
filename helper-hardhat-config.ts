export const networkConfig = {
    11155111: {
        name: "sepolia",
        ethUsdPriceFeed: "0x694AA1769357215DE4FAC081bf1f309aDC325306", // ETH/USD Sepolia
        blockConfirmations: 6,
    },
    137: {
        name: "polygon",
        ethUsdPriceFeed: "0xab594600376ec9fd91f8e885dadf0ce036862de0", // MATIC/USD
    },
    56: {
        name: "bsc",
        ethUsdPriceFeed: "0x0567F2323251f0Aab15c8DfB1967E4e8A7D42aeE", // BNB/USD
    },
    43114: {
        name: "avalanche",
        ethUsdPriceFeed: "0x0A77230d17318075983913bC2145DB16C7366156", // AVAX/USD
    },
    31337: {
        name: "localhost",
    },
};
export const developmentChains = ["hardhat", "localhost"];
export const DECIMALS = 8;
export const INITIAL_ANSWER = 200000000000;
