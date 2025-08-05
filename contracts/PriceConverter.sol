// SPDX-License-Identifier: MIT
pragma solidity 0.8.28;
import { AggregatorV3Interface } from "@chainlink/contracts/src/v0.8/shared/interfaces/AggregatorV3Interface.sol";
/**
 * @title PriceConverter Library
 * @author Ndubuisi Ugwuja
 * @notice Provides ETH to USD conversion utilities using Chainlink price feeds
 * @dev All functions are `internal` and designed to be used with `using PriceConverter for uint256`
 */
library PriceConverter {
    
    /// @notice Gets the latest ETH price in USD
    /// @dev Multiplies the Chainlink price (8 decimals) by 1e10 to scale it to 18 decimals
    /// @param priceFeed The Chainlink AggregatorV3Interface for ETH/USD
    /// @return The current ETH price in USD, scaled to 18 decimals
    function getPrice(AggregatorV3Interface priceFeed) internal view returns (uint256) {
        (, int256 answer, , , ) = priceFeed.latestRoundData();
        return uint256(answer * 1e10); // Convert from 8 to 18 decimals
    }
    /// @notice Converts a given amount of ETH to its USD equivalent
    /// @dev Relies on `getPrice()` to fetch and scale the ETH/USD rate
    /// @param ethAmount The amount of ETH to convert (in wei)
    /// @param priceFeed The Chainlink price feed for ETH/USD
    /// @return The equivalent USD value (scaled to 18 decimals)
    function ethToUsd(uint256 ethAmount, AggregatorV3Interface priceFeed) internal view returns (uint256) {
        uint256 ethPrice = getPrice(priceFeed);
        uint256 ethAmountInUsd = (ethPrice * ethAmount) / 1e18;
        return ethAmountInUsd;
    }
}