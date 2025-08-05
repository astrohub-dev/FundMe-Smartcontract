import { buildModule } from "@nomicfoundation/hardhat-ignition/modules";
import { network } from "hardhat";
import {
    developmentChains,
    networkConfig,
    DECIMALS,
    INITIAL_ANSWER,
} from "../../helper-hardhat-config";
const FundMeModule = buildModule("FundMeModule", (m) => {
    const chainId = network.config.chainId!;
    let priceFeedAddress: any;
    if (developmentChains.includes(network.name)) {
        const mockV3Aggregator = m.contract("MockV3Aggregator", [
            DECIMALS,
            INITIAL_ANSWER,
        ]);
        priceFeedAddress = mockV3Aggregator;
    } else {
        priceFeedAddress = networkConfig[chainId]?.ethUsdPriceFeed;
        if (!priceFeedAddress) {
            throw new Error(
                `No ETH/USD price feed found for chain ID ${chainId}`
            );
        }
    }
    const fundMe = m.contract("FundMe", [priceFeedAddress]);
    return { fundMe };
});
export default FundMeModule;
