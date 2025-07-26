// SPDX-License-Identifier: MIT
pragma solidity 0.8.28;
import "./PriceConverter.sol";

//What this contract does:
//Sets a minimum amount of fund to be sent by user in usd
//Receives funds
//Withdraws funds by owner

contract FundMe {
    using PriceConverter for uint256;

    address[] public funders;
    mapping(address => uint256) public addressToAmountSent;

    uint256 public constant MINIMUM_USD = 50 * 1e18;
    
    address public immutable i_owner;
    //Once we deploy our contract, the constructor function is called immidiately
    //to install the contract deployer as the owner
    
    constructor() {
        i_owner = msg.sender;
    }

    function fund() public payable {
        //set minimum amount of funds to be sent
        require(msg.value.ethToUsd() >= MINIMUM_USD, "Not enough funds");
        funders.push(msg.sender);
        addressToAmountSent[msg.sender] = msg.value;
    }

    function withdraw() public onlyOwner {
        payable(i_owner).transfer(address(this).balance);
    }

    modifier onlyOwner {
        require(msg.sender == i_owner, "Kpele! You are not allowed to withdraw what's not yours");
        _;
    }

    //Direct fund transfers to the contract address call fund()
    receive() external payable { 
        fund();
    }

    //This handles any form of interaction not specified by us to call fund()
    fallback() external payable { 
        fund();
    }
}