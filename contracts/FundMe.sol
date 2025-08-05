// SPDX-License-Identifier: MIT
pragma solidity 0.8.28;
import { PriceConverter } from "./PriceConverter.sol";
import { AggregatorV3Interface } from "@chainlink/contracts/src/v0.8/shared/interfaces/AggregatorV3Interface.sol";

/// @notice Error for when a non-owner tries to withdraw
error FundMe__NotOwner();

/// @notice Error for when value to be sent is less than MINIMUM_USD worth of ETH
error FundMe__InsufficienETH();

/**
 * @title A contract for crowdfunding using ETH/USD price feeds
 * @author Ndubuisi Ugwuja
 * @notice This contract is to demo a sample funding contract with a minimum USD value enforced
 * @dev Uses chainlink price feed for conversion
 */
contract FundMe {
    using PriceConverter for uint256;

    /// @notice List of all funders who have contributed
    address[] public funders;

    /// @notice Tracks the amount each address has sent to the contract
    mapping(address => uint256) public addressToAmountSent;

    /// @notice Minimum contribution allowed in USD (scaled to 18 decimals)
    uint256 public constant MINIMUM_USD = 50 * 1e18;
    
    /// @notice Owner of the contract (set at deployment)
    address public immutable OWNER;

    /// @notice Aggregator price feed used for ETH/USD conversion
    AggregatorV3Interface public priceFeed;

    /// @notice Constructor sets the contract owner and initializes the price feed
    /// @param priceFeedAddress The address of the Chainlink ETH/USD price feed
    constructor(address priceFeedAddress) {
        OWNER = msg.sender;
        priceFeed = AggregatorV3Interface(priceFeedAddress);
    }

    /// @notice Handles plain ETH transfers with empty calldata
    receive() external payable { 
        fund();
    }

    /// @notice Handles ETH transfers with unknown function selectors or non-empty calldata
    fallback() external payable { 
        fund();
    }

    /// @notice Contribute ETH to the contract
    /// @dev Requires value to be at least MINIMUM_USD worth of ETH
    function fund() public payable {
        if (msg.value.ethToUsd(priceFeed) < MINIMUM_USD) {
            revert FundMe__InsufficienETH();
        }
        funders.push(msg.sender);
        addressToAmountSent[msg.sender] += msg.value;
    }

    /// @notice Withdraws all funds to the owner's address
    /// @dev Only callable by the contract owner
    function withdraw() public onlyOwner {
        payable(OWNER).transfer(address(this).balance);
    }

      /// @notice Restricts function access to only the contract owner
    modifier onlyOwner {
        if (msg.sender != OWNER) revert FundMe__NotOwner();
        _;
    }
}