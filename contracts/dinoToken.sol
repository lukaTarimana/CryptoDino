// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

import "@openzeppelin/contracts/token/ERC20/ERC20.sol";

abstract contract DinoToken is ERC20 {
     address public minter;
    constructor(uint256 initialSupply) ERC20("DinoToken", "DT") {
        minter = msg.sender;
        _mint(msg.sender, initialSupply);
    }
}